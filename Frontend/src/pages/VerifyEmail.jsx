import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Form, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-toastify'
import AuthLayout from '../components/AuthLayout'

const VerifyEmail = () => {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const { verifyEmail, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  // Get email from location state or prompt user
  const email = location.state?.email || ''

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Email is required')
      toast.error('Email is required')
      return
    }

    if (!code || code.length !== 6) {
      setError('Please enter a valid 6-digit verification code')
      toast.error('Please enter a valid 6-digit verification code')
      return
    }

    const result = await verifyEmail(email, code)
    if (result.success) {
      toast.success('Email verified successfully!')
      setTimeout(() => {
        navigate('/login')
      }, 1000)
    } else {
      setError(result.message || 'Verification failed')
      toast.error(result.message || 'Verification failed')
    }
  }

  return (
    <AuthLayout>
      {/* Welcome Message */}
      <div className="mb-4">
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '700', 
          color: '#1e3a8a',
          marginBottom: '8px'
        }}>
          Verify Your Email
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: '#1e3a8a',
          marginBottom: '32px'
        }}>
          We've sent a verification code to<br />
          <strong>{email || 'your email'}</strong>
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
        <Form.Group className="mb-4">
          <Form.Control
            type="text"
            placeholder="Enter 6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            maxLength={6}
            required
            style={{
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              padding: '12px 16px',
              fontSize: '24px',
              backgroundColor: '#ffffff',
              textAlign: 'center',
              letterSpacing: '0.5rem',
              fontWeight: '600'
            }}
          />
          <Form.Text className="text-muted d-block mt-2" style={{ fontSize: '14px' }}>
            Enter the 6-digit code sent to your email
          </Form.Text>
        </Form.Group>

        <Button
          type="submit"
          className="w-100"
          disabled={isLoading || !code}
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
            if (!isLoading && code) {
              e.target.style.backgroundColor = '#dc2626'
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 6px 8px rgba(239, 68, 68, 0.4)'
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#ef4444'
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 4px 6px rgba(239, 68, 68, 0.3)'
          }}
        >
          {isLoading ? 'Verifying...' : 'Verify Email'}
        </Button>
      </Form>

      <div className="text-center">
        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
          Didn't receive the code?{' '}
          <Button
            variant="link"
            onClick={() => navigate('/login')}
            className="p-0"
            style={{
              color: '#1e3a8a',
              fontWeight: '600',
              textDecoration: 'none',
              fontSize: '14px'
            }}
          >
            Back to Login
          </Button>
        </p>
      </div>
    </AuthLayout>
  )
}

export default VerifyEmail

