"use client";

import { useEffect, useMemo, useState, useRef, Suspense } from "react";
import { useApi } from "../../../hooks/useApi";
import { useAuth } from "../../../hooks/useAuth";
import { getCurrentUserId } from "../../../lib/guestUser";
import ChatBubble from "../../../components/ui/ChatBubble.jsx";
import { useRouter, useSearchParams } from "next/navigation";
import ChatInput from "../../../components/ui/ChatInput";
import QuickChip from "../../../components/ui/QuickChip";

function SpiralSummaryPage() {
  const { apiGet } = useApi();
  const { userId: authUserId, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [session, setSession] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      if (authLoading) return; // Wait for auth to resolve

      try {
        // Resolve current user (auth or guest)
        const currentUserId = getCurrentUserId(authUserId);

        if (!currentUserId) {
          setError("Brak użytkownika – zaloguj się lub użyj trybu gościa.");
          setLoading(false);
          return;
        }

        let currentSessionId = searchParams.get('session_id');
        let latestSession = null;

        if (currentSessionId) {
          // If session_id is in URL, try to fetch that specific session
          const sessionRes = await apiGet(`/spiral/sessions/${currentSessionId}`);
          if (!sessionRes.ok) {
            throw new Error(`Nie znaleziono sesji o ID: ${currentSessionId}`);
          }
          const sessionData = await sessionRes.json();
          latestSession = sessionData.session;
          setMessages(sessionData.messages || []);
        } else {
          // Otherwise, fetch the latest session for the user
          const listRes = await apiGet(`/spiral/sessions/user/${currentUserId}`);
          const listJson = await listRes.json();
          const sessions = listJson.sessions || [];
          if (sessions.length === 0) {
            setError("Brak sesji Spiral do podsumowania.");
            setLoading(false);
            return;
          }
          latestSession = sessions[0];
          // Fetch full details for the latest session
          const detRes = await apiGet(`/spiral/sessions/${latestSession.session_id}`);
          const detJson = await detRes.json();
          setMessages(detJson.messages || []);
        }
        
        setSession(latestSession);
        setLoading(false);
      } catch (e) {
        setError(e.message || "Nie udało się pobrać danych.");
        setLoading(false);
      }
    };

    fetchData();
  }, [apiGet, authUserId, authLoading]);

  // Auto-scroll only when there are multiple messages (not on initial load)
  useEffect(() => {
    if (messages.length > 1 && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  const [recapMessage, setRecapMessage] = useState("");

  const handleSendNote = (note) => {
    if (!note.trim()) return;

    const newNote = {
      role: 'user',
      content: note,
      created_at: new Date().toISOString(),
      id: `local-note-${Date.now()}`
    };
    
    setMessages(prevMessages => [...prevMessages, newNote]);
  };

  // Generate summary using backend
  useEffect(() => {
    const generateSummary = async () => {
      if (!session || !messages) return;

      const userMsgs = (messages || []).filter((m) => m.role === "user" && m.content && m.content.trim().length > 0);
      
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${API_URL}/spiral/summary/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: session.session_id,
            initial_problem: session.initial_problem,
            user_messages: userMsgs.map(m => m.content)
          })
        });

        if (response.ok) {
          const data = await response.json();
          setRecapMessage(data.summary);
        } else {
          // Fallback to simple summary
          const intro = `Podsumowanie Twojej sesji Spiral${session.initial_problem ? ` dotyczącej: "${session.initial_problem}"` : ""}.`;
          if (userMsgs.length === 0) {
            setRecapMessage(`${intro}\n\nW tej sesji nie zapisano odpowiedzi użytkownika. Jeśli chcesz, wróć do czatu i dodaj kilka odpowiedzi, a tutaj pojawi się zwięzłe podsumowanie.`);
          } else {
            const bullets = userMsgs.map((m, idx) => `${idx + 1}. ${m.content}`).join("\n");
            setRecapMessage(`${intro}\n\nNajważniejsze wypowiedzi, które pojawiły się podczas procesu:\n${bullets}\n\nZachęta: Zauważ, jak poszczególne odpowiedzi wpływają na kolejne kroki (Kim jestem → Co robię → Co mam), tworząc spiralę pogłębiania wglądów.`);
          }
        }
      } catch (error) {
        console.error("Error generating summary:", error);
        // Fallback to simple summary
        const intro = `Podsumowanie Twojej sesji Spiral${session.initial_problem ? ` dotyczącej: "${session.initial_problem}"` : ""}.`;
        if (userMsgs.length === 0) {
          setRecapMessage(`${intro}\n\nW tej sesji nie zapisano odpowiedzi użytkownika. Jeśli chcesz, wróć do czatu i dodaj kilka odpowiedzi, a tutaj pojawi się zwięzłe podsumowanie.`);
        } else {
          const bullets = userMsgs.map((m, idx) => `${idx + 1}. ${m.content}`).join("\n");
          setRecapMessage(`${intro}\n\nNajważniejsze wypowiedzi, które pojawiły się podczas procesu:\n${bullets}\n\nZachęta: Zauważ, jak poszczególne odpowiedzi wpływają na kolejne kroki (Kim jestem → Co robię → Co mam), tworząc spiralę pogłębiania wglądów.`);
        }
      }
    };

    generateSummary();
  }, [session?.session_id, messages.length]);

  if (loading) {
    return <div className="py-8 text-gray-600">Ładowanie…</div>;
  }

  if (error) {
    return <div className="py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-16rem)]">
      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-6 pt-16 pb-20">
          {/* Wiadomości */}
          <div className="space-y-6">
            {/* Wiadomość AI z podsumowaniem */}
            <ChatBubble role="assistant">
              {recapMessage}
            </ChatBubble>

            {/* Ostatnie kluczowe wiadomości z sesji (tylko odpowiedzi użytkownika) */}
            {(messages || [])
              .filter((m) => m.role === "user" && m.content && m.content.trim().length > 0)
              .slice(-6)
              .map((m) => (
                <ChatBubble key={m.id} role={m.role}>
                  {m.content}
                </ChatBubble>
              ))}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
      {/* Input area */}
      <div className="bg-gray-50 sticky bottom-0 mt-4 pb-4">
        <div className="flex justify-end mb-2 space-x-2">
            <QuickChip label="Zostaw feedback" onClick={() => router.push(`/feedback?module=spiral&session_id=${session?.session_id}`)} />
            <QuickChip label="Kończę na dziś" onClick={() => router.push('/dashboard')} />
        </div>
        <ChatInput onSend={handleSendNote} disabled={false} placeholder="Miejsce na Twoje notatki..." />
      </div>
    </div>
  );
}

function SpiralSummaryPageContent() {
  return (
    <Suspense fallback={<div className="py-8 text-gray-600">Ładowanie…</div>}>
      <SpiralSummaryPage />
    </Suspense>
  );
}

export default SpiralSummaryPageContent;
