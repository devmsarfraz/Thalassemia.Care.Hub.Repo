import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const ChangePasswordForm = ({ onSubmit, isLoading = false, collapsible = false }) => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.oldPassword) {
      newErrors.oldPassword = 'Old password is required'
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onSubmit({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      })
      // Reset form after successful submission
      setFormData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    }
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  return (
    <Form onSubmit={handleSubmit}>
      {/* Old Password */}
      <Form.Group className="mb-3" style={{ position: 'relative' }}>
        <Form.Label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
          Old Password <span style={{ color: '#dc2626' }}>*</span>
        </Form.Label>
        <Form.Control
          type={showPasswords.oldPassword ? 'text' : 'password'}
          name="oldPassword"
          value={formData.oldPassword}
          onChange={handleChange}
          required
          placeholder="Enter your current password"
          style={{
            borderRadius: '8px',
            border: errors.oldPassword ? '1px solid #dc2626' : '1px solid #d1d5db',
            padding: '12px 45px 12px 16px',
            fontSize: '16px',
            backgroundColor: '#ffffff'
          }}
        />
        <button
          type="button"
          onClick={() => togglePasswordVisibility('oldPassword')}
          style={{
            position: 'absolute',
            right: '12px',
            top: '42px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            padding: '4px',
            color: '#6b7280'
          }}
        >
          {showPasswords.oldPassword ? (
            <FaEyeSlash style={{ fontSize: '18px' }} />
          ) : (
            <FaEye style={{ fontSize: '18px' }} />
          )}
        </button>
        {errors.oldPassword && (
          <Form.Text className="text-danger" style={{ fontSize: '12px', marginTop: '4px' }}>
            {errors.oldPassword}
          </Form.Text>
        )}
      </Form.Group>

      {/* New Password */}
      <Form.Group className="mb-3" style={{ position: 'relative' }}>
        <Form.Label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
          New Password <span style={{ color: '#dc2626' }}>*</span>
        </Form.Label>
        <Form.Control
          type={showPasswords.newPassword ? 'text' : 'password'}
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          required
          placeholder="Enter your new password"
          style={{
            borderRadius: '8px',
            border: errors.newPassword ? '1px solid #dc2626' : '1px solid #d1d5db',
            padding: '12px 45px 12px 16px',
            fontSize: '16px',
            backgroundColor: '#ffffff'
          }}
        />
        <button
          type="button"
          onClick={() => togglePasswordVisibility('newPassword')}
          style={{
            position: 'absolute',
            right: '12px',
            top: '42px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            padding: '4px',
            color: '#6b7280'
          }}
        >
          {showPasswords.newPassword ? (
            <FaEyeSlash style={{ fontSize: '18px' }} />
          ) : (
            <FaEye style={{ fontSize: '18px' }} />
          )}
        </button>
        {errors.newPassword && (
          <Form.Text className="text-danger" style={{ fontSize: '12px', marginTop: '4px' }}>
            {errors.newPassword}
          </Form.Text>
        )}
      </Form.Group>

      {/* Confirm Password */}
      <Form.Group className="mb-4" style={{ position: 'relative' }}>
        <Form.Label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
          Confirm Password <span style={{ color: '#dc2626' }}>*</span>
        </Form.Label>
        <Form.Control
          type={showPasswords.confirmPassword ? 'text' : 'password'}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          placeholder="Confirm your new password"
          style={{
            borderRadius: '8px',
            border: errors.confirmPassword ? '1px solid #dc2626' : '1px solid #d1d5db',
            padding: '12px 45px 12px 16px',
            fontSize: '16px',
            backgroundColor: '#ffffff'
          }}
        />
        <button
          type="button"
          onClick={() => togglePasswordVisibility('confirmPassword')}
          style={{
            position: 'absolute',
            right: '12px',
            top: '42px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            padding: '4px',
            color: '#6b7280'
          }}
        >
          {showPasswords.confirmPassword ? (
            <FaEyeSlash style={{ fontSize: '18px' }} />
          ) : (
            <FaEye style={{ fontSize: '18px' }} />
          )}
        </button>
        {errors.confirmPassword && (
          <Form.Text className="text-danger" style={{ fontSize: '12px', marginTop: '4px' }}>
            {errors.confirmPassword}
          </Form.Text>
        )}
      </Form.Group>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-100"
        style={{
          backgroundColor: '#1e3a8a',
          border: 'none',
          borderRadius: '8px',
          padding: '12px',
          fontSize: '16px',
          fontWeight: '500'
        }}
      >
        {isLoading ? 'Submitting...' : 'Submit'}
      </Button>
    </Form>
  )
}

export default ChangePasswordForm
