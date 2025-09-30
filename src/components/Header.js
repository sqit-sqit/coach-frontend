import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-white text-black p-4 shadow-md">
      <nav className="container mx-auto flex justify-between items-center">
        {/* Lewa strona z logo + nazwą */}
        <div className="flex items-center space-x-6">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="Coach Platform Logo"
              width={150}
              height={50}
              priority
            />
          </Link>
          <Link href="/" className="font-bold text-lg">
            Self-Reflection Space
          </Link>
        </div>

        {/* Prawa strona – menu */}
        <div className="space-x-4">
          <Link href="/">Home</Link>
          <Link href="/dashboard">Dashboard</Link>
        </div>
      </nav>
    </header>
  );
}
