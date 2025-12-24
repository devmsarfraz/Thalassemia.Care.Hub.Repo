import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Modal, Form, Image, Spinner, Pagination, InputGroup, Dropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { postsAPI, newsAPI, uploadAPI } from '../services/api'
import { toast } from 'react-toastify'
import { useAuth } from '../contexts/AuthContext'
import { API_BASE_URL } from '../config/api'
import {
  FaSearch, FaComment, FaCalendarAlt, FaUserCircle,
  FaThumbsUp, FaShare, FaImage, FaVideo, FaLink,
  FaFlag, FaUsers, FaEdit, FaTrash, FaEllipsisH
} from 'react-icons/fa'
import './Community.css'
import CommentItem from '../components/CommentItem'

const Community = () => {
  const CATEGORIES = [
    { id: 'All', label: 'All Posts', icon: '🌍' },
    { id: 'Medical', label: 'Medical Queries', icon: '⚕️' },
    { id: 'Diet', label: 'Diet & Lifestyle', icon: '🥗' },
    { id: 'MentalHealth', label: 'Mental Health', icon: '🧠' },
    { id: 'SuccessStories', label: 'Success Stories', icon: '🏆' },
    { id: 'General', label: 'General Discussion', icon: '💬' }
  ];

  const [posts, setPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [news, setNews] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [newPost, setNewPost] = useState({ postTitle: '', postContent: '', mediaUrl: '', category: 'General' })
  const [editingPost, setEditingPost] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [expandedPosts, setExpandedPosts] = useState([]) // Array of postIds with expanded comments
  const [commentText, setCommentText] = useState({}) // Object mapping postId -> text
  const [selectedImage, setSelectedImage] = useState(null)
  const { user } = useAuth()

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage] = useState(5)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase()
      const filtered = posts.filter(
        (post) => {
          const matchesSearch = post.postTitle.toLowerCase().includes(lowerQuery) ||
            post.postContent.toLowerCase().includes(lowerQuery);
          const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;

          return matchesSearch && matchesCategory;
        }
      )
      setFilteredPosts(filtered)
      setCurrentPage(1) // Reset to page 1 on search
    } else {
      if (selectedCategory === 'All') {
        setFilteredPosts(posts)
      } else {
        setFilteredPosts(posts.filter(p => p.category === selectedCategory))
      }
    }
  }, [searchQuery, posts, selectedCategory])

  const loadData = async () => {
    try {
      const [postsRes, newsRes] = await Promise.all([
        postsAPI.getAll(),
        newsAPI.getAll()
      ])
      // Reverse posts to show newest first
      const sortedPosts = postsRes.data.reverse()
      setPosts(sortedPosts)
      setFilteredPosts(sortedPosts)

      const sortedNews = newsRes.data
        .sort((a, b) => new Date(b.publicationDate) - new Date(a.publicationDate))
        .slice(0, 3)
      setNews(sortedNews)
    } catch (error) {
      console.error(error)
      toast.error('Failed to load community data')
    }
  }

  const resetForm = () => {
    setNewPost({ postTitle: '', postContent: '', mediaUrl: '', category: 'General' })
    setEditingPost(null)
    setShowModal(false)
  }

  const handleSavePost = async (e) => {
    e.preventDefault()
    try {
      if (editingPost) {
        await postsAPI.update(editingPost.postId, newPost)
        toast.success('Post updated successfully!')
      } else {
        await postsAPI.create(newPost)
        toast.success('Post created successfully!')
      }
      resetForm()
      loadData()
    } catch (error) {
      toast.error(editingPost ? 'Failed to update post' : 'Failed to create post')
    }
  }

  const handleEditClick = (post) => {
    setEditingPost(post)
    setNewPost({
      postTitle: post.postTitle,
      postContent: post.postContent,
      mediaUrl: post.mediaUrl || '',
      category: post.category || 'General'
    })
    setShowModal(true)
  }

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return

    try {
      await postsAPI.delete(postId)
      toast.success('Post deleted successfully')
      loadData()
    } catch (error) {
      console.error(error)
      toast.error('Failed to delete post')
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    setUploading(true)
    try {
      const response = await uploadAPI.uploadFile(formData)
      setNewPost({ ...newPost, mediaUrl: response.data.url })
      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error(error)
      toast.error('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const toggleLike = async (postId) => {
    // Optimistic update
    setPosts(prevPosts => prevPosts.map(p => {
      if (p.postId === postId) {
        return {
          ...p,
          isLiked: !p.isLiked,
          likeCount: p.isLiked ? (p.likeCount - 1) : (p.likeCount + 1)
        }
      }
      return p
    }))

    try {
      await postsAPI.toggleLike(postId)
    } catch (error) {
      console.error(error)
      toast.error('Failed to like post')
      // Revert on failure
      setPosts(prevPosts => prevPosts.map(p => {
        if (p.postId === postId) {
          return {
            ...p,
            isLiked: !p.isLiked,
            likeCount: p.isLiked ? (p.likeCount - 1) : (p.likeCount + 1)
          }
        }
        return p
      }))
    }
  }

  const handleShare = async (postId) => {
    const link = `${window.location.origin}/community/post/${postId}`
    try {
      await navigator.clipboard.writeText(link)
      toast.success('Link copied to clipboard!')
    } catch (err) {
      toast.error('Failed to copy link')
    }
  }

  const toggleComments = (postId) => {
    if (expandedPosts.includes(postId)) {
      setExpandedPosts(expandedPosts.filter(id => id !== postId))
    } else {
      setExpandedPosts([...expandedPosts, postId])
    }
  }

  const handleCommentChange = (postId, text) => {
    setCommentText(prev => ({ ...prev, [postId]: text }))
  }

  // Refactored to handle both top-level comments and replies
  const handlePostComment = async (postId, text, parentCommentId = null) => {
    if (!text || !text.trim()) return

    try {
      await postsAPI.createComment(postId, {
        commentContent: text,
        parentCommentId: parentCommentId
      })
      toast.success(parentCommentId ? 'Reply added' : 'Comment added')

      // If it's a top-level comment, clear the main input
      if (!parentCommentId) {
        setCommentText(prev => ({ ...prev, [postId]: '' }))
      }

      loadData() // Refresh

      // Ensure comments are expanded
      if (!expandedPosts.includes(postId)) {
        setExpandedPosts([...expandedPosts, postId])
      }
    } catch (error) {
      console.error(error)
      toast.error('Failed to add comment')
    }
  }

  const handleInlineCommentSubmit = (e, postId) => {
    e.preventDefault()
    handlePostComment(postId, commentText[postId])
  }

  const handleUpdateComment = async (commentId, content) => {
    if (!content || !content.trim()) return

    try {
      await postsAPI.updateComment(commentId, { commentContent: content })
      toast.success('Comment updated successfully')
      loadData()
    } catch (error) {
      console.error(error)
      toast.error('Failed to update comment')
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return

    try {
      await postsAPI.deleteComment(commentId)
      toast.success('Comment deleted successfully')
      loadData()
    } catch (error) {
      console.error(error)
      toast.error('Failed to delete comment')
    }
  }

  // Get current posts for pagination
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost)
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div className="community-page">
      <Container>
        <Row>
          {/* Left Sidebar - Categories */}
          <Col md={3} className="d-none d-lg-block">
            <div className="sticky-top" style={{ top: '80px' }}>
              <Card className="fb-card p-2">
                <h6 className="px-3 pt-2 text-muted fw-bold small">TOPICS</h6>
                <div className="category-list">
                  {CATEGORIES.map(cat => (
                    <div
                      key={cat.id}
                      className={`category-item ${selectedCategory === cat.id ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(cat.id)}
                    >
                      <span className="me-2">{cat.icon}</span>
                      {cat.label}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </Col>

          {/* Center Feed */}
          <Col md={6}>
            {/* Search Bar */}
            <Card className="fb-card mb-3 p-2">
              <InputGroup>
                <InputGroup.Text className="bg-white border-0"><FaSearch className="text-secondary" /></InputGroup.Text>
                <Form.Control
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 bg-light rounded-pill"
                />
              </InputGroup>
            </Card>

            {/* Create Post Widget */}
            <Card className="fb-card create-post-widget">
              <div className="create-post-top">
                {user?.profilePicture ? (
                  <Image
                    src={`${API_BASE_URL.replace('/api', '')}${user.profilePicture}`}
                    roundedCircle
                    width="40"
                    height="40"
                    className="me-2 object-fit-cover"
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'inline-block'; }}
                  />
                ) : null}
                <FaUserCircle size={40} className="text-secondary" style={{ display: user?.profilePicture ? 'none' : 'inline-block' }} />
                <div
                  className="create-post-input d-flex justify-content-between align-items-center"
                  onClick={() => setShowModal(true)}
                >
                  <span>What's on your mind, {user?.firstName}?</span>

                  <div className="d-flex align-items-center px-2 py-1 rounded hover-bg-gray">
                    <FaImage color="#45bd62" size={20} className="me-2" />
                    <span className="small fw-600 text-secondary">Photo/Video</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Posts Feed */}
            {currentPosts.map((post) => (
              <Card key={post.postId} className="fb-card post-card">
                <div className="fb-card-header justify-content-between">
                  <div className="d-flex align-items-center">
                    {post.profilePicture ? (
                      <Image
                        src={`${API_BASE_URL.replace('/api', '')}${post.profilePicture}`}
                        roundedCircle
                        width="40"
                        height="40"
                        className="me-2 object-fit-cover"
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'inline-block'; }}
                      />
                    ) : null}
                    <FaUserCircle size={40} className="text-secondary me-2" style={{ display: post.profilePicture ? 'none' : 'inline-block' }} />
                    <div className="post-header-info">
                      <h6>{post.userName || `${post.user?.firstName} ${post.user?.lastName}`}</h6>
                      <small className="text-muted">
                        {new Date(post.creationDate).toLocaleString()} ·
                        <span className="ms-1 badge bg-light text-dark border">{CATEGORIES.find(c => c.id === post.category)?.label || post.category || 'General'}</span>
                      </small>
                    </div>
                  </div>

                  <Dropdown align="end">
                    <Dropdown.Toggle variant="link" className="text-secondary p-0 border-0 no-caret">
                      <FaEllipsisH />
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item as={Link} to={`/community/post/${post.postId}`}>
                        Show in Detail
                      </Dropdown.Item>
                      {user && user.userId === post.userId && (
                        <>
                          <Dropdown.Divider />
                          <Dropdown.Item onClick={() => handleEditClick(post)}>
                            <FaEdit className="me-2" /> Edit Post
                          </Dropdown.Item>
                          <Dropdown.Item className="text-danger" onClick={() => handleDeletePost(post.postId)}>
                            <FaTrash className="me-2" /> Delete Post
                          </Dropdown.Item>
                        </>
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>

                <div className="fb-card-body">
                  <h6 className="mb-2 fw-bold">{post.postTitle}</h6>
                  <div className="post-content">
                    {post.postContent}
                  </div>
                </div>

                {post.mediaUrl && (
                  <div className="post-media" onClick={() => setSelectedImage(post.mediaUrl)}>
                    <img src={post.mediaUrl} alt="Post content" />
                  </div>
                )}

                <div className="post-stats">
                  <div>
                    <FaThumbsUp className="text-primary me-1" />
                    {post.likeCount || 0}
                  </div>
                  <div>
                    {post.comments ? post.comments.length : 0} comments
                  </div>
                </div>

                <div className="post-actions">
                  <button
                    className={`post-action-btn ${post.isLiked ? 'active' : ''}`}
                    onClick={() => toggleLike(post.postId)}
                  >
                    <FaThumbsUp className="me-2" /> Like
                  </button>
                  <button
                    className="post-action-btn"
                    onClick={() => toggleComments(post.postId)}
                  >
                    <FaComment className="me-2" /> Comment
                  </button>
                  <button className="post-action-btn" onClick={() => handleShare(post.postId)}>
                    <FaShare className="me-2" /> Share
                  </button>
                </div>

                {/* Inline Comment Section */}
                {expandedPosts.includes(post.postId) && (
                  <div className="p-3 border-top bg-light">
                    {/* Existing Comments */}
                    {post.comments && post.comments.length > 0 && (
                      <div className="mb-3">
                        {post.comments.map(comment => (
                          <CommentItem
                            key={comment.commentId}
                            comment={comment}
                            postId={post.postId}
                            currentUserId={user?.userId}
                            onReply={(pid, text, parentId) => handlePostComment(pid, text, parentId)}
                            onEdit={handleUpdateComment}
                            onDelete={handleDeleteComment}
                          />
                        ))}
                      </div>
                    )}

                    {/* Add Comment Input */}
                    <Form onSubmit={(e) => handleInlineCommentSubmit(e, post.postId)} className="d-flex gap-2">
                      {user?.profilePicture ? (
                        <Image
                          src={`${API_BASE_URL.replace('/api', '')}${user.profilePicture}`}
                          roundedCircle
                          width="32"
                          height="32"
                          className="mt-1 object-fit-cover"
                          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'inline-block'; }}
                        />
                      ) : null}
                      <FaUserCircle size={32} className="text-secondary mt-1" style={{ display: user?.profilePicture ? 'none' : 'inline-block' }} />
                      <Form.Control
                        type="text"
                        placeholder="Write a comment..."
                        className="rounded-pill bg-white"
                        value={commentText[post.postId] || ''}
                        onChange={(e) => handleCommentChange(post.postId, e.target.value)}
                      />

                    </Form>
                  </div>
                )}
              </Card>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center my-4">
                <Pagination>
                  <Pagination.Prev
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
              </div>
            )}
          </Col>

          {/* Right Sidebar - News */}
          <Col md={3} className="d-none d-lg-block">
            <div className="sticky-top" style={{ top: '80px' }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="text-muted mb-0">Latest News</h6>
                <Link to="/news" className="text-decoration-none small">See All</Link>
              </div>

              {news.map(item => (
                <div key={item.newsPostId} className="mb-3">
                  <Link to="/news" className="text-dark text-decoration-none bg-white d-block p-2 rounded shadow-sm">
                    <strong>{item.postTitle}</strong>
                    <div className="text-muted small mt-1">
                      {new Date(item.publicationDate).toLocaleDateString()}
                    </div>
                  </Link>
                </div>
              ))}

              <hr className="my-4" />

              <h6 className="text-muted mb-3">Sponsored</h6>
              <Card className="fb-card mb-4" style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
                <div className="d-flex align-items-center mb-2">
                  <div style={{ width: '100px', height: '100px', background: '#ddd', borderRadius: '8px', marginRight: '10px' }}></div>
                  <div>
                    <strong>Thalassemia Awareness</strong>
                    <div className="text-muted small">thalassemia.org</div>
                  </div>
                </div>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>


      {/* Create/Edit Post Modal */}
      <Modal show={showModal} onHide={resetForm} centered>
        <Modal.Header closeButton className="border-0 text-center">
          <Modal.Title className="w-100 fw-bold fs-5">{editingPost ? 'Edit Post' : 'Create Post'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex align-items-center mb-3">
            {user?.profilePicture ? (
              <Image
                src={`${API_BASE_URL.replace('/api', '')}${user.profilePicture}`}
                roundedCircle
                width="40"
                height="40"
                className="me-2 object-fit-cover"
                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'inline-block'; }}
              />
            ) : null}
            <FaUserCircle size={40} className="text-secondary me-2" style={{ display: user?.profilePicture ? 'none' : 'inline-block' }} />
            <div>
              <div className="fw-bold">{user?.firstName} {user?.lastName}</div>
              <div className="badge bg-secondary">Public</div>
            </div>
          </div>

          <Form onSubmit={handleSavePost}>
            <Form.Group className="mb-3">
              <Form.Select
                className="mb-2 border-0 bg-light"
                value={newPost.category}
                onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
              >
                {CATEGORIES.filter(c => c.id !== 'All').map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
                ))}
              </Form.Select>

              <Form.Control
                type="text"
                placeholder="Give your post a title..."
                value={newPost.postTitle}
                onChange={(e) => setNewPost({ ...newPost, postTitle: e.target.value })}
                className="border-0 fs-5 mb-2"
                style={{ resize: 'none' }}
                required
              />
              <Form.Control
                as="textarea"
                rows={4}
                placeholder={`What's on your mind, ${user?.firstName}?`}
                value={newPost.postContent}
                onChange={(e) => setNewPost({ ...newPost, postContent: e.target.value })}
                className="border-0 fs-5"
                style={{ resize: 'none' }}
                required
              />
            </Form.Group>

            {newPost.mediaUrl ? (
              <div className="position-relative mb-3">
                <Image src={newPost.mediaUrl} fluid rounded className="w-100" />
                <Button
                  variant="light"
                  size="sm"
                  className="position-absolute top-0 end-0 m-2 rounded-circle"
                  onClick={() => setNewPost({ ...newPost, mediaUrl: '' })}
                >
                  ✕
                </Button>
              </div>
            ) : (
              <div className="border rounded p-3 mb-3 d-flex justify-content-between align-items-center">
                <span>Add to your post</span>
                <div className="d-flex gap-2">
                  <label className="cursor-pointer">
                    <FaImage size={24} className="text-success" style={{ cursor: 'pointer' }} />
                    <input
                      type="file"
                      accept="image/*"
                      className="d-none"
                      onChange={handleFileUpload}
                      disabled={uploading}
                    />
                  </label>

                </div>
              </div>
            )}

            {uploading && (
              <div className="text-center mb-3">
                <Spinner animation="border" size="sm" /> Uploading image...
              </div>
            )}

            <Button variant="primary" type="submit" className="w-100 fw-bold" disabled={uploading}>
              {editingPost ? 'Save Changes' : 'Post'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Image Lightbox Modal */}
      <Modal show={!!selectedImage} onHide={() => setSelectedImage(null)} centered size="xl" contentClassName="bg-transparent border-0">
        <Modal.Body className="p-0 text-center position-relative">
          <Button
            variant="dark"
            className="position-absolute top-0 end-0 m-3 rounded-circle"
            onClick={() => setSelectedImage(null)}
            style={{ zIndex: 1056 }}
          >
            ✕
          </Button>
          <Image src={selectedImage} fluid style={{ maxHeight: '90vh', objectFit: 'contain' }} />
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default Community
