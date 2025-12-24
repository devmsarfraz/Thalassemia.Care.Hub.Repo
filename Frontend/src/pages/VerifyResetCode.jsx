import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Form, Button, Alert } from 'react-bootstrap'
import { toast } from 'react-toastify'
import AuthLayout from '../components/AuthLayout'
import { authAPI } from '../services/api'

const VerifyResetCode = () => {
    const [code, setCode] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const location = useLocation()
    const email = location.state?.email

    useEffect(() => {
        if (!email) {
            toast.error('Email not found. Please start the process again.')
            navigate('/forgot-password')
        }
    }, [email, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            if (!code) {
                throw new Error('Please enter verification code')
            }

            await authAPI.verifyResetCode({ email, code })
            toast.success('Code verified successfully!')
            // Navigate to reset password page with email and verified code (implicitly verified by flow)
            navigate('/reset-password', { state: { email } })
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Verification failed')
            toast.error(err.response?.data?.message || err.message || 'Verification failed')
        } finally {
            setIsLoading(false)
        }
    }

    if (!email) return null

    return (
        <AuthLayout>
            <div className="mb-4">
                <h1 style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    color: '#1e3a8a',
                    marginBottom: '8px'
                }}>
                    Verify Code
                </h1>
                <p style={{
                    fontSize: '16px',
                    color: '#6b7280',
                    marginBottom: '32px'
                }}>
                    Please enter the 6-digit code sent to <strong>{email}</strong>
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
                        placeholder="Enter 6-digit Code"
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                        maxLength={6}
                        required
                        style={{
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                            padding: '12px 16px',
                            fontSize: '24px',
                            textAlign: 'center',
                            letterSpacing: '5px',
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
                            Verifying...
                        </>
                    ) : (
                        'Verify Code'
                    )}
                </Button>
            </Form>
        </AuthLayout>
    )
}

export default VerifyResetCode
