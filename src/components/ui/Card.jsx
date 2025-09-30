export default function Card({ children, className = "" }) {
  return (
    <div className={`p-6 bg-white shadow rounded-2xl ${className}`}>
      {children}
    </div>
  );
}
