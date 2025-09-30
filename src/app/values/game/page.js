"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const userId = "demo-user-123";

export default function ValuesGamePage() {
  const [round, setRound] = useState([]);
  const [winners, setWinners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [finalValue, setFinalValue] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function fetchValues() {
      try {
        const res = await fetch(`${API_URL}/values/reduce/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch reduced values");
        const data = await res.json();
        const reduced = data?.reduced_values || [];
        setRound(reduced);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching values for game:", err);
        setLoading(false);
      }
    }
    fetchValues();
  }, []);

  const handleChoice = (choice) => {
    const updatedWinners = [...winners, choice];

    // Check if we're at the last pair or single value of the round
    if (currentIndex + 2 >= round.length) {
      // End of round
      let nextRound = [...updatedWinners];

      // If there's an odd number of values and we haven't processed the last one yet
      if (round.length % 2 === 1 && currentIndex + 1 < round.length) {
        nextRound.push(round[round.length - 1]);
      }

      if (nextRound.length === 1) {
        setFinalValue(nextRound[0]);
      } else {
        setRound(nextRound);
        setWinners([]);
        setCurrentIndex(0);
      }
    } else {
      // Continue with current round
      setWinners(updatedWinners);
      setCurrentIndex(currentIndex + 2);
    }
  };

  if (loading) {
    return <p className="text-center mt-20">Loading values…</p>;
  }

  if (finalValue) {
    return (
      <div className="max-w-2xl mx-auto text-center mt-20 space-y-6">
        <h1 className="text-3xl font-bold">🏆 Your top value is:</h1>
        <p className="text-2xl text-brand">{finalValue}</p>
        <button
          onClick={() => router.push("/values/chat")}
          className="px-6 py-3 bg-[var(--Primary-7-main)] text-white rounded-lg shadow hover:bg-[var(--Primary-8-hover)]"
        >
          Continue →
        </button>
      </div>
    );
  }

  // Modified render logic to handle odd numbers
  const remainingPairs = round.length - currentIndex;
  if (remainingPairs === 1) {
    // Automatically move the last single value to next round
    handleChoice(round[currentIndex]);
    return null; // Prevent rendering while processing
  }

  if (remainingPairs < 2) {
    return <p className="text-center mt-20">Not enough values to play.</p>;
  }

  const left = round[currentIndex];
  const right = round[currentIndex + 1];

  return (
    <div className="max-w-2xl mx-auto text-center mt-20 space-y-10">
      <h2 className="text-xl font-bold">Which value is more important?</h2>
      <div className="grid grid-cols-2 gap-6">
        {/* Kafelek 1 */}
        <div
          onClick={() => handleChoice(left)}
          className="cursor-pointer p-6 bg-white border border-[var(--Primary-7-main)] rounded-xl shadow hover:bg-[var(--Chip-Active)] hover:scale-105 transition transform"
        >
          <p className="text-lg font-semibold text-gray-900">{left}</p>
        </div>

        {/* Kafelek 2 */}
        <div
          onClick={() => handleChoice(right)}
          className="cursor-pointer p-6 bg-white border border-[var(--Primary-7-main)] rounded-xl shadow hover:bg-[var(--Chip-Active)] hover:scale-105 transition transform"
        >
          <p className="text-lg font-semibold text-gray-900">{right}</p>
        </div>
      </div>
    </div>
  );
}
