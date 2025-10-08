"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "components/ui/Button";
import BackButton from "components/ui/BackButton";
import { useAuth } from "hooks/useAuth";
import { useApi } from "hooks/useApi";

export default function ValuesSelectPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { userId, apiGet, apiPost } = useApi();
  const [allValues, setAllValues] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  // Fetch values when userId is available
  useEffect(() => {
    if (!userId) return; // Wait for user ID
    
    async function fetchValues() {
      try {
        // 🔹 Najpierw pobierz zapisany progres (czy coś już jest w select)
        const progressRes = await apiGet(`/values/init/progress/${userId}`);
        if (progressRes.ok) {
          const progressData = await progressRes.json();
          const alreadySelected = progressData?.select?.data?.selected_values || [];
          setSelectedValues(alreadySelected);  // 👈 Przywróć wybrane wcześniej
        }

        // 🔹 Potem pobierz listę wszystkich wartości (30 losowych)
        const res = await apiGet(`/values/list`);
        const data = await res.json();

        const shuffled = data.sort(() => 0.5 - Math.random());
        setAllValues(shuffled.slice(0, 30));
      } catch (err) {
        console.error("Error fetching values:", err);
      }
    }

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



  const handleSelect = (value) => {
    if (!selectedValues.includes(value)) {
      setSelectedValues((prev) => [...prev, value]);
    }
  };

  const handleRemove = (value) => {
    setSelectedValues((prev) => prev.filter((v) => v !== value));
  };

  // Update the saveProgress function
  

  const saveProgress = async () => {
    if (!userId) return; // No user ID available
    
    try {
      const res = await apiPost(`/values/select`, {
        user_id: userId,
        selected_values: selectedValues,
      });

      const data = await res.json();
      console.log("Progress saved:", data);
      router.push("/values/reduce");
    } catch (err) {
      console.error("Error saving progress:", err);
      alert("Could not save progress. Please check your connection.");
    }
  };


  return (
    <div className="max-w-3xl mx-auto p-6 text-center relative space-y-12">

      {/* Back button */}
      <div className="absolute top-4 left-4">
        <BackButton onClick={() => router.push("/values/init?step=4")} />
      </div>


      <h1 className="text-3xl font-bold text-gray-900 mt-12">
        Choose values that feel important for you
      </h1>
      <p className="text-gray-600">
        Pick the values that resonate with you. You can also add your own by
        typing them in the box.
      </p>

      {/* Wybrane wartości */}
      <div className="space-y-2">
        <label className="block text-gray-700 font-medium">
          Your selected values
        </label>
        <div className="flex flex-wrap gap-2 border border-[var(--Primary-7-main)] rounded-lg p-2 bg-white">
          {selectedValues.map((val, i) => (
            <span
              key={i}
              className="px-4 py-2 rounded-full border border-[var(--Primary-7-main)] bg-[var(--Chip-Active)] text-gray-900 cursor-pointer"
              onClick={() => handleRemove(val)}
            >
              {val} ✕
            </span>
          ))}
          <input
            type="text"
            placeholder="Type and press Enter to add"
            className="flex-1 outline-none px-2 text-gray-800 placeholder-gray-400"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target.value.trim() !== "") {
                handleSelect(e.target.value.trim());
                e.target.value = "";
              }
            }}
          />
        </div>
      </div>

      {/* Lista sugerowanych wartości */}
      <div className="space-y-2">
        <label className="block text-gray-700 font-medium">Suggested values</label>
        <div className="flex flex-wrap gap-2">
          {allValues.map((val, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSelect(val)}
              className={`px-4 py-2 rounded-full border border-[var(--Primary-7-main)] transition ${
                selectedValues.includes(val)
                  ? "bg-[var(--Chip-Active)] text-gray-900"
                  : "bg-white text-gray-700"
              }`}
            >
              {val}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
        {/* Refresh button */}
        <button
          onClick={async () => {
            try {
              // const res = await fetch("http://localhost:8000/values/list");
              const res = await apiGet(`/values/list`);
              if (!res.ok) throw new Error("Failed to fetch values");
              const data = await res.json();

              // Losowe 30 wartości (zostają tylko w sekcji Suggested)
              const shuffled = data.sort(() => 0.5 - Math.random());
              setAllValues(shuffled.slice(0, 30));
              // UWAGA: selectedValues zostaje nietknięte
            } catch (err) {
              console.error("Error refreshing values:", err);
            }
          }}
          className="text-gray-500 hover:underline"
        >
          Refresh
        </button>

        {/* Next button */}
        <Button
          onClick={saveProgress}
          text="Next →"
          disabled={selectedValues.length === 0}
        />
      </div>

    </div>
    
  );
}
