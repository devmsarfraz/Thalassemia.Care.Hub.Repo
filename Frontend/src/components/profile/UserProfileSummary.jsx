import { Card, Button, Badge } from 'react-bootstrap'
import { API_BASE_URL } from '../../config/api'

const UserProfileSummary = ({ user, onEditClick }) => {
  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    }
    return user?.email?.[0]?.toUpperCase() || 'U'
  }

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'danger'
      case 'doctor':
        return 'primary'
      case 'patient':
        return 'success'
      default:
        return 'secondary'
    }
  }

  return (
    <Card className="shadow-sm" style={{ border: 'none', borderRadius: '12px' }}>
      <Card.Body className="text-center p-4">
        {/* Profile Picture */}
        <div
          className="mx-auto mb-3 d-flex align-items-center justify-content-center"
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: user?.profilePicture ? 'transparent' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            fontSize: '48px',
            fontWeight: '700',
            boxShadow: '0 4px 6px rgba(239, 68, 68, 0.3)',
            overflow: 'hidden'
          }}
        >
          {user?.profilePicture ? (
            <img
              src={`${API_BASE_URL.replace('/api', '')}${user.profilePicture}`}
              alt={user.firstName}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            getInitials()
          )}
        </div>

        {/* User Name */}
        <h4 className="mb-2" style={{ color: '#1e3a8a', fontWeight: '600' }}>
          {user?.firstName} {user?.lastName}
        </h4>

        {/* Role Badge */}
        <Badge
          bg={getRoleColor(user?.role)}
          className="mb-3"
          style={{
            fontSize: '14px',
            padding: '6px 12px',
            borderRadius: '20px'
          }}
        >
          {user?.role || 'User'}
        </Badge>

        {/* Email */}
        <div className="mb-2">
          <small className="text-muted d-block" style={{ fontSize: '12px' }}>Email</small>
          <p className="mb-0" style={{ fontSize: '14px', color: '#4b5563' }}>
            {user?.email || 'N/A'}
          </p>
        </div>

        {/* Phone Number */}
        {user?.phoneNumber && (
          <div className="mb-3">
            <small className="text-muted d-block" style={{ fontSize: '12px' }}>Phone</small>
            <p className="mb-0" style={{ fontSize: '14px', color: '#4b5563' }}>
              {user.phoneNumber}
            </p>
          </div>
        )}

        {/* Edit Profile Button */}
        {onEditClick && (
          <Button
            variant="primary"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log('Button clicked, calling onEditClick')
              if (onEditClick) {
                onEditClick()
              }
            }}
            className="w-100"
            style={{
              backgroundColor: '#1e3a8a',
              border: 'none',
              borderRadius: '8px',
              padding: '10px',
              fontSize: '14px',
              fontWeight: '500',
              marginTop: '16px',
              cursor: 'pointer'
            }}
          >
            Edit Profile
          </Button>
        )}
      </Card.Body>
    </Card>
  )
}

export default UserProfileSummary
