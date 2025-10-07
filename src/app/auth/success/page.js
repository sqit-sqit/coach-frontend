'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// Wyłącz prerendering dla tej strony
export const dynamic = 'force-dynamic'

export default function AuthSuccess() {
  const router = useRouter()
  const [token, setToken] = useState(null)

  useEffect(() => {
    // Pobierz token z URL po stronie klienta
    const urlParams = new URLSearchParams(window.location.search)
    const tokenFromUrl = urlParams.get('token')
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