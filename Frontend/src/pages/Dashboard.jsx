import { Container, Row, Col, Card } from 'react-bootstrap'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Dashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    )
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h2>Welcome, {user.firstName || ''} {user.lastName || ''}!</h2>
          <p className="text-muted">Here's your overview</p>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={4} className="mb-3">
          <Card>
            <Card.Body>
              <Card.Title>Community Forum</Card.Title>
              <Card.Text>
                View and create posts in the community forum
              </Card.Text>
              <Link to="/community" className="btn btn-primary">
                Go to Community
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-3">
          <Card>
            <Card.Body>
              <Card.Title>AI Chatbot</Card.Title>
              <Card.Text>
                Get instant help from our AI assistant
              </Card.Text>
              <Link to="/chat" className="btn btn-primary">
                Start Chatting
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-3">
          <Card>
            <Card.Body>
              <Card.Title>News & Updates</Card.Title>
              <Card.Text>
                Stay informed about latest developments
              </Card.Text>
              <Link to="/news" className="btn btn-primary">
                Read News
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Dashboard

