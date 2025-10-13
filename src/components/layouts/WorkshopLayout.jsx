import BackButton from "../ui/BackButton";

export default function WorkshopLayout({ 
  children, 
  className = "",
  width = "default", // "narrow", "default", "wide", "game"
  background = "white", // "white", "gray", "gradient"
  showBackButton = false,
  backButtonProps = {}
}) {
  const widthClasses = {
    narrow: "max-w-3xl",    // Dla tekstów
    default: "max-w-4xl",   // Standard
    wide: "max-w-5xl",      // Dla feedback
    game: "max-w-6xl"       // Dla game
  };
  
  const backgroundClasses = {
    white: "bg-white",
    gray: "bg-gray-50", 
    gradient: "bg-gradient-to-br from-purple-50 to-blue-50"
  };
  
  return (
    <div className={`${backgroundClasses[background]} min-h-screen`}>
      <div className={`${widthClasses[width]} mx-auto w-full px-6 py-8 ${className} relative`}>
        {showBackButton && (
          <div className="absolute top-4 left-4 z-10">
            <BackButton {...backButtonProps} />
          </div>
        )}
        {/* Debug: showBackButton = {showBackButton.toString()} */}
        {children}
      </div>
    </div>
  );
}
