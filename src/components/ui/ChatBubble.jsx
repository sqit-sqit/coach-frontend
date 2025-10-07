export default function ChatBubble({ role = "user", title, children, isSummary = false, hasActionChips = false, onActionChipClick }) {
  if (role === "assistant") {
    return (
      <div className="w-full flex justify-start">
        <div className={`w-[902px] min-h-[24px] flex flex-col gap-2 text-left ${isSummary ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6' : ''}`}>
          {/* Nagłówek AI */}
          {title && (
            <p className="font-montserrat font-bold text-[16px] leading-[120%] text-gray-900">
              {title}
            </p>
          )}
          {/* Download PDF Chip - na górze */}
          {hasActionChips && (
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => onActionChipClick?.('download-pdf')}
                className="px-4 py-2 rounded-full border border-[var(--Primary-7-main)] bg-[var(--Chip-Active)] text-gray-900 cursor-pointer hover:scale-105 transition-transform"
              >
                Download Summary as PDF
              </button>
            </div>
          )}

          {/* Tekst AI */}
          <div className={`font-montserrat font-medium text-[15px] leading-[160%] tracking-[0.004em] ${isSummary ? 'text-gray-900' : 'text-gray-800'}`}>
            {isSummary ? (
              <div className="whitespace-pre-line">
                {children}
              </div>
            ) : (
              children
            )}
          </div>

          {/* Pozostałe Chipsy - pod napisem */}
          {hasActionChips && (
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => onActionChipClick?.('retry-session')}
                className="px-4 py-2 rounded-full border border-[var(--Primary-7-main)] bg-[var(--Chip-Active)] text-gray-900 cursor-pointer hover:scale-105 transition-transform"
              >
                Take the Session One More Time
              </button>
              <button
                onClick={() => onActionChipClick?.('finish-session')}
                className="px-4 py-2 rounded-full border border-[var(--Primary-7-main)] bg-[var(--Chip-Active)] text-gray-900 cursor-pointer hover:scale-105 transition-transform"
              >
                Finish for Today
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // user bubble → wyrównany do prawej
  return (
    <div className="w-full flex justify-end">
      <div
        className="max-w-[550px] min-h-[64px] 
                   flex items-start gap-[10px] 
                   bg-[#FFFBEC] border border-[#FDE590] 
                   rounded-[24px] px-5 py-5 text-gray-800 text-right"
      >
        {children}
      </div>
    </div>
  );
}
