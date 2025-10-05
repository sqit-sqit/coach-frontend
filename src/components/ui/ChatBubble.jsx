export default function ChatBubble({ role = "user", title, children }) {
  if (role === "assistant") {
    return (
      <div className="w-full flex justify-start">
        <div className="w-[902px] min-h-[24px] flex flex-col gap-2 text-left">
          {/* Nagłówek AI */}
          {title && (
            <p className="font-montserrat font-bold text-[16px] leading-[120%] text-gray-900">
              {title}
            </p>
          )}
          {/* Tekst AI */}
          <div className="font-montserrat font-medium text-[15px] leading-[160%] tracking-[0.004em] text-gray-800">
            {children}
          </div>
        </div>
      </div>
    );
  }

  // user bubble → wyrównany do prawej
  return (
    <div className="w-full flex justify-end">
      <div
        className="max-w-[1132px] min-h-[64px] 
                   flex items-start gap-[10px] 
                   bg-[#FFFBEC] border border-[#FDE590] 
                   rounded-[24px] px-5 py-5 text-gray-800 text-right"
      >
        {children}
      </div>
    </div>
  );
}
