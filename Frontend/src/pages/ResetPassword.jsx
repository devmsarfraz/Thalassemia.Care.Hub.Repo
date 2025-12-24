import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Form, Button, Alert } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import AuthLayout from '../components/AuthLayout'
import { authAPI } from '../services/api'

const ResetPassword = () => {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const location = useLocation()
    const email = location.state?.email

    useEffect(() => {
        if (!email) {
            toast.error('Email verification required.')
            navigate('/forgot-password')
        }
    }, [email, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        setIsLoading(true)

        try {
            await authAPI.resetPassword({ email, newPassword: password })
            toast.success('Password reset successfully! Please login.')
            navigate('/login')
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to reset password')
            toast.error(err.response?.data?.message || err.message || 'Failed to reset password')
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
                    Reset Password
                </h1>
                <p style={{
                    fontSize: '16px',
                    color: '#6b7280',
                    marginBottom: '32px'
                }}>
                    Create a new password for your account
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
                <Form.Group className="mb-4" style={{ position: 'relative' }}>
                    <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        placeholder="New Password"
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
                    >
                        {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                    </button>
                </Form.Group>

                <Form.Group className="mb-4">
                    <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                            Resetting...
                        </>
                    ) : (
                        'Reset Password'
                    )}
                </Button>
            </Form>
        </AuthLayout>
    )
}

export default ResetPassword
