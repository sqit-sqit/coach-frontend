"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Button from "components/ui/Button";
import Heading from "components/ui/Heading";
import BackButton from "components/ui/BackButton";
import { Search, MessageSquare, Pause, Mail } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ValuesInitPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const userId = "demo-user-123"; // tymczasowe ID użytkownika

  const initialStep = parseInt(searchParams.get("step") || "1", 10);
  const [step, setStep] = useState(initialStep);

  const [name, setName] = useState("Guest");
  const [ageGroup, setAgeGroup] = useState("");
  const [interests, setInterests] = useState([]);
  const [interestInput, setInterestInput] = useState("");
  const [agreed, setAgreed] = useState(false);

  // 🔹 Aktualizuj query param przy każdej zmianie stepu
  useEffect(() => {
    if (step < 5) {
      router.replace(`/values/init?step=${step}`);
    } else if (step === 5) {
      router.push("/values/select");
    }
  }, [step, router]);

  // 🔹 Ładowanie danych użytkownika przy powrocie na Step 4
  useEffect(() => {
    async function fetchInitData() {
      try {
        const res = await fetch(`${API_URL}/values/init/progress/${userId}`);
        if (!res.ok) return;
        const data = await res.json();

        const initData = data?.init?.data || {};
        if (initData.name) setName(initData.name);
        if (initData.age_range) setAgeGroup(initData.age_range);
        if (initData.interests) setInterests(initData.interests);
      } catch (err) {
        console.error("Error loading init data:", err);
      }
    }

    if (step === 4) {
      fetchInitData();
    }
  }, [step]);

  // 🔹 Zapis progresu
  const saveProgress = async (nextStep) => {
    try {
      const res = await fetch(`${API_URL}/values/init/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          phase: "init",
          step: nextStep,
          data: {
            name,
            age_range: ageGroup,
            interests,
          },
        }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      console.log("Progress saved:", data);
      setStep(nextStep);
    } catch (err) {
      console.error("Error saving progress:", err);
      alert("Could not connect to backend at " + API_URL);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 text-center relative">
      {/* Back button */}
      <div className="absolute top-4 left-4">
        {step > 1 ? (
          <BackButton onClick={() => saveProgress(step - 1)} />
        ) : (
          <BackButton onClick={() => router.push("/dashboard")} />
        )}
      </div>

      {/* --- Step 1 --- */}
      {step === 1 && (
        <div className="space-y-6">
          <Heading level={1}>Welcome to Your Values Journey</Heading>
          <p className="text-lg text-gray-700">Let’s explore your values together.</p>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Through short, guided conversations with AI, you’ll uncover what’s
            important to you, reflect on why, and see how it shows up in your
            daily life. Think of it as a friendly guide, not a test.
          </p>
          <div className="mt-8 flex justify-center">
            <Button onClick={() => saveProgress(2)} text="Start →" />
          </div>
        </div>
      )}

      {/* --- Step 2 --- */}
      {step === 2 && (
        <div className="text-center mt-10">
          <Heading level={1} className="mb-2">How it works</Heading>
          <p className="text-gray-700 max-w-2xl mx-auto mb-10">
            You’ll have a guided chat with AI. It will ask you thoughtful
            questions, you answer in your own words, and together you’ll uncover
            patterns and meaning. At the end, you’ll get a summary designed only
            for you.
          </p>

          {/* Grid with 4 steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200 shadow-sm flex flex-col items-center text-center">
              <Search className="w-12 h-12 text-brand mb-4" strokeWidth={1.5} />
              <p className="font-semibold mb-2">1. Discover core value</p>
              <p className="text-sm text-gray-600">
                Select the values that matter most to you as a foundation for
                your journey.
              </p>
            </div>
            <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200 shadow-sm flex flex-col items-center text-center">
              <MessageSquare className="w-12 h-12 text-brand mb-4" strokeWidth={1.5} />
              <p className="font-semibold mb-2">2. Understand your why</p>
              <p className="text-sm text-gray-600">
                Reflect with AI to understand the deeper reasons why your values
                shape who you are.
              </p>
            </div>
            <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200 shadow-sm flex flex-col items-center text-center">
              <Pause className="w-12 h-12 text-brand mb-4" strokeWidth={1.5} />
              <p className="font-semibold mb-2">3. Pause and reflect</p>
              <p className="text-sm text-gray-600">
                Review the insights from your dialogue and notice what resonates
                most with you.
              </p>
            </div>
            <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200 shadow-sm flex flex-col items-center text-center">
              <Mail className="w-12 h-12 text-brand mb-4" strokeWidth={1.5} />
              <p className="font-semibold mb-2">4. Personal summary</p>
              <p className="text-sm text-gray-600">
                Get a clear, personalized summary of what drives you and how
                your values show up.
              </p>
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <Button onClick={() => saveProgress(3)} text="Next →" />
          </div>
        </div>
      )}

      {/* --- Step 3 --- */}
      {step === 3 && (
        <div className="text-center mt-20">
          <Heading level={1} className="font-bold underline mb-6">
            Your reflections are yours
          </Heading>
          <p className="text-gray-700 max-w-2xl mx-auto mb-10">
            Everything you write here is{" "}
            <span className="font-semibold">private and confidential</span>. Your
            answers are never sold, shared, or used for advertising. You control
            your data at every step, including the option to skip or delete.
          </p>

          <div className="flex items-center justify-center mb-10 space-x-2">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="h-5 w-5 text-brand border-2 border-yellow-400 rounded cursor-pointer"
            />
            <label htmlFor="agree" className="text-gray-700">
              Agree to{" "}
              <a href="/privacy" className="text-gray-700 underline hover:text-brand">
                Privacy statement
              </a>
            </label>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={() => saveProgress(4)}
              text="Next →"
              disabled={!agreed}
            />
          </div>
        </div>
      )}

      {/* --- Step 4 --- */}
      {step === 4 && (
        <div className="max-w-2xl mx-auto text-left space-y-8 mt-20">
          <Heading level={1}>Tell us a little about yourself</Heading>
          <p className="text-gray-600">
            Before you start, we’d like to know a bit about you. This way, we can make
            the experience more relevant. Don’t worry, you can skip anything you don’t
            feel like answering.
          </p>

          {/* Name */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">What is your name?</label>
            <input
              type="text"
              placeholder="Type your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-bordercolor px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          {/* Age group */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">Choose your age group</label>
            <div className="flex flex-wrap gap-2">
              {["18-", "18-25", "26-35", "36-45", "46-55", "56-65", "66-75", "76-85", "86+"].map(
                (range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => setAgeGroup(range)}
                    className={`px-4 py-2 rounded-full border ${
                      ageGroup === range
                        ? "bg-chipactive border-bordercolor text-gray-900"
                        : "bg-transparent border-bordercolor text-gray-700"
                    }`}
                  >
                    {range}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">What is your field of interest</label>
            <div className="flex flex-wrap items-center gap-2 w-full rounded-lg border border-bordercolor px-3 py-2 focus-within:ring-2 focus-within:ring-brand">
              {interests.map((interest, idx) => (
                <span
                  key={idx}
                  className="flex items-center space-x-1 bg-chipactive text-gray-800 text-sm px-3 py-1 rounded-full"
                >
                  <span>{interest}</span>
                  <button
                    type="button"
                    onClick={() => setInterests(interests.filter((_, i) => i !== idx))}
                    className="ml-1 text-gray-600 hover:text-red-500"
                  >
                    ✕
                  </button>
                </span>
              ))}

              <input
                type="text"
                placeholder={interests.length === 0 ? "Type field of interests" : ""}
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && interestInput.trim()) {
                    e.preventDefault();
                    setInterests([...interests, interestInput.trim()]);
                    setInterestInput("");
                  }
                }}
                className="flex-1 min-w-[120px] border-none focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {[
                "Psychology", "Technology", "Literature", "Painting", "Music",
                "Economics", "AI", "Philosophy", "Sports", "Travel",
                "Science", "History", "Film", "Photography",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() =>
                    !interests.includes(suggestion) &&
                    setInterests([...interests, suggestion])
                  }
                  className="px-4 py-2 rounded-full bg-transparent border border-bordercolor text-gray-700 text-sm hover:bg-chipactive"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Skip i Next */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={async () => {
                await saveProgress(5);
                router.push("/values/select");
              }}
              className="text-gray-500 hover:underline"
            >
              Skip
            </button>
            <Button
              onClick={async () => {
                await saveProgress(5);
                router.push("/values/select");
              }}
              text="Next →"
            />
          </div>
        </div>
      )}
    </div>
  );
}
