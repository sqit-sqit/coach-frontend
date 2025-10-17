"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";
import { getOrCreateGuestId } from "../../../lib/guestUser";
import WorkshopLayout from "../../../components/layouts/WorkshopLayout";
import { Star, Target, Heart, Users, ArrowRight } from "lucide-react";
import BodygraphWrapper from "../../../components/BodygraphWrapper";

function HDChartContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get session ID and timestamp from URL
  const sessionId = searchParams.get('session_id') || '';
  const timestamp = searchParams.get('t') || '';

  useEffect(() => {
    if (sessionId) {
      fetchSessionData();
    } else {
      setError("Brak ID sesji");
      setLoading(false);
    }
  }, [sessionId, timestamp]); // React to timestamp changes

  // Auto-refresh when window regains focus (user returns from regenerate form)
  useEffect(() => {
    const handleFocus = () => {
      if (sessionId) {
        console.log("Window focused, refreshing session data");
        fetchSessionData();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [sessionId]);

  const fetchSessionData = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      console.log(`Fetching session data for: ${sessionId}`);
      
      // Add cache-busting parameter to ensure fresh data
      const response = await fetch(`${API_URL}/hd/chart/${sessionId}?t=${Date.now()}`, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Session data loaded:", data);
      console.log("Setting sessionData with:", {
        type: data.type,
        strategy: data.strategy,
        authority: data.authority,
        profile: data.profile,
        name: data.name,
        birth_date: data.birth_date
      });
      setSessionData(data);
    } catch (err) {
      console.error("Error fetching session data:", err);
      setError("Nie udało się załadować danych sesji");
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = () => {
    router.push(`/hd/chat?session_id=${sessionId}`);
  };

  const handleGenerateSummary = () => {
    router.push(`/hd/summary?session_id=${sessionId}`);
  };

  const handleRefreshData = () => {
    setLoading(true);
    fetchSessionData();
  };

  if (loading) {
    return (
      <WorkshopLayout width="default" background="gray">
        <div className="max-w-4xl mx-auto text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie Twojego Human Design...</p>
        </div>
      </WorkshopLayout>
    );
  }

  if (error || !sessionData) {
    return (
      <WorkshopLayout width="default" background="gray">
        <div className="max-w-4xl mx-auto text-center py-12">
          <div className="text-red-600 mb-4">
            <Star className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Błąd</h2>
            <p>{error || "Nie udało się załadować danych"}</p>
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
    <WorkshopLayout width="default" background="gray">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Twój Human Design
          </h1>
          <p className="text-gray-600">
            Oto Twoja unikalna mapa energetyczna
          </p>
        </div>

        {/* Calculation System Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-blue-600 text-sm">⚙️</span>
            </div>
            <h3 className="text-lg font-semibold text-blue-900">System obliczeń</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-blue-800">Zodiak:</span>
              <span className="ml-2 text-blue-700">
                {sessionData.zodiac_system === "sidereal" ? "Sidereal (rzeczywiste gwiazdy)" : "Tropical (zachodnia astrologia)"}
              </span>
            </div>
            <div>
              <span className="font-medium text-blue-800">Metoda:</span>
              <span className="ml-2 text-blue-700">
                {sessionData.calculation_method === "degrees" ? "Stopnie (-88° Sun)" : "Dni (-88 dni)"}
              </span>
            </div>
          </div>
        </div>

        {/* Main Results */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Type */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold">Twój typ</h2>
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {sessionData.type}
            </div>
            {console.log("Rendering type:", sessionData.type)}
            <p className="text-gray-600 text-sm">
              To jest Twój podstawowy typ energetyczny w systemie Human Design
            </p>
          </div>

          {/* Strategy */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold">Strategia</h2>
            </div>
            <div className="text-lg font-semibold text-blue-600 mb-2">
              {sessionData.strategy}
            </div>
            <p className="text-gray-600 text-sm">
              To jest sposób, w jaki powinieneś podejmować decyzje
            </p>
          </div>
        </div>

        {/* Secondary Results */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Authority */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold">Autorytet</h2>
            </div>
            <div className="text-lg font-semibold text-green-600 mb-2">
              {sessionData.authority}
            </div>
            <p className="text-gray-600 text-sm">
              To jest sposób, w jaki rozpoznajesz prawdę
            </p>
          </div>

          {/* Profile */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                <Star className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-xl font-semibold">Profil</h2>
            </div>
            <div className="text-lg font-semibold text-orange-600 mb-2">
              {sessionData.profile}
            </div>
            <p className="text-gray-600 text-sm">
              To jest Twoja linia osobowości i designu
            </p>
          </div>
        </div>

        {/* Birth Data */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Dane urodzenia</h2>
            <button
              onClick={handleRefreshData}
              className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 transition flex items-center"
              title="Odśwież dane z bazy"
            >
              🔄 Odśwież
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Imię:</span> {sessionData.name}
            </div>
            <div>
              <span className="font-medium">Data:</span> {new Date(sessionData.birth_date).toLocaleDateString('pl-PL')}
            </div>
            <div>
              <span className="font-medium">Godzina:</span> {sessionData.birth_time}
            </div>
            <div>
              <span className="font-medium">Miejsce:</span> {sessionData.birth_place}
            </div>
          </div>
        </div>

        {/* Bodygraph */}
        <div className="mb-8">
          <BodygraphWrapper sessionData={sessionData} />
        </div>

        {/* Regenerate Button */}
        <div className="mb-6">
          <button
            onClick={() => router.push(`/hd/init?regenerate=${sessionId}`)}
            className="w-full bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition flex items-center justify-center"
          >
            🔄 Wygeneruj jeszcze raz z innymi parametrami
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleStartChat}
            className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center"
          >
            Rozpocznij rozmowę z AI
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
          
          <button
            onClick={handleGenerateSummary}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center"
          >
            Wygeneruj podsumowanie
            <Star className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </WorkshopLayout>
  );
}

export default function HDChartPage() {
  return (
    <Suspense fallback={
      <WorkshopLayout width="default" background="gray">
        <div className="max-w-4xl mx-auto text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie...</p>
        </div>
      </WorkshopLayout>
    }>
      <HDChartContent />
    </Suspense>
  );
}
