import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Form, Button, Alert } from 'react-bootstrap'
import { toast } from 'react-toastify'
import AuthLayout from '../components/AuthLayout'
import { authAPI } from '../services/api'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            if (!email) {
                throw new Error('Please enter your email address')
            }

            await authAPI.forgotPassword({ email })
            toast.success('Reset code sent! Please check your email.')
            // Navigate to verification page with email in state
            navigate('/verify-reset-code', { state: { email } })
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to send reset code')
            toast.error(err.response?.data?.message || err.message || 'Failed to send reset code')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AuthLayout>
            {/* Navigation - Top Right */}
            <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px'
            }}>
                <Button
                    variant="outline-primary"
                    onClick={() => navigate('/login')}
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
                    Back to Login
                </Button>
            </div>

            <div className="mb-4">
                <h1 style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    color: '#1e3a8a',
                    marginBottom: '8px'
                }}>
                    Forgot Password?
                </h1>
                <p style={{
                    fontSize: '16px',
                    color: '#6b7280',
                    marginBottom: '32px'
                }}>
                    Enter your email address and we'll send you a code to reset your password.
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
                            Sending Code...
                        </>
                    ) : (
                        'Send Reset Code'
                    )}
                </Button>
            </Form>
        </AuthLayout>
    )
}

export default ForgotPassword
