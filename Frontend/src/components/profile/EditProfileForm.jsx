import { useState, useEffect } from 'react'
import { Card, Button, Form } from 'react-bootstrap'
import FormField from './FormField'
import AssociatedUserCard from './AssociatedUserCard'

import { API_BASE_URL } from '../../config/api'

const EditProfileForm = ({ user, onSubmit, onCancel, isLoading = false, currentUserId, onAssociationChange }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    bloodGroup: '',
    gender: '',
    guardianName: '',
    guardianNumber: ''
  })
  const [errors, setErrors] = useState({})
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
        bloodGroup: user.bloodGroup || '',
        gender: user.gender || '',
        guardianName: user.guardianName || '',
        guardianNumber: user.guardianNumber || ''
      })
      if (user.profilePicture) {
        // Assume backend returns relative path, prepend API base URL if needed or just use as is
        // But for preview of NEW file we use object URL.
        // For existing file, we can show it, but usually this form is for updating.
      }
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData, selectedFile)
    }
  }

  const bloodGroupOptions = [
    { value: '', label: 'Select Blood Group' },
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' }
  ]

  const genderOptions = [
    { value: '', label: 'Select Gender' },
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' }
  ]

  return (
    <>
      <Card className="shadow-sm" style={{ border: 'none', borderRadius: '12px' }}>
        <Card.Body style={{ padding: '24px' }}>
          <h4 className="mb-4" style={{ fontSize: '20px', fontWeight: '600', color: '#1e3a8a' }}>
            Edit Profile
          </h4>

          <Form onSubmit={handleSubmit}>
            {/* Profile Picture Upload */}
            <div className="mb-4 text-center">
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  backgroundColor: '#f3f4f6',
                  margin: '0 auto 16px',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #e5e7eb'
                }}
              >
                {previewUrl || user?.profilePicture ? (
                  <img
                    src={previewUrl || (user?.profilePicture ? `${API_BASE_URL.replace('/api', '')}${user.profilePicture}` : null)}
                    alt="Profile"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span style={{ fontSize: '32px', color: '#9ca3af' }}>
                    {formData.firstName?.[0]}{formData.lastName?.[0]}
                  </span>
                )}
              </div>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label className="btn btn-outline-primary btn-sm" style={{ cursor: 'pointer' }}>
                  Change Photo
                  <Form.Control type="file" onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
                </Form.Label>
                {selectedFile && <div className="text-muted small mt-1">{selectedFile.name}</div>}
              </Form.Group>
            </div>

            {/* Full Name - Split into First and Last */}
            <div className="row">
              <div className="col-md-6">
                <FormField
                  label="First Name"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                  required
                  placeholder="Enter first name"
                />
              </div>
              <div className="col-md-6">
                <FormField
                  label="Last Name"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                  required
                  placeholder="Enter last name"
                />
              </div>
            </div>

            {/* Gender */}
            <FormField
              label="Gender"
              as="select"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              error={errors.gender}
              options={genderOptions}
            />

            {/* Contact Number */}
            <FormField
              label="Contact Number"
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              error={errors.phoneNumber}
              placeholder="Enter contact number"
            />

            {/* Email (Read-only) */}
            <FormField
              label="Email"
              type="email"
              name="email"
              value={user?.email || ''}
              disabled
              placeholder="Email address"
            />

            {/* Address */}
            <FormField
              label="Address"
              as="textarea"
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={errors.address}
              placeholder="Enter your address"
              rows={3}
            />

            {/* Blood Group */}
            <FormField
              label="Blood Group"
              as="select"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              error={errors.bloodGroup}
              options={bloodGroupOptions}
            />

            {/* Guardian Name */}
            <FormField
              label="Guardian Name"
              type="text"
              name="guardianName"
              value={formData.guardianName}
              onChange={handleChange}
              error={errors.guardianName}
              placeholder="Enter guardian name (optional)"
            />

            {/* Guardian Number */}
            <FormField
              label="Guardian Phone Number"
              type="tel"
              name="guardianNumber"
              value={formData.guardianNumber}
              onChange={handleChange}
              error={errors.guardianNumber}
              placeholder="Enter guardian phone number (optional)"
            />

            {/* Action Buttons */}
            <div className="d-flex gap-2 mt-4">
              <Button
                type="submit"
                disabled={isLoading}
                style={{
                  backgroundColor: '#ef4444',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
              <Button
                type="button"
                variant="outline-secondary"
                onClick={onCancel}
                disabled={isLoading}
                style={{
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: '500',
                  borderColor: '#d1d5db',
                  color: '#6b7280'
                }}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Associated User Card - Only show if user has role that can associate */}
      {(user?.role === 'Caregiver' || user?.role === 'Patient') && (
        <AssociatedUserCard
          associatedUser={null} // Will be loaded from backend if available
          userRole={user?.role}
          currentUserId={currentUserId}
          onAssociationChange={onAssociationChange}
        />
      )}
    </>
  )
}

export default EditProfileForm
