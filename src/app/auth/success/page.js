'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// Wyłącz prerendering dla tej strony
export const dynamic = 'force-dynamic'

export default function AuthSuccess() {
  const router = useRouter()
  const [token, setToken] = useState(null)

  useEffect(() => {
    // Pobierz token z URL po stronie klienta (query lub hash)
    const searchParams = new URLSearchParams(window.location.search)
    let tokenFromUrl = searchParams.get('token') || searchParams.get('access_token')

    if (!tokenFromUrl && typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash
      const hashParams = new URLSearchParams(hash)
      tokenFromUrl = hashParams.get('token') || hashParams.get('access_token')
    }

    setToken(tokenFromUrl)

    if (tokenFromUrl) {
      // Zapisz token w localStorage
      localStorage.setItem('auth_token', tokenFromUrl)
      
      // Przekieruj do dashboard
      router.push('/dashboard')
    } else {
      // Brak tokenu - przekieruj do logowania
      router.push('/')
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Logowanie w toku...</p>
      </div>
    </div>
  )
}