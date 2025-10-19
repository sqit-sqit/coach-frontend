"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import WorkshopLayout from "../../components/layouts/WorkshopLayout";
import { Star, Target, Heart, Users, ArrowRight } from "lucide-react";
import BodygraphWrapper from "../../components/BodygraphWrapper";

function TestContent() {
  const router = useRouter();

  // Przykładowe dane Human Design - identyczne jak w prawdziwej sesji
  const sessionData = {
    session_id: "test-session-123",
    user_id: "test-user-123",
    name: "Jan Kowalski",
    birth_date: "1969-08-12T14:10:00",
    birth_time: "14:10",
    birth_place: "Gdynia, Poland",
    birth_lat: 54.5189,
    birth_lng: 18.5305,
    zodiac_system: "tropical",
    calculation_method: "degrees",
    type: "Projector",
    strategy: "Wait for the Invitation",
    authority: "Splenic Authority",
    profile: "1/3",
    sun_gate: 20,
    earth_gate: 34,
    moon_gate: 57,
    north_node_gate: 11,
    south_node_gate: 12,
    defined_centers: ["Head", "Ajna", "Throat", "G", "Sacral", "Root"],
    undefined_centers: ["Ego", "Solar Plexus", "Spleen"],
    defined_channels: [
      "20-34", "11-56", "17-62", "23-43", "7-31", "1-8", "13-33", "15-5", "2-14", "29-46"
    ],
    active_gates: [20, 34, 11, 56, 17, 62, 23, 43, 7, 31, 1, 8, 13, 33, 15, 5, 2, 14, 29, 46],
    activations: [
      // Design (czerwone)
      { side: "Design", planet: "Sun", gate: 20, line: 2 },
      { side: "Design", planet: "Earth", gate: 34, line: 4 },
      { side: "Design", planet: "Moon", gate: 57, line: 6 },
      { side: "Design", planet: "North Node", gate: 11, line: 1 },
      { side: "Design", planet: "South Node", gate: 12, line: 2 },
      { side: "Design", planet: "Mercury", gate: 17, line: 3 },
      { side: "Design", planet: "Venus", gate: 62, line: 4 },
      { side: "Design", planet: "Mars", gate: 23, line: 5 },
      { side: "Design", planet: "Jupiter", gate: 43, line: 6 },
      { side: "Design", planet: "Saturn", gate: 7, line: 1 },
      { side: "Design", planet: "Uranus", gate: 31, line: 2 },
      { side: "Design", planet: "Neptune", gate: 1, line: 3 },
      { side: "Design", planet: "Pluto", gate: 8, line: 4 },
      
      // Personality (czarne)
      { side: "Personality", planet: "Sun", gate: 20, line: 2 },
      { side: "Personality", planet: "Earth", gate: 34, line: 4 },
      { side: "Personality", planet: "Moon", gate: 57, line: 6 },
      { side: "Personality", planet: "North Node", gate: 11, line: 1 },
      { side: "Personality", planet: "South Node", gate: 12, line: 2 },
      { side: "Personality", planet: "Mercury", gate: 17, line: 3 },
      { side: "Personality", planet: "Venus", gate: 62, line: 4 },
      { side: "Personality", planet: "Mars", gate: 23, line: 5 },
      { side: "Personality", planet: "Jupiter", gate: 43, line: 6 },
      { side: "Personality", planet: "Saturn", gate: 7, line: 1 },
      { side: "Personality", planet: "Uranus", gate: 31, line: 2 },
      { side: "Personality", planet: "Neptune", gate: 1, line: 3 },
      { side: "Personality", planet: "Pluto", gate: 8, line: 4 }
    ]
  };

  const handleStartChat = () => {
    alert("To jest strona testowa - funkcja chat nie jest dostępna");
  };

  const handleGenerateSummary = () => {
    alert("To jest strona testowa - funkcja podsumowania nie jest dostępna");
  };

  return (
    <WorkshopLayout width="default" background="gray">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🧪 Test Human Design
          </h1>
          <p className="text-gray-600">
            Strona testowa z przykładowymi danymi - bez połączenia z backendem
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
            <div className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-lg">
              🧪 Strona testowa
            </div>
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

        {/* Test Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">🧪 Informacje o teście</h2>
          <p className="text-yellow-700 text-sm">
            To jest strona testowa z przykładowymi danymi Human Design. 
            Sprawdź jak bodygraph wygląda na komórce bez połączenia z backendem.
          </p>
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

export default function TestPage() {
  return (
    <Suspense fallback={
      <WorkshopLayout width="default" background="gray">
        <div className="max-w-4xl mx-auto text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie...</p>
        </div>
      </WorkshopLayout>
    }>
      <TestContent />
    </Suspense>
  );
}
