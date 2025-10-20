"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Heading from "../../../components/ui/Heading.jsx";
import Button from "../../../components/ui/Button.jsx";
import AuthChoiceModal from "../../../components/AuthChoiceModal";
import { useAuth } from "../../../hooks/useAuth";
import { getCurrentUserId } from "../../../lib/guestUser";

export default function SpiralInitPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [userId, setUserId] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Use authenticated user ID or create/get guest ID
  useEffect(() => {
    // Always try to get/create user ID, don't wait for auth
    const id = getCurrentUserId(user?.user_id);
    setUserId(id);
    
    // If no user ID was created, show auth modal
    if (!id) {
      setShowAuthModal(true);
    }
  }, [user]);
  
  // Handlers dla modal
  const handleContinueAsGuest = () => {
    const id = getCurrentUserId(null);
    setUserId(id);
    setShowAuthModal(false);
  };
  
  const handleSignIn = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/google`;
  };

  const handleStartSpiral = () => {
    if (userId) {
      router.push(`/spiral/chat?user_id=${userId}`);
    }
  };

  // Show auth modal if no user ID
  if (!userId) {
    return (
      <>
        <div className="text-center mb-12">
          <Heading level={1} className="text-4xl font-bold text-gray-900 mb-4">
            Spiral
          </Heading>
          <p className="text-xl text-gray-700 mb-8">
            Spiralna metoda autorefleksji i zrozumienia wzorców
          </p>
        </div>
        
        <AuthChoiceModal
          onContinueAsGuest={handleContinueAsGuest}
          onSignIn={handleSignIn}
        />
      </>
    );
  }

  return (
    <>
      <div className="text-center mb-12">
        <Heading level={1} className="text-4xl font-bold text-gray-900 mb-4">
          Spiral
        </Heading>
        <p className="text-xl text-gray-700 mb-8">
          Spiralna metoda autorefleksji i zrozumienia wzorców
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              Ta metoda pozwala spojrzeć na problem, wyzwanie lub emocję w sposób, 
              który nie polega na szukaniu rozwiązania „na zewnątrz", ale na zrozumieniu 
              dynamiki wewnętrznej, która ten problem tworzy.
            </p>
            
            <p className="text-gray-700 mb-6">
              Opiera się na prostym, ale bardzo skutecznym cyklu trzech pytań:
            </p>

            <div className="bg-purple-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-purple-900 mb-4">🔄 Cykl trzech pytań:</h3>
              <ol className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="bg-purple-100 text-purple-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                  <span><strong>Kim jestem, skoro mam ten problem?</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="bg-purple-100 text-purple-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                  <span><strong>Skoro jestem tym, to co robię?</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="bg-purple-100 text-purple-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                  <span><strong>Skoro to robię, to co mam?</strong></span>
                </li>
              </ol>
            </div>

            <div className="bg-indigo-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-indigo-900 mb-4">🔄 Jak to działa</h3>
              <p className="text-gray-700 mb-4">
                Po udzieleniu odpowiedzi na trzecie pytanie, wracasz do pierwszego, z nową perspektywą:
              </p>
              <p className="text-gray-700 font-medium mb-4">
                <strong>Skoro to mam, to kim teraz jestem?</strong>
              </p>
              <p className="text-gray-700">
                W ten sposób zaczynasz drugi krąg refleksji. Każdy kolejny cykl prowadzi Cię głębiej — 
                od powierzchownych warstw myślenia i działania, ku bardziej subtelnym aspektom tożsamości, 
                przekonań i emocji.
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-green-900 mb-4">🌿 Dlaczego to działa</h3>
              <p className="text-gray-700 mb-4">
                Ta metoda nie rozwiązuje problemu logicznie, lecz zmienia poziom świadomości, 
                z którego go postrzegasz. Zamiast walczyć z tym, co się dzieje, zaczynasz widzieć 
                siebie w relacji do problemu — jaką rolę przyjmujesz, jakie działania z niej wynikają 
                i jakie rezultaty one przynoszą.
              </p>
              <p className="text-gray-700">
                Z czasem odkrywasz, że źródłem zmiany nie jest nowe działanie, lecz zmiana w sposobie bycia – 
                w tym, z jakiego „ja" patrzysz na sytuację.
              </p>
            </div>

            <div className="bg-yellow-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-yellow-900 mb-4">💫 Przykład</h3>
              <div className="text-gray-700 space-y-3">
                <p><strong>Mam poczucie, że nikt mnie nie słucha.</strong></p>
                <p><strong>Kim jestem, skoro nikt mnie nie słucha?</strong> – Jestem kimś, kto nie ma głosu.</p>
                <p><strong>Skoro jestem kimś, kto nie ma głosu, to co robię?</strong> – Wycofuję się i mówię cicho.</p>
                <p><strong>Skoro wycofuję się i mówię cicho, to co mam?</strong> – Mam wrażenie, że inni mnie ignorują.</p>
                <p><strong>Skoro inni mnie ignorują, to kim jestem?</strong> – Jestem kimś nieważnym.</p>
                <p className="text-sm text-gray-600 italic">
                  …i tak dalej, aż pojawi się nowy wgląd, np. „Jestem kimś, kto nie daje sobie prawa, 
                  by być słyszanym". Ten moment wglądu jest punktem przełomu — przestrzenią, 
                  w której problem zaczyna się rozpuszczać.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">🪶 Jak z tego korzystać</h3>
              <p className="text-gray-700">
                Nie ma jednej „poprawnej" liczby cykli — pozwól, by proces toczył się naturalnie. 
                Zwykle po 3–5 rundach pojawia się zmiana jakości percepcji: problem traci emocjonalny ciężar, 
                a Ty widzisz siebie z nowej perspektywy.
              </p>
            </div>
          </div>
        </div>

      <div className="flex justify-center">
        <Button 
          text="Start" 
          onClick={handleStartSpiral}
          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg"
        />
      </div>
    </>
  );
}
