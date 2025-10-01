export default function QuickChip({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1 rounded-full border border-gray-300 
                 bg-white 
                 font-montserrat font-normal text-[14px] leading-[130%] 
                 text-[#0D0E11] 
                 hover:bg-gray-100 transition"
    >
      {label}
    </button>
  );
}
