import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Badge, ListGroup, ProgressBar } from 'react-bootstrap'
import { Link, Navigate } from 'react-router-dom'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useAuth } from '../contexts/AuthContext'
import { postsAPI, newsAPI, chatAPI } from '../services/api'
import {
  FaUsers, FaRobot, FaNewspaper, FaComments, FaHeart,
  FaChartLine, FaClock, FaFire, FaLightbulb, FaArrowRight,
  FaCalendarAlt, FaBookMedical, FaUserMd
} from 'react-icons/fa'

const Dashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuth()
  const [stats, setStats] = useState({
    totalPosts: 0,
    userPosts: 0,
    totalLikes: 0,
    aiChats: 0
  })
  const [recentPosts, setRecentPosts] = useState([])
  const [recentNews, setRecentNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch community posts
        const postsResponse = await postsAPI.getAll()
        const allPosts = postsResponse.data || []

        // Fetch news
        const newsResponse = await newsAPI.getAll()
        const allNews = newsResponse.data || []

        // Fetch chat sessions count
        let chatCount = 0
        try {
          const chatResponse = await chatAPI.getSessionsCount()
          chatCount = chatResponse.data.count || 0
        } catch (error) {
          console.error('Error fetching chat count:', error)
          // If error (e.g., user not logged in yet), default to 0
        }

        // Calculate stats
        const userPostsCount = allPosts.filter(post => post.userId === user?.userId).length

        setStats({
          totalPosts: allPosts.length,
          userPosts: userPostsCount,
          totalLikes: allPosts.reduce((acc, post) => acc + (post.likeCount || 0), 0),
          aiChats: chatCount
        })

        // Get recent posts (latest 3)
        setRecentPosts(allPosts.slice(0, 3))

        // Get recent news (latest 2)
        setRecentNews(allNews.slice(0, 2))
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchDashboardData()
    }
  }, [user])

  if (isLoading) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    )
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  const healthTips = [
    { icon: '💊', tip: 'Stay hydrated and maintain regular transfusion schedules', color: '#3B82F6' },
    { icon: '🥗', tip: 'Follow a balanced diet low in iron-rich foods', color: '#10B981' },
    { icon: '🏃', tip: 'Engage in light exercise to maintain bone health', color: '#F59E0B' },
    { icon: '😊', tip: 'Connect with the community for emotional support', color: '#EC4899' }
  ]

  const currentTip = healthTips[new Date().getDate() % healthTips.length]

  const StatCardSkeleton = () => (
    <Card className="h-100 border-0 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div className="flex-grow-1">
            <Skeleton width={80} height={14} className="mb-2" />
            <Skeleton width={48} height={32} className="mb-2" />
            <Skeleton width={100} height={12} />
          </div>
          <Skeleton width={48} height={48} borderRadius={12} />
        </div>
      </Card.Body>
    </Card>
  )

  return (
    <Container className="py-4">
      {/* Welcome Banner */}
      <div className="modern-card mb-4" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="mb-2">Welcome back, {user.firstName || ''} {user.lastName || ''}! 👋</h2>
          <p className="mb-0 opacity-90">
            <FaClock className="me-2" />
            Last login: {new Date().toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        <div style={{
          position: 'absolute',
          right: '-50px',
          bottom: '-50px',
          opacity: 0.1,
          fontSize: '200px'
        }}>
          👤
        </div>
      </div>

      {/* Statistics Cards */}
      <Row className="g-4 mb-4">
        {loading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <Col key={i} md={3} sm={6}>
                <StatCardSkeleton />
              </Col>
            ))}
          </>
        ) : (
          <>
            <Col md={3} sm={6}>
              <Card className="h-100 border-0 shadow-sm" style={{
                borderLeft: '4px solid #667eea',
                transition: 'all 0.3s ease'
              }}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="text-muted mb-1 small">Your Posts</p>
                      <h3 className="mb-0 fw-bold">{stats.userPosts}</h3>
                    </div>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}>
                      <FaComments size={24} />
                    </div>
                  </div>
                  <div className="mt-2">
                    <small className="text-success">
                      <FaChartLine className="me-1" />
                      Active contributor
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3} sm={6}>
              <Card className="h-100 border-0 shadow-sm" style={{
                borderLeft: '4px solid #10b981',
                transition: 'all 0.3s ease'
              }}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="text-muted mb-1 small">Community Posts</p>
                      <h3 className="mb-0 fw-bold">{stats.totalPosts}</h3>
                    </div>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}>
                      <FaUsers size={24} />
                    </div>
                  </div>
                  <div className="mt-2">
                    <small className="text-muted">
                      Total discussions
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3} sm={6}>
              <Card className="h-100 border-0 shadow-sm" style={{
                borderLeft: '4px solid #3b82f6',
                transition: 'all 0.3s ease'
              }}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="text-muted mb-1 small">AI Chat Sessions</p>
                      <h3 className="mb-0 fw-bold">{stats.aiChats}</h3>
                    </div>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}>
                      <FaRobot size={24} />
                    </div>
                  </div>
                  <div className="mt-2">
                    <small className="text-muted">
                      Questions answered
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3} sm={6}>
              <Card className="h-100 border-0 shadow-sm" style={{
                borderLeft: '4px solid #f59e0b',
                transition: 'all 0.3s ease'
              }}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="text-muted mb-1 small">Total Likes</p>
                      <h3 className="mb-0 fw-bold">{stats.totalLikes}</h3>
                    </div>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}>
                      <FaHeart size={24} />
                    </div>
                  </div>
                  <div className="mt-2">
                    <small className="text-muted">
                      Community support
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </>
        )}
      </Row>

      <Row className="g-4">
        {/* Quick Actions */}
        <Col lg={4}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0 fw-bold">
                <FaFire className="me-2 text-danger" />
                Quick Actions
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-3">
                <Button
                  as={Link}
                  to="/community"
                  variant="outline-primary"
                  className="d-flex align-items-center justify-content-between"
                  style={{ borderRadius: '12px', padding: '12px 16px' }}
                >
                  <span>
                    <FaUsers className="me-2" />
                    Browse Community
                  </span>
                  <FaArrowRight />
                </Button>
                <Button
                  as={Link}
                  to="/chat"
                  variant="outline-success"
                  className="d-flex align-items-center justify-content-between"
                  style={{ borderRadius: '12px', padding: '12px 16px' }}
                >
                  <span>
                    <FaRobot className="me-2" />
                    Ask AI Assistant
                  </span>
                  <FaArrowRight />
                </Button>
                <Button
                  as={Link}
                  to="/news"
                  variant="outline-info"
                  className="d-flex align-items-center justify-content-between"
                  style={{ borderRadius: '12px', padding: '12px 16px' }}
                >
                  <span>
                    <FaNewspaper className="me-2" />
                    Read Latest News
                  </span>
                  <FaArrowRight />
                </Button>
                <Button
                  as={Link}
                  to="/resources"
                  variant="outline-warning"
                  className="d-flex align-items-center justify-content-between"
                  style={{ borderRadius: '12px', padding: '12px 16px' }}
                >
                  <span>
                    <FaBookMedical className="me-2" />
                    View Resources
                  </span>
                  <FaArrowRight />
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Activity */}
        <Col lg={8}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0 fw-bold">
                <FaClock className="me-2 text-primary" />
                Recent Posts
              </h5>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="d-flex flex-column gap-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="d-flex align-items-start">
                      <Skeleton circle width={40} height={40} className="me-3 flex-shrink-0" />
                      <div className="flex-grow-1">
                        <Skeleton width="75%" height={18} className="mb-2" />
                        <Skeleton width="50%" height={14} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <ListGroup variant="flush">
                  {recentPosts.length > 0 ? (
                    recentPosts.map((post, index) => (
                      <ListGroup.Item key={post.postId} className="px-0 border-0 border-bottom">
                        <div className="d-flex align-items-start">
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            marginRight: '12px',
                            flexShrink: 0
                          }}>
                            <FaComments />
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-1 fw-semibold">
                              <Link to="/community" className="text-decoration-none text-dark">
                                {post.postTitle?.substring(0, 60)}
                                {post.postTitle?.length > 60 ? '...' : ''}
                              </Link>
                            </h6>
                            <small className="text-muted">
                              by {post.user?.firstName} {post.user?.lastName} • {new Date(post.creationDate).toLocaleDateString()}
                            </small>
                          </div>
                        </div>
                      </ListGroup.Item>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted">
                      <FaComments size={48} className="mb-3 opacity-25" />
                      <p>No recent posts yet. Be the first to share!</p>
                      <Button as={Link} to="/community" variant="primary" size="sm">
                        Create a Post
                      </Button>
                    </div>
                  )}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Health Tip & Latest News */}
      <Row className="g-4 mt-0">
        {/* Health Tip of the Day */}
        <Col lg={6}>
          <Card className="border-0 shadow-sm" style={{
            background: `linear - gradient(135deg, ${currentTip.color}15 0 %, ${currentTip.color}05 100 %)`,
            borderLeft: `4px solid ${currentTip.color} `
          }}>
            <Card.Body className="p-4">
              <div className="d-flex align-items-start">
                <div style={{ fontSize: '48px', marginRight: '16px' }}>
                  {currentTip.icon}
                </div>
                <div>
                  <h5 className="fw-bold mb-2">
                    <FaLightbulb className="me-2" style={{ color: currentTip.color }} />
                    Health Tip of the Day
                  </h5>
                  <p className="mb-0 text-secondary">{currentTip.tip}</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Latest News Preview */}
        <Col lg={6}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0 fw-bold">
                <FaNewspaper className="me-2 text-info" />
                Latest News
              </h5>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="d-flex flex-column gap-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="d-flex align-items-start">
                      <Skeleton width={8} height={8} className="mt-2 me-3 flex-shrink-0" style={{ borderRadius: '50%' }} />
                      <div className="flex-grow-1">
                        <Skeleton width="90%" height={18} className="mb-1" />
                        <Skeleton width={80} height={14} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentNews.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {recentNews.map((news) => (
                    <div key={news.newsPostId} className="d-flex align-items-start">
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#3b82f6',
                        marginTop: '6px',
                        marginRight: '12px',
                        flexShrink: 0
                      }} />
                      <div>
                        <Link
                          to={`/news/${news.newsPostId}`}
                          className="text-decoration-none text-dark fw-semibold"
                        >
                          {news.postTitle?.substring(0, 80)}
                          {news.postTitle?.length > 80 ? '...' : ''}
                        </Link>
                        <div>
                          <small className="text-muted">
                            {new Date(news.publicationDate).toLocaleDateString()}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button
                    as={Link}
                    to="/news"
                    variant="link"
                    className="p-0 text-decoration-none d-flex align-items-center"
                  >
                    View all news <FaArrowRight className="ms-2" size={12} />
                  </Button>
                </div>
              ) : (
                <p className="text-muted mb-0">No news available</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <style jsx>{`
  .modern - card:hover {
  transform: translateY(-2px);
  box - shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
        .card:hover {
  transform: translateY(-2px);
  box - shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
`}</style>
    </Container>
  )
}

export default Dashboard

