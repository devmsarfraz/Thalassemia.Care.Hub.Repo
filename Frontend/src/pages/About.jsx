import { Container, Row, Col, Card, Badge } from 'react-bootstrap'
import { FaHeart, FaUsers, FaLightbulb, FaCheckCircle, FaAward, FaGlobe, FaHandsHelping } from 'react-icons/fa'

const About = () => {
  const teamMembers = [
    { name: 'Dr. Sarah Johnson', role: 'Medical Director', icon: '👩‍⚕️' },
    { name: 'Ahmed Rahman', role: 'Community Manager', icon: '👨‍💼' },
    { name: 'Lisa Chen', role: 'AI Specialist', icon: '👩‍💻' },
    { name: 'Michael Torres', role: 'Patient Advocate', icon: '👨‍⚕️' }
  ]

  const milestones = [
    { year: '2023', title: 'Platform Launch', description: 'Launched with basic community features' },
    { year: '2024', title: 'AI Integration', description: 'Added AI chatbot for instant support' },
    { year: '2025', title: 'Global Expansion', description: 'Reached 10,000+ active users worldwide' },
    { year: '2026', title: 'Advanced Features', description: 'Comprehensive resource library and analytics' }
  ]

  return (
    <Container className="py-5">
      {/* Hero Section */}
      <div className="text-center mb-5 fade-in">
        <Badge bg="primary" className="mb-3 px-3 py-2 rounded-pill">About Us</Badge>
        <h1 className="display-4 fw-bold mb-3" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Thalassemia Care Hub
        </h1>
        <p className="lead text-muted mx-auto" style={{ maxWidth: '700px', lineHeight: '1.8' }}>
          Your comprehensive platform for thalassemia management, support, and community connection
        </p>
      </div>

      {/* Mission & Vision */}
      <Row className="g-4 mb-5">
        <Col md={6}>
          <Card className="h-100 border-0 shadow-sm" style={{
            borderLeft: '4px solid #667eea',
            transition: 'all 0.3s ease'
          }}>
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-3">
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '16px'
                }}>
                  <FaHeart color="white" size={24} />
                </div>
                <h3 className="mb-0 fw-bold">Our Mission</h3>
              </div>
              <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
                To provide a comprehensive digital platform that empowers thalassemia patients,
                caregivers, and healthcare professionals with the tools, information, and
                community support needed for effective disease management and improved quality of life.
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100 border-0 shadow-sm" style={{
            borderLeft: '4px solid #10b981',
            transition: 'all 0.3s ease'
          }}>
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-3">
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '16px'
                }}>
                  <FaLightbulb color="white" size={24} />
                </div>
                <h3 className="mb-0 fw-bold">Our Vision</h3>
              </div>
              <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
                To become the leading digital healthcare platform for thalassemia care,
                fostering a supportive community where patients can access expert guidance,
                share experiences, and receive personalized care recommendations.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Key Features */}
      <Card className="border-0 shadow-sm mb-5">
        <Card.Body className="p-5">
          <h2 className="text-center mb-5 fw-bold" style={{ color: '#1e3a8a' }}>
            Key Features
          </h2>
          <Row className="g-4">
            <Col md={4}>
              <div className="text-center">
                <div style={{
                  fontSize: '64px',
                  marginBottom: '16px',
                  filter: 'grayscale(0%)'
                }}>💬</div>
                <h4 className="fw-bold mb-3" style={{ color: '#1e3a8a' }}>AI Chat Assistant</h4>
                <p style={{ color: '#6b7280', lineHeight: '1.7' }}>
                  Get instant answers to your questions about thalassemia management
                  and care from our AI-powered assistant.
                </p>
              </div>
            </Col>
            <Col md={4}>
              <div className="text-center">
                <div style={{
                  fontSize: '64px',
                  marginBottom: '16px'
                }}>👥</div>
                <h4 className="fw-bold mb-3" style={{ color: '#1e3a8a' }}>Community Support</h4>
                <p style={{ color: '#6b7280', lineHeight: '1.7' }}>
                  Connect with other patients and caregivers, share experiences,
                  and find support in our active community.
                </p>
              </div>
            </Col>
            <Col md={4}>
              <div className="text-center">
                <div style={{
                  fontSize: '64px',
                  marginBottom: '16px'
                }}>📰</div>
                <h4 className="fw-bold mb-3" style={{ color: '#1e3a8a' }}>Latest News</h4>
                <p style={{ color: '#6b7280', lineHeight: '1.7' }}>
                  Stay updated with the latest research, treatment options,
                  and news in the thalassemia community.
                </p>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Our Team */}
      <div className="mb-5">
        <h2 className="text-center mb-4 fw-bold" style={{ color: '#1e3a8a' }}>
          Meet Our Team
        </h2>
        <p className="text-center text-muted mb-5">
          Dedicated professionals committed to supporting the thalassemia community
        </p>
        <Row className="g-4">
          {teamMembers.map((member, index) => (
            <Col md={3} sm={6} key={index}>
              <Card className="border-0 shadow-sm text-center h-100" style={{
                transition: 'all 0.3s ease'
              }}>
                <Card.Body className="p-4">
                  <div style={{
                    fontSize: '64px',
                    marginBottom: '16px'
                  }}>
                    {member.icon}
                  </div>
                  <h5 className="fw-bold mb-1">{member.name}</h5>
                  <p className="text-muted small mb-0">{member.role}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Timeline */}
      <div className="mb-5">
        <h2 className="text-center mb-4 fw-bold" style={{ color: '#1e3a8a' }}>
          Our Journey
        </h2>
        <p className="text-center text-muted mb-5">
          Key milestones in our mission to support thalassemia patients
        </p>
        <Row className="g-4">
          {milestones.map((milestone, index) => (
            <Col md={3} sm={6} key={index}>
              <Card className="border-0 shadow-sm h-100" style={{
                borderTop: '4px solid #667eea',
                transition: 'all 0.3s ease'
              }}>
                <Card.Body className="p-4">
                  <Badge bg="primary" className="mb-3 px-3 py-2">{milestone.year}</Badge>
                  <h5 className="fw-bold mb-2">{milestone.title}</h5>
                  <p className="text-muted small mb-0">{milestone.description}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Trust Indicators */}
      <Card className="border-0 shadow-sm" style={{
        background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)'
      }}>
        <Card.Body className="p-5">
          <h2 className="text-center mb-4 fw-bold" style={{ color: '#1e3a8a' }}>
            Trusted by Healthcare Professionals
          </h2>
          <Row className="g-4 align-items-center justify-content-center">
            <Col md={3} sm={6} className="text-center">
              <div className="d-flex flex-column align-items-center">
                <FaAward size={48} style={{ color: '#667eea', marginBottom: '12px' }} />
                <h4 className="fw-bold mb-1">WHO</h4>
                <p className="text-muted small mb-0">Recognized Guidelines</p>
              </div>
            </Col>
            <Col md={3} sm={6} className="text-center">
              <div className="d-flex flex-column align-items-center">
                <FaGlobe size={48} style={{ color: '#10b981', marginBottom: '12px' }} />
                <h4 className="fw-bold mb-1">TIF</h4>
                <p className="text-muted small mb-0">Partner Organization</p>
              </div>
            </Col>
            <Col md={3} sm={6} className="text-center">
              <div className="d-flex flex-column align-items-center">
                <FaHandsHelping size={48} style={{ color: '#f59e0b', marginBottom: '12px' }} />
                <h4 className="fw-bold mb-1">CDC</h4>
                <p className="text-muted small mb-0">Verified Resources</p>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Who We Serve */}
      <Card className="border-0 shadow-sm mt-5" style={{ backgroundColor: '#f8f9fa' }}>
        <Card.Body className="p-5">
          <h2 className="text-center mb-5 fw-bold" style={{ color: '#1e3a8a' }}>
            Who We Serve
          </h2>
          <Row className="g-4">
            <Col md={4}>
              <div className="d-flex align-items-start">
                <FaCheckCircle size={24} style={{ color: '#10b981', marginRight: '12px', marginTop: '4px', flexShrink: 0 }} />
                <div>
                  <h4 className="fw-bold mb-2" style={{ color: '#1e3a8a' }}>Patients</h4>
                  <p style={{ color: '#4b5563' }}>
                    Access personalized care information, track your health,
                    and connect with healthcare professionals.
                  </p>
                </div>
              </div>
            </Col>
            <Col md={4}>
              <div className="d-flex align-items-start">
                <FaCheckCircle size={24} style={{ color: '#10b981', marginRight: '12px', marginTop: '4px', flexShrink: 0 }} />
                <div>
                  <h4 className="fw-bold mb-2" style={{ color: '#1e3a8a' }}>Caregivers</h4>
                  <p style={{ color: '#4b5563' }}>
                    Find resources, support, and guidance to help you care
                    for your loved ones with thalassemia.
                  </p>
                </div>
              </div>
            </Col>
            <Col md={4}>
              <div className="d-flex align-items-start">
                <FaCheckCircle size={24} style={{ color: '#10b981', marginRight: '12px', marginTop: '4px', flexShrink: 0 }} />
                <div>
                  <h4 className="fw-bold mb-2" style={{ color: '#1e3a8a' }}>Healthcare Professionals</h4>
                  <p style={{ color: '#4b5563' }}>
                    Access patient management tools, share knowledge,
                    and collaborate with colleagues.
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <style jsx>{`
        .fade-in {
          animation: fadeIn 0.8s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </Container>
  )
}

export default About

