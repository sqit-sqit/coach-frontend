"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";
import { getOrCreateGuestId } from "../../../lib/guestUser";
import WorkshopLayout from "../../../components/layouts/WorkshopLayout";
import { Send, MessageSquare, ArrowRight } from "lucide-react";

export default function HDChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  const messagesEndRef = useRef(null);

  // Get session ID from URL
  const sessionId = searchParams.get('session_id') || '';

  useEffect(() => {
    if (sessionId) {
      fetchSessionData();
      fetchChatHistory();
    }
  }, [sessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchSessionData = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/hd/chart/${sessionId}`);
      
      if (response.ok) {
        const data = await response.json();
        setSessionData(data);
      }
    } catch (err) {
      console.error("Error fetching session data:", err);
    }
  };

  const fetchChatHistory = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/hd/chat/${sessionId}`);
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error("Error fetching chat history:", err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMessage = {
      role: "user",
      content: inputMessage,
      created_at: new Date().toISOString(),
      message_order: messages.length + 1
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/hd/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          message: inputMessage
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const aiMessage = {
        role: "assistant",
        content: data.response,
        created_at: new Date().toISOString(),
        message_order: messages.length + 2
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error("Error sending message:", err);
      const errorMessage = {
        role: "assistant",
        content: "Przepraszam, wystąpił błąd. Spróbuj ponownie.",
        created_at: new Date().toISOString(),
        message_order: messages.length + 2
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSummary = () => {
    router.push(`/hd/summary?session_id=${sessionId}`);
  };

  if (!sessionId) {
    return (
      <WorkshopLayout width="default" background="gray">
        <div className="max-w-4xl mx-auto text-center py-12">
          <div className="text-red-600 mb-4">
            <MessageSquare className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Błąd</h2>
            <p>Brak ID sesji</p>
          </div>
          <button
            onClick={() => router.push("/hd")}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
          >
            Wróć do początku
          </button>
        </div>
      </WorkshopLayout>
    );
  }

  return (
    <WorkshopLayout width="default" background="gray" showBackButton={true}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Rozmowa z AI Coach
              </h1>
              {sessionData && (
                <p className="text-gray-600">
                  Twój Human Design: <span className="font-semibold text-purple-600">{sessionData.type}</span>
                </p>
              )}
            </div>
            <button
              onClick={handleGenerateSummary}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
            >
              Podsumowanie
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Rozpocznij rozmowę z AI Coach o Twoim Human Design</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))
            )}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                    <span className="text-sm">AI pisze...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={sendMessage} className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex space-x-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Zadaj pytanie o swój Human Design..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition flex items-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </WorkshopLayout>
  );
}

