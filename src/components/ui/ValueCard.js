// components/ui/ValueCard.js
"use client";

export default function ValueCard({ text, onClick, selected }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer p-6 rounded-lg border text-center transition 
        ${selected ? "bg-[var(--Chip-Active)] border-[var(--Primary-7-main)] text-gray-900" 
                   : "bg-white border-gray-200 text-gray-700 hover:shadow-md"}`}
    >
      <p className="font-semibold">{text}</p>
    </div>
  );
}
