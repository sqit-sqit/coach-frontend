"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ChatBubble from "components/ui/ChatBubble";
import ChatInput from "components/ui/ChatInput";
import QuickChip from "components/ui/QuickChip";
import ValuesLayout from "components/layouts/ValuesLayout";
import { useAuth } from "hooks/useAuth";
import { useApi } from "hooks/useApi";
import jsPDF from "jspdf";

export default function ValuesChatPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { userId, apiPostStream, apiPost, apiGet } = useApi();
  const [messages, setMessages] = useState([]);
  const [chosenValue, setChosenValue] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [chatMode, setChatMode] = useState("chat"); // "chat" or "reflect"
  const [sessionSummary, setSessionSummary] = useState(null); // Store summary for PDF download

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages]);

  // 🔹 Pobierz wybraną wartość i ustaw startową wiadomość AI
  useEffect(() => {
    if (!userId) return; // Wait for user ID
    
    async function fetchChosenValue() {
      try {
        const res = await apiGet(`/values/choose/${userId}`);
        const data = await res.json();
        setChosenValue(data.chosen_value);

        setMessages([
          {
            role: "assistant",
            title: `${data.chosen_value} value workshop`,
            content: `Let's explore why "${data.chosen_value}" is important to you and how it influences your decisions. What makes this value especially meaningful to you?`,
          },
        ]);
      } catch (err) {
        console.error("Error fetching chosen value:", err);
        setMessages([
          {
            role: "assistant",
            content: "I'm having trouble loading your chosen value. Please refresh the page.",
          },
        ]);
      }
    }
    fetchChosenValue();
  }, [userId]);

  // Show loading while authenticating - AFTER all hooks
  if (isLoading || !userId) {
    return (
      <ValuesLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </ValuesLayout>
    );
  }

  const quickTips = [
    {
      label: "Quick tips",
      onClick: () => handleSendMessage("Can you give me some quick tips about working with this value?"),
    },
    {
      label: chatMode === "chat" ? "Go to the next step" : "Jump to summary",
      onClick: () => {
        console.log("Button clicked, chatMode:", chatMode);
        chatMode === "chat" ? handleJumpToSummary() : handleGenerateSummary();
      },
    },
  ];

  // 🔹 Obsługa przejścia do summary
  const handleJumpToSummary = async () => {
    console.log("handleJumpToSummary called, switching to reflect mode");
    // Przełącz tryb na "reflect"
    setChatMode("reflect");
    
    // Wyślij wiadomość z nowym trybem (handleSendMessage doda wiadomość użytkownika)
    await handleSendMessage("go to the next step", "reflect");
  };

  // 🔹 Obsługa generowania podsumowania
  const handleGenerateSummary = async () => {
    if (isStreaming || !userId) return; // Prevent concurrent requests or if no user ID

    // Dodaj wiadomość użytkownika "Jump to summary"
    const userMessage = { role: "user", content: "Jump to summary" };
    const summaryPlaceholder = { role: "assistant", content: "", isGenerating: true };
    setMessages(prev => [...prev, userMessage, summaryPlaceholder]);
    setIsStreaming(true);

    try {
      // Podziel historię na chat i reflection (bez ostatnich 2 wiadomości: "Jump to summary" i placeholder)
      const messagesForHistory = messages.slice(0, -2);
      const chatHistory = [];
      const reflectionHistory = [];
      let inReflectionPhase = false;

      for (const msg of messagesForHistory) {
        if (msg.content === "go to the next step" && msg.role === "user") {
          inReflectionPhase = true;
          continue;
        }
        
        if (inReflectionPhase) {
          reflectionHistory.push({
            role: msg.role,
            content: msg.content
          });
        } else {
          chatHistory.push({
            role: msg.role,
            content: msg.content
          });
        }
      }

      // Wywołaj endpoint generowania podsumowania
      const res = await apiPost(`/values/chat/${userId}/summary`, {
        chat_history: chatHistory,
        reflection_history: reflectionHistory
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      
      // Zastąp placeholder prawdziwym podsumowaniem
      setMessages(prev => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (updated[lastIndex]?.isGenerating) {
          updated[lastIndex] = {
            role: "assistant",
            content: data.summary,
            isSummary: true
          };
        }
        return updated;
      });

      // Zapisz podsumowanie dla PDF
      setSessionSummary(data.summary);

      // Dodaj wiadomość podziękowania z opcjami
      setTimeout(() => {
        console.log('Adding thank you message with action chips');
        setMessages(prev => [
          ...prev,
          {
            role: "assistant",
            content: "Thank you for this session. What would you like to do?",
            hasActionChips: true
          }
        ]);
      }, 1000); // Małe opóźnienie żeby podsumowanie się wyświetliło

    } catch (error) {
      console.error("Summary generation error:", error);
      setMessages(prev => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (updated[lastIndex]?.isGenerating) {
          updated[lastIndex] = {
            role: "assistant",
            content: "Sorry, I couldn't generate your summary. Please try again.",
            error: true
          };
        }
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  // 🔹 Obsługa akcji chips
  const handleActionChipClick = (action) => {
    switch (action) {
      case 'download-pdf':
        handleDownloadPDF();
        break;
      case 'retry-session':
        handleRetrySession();
        break;
      case 'finish-session':
        handleFinishSession();
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  // 🔹 Pobieranie PDF
  const handleDownloadPDF = () => {
    if (!sessionSummary) {
      alert('No summary available to download');
      return;
    }

    // Create PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // Title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Values Session Summary", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 20;

    // Selected Value
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Selected Value: ${chosenValue}`, 20, yPosition);
    yPosition += 15;

    // Date
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPosition);
    yPosition += 20;

    // Summary content
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    
    // Split summary into lines and add to PDF
    const summaryLines = doc.splitTextToSize(sessionSummary, pageWidth - 40);
    
    for (let i = 0; i < summaryLines.length; i++) {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(summaryLines[i], 20, yPosition);
      yPosition += 6;
    }

    // Footer
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - 30, pageHeight - 10);
    }

    // Download PDF
    const fileName = `values-session-${chosenValue?.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  // 🔹 Powtórzenie sesji
  const handleRetrySession = () => {
    // Przekieruj do wyboru wartości
    router.push('/values/select');
  };

  // 🔹 Zakończenie sesji
  const handleFinishSession = () => {
    // Navigate to feedback page
    router.push('/feedback');
  };

  // 🔹 Obsługa wysyłania wiadomości
  const handleSendMessage = async (message, mode = null) => {
    const currentMode = mode || chatMode;
    if (isStreaming || !userId) return; // Prevent concurrent requests or if no user ID

    // Add user message and a placeholder assistant message for streaming
    let assistantIndex = -1;
    setMessages((prev) => {
      const userMessage = { role: "user", content: message };
      const placeholderAssistant = { role: "assistant", content: "" };
      const next = [...prev, userMessage, placeholderAssistant];
      assistantIndex = next.length - 1;
      return next;
    });

    setIsStreaming(true);

    try {
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const res = await apiPostStream(`/values/chat/${userId}/stream`, {
        message: message,
        history: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        mode: currentMode,
      }, {
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const contentType = res.headers.get("content-type") || "";

      // Fallback to non-streaming JSON if server doesn't stream
      if (!res.body || contentType.includes("application/json")) {
        const data = await res.json();
        setMessages((prev) => {
          const updated = [...prev];
          const index = assistantIndex >= 0 ? assistantIndex : updated.length - 1;
          updated[index] = { role: "assistant", content: data.reply ?? "" };
          return updated;
        });
        setIsStreaming(false);
        return;
      }

      // Stream chunks
      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;

      while (!done) {
        const result = await reader.read();
        done = result.done;
        if (done) break;
        const chunkText = decoder.decode(result.value, { stream: true });

        // Handle potential SSE format: split by lines and ignore 'event:' lines
        const lines = chunkText.split(/\r?\n/);
        for (const line of lines) {
          if (line.length === 0) continue;
          if (line.startsWith("data:")) {
            const dataPart = line.slice(5); // do not trim - preserve leading spaces
            if (dataPart === "[DONE]") continue;
            // Append data content as-is (preserve spaces from server)
            setMessages((prev) => {
              const updated = [...prev];
              const index = assistantIndex >= 0 ? assistantIndex : updated.length - 1;
              const prevContent = typeof updated[index]?.content === "string" ? updated[index].content : "";

              updated[index] = { ...updated[index], content: prevContent + dataPart };
              return updated;
            });
          } else {
            // Raw chunk (non-SSE) - append as-is, preserving spaces
            setMessages((prev) => {
              const updated = [...prev];
              const index = assistantIndex >= 0 ? assistantIndex : updated.length - 1;
              const prevContent = typeof updated[index]?.content === "string" ? updated[index].content : "";

              updated[index] = { ...updated[index], content: prevContent + line };
              return updated;
            });
          }
        }
      }

      setIsStreaming(false);
    } catch (error) {
      console.error("Chat error:", error);
      setIsStreaming(false);
      setMessages((prev) => {
        const updated = [...prev];
        const index = assistantIndex >= 0 ? assistantIndex : updated.length - 1;
        updated[index] = {
          role: "assistant",
          content: "Sorry, I couldn't process your message. Please try again.",
          error: true,
        };
        return updated;
      });
    } finally {
      abortControllerRef.current = null;
    }
  };

  const TypingIndicator = () => (
    <div className="flex items-center gap-1">
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9FB]">
      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto">
        <ValuesLayout className="space-y-6">
          {/* Back button */}
          <button
            onClick={() => router.push("/values/choose")}
            className="flex items-center text-gray-600 mb-6"
          >
            ← Back
          </button>

          {/* Wiadomości */}
          <div className="space-y-6">
            {messages.map((message, index) => (
                <ChatBubble 
                  key={index} 
                  role={message.role} 
                  title={message.title} 
                  isSummary={message.isSummary}
                  hasActionChips={message.hasActionChips}
                  onActionChipClick={handleActionChipClick}
                >
                {message.content && message.content.length > 0 ? (
                  message.content
                ) : message.role === "assistant" && isStreaming ? (
                  <TypingIndicator />
                ) : null}
              </ChatBubble>
            ))}
            {/* When streaming but no placeholder exists for some reason, show indicator */}
            {isStreaming && messages.length === 0 && (
              <ChatBubble role="assistant">
                <TypingIndicator />
              </ChatBubble>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ValuesLayout>
      </div>

      {/* Input area – sticky na dole */}
      <div className="bg-transparent sticky bottom-0">
        <ValuesLayout className="space-y-4">
          <div className="flex gap-2 justify-end">
            {quickTips.map((tip, index) => (
              <QuickChip key={index} label={tip.label} onClick={tip.onClick} />
            ))}
          </div>
          <ChatInput onSend={handleSendMessage} disabled={isStreaming} />
        </ValuesLayout>
      </div>
    </div>
  );
}
