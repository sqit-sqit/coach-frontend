"use client";

import { useState, useCallback } from "react";

/**
 * Wspólny hook useChatMessages dla wszystkich aplikacji chat.
 * Obsługuje stan wiadomości, dodawanie użytkownika, placeholder assistant, aktualizację streaming.
 */
export function useChatMessages() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Dodaje wiadomość użytkownika i placeholder dla assistant
   * @param {string} userMessage - Wiadomość użytkownika
   * @returns {number} - Index placeholder assistant message
   */
  const addUserMessage = useCallback((userMessage) => {
    let assistantIndex = -1;
    
    setMessages((prev) => {
      const userMsg = { role: 'user', content: userMessage };
      const placeholderAssistant = { role: "assistant", content: "" };
      const next = [...prev, userMsg, placeholderAssistant];
      assistantIndex = next.length - 1;
      return next;
    });
    
    return assistantIndex;
  }, []);

  /**
   * Aktualizuje wiadomość assistant (dla streaming)
   * @param {string} content - Treść do dodania/ustawienia
   * @param {number} assistantIndex - Index wiadomości assistant
   * @param {boolean} append - Czy appendować (true) czy zastąpić (false)
   */
  const updateAssistantMessage = useCallback((content, assistantIndex, append = false) => {
    setMessages((prev) => {
      const updated = [...prev];
      const index = assistantIndex >= 0 ? assistantIndex : updated.length - 1;
      
      if (append) {
        const prevContent = typeof updated[index]?.content === "string" ? updated[index].content : "";
        updated[index] = { ...updated[index], content: prevContent + content };
      } else {
        updated[index] = { ...updated[index], content: content };
      }
      
      return updated;
    });
  }, []);

  /**
   * Dodaje wiadomość assistant (dla non-streaming)
   * @param {string} content - Treść wiadomości
   */
  const addAssistantMessage = useCallback((content) => {
    setMessages((prev) => [...prev, { role: "assistant", content: content }]);
  }, []);

  /**
   * Dodaje wiadomość użytkownika bez placeholder
   * @param {string} content - Treść wiadomości
   */
  const addUserMessageOnly = useCallback((content) => {
    setMessages((prev) => [...prev, { role: "user", content: content }]);
  }, []);

  /**
   * Czyści wszystkie wiadomości
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  /**
   * Ustawia historię wiadomości
   * @param {Array} history - Historia wiadomości
   */
  const setMessageHistory = useCallback((history) => {
    setMessages(history);
  }, []);

  return {
    messages,
    setMessages,
    isLoading,
    setIsLoading,
    addUserMessage,
    updateAssistantMessage,
    addAssistantMessage,
    addUserMessageOnly,
    clearMessages,
    setMessageHistory
  };
}
