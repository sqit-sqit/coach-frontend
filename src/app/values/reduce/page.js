"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "components/ui/Button";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ValuesReducePage() {
  const [selectedValues, setSelectedValues] = useState([]);
  const router = useRouter();

  // Pobierz wartości z fazy SELECT
  useEffect(() => {
    async function fetchSelectedValues() {
      try {
        const userId = "demo-user-123";
        const res = await fetch(`${API_URL}/values/select/${userId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch values");
        }
        const data = await res.json();

        // 🔑 poprawna ścieżka
        const selected = data?.selected_values || [];
        setSelectedValues(selected);
      } catch (err) {
        console.error("Error fetching selected values:", err);
      }
    }
    fetchSelectedValues();
  }, []);

  const handleRemove = (value) => {
    setSelectedValues((prev) => prev.filter((v) => v !== value));
  };

  // 🔹 Nowa logika zapisu do /values/reduce
  const saveProgress = async () => {
    try {
      const userId = "demo-user-123";
      const res = await fetch(`${API_URL}/values/reduce`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          reduced_values: selectedValues,
        }),
      });

      if (!res.ok) throw new Error("Failed to save progress");

      const data = await res.json();
      console.log("Progress saved:", data);

      router.push("/values/choose"); // kolejny etap
    } catch (err) {
      console.error("Error saving progress:", err);
      alert("Could not save progress. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 text-center relative space-y-12">
      {/* Back button */}
      <div className="absolute top-4 left-4">
        <button
          onClick={() => router.push("/values/select")}
          className="text-gray-600 hover:underline"
        >
          ← Back
        </button>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mt-12">
        Now remove some values so you have 10 values left
      </h1>
      <p className="text-gray-600">
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

      <div className="flex justify-end mt-8">
        <Button
          onClick={saveProgress}
          text="Next →"
          disabled={selectedValues.length > 10 || selectedValues.length === 0}
        />
      </div>
    </div>
  );
}
