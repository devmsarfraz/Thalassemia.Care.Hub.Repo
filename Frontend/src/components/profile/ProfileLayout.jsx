import { Container, Row, Col } from 'react-bootstrap'

const ProfileLayout = ({ leftContent, rightContent }) => {
  return (
    <Container fluid className="py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Row className="g-4">
        {/* Left Column - Sidebar */}
        <Col md={4} lg={3}>
          {leftContent}
        </Col>
        
        {/* Right Column - Main Content */}
        <Col md={8} lg={9}>
          {rightContent}
        </Col>
      </Row>
    </Container>
  )
}

export default ProfileLayout
