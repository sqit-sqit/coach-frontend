'use client'

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "hooks/useAuth";
import { useApi } from "hooks/useApi";
import { getCurrentUserId } from "lib/guestUser";
import WorkshopLayout from "../../components/layouts/WorkshopLayout";

function FeedbackForm() {
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

  const handleChipClick = (chip, type) => {
    if (type === "liked") {
      setSelectedLikedChips((prev) =>
        prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
      );
    } else {
      setSelectedDislikedChips((prev) =>
        prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
      );
    }
  };

  const handleSubmit = async () => {
    const userId = authUserId || (await getCurrentUserId());
    console.log("Submitting feedback for user:", userId);
    console.log("Module:", module, "Session ID:", sessionId);
    if (!userId) {
      alert("Could not identify user. Please sign in or start a session.");
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
    
    try {
      const response = await apiPost(`/feedback`, feedbackData);
      console.log("Feedback submitted:", response);
      router.push("/dashboard?feedback=success");
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    }
  };
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

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
          <div className="flex justify-center items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-8 h-8 cursor-pointer ${
                  rating >= star ? "text-yellow-400" : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
                onClick={() => setRating(star)}
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.96a1 1 0 00.95.69h4.16c.969 0 1.371 1.24.588 1.81l-3.364 2.446a1 1 0 00-.364 1.118l1.287 3.96c.3.921-.755 1.688-1.539 1.118l-3.364-2.446a1 1 0 00-1.175 0l-3.364 2.446c-.784.57-1.838-.197-1.539-1.118l1.287-3.96a1 1 0 00-.364-1.118L2.064 9.387c-.783-.57-.38-1.81.588-1.81h4.16a1 1 0 00.95-.69l1.286-3.96z" />
              </svg>
            ))}
          </div>
        </div>

        {/* What you liked */}
        <div className="w-full space-y-3">
          <h2 className="text-lg font-semibold text-white">What you liked?</h2>
          <div className="flex flex-wrap gap-2">
            {likedChips.map((chip) => (
              <button
                key={chip}
                onClick={() => handleChipClick(chip, "liked")}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedLikedChips.includes(chip)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
          <textarea
            value={likedInput}
            onChange={(e) => setLikedInput(e.target.value)}
            className="w-full p-3 rounded-lg bg-white text-gray-800"
            placeholder="Write more..."
          />
        </div>

        {/* What you disliked */}
        <div className="w-full space-y-3">
          <h2 className="text-lg font-semibold text-white">What you disliked?</h2>
          <div className="flex flex-wrap gap-2">
            {dislikedChips.map((chip) => (
              <button
                key={chip}
                onClick={() => handleChipClick(chip, "disliked")}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedDislikedChips.includes(chip)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
          <textarea
            value={dislikedInput}
            onChange={(e) => setDislikedInput(e.target.value)}
            className="w-full p-3 rounded-lg bg-white text-gray-800"
            placeholder="Write more..."
          />
        </div>
        
        {/* Anything more? */}
        <div className="w-full space-y-3">
          <h2 className="text-lg font-semibold text-white">Anything more?</h2>
          <textarea
            value={moreInput}
            onChange={(e) => setMoreInput(e.target.value)}
            className="w-full p-3 rounded-lg bg-white text-gray-800"
            placeholder="Additional feedback..."
          />
        </div>

        {/* Submit Button */}
        <div className="w-full flex justify-center">
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-green-500 text-white font-bold rounded-full hover:bg-green-600 transition-colors"
          >
            Submit
          </button>
        </div>
      </div>
    </WorkshopLayout>
  );
}

export default function FeedbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FeedbackForm />
    </Suspense>
  );
}
