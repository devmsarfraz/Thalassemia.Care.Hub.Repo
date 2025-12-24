import { Container, Row, Col, Card } from 'react-bootstrap'

const About = () => {
  return (
    <Container className="py-5">
      <Row>
        <Col md={8} className="mx-auto">
          <div className="text-center mb-5">
            <h1 style={{ 
              fontSize: '48px', 
              fontWeight: '700', 
              color: '#1e3a8a',
              marginBottom: '16px'
            }}>
              About Thalassemia Care Hub
            </h1>
            <p style={{ 
              fontSize: '18px', 
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Your comprehensive platform for thalassemia management, support, and community connection
            </p>
          </div>

          <Row className="g-4 mb-5">
            <Col md={6}>
              <Card className="h-100 shadow-sm" style={{ border: 'none', borderRadius: '12px' }}>
                <Card.Body className="p-4">
                  <h3 style={{ color: '#1e3a8a', marginBottom: '16px' }}>Our Mission</h3>
                  <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
                    To provide a comprehensive digital platform that empowers thalassemia patients, 
                    caregivers, and healthcare professionals with the tools, information, and 
                    community support needed for effective disease management and improved quality of life.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="h-100 shadow-sm" style={{ border: 'none', borderRadius: '12px' }}>
                <Card.Body className="p-4">
                  <h3 style={{ color: '#1e3a8a', marginBottom: '16px' }}>Our Vision</h3>
                  <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
                    To become the leading digital healthcare platform for thalassemia care, 
                    fostering a supportive community where patients can access expert guidance, 
                    share experiences, and receive personalized care recommendations.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card className="shadow-sm mb-5" style={{ border: 'none', borderRadius: '12px' }}>
            <Card.Body className="p-5">
              <h2 style={{ color: '#1e3a8a', marginBottom: '24px', textAlign: 'center' }}>
                Key Features
              </h2>
              <Row className="g-4">
                <Col md={4}>
                  <div className="text-center">
                    <div style={{ 
                      fontSize: '48px', 
                      marginBottom: '16px',
                      color: '#ef4444'
                    }}>💬</div>
                    <h4 style={{ color: '#1e3a8a', marginBottom: '12px' }}>AI Chat Assistant</h4>
                    <p style={{ color: '#6b7280' }}>
                      Get instant answers to your questions about thalassemia management 
                      and care from our AI-powered assistant.
                    </p>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="text-center">
                    <div style={{ 
                      fontSize: '48px', 
                      marginBottom: '16px',
                      color: '#ef4444'
                    }}>👥</div>
                    <h4 style={{ color: '#1e3a8a', marginBottom: '12px' }}>Community Support</h4>
                    <p style={{ color: '#6b7280' }}>
                      Connect with other patients and caregivers, share experiences, 
                      and find support in our active community.
                    </p>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="text-center">
                    <div style={{ 
                      fontSize: '48px', 
                      marginBottom: '16px',
                      color: '#ef4444'
                    }}>📰</div>
                    <h4 style={{ color: '#1e3a8a', marginBottom: '12px' }}>Latest News</h4>
                    <p style={{ color: '#6b7280' }}>
                      Stay updated with the latest research, treatment options, 
                      and news in the thalassemia community.
                    </p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="shadow-sm" style={{ border: 'none', borderRadius: '12px', backgroundColor: '#f8f9fa' }}>
            <Card.Body className="p-5">
              <h2 style={{ color: '#1e3a8a', marginBottom: '24px', textAlign: 'center' }}>
                Who We Serve
              </h2>
              <Row className="g-4">
                <Col md={4}>
                  <h4 style={{ color: '#1e3a8a', marginBottom: '12px' }}>Patients</h4>
                  <p style={{ color: '#4b5563' }}>
                    Access personalized care information, track your health, 
                    and connect with healthcare professionals.
                  </p>
                </Col>
                <Col md={4}>
                  <h4 style={{ color: '#1e3a8a', marginBottom: '12px' }}>Caregivers</h4>
                  <p style={{ color: '#4b5563' }}>
                    Find resources, support, and guidance to help you care 
                    for your loved ones with thalassemia.
                  </p>
                </Col>
                <Col md={4}>
                  <h4 style={{ color: '#1e3a8a', marginBottom: '12px' }}>Healthcare Professionals</h4>
                  <p style={{ color: '#4b5563' }}>
                    Access patient management tools, share knowledge, 
                    and collaborate with colleagues.
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default About

