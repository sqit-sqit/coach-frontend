"use client";

export default function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-0"
    >
      <span className="text-2xl">←</span>
      <span className="text-base font-medium">Back</span>
    </button>
  );
}
