import { useState, useEffect } from 'react'
import { Card, Button, Badge, Alert } from 'react-bootstrap'
import { FaUserFriends, FaTimes, FaCheck, FaClock } from 'react-icons/fa'
import UserSearchSelect from './UserSearchSelect'
import { usersAPI } from '../../services/api'
import { toast } from 'react-toastify'

const AssociatedUserCard = ({ 
  associatedUser, 
  userRole, 
  currentUserId,
  onAssociationChange 
}) => {
  const [isAssociating, setIsAssociating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [pendingRequests, setPendingRequests] = useState([])
  const [sentRequests, setSentRequests] = useState([])
  const [isLoadingRequests, setIsLoadingRequests] = useState(false)

  useEffect(() => {
    if (currentUserId) {
      loadAssociationRequests()
    }
  }, [currentUserId])

  const loadAssociationRequests = async () => {
    setIsLoadingRequests(true)
    try {
      const [pendingRes, sentRes] = await Promise.all([
        usersAPI.getPendingAssociationRequests(currentUserId),
        usersAPI.getSentAssociationRequests(currentUserId)
      ])
      setPendingRequests(pendingRes.data || [])
      setSentRequests(sentRes.data || [])
    } catch (error) {
      console.error('Failed to load association requests:', error)
    } finally {
      setIsLoadingRequests(false)
    }
  }

  const handleCreateRequest = async () => {
    if (!selectedUser) {
      toast.error('Please select a user to associate')
      return
    }

    setIsLoading(true)
    try {
      const requesterId = currentUserId
      const requestedUserId = selectedUser.userId

      const response = await usersAPI.createAssociationRequest({
        requesterId,
        requestedUserId
      })

      if (response.data.success) {
        toast.success('Association request sent successfully')
        setSelectedUser(null)
        setIsAssociating(false)
        await loadAssociationRequests()
        if (onAssociationChange) {
          onAssociationChange(response.data)
        }
      } else {
        toast.error(response.data.message || 'Failed to send association request')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send association request')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAcceptRequest = async (requestId) => {
    setIsLoading(true)
    try {
      const response = await usersAPI.acceptAssociationRequest(requestId, currentUserId)

      if (response.data.success) {
        toast.success('Association request accepted successfully')
        await loadAssociationRequests()
        if (onAssociationChange) {
          onAssociationChange(response.data)
        }
      } else {
        toast.error(response.data.message || 'Failed to accept association request')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept association request')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRejectRequest = async (requestId) => {
    setIsLoading(true)
    try {
      const response = await usersAPI.rejectAssociationRequest(requestId, currentUserId)

      if (response.data.success) {
        toast.success('Association request rejected')
        await loadAssociationRequests()
      } else {
        toast.error(response.data.message || 'Failed to reject association request')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject association request')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveAssociation = async () => {
    // Note: This would require a backend endpoint to remove association
    toast.info('Remove association feature requires backend endpoint')
  }

  // Show pending requests received (for patients to accept/reject)
  const renderPendingRequests = () => {
    if (pendingRequests.length === 0) return null

    return (
      <div className="mt-3">
        <h6 style={{ fontSize: '14px', fontWeight: '600', color: '#1e3a8a', marginBottom: '12px' }}>
          Pending Requests
        </h6>
        {pendingRequests.map((request) => (
          <Card key={request.requestId} className="mb-2" style={{ border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <Card.Body style={{ padding: '12px' }}>
              <div className="d-flex align-items-center justify-content-between">
                <div className="flex-grow-1">
                  <div style={{ fontWeight: '500', color: '#111827', fontSize: '14px' }}>
                    {request.requesterName}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    {request.requesterEmail}
                  </div>
                  <Badge bg="warning" className="mt-1" style={{ fontSize: '11px' }}>
                    <FaClock className="me-1" /> Pending
                  </Badge>
                </div>
                <div className="d-flex gap-2">
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleAcceptRequest(request.requestId)}
                    disabled={isLoading}
                    style={{ fontSize: '12px', padding: '4px 12px' }}
                  >
                    <FaCheck /> Accept
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleRejectRequest(request.requestId)}
                    disabled={isLoading}
                    style={{ fontSize: '12px', padding: '4px 12px' }}
                  >
                    <FaTimes /> Reject
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    )
  }

  // Show sent requests (for caregivers to see status)
  const renderSentRequests = () => {
    if (sentRequests.length === 0) return null

    return (
      <div className="mt-3">
        <h6 style={{ fontSize: '14px', fontWeight: '600', color: '#1e3a8a', marginBottom: '12px' }}>
          Sent Requests
        </h6>
        {sentRequests.map((request) => (
          <Card key={request.requestId} className="mb-2" style={{ border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <Card.Body style={{ padding: '12px' }}>
              <div className="d-flex align-items-center justify-content-between">
                <div className="flex-grow-1">
                  <div style={{ fontWeight: '500', color: '#111827', fontSize: '14px' }}>
                    {request.requestedUserName}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    {request.requestedUserEmail}
                  </div>
                  <Badge bg="warning" className="mt-1" style={{ fontSize: '11px' }}>
                    <FaClock className="me-1" /> Pending
                  </Badge>
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    )
  }

  if (isAssociating) {
    return (
      <Card className="shadow-sm mt-3" style={{ border: 'none', borderRadius: '12px' }}>
        <Card.Body style={{ padding: '20px' }}>
          <h5 className="mb-3" style={{ fontSize: '16px', fontWeight: '600', color: '#1e3a8a' }}>
            Send Association Request
          </h5>
          
          <div className="mb-3">
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
              Search {userRole === 'Caregiver' ? 'Patient' : 'Caregiver'}
            </label>
            <UserSearchSelect
              onSelect={setSelectedUser}
              excludeUserId={currentUserId}
              filterRole={userRole === 'Caregiver' ? 'Patient' : 'Caregiver'}
              placeholder={`Search ${userRole === 'Caregiver' ? 'patients' : 'caregivers'}...`}
            />
          </div>

          <div className="d-flex gap-2">
            <Button
              variant="primary"
              onClick={handleCreateRequest}
              disabled={!selectedUser || isLoading}
              style={{
                backgroundColor: '#1e3a8a',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '14px'
              }}
            >
              {isLoading ? 'Sending...' : 'Send Request'}
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => {
                setIsAssociating(false)
                setSelectedUser(null)
              }}
              style={{
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '14px'
              }}
            >
              Cancel
            </Button>
          </div>
        </Card.Body>
      </Card>
    )
  }

  if (associatedUser) {
    return (
      <Card className="shadow-sm mt-3" style={{ border: 'none', borderRadius: '12px' }}>
        <Card.Body style={{ padding: '20px' }}>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 className="mb-0" style={{ fontSize: '16px', fontWeight: '600', color: '#1e3a8a' }}>
              <FaUserFriends className="me-2" />
              Associated User
            </h5>
            <Button
              variant="link"
              onClick={handleRemoveAssociation}
              style={{
                padding: '4px 8px',
                color: '#dc2626',
                textDecoration: 'none',
                fontSize: '12px'
              }}
            >
              <FaTimes /> Remove
            </Button>
          </div>

          <div className="d-flex align-items-center mb-2">
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: '600',
                marginRight: '12px'
              }}
            >
              {associatedUser.firstName?.[0]}{associatedUser.lastName?.[0]}
            </div>
            <div className="flex-grow-1">
              <div style={{ fontWeight: '500', color: '#111827' }}>
                {associatedUser.firstName} {associatedUser.lastName}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                {associatedUser.email}
              </div>
            </div>
            <Badge bg="success">{associatedUser.role}</Badge>
          </div>

          <div className="mt-3">
            <small className="text-muted" style={{ fontSize: '12px' }}>
              {userRole === 'Caregiver' 
                ? 'You are caring for this patient' 
                : 'This caregiver is associated with you'}
            </small>
          </div>
        </Card.Body>
      </Card>
    )
  }

  return (
    <Card className="shadow-sm mt-3" style={{ border: 'none', borderRadius: '12px' }}>
      <Card.Body style={{ padding: '20px' }}>
        <div className="d-flex align-items-center mb-3">
          <FaUserFriends style={{ fontSize: '20px', color: '#6b7280', marginRight: '12px' }} />
          <h5 className="mb-0" style={{ fontSize: '16px', fontWeight: '600', color: '#1e3a8a' }}>
            Associated User
          </h5>
        </div>

        {/* Show pending requests received */}
        {renderPendingRequests()}

        {/* Show sent requests */}
        {renderSentRequests()}

        {/* Show message if no requests and no association */}
        {pendingRequests.length === 0 && sentRequests.length === 0 && (
          <Alert variant="info" style={{ 
            backgroundColor: '#eff6ff', 
            border: 'none', 
            borderRadius: '8px',
            fontSize: '14px',
            marginBottom: '16px'
          }}>
            {userRole === 'Caregiver'
              ? 'Send an association request to a patient to manage their care'
              : 'No caregiver associated. Caregivers can send you association requests.'}
          </Alert>
        )}

        {userRole === 'Caregiver' && (
          <Button
            variant="outline-primary"
            onClick={() => setIsAssociating(true)}
            className="w-100"
            disabled={isLoadingRequests}
            style={{
              borderColor: '#1e3a8a',
              color: '#1e3a8a',
              borderRadius: '8px',
              padding: '10px',
              fontSize: '14px'
            }}
          >
            Send Association Request
          </Button>
        )}
      </Card.Body>
    </Card>
  )
}

export default AssociatedUserCard
