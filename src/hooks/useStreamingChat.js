"use client";

import { useState, useRef } from "react";

/**
 * Wspólny hook useStreamingChat dla wszystkich aplikacji chat.
 * Obsługuje streaming odpowiedzi AI z fallback do JSON.
 */
export function useStreamingChat() {
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef(null);

  /**
   * Wysyła wiadomość i obsługuje streaming odpowiedzi
   * @param {string} apiEndpoint - Endpoint API (np. '/hd/chat/{sessionId}/stream')
   * @param {string} message - Wiadomość użytkownika
   * @param {Array} history - Historia rozmowy
   * @param {Function} onMessageUpdate - Callback do aktualizacji wiadomości
   * @param {Object} additionalData - Dodatkowe dane do wysłania
   */
  const sendMessage = async (apiEndpoint, message, history, onMessageUpdate, additionalData = {}) => {
    if (isStreaming) return; // Prevent concurrent requests

    setIsStreaming(true);

    try {
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}${apiEndpoint}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream, text/plain, application/json'
        },
        body: JSON.stringify({ 
          message: message,
          history: history,
          ...additionalData
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type") || "";

      // Fallback to non-streaming JSON if server doesn't stream
      if (!response.body || contentType.includes("application/json")) {
        const data = await response.json();
        onMessageUpdate(data.response || data.reply || "");
        setIsStreaming(false);
        return;
      }

      // Stream chunks
      const reader = response.body.getReader();
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
            onMessageUpdate(dataPart, true); // true = append
          } else {
            // Raw chunk (non-SSE) - append as-is, preserving spaces
            onMessageUpdate(line, true); // true = append
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      onMessageUpdate("Przepraszam, wystąpił błąd podczas wysyłania wiadomości.", false);
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  /**
   * Anuluje aktualny streaming
   */
  const cancelStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
  };

  return {
    sendMessage,
    isStreaming,
    cancelStreaming
  };
}
