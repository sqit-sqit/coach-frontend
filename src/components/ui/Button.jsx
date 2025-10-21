import { twMerge } from 'tailwind-merge';

export default function Button({
  text = "Button text",
  text2 = "",
  icon = null,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}) {
  const baseClasses = `relative flex items-center justify-center 
                   w-[177px] h-[42px] 
                   rounded-[24px] border border-[#EDEDF1] 
                   font-medium px-6 py-2.5 gap-4 transition`;

  const disabledClasses = "bg-[#CECED5] text-gray-500 cursor-not-allowed";
  
  const enabledClasses = "bg-[#6B7DFC] text-white hover:bg-[#465CFB] active:bg-[#384ACE] focus:bg-[#6B7DFC] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#465CFB]";

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={twMerge(
        baseClasses,
        disabled ? disabledClasses : enabledClasses,
        className
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{text}</span>
      {text2 && <span>{text2}</span>}
    </button>
  );
}
