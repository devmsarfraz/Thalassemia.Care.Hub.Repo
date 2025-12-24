import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Container, Card } from 'react-bootstrap'
import { usersAPI, authAPI } from '../services/api'
import { toast } from 'react-toastify'
import { useAuth } from '../contexts/AuthContext'
import ProfileLayout from '../components/profile/ProfileLayout'
import UserProfileSummary from '../components/profile/UserProfileSummary'
import EditProfileForm from '../components/profile/EditProfileForm'
import ChangePasswordForm from '../components/profile/ChangePasswordForm'
import CollapsibleSection from '../components/profile/CollapsibleSection'
import AssociatedUserCard from '../components/profile/AssociatedUserCard'

const Profile = () => {
  const { id } = useParams()
  const { user: currentUser } = useAuth()
  const [user, setUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [id, currentUser])

  const loadProfile = async () => {
    try {
      const userId = id || currentUser?.userId
      if (!userId) {
        toast.error('User ID not found')
        return
      }
      const response = await usersAPI.getById(userId)
      setUser(response.data)
    } catch (error) {
      toast.error('Failed to load profile')
    }
  }

  const handleUpdateProfile = async (formData, profilePictureFile) => {
    setIsLoading(true)
    try {
      const userId = id || currentUser?.userId

      // Upload profile picture if provided
      if (profilePictureFile) {
        const imageFormData = new FormData()
        imageFormData.append('file', profilePictureFile)
        await usersAPI.uploadProfilePicture(userId, imageFormData)
      }

      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber || null,
        address: formData.address || null,
        bloodGroup: formData.bloodGroup || null,
        gender: formData.gender || null,
        guardianName: formData.guardianName || null,
        guardianNumber: formData.guardianNumber || null
      }

      const response = await usersAPI.update(userId, updateData)
      setUser(response.data)
      setIsEditing(false)
      toast.success('Profile updated successfully')

      // Update current user in context if it's the same user
      if (currentUser?.userId === userId) {
        const userData = localStorage.getItem('userData')
        if (userData) {
          const updatedUserData = { ...JSON.parse(userData), ...response.data }
          localStorage.setItem('userData', JSON.stringify(updatedUserData))
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    loadProfile() // Reload to reset form
  }

  const handlePasswordChange = async (passwordData) => {
    setIsPasswordLoading(true)
    try {
      const email = user?.email || currentUser?.email
      if (!email) {
        toast.error('Email not found')
        return
      }

      const response = await authAPI.updatePassword({
        email,
        currentPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      })

      if (response.status === 200) {
        toast.success('Password updated successfully')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password')
    } finally {
      setIsPasswordLoading(false)
    }
  }

  const handleAssociationChange = async (associationData) => {
    // Reload profile after association
    await loadProfile()
  }

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading profile...</p>
        </div>
      </div>
    )
  }

  const userId = id || currentUser?.userId
  // Check if viewing own profile: no id param OR id matches current user's id
  const isOwnProfile = !id || (currentUser?.userId && (currentUser.userId === parseInt(id) || currentUser.userId.toString() === id))

  // Debug logging
  console.log('Profile Debug:', {
    id,
    currentUserId: currentUser?.userId,
    userId,
    isOwnProfile,
    isEditing
  })

  return (
    <ProfileLayout
      leftContent={
        <>
          <UserProfileSummary
            user={user}
            onEditClick={isOwnProfile ? () => {
              console.log('Edit button clicked, setting isEditing to true')
              setIsEditing(true)
            } : undefined}
          />
          {isOwnProfile && (
            <CollapsibleSection title="Change Password" defaultExpanded={false}>
              <ChangePasswordForm
                onSubmit={handlePasswordChange}
                isLoading={isPasswordLoading}
                collapsible={true}
              />
            </CollapsibleSection>
          )}
        </>
      }
      rightContent={
        <>
          {isEditing && isOwnProfile ? (
            <EditProfileForm
              user={user}
              onSubmit={handleUpdateProfile}
              onCancel={handleCancelEdit}
              isLoading={isLoading}
              currentUserId={userId}
              onAssociationChange={handleAssociationChange}
            />
          ) : (
            <>
              {/* Profile Information View */}
              <Card className="shadow-sm mb-4" style={{ border: 'none', borderRadius: '12px' }}>
                <Card.Header style={{
                  backgroundColor: 'white',
                  border: 'none',
                  padding: '20px 24px',
                  borderRadius: '12px 12px 0 0'
                }}>
                  <h4 className="mb-0" style={{ fontSize: '20px', fontWeight: '600', color: '#1e3a8a' }}>
                    Profile Information
                  </h4>
                </Card.Header>
                <Card.Body style={{ padding: '24px' }}>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <small className="text-muted d-block" style={{ fontSize: '12px' }}>First Name</small>
                      <p className="mb-0" style={{ color: '#111827', fontSize: '16px' }}>
                        {user.firstName || 'Not provided'}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <small className="text-muted d-block" style={{ fontSize: '12px' }}>Last Name</small>
                      <p className="mb-0" style={{ color: '#111827', fontSize: '16px' }}>
                        {user.lastName || 'Not provided'}
                      </p>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <small className="text-muted d-block" style={{ fontSize: '12px' }}>Gender</small>
                      <p className="mb-0" style={{ color: '#111827', fontSize: '16px' }}>
                        {user.gender || 'Not provided'}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <small className="text-muted d-block" style={{ fontSize: '12px' }}>Contact Number</small>
                      <p className="mb-0" style={{ color: '#111827', fontSize: '16px' }}>
                        {user.phoneNumber || 'Not provided'}
                      </p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <small className="text-muted d-block" style={{ fontSize: '12px' }}>Email</small>
                    <p className="mb-0" style={{ color: '#111827', fontSize: '16px' }}>
                      {user.email || 'Not provided'}
                    </p>
                  </div>
                  <div className="mb-3">
                    <small className="text-muted d-block" style={{ fontSize: '12px' }}>Address</small>
                    <p className="mb-0" style={{ color: '#111827', fontSize: '16px' }}>
                      {user.address || 'Not provided'}
                    </p>
                  </div>
                  <div className="mb-3">
                    <small className="text-muted d-block" style={{ fontSize: '12px' }}>Blood Group</small>
                    <p className="mb-0" style={{ color: '#111827', fontSize: '16px' }}>
                      {user.bloodGroup || 'Not provided'}
                    </p>
                  </div>
                  {(user.guardianName || user.guardianNumber) && (
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <small className="text-muted d-block" style={{ fontSize: '12px' }}>Guardian Name</small>
                        <p className="mb-0" style={{ color: '#111827', fontSize: '16px' }}>
                          {user.guardianName || 'Not provided'}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <small className="text-muted d-block" style={{ fontSize: '12px' }}>Guardian Number</small>
                        <p className="mb-0" style={{ color: '#111827', fontSize: '16px' }}>
                          {user.guardianNumber || 'Not provided'}
                        </p>
                      </div>
                    </div>
                  )}
                </Card.Body>
              </Card>

              {/* Associated User Card */}
              {/* Associated User Card - Temporarily Removed
              {isOwnProfile && !isEditing && (
                <AssociatedUserCard
                  associatedUser={user?.associatedUser || null}
                  userRole={user?.role}
                  currentUserId={userId}
                  onAssociationChange={handleAssociationChange}
                />
              )}
              */}
            </>
          )}
        </>
      }
    />
  )
}

export default Profile
