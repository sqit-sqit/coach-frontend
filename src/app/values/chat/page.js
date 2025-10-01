"use client";

import { useState, useEffect, useRef } from "react";
import ChatBubble from "components/ui/ChatBubble";
import ChatInput from "components/ui/ChatInput";
import QuickChip from "components/ui/QuickChip";
import ValuesLayout from "components/layouts/ValuesLayout";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const userId = "demo-user-123";

export default function ValuesChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [chosenValue, setChosenValue] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 🔹 Scroll tylko gdy dodadzą się nowe wiadomości (nie na start)
  useEffect(() => {
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages]);

  // 🔹 Pobierz wybraną wartość
  useEffect(() => {
    async function fetchChosenValue() {
      try {
        const res = await fetch(`${API_URL}/values/choose/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch chosen value");
        const data = await res.json();
        setChosenValue(data.chosen_value);

        // Pierwsza wiadomość AI na start
        setMessages([
          {
            role: "ai",
            title: `${data.chosen_value} value workshop`,
            content: `Great choice! Let's talk about why "${data.chosen_value}" is important to you.`,
          },
        ]);
      } catch (err) {
        console.error("Error fetching chosen value:", err);
      }
    }
    fetchChosenValue();
  }, []);

  const quickTips = [
    { label: "Quick tips", onClick: () => {} },
    { label: "Jump to summary", onClick: () => {} },
  ];

  const handleSendMessage = async (message) => {
    setMessages((prev) => [...prev, { role: "user", content: message }]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: `Interesting point about "${chosenValue}". Tell me more about that.`,
        },
      ]);
    }, 1000);
  };

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
                {message.content}
              </ChatBubble>
            ))}
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
          <ChatInput onSend={handleSendMessage} />
        </ValuesLayout>
      </div>
    </div>
  );
}
