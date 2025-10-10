"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Button from "components/ui/Button";
import Heading from "components/ui/Heading";
import BackButton from "components/ui/BackButton";
import ExpandableInfo from "components/ui/ExpandableInfo";
import { Search, MessageSquare, Pause, Mail } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const dynamic = "force-dynamic";

// 🔹 właściwy komponent – zawiera useSearchParams
function InitContent() {
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
        <div className="space-y-6 mt-10">
          <Heading level={1}>Welcome to Your Values Journey</Heading>
          <p className="text-lg text-gray-700">Explore your values.</p>
          <p className="text-gray-600 max-w-2xl mx-auto">
          Through short, guided conversations, you’ll uncover what’s important to you, 
          reflect on why, and see how it shows up in your daily life. Think of it as a friendly guide
           not a test.
          </p>

          {/* Why question expandable */}
          <ExpandableInfo 
            title='Why knowing values is "valuable"?' 
            icon="?"
            className="mt-6"
          >
            <p>
              What is one of the most important question you can ask yourself? That question is: "Why?"
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Why do I do what I do?</li>
              <li>Why do I make these particular decisions?</li>
              <li>Why do I choose one thing over another?</li>
            </ul>
            <p>
              The deepest reasons that drive these choices are often hidden in our subconscious, shaped by our past, experiences, and life events. But these hidden dynamics shape something we call our value system—a set of values that are so important in life that they guide our behavior. And that we can recognize on a conscious level.
            </p>
            <p>
              Understanding your value system is the first step to understanding yourself. What drives me. What matters to me in life. How that influences my life priorities.
            </p>
            <p>
              If this feels important to you, carve out up to half an hour just for yourself and explore what fuels you.
            </p>
          </ExpandableInfo>

          <div className="mt-12 flex justify-center">
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
                Reflect to understand the deeper reasons why your values
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

          {/* Know more about value workshop expandable */}
          <ExpandableInfo 
            title="Know more about value workshop" 
            icon="i"
            className="mt-8"
          >
            <p>
              <strong>What is a value workshop?</strong><br />
              A value workshop is a structured process designed to help you identify, explore, and understand your core personal values. It's a journey of self-discovery that reveals what truly matters to you in life.
            </p>
    
            <p>
              <strong>How does it work?</strong><br />
              Through guided questions and AI-powered conversations, you'll explore your motivations, decisions, and life priorities. The process helps bring unconscious values to the surface where you can examine and understand them.
            </p>
            <p>
              <strong>What will you gain?</strong><br />
              By the end of this workshop, you'll have a clearer understanding of your value system, how it influences your decisions, and what drives you in life. This awareness can help you make more aligned choices and live with greater purpose.
            </p>
            <p>
              <strong>IMPORTANT: What kind of experience to expect?</strong>
            </p>
            <p>
              Please note this is a <strong>coaching session</strong> — a space designed to help you explore, reflect, and connect with what truly matters to you.
              You can expect thoughtful questions that may challenge your usual ways of thinking and gently lead you toward new insights about yourself.
            </p>
            <p>
              This is <strong>not mentoring</strong> — you won't receive direct advice or instructions on what to do with your values.
              Instead, the goal is to help you gain clarity and awareness, so you can understand yourself more deeply.
            </p>
            <p>
              At the end, you'll receive a short summary with reflections and inspirations — not as prescriptions, but as gentle guidance to help you integrate what you've discovered into your own life.
            </p>
            <p>
              <strong>Time commitment:</strong><br />
              Plan for about 30 minutes of focused reflection. This is time just for you to explore what fuels and motivates you.
            </p>
          </ExpandableInfo>

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
            your data at every step, as everything you provide is optional.
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
            Before you start, we’d like to know a bit about you. This way, we can adjust the session more to your profile. Don’t worry, you can skip anything you don’t
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

// 🔹 Eksport główny z Suspense wrapperem
export default function ValuesInitPageWrapper() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <InitContent />
    </Suspense>
  );
}
