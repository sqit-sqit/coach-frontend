"use client";
import { useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Cześć 👋 Jak mogę Ci pomóc?" },
  ]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input.trim()) return;

    // dodaj wiadomość użytkownika
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      setMessages([
        ...newMessages,
        { role: "assistant", content: data.reply || "Brak odpowiedzi 🤔" },
      ]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "⚠️ Błąd połączenia z AI." },
      ]);
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Historia wiadomości */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl max-w-md ${
              msg.role === "user"
                ? "ml-auto bg-blue-500 text-white"
                : "mr-auto bg-gray-200"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      {/* Pole do wpisywania */}
      <div className="p-4 bg-white flex gap-2 border-t">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded-xl px-4 py-2"
          placeholder="Napisz wiadomość..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded-xl"
        >
          Wyślij
        </button>
      </div>
    </div>
  );
}
