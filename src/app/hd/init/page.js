"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";
import { getOrCreateGuestId } from "../../../lib/guestUser";
import WorkshopLayout from "../../../components/layouts/WorkshopLayout";
import CityAutocomplete from "../../../components/CityAutocomplete";

function HDInitContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    birthTime: "",
    birthPlace: "",
    birthLat: "",
    birthLng: "",
    zodiacSystem: "tropical", // "tropical" or "sidereal"
    calculationMethod: "degrees" // "days" or "degrees"
  });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRegenerateMode, setIsRegenerateMode] = useState(false);
  const [existingSessionId, setExistingSessionId] = useState(null);
  const [loadingSession, setLoadingSession] = useState(false);

  // Get user ID (authenticated or guest)
  const userId = user?.user_id || getOrCreateGuestId();

  // Check if this is regenerate mode
  useEffect(() => {
    const regenerateSessionId = searchParams.get('regenerate');
    if (regenerateSessionId) {
      setIsRegenerateMode(true);
      setExistingSessionId(regenerateSessionId);
      // Load existing session data
      loadExistingSession(regenerateSessionId);
    }
  }, [searchParams]);

  const loadExistingSession = async (sessionId) => {
    setLoadingSession(true);
    setError("");
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      console.log(`Loading session data for: ${sessionId}`);
      
      // Add cache-busting parameter to ensure fresh data
      const response = await fetch(`${API_URL}/hd/chart/${sessionId}?t=${Date.now()}`, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      if (response.ok) {
        const sessionData = await response.json();
        console.log("Loaded session data:", sessionData);
        console.log("Zodiac system:", sessionData.zodiac_system);
        console.log("Calculation method:", sessionData.calculation_method);
        console.log("Name:", sessionData.name);
        console.log("Birth date:", sessionData.birth_date);
        console.log("Birth place:", sessionData.birth_place);
        
        setFormData({
          name: sessionData.name || "",
          birthDate: sessionData.birth_date ? sessionData.birth_date.split('T')[0] : "",
          birthTime: sessionData.birth_time || "",
          birthPlace: sessionData.birth_place || "",
          birthLat: "",
          birthLng: "",
          zodiacSystem: sessionData.zodiac_system || "tropical",
          calculationMethod: sessionData.calculation_method || "degrees"
        });
        
        // Set selected location if we have coordinates
        if (sessionData.birth_place) {
          setSelectedLocation({
            place: sessionData.birth_place,
            lat: sessionData.birth_lat || 52.2297, // fallback to Warsaw
            lng: sessionData.birth_lng || 21.0122
          });
          // Also update formData.birthPlace to show in the input field
          setFormData(prev => ({
            ...prev,
            birthPlace: sessionData.birth_place
          }));
        }
      } else {
        console.error("Failed to load session, status:", response.status);
        setError("Nie udało się załadować danych sesji. Spróbuj ponownie.");
      }
    } catch (err) {
      console.error("Error loading existing session:", err);
      setError("Błąd podczas ładowania danych sesji.");
    } finally {
      setLoadingSession(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      // Use selected location coordinates or fallback to mock coordinates
      const lat = selectedLocation?.lat || 52.2297;
      const lng = selectedLocation?.lng || 21.0122;
      
      // Convert date string to ISO format for backend
      const birthDateISO = new Date(formData.birthDate).toISOString();
      
      // Choose endpoint based on mode
      const endpoint = isRegenerateMode 
        ? `${API_URL}/hd/chart/${existingSessionId}/regenerate`
        : `${API_URL}/hd/calculate`;
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          name: formData.name,
          birth_date: birthDateISO,
          birth_time: formData.birthTime,
          birth_place: formData.birthPlace,
          birth_lat: lat,
          birth_lng: lng,
          zodiac_system: formData.zodiacSystem,
          calculation_method: formData.calculationMethod
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend error:", errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("HD Chart calculated:", data);
      console.log("Navigating to session:", data.session_id);
      console.log("Current URL before redirect:", window.location.href);
      
      // Navigate to chart page with cache-busting
      const timestamp = Date.now();
      const newUrl = `/hd/chart?session_id=${data.session_id}&t=${timestamp}`;
      console.log("Redirecting to:", newUrl);
      
      // Use window.location.href for hard redirect to ensure new page load
      window.location.href = newUrl;
    } catch (err) {
      console.error("Error calculating HD chart:", err);
      setError("Nie udało się obliczyć Twojego Human Design. Sprawdź dane i spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <WorkshopLayout width="default" background="gray">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {isRegenerateMode ? "🔄 Wygeneruj jeszcze raz" : "Twoje dane urodzenia"}
          </h1>
          <p className="text-gray-600">
            {isRegenerateMode 
              ? (loadingSession ? "Ładowanie danych sesji..." : "Zmień parametry systemu obliczeń, aby zobaczyć różne wyniki")
              : "Podaj dokładne dane urodzenia, aby obliczyć Twój Human Design"
            }
          </p>
          {loadingSession && (
            <div className="mt-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className={`bg-white rounded-lg shadow-lg p-8 ${loadingSession ? 'opacity-50 pointer-events-none' : ''}`}>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imię i nazwisko *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="np. Jan Kowalski"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data urodzenia *
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Godzina urodzenia *
                </label>
                <input
                  type="time"
                  value={formData.birthTime}
                  onChange={(e) => setFormData({...formData, birthTime: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Jeśli nie znasz dokładnej godziny, użyj 12:00
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Miejsce urodzenia *
              </label>
              <CityAutocomplete
                value={formData.birthPlace}
                onChange={(value) => setFormData({...formData, birthPlace: value})}
                onSelect={(location) => {
                  setSelectedLocation(location);
                  setFormData({...formData, birthPlace: location.place});
                }}
                placeholder="np. Warszawa, Polska"
                className="w-full"
              />
              {selectedLocation && (
                <div className="mt-2 text-xs text-green-600 flex items-center">
                  <span className="mr-1">✓</span>
                  Współrzędne: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                </div>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900 mb-2">
                💡 Wskazówka
              </h3>
              <p className="text-sm text-blue-700">
                Dokładność danych urodzenia jest kluczowa dla precyzyjnego obliczenia 
                Twojego Human Design. Jeśli nie masz dokładnej godziny, użyj 12:00.
                Wybierz miasto z podpowiedzi, aby zapewnić prawidłową geolokalizację.
              </p>
            </div>

            {/* System obliczeń */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                ⚙️ System obliczeń
              </h3>
              
              <div className="space-y-4">
                {/* Zodiak */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    System zodiaku
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="zodiacSystem"
                        value="sidereal"
                        checked={formData.zodiacSystem === "sidereal"}
                        onChange={(e) => setFormData({...formData, zodiacSystem: e.target.value})}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900">Sidereal</div>
                        <div className="text-sm text-gray-500">Rzeczywiste gwiazdy</div>
                      </div>
                    </label>
                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="zodiacSystem"
                        value="tropical"
                        checked={formData.zodiacSystem === "tropical"}
                        onChange={(e) => setFormData({...formData, zodiacSystem: e.target.value})}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900">Tropical</div>
                        <div className="text-sm text-gray-500">Zachodnia astrologia</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Metoda obliczeń */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Metoda obliczeń
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="calculationMethod"
                        value="degrees"
                        checked={formData.calculationMethod === "degrees"}
                        onChange={(e) => setFormData({...formData, calculationMethod: e.target.value})}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900">Stopnie</div>
                        <div className="text-sm text-gray-500">-88° Sun</div>
                      </div>
                    </label>
                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="calculationMethod"
                        value="days"
                        checked={formData.calculationMethod === "days"}
                        onChange={(e) => setFormData({...formData, calculationMethod: e.target.value})}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900">Dni</div>
                        <div className="text-sm text-gray-500">-88 dni</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 transition"
            >
              {loading 
                ? (isRegenerateMode ? "Regeneruję Human Design..." : "Obliczam Human Design...")
                : (isRegenerateMode ? "🔄 Wygeneruj ponownie" : "Oblicz mój Human Design")
              }
            </button>
          </div>
        </form>
      </div>
    </WorkshopLayout>
  );
}

export default function HDInitPage() {
  return (
    <Suspense fallback={
      <WorkshopLayout width="default" background="gray">
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie...</p>
        </div>
      </WorkshopLayout>
    }>
      <HDInitContent />
    </Suspense>
  );
}
