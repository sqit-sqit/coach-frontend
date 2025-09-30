import Link from "next/link";
import { Star, Target, MessageSquare } from "lucide-react";

export default function DashboardPage() {
  return (
    <section>
      <h1 className="text-2xl font-bold mb-6">Twój Dashboard</h1>
      <p className="mb-4 text-gray-700">Tutaj znajdziesz swoje mini-aplikacje:</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 🔹 Warsztat wartości */}
        <Link href="/values/init">
          <div
            className="p-6 rounded-lg text-center hover:shadow-lg transition cursor-pointer"
            style={{
              background: "var(--Primary-1)",
              border: "2px solid var(--Primary-7-main)",
            }}
          >
            <Star
              className="w-10 h-10 mx-auto mb-4"
              style={{ color: "var(--Secondary-5-main)" }}
            />
            <h2 className="text-xl font-semibold mb-2">Warsztat Wartości</h2>
            <p className="text-gray-600">
              Poznaj i uporządkuj swoje wartości życiowe.
            </p>
          </div>
        </Link>

        {/* 🔹 Model GROW */}
        <div
          className="p-6 rounded-lg text-center hover:shadow-lg transition"
          style={{
            background: "var(--Primary-1)",
            border: "2px solid var(--Primary-7-main)",
          }}
        >
          <Target
            className="w-10 h-10 mx-auto mb-4"
            style={{ color: "var(--Secondary-5-main)" }}
          />
          <h2 className="text-xl font-semibold mb-2">Model GROW</h2>
          <p className="text-gray-600">
            Zdefiniuj cele i zaplanuj kroki działania.
          </p>
        </div>

        {/* 🔹 Chat */}
        <Link href="/chat">
          <div
            className="p-6 rounded-lg text-center hover:shadow-lg transition cursor-pointer"
            style={{
              background: "var(--Primary-1)",
              border: "2px solid var(--Primary-7-main)",
            }}
          >
            <MessageSquare
              className="w-10 h-10 mx-auto mb-4"
              style={{ color: "var(--Secondary-5-main)" }}
            />
            <h2 className="text-xl font-semibold mb-2">Chat</h2>
            <p className="text-gray-600">
              Rozmawiaj z AI w nowej mini-aplikacji.
            </p>
          </div>
        </Link>
      </div>
    </section>
  );
}
