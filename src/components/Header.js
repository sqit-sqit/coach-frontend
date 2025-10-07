'use client';

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../hooks/useAuth";

export default function Header() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const handleGoogleLogin = () => {
    // Przekieruj do backend auth endpoint
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/google`
  }
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

        </div>

        {/* Prawa strona – menu */}
        <div className="space-x-4">
          <Link href="/">Home</Link>
          {isLoading ? (
            <span className="text-gray-500">Loading...</span>
          ) : isAuthenticated ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <span className="text-gray-600 font-medium">
                Welcome, {user?.name || 'User'}
              </span>
              <button
                onClick={logout}
                className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={handleGoogleLogin}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
            >
              Sign in
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
