"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";
import TypingIndicator from "../../../components/ui/TypingIndicator";
import ChatBubble from "../../../components/ui/ChatBubble";
import ChatInput from "../../../components/ui/ChatInput";
import QuickChip from "../../../components/ui/QuickChip";
import { getCurrentUserId } from "../../../lib/guestUser";

export default function SpiralChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  
  // Direct state management (Values pattern)
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  
  const [userId, setUserId] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [spiralData, setSpiralData] = useState(null);
  const messagesEndRef = useRef(null);

  // Get user ID
  useEffect(() => {
    if (!authLoading) {
      const id = getCurrentUserId(user?.user_id);
      setUserId(id);
    }
  }, [user, authLoading]);

  // Create session and start chat when component mounts
  useEffect(() => {
    if (userId && !sessionId) {
      createSpiralSession();
    }
  }, [userId, sessionId]);

  // Generate first AI message when sessionId is available
  useEffect(() => {
    if (sessionId && messages.length === 0) {
      generateFirstAIMessage();
    }
  }, [sessionId]);

  // Auto-scroll to bottom when new messages arrive (skip first message to keep header visible)
  useEffect(() => {
    if (messages.length > 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const createSpiralSession = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/spiral/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: userId,
          initial_problem: null
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSessionId(data.session.session_id);
        setSpiralData(data.session);
      }
    } catch (error) {
      console.error("Error creating spiral session:", error);
    }
  };

  const generateFirstAIMessage = async () => {
    if (isStreaming || !userId || !sessionId) return;

    // Add placeholder message (overwrite messages like in Values)
    const placeholderMessage = { role: "assistant", content: "", isGenerating: true };
    setMessages([placeholderMessage]);
    setIsStreaming(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const initResponse = await fetch(`${API_URL}/spiral/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          session_id: sessionId
        })
      });

      if (initResponse.ok) {
        const initData = await initResponse.json();
        console.log("Initial AI message received:", initData.message);
        // Replace placeholder with actual message
        setMessages([{
          role: "assistant",
          content: initData.message,
          isGenerating: false,
        }]);
      } else {
        // Fallback message on error
        setMessages([{
          role: "assistant",
          content: "Witaj! Cieszę się, że tutaj jesteś. Czy jest coś konkretnego, z czym chciałbyś się zmierzyć?",
          isGenerating: false,
        }]);
      }
    } catch (error) {
      console.error("Error generating first message:", error);
      setMessages([{
        role: "assistant",
        content: "Witaj! Cieszę się, że tutaj jesteś. Czy jest coś konkretnego, z czym chciałbyś się zmierzyć?",
        isGenerating: false,
      }]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleSendMessage = async (message) => {
    if (!message.trim() || !sessionId || isStreaming) return;

    // Add user message
    const userMessage = { role: "user", content: message };
    setMessages(prev => [...prev, userMessage]);
    setIsStreaming(true);

    // Add placeholder for assistant response
    const placeholderMessage = { role: "assistant", content: "", isGenerating: true };
    setMessages(prev => [...prev, placeholderMessage]);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/spiral/chat/${sessionId}/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message, 
          history: messages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (response.ok) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedContent = "";
        let buffer = "";
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          // Decode chunk and add to buffer
          buffer += decoder.decode(value, { stream: true });
          
          // Split by newlines to process complete SSE messages
          const lines = buffer.split('\n');
          // Keep last incomplete line in buffer
          buffer = lines.pop() || "";
          
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const payload = line.slice(6); // Don't trim - spaces are part of the content!
            
            // SSE payload is just text, not JSON
            accumulatedContent += payload;
            
            // Update the last message (assistant) with accumulated content
            setMessages(prev => {
              const updated = [...prev];
              const lastIndex = updated.length - 1;
              if (updated[lastIndex]?.role === "assistant") {
                updated[lastIndex] = {
                  role: "assistant",
                  content: accumulatedContent,
                  isGenerating: false,
                };
              }
              return updated;
            });
          }
        }
      } else {
        // Error fallback
        setMessages(prev => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          if (updated[lastIndex]?.isGenerating) {
            updated[lastIndex] = {
              role: "assistant",
              content: "Przepraszam, wystąpił błąd. Spróbuj ponownie.",
              isGenerating: false,
            };
          }
          return updated;
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (updated[lastIndex]?.isGenerating) {
          updated[lastIndex] = {
            role: "assistant",
            content: "Przepraszam, wystąpił błąd. Spróbuj ponownie.",
            isGenerating: false,
          };
        }
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  if (authLoading || !userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const quickTips = [
    {
      label: "Kończę na dziś",
      onClick: () => router.push("/spiral/summary"),
    },
    {
      label: "Quick tip",
      onClick: () => handleSendMessage("Daj mi krótką wskazówkę, na co zwrócić uwagę teraz."),
    },
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-16rem)]">
      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-6 pt-16 pb-20">
          {/* Wiadomości */}
          <div className="space-y-6">
            {messages.map((message, index) => (
              <ChatBubble 
                key={index} 
                role={message.role}
              >
                {message.content && message.content.length > 0 ? (
                  message.content
                ) : message.role === "assistant" && message.isGenerating ? (
                  <TypingIndicator />
                ) : null}
              </ChatBubble>
            ))}
            {/* When loading but no placeholder exists for some reason, show indicator */}
            {isStreaming && messages.length === 0 && (
              <ChatBubble role="assistant">
                <TypingIndicator />
              </ChatBubble>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input area – sticky na dole */}
      <div className="bg-gray-50 sticky bottom-0 pb-4">
        <div className="space-y-4">
          <div className="flex gap-2 justify-end">
            {quickTips.map((tip, index) => (
              <QuickChip key={index} label={tip.label} onClick={tip.onClick} />
            ))}
          </div>
          <ChatInput onSend={handleSendMessage} disabled={isStreaming} />
        </div>
      </div>
    </div>
  );
}
