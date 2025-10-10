"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Button from "components/ui/Button";
import { useAuth } from "hooks/useAuth";
import { useApi } from "hooks/useApi";

export default function ValuesGamePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { userId, apiGet, apiPost } = useApi();
  const [round, setRound] = useState([]);
  const [winners, setWinners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [finalValue, setFinalValue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [progress, setProgress] = useState(0);
  const [totalWinners, setTotalWinners] = useState(0);
  const [completedPairs, setCompletedPairs] = useState(0);
  const [totalPairs, setTotalPairs] = useState(0);
  const [valueDescriptions, setValueDescriptions] = useState({});
  const TOTAL_ROUNDS = 8;

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  // Load value descriptions
  useEffect(() => {
    const loadValueDescriptions = async () => {
      try {
        const response = await fetch('/values_with_descriptions.md');
        const text = await response.text();
        
        // Parse the markdown table
        const lines = text.split('\n').filter(line => line.trim() && line.includes('|'));
        const descriptions = {};
        
        lines.forEach(line => {
          const parts = line.split('|').map(part => part.trim()).filter(part => part);
          if (parts.length >= 2 && parts[0] !== '**Value**') {
            const value = parts[0].replace(/\*\*/g, '').trim();
            const description = parts[1].replace(/\*\*/g, '').trim();
            descriptions[value] = description;
          }
        });
        
        setValueDescriptions(descriptions);
      } catch (error) {
        console.error('Error loading value descriptions:', error);
      }
    };

    loadValueDescriptions();
  }, []);

  // Helper function to get description for a value
  const getValueDescription = (value) => {
    return valueDescriptions[value] || "Select the values that matter most to you as a foundation for your journey.";
  };

  // 👇 fetch values (globalnie)
  const fetchValues = async () => {
    if (!userId) return; // Wait for user ID
    
    try {
      setLoading(true);
      const res = await apiGet(`/values/reduce/${userId}`);
      const data = await res.json();
      const reduced = data?.reduced_values || [];

      // Shuffle the values array
      const shuffledValues = [...reduced].sort(() => Math.random() - 0.5);

      // Calculate total pairs needed for the tournament
      let totalPairs = 0;
      let remainingValues = shuffledValues.length;
      while (remainingValues > 1) {
        totalPairs += Math.floor(remainingValues / 2);
        remainingValues = Math.ceil(remainingValues / 2);
      }

      setRound(shuffledValues);
      setWinners([]);
      setCurrentIndex(0);
      setFinalValue(null);
      setHistory([]);
      setProgress(0);
      setCompletedPairs(0);
      setTotalPairs(totalPairs);
    } catch (err) {
      console.error("Error fetching values for game:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return; // Wait for user ID
    fetchValues();
  }, [userId]);

  // Show loading while authenticating - AFTER all hooks
  if (isLoading || !userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleChoice = (choice) => {
    setHistory((prev) => [
      ...prev,
      { round, winners, currentIndex, completedPairs },
    ]);
    const updatedWinners = [...winners, choice];
    setCompletedPairs((prev) => prev + 1);

    // Handle odd number of values
    if (round.length % 2 === 1 && currentIndex === round.length - 2) {
      updatedWinners.push(round[round.length - 1]);
    }

    if (currentIndex + 2 >= round.length - (round.length % 2 === 1 ? 1 : 0)) {
      // End of round
      if (updatedWinners.length === 1) {
        setFinalValue(updatedWinners[0]);
      } else {
        setRound(updatedWinners);
        setWinners([]);
        setCurrentIndex(0);
      }
    } else {
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
    setCompletedPairs(previousState.completedPairs);
    setHistory((prev) => prev.slice(0, -1));
    setTotalWinners((prev) => prev - 1);
  };

  const handleRestart = () => {
    fetchValues();
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const calculateProgress = () => {
    if (finalValue) return 100;
    return Math.min((completedPairs / totalPairs) * 100, 100);
  };

  if (loading) {
    return <p className="text-center mt-20">Loading values…</p>;
  }

  // 🔹 ekran końcowy z finalValue
  if (finalValue) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-200">
          <div
            className="h-full bg-[var(--Primary-7-main)] transition-all duration-300"
            style={{ width: "100%" }}
          />
        </div>

        <div className="p-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600"
          >
            ← Back
          </button>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="max-w-5xl mx-auto w-full px-4 text-center">
            <h1 className="text-2xl font-bold mb-8">Your value is:</h1>

            <div className="max-w-xl mx-auto w-full flex flex-col items-center gap-8">
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="w-full"
              >
                <div className="w-full p-6 bg-[var(--Background-yellow)] border border-[var(--Primary-7-main)] rounded-[24px] shadow">
                  <h2 className="text-2xl font-bold mb-2">{finalValue}</h2>
                  <p className="text-gray-600">
                    {getValueDescription(finalValue)}
                  </p>
                </div>
              </motion.div>

              {/* 🔹 zapis finalValue do backendu i przejście do chatu */}
              <button
                onClick={async () => {
                  if (!userId) return; // No user ID available
                  
                  try {
                    const res = await apiPost(`/values/choose`, {
                      user_id: userId,
                      chosen_value: finalValue,
                    });

                    const data = await res.json();
                    console.log("Chosen value saved from game:", data);

                    router.push("/values/chat");
                  } catch (err) {
                    console.error("Error saving chosen value from game:", err);
                    alert("Could not save chosen value. Please try again.");
                  }
                }}
                className="w-full py-4 bg-[rgb(99,102,241)] text-white rounded-[24px] font-semibold hover:opacity-90 transition-opacity"
              >
                Next →
              </button>
            </div>

            {/* Bottom controls */}
            <div className="flex justify-between items-center mt-16">
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
      </div>
    );
  }

  if (round.length < 2) {
    return <p className="text-center mt-20">Not enough values to play.</p>;
  }

  const left = round[currentIndex];
  const right = round[currentIndex + 1];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-200">
        <div
          className="h-full bg-[var(--Primary-7-main)] transition-all duration-300"
          style={{ width: `${calculateProgress()}%` }}
        />
      </div>

      {/* Back */}
      <div className="p-4">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600"
        >
          ← Back
        </button>
      </div>

      {/* Game */}
      <div className="flex-1 flex flex-col">
        <div className="max-w-5xl mx-auto w-full px-4 text-center space-y-10 mt-10">
          <h2 className="text-2xl font-bold mb-2">
            Pick one which is the more important for you.
          </h2>

          <AnimatePresence mode="wait">
            {left && right && (
              <motion.div
                key={`${left}-${right}-${currentIndex}`}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center gap-4"
              >
                {/* Left card */}
                <div
                  onClick={() => handleChoice(left)}
                  className="flex-1 cursor-pointer p-4 sm:p-6 bg-[var(--Background-yellow)] border border-[var(--Primary-7-main)] rounded-xl shadow hover:bg-[var(--Chip-Active)] hover:scale-105 transition transform max-w-md"
                >
                  <h3 className="text-lg sm:text-xl font-bold mb-2">{left}</h3>
                  <p className="text-sm text-gray-600">
                    {getValueDescription(left)}
                  </p>
                </div>

                <div className="text-xl font-bold px-4">OR</div>

                {/* Right card */}
                <div
                  onClick={() => handleChoice(right)}
                  className="flex-1 cursor-pointer p-4 sm:p-6 bg-[var(--Background-yellow)] border border-[var(--Primary-7-main)] rounded-xl shadow hover:bg-[var(--Chip-Active)] hover:scale-105 transition transform max-w-md"
                >
                  <h3 className="text-lg sm:text-xl font-bold mb-2">{right}</h3>
                  <p className="text-sm text-gray-600">
                    {getValueDescription(right)}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls */}
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
    </div>
  );
}
