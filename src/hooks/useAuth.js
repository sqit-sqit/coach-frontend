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
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('auth_token')
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
