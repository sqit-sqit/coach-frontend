"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "components/ui/Button";
import { useAuth } from "hooks/useAuth";
import { useApi } from "hooks/useApi";

export default function ValuesChoosePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { userId, apiGet, apiPost } = useApi();
  const [reducedValues, setReducedValues] = useState([]);
  const [chosenValue, setChosenValue] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  // 🔹 Pobierz wartości z fazy REDUCE
  useEffect(() => {
    if (!userId) return; // Wait for user ID
    
    async function fetchReducedValues() {
      try {
        const res = await apiGet(`/values/reduce/${userId}`);
        const data = await res.json();

        const reduced = data?.reduced_values || [];
        setReducedValues(reduced);
      } catch (err) {
        console.error("Error fetching reduced values:", err);
      }
    }
    fetchReducedValues();
  }, [userId]);

  // 🔹 Pobierz wcześniej wybraną wartość, żeby ją podświetlić
  useEffect(() => {
    if (!userId) return; // Wait for user ID
    
    async function fetchChosenValue() {
      try {
        const res = await apiGet(`/values/choose/${userId}`);
        const data = await res.json();
        if (data?.chosen_value) {
          setChosenValue(data.chosen_value);
        }
      } catch (err) {
        console.error("Error fetching chosen value:", err);
      }
    }
    fetchChosenValue();
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

  const saveChosenValue = async () => {
    if (!userId) return; // No user ID available
    
    try {
      const res = await apiPost(`/values/choose`, {
        user_id: userId,
        chosen_value: chosenValue,
      });

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
          Now from the above set of values choose one, the most important value
          in your life at the moment. Select one and click "Continue" to
          proceed. If there is a challenge to decide which one is the most
          important, play a game which will help to decide.
        </p>

        <div className="flex justify-center gap-4 mt-6">
          <Button text="Play a game" onClick={() => router.push("/values/game")} />
          <Button
            text="Continue"
            onClick={saveChosenValue}
            disabled={!chosenValue}
          />
        </div>
      </div>
    </div>
  );
}
