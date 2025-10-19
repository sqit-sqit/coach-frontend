"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";
import { getOrCreateGuestId } from "../../../lib/guestUser";
import ChatBubble from "../../../components/ui/ChatBubble";
import ChatInput from "../../../components/ui/ChatInput";
import QuickChip from "../../../components/ui/QuickChip";
import TypingIndicator from "../../../components/ui/TypingIndicator";
import { useStreamingChat } from "../../../hooks/useStreamingChat";
import { useChatMessages } from "../../../hooks/useChatMessages";

export default function HDChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  
  // Use shared hooks
  const { sendMessage, isStreaming } = useStreamingChat();
  const { 
    messages, 
    setMessages, 
    isLoading, 
    setIsLoading, 
    addUserMessage, 
    updateAssistantMessage 
  } = useChatMessages();
  
  const [chatSessionId, setChatSessionId] = useState(null);
  const [hdSessionId, setHdSessionId] = useState(null);
  const [hdData, setHdData] = useState(null);
  const messagesEndRef = useRef(null);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      setHdSessionId(sessionId);
      fetchHdData();
    } else {
      router.push('/hd');
    }
  }, [sessionId]);

  const fetchHdData = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/hd/chart/${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setHdData(data);
        startChatSession();
      }
    } catch (error) {
      console.error("Error fetching HD data:", error);
    }
  };

  const startChatSession = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/hd/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId })
      });

      if (response.ok) {
        const data = await response.json();
        setChatSessionId(data.chat_session_id);
        setMessages([{
          id: 'welcome',
          role: 'assistant',
          content: data.message,
          timestamp: new Date().toISOString()
        }]);
      }
    } catch (error) {
      console.error("Error starting chat session:", error);
    }
  };

  const handleSendMessage = async (message) => {
    if (!message.trim() || !chatSessionId) return;

    // Add user message and get assistant index
    const assistantIndex = addUserMessage(message);
    setIsLoading(true);

    // Create callback for updating assistant message
    const onMessageUpdate = (content, append = false) => {
      updateAssistantMessage(content, assistantIndex, append);
    };

    // Use shared streaming chat hook
    await sendMessage(
      `/hd/chat/${chatSessionId}/stream`,
      message,
      messages.map(m => ({ role: m.role, content: m.content })),
      onMessageUpdate
    );

    setIsLoading(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!hdData) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Ładowanie danych Human Design...</p>
      </div>
    );
  }

  const quickTips = [
    {
      label: "Wyjaśnij mój typ",
      onClick: () => handleSendMessage("Wyjaśnij mi mój typ Human Design i jak wpływa na moje życie")
    },
    {
      label: "Co oznaczają moje bramki",
      onClick: () => handleSendMessage("Co oznaczają moje aktywne bramki i jak je wykorzystać?")
    },
    {
      label: "Moja strategia",
      onClick: () => handleSendMessage("Jak mogę zastosować moją strategię w codziennym życiu?")
    }
  ];


  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9FB]">
      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-6 px-4 sm:px-6 lg:px-8 pt-16">
          {/* HD Data Summary */}
          {hdData && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Twoje Human Design</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div><span className="font-medium">Typ:</span> {hdData.type}</div>
                <div><span className="font-medium">Strategia:</span> {hdData.strategy}</div>
                <div><span className="font-medium">Autorytet:</span> {hdData.authority}</div>
                <div><span className="font-medium">Profil:</span> {hdData.profile}</div>
              </div>
            </div>
          )}

          {/* Wiadomości */}
          <div className="space-y-6">
            {messages.map((message, index) => (
              <ChatBubble 
                key={index} 
                role={message.role}
              >
                {message.content && message.content.length > 0 ? (
                  message.content
                ) : message.role === "assistant" && (isLoading || isStreaming) ? (
                  <TypingIndicator />
                ) : null}
              </ChatBubble>
            ))}
            {/* When loading but no placeholder exists for some reason, show indicator */}
            {(isLoading || isStreaming) && messages.length === 0 && (
              <ChatBubble role="assistant">
                <TypingIndicator />
              </ChatBubble>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input area – sticky na dole */}
      <div className="bg-transparent sticky bottom-0">
        <div className="space-y-4 px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 justify-end">
            {quickTips.map((tip, index) => (
              <QuickChip key={index} label={tip.label} onClick={tip.onClick} />
            ))}
          </div>
          <ChatInput onSend={handleSendMessage} disabled={isLoading || isStreaming} />
        </div>
      </div>
    </div>
  );
}