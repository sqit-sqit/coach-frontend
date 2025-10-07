'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AuthSuccess() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    if (token) {
      // Zapisz token w localStorage
      localStorage.setItem('auth_token', token)
      
      // Przekieruj do dashboard
      router.push('/dashboard')
    } else {
      // Brak tokenu - przekieruj do logowania
      router.push('/')
    }
  }, [token, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Logowanie w toku...</p>
      </div>
    </div>
  )
}