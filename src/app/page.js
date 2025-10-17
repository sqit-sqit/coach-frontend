'use client'

import Link from "next/link";
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Star, Target, MessageSquare, Heart, Users, TrendingUp, Sparkles } from "lucide-react";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // Sprawdź czy użytkownik jest zalogowany
    const token = localStorage.getItem('auth_token')
    if (token) {
      setIsLoggedIn(true)
      // Pobierz dane użytkownika
      fetchUserData(token)
    }
  }, [])

  const fetchUserData = async (token) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/me?token=${token}`)
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const handleGoogleLogin = () => {
    // Przekieruj do backend auth endpoint
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/google`
  }

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    setIsLoggedIn(false)
    setUser(null)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="text-center py-32 px-4 relative overflow-hidden"
        style={{ 
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="mb-6">
            <span className="inline-block bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
              AI-Powered Coaching Platform
            </span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-extrabold mb-8 text-white leading-tight">
            Discover What<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-400">
              Truly Matters
            </span>
          </h1>
          
          <p className="text-2xl text-white/90 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            Transform your life through AI-powered coaching tools.
            Explore your values, set meaningful goals, and live with purpose.
      </p>
      
      {isLoggedIn ? (
            <div className="space-y-6">
              <div className="inline-block bg-white/20 backdrop-blur-sm rounded-2xl px-8 py-4">
                <p className="text-xl text-white font-semibold">
                  Welcome back, {user?.name || 'Friend'}! 👋
                </p>
              </div>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link
                  href="/dashboard"
                  className="bg-white text-orange-600 px-10 py-4 rounded-xl shadow-2xl hover:shadow-3xl hover:scale-105 transition transform font-bold text-lg"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-white/10 backdrop-blur-sm text-white px-10 py-4 rounded-xl border-2 border-white/30 hover:bg-white/20 transition font-bold text-lg"
                >
                  Logout
                </button>
              </div>
        </div>
      ) : (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    document.getElementById('workshops')?.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }}
                  className="inline-block bg-white text-purple-700 px-12 py-5 rounded-xl shadow-2xl hover:shadow-3xl hover:scale-105 transition transform font-bold text-xl"
                >
                  Start Your Journey →
                </button>
                
                <button
                  onClick={handleGoogleLogin}
                  className="inline-block bg-white/10 backdrop-blur-sm text-white px-12 py-5 rounded-xl border-2 border-white/30 hover:bg-white/20 transition font-bold text-xl"
                >
                  Sign In for Dashboard
                </button>
              </div>
              
              <div className="pt-6">
                <p className="text-white/70 text-sm">No account required to start • Sign in to save your progress</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="text-white/50 text-sm">↓</div>
        </div>
      </section>

      {/* Features / Mini Apps Section */}
      <section id="workshops" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Coaching Tools & Workshops
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Value Workshop */}
            <Link href="/values/init">
              <div
                className="p-8 rounded-xl text-center hover:shadow-xl transition cursor-pointer transform hover:scale-105 relative"
                style={{
                  background: "var(--Primary-1)",
                  border: "2px solid var(--Primary-7-main)",
                }}
              >
                <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  BETA
                </div>
                <Star
                  className="w-12 h-12 mx-auto mb-4"
                  style={{ color: "var(--Secondary-5-main)" }}
                />
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Value Workshop</h3>
                <p className="text-gray-700 mb-4">
                  Discover your core values through guided AI coaching
                </p>
                <div className="text-sm text-gray-600">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Heart className="w-4 h-4" />
                    <span>Deep self-reflection</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>30-40 minutes</span>
                  </div>
                </div>
                <div className="mt-6 text-blue-600 font-semibold">
                  Start Workshop →
                </div>
              </div>
            </Link>


            {/* GROW Model - Coming Soon */}
            <div
              className="p-8 rounded-xl text-center opacity-60"
              style={{
                background: "var(--Primary-1)",
                border: "2px solid var(--Primary-7-main)",
              }}
            >
              <Target
                className="w-12 h-12 mx-auto mb-4"
                style={{ color: "var(--Secondary-5-main)" }}
              />
              <h3 className="text-2xl font-bold mb-3 text-gray-900">GROW Model</h3>
              <p className="text-gray-700 mb-4">
                Set goals and create action plans with AI guidance
              </p>
              <div className="mt-6 inline-block bg-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm font-semibold">
                Coming Soon
              </div>
            </div>

            {/* Chat - Coming Soon */}
            <div
              className="p-8 rounded-xl text-center opacity-60"
              style={{
                background: "var(--Primary-1)",
                border: "2px solid var(--Primary-7-main)",
              }}
            >
              <MessageSquare
                className="w-12 h-12 mx-auto mb-4"
                style={{ color: "var(--Secondary-5-main)" }}
              />
              <h3 className="text-2xl font-bold mb-3 text-gray-900">AI Coach Chat</h3>
              <p className="text-gray-700 mb-4">
                Free-form conversation with your personal AI coach
              </p>
              <div className="mt-6 inline-block bg-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm font-semibold">
                Coming Soon
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4" style={{ background: "var(--Background-yellow)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 text-gray-900">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900">Choose a Workshop</h3>
              <p className="text-gray-700">
                Select a coaching tool that resonates with your current needs
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900">Guided Exploration</h3>
              <p className="text-gray-700">
                Engage with AI-powered questions designed to deepen your self-awareness
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900">Gain Clarity</h3>
              <p className="text-gray-700">
                Receive personalized insights and actionable next steps
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Ready to Begin?
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Start your journey of self-discovery today. No account required.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/values/init"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-blue-700 transition font-semibold text-lg inline-block"
            >
              Start Value Workshop
            </Link>
            
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="bg-gray-100 text-gray-700 px-8 py-4 rounded-lg shadow hover:bg-gray-200 transition font-semibold text-lg inline-block"
              >
                Go to Dashboard
              </Link>
            ) : (
              <button
                onClick={handleGoogleLogin}
                className="bg-gray-100 text-gray-700 px-8 py-4 rounded-lg shadow hover:bg-gray-200 transition font-semibold text-lg inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign In
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Social Proof / Stats Section */}
      <section className="py-12 px-4 border-t border-gray-200 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">People Exploring Values</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">4.8/5</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">30 min</div>
              <div className="text-gray-600">Average Session</div>
            </div>
          </div>
        </div>
    </section>
    </div>
  );
}