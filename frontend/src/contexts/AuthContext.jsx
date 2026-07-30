import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '../services/api/auth'

const AuthContext = createContext(null)

/**
 * Authentication context provider.
 *
 * Manages user state using HttpOnly cookies via backend auth API.
 * Never stores JWT in localStorage or sessionStorage.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check auth state on mount by requesting current user profile
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await authApi.getMe()
        if (response?.success && response?.data) {
          setUser(response.data)
          setIsAuthenticated(true)
        } else {
          setUser(null)
          setIsAuthenticated(false)
        }
      } catch (err) {
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = useCallback(async (credentials) => {
    const response = await authApi.login(credentials)
    if (response?.success && response?.data) {
      setUser(response.data)
      setIsAuthenticated(true)
    }
    return response
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch (err) {
      // Ignore logout errors
    } finally {
      setUser(null)
      setIsAuthenticated(false)
    }
  }, [])

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Hook to access auth context.
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
