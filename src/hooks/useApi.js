'use client'

import { useAuth } from './useAuth'
import { useCallback } from 'react'

export function useApi() {
  const { token, userId } = useAuth()
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  const apiCall = useCallback(async (endpoint, options = {}) => {
    const url = `${API_URL}${endpoint}`
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const config = {
      ...options,
      headers,
    }

    const response = await fetch(url, config)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response
  }, [token])

  const apiGet = useCallback((endpoint, options = {}) => {
    return apiCall(endpoint, { ...options, method: 'GET' })
  }, [apiCall])

  const apiPost = useCallback((endpoint, data, options = {}) => {
    return apiCall(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    })
  }, [apiCall])

  const apiPostStream = useCallback((endpoint, data, options = {}) => {
    const url = `${API_URL}${endpoint}`
    
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream, text/plain, application/json',
      ...options.headers,
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const config = {
      ...options,
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    }

    return fetch(url, config)
  }, [token])

  return {
    apiCall,
    apiGet,
    apiPost,
    apiPostStream,
    userId,
    token,
    isAuthenticated: !!token
  }
}
