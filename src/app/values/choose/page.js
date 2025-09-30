"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "components/ui/Button";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ValuesChoosePage() {
  const [reducedValues, setReducedValues] = useState([]);
  const [chosenValue, setChosenValue] = useState(null);
  const router = useRouter();
  const userId = "demo-user-123";

  // 🔹 Pobierz wartości z fazy REDUCE
  useEffect(() => {
    async function fetchReducedValues() {
      try {
        const res = await fetch(`${API_URL}/values/reduce/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch reduced values");
        const data = await res.json();

        const reduced = data?.reduced_values || [];
        setReducedValues(reduced);
      } catch (err) {
        console.error("Error fetching reduced values:", err);
      }
    }
    fetchReducedValues();
  }, []);

  const saveChosenValue = async () => {
    try {
      const res = await fetch(`${API_URL}/values/choose`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          chosen_value: chosenValue,
        }),
      });

      if (!res.ok) throw new Error("Failed to save chosen value");

      const data = await res.json();
      console.log("Chosen value saved:", data);

      router.push("/values/chat"); // kolejny etap
    } catch (err) {
      console.error("Error saving chosen value:", err);
      alert("Could not save chosen value. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 text-center relative space-y-12">
      {/* Back button */}
      <div className="absolute top-4 left-4">
        <button
          onClick={() => router.push("/values/reduce")}
          className="text-gray-600 hover:underline"
        >
          ← Back
        </button>
      </div>

      {/* Lista 10 wartości */}
      <h2 className="text-xl font-bold text-gray-900 mt-12">
        Here are your 10 most important values:
      </h2>
      <div className="flex flex-wrap gap-2 justify-center">
        {reducedValues.map((value, index) => (
          <button
            key={index}
            onClick={() => setChosenValue(value)}
            className={`px-4 py-2 rounded-full border border-[var(--Primary-7-main)] transition ${
              chosenValue === value
                ? "bg-[var(--Chip-Active)] text-gray-900"
                : "bg-white text-gray-700"
            }`}
          >
            {value}
          </button>
        ))}
      </div>

      {/* Sekcja wyboru */}
      <div className="space-y-4 mt-10">
        <h2 className="text-xl font-bold text-gray-900">
          Now you should choose your one most important value
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          You can either play a short game that helps you decide, or just pick
          the one you already know is the most important.
        </p>

        <div className="flex justify-center gap-4 mt-6">
          <Button
            text="Play a game"
            onClick={() => router.push("/values/game")}
          />
          <Button
            text="✨ I know the one"
            onClick={saveChosenValue}
            disabled={!chosenValue}
          />
        </div>
      </div>
    </div>
  );
}
