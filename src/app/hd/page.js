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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Human Design
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Odkryj swoją unikalną naturę i sposób funkcjonowania w świecie
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Co to jest Human Design?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Star className="w-5 h-5 mr-2 text-purple-600" />
                Twoja mapa energetyczna
              </h3>
              <p className="text-gray-600">
                Human Design to system, który łączy astrologię, I Ching i chakry, 
                aby pomóc Ci zrozumieć swoją naturę i talenty.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-600" />
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
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Twój typ</h3>
              <p className="text-gray-600 text-sm">
                Generator, Manifestor, Projector lub Reflector
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Strategia</h3>
              <p className="text-gray-600 text-sm">
                Jak podejmować decyzje zgodnie z Twoją naturą
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-green-600" />
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
            className="bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-700 transition"
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
