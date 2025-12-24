import { Container, Row, Col } from 'react-bootstrap'

// Blood Drop Icon Component
const BloodDropIcon = ({ size = '20px', color = 'white' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'block' }}
  >
    <path
      d="M12 2C10.5 4 7 7.5 7 12C7 15.866 10.134 19 14 19C17.866 19 21 15.866 21 12C21 7.5 17.5 4 16 2C15.5 1.5 12.5 1.5 12 2Z"
      fill={color}
    />
  </svg>
)

const AuthLayout = ({ children, illustration = true }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexWrap: 'wrap' }}>
      {/* Left Panel - Form */}
      <div 
        className="d-flex align-items-center justify-content-center p-4"
        style={{ 
          background: '#ffffff',
          minHeight: '100vh',
          flex: '1 1 50%',
          minWidth: '300px',
          position: 'relative'
        }}
      >
        <div style={{ maxWidth: '450px', width: '100%', position: 'relative' }}>
          {/* Logo */}
          <div className="mb-4">
            <div className="d-flex align-items-center mb-3">
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px',
                  boxShadow: '0 4px 6px rgba(239, 68, 68, 0.3)'
                }}
              >
                <BloodDropIcon size="24px" color="white" />
              </div>
              <div>
                <div style={{ 
                  fontSize: '20px', 
                  fontWeight: '700', 
                  color: '#1e3a8a',
                  lineHeight: '1.2'
                }}>
                  Thalassemia
                </div>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#1e3a8a',
                  lineHeight: '1.2'
                }}>
                  Care Hub
                </div>
              </div>
            </div>
          </div>
          
          {/* Form Content */}
          {children}
        </div>
      </div>

      {/* Right Panel - Illustration */}
      {illustration && (
        <div 
          className="d-none d-md-flex align-items-center justify-content-center p-5"
          style={{ 
            background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
            minHeight: '100vh',
            position: 'relative',
            overflow: 'hidden',
            flex: '1 1 50%',
            minWidth: '300px'
          }}
        >
          {/* Decorative Elements */}
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            {/* Medical Consultation Illustration Placeholder */}
            <div style={{
              width: '400px',
              height: '400px',
              background: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 255, 255, 0.5)'
            }}>
              {/* Doctor Icon */}
              <div style={{
                fontSize: '120px',
                marginBottom: '20px'
              }}>
                👨‍⚕️
              </div>
              {/* Patient Icon */}
              <div style={{
                fontSize: '100px',
                marginTop: '20px'
              }}>
                👩
              </div>
            </div>
            
            {/* Decorative Text */}
            <div style={{
              marginTop: '40px',
              color: '#1e3a8a',
              fontSize: '24px',
              fontWeight: '600'
            }}>
              Your Health, Our Priority
            </div>
            <div style={{
              marginTop: '10px',
              color: '#3b82f6',
              fontSize: '16px',
              opacity: 0.8
            }}>
              Connect with healthcare professionals and community
            </div>
          </div>

          {/* Background Pattern */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231e3a8a' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            opacity: 0.3
          }} />
        </div>
      )}
    </div>
  )
}

export default AuthLayout

