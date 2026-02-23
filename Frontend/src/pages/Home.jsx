import { useState, useEffect, useRef } from 'react'
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { postsAPI, newsAPI } from '../services/api'
import { FaRobot, FaUsers, FaNewspaper, FaHeart, FaUserPlus, FaComments, FaLightbulb, FaBell, FaCheckCircle, FaQuoteLeft, FaArrowRight, FaClock, FaUser } from 'react-icons/fa'
import './Home.css'

const Home = () => {
  const { isAuthenticated } = useAuth()

  const statsSectionRef = useRef(null)
  const whyChooseTextRef = useRef(null)
  const whyChooseCardRef = useRef(null)
  const howItWorksTitleRef = useRef(null)
  const howItWorksStepsRef = useRef(null)
  const communityTitleRef = useRef(null)
  const communityCardsRef = useRef(null)
  const testimonialsTitleRef = useRef(null)
  const testimonialsCardsRef = useRef(null)
  const blogTitleRef = useRef(null)
  const blogCardsRef = useRef(null)
  const ctaRef = useRef(null)
  const [communityPosts, setCommunityPosts] = useState([])
  const [blogPosts, setBlogPosts] = useState([])
  const [filteredBlogPosts, setFilteredBlogPosts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isLoadingPosts, setIsLoadingPosts] = useState(true)
  const [isLoadingBlogs, setIsLoadingBlogs] = useState(true)

  // Scroll-triggered animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    const refs = [
      statsSectionRef,
      whyChooseTextRef,
      whyChooseCardRef,
      howItWorksTitleRef,
      howItWorksStepsRef,
      communityTitleRef,
      communityCardsRef,
      testimonialsTitleRef,
      testimonialsCardsRef,
      blogTitleRef,
      blogCardsRef,
      ctaRef
    ]

    refs.forEach((ref) => {
      if (ref.current) observer.observe(ref.current)
    })

    return () => observer.disconnect()
  }, [isLoadingPosts, isLoadingBlogs])

  // Fetch community posts
  useEffect(() => {
    const fetchCommunityPosts = async () => {
      try {
        const response = await postsAPI.getAll()
        // Get latest 3 posts
        const latestPosts = response.data.slice(0, 3)
        setCommunityPosts(latestPosts)
      } catch (error) {
        console.error('Error fetching community posts:', error)
      } finally {
        setIsLoadingPosts(false)
      }
    }
    fetchCommunityPosts()
  }, [])

  // Fetch blog posts
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await newsAPI.getAll()
        setBlogPosts(response.data)
        setFilteredBlogPosts(response.data)
      } catch (error) {
        console.error('Error fetching blog posts:', error)
      } finally {
        setIsLoadingBlogs(false)
      }
    }
    fetchBlogPosts()
  }, [])

  // Filter blog posts by category
  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredBlogPosts(blogPosts)
    } else {
      setFilteredBlogPosts(blogPosts.filter(post => post.category === selectedCategory))
    }
  }, [selectedCategory, blogPosts])

  // Get unique categories from blog posts
  const categories = ['All', ...new Set(blogPosts.map(post => post.category).filter(Boolean))]

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // Truncate text helper
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <>
      {/* Modern Hero Section */}
      <section className="hero-modern">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Container>
            <Row className="align-items-center min-vh-50 py-5">
              <Col lg={6} className="hero-text-content">
                <h1 className="display-3 fw-bold mb-4" style={{ lineHeight: '1.2' }}>
                  Welcome to <span className="text-warning hero-highlight">Thalassemia</span> Care Hub
                </h1>
                <p className="lead mb-4" style={{ fontSize: '1.25rem', opacity: 0.95 }}>
                  Your supportive community platform connecting patients, caregivers, and healthcare professionals
                </p>
                {!isAuthenticated && (
                  <div className="d-flex gap-3 flex-wrap hero-buttons">
                    <Button
                      as={Link}
                      to="/signup"
                      size="lg"
                      className="btn-modern btn-modern-primary px-4 py-3"
                      style={{ fontSize: '1.1rem' }}
                    >
                      Get Started Free
                    </Button>
                    <Button
                      as={Link}
                      to="/login"
                      variant="outline-light"
                      size="lg"
                      className="px-4 py-3"
                      style={{ fontSize: '1.1rem', borderWidth: '2px' }}
                    >
                      Sign In
                    </Button>
                  </div>
                )}
              </Col>
              <Col lg={6} className="text-center">
                <div className="hero-image-container">
                  <img
                    src="/hero_medical_care.webp"
                    alt="Thalassemia Care"
                    className="hero-medical-image"
                    style={{ maxWidth: '100%', height: 'auto', borderRadius: '20px' }}
                  />
                  <div className="hero-image-decoration"></div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-5" style={{ background: 'var(--bg-primary)' }}>
        <Container>
          <Row ref={statsSectionRef} className="g-4 animate-on-scroll-stagger">
            <Col md={3} sm={6}>
              <div className="stats-card text-center">
                <div className="stats-number">500+</div>
                <p className="text-muted mb-0 fw-semibold">Active Users</p>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="stats-card text-center" style={{ borderLeftColor: 'var(--accent-green)' }}>
                <div className="stats-number">1,200+</div>
                <p className="text-muted mb-0 fw-semibold">Community Posts</p>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="stats-card text-center" style={{ borderLeftColor: 'var(--accent-blue)' }}>
                <div className="stats-number">3,500+</div>
                <p className="text-muted mb-0 fw-semibold">AI Chat Sessions</p>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="stats-card text-center" style={{ borderLeftColor: 'var(--accent-pink)' }}>
                <div className="stats-number">98%</div>
                <p className="text-muted mb-0 fw-semibold">Satisfaction Rate</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Why Choose Us Section */}
      <section className="section-modern" style={{ background: 'var(--bg-secondary)' }}>
        <Container>
          <Row className="align-items-center">
            <Col ref={whyChooseTextRef} lg={6} className="animate-slide-left mb-4 mb-lg-0">
              <h2 className="section-title gradient-text">Why Choose Thalassemia Care Hub?</h2>
              <p className="lead text-muted mb-4">
                We understand the challenges of living with thalassemia. Our platform is designed to provide comprehensive support, reliable information, and a caring community.
              </p>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-start gap-3">
                  <FaCheckCircle className="text-success mt-1" style={{ fontSize: '1.5rem', flexShrink: 0 }} />
                  <div>
                    <h5 className="mb-1 fw-bold">Expert-Backed Information</h5>
                    <p className="text-muted mb-0">AI-powered chatbot trained on verified medical resources</p>
                  </div>
                </div>
                <div className="d-flex align-items-start gap-3">
                  <FaCheckCircle className="text-success mt-1" style={{ fontSize: '1.5rem', flexShrink: 0 }} />
                  <div>
                    <h5 className="mb-1 fw-bold">Supportive Community</h5>
                    <p className="text-muted mb-0">Connect with others who understand your journey</p>
                  </div>
                </div>
                <div className="d-flex align-items-start gap-3">
                  <FaCheckCircle className="text-success mt-1" style={{ fontSize: '1.5rem', flexShrink: 0 }} />
                  <div>
                    <h5 className="mb-1 fw-bold">Latest Updates</h5>
                    <p className="text-muted mb-0">Stay informed about research breakthroughs and treatments</p>
                  </div>
                </div>
              </div>
            </Col>
            <Col ref={whyChooseCardRef} lg={6} className="animate-on-scroll">
              <div className="modern-card p-4" style={{ background: 'var(--primary-gradient)', color: 'white' }}>
                <Row className="g-3">
                  <Col xs={6}>
                    <div className="text-center p-3" style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-lg)' }}>
                      <FaUsers style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }} />
                      <p className="mb-0 fw-semibold">Community</p>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="text-center p-3" style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-lg)' }}>
                      <FaRobot style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }} />
                      <p className="mb-0 fw-semibold">AI Assistant</p>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="text-center p-3" style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-lg)' }}>
                      <FaNewspaper style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }} />
                      <p className="mb-0 fw-semibold">Latest News</p>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="text-center p-3" style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-lg)' }}>
                      <FaHeart style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }} />
                      <p className="mb-0 fw-semibold">Care & Support</p>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="section-modern">
        <Container>
          <div ref={howItWorksTitleRef} className="text-center mb-5 section-title-animate">
            <h2 className="section-title gradient-text">How It Works</h2>
            <p className="section-subtitle section-subtitle-animate">
              Get started in four simple steps
            </p>
          </div>
          <Row ref={howItWorksStepsRef} className="g-4 animate-on-scroll-stagger">
            <Col md={3} sm={6}>
              <div className="how-it-works-step text-center">
                <div className="step-number mx-auto mb-3">1</div>
                <div className="step-icon mx-auto mb-3">
                  <FaUserPlus />
                </div>
                <h5 className="fw-bold mb-2">Sign Up Free</h5>
                <p className="text-muted mb-0">Create your account in seconds with just your email</p>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="how-it-works-step text-center">
                <div className="step-number mx-auto mb-3" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>2</div>
                <div className="step-icon mx-auto mb-3" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                  <FaComments />
                </div>
                <h5 className="fw-bold mb-2">Join Community</h5>
                <p className="text-muted mb-0">Connect with others and share your experiences</p>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="how-it-works-step text-center">
                <div className="step-number mx-auto mb-3" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>3</div>
                <div className="step-icon mx-auto mb-3" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
                  <FaLightbulb />
                </div>
                <h5 className="fw-bold mb-2">Get AI Support</h5>
                <p className="text-muted mb-0">Ask questions and get instant expert answers</p>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="how-it-works-step text-center">
                <div className="step-number mx-auto mb-3" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>4</div>
                <div className="step-icon mx-auto mb-3" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                  <FaBell />
                </div>
                <h5 className="fw-bold mb-2">Stay Updated</h5>
                <p className="text-muted mb-0">Receive latest news and research updates</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>



      {/* Community Posts Section */}
      <section className="section-modern">
        <Container>
          <div ref={communityTitleRef} className="text-center mb-5 section-title-animate">
            <h2 className="section-title gradient-text">Community Highlights</h2>
            <p className="section-subtitle section-subtitle-animate">
              Recent posts from our community members
            </p>
          </div>
          {isLoadingPosts ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : communityPosts.length > 0 ? (
            <>
              <Row ref={communityCardsRef} className="g-4 animate-on-scroll-stagger">
                {communityPosts.map((post) => (
                  <Col md={4} key={post.postId}>
                    <div className="community-post-card">
                      <div className="d-flex align-items-center mb-3">
                        <div className="post-avatar me-2">
                          <FaUser />
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-0 fw-bold">{post.user?.firstName} {post.user?.lastName}</h6>
                          <small className="text-muted d-flex align-items-center gap-1">
                            <FaClock size={12} />
                            {formatDate(post.creationDate)}
                          </small>
                        </div>
                      </div>
                      <h5 className="fw-bold mb-2">{truncateText(post.postTitle, 60)}</h5>
                      <p className="text-muted mb-3" style={{ lineHeight: '1.6' }}>
                        {truncateText(post.postContent, 120)}
                      </p>
                      {post.category && (
                        <Badge bg="primary" className="mb-3">{post.category}</Badge>
                      )}
                      <Button
                        as={Link}
                        to="/community"
                        variant="link"
                        className="p-0 text-decoration-none d-flex align-items-center gap-1"
                        style={{ fontSize: '0.9rem' }}
                      >
                        View in Community <FaArrowRight size={12} />
                      </Button>
                    </div>
                  </Col>
                ))}
              </Row>
              <div className="text-center mt-4">
                <Button as={Link} to="/community" className="btn-modern btn-modern-primary px-4">
                  View All Community Posts
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-5">
              <p className="text-muted">No community posts yet. Be the first to share!</p>
              {isAuthenticated && (
                <Button as={Link} to="/community" className="btn-modern btn-modern-primary">
                  Create a Post
                </Button>
              )}
            </div>
          )}
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="section-modern">
        <Container>
          <div ref={testimonialsTitleRef} className="text-center mb-5 section-title-animate">
            <h2 className="section-title gradient-text">What Our Community Says</h2>
            <p className="section-subtitle section-subtitle-animate">
              Real stories from real people in our community
            </p>
          </div>
          <Row ref={testimonialsCardsRef} className="g-4 animate-on-scroll-stagger">
            <Col md={4}>
              <div className="testimonial-card">
                <div className="quote-icon mb-3">
                  <FaQuoteLeft />
                </div>
                <p className="testimonial-text mb-4">
                  "This platform has been a lifeline for me. The AI chatbot helped me understand my treatment better, and the community support is incredible. I don't feel alone anymore."
                </p>
                <div className="d-flex align-items-center">
                  <div className="testimonial-avatar me-3">
                    <FaUser />
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold">Sarah M.</h6>
                    <small className="text-muted">Thalassemia Patient</small>
                  </div>
                </div>
              </div>
            </Col>
            <Col md={4}>
              <div className="testimonial-card">
                <div className="quote-icon mb-3">
                  <FaQuoteLeft />
                </div>
                <p className="testimonial-text mb-4">
                  "As a caregiver, I was overwhelmed with information. This hub organized everything I needed to know and connected me with others going through the same journey."
                </p>
                <div className="d-flex align-items-center">
                  <div className="testimonial-avatar me-3">
                    <FaUser />
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold">Ahmed K.</h6>
                    <small className="text-muted">Parent & Caregiver</small>
                  </div>
                </div>
              </div>
            </Col>
            <Col md={4}>
              <div className="testimonial-card">
                <div className="quote-icon mb-3">
                  <FaQuoteLeft />
                </div>
                <p className="testimonial-text mb-4">
                  "The resources section is comprehensive and easy to understand. I recommend this platform to all my patients and their families. It's making a real difference."
                </p>
                <div className="d-flex align-items-center">
                  <div className="testimonial-avatar me-3">
                    <FaUser />
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold">Dr. Lisa Chen</h6>
                    <small className="text-muted">Hematologist</small>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Blog/News Section */}
      <section className="section-modern" style={{ background: 'var(--bg-secondary)' }}>
        <Container>
          <div ref={blogTitleRef} className="text-center mb-4 section-title-animate">
            <h2 className="section-title gradient-text">Latest Blog & News</h2>
            <p className="section-subtitle section-subtitle-animate">
              Stay updated with the latest research and insights
            </p>
          </div>

          {/* Category Filter */}
          <div className="d-flex justify-content-center flex-wrap gap-2 mb-5">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'primary' : 'outline-primary'}
                onClick={() => setSelectedCategory(category)}
                className="rounded-pill px-4"
                style={{
                  transition: 'all 0.3s ease',
                  ...(selectedCategory === category && {
                    background: 'var(--primary-gradient)',
                    border: 'none'
                  })
                }}
              >
                {category}
              </Button>
            ))}
          </div>

          {isLoadingBlogs ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : filteredBlogPosts.length > 0 ? (
            <>
              <Row ref={blogCardsRef} className="g-4 animate-on-scroll-stagger">
                {filteredBlogPosts.slice(0, 6).map((post) => (
                  <Col md={4} key={post.newsPostId}>
                    <div className="blog-post-card h-100">
                      {post.mediaUrl && (
                        <div className="blog-post-image">
                          <img src={post.mediaUrl} alt={post.postTitle} />
                        </div>
                      )}
                      <div className="blog-post-content">
                        {post.category && (
                          <Badge bg="primary" className="mb-2">{post.category}</Badge>
                        )}
                        <h5 className="fw-bold mb-2">{truncateText(post.postTitle, 70)}</h5>
                        <p className="text-muted mb-3" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                          {truncateText(post.postContent, 150)}
                        </p>
                        <div className="d-flex align-items-center justify-content-between">
                          <small className="text-muted d-flex align-items-center gap-1">
                            <FaClock size={12} />
                            {formatDate(post.publicationDate)}
                          </small>
                          <Button
                            as={Link}
                            to={`/news/${post.newsPostId}`}
                            variant="link"
                            className="p-0 text-decoration-none d-flex align-items-center gap-1"
                            style={{ fontSize: '0.9rem' }}
                          >
                            Read More <FaArrowRight size={12} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
              <div className="text-center mt-4">
                <Button as={Link} to="/news" className="btn-modern btn-modern-primary px-4">
                  View All News & Articles
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-5">
              <p className="text-muted">No blog posts available in this category.</p>
            </div>
          )}
        </Container>
      </section>

      {/* Modern Call to Action */}
      {!isAuthenticated && (
        <section ref={ctaRef} className="cta-section py-5 animate-on-scroll" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <Container className="text-center text-white" style={{ position: 'relative', zIndex: 1 }}>
            <h2 className="display-5 fw-bold mb-3">Join Our Community Today!</h2>
            <p className="lead mb-4" style={{ opacity: 0.95 }}>
              Connect with others, get support, and stay informed about thalassemia care.
            </p>
            <Button
              as={Link}
              to="/signup"
              size="lg"
              className="btn-modern px-5 py-3"
              style={{
                background: 'white',
                color: 'var(--primary)',
                fontSize: '1.1rem'
              }}
            >
              Sign Up Free
            </Button>
          </Container>
        </section>
      )}
    </>
  )
}

export default Home

