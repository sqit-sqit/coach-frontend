"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "components/ui/Button";
import { useAuth } from "hooks/useAuth";
import { useApi } from "hooks/useApi";
import { getCurrentUserId } from "lib/guestUser";

export default function ValuesReducePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { userId: authUserId } = useApi();
  const [selectedValues, setSelectedValues] = useState([]);
  const [removedValues, setRemovedValues] = useState([]); // Stack of removed values for undo
  
  // Use authenticated user ID or guest ID
  const [userId, setUserId] = useState(null);
  
  useEffect(() => {
    if (!isLoading) {
      const id = getCurrentUserId(authUserId);
      setUserId(id);
    }
  }, [authUserId, isLoading]);

  // Pobierz wartości z fazy SELECT
  useEffect(() => {
    if (!userId) return; // Wait for user ID
    
    async function fetchSelectedValues() {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const res = await fetch(`${API_URL}/values/select/${userId}`);
        const data = await res.json();

        // 🔑 poprawna ścieżka
        const selected = data?.selected_values || [];
        setSelectedValues(selected);
      } catch (err) {
        console.error("Error fetching selected values:", err);
      }
    }
    fetchSelectedValues();
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

  const handleRemove = (value) => {
    setSelectedValues((prev) => prev.filter((v) => v !== value));
    setRemovedValues((prev) => [value, ...prev]); // Add to beginning of array (stack)
  };

  const handleUndo = () => {
    if (removedValues.length > 0) {
      const [lastRemoved, ...rest] = removedValues;
      setSelectedValues((prev) => [...prev, lastRemoved]);
      setRemovedValues(rest);
    }
  };

  // 🔹 Nowa logika zapisu do /values/reduce
  const saveProgress = async () => {
    if (!userId) return; // No user ID available
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API_URL}/values/reduce`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          reduced_values: selectedValues,
        }),
      });

      const data = await res.json();
      console.log("Progress saved:", data);

      router.push("/values/choose"); // kolejny etap
    } catch (err) {
      console.error("Error saving progress:", err);
      alert("Could not save progress. Please try again.");
    }
  };

  return (
    <div className="text-center relative space-y-12">

      <h1 className="text-3xl font-bold text-gray-900 mt-12">
        Now remove some values so you have 10 values left
      </h1>
      <p className="text-gray-600">
      Next step:<br />
      Take a moment to reflect on which values feel most essential to you. 
      From the list you created earlier, begin letting go of those that feel less important, 
      one by one, until you’re left with no more than ten core values — the ones that truly represent 
      what matters most in your life.<br />
      <br />
      You can unchoose chips by clicking on them. Once you get down to 10,
      you can move on.
      </p>

      {/* Wybrane wartości */}
      <div className="flex flex-wrap gap-2">
        {selectedValues.map((value, index) => (
          <span
            key={index}
            className="flex items-center space-x-1 bg-[var(--Chip-Active)] text-gray-900 text-sm px-4 py-2 rounded-full border border-[var(--Primary-7-main)]"
          >
            <span>{value}</span>
            <button
              type="button"
              onClick={() => handleRemove(value)}
              className="ml-2 text-gray-600 hover:text-red-500"
            >
              ✕
            </button>
          </span>
        ))}
      </div>

      <div className="text-sm text-gray-500">
        {selectedValues.length} out of 10 values
      </div>

      <div className="flex justify-between items-center mt-8">
        {/* Undo button */}
        <button
          onClick={handleUndo}
          disabled={removedValues.length === 0}
          className={`transition ${
            removedValues.length === 0
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-500 hover:underline'
          }`}
        >
          ↺ Undo
        </button>

        {/* Next button */}
        <Button
          onClick={saveProgress}
          text="Next →"
          disabled={selectedValues.length > 10 || selectedValues.length === 0}
        />
      </div>
    </div>
  );
}
