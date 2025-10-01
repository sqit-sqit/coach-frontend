
export default function ValuesLayout({ children, className = "" }) {
  return (
    <div className={`max-w-3xl mx-auto w-full px-6 py-8 ${className}`}>
      {children}
    </div>
  );
}
