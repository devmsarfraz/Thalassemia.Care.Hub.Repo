import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Form, Button, Alert, Row, Col } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-toastify'
import AuthLayout from '../components/AuthLayout'
import { FaFacebook, FaGoogle, FaLinkedin, FaEye, FaEyeSlash } from 'react-icons/fa'

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    bloodGroup: '',
    roleID: '1', // Default to Patient
    gender: '',
    guardianName: '',
    guardianNumber: ''
  })
  const [error, setError] = useState('')
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { signup, isLoading } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!agreeToTerms) {
      setError('Please agree to the Terms of Service')
      toast.error('Please agree to the Terms of Service')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      toast.error('Passwords do not match')
      return
    }



    // Split full name into first and last name
    const nameParts = formData.fullName.trim().split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''

    const { confirmPassword, fullName, ...signupData } = formData
    const result = await signup({
      ...signupData,
      firstName,
      lastName,
      roleID: parseInt(formData.roleID) // Ensure roleID is a number
    })
    if (result.success) {
      toast.success('Signup successful! Please check your email for verification code.')
      navigate('/verify-email', { state: { email: formData.email } })
    } else {
      setError(result.message || 'Signup failed')
      toast.error(result.message || 'Signup failed')
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
          Welcome!
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#1e3a8a',
          marginBottom: '32px'
        }}>
          Create your account
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
        {/* Full Name - Combined First and Last */}
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
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

        <Form.Group className="mb-3">
          <Form.Control
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
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

        <Form.Group className="mb-3" style={{ position: 'relative' }}>
          <Form.Control
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
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

        <Form.Group className="mb-3" style={{ position: 'relative' }}>
          <Form.Control
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
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
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? (
              <FaEyeSlash style={{ fontSize: '18px' }} />
            ) : (
              <FaEye style={{ fontSize: '18px' }} />
            )}
          </button>
        </Form.Group>



        {/* Terms of Service */}
        <Form.Group className="mb-4">
          <Form.Check
            type="checkbox"
            checked={agreeToTerms}
            onChange={(e) => setAgreeToTerms(e.target.checked)}
            label="I agree to the Terms of Service"
            style={{
              fontSize: '14px',
              color: '#4b5563'
            }}
          />
        </Form.Group>

        {/* Sign Up Button */}
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
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </Button>

        {/* Social Sign Up - Link Tabs */}
        <div className="text-center mb-4">
          <p style={{
            fontSize: '14px',
            color: '#9ca3af',
            marginBottom: '16px'
          }}>
            Or sign up with
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

        {/* Login Link */}
        <div className="text-center">
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
            Already have an account?{' '}
            <Link
              to="/login"
              style={{
                color: '#1e3a8a',
                fontWeight: '600',
                textDecoration: 'none'
              }}
            >
              Login
            </Link>
          </p>
        </div>
      </Form>
    </AuthLayout>
  )
}

export default Signup

