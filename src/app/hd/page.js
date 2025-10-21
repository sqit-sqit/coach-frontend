"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import AuthChoiceModal from "../../components/AuthChoiceModal";
import { Star, Users, Target, Heart } from "lucide-react";

export default function HDPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleStart = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      router.push("/hd/init");
    }
  };

  const handleSignIn = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-4xl font-bold text-gray-900 mr-3">
              Human Design
            </h1>
            <span className="bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full">
              BETA
            </span>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-2">
            Odkryj swoją unikalną naturę i sposób funkcjonowania w świecie
          </p>
          <p className="text-sm text-orange-600 font-medium">
            🧪 To jest wersja testowa aplikacji
          </p>
        </div>

        {/* Ostrzeżenie o AI */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <span className="text-amber-600 text-lg">⚠️</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-amber-800 mb-2">
                Ważne ostrzeżenie
              </h3>
              <p className="text-amber-700 leading-relaxed">
                Wszystkie opisy, znaczenia i wyjaśnienia w tej aplikacji są generowane przez sztuczną inteligencję (AI). 
                Mogą one zawierać błędy, nieścisłości lub nieprecyzyjne interpretacje. 
                <strong className="font-semibold"> Traktuj te opisy z rezerwą</strong> i nie używaj ich jako jedynego źródła 
                do podejmowania ważnych decyzji życiowych. Human Design to złożony system, który najlepiej poznawać 
                z pomocą doświadczonych nauczycieli i autentycznych źródeł.
              </p>
              <p className="text-amber-700 leading-relaxed mt-3">
                <strong className="font-semibold">Dodatkowo:</strong> Bodygraph (wykres graficzny) w tej aplikacji 
                jest również w wersji testowej i graficznie różni się od oficjalnego wykresu Human Design. 
                Używaj go wyłącznie do celów orientacyjnych.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Co to jest Human Design?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Star className="w-5 h-5 mr-2 text-brand" />
                Twoja mapa energetyczna
              </h3>
              <p className="text-gray-600">
                Human Design to system, który łączy astrologię, I Ching i chakry, 
                aby pomóc Ci zrozumieć swoją naturę i talenty.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Target className="w-5 h-5 mr-2 text-brand" />
                Praktyczne zastosowanie
              </h3>
              <p className="text-gray-600">
                Dowiedz się jak podejmować decyzje, budować relacje i 
                wykorzystywać swoje naturalne predyspozycje.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Co otrzymasz?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-brand" />
              </div>
              <h3 className="text-lg font-medium mb-2">Twój typ</h3>
              <p className="text-gray-600 text-sm">
                Generator, Manifestor, Projector lub Reflector
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-brand" />
              </div>
              <h3 className="text-lg font-medium mb-2">Strategia</h3>
              <p className="text-gray-600 text-sm">
                Jak podejmować decyzje zgodnie z Twoją naturą
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-brand" />
              </div>
              <h3 className="text-lg font-medium mb-2">Autorytet</h3>
              <p className="text-gray-600 text-sm">
                Jak rozpoznać prawdę w życiu
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleStart}
            className="bg-[#6B7DFC] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#465CFB] transition"
          >
            Rozpocznij analizę Human Design
          </button>
        </div>
      </div>

      {showAuthModal && (
        <AuthChoiceModal
          onClose={() => setShowAuthModal(false)}
          onGuestContinue={() => {
            setShowAuthModal(false);
            router.push("/hd/init");
          }}
          onSignIn={handleSignIn}
        />
      )}
    </div>
  );
}
