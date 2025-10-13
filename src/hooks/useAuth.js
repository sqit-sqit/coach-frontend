'use client'

import { useState, useEffect } from 'react'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [token, setToken] = useState(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token')
    if (storedToken) {
      setToken(storedToken)
      fetchUserData(storedToken)
    } else {
      setIsLoading(false)
    }

    // Nasłuchuj na zmiany w localStorage (dla sync między kartami i w tej samej karcie)
    const handleStorageChange = (e) => {
      if (e.key === 'auth_token') {
        if (e.newValue) {
          setToken(e.newValue)
          fetchUserData(e.newValue)
        } else {
          setUser(null)
          setToken(null)
          setIsLoading(false)
        }
      }
    }

    // Custom event dla tej samej karty
    const handleAuthChange = (e) => {
      if (e.detail.type === 'login') {
        setToken(e.detail.token)
        fetchUserData(e.detail.token)
      } else if (e.detail.type === 'logout') {
        setUser(null)
        setToken(null)
        setIsLoading(false)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('authChange', handleAuthChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('authChange', handleAuthChange)
    }
  }, [])

  const fetchUserData = async (token) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/me?token=${token}`)
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        // Token nieważny - usuń go
        localStorage.removeItem('auth_token')
        setToken(null)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      localStorage.removeItem('auth_token')
      setToken(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = (newToken) => {
    setToken(newToken)
    localStorage.setItem('auth_token', newToken)
    fetchUserData(newToken)
    
    // Wyślij custom event dla tej samej karty
    window.dispatchEvent(new CustomEvent('authChange', {
      detail: { type: 'login', token: newToken }
    }))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('auth_token')
    
    // Wyślij custom event dla tej samej karty
    window.dispatchEvent(new CustomEvent('authChange', {
      detail: { type: 'logout' }
    }))
    
    // Hard redirect do landing page
    window.location.href = '/'
  }

  const isAuthenticated = !!user && !!token

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout,
    userId: user?.user_id || null
  }
}
