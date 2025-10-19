// components/ui/GateCard.js
"use client";

export default function GateCard({ 
  gateNumber, 
  gateInfo, 
  activationType, 
  onClick, 
  selected = false 
}) {
  const activationLabel = activationType === 'both' ? 'Design & Personality' : 
                         activationType === 'design' ? 'Design' : 
                         activationType === 'personality' ? 'Personality' : '';

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer p-6 rounded-lg border text-center transition 
        ${selected ? "bg-[var(--Chip-Active)] border-[var(--Primary-7-main)] text-gray-900" 
                   : "bg-white border-[var(--Primary-7-main)] text-gray-700 hover:shadow-md"}`}
      title={gateInfo ? `${gateInfo.name} - ${gateInfo.coaching_note}` : ''}
    >
      <div className="font-semibold">Bramka {gateNumber}</div>
      {gateInfo && (
        <div className="text-sm font-medium mt-1">{gateInfo.name}</div>
      )}
      {activationLabel && (
        <div className="text-xs mt-1 opacity-75 font-medium">
          {activationLabel}
        </div>
      )}
    </div>
  );
}
