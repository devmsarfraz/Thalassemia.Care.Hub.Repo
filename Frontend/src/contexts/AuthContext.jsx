import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('authToken'))
  const [isAuthenticated, setIsAuthenticated] = useState(!!token)
  const [isLoading, setIsLoading] = useState(false)

  // Load user info from localStorage on mount
  useEffect(() => {
    if (token) {
      const userData = localStorage.getItem('userData')
      if (userData) {
        setUser(JSON.parse(userData))
      }
    }
  }, [token])

  const login = async (email, password) => {
    setIsLoading(true)
    try {
      console.log('Attempting login for:', email)
      const response = await authAPI.login({
        email,
        password
      })

      console.log('Login response:', response.data)

      // Handle successful login response
      if (response.data && response.data.success && response.data.token) {
        const { token, user: userInfo, expiresAt } = response.data

        // Validate required fields
        if (!token) {
          return { success: false, message: 'Login failed: No token received' }
        }

        if (!userInfo) {
          return { success: false, message: 'Login failed: No user information received' }
        }

        // Set authentication state
        setToken(token)
        setUser(userInfo)
        setIsAuthenticated(true)
        localStorage.setItem('authToken', token)
        localStorage.setItem('userData', JSON.stringify(userInfo))
        if (expiresAt) {
          localStorage.setItem('tokenExpiry', expiresAt)
        }
        console.log('Login successful, user:', userInfo)
        return { success: true, user: userInfo }
      }

      // Handle response without success flag (might be error response)
      return {
        success: false,
        message: response.data?.message || 'Login failed: Invalid response format'
      }
    } catch (error) {
      console.error('Login error:', error)

      // More detailed error handling
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        return {
          success: false,
          message: 'Network error: Unable to connect to server. Please ensure the backend is running.'
        }
      }

      if (error.response) {
        // Server responded with error status
        const status = error.response.status
        const errorMessage = error.response?.data?.message || error.message

        if (status === 401) {
          return {
            success: false,
            message: 'Wrong credentials'
          }
        }

        return {
          success: false,
          message: errorMessage || `Login failed with status ${status}`
        }
      }

      return {
        success: false,
        message: error.message || 'Login failed. Please check your credentials and try again.'
      }
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (userData) => {
    setIsLoading(true)
    try {
      const response = await authAPI.signup(userData)
      return { success: response.status === 200, message: response.data.message }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Signup failed'
      }
    } finally {
      setIsLoading(false)
    }
  }

  const verifyEmail = async (email, code) => {
    setIsLoading(true)
    try {
      const response = await authAPI.verifyEmail({ email, code })
      return {
        success: response.data.success,
        message: response.data.message
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Email verification failed'
      }
    } finally {
      setIsLoading(false)
    }
  }

  const resendVerificationEmail = async (email) => {
    setIsLoading(true)
    try {
      const response = await authAPI.resendVerificationEmail({ email })
      return {
        success: response.data.success,
        message: response.data.message
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to resend verification email'
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
    localStorage.removeItem('tokenExpiry')
  }

  const updateProfile = async (userId, userData) => {
    setIsLoading(true)
    try {
      const { usersAPI } = await import('../services/api')
      const response = await usersAPI.update(userId, userData)
      setUser(response.data)
      localStorage.setItem('userData', JSON.stringify(response.data))
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Update failed'
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
        verifyEmail,
        resendVerificationEmail
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

