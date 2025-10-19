"use client";

/**
 * Wspólny komponent TypingIndicator dla wszystkich aplikacji chat.
 * Pokazuje animowany wskaźnik podczas oczekiwania na odpowiedź AI.
 */
export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1">
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
    </div>
  );
}
