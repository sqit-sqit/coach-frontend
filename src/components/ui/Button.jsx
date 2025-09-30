export default function Button({
  text = "Button text",
  text2 = "",
  icon = null,
  onClick,
  type = "button",
  disabled = false,
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`relative flex items-center justify-center 
                 w-[177px] h-[42px] 
                 rounded-[24px] border border-[#EDEDF1] 
                 font-medium px-6 py-2.5 gap-4 transition
                 ${
                   disabled
                     ? "bg-[#CECED5] text-gray-500 cursor-not-allowed"
                     : "bg-[#6B7DFC] text-white hover:bg-[#465CFB] active:bg-[#384ACE] focus:bg-[#6B7DFC] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#465CFB]"
                 }`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{text}</span>
      {text2 && <span>{text2}</span>}
    </button>
  );
}
