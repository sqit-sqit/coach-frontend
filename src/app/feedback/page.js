"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "hooks/useAuth";
import { useApi } from "hooks/useApi";
import { getCurrentUserId } from "lib/guestUser";
import WorkshopLayout from "../../components/layouts/WorkshopLayout";

export default function FeedbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { userId: authUserId, apiPost } = useApi();
  const [rating, setRating] = useState(4);
  const [likedInput, setLikedInput] = useState("");
  const [dislikedInput, setDislikedInput] = useState("");
  const [moreInput, setMoreInput] = useState("");
  const [selectedLikedChips, setSelectedLikedChips] = useState([]);
  const [selectedDislikedChips, setSelectedDislikedChips] = useState([]);
  const [module, setModule] = useState("general");
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    const moduleName = searchParams.get('module') || 'general';
    const sessionIdParam = searchParams.get('session_id');
    setModule(moduleName);
    setSessionId(sessionIdParam);
  }, [searchParams]);

  const likedChips = ["AI tone of voice", "Design", "Ease of Use"];
  const dislikedChips = ["AI tone of voice", "Design", "Too complicated"];
  
  // Use authenticated user ID or guest ID
  const [userId, setUserId] = useState(null);
  
  useEffect(() => {
    if (!isLoading) {
      const id = getCurrentUserId(authUserId);
      setUserId(id);
    }
  }, [authUserId, isLoading]);

  // Show loading while authenticating
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

  const handleLikedChipClick = (chip) => {
    if (!selectedLikedChips.includes(chip)) {
      setSelectedLikedChips([...selectedLikedChips, chip]);
    }
  };

  const handleRemoveLikedChip = (chip) => {
    setSelectedLikedChips(selectedLikedChips.filter(c => c !== chip));
  };

  const handleDislikedChipClick = (chip) => {
    if (!selectedDislikedChips.includes(chip)) {
      setSelectedDislikedChips([...selectedDislikedChips, chip]);
    }
  };

  const handleRemoveDislikedChip = (chip) => {
    setSelectedDislikedChips(selectedDislikedChips.filter(c => c !== chip));
  };

  const handleSubmit = async () => {
    console.log("=== FEEDBACK DEBUG ===");
    console.log("userId:", userId);
    console.log("isAuthenticated:", isAuthenticated);
    console.log("rating:", rating);
    console.log("selectedLikedChips:", selectedLikedChips);
    console.log("likedInput:", likedInput);
    
    if (!userId) {
      console.log("ERROR: No userId");
      alert("User not authenticated");
      return;
    }

    const feedbackData = {
      user_id: userId,
      rating: rating,
      liked_text: likedInput,
      liked_chips: selectedLikedChips,
      disliked_text: dislikedInput,
      disliked_chips: selectedDislikedChips,
      additional_feedback: moreInput,
      module: module,
      session_id: sessionId
    };
    
    console.log("Sending feedback data:", feedbackData);
    console.log("apiPost function:", typeof apiPost);

    try {
      console.log("Calling apiPost...");
      const response = await apiPost(`/feedback`, feedbackData);
      console.log("Response received:", response);
      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log("Feedback saved:", data);
        alert("Thank you for your feedback! Your input helps us improve the app.");
        router.push("/");
      } else {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Could not submit feedback. Please try again.");
    }
  };

  return (
    <WorkshopLayout width="wide" className="flex items-center justify-center p-4 pb-48">
      <div className="w-full min-h-[600px] bg-[rgba(70,92,251,0.8)] rounded-[32px] flex flex-col items-start p-6 sm:p-8 lg:p-10 gap-6 sm:gap-8">
        {/* Header */}
        <div className="w-full space-y-3">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white text-center">
            Leave us feedback
          </h1>
          <p className="text-white text-sm sm:text-base leading-relaxed text-center">
            Thank you for taking time to do our {module} workshop. Could you please rate your experience and write us a quick feedback
          </p>
          
          {/* Star Rating */}
          <div className="flex justify-center space-x-2 mt-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <svg
                  className={`w-6 h-6 ${
                    star <= rating ? "text-white" : "text-white/30"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* What did you like section */}
        <div className="w-full space-y-2">
          <h2 className="text-base sm:text-lg font-semibold text-white">
            What did you like from the app?
          </h2>
          <div className="flex flex-wrap gap-2 border border-white/20 rounded-2xl p-2 bg-white">
            {selectedLikedChips.map((chip) => (
              <span
                key={chip}
                className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--Chip-Active)] text-gray-900 border-2 border-[#E5B846] cursor-pointer"
                onClick={() => handleRemoveLikedChip(chip)}
              >
                {chip} ✕
              </span>
            ))}
            <input
              type="text"
              value={likedInput}
              onChange={(e) => setLikedInput(e.target.value)}
              placeholder="Type in or choose from the chips"
              className="flex-1 outline-none px-2 text-gray-800 placeholder-gray-400 text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {likedChips.map((chip) => (
              <button
                key={chip}
                onClick={() => handleLikedChipClick(chip)}
                disabled={selectedLikedChips.includes(chip)}
                className={`px-3 py-1 rounded-full text-xs font-medium border-2 transition-all hover:scale-105 ${
                  selectedLikedChips.includes(chip)
                    ? "bg-white/20 text-white border-white/50 cursor-not-allowed"
                    : "bg-[var(--Chip-Active)] text-gray-900 border-[#E5B846]"
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* What did you NOT like section */}
        <div className="w-full space-y-2">
          <h2 className="text-base sm:text-lg font-semibold text-white">
            What did you NOT like?
          </h2>
          <div className="flex flex-wrap gap-2 border border-white/20 rounded-2xl p-2 bg-white">
            {selectedDislikedChips.map((chip) => (
              <span
                key={chip}
                className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--Chip-Active)] text-gray-900 border-2 border-[#E5B846] cursor-pointer"
                onClick={() => handleRemoveDislikedChip(chip)}
              >
                {chip} ✕
              </span>
            ))}
            <input
              type="text"
              value={dislikedInput}
              onChange={(e) => setDislikedInput(e.target.value)}
              placeholder="Type in or choose from the chips"
              className="flex-1 outline-none px-2 text-gray-800 placeholder-gray-400 text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {dislikedChips.map((chip) => (
              <button
                key={chip}
                onClick={() => handleDislikedChipClick(chip)}
                disabled={selectedDislikedChips.includes(chip)}
                className={`px-3 py-1 rounded-full text-xs font-medium border-2 transition-all hover:scale-105 ${
                  selectedDislikedChips.includes(chip)
                    ? "bg-white/20 text-white border-white/50 cursor-not-allowed"
                    : "bg-[var(--Chip-Active)] text-gray-900 border-[#E5B846]"
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Tell us more section */}
        <div className="w-full space-y-2">
          <h2 className="text-base sm:text-lg font-semibold text-white">
            Tell us more
          </h2>
          <textarea
            value={moreInput}
            onChange={(e) => setMoreInput(e.target.value)}
            placeholder="Type in the text"
            rows={3}
            className="w-full px-3 py-2 rounded-2xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none text-sm"
          />
        </div>

        {/* Submit button */}
        <div className="w-full flex justify-center pt-4">
          <button
            onClick={handleSubmit}
            className="w-full bg-[#8C8CFF] hover:bg-[#7A7AFF] text-white font-semibold py-3 px-6 rounded-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
          >
            Send the review
          </button>
        </div>

        {/* Buy me a coffee section */}
        <div className="w-full pt-8 pb-16">
          <div className="bg-gray-100 rounded-3xl p-6 shadow-lg text-center space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              Did you get value from the app?
            </h3>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
            If this space helps you pause, breathe, and reconnect with yourself — to live with more awareness and gentleness — consider supporting us with a coffee.
Your kindness helps us nurture and grow this work, so it can keep guiding others toward a more conscious, meaningful life.
Every coffee is a quiet “thank you” that keeps this light shining.
            </p>
            <button
              onClick={() => {
                // Here you would integrate with your payment system
                console.log("Buy me a coffee clicked");
                alert("Thank you for your support! ☕");
              }}
              className="bg-[#FFDD00] hover:bg-[#FFE55C] text-gray-900 font-semibold py-3 px-6 rounded-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm"
            >
              Buy us a coffee
            </button>
          </div>
        </div>
      </div>
    </WorkshopLayout>
  );
}
