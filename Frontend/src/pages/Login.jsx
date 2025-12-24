import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Form, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-toastify'
import AuthLayout from '../components/AuthLayout'
import { FaFacebook, FaGoogle, FaLinkedin, FaEye, FaEyeSlash } from 'react-icons/fa'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      toast.error('Please fill in all fields')
      return
    }

    const result = await login(email, password)
    if (result.success) {
      toast.success('Login successful!')
      // Small delay to show toast, then navigate
      setTimeout(() => {
        navigate('/dashboard')
      }, 500)
    } else {
      setError(result.message || 'Login failed')
      toast.error(result.message || 'Login failed')
    }
  }

  return (
    <AuthLayout>
      {/* Navigation Buttons - Top Right */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        display: 'flex',
        gap: '8px'
      }}>
        <Button
          variant="outline-primary"
          onClick={() => navigate('/')}
          style={{
            borderRadius: '8px',
            padding: '6px 16px',
            fontSize: '14px',
            fontWeight: '500',
            border: '1px solid #1e3a8a',
            color: '#1e3a8a',
            backgroundColor: 'white',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#1e3a8a'
            e.target.style.color = 'white'
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'white'
            e.target.style.color = '#1e3a8a'
          }}
        >
          Home
        </Button>
        <Button
          variant="outline-primary"
          onClick={() => navigate('/about')}
          style={{
            borderRadius: '8px',
            padding: '6px 16px',
            fontSize: '14px',
            fontWeight: '500',
            border: '1px solid #1e3a8a',
            color: '#1e3a8a',
            backgroundColor: 'white',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#1e3a8a'
            e.target.style.color = 'white'
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'white'
            e.target.style.color = '#1e3a8a'
          }}
        >
          About
        </Button>
      </div>

      {/* Welcome Message */}
      <div className="mb-4">
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#1e3a8a',
          marginBottom: '8px'
        }}>
          Welcome Back!
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#1e3a8a',
          marginBottom: '32px'
        }}>
          Sign in to your account
        </p>
      </div>

      {error && (
        <Alert variant="danger" style={{
          borderRadius: '8px',
          border: 'none',
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          marginBottom: '24px'
        }}>
          {error}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Control
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              padding: '12px 16px',
              fontSize: '16px',
              backgroundColor: '#ffffff'
            }}
          />
        </Form.Group>

        <Form.Group className="mb-4" style={{ position: 'relative' }}>
          <Form.Control
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              padding: '12px 45px 12px 16px',
              fontSize: '16px',
              backgroundColor: '#ffffff'
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              color: '#6b7280'
            }}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <FaEyeSlash style={{ fontSize: '18px' }} />
            ) : (
              <FaEye style={{ fontSize: '18px' }} />
            )}
          </button>
        </Form.Group>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <span style={{ fontSize: '13px', color: '#6b7280' }}>Having trouble signing in?</span>
          <Link
            to="/forgot-password"
            style={{
              fontSize: '14px',
              color: '#1e3a8a',
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-100"
          disabled={isLoading}
          style={{
            backgroundColor: '#ef4444',
            border: 'none',
            borderRadius: '8px',
            padding: '14px',
            fontSize: '16px',
            fontWeight: '600',
            color: 'white',
            marginBottom: '24px',
            boxShadow: '0 4px 6px rgba(239, 68, 68, 0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#dc2626'
            e.target.style.transform = 'translateY(-2px)'
            e.target.style.boxShadow = '0 6px 8px rgba(239, 68, 68, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#ef4444'
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 4px 6px rgba(239, 68, 68, 0.3)'
          }}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" />
              Logging in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </Form>

      {/* Social Login - Link Tabs */}
      <div className="text-center mb-4">
        <p style={{
          fontSize: '14px',
          color: '#9ca3af',
          marginBottom: '16px'
        }}>
          Or sign in with
        </p>
        <div className="d-flex justify-content-center gap-4">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              color: '#1877f2',
              fontSize: '14px',
              fontWeight: '500',
              padding: '8px 12px',
              borderRadius: '6px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#eff6ff'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent'
            }}
          >
            <FaFacebook style={{ fontSize: '18px' }} />
            <span>Facebook</span>
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              color: '#ea4335',
              fontSize: '14px',
              fontWeight: '500',
              padding: '8px 12px',
              borderRadius: '6px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#fef2f2'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent'
            }}
          >
            <FaGoogle style={{ fontSize: '18px' }} />
            <span>Google</span>
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              color: '#0a66c2',
              fontSize: '14px',
              fontWeight: '500',
              padding: '8px 12px',
              borderRadius: '6px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#eff6ff'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent'
            }}
          >
            <FaLinkedin style={{ fontSize: '18px' }} />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>

      {/* Signup Link */}
      <div className="text-center">
        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
          Don't have an account?{' '}
          <Link
            to="/signup"
            style={{
              color: '#1e3a8a',
              fontWeight: '600',
              textDecoration: 'none'
            }}
          >
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default Login

