import { useState, useEffect, useRef } from 'react'
import { Form } from 'react-bootstrap'
import { usersAPI } from '../../services/api'
import { toast } from 'react-toastify'

const UserSearchSelect = ({ onSelect, excludeUserId, filterRole, placeholder = 'Search users...' }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const dropdownRef = useRef(null)
  const searchTimeoutRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (searchTerm.length < 2) {
      setUsers([])
      setShowDropdown(false)
      return
    }

    // Debounce search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchUsers()
    }, 300)

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchTerm])

  const searchUsers = async () => {
    setIsLoading(true)
    try {
      const response = await usersAPI.getAll()
      let filteredUsers = response.data || []

      // Filter by excludeUserId
      if (excludeUserId) {
        filteredUsers = filteredUsers.filter(u => u.userId !== excludeUserId)
      }

      // Filter by role if specified
      if (filterRole) {
        filteredUsers = filteredUsers.filter(u => u.role === filterRole)
      }

      // Filter by search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        filteredUsers = filteredUsers.filter(u => {
          const fullName = `${u.firstName} ${u.lastName}`.toLowerCase()
          const email = (u.email || '').toLowerCase()
          return fullName.includes(term) || email.includes(term)
        })
      }

      setUsers(filteredUsers.slice(0, 10)) // Limit to 10 results
      setShowDropdown(filteredUsers.length > 0)
    } catch (error) {
      toast.error('Failed to search users')
      setUsers([])
      setShowDropdown(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelect = (user) => {
    setSelectedUser(user)
    setSearchTerm(`${user.firstName} ${user.lastName}`)
    setShowDropdown(false)
    if (onSelect) {
      onSelect(user)
    }
  }

  const handleClear = () => {
    setSelectedUser(null)
    setSearchTerm('')
    setUsers([])
    setShowDropdown(false)
    if (onSelect) {
      onSelect(null)
    }
  }

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <Form.Group>
        <Form.Control
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => {
            if (users.length > 0) {
              setShowDropdown(true)
            }
          }}
          style={{
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            padding: '12px 16px',
            fontSize: '16px',
            backgroundColor: '#ffffff'
          }}
        />
        {selectedUser && (
          <Button
            variant="link"
            onClick={handleClear}
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              padding: '4px 8px',
              fontSize: '12px',
              color: '#6b7280'
            }}
          >
            Clear
          </Button>
        )}
      </Form.Group>

      {/* Dropdown */}
      {showDropdown && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            maxHeight: '300px',
            overflowY: 'auto',
            zIndex: 1000,
            marginTop: '4px'
          }}
        >
          {isLoading ? (
            <div className="text-center p-3">
              <small className="text-muted">Searching...</small>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center p-3">
              <small className="text-muted">No users found</small>
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user.userId}
                onClick={() => handleSelect(user)}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f3f4f6',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f9fafb'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'white'
                }}
              >
                <div style={{ fontWeight: '500', color: '#111827', fontSize: '14px' }}>
                  {user.firstName} {user.lastName}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  {user.email} • {user.role}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default UserSearchSelect
