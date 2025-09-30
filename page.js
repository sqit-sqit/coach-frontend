"use client";

import { useState } from "react";

export default function ValuesInitPage() {
  const [step, setStep] = useState(1); // kontroluje aktualny ekran
  const [name, setName] = useState("");
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8000/values/init", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    setResponse(data);
    setStep(2); // przejdź do następnego ekranu
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Values Workshop – Init Phase</h1>

      {/* Ekran 1 – pytanie o imię */}
      {step === 1 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-gray-700">👉 Enter your name to begin:</p>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded-md"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Let’s Begin
          </button>
        </form>
      )}

      {/* Ekran 2 – tekst powitalny z backendu */}
      {step === 2 && response && (
        <div className="space-y-6">
          <p className="text-gray-800 whitespace-pre-line">{response.info}</p>
          <p className="text-lg font-semibold text-blue-700">
            Welcome, {response.name}! 🚀
          </p>
          <button
            onClick={() => setStep(3)}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Continue
          </button>
        </div>
      )}

      {/* Ekran 3 – dodatkowy krok */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Step 3: Reflection</h2>
          <p className="text-gray-700">
            Think about situations where your values influenced your decisions.
          </p>
          <button
            onClick={() => setStep(4)}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      )}

      {/* Ekran 4 – podsumowanie fazy init */}
      {step === 4 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Init Completed ✅</h2>
          <p className="text-gray-700">
            Great job, {name}! You’re ready to move to the next phase.
          </p>
        </div>
      )}
    </div>
  );
}
