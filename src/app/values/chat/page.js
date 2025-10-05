"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ChatBubble from "components/ui/ChatBubble";
import ChatInput from "components/ui/ChatInput";
import QuickChip from "components/ui/QuickChip";
import ValuesLayout from "components/layouts/ValuesLayout";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const userId = "demo-user-123";

export default function ValuesChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [chosenValue, setChosenValue] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);

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
    async function fetchChosenValue() {
      try {
        const res = await fetch(`${API_URL}/values/choose/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch chosen value");
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
  }, []);

  const quickTips = [
    {
      label: "Quick tips",
      onClick: () => handleSendMessage("Can you give me some quick tips about working with this value?"),
    },
    {
      label: "Jump to summary",
      onClick: () => handleSendMessage("Can you summarize our conversation about this value?"),
    },
  ];

  // 🔹 Obsługa wysyłania wiadomości
  const handleSendMessage = async (message) => {
    if (isStreaming) return; // Prevent concurrent requests

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

      const res = await fetch(`${API_URL}/values/chat/${userId}/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream, text/plain, application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          message: message,
          history: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
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
              <ChatBubble key={index} role={message.role} title={message.title}>
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
