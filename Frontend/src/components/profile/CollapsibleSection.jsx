import { useState } from 'react'
import { Card } from 'react-bootstrap'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

const CollapsibleSection = ({ title, children, defaultExpanded = false, onToggle }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  const handleToggle = () => {
    const newState = !isExpanded
    setIsExpanded(newState)
    if (onToggle) {
      onToggle(newState)
    }
  }

  return (
    <Card className="shadow-sm mt-3" style={{ border: 'none', borderRadius: '12px' }}>
      <Card.Header
        onClick={handleToggle}
        style={{
          cursor: 'pointer',
          backgroundColor: 'white',
          border: 'none',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <h5 className="mb-0" style={{ fontSize: '16px', fontWeight: '600', color: '#1e3a8a' }}>
          {title}
        </h5>
        {isExpanded ? (
          <FaChevronUp style={{ color: '#6b7280', fontSize: '14px' }} />
        ) : (
          <FaChevronDown style={{ color: '#6b7280', fontSize: '14px' }} />
        )}
      </Card.Header>
      {isExpanded && (
        <Card.Body style={{ padding: '20px' }}>
          {children}
        </Card.Body>
      )}
    </Card>
  )
}

export default CollapsibleSection
