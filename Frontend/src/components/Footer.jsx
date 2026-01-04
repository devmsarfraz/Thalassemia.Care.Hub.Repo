import { Container, Row, Col } from 'react-bootstrap'

const Footer = () => {
  return (
    <footer className="bg-light mt-5 py-4">
      <Container>
        <Row>
          <Col md={4}>
            <h5>Thalassemia Care Hub</h5>
            <p className="text-muted">
              Your supportive community platform for thalassemia patients and caregivers.
            </p>
          </Col>
          <Col md={4}>
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-decoration-none text-muted">Home</a></li>
              <li><a href="/community" className="text-decoration-none text-muted">Community</a></li>
              <li><a href="/news" className="text-decoration-none text-muted">News</a></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Contact</h5>
            <p className="text-muted">
              Email: support@thalassemiacarehub.com
            </p>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col className="text-center text-muted">
            <p>&copy; 2025 Thalassemia Care Hub. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer

