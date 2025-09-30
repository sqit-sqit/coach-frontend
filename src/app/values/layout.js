"use client";

// import BackButton from "../../components/ui/BackButton";

export default function ValuesLayout({ children }) {
  return (
    <div className="bg-white-100 min-h-screen p-8 relative">
      {
      
      /* <div className="absolute top-4 left-4">
        <BackButton onClick={() => window.history.back()} />
      </div> */
      }

      {children}
    </div>
  );
}
