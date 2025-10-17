"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import WorkshopLayout from "../../../components/layouts/WorkshopLayout";
import { Star, Download, Share2, ArrowLeft } from "lucide-react";

export default function HDSummaryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [summary, setSummary] = useState("");
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get session ID from URL
  const sessionId = searchParams.get('session_id') || '';

  useEffect(() => {
    if (sessionId) {
      fetchSessionData();
      generateSummary();
    } else {
      setError("Brak ID sesji");
      setLoading(false);
    }
  }, [sessionId]);

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

  const generateSummary = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/hd/summary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (err) {
      console.error("Error generating summary:", err);
      setError("Nie udało się wygenerować podsumowania");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const content = `
HUMAN DESIGN - PODSUMOWANIE SESJI

Imię: ${sessionData?.name || 'N/A'}
Data urodzenia: ${sessionData?.birth_date ? new Date(sessionData.birth_date).toLocaleDateString('pl-PL') : 'N/A'}
Godzina urodzenia: ${sessionData?.birth_time || 'N/A'}
Miejsce urodzenia: ${sessionData?.birth_place || 'N/A'}

TYP: ${sessionData?.type || 'N/A'}
STRATEGIA: ${sessionData?.strategy || 'N/A'}
AUTORYTET: ${sessionData?.authority || 'N/A'}
PROFIL: ${sessionData?.profile || 'N/A'}

PODSUMOWANIE:
${summary}

---
Wygenerowano: ${new Date().toLocaleDateString('pl-PL')}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `human-design-${sessionData?.name?.toLowerCase().replace(' ', '-') || 'summary'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mój Human Design',
          text: `Sprawdź mój Human Design: ${sessionData?.type}`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link skopiowany do schowka!');
    }
  };

  if (loading) {
    return (
      <WorkshopLayout width="default" background="gray">
        <div className="max-w-4xl mx-auto text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generuję podsumowanie...</p>
        </div>
      </WorkshopLayout>
    );
  }

  if (error) {
    return (
      <WorkshopLayout width="default" background="gray">
        <div className="max-w-4xl mx-auto text-center py-12">
          <div className="text-red-600 mb-4">
            <Star className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Błąd</h2>
            <p>{error}</p>
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
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Podsumowanie Human Design
            </h1>
            <div className="flex space-x-2">
              <button
                onClick={handleDownload}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Pobierz
              </button>
              <button
                onClick={handleShare}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Udostępnij
              </button>
            </div>
          </div>
          
          {sessionData && (
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Imię:</span> {sessionData.name}
              </div>
              <div>
                <span className="font-medium">Typ:</span> {sessionData.type}
              </div>
              <div>
                <span className="font-medium">Data urodzenia:</span> {new Date(sessionData.birth_date).toLocaleDateString('pl-PL')}
              </div>
              <div>
                <span className="font-medium">Strategia:</span> {sessionData.strategy}
              </div>
            </div>
          )}
        </div>

        {/* Summary Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {summary}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button
            onClick={() => router.push(`/hd/chat?session_id=${sessionId}`)}
            className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Wróć do rozmowy
          </button>
          
          <button
            onClick={() => router.push("/hd")}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center"
          >
            <Star className="w-5 h-5 mr-2" />
            Nowa analiza
          </button>
        </div>
      </div>
    </WorkshopLayout>
  );
}

