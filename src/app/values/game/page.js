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
  const [history, setHistory] = useState([]); // Track previous choices
  const [progress, setProgress] = useState(0);

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
    // Save current state to history before updating
    setHistory((prev) => [...prev, { round, winners, currentIndex }]);

    const updatedWinners = [...winners, choice];

    // Update progress
    const totalPairs = Math.floor(round.length / 2);
    const currentPair = currentIndex / 2 + 1;
    setProgress((currentPair / totalPairs) * 100);

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

  const handleUndo = () => {
    if (history.length === 0) return;

    const previousState = history[history.length - 1];
    setRound(previousState.round);
    setWinners(previousState.winners);
    setCurrentIndex(previousState.currentIndex);
    setHistory((prev) => prev.slice(0, -1));

    // Update progress for previous state
    const totalPairs = Math.floor(previousState.round.length / 2);
    const currentPair = previousState.currentIndex / 2;
    setProgress((currentPair / totalPairs) * 100);
  };

  const handleRestart = () => {
    // Reset to initial state
    setWinners([]);
    setCurrentIndex(0);
    setHistory([]);
    setProgress(0);
    fetchValues(); // Re-fetch initial values
  };

  if (loading) {
    return <p className="text-center mt-20">Loading values…</p>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-200">
        <div
          className="h-full bg-[var(--Primary-7-main)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Back button */}
      <div className="p-4">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600"
        >
          ← Back
        </button>
      </div>

      {finalValue ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          <h1 className="text-3xl font-bold">🏆 Your top value is:</h1>
          <p className="text-2xl text-brand">{finalValue}</p>
          <button
            onClick={() => router.push("/values/chat")}
            className="px-6 py-3 bg-[var(--Primary-7-main)] text-white rounded-lg shadow hover:bg-[var(--Primary-8-hover)]"
          >
            Continue →
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="max-w-5xl mx-auto w-full px-4 text-center space-y-10 mt-10">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Pick one which is the more important for you.
              </h2>
              <button className="text-gray-500 text-sm flex items-center mx-auto">
                <span className="mr-1">ℹ️</span> Need help deciding?
              </button>
            </div>

            <div className="flex items-center justify-center gap-4">
              {/* Left value card */}
              <div
                onClick={() => handleChoice(round[currentIndex])}
                className="flex-1 cursor-pointer p-4 sm:p-6 bg-[var(--Background-yellow)] border border-[var(--Primary-7-main)] rounded-xl shadow hover:bg-[var(--Chip-Active)] hover:scale-105 transition transform max-w-md"
              >
                <h3 className="text-lg sm:text-xl font-bold mb-2">
                  {round[currentIndex]}
                </h3>
                <p className="text-sm text-gray-600">
                  Select the values that matter most to you as a foundation for
                  your journey.
                </p>
              </div>

              {/* OR divider */}
              <div className="text-xl font-bold px-4">OR</div>

              {/* Right value card */}
              <div
                onClick={() => handleChoice(round[currentIndex + 1])}
                className="flex-1 cursor-pointer p-4 sm:p-6 bg-[var(--Background-yellow)] border border-[var(--Primary-7-main)] rounded-xl shadow hover:bg-[var(--Chip-Active)] hover:scale-105 transition transform max-w-md"
              >
                <h3 className="text-lg sm:text-xl font-bold mb-2">
                  {round[currentIndex + 1]}
                </h3>
                <p className="text-sm text-gray-600">
                  Select the values that matter most to you as a foundation for
                  your journey.
                </p>
              </div>
            </div>

            {/* Bottom controls */}
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={handleUndo}
                disabled={history.length === 0}
                className="text-gray-600 flex items-center disabled:opacity-50"
              >
                ↺ Undo step
              </button>
              <button
                onClick={handleRestart}
                className="text-gray-600 flex items-center"
              >
                ⟲ Restart game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
