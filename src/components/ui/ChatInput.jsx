import { useState } from "react";
import { Mic, ArrowUp } from "lucide-react";

export default function ChatInput({ onSend, disabled = false }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || disabled) return;
    onSend(message);
    setMessage("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center w-full max-w-4xl border border-gray-300 rounded-full px-4 py-2"
    >
      <input
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={disabled}
        className="flex-grow bg-transparent outline-none text-gray-800 px-2 placeholder:text-gray-500 disabled:opacity-50"
      />
      <button type="button" className="p-2 text-gray-500 hover:text-gray-700" disabled={disabled}>
        <Mic size={20} />
      </button>
      <button
        type="submit"
        disabled={disabled || !message.trim()}
        className="p-2 ml-1 bg-[#6B7DFC] hover:bg-[#465CFB] active:bg-[#384ACE] rounded-full text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ArrowUp size={20} />
      </button>
    </form>
  );
}