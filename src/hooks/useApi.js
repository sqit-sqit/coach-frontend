'use client'

import { useAuth } from './useAuth'

export function useApi() {
  const { token, userId } = useAuth()
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  const apiCall = async (endpoint, options = {}) => {
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
  }

  const apiGet = (endpoint, options = {}) => {
    return apiCall(endpoint, { ...options, method: 'GET' })
  }

  const apiPost = (endpoint, data, options = {}) => {
    return apiCall(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  const apiPostStream = (endpoint, data, options = {}) => {
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
  }

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
