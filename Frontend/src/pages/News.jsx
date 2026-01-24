import { useState, useEffect } from 'react'
import { Container, Row, Col, Form, InputGroup, Spinner, Pagination } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { newsAPI } from '../services/api'
import { toast } from 'react-toastify'
import { FaSearch, FaClock, FaNewspaper, FaUser, FaArrowRight, FaBookmark } from 'react-icons/fa'
import { API_BASE_URL } from '../config/api'
import NewsSkeleton from '../components/NewsSkeleton'
import '../styles/news-styles.css'

const News = () => {
  const [newsPosts, setNewsPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isLoading, setIsLoading] = useState(true)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [articlesPerPage] = useState(6) // 6 articles per page

  useEffect(() => {
    loadNews()
  }, [])

  useEffect(() => {
    filterAndSortPosts()
    setCurrentPage(1) // Reset to page 1 when filters change
  }, [newsPosts, searchQuery, sortBy, selectedCategory])

  const loadNews = async () => {
    try {
      setIsLoading(true)
      const response = await newsAPI.getAll()
      setNewsPosts(response.data)
    } catch (error) {
      console.error(error)
      toast.error('Failed to load news')
    } finally {
      setIsLoading(false)
    }
  }

  const filterAndSortPosts = () => {
    let filtered = [...newsPosts]

    // Filter by Category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(post =>
        post.postTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.postContent.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort posts
    filtered.sort((a, b) => {
      const dateA = new Date(a.publicationDate)
      const dateB = new Date(b.publicationDate)
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB
    })

    setFilteredPosts(filtered)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const calculateReadingTime = (content) => {
    const wordsPerMinute = 200
    const textContent = content.replace(/<[^>]*>/g, '') // Strip HTML tags
    const wordCount = textContent.split(/\s+/).length
    const minutes = Math.ceil(wordCount / wordsPerMinute)
    return `${minutes} min read`
  }

  const getImageUrl = (news) => {
    if (news.mediaUrl) return news.mediaUrl
    if (news.media && news.media.length > 0) {
      return `${API_BASE_URL.replace('/api', '')}${news.media[0].mediaUrl}`
    }
    return null
  }

  const getCategoryCount = (category) => {
    if (category === 'All') return newsPosts.length
    return newsPosts.filter(post => post.category === category).length
  }

  // Get featured article (most recent)
  const featuredArticle = filteredPosts.length > 0 ? filteredPosts[0] : null

  // Pagination calculations
  const indexOfLastArticle = currentPage * articlesPerPage
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage
  const currentArticles = filteredPosts.slice(1).slice(indexOfFirstArticle, indexOfLastArticle) // Skip featured article
  const totalPages = Math.ceil((filteredPosts.length - 1) / articlesPerPage) // -1 for featured article

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div style={{ background: 'var(--news-bg-secondary)', minHeight: '100vh', paddingBottom: '4rem' }}>
      <Container className="pt-4">
        {/* Hero Section - Featured Article */}
        {!isLoading && featuredArticle && (
          <Link to={`/news/${featuredArticle.newsPostId}`} style={{ textDecoration: 'none' }}>
            <div className="news-hero">
              {getImageUrl(featuredArticle) && (
                <img
                  src={getImageUrl(featuredArticle)}
                  alt={featuredArticle.postTitle}
                  className="news-hero-image"
                />
              )}
              <div className="news-hero-overlay"></div>
              <div className="news-hero-content">
                <span className="news-hero-category">
                  {featuredArticle.category || 'Featured'}
                </span>
                <h1 className="news-hero-title">{featuredArticle.postTitle}</h1>
                <p className="news-hero-excerpt">
                  {featuredArticle.postContent.replace(/<[^>]*>/g, '').substring(0, 200)}...
                </p>
                <div className="news-hero-meta">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaClock size={14} />
                    {formatDate(featuredArticle.publicationDate)}
                  </span>
                  <span>•</span>
                  <span>{calculateReadingTime(featuredArticle.postContent)}</span>
                  {featuredArticle.userName && (
                    <>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FaUser size={12} />
                        {featuredArticle.userName}
                      </span>
                    </>
                  )}
                </div>
                <div className="news-hero-cta">
                  Read Full Article
                  <FaArrowRight size={16} />
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Page Header */}
        <Row className="mb-4 mt-5">
          <Col>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <FaNewspaper size={32} style={{ color: 'var(--news-primary)' }} />
              <div>
                <h2 style={{
                  fontFamily: 'var(--news-heading-font)',
                  fontSize: '2rem',
                  fontWeight: '700',
                  marginBottom: '0.25rem',
                  color: 'var(--news-text-primary)'
                }}>
                  News & Information
                </h2>
                <p style={{
                  fontFamily: 'var(--news-ui-font)',
                  color: 'var(--news-text-light)',
                  marginBottom: 0,
                  fontSize: '1rem'
                }}>
                  Stay updated with the latest Thalassemia news and research
                </p>
              </div>
            </div>
          </Col>
        </Row>

        {/* Category Navigation */}
        <Row className="mb-4">
          <Col>
            <div className="news-category-nav">
              {['All', 'Research', 'General'].map((category) => (
                <button
                  key={category}
                  className={`news-category-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === 'All' ? 'All News' : category}
                  <span className="news-category-badge">
                    {getCategoryCount(category)}
                  </span>
                </button>
              ))}
            </div>
          </Col>
        </Row>

        {/* Search and Filter Section */}
        <Row className="mb-4">
          <Col md={8}>
            <div className="news-search-wrapper">
              <FaSearch className="news-search-icon" size={18} />
              <input
                type="text"
                className="news-search-input"
                placeholder="Search news by title or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </Col>
          <Col md={4}>
            <select
              className="news-filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </Col>
        </Row>

        {/* Results Count */}
        {!isLoading && (
          <Row className="mb-3">
            <Col>
              <p style={{
                fontFamily: 'var(--news-ui-font)',
                color: 'var(--news-text-light)',
                fontSize: '0.9375rem'
              }}>
                {filteredPosts.length === 0 && searchQuery ? (
                  <>{filteredPosts.length === 1 ? (
                    <>No additional articles</>
                  ) : (
                    <>Showing <strong>{indexOfFirstArticle + 1}</strong> to <strong>{Math.min(indexOfLastArticle, filteredPosts.length - 1)}</strong> of <strong>{filteredPosts.length - 1}</strong> {filteredPosts.length - 1 === 1 ? 'article' : 'articles'}</>
                  )}</>
                ) : (
                  <>Showing <strong>{currentArticles.length}</strong> {currentArticles.length === 1 ? 'article' : 'articles'}</>
                )}
              </p>
            </Col>
          </Row>
        )}

        {/* Loading State or News Cards Grid */}
        {isLoading ? (
          <div className="news-grid">
            <NewsSkeleton />
            <NewsSkeleton />
            <NewsSkeleton />
            <NewsSkeleton />
            <NewsSkeleton />
            <NewsSkeleton />
          </div>
        ) : (
          /* News Cards Grid */
          <>
            <div className="news-grid">
              {currentArticles.length === 0 ? (
                <Col>
                  <div style={{
                    textAlign: 'center',
                    padding: '4rem 2rem',
                    background: 'white',
                    borderRadius: 'var(--news-radius-lg)',
                    boxShadow: 'var(--news-shadow-md)'
                  }}>
                    <FaNewspaper size={48} style={{ color: 'var(--news-text-muted)', marginBottom: '1rem' }} />
                    <h5 style={{
                      fontFamily: 'var(--news-heading-font)',
                      color: 'var(--news-text-light)'
                    }}>
                      No news articles available yet
                    </h5>
                    <p style={{
                      fontFamily: 'var(--news-ui-font)',
                      color: 'var(--news-text-muted)'
                    }}>
                      Check back later for updates
                    </p>
                  </div>
                </Col>
              ) : (
                currentArticles.map((news) => (
                  <div key={news.newsPostId} className="news-card">
                    {/* Card Image */}
                    {getImageUrl(news) && (
                      <div className="news-card-image-wrapper">
                        <img
                          src={getImageUrl(news)}
                          alt={news.postTitle}
                          className="news-card-image"
                        />
                        <span className={`news-card-category ${news.category?.toLowerCase()}`}>
                          {news.category || 'General'}
                        </span>
                      </div>
                    )}

                    {/* Card Body */}
                    <div className="news-card-body">
                      <h3 className="news-card-title">{news.postTitle}</h3>

                      <div className="news-card-meta">
                        <span className="news-card-meta-item">
                          <FaClock size={12} />
                          {formatDate(news.publicationDate)}
                        </span>
                        <span className="news-card-meta-item">
                          {calculateReadingTime(news.postContent)}
                        </span>
                      </div>

                      <p className="news-card-excerpt">
                        {news.postContent.replace(/<[^>]*>/g, '')}
                      </p>

                      <div className="news-card-footer">
                        {news.userName && (
                          <div className="news-card-author">
                            <FaUser size={16} style={{ color: 'var(--news-text-light)' }} />
                            <span className="news-card-author-name">{news.userName}</span>
                          </div>
                        )}
                        <Link
                          to={`/news/${news.newsPostId}`}
                          className="news-card-cta"
                        >
                          Read More
                          <FaArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Row className="mt-5">
                <Col>
                  <div className="d-flex justify-content-center">
                    <Pagination>
                      <Pagination.Prev
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                      />
                      {[...Array(totalPages)].map((_, idx) => (
                        <Pagination.Item
                          key={idx + 1}
                          active={idx + 1 === currentPage}
                          onClick={() => paginate(idx + 1)}
                        >
                          {idx + 1}
                        </Pagination.Item>
                      ))}
                      <Pagination.Next
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      />
                    </Pagination>
                  </div>
                </Col>
              </Row>
            )}
          </>
        )}
      </Container>
    </div>
  )
}

export default News
