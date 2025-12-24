import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Table, Button, Modal, Form, Badge, InputGroup, Image, Spinner, Pagination } from 'react-bootstrap'
import { usersAPI, newsAPI, uploadAPI } from '../services/api'
import { toast } from 'react-toastify'
import { FaUsers, FaNewspaper, FaTrash, FaEdit, FaPlus, FaSearch, FaImage, FaChartLine, FaClock, FaBan, FaCheck, FaChevronLeft, FaBars } from 'react-icons/fa'
import { API_BASE_URL } from '../config/api'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

const AdminDashboard = () => {
  // State
  const [activeSection, setActiveSection] = useState('users')
  const [users, setUsers] = useState([])
  const [newsPosts, setNewsPosts] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [filteredNews, setFilteredNews] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewsModal, setShowNewsModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [newsToDelete, setNewsToDelete] = useState(null)
  const [newsToEdit, setNewsToEdit] = useState(null)
  const [newNews, setNewNews] = useState({ postTitle: '', postContent: '', reference: '', mediaUrl: '', mediaList: [], category: 'General' })
  const [editNews, setEditNews] = useState({ postTitle: '', postContent: '', reference: '', mediaUrl: '', category: 'General' })
  const [selectedFiles, setSelectedFiles] = useState([])
  const [editSelectedFiles, setEditSelectedFiles] = useState([])
  const [previewUrls, setPreviewUrls] = useState([])
  const [editPreviewUrls, setEditPreviewUrls] = useState([])

  const [userStatusFilter, setUserStatusFilter] = useState('all')
  const [showDisableModal, setShowDisableModal] = useState(false)
  const [userToDisable, setUserToDisable] = useState(null)

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const sidebarWidth = isSidebarOpen ? '260px' : '80px'

  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Pagination state
  const [currentPageUsers, setCurrentPageUsers] = useState(1)
  const [currentPageNews, setCurrentPageNews] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterData()
  }, [users, newsPosts, searchQuery, activeSection, userStatusFilter])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [usersRes, newsRes] = await Promise.all([
        usersAPI.getAll(),
        newsAPI.getAll()
      ])
      setUsers(usersRes.data)
      setNewsPosts(newsRes.data)
    } catch (error) {
      toast.error('Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }

  const filterData = () => {
    if (activeSection === 'users') {
      let filtered = users

      // Apply status filter
      if (userStatusFilter === 'active') {
        filtered = filtered.filter(user => !user.isDelete)
      } else if (userStatusFilter === 'disabled') {
        filtered = filtered.filter(user => user.isDelete)
      }

      // Apply search filter
      if (searchQuery.trim()) {
        filtered = filtered.filter(user =>
          `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }

      setFilteredUsers(filtered)
    } else {
      if (searchQuery.trim()) {
        setFilteredNews(newsPosts.filter(news =>
          news.postTitle.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      } else {
        setFilteredNews(newsPosts)
      }
    }
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      setSelectedFiles(files)

      // Generate previews
      const newPreviewUrls = []
      files.forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          newPreviewUrls.push({ url: reader.result, type: file.type })
          if (newPreviewUrls.length === files.length) {
            setPreviewUrls([...newPreviewUrls])
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleCreateNews = async (e) => {
    e.preventDefault()
    setIsUploading(true)
    try {
      const mediaList = []

      // Upload all selected files
      if (selectedFiles.length > 0) {
        const formData = new FormData()
        selectedFiles.forEach(file => {
          formData.append('files', file)
        })

        const uploadResponse = await uploadAPI.uploadFiles(formData)

        // Map backend response ({ url, type }) to media object
        uploadResponse.data.forEach(fileData => {
          mediaList.push({
            mediaUrl: fileData.url,
            mediaType: fileData.type.startsWith('image') ? 'image' : 'video' // Or use fileData.type directly if backend returns mime type
          })
        })
      }

      await newsAPI.create({
        ...newNews,
        mediaList: mediaList,
        mediaUrl: mediaList.length > 0 ? mediaList[0].mediaUrl : '' // Keep main URL for backward compatibility
      })

      toast.success('News post created!')
      setShowNewsModal(false)
      setNewNews({ postTitle: '', postContent: '', reference: '', mediaUrl: '', mediaList: [], category: 'General' })
      setSelectedFiles([])
      setPreviewUrls([])
      loadData()
    } catch (error) {
      console.error(error)
      toast.error('Failed to create news post')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteClick = (news) => {
    setNewsToDelete(news)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await newsAPI.delete(newsToDelete.newsPostId)
      toast.success('News post deleted successfully!')
      setShowDeleteModal(false)
      setNewsToDelete(null)
      loadData()
    } catch (error) {
      toast.error('Failed to delete news post')
    }
  }

  const handleEditClick = (news) => {
    console.log('Editing news:', news)
    setNewsToEdit(news)

    // Existing media is already in news.media or news.mediaUrl
    // We will display existing media in the modal from 'news' object directly or store in state

    setEditNews({
      postTitle: news.postTitle || '',
      postContent: news.postContent || '',
      reference: news.reference || '',
      mediaUrl: news.mediaUrl || '', // Preserve main URL if exists
      category: news.category || 'General' // Default to General if null
    })

    // Reset new file selection
    setEditSelectedFiles([])
    setEditPreviewUrls([])
    setShowEditModal(true)
  }

  const handleEditFileChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      setEditSelectedFiles(files)

      // Generate previews for NEW files
      const newPreviewUrls = []
      files.forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          newPreviewUrls.push({ url: reader.result, type: file.type })
          if (newPreviewUrls.length === files.length) {
            setEditPreviewUrls([...newPreviewUrls])
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleEditNews = async (e) => {
    e.preventDefault()
    setIsUploading(true)
    try {
      const mediaList = []

      // Upload NEW files
      if (editSelectedFiles.length > 0) {
        const formData = new FormData()
        editSelectedFiles.forEach(file => {
          formData.append('files', file)
        })

        const uploadResponse = await uploadAPI.uploadFiles(formData)

        uploadResponse.data.forEach(fileData => {
          mediaList.push({
            mediaUrl: fileData.url,
            mediaType: fileData.type.startsWith('image') ? 'image' : 'video'
          })
        })
      }

      // Send update request with new media list
      // Note: We don't send existing media in 'mediaList' as backend appends new ones
      await newsAPI.update(newsToEdit.newsPostId, {
        ...editNews,
        mediaList: mediaList
      })

      toast.success('News post updated!')
      setShowEditModal(false)
      setShowEditModal(false)
      setNewsToEdit(null)
      setEditNews({ postTitle: '', postContent: '', reference: '', mediaUrl: '', category: 'General' })
      setEditSelectedFiles([])
      setEditPreviewUrls([])
      loadData()
    } catch (error) {
      console.error(error)
      toast.error('Failed to update news post')
    } finally {
      setIsUploading(false)
    }
  }

  // User Management Handlers
  const handleDisableUser = (user) => {
    setUserToDisable(user)
    setShowDisableModal(true)
  }

  const handleDisableConfirm = async () => {
    try {
      await usersAPI.delete(userToDisable.userId)
      toast.success('User disabled successfully!')
      setShowDisableModal(false)
      setUserToDisable(null)
      loadData()
    } catch (error) {
      toast.error('Failed to disable user')
    }
  }

  const handleEnableUser = async (user) => {
    try {
      await usersAPI.restore(user.userId)
      toast.success('User enabled successfully!')
      loadData()
    } catch (error) {
      toast.error('Failed to enable user')
    }
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
  }

  // Helper to handle media URLs
  const getMediaUrl = (url) => {
    if (!url) return ''
    if (url.startsWith('http')) return url
    return `${API_BASE_URL.replace('/api', '')}${url}`
  }

  // Helper for pagination
  const getPaginatedData = (data, currentPage) => {
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    return data.slice(indexOfFirstItem, indexOfLastItem)
  }

  const getTotalPages = (dataLength) => {
    return Math.ceil(dataLength / itemsPerPage)
  }

  const renderPagination = (totalItems, currentPage, setCurrentPage) => {
    const totalPages = getTotalPages(totalItems)
    if (totalPages <= 1) return null

    const pages = []
    const maxPagesToShow = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1)
    }

    return (
      <div className="d-flex justify-content-between align-items-center mt-3 px-3 pb-3">
        <small className="text-muted">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
        </small>
        <Pagination className="mb-0">
          <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
          <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />

          {startPage > 1 && <Pagination.Ellipsis disabled />}

          {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(page => (
            <Pagination.Item
              key={page}
              active={page === currentPage}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Pagination.Item>
          ))}

          {endPage < totalPages && <Pagination.Ellipsis disabled />}

          <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
          <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
        </Pagination>
      </div>
    )
  }

  // Get paginated data
  const paginatedUsers = getPaginatedData(filteredUsers, currentPageUsers)
  const paginatedNews = getPaginatedData(filteredNews, currentPageNews)

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Sidebar - Enhanced Design */}
      <div
        className="bg-white border-end d-flex flex-column transition-all"
        style={{
          width: sidebarWidth,
          position: 'fixed',
          height: '100vh',
          boxShadow: '4px 0 15px rgba(0,0,0,0.03)',
          zIndex: 1000,
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflowX: 'hidden'
        }}
      >
        {/* Sidebar Header */}
        <div className="p-0 border-bottom">
          <div className={`d-flex align-items-center ${isSidebarOpen ? 'justify-content-between p-4' : 'justify-content-center py-4'}`} style={{ height: '80px' }}>
            {isSidebarOpen && (
              <h5 className="mb-0 text-primary fw-bold text-nowrap" style={{ letterSpacing: '0.5px' }}>
                <FaChartLine className="me-2" />
                Admin Panel
              </h5>
            )}
            <Button
              variant="link"
              className={`text-dark p-0 ${!isSidebarOpen && 'mx-auto'}`}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
            >
              <FaBars size={20} />
            </Button>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="p-3 flex-grow-1">
          <div className="d-flex flex-column gap-2">
            {[
              { id: 'users', label: 'Users Management', icon: FaUsers },
              { id: 'news', label: 'News Posts', icon: FaNewspaper }
            ].map((item) => (
              <Button
                key={item.id}
                variant="light"
                className={`text-start d-flex align-items-center position-relative border-0 ${!isSidebarOpen && 'justify-content-center p-2'}`}
                onClick={() => {
                  setActiveSection(item.id)
                  setSearchQuery('')
                }}
                style={{
                  backgroundColor: activeSection === item.id ? '#eff6ff' : 'transparent',
                  color: activeSection === item.id ? '#2563eb' : '#64748b',
                  fontWeight: activeSection === item.id ? '600' : '500',
                  padding: isSidebarOpen ? '12px 16px' : '12px',
                  borderRadius: '12px',
                  transition: 'all 0.2s ease',
                  overflow: 'hidden'
                }}
              >
                <item.icon size={20} className={isSidebarOpen ? "me-3" : ""} style={{ minWidth: '20px' }} />

                <span
                  style={{
                    opacity: isSidebarOpen ? 1 : 0,
                    width: isSidebarOpen ? 'auto' : 0,
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {item.label}
                </span>

                {activeSection === item.id && (
                  <div
                    className="position-absolute bg-primary rounded-pill"
                    style={{
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '4px',
                      height: '24px',
                      borderTopRightRadius: '4px',
                      borderBottomRightRadius: '4px'
                    }}
                  />
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Sidebar Footer (Optional) */}
        <div className="p-3 border-top mt-auto">
          <small className="text-muted d-block text-center text-nowrap" style={{ fontSize: '11px' }}>
            {isSidebarOpen ? '© 2025 Thalassemia Care' : '©'}
          </small>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        marginLeft: sidebarWidth,
        width: `calc(100% - ${sidebarWidth})`,
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <Container fluid className="p-4">
          {/* Header */}
          <Row className="mb-4">
            <Col>
              <h2 className="mb-1">{activeSection === 'users' ? 'Users Management' : 'News Posts Management'}</h2>
              <p className="text-muted mb-0">
                {activeSection === 'users'
                  ? 'Manage and monitor all registered users'
                  : 'Create, edit, and manage news articles'}
              </p>
            </Col>
          </Row>

          {/* Search and Actions */}
          <Row className="mb-3">
            <Col md={5}>
              <InputGroup>
                <InputGroup.Text className="bg-white">
                  <FaSearch className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder={`Search ${activeSection === 'users' ? 'users by name or email' : 'news by title'}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
            </Col>
            {activeSection === 'users' && (
              <Col md={3}>
                <InputGroup>
                  <Form.Select
                    value={userStatusFilter}
                    onChange={(e) => setUserStatusFilter(e.target.value)}
                  >
                    <option value="all">All Users</option>
                    <option value="active">Active Only</option>
                    <option value="disabled">Disabled Only</option>
                  </Form.Select>
                </InputGroup>
              </Col>
            )}
            {activeSection === 'users' && (
              <Col md={4} className="text-end">
                <Badge bg="info" className="me-2">
                  Total: {filteredUsers.length}
                </Badge>
                <Badge bg="success" className="me-2">
                  Active: {users.filter(u => !u.isDelete).length}
                </Badge>
                <Badge bg="danger">
                  Disabled: {users.filter(u => u.isDelete).length}
                </Badge>
              </Col>
            )}
            {activeSection === 'news' && (
              <Col md={7} className="text-end">
                <Button variant="primary" onClick={() => setShowNewsModal(true)}>
                  <FaPlus className="me-2" />
                  Create News Post
                </Button>
              </Col>
            )}
          </Row>

          {/* Content Area */}
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-0">
              {isLoading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="text-muted mt-3">Loading data...</p>
                </div>
              ) : activeSection === 'users' ? (
                <>
                  {/* Users Table */}
                  <Table hover responsive className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Phone</th>
                        <th>Status</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedUsers.map((user) => (
                        <tr key={user.userId}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div
                                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                                style={{ width: '40px', height: '40px', fontSize: '14px', fontWeight: '600' }}
                              >
                                {getInitials(user.firstName, user.lastName)}
                              </div>
                              <div>
                                <div className="fw-semibold">{user.firstName} {user.lastName}</div>
                                <small className="text-muted">ID: {user.userId}</small>
                              </div>
                            </div>
                          </td>
                          <td className="align-middle">{user.email}</td>
                          <td className="align-middle">
                            <Badge bg={user.role === 'Admin' ? 'danger' : 'primary'}>
                              {user.role}
                            </Badge>
                          </td>
                          <td className="align-middle">{user.phoneNumber || 'N/A'}</td>
                          <td className="align-middle">
                            {user.isDelete ? (
                              <Badge bg="danger" className="rounded-pill px-3">Disabled</Badge>
                            ) : (
                              <Badge bg="success" className="rounded-pill px-3">Active</Badge>
                            )}
                          </td>
                          <td className="align-middle text-center">
                            {user.isDelete ? (
                              <Button
                                size="sm"
                                variant="outline-success"
                                className="rounded-pill px-3 fw-bold"
                                onClick={() => handleEnableUser(user)}
                              >
                                <FaCheck className="me-1" /> Enable
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline-danger"
                                className="rounded-pill px-3 fw-bold"
                                onClick={() => handleDisableUser(user)}
                              >
                                <FaBan className="me-1" /> Disable
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  {renderPagination(filteredUsers.length, currentPageUsers, setCurrentPageUsers)}
                </>
              ) : (
                /* News Table */
                <Table hover responsive className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th>Title</th>
                      <th>Date</th>
                      <th>Reference</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedNews.map((news) => (
                      <tr key={news.newsPostId}>
                        <td className="align-middle">
                          <div className="d-flex align-items-center">
                            {(news.mediaUrl || (news.media && news.media.length > 0)) && (
                              <Image
                                src={news.mediaUrl ? `${API_BASE_URL.replace('/api', '')}${news.mediaUrl}` : `${API_BASE_URL.replace('/api', '')}${news.media[0].mediaUrl}`}
                                rounded
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                className="me-3"
                                onError={(e) => { e.target.style.display = 'none' }}
                              />
                            )}
                            <div>
                              <div className="fw-semibold">{news.postTitle}</div>
                              <small className="text-muted">
                                {news.postContent.substring(0, 60)}...
                              </small>
                            </div>
                          </div>
                        </td>
                        <td className="align-middle">
                          {new Date(news.publicationDate).toLocaleDateString()}
                        </td>
                        <td className="align-middle">
                          {news.reference ? (
                            <a href={news.reference} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                              View Source
                            </a>
                          ) : (
                            <span className="text-muted">N/A</span>
                          )}
                        </td>
                        <td className="align-middle text-center">
                          <Button
                            size="sm"
                            variant="outline-primary"
                            className="me-2"
                            onClick={() => handleEditClick(news)}
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleDeleteClick(news)}
                          >
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>

          {/* Footer */}
          <div className="text-center mt-4 py-3 border-top">
            <small className="text-muted">© 2024 Thalassemia Care Hub. All rights reserved.</small>
          </div>
        </Container>
      </div>

      {/* Create News Modal */}
      <Modal show={showNewsModal} onHide={() => setShowNewsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create News Post</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateNews}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter news title"
                value={newNews.postTitle}
                onChange={(e) => setNewNews({ ...newNews, postTitle: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Content *</Form.Label>
              <div style={{ height: '250px', marginBottom: '50px' }}>
                <ReactQuill
                  theme="snow"
                  value={newNews.postContent}
                  onChange={(content) => setNewNews({ ...newNews, postContent: content })}
                  style={{ height: '200px' }}
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Reference/Source (optional)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter source URL or citation"
                value={newNews.reference}
                onChange={(e) => setNewNews({ ...newNews, reference: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={newNews.category}
                onChange={(e) => setNewNews({ ...newNews, category: e.target.value })}
              >
                <option value="General">General</option>
                <option value="Research">Research</option>
                <option value="Treatment">Treatment</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Media (Images/Videos)</Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileChange}
                accept="image/*,video/*"
                multiple
              />
              <div className="mt-2 d-flex flex-wrap gap-2">
                {previewUrls.map((preview, idx) => (
                  <div key={idx} className="position-relative" style={{ width: '100px', height: '100px' }}>
                    {preview.type.startsWith('image') ? (
                      <Image
                        src={preview.url}
                        thumbnail
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                      />
                    ) : (
                      <video
                        src={preview.url}
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setShowNewsModal(false)
                setSelectedFile(null)
                setPreviewUrl(null)
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isUploading}>
              {isUploading ? 'Creating...' : 'Create News Post'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit News Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit News Post</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditNews}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter news title"
                value={editNews.postTitle}
                onChange={(e) => setEditNews({ ...editNews, postTitle: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Content *</Form.Label>
              <div style={{ height: '250px', marginBottom: '50px' }}>
                <ReactQuill
                  theme="snow"
                  value={editNews.postContent}
                  onChange={(content) => setEditNews({ ...editNews, postContent: content })}
                  style={{ height: '200px' }}
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Reference/Source (optional)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter source URL or citation"
                value={editNews.reference}
                onChange={(e) => setEditNews({ ...editNews, reference: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={editNews.category}
                onChange={(e) => setEditNews({ ...editNews, category: e.target.value })}
              >
                <option value="General">General</option>
                <option value="Research">Research</option>
                <option value="Treatment">Treatment</option>
              </Form.Select>
            </Form.Group>

            {/* Existing Media Display */}
            {newsToEdit && ((newsToEdit.media && newsToEdit.media.length > 0) || newsToEdit.mediaUrl) && (
              <Form.Group className="mb-3">
                <Form.Label>Existing Media</Form.Label>
                <div className="d-flex flex-wrap gap-2">
                  {newsToEdit.media && newsToEdit.media.map((media, idx) => (
                    <div key={idx} style={{ width: '100px', height: '100px' }} className="position-relative">
                      {media.mediaType === 'video' || media.mediaUrl.endsWith('.mp4') ? (
                        <video
                          src={getMediaUrl(media.mediaUrl)}
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                      ) : (
                        <Image
                          src={getMediaUrl(media.mediaUrl)}
                          thumbnail
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                      )}
                    </div>
                  ))}
                  {/* Legacy MediaUrl Fallback */}
                  {(!newsToEdit.media || newsToEdit.media.length === 0) && newsToEdit.mediaUrl && (
                    <div style={{ width: '100px', height: '100px' }}>
                      <Image
                        src={getMediaUrl(newsToEdit.mediaUrl)}
                        thumbnail
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                </div>
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Add New Media (Images/Videos)</Form.Label>
              <Form.Control
                type="file"
                onChange={handleEditFileChange}
                accept="image/*,video/*"
                multiple
              />
              <div className="mt-2 d-flex flex-wrap gap-2">
                {editPreviewUrls.map((preview, idx) => (
                  <div key={idx} className="position-relative" style={{ width: '100px', height: '100px' }}>
                    {preview.type.startsWith('image') ? (
                      <Image
                        src={preview.url}
                        thumbnail
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                      />
                    ) : (
                      <video
                        src={preview.url}
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setShowEditModal(false)
                setEditSelectedFiles([])
                setEditPreviewUrls([])
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isUploading}>
              {isUploading ? 'Updating...' : 'Update News Post'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the news post "{newsToDelete?.postTitle}"? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Disable User Confirmation Modal */}
      <Modal show={showDisableModal} onHide={() => setShowDisableModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Disable User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to disable user{' '}
          <strong>{userToDisable?.firstName} {userToDisable?.lastName}</strong>?
          <br />
          <small className="text-muted">
            They will not be able to log in until re-enabled.
          </small>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDisableModal(false)}>
            Cancel
          </Button>
          <Button variant="warning" onClick={handleDisableConfirm}>
            <FaBan className="me-1" /> Disable User
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default AdminDashboard
