import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Container, Row, Col, Card, Button, Image, Carousel, Form, InputGroup } from 'react-bootstrap'
import { newsAPI } from '../services/api'
import { toast } from 'react-toastify'
import {
    FaArrowLeft,
    FaCalendarAlt,
    FaUserCircle,
    FaHeart,
    FaRegHeart,
    FaComment,
    FaLink,
    FaReply,
    FaTrash,
    FaClock,
    FaFacebook,
    FaTwitter,
    FaLinkedin,
    FaBookmark,
    FaRegBookmark
} from 'react-icons/fa'
import { API_BASE_URL } from '../config/api'
import { useAuth } from '../contexts/AuthContext'
import '../styles/news-styles.css'

const NewsDetail = () => {
    const { id } = useParams()
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)

    const { user, isAuthenticated } = useAuth()
    const [likeCount, setLikeCount] = useState(0)
    const [isLiked, setIsLiked] = useState(false)
    const [comments, setComments] = useState([])
    const [commentContent, setCommentContent] = useState('')
    const [replyTo, setReplyTo] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [isBookmarked, setIsBookmarked] = useState(false)

    useEffect(() => {
        if (post) {
            setLikeCount(post.likeCount || 0)
            setIsLiked(post.isLikedByCurrentUser || false)
            setComments(post.comments || [])
        }
    }, [post])

    useEffect(() => {
        loadPost()
    }, [id])

    const loadPost = async () => {
        try {
            const response = await newsAPI.getById(id)
            setPost(response.data)
        } catch (error) {
            console.error(error)
            toast.error('Failed to load news article')
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const calculateReadingTime = (content) => {
        const wordsPerMinute = 200
        const textContent = content.replace(/<[^>]*>/g, '')
        const wordCount = textContent.split(/\s+/).length
        const minutes = Math.ceil(wordCount / wordsPerMinute)
        return `${minutes} min read`
    }

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <div className="spinner-border" style={{ color: 'var(--news-primary)' }} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </Container>
        )
    }

    if (!post) {
        return (
            <Container className="mt-5 text-center">
                <h3 style={{ fontFamily: 'var(--news-heading-font)' }}>Article not found</h3>
                <Link to="/news" className="news-card-cta mt-3" style={{ display: 'inline-flex' }}>
                    <FaArrowLeft className="me-2" /> Back to News
                </Link>
            </Container>
        )
    }

    // Prepare media list
    let mediaItems = post.media ? [...post.media] : []
    if (post.mediaUrl) {
        const isUrlInList = mediaItems.some(item => item.mediaUrl === post.mediaUrl)
        if (!isUrlInList) {
            mediaItems.unshift({ mediaUrl: post.mediaUrl, mediaType: 'image' })
        }
    }

    const getMediaUrl = (url) => {
        if (!url) return ''
        if (url.startsWith('http')) return url
        return `${API_BASE_URL.replace('/api', '')}${url}`
    }

    const handleLike = async () => {
        if (!isAuthenticated) {
            toast.info('Please login to like posts')
            return
        }
        try {
            await newsAPI.toggleLike(id)
            setIsLiked(!isLiked)
            setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
        } catch (error) {
            console.error(error)
            toast.error('Failed to update like')
        }
    }

    const handleCopyLink = () => {
        const url = window.location.href
        navigator.clipboard.writeText(url).then(() => {
            toast.success('Link copied to clipboard!')
        }).catch(err => {
            console.error('Failed to copy: ', err)
            toast.error('Failed to copy link')
        })
    }

    const handleShare = (platform) => {
        const url = window.location.href
        const title = post.postTitle
        let shareUrl = ''

        switch (platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
                break
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
                break
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
                break
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400')
        }
    }

    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked)
        toast.success(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks')
    }

    const handleCommentSubmit = async (e, parentId = null) => {
        e.preventDefault()
        if (!isAuthenticated) return
        if (!commentContent.trim()) return

        setSubmitting(true)
        try {
            const response = await newsAPI.addComment(id, {
                commentContent: commentContent,
                parentCommentId: parentId
            })

            if (response.data) {
                toast.success('Comment added!')
                setCommentContent('')
                setReplyTo(null)
                loadPost()
            }
        } catch (error) {
            console.error(error)
            toast.error('Failed to add comment')
        } finally {
            setSubmitting(false)
        }
    }

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return

        try {
            await newsAPI.deleteComment(commentId)
            toast.success('Comment deleted')
            loadPost()
        } catch (error) {
            console.error(error)
            toast.error('Failed to delete comment')
        }
    }

    // Recursive Comment Component
    const CommentItem = ({ comment }) => (
        <div className={`d-flex mb-3 ${comment.parentCommentId ? 'ms-5' : ''}`}>
            <div className="flex-shrink-0 me-3">
                {comment.userProfileImage ? (
                    <Image src={getMediaUrl(comment.userProfileImage)} roundedCircle width={40} height={40} style={{ objectFit: 'cover' }} />
                ) : (
                    <FaUserCircle size={40} style={{ color: 'var(--news-text-light)' }} />
                )}
            </div>
            <div className="flex-grow-1">
                <div style={{
                    background: 'var(--news-bg-secondary)',
                    padding: '1rem',
                    borderRadius: 'var(--news-radius-md)'
                }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 style={{
                            fontFamily: 'var(--news-ui-font)',
                            fontWeight: '600',
                            marginBottom: 0,
                            color: 'var(--news-text-primary)'
                        }}>
                            {comment.userName}
                        </h6>
                        <small style={{
                            fontFamily: 'var(--news-ui-font)',
                            color: 'var(--news-text-light)',
                            fontSize: 'var(--news-caption)'
                        }}>
                            {new Date(comment.creationDate).toLocaleDateString()}
                        </small>
                    </div>
                    <p style={{
                        fontFamily: 'var(--news-body-font)',
                        marginBottom: '0.25rem',
                        color: 'var(--news-text-secondary)',
                        lineHeight: '1.6'
                    }}>
                        {comment.commentContent}
                    </p>
                </div>
                <div className="d-flex align-items-center mt-2 gap-3">
                    {isAuthenticated && (
                        <Button
                            variant="link"
                            className="p-0 text-decoration-none"
                            onClick={() => setReplyTo(replyTo === comment.commentId ? null : comment.commentId)}
                            style={{
                                fontFamily: 'var(--news-ui-font)',
                                fontSize: 'var(--news-caption)',
                                color: 'var(--news-text-light)',
                                fontWeight: '500'
                            }}
                        >
                            <FaReply className="me-1" /> Reply
                        </Button>
                    )}
                    {isAuthenticated && user && user.userId === comment.userId && (
                        <Button
                            variant="link"
                            className="p-0 text-decoration-none text-danger"
                            onClick={() => handleDeleteComment(comment.commentId)}
                            style={{
                                fontFamily: 'var(--news-ui-font)',
                                fontSize: 'var(--news-caption)',
                                fontWeight: '500'
                            }}
                        >
                            <FaTrash className="me-1" /> Delete
                        </Button>
                    )}
                </div>

                {/* Reply Form */}
                {replyTo === comment.commentId && (
                    <Form className="mt-3" onSubmit={(e) => handleCommentSubmit(e, comment.commentId)}>
                        <InputGroup>
                            <Form.Control
                                placeholder="Write a reply..."
                                value={commentContent}
                                onChange={(e) => setCommentContent(e.target.value)}
                                autoFocus
                                style={{ fontFamily: 'var(--news-ui-font)' }}
                            />
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={submitting}
                                style={{
                                    background: 'var(--news-primary)',
                                    border: 'none',
                                    fontFamily: 'var(--news-ui-font)',
                                    fontWeight: '600'
                                }}
                            >
                                Reply
                            </Button>
                        </InputGroup>
                    </Form>
                )}

                {/* Nested Comments */}
                {comment.repliedComments && comment.repliedComments.length > 0 && (
                    <div className="mt-3">
                        {comment.repliedComments.map(reply => (
                            <CommentItem key={reply.commentId} comment={reply} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )

    return (
        <div style={{ background: 'var(--news-bg-secondary)', minHeight: '100vh', paddingBottom: '4rem' }}>
            <Container className="pt-4">
                {/* Back Button */}
                <Link
                    to="/news"
                    className="news-card-cta mb-4"
                    style={{ display: 'inline-flex' }}
                >
                    <FaArrowLeft className="me-2" /> Back to News
                </Link>

                <Row>
                    <Col lg={10} className="mx-auto">
                        <article>
                            {/* Article Header with Hero Image */}
                            {mediaItems.length > 0 && (
                                <div className="news-article-header">
                                    {mediaItems[0].mediaType === 'video' || mediaItems[0].mediaUrl.endsWith('.mp4') ? (
                                        <video
                                            controls
                                            className="news-article-header-image"
                                            src={getMediaUrl(mediaItems[0].mediaUrl)}
                                        />
                                    ) : (
                                        <img
                                            src={getMediaUrl(mediaItems[0].mediaUrl)}
                                            alt={post.postTitle}
                                            className="news-article-header-image"
                                        />
                                    )}
                                    <div className="news-article-header-overlay"></div>
                                    <div className="news-article-header-content">
                                        <div className="news-article-breadcrumb">
                                            <Link to="/news" style={{ color: 'white', textDecoration: 'none' }}>News</Link>
                                            <span>›</span>
                                            <span>{post.category || 'Article'}</span>
                                        </div>
                                        <h1 className="news-article-title">{post.postTitle}</h1>
                                        <div className="news-article-meta">
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <FaUserCircle size={16} />
                                                {post.userName || 'Admin'}
                                            </span>
                                            <span>•</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <FaCalendarAlt size={14} />
                                                {formatDate(post.publicationDate)}
                                            </span>
                                            <span>•</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <FaClock size={14} />
                                                {calculateReadingTime(post.postContent)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Article Content */}
                            <div className="news-article-content">
                                {/* If no header image, show title here */}
                                {mediaItems.length === 0 && (
                                    <div className="mb-4">
                                        <div className="news-article-breadcrumb" style={{ color: 'var(--news-text-light)' }}>
                                            <Link to="/news" style={{ color: 'var(--news-primary)', textDecoration: 'none' }}>News</Link>
                                            <span>›</span>
                                            <span>{post.category || 'Article'}</span>
                                        </div>
                                        <h1 style={{
                                            fontFamily: 'var(--news-heading-font)',
                                            fontSize: 'var(--news-hero-title)',
                                            fontWeight: '900',
                                            lineHeight: '1.1',
                                            marginBottom: '1rem',
                                            color: 'var(--news-text-primary)'
                                        }}>
                                            {post.postTitle}
                                        </h1>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1.5rem',
                                            fontFamily: 'var(--news-ui-font)',
                                            fontSize: 'var(--news-body-small)',
                                            color: 'var(--news-text-light)'
                                        }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <FaUserCircle size={16} />
                                                {post.userName || 'Admin'}
                                            </span>
                                            <span>•</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <FaCalendarAlt size={14} />
                                                {formatDate(post.publicationDate)}
                                            </span>
                                            <span>•</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <FaClock size={14} />
                                                {calculateReadingTime(post.postContent)}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Social Share Buttons */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    marginBottom: '2rem',
                                    paddingBottom: '1.5rem',
                                    borderBottom: '1px solid var(--news-bg-tertiary)'
                                }}>
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => handleShare('twitter')}
                                        style={{
                                            borderRadius: 'var(--news-radius-pill)',
                                            fontFamily: 'var(--news-ui-font)',
                                            fontWeight: '600',
                                            fontSize: 'var(--news-caption)'
                                        }}
                                    >
                                        <FaTwitter className="me-1" /> Twitter
                                    </Button>
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => handleShare('facebook')}
                                        style={{
                                            borderRadius: 'var(--news-radius-pill)',
                                            fontFamily: 'var(--news-ui-font)',
                                            fontWeight: '600',
                                            fontSize: 'var(--news-caption)'
                                        }}
                                    >
                                        <FaFacebook className="me-1" /> Facebook
                                    </Button>
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => handleShare('linkedin')}
                                        style={{
                                            borderRadius: 'var(--news-radius-pill)',
                                            fontFamily: 'var(--news-ui-font)',
                                            fontWeight: '600',
                                            fontSize: 'var(--news-caption)'
                                        }}
                                    >
                                        <FaLinkedin className="me-1" /> LinkedIn
                                    </Button>
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        onClick={handleCopyLink}
                                        style={{
                                            borderRadius: 'var(--news-radius-pill)',
                                            fontFamily: 'var(--news-ui-font)',
                                            fontWeight: '600',
                                            fontSize: 'var(--news-caption)'
                                        }}
                                    >
                                        <FaLink className="me-1" /> Copy
                                    </Button>
                                    <div style={{ marginLeft: 'auto' }}>
                                        <Button
                                            variant={isBookmarked ? 'primary' : 'outline-primary'}
                                            size="sm"
                                            onClick={handleBookmark}
                                            style={{
                                                borderRadius: 'var(--news-radius-pill)',
                                                fontFamily: 'var(--news-ui-font)',
                                                fontWeight: '600',
                                                fontSize: 'var(--news-caption)'
                                            }}
                                        >
                                            {isBookmarked ? <FaBookmark className="me-1" /> : <FaRegBookmark className="me-1" />}
                                            {isBookmarked ? 'Saved' : 'Save'}
                                        </Button>
                                    </div>
                                </div>

                                {/* Article Body */}
                                <div className="news-article-body" dangerouslySetInnerHTML={{ __html: post.postContent }} />

                                {/* Additional Media (if more than one) */}
                                {mediaItems.length > 1 && (
                                    <div style={{ margin: '3rem 0' }}>
                                        <Carousel interval={null} style={{ borderRadius: 'var(--news-radius-md)', overflow: 'hidden' }}>
                                            {mediaItems.slice(1).map((item, index) => (
                                                <Carousel.Item key={index} style={{ height: '400px', background: 'black' }}>
                                                    <div className="d-flex w-100 h-100 justify-content-center align-items-center">
                                                        {item.mediaType === 'video' || item.mediaUrl.endsWith('.mp4') ? (
                                                            <video
                                                                controls
                                                                style={{ maxHeight: '100%', maxWidth: '100%' }}
                                                                src={getMediaUrl(item.mediaUrl)}
                                                            />
                                                        ) : (
                                                            <Image
                                                                src={getMediaUrl(item.mediaUrl)}
                                                                alt={`Media ${index + 2}`}
                                                                style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                                                            />
                                                        )}
                                                    </div>
                                                </Carousel.Item>
                                            ))}
                                        </Carousel>
                                    </div>
                                )}

                                {/* Reference */}
                                {post.reference && (
                                    <Card style={{
                                        background: 'var(--news-bg-secondary)',
                                        border: 'none',
                                        borderRadius: 'var(--news-radius-md)',
                                        marginTop: '2rem'
                                    }}>
                                        <Card.Body>
                                            <strong style={{
                                                fontFamily: 'var(--news-ui-font)',
                                                color: 'var(--news-text-secondary)'
                                            }}>
                                                Source:{' '}
                                            </strong>
                                            <a
                                                href={post.reference.startsWith('http') ? post.reference : `https://${post.reference}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    fontFamily: 'var(--news-body-font)',
                                                    color: 'var(--news-primary)',
                                                    textDecoration: 'none'
                                                }}
                                            >
                                                {post.reference}
                                            </a>
                                        </Card.Body>
                                    </Card>
                                )}

                                <hr style={{ margin: '3rem 0', border: 'none', borderTop: '1px solid var(--news-bg-tertiary)' }} />

                                {/* Like and Engagement */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    marginBottom: '3rem'
                                }}>
                                    <Button
                                        variant={isLiked ? "danger" : "outline-danger"}
                                        onClick={handleLike}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            borderRadius: 'var(--news-radius-pill)',
                                            padding: '0.75rem 1.5rem',
                                            fontFamily: 'var(--news-ui-font)',
                                            fontWeight: '600',
                                            fontSize: 'var(--news-body-small)'
                                        }}
                                    >
                                        {isLiked ? <FaHeart /> : <FaRegHeart />}
                                        <span>{likeCount} Likes</span>
                                    </Button>
                                </div>

                                {/* Comments Section */}
                                <div>
                                    <h3 style={{
                                        fontFamily: 'var(--news-heading-font)',
                                        fontSize: '1.75rem',
                                        fontWeight: '700',
                                        marginBottom: '1.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        color: 'var(--news-text-primary)'
                                    }}>
                                        <FaComment style={{ color: 'var(--news-primary)' }} />
                                        Comments ({comments.length})
                                    </h3>

                                    {/* Comment Form */}
                                    {isAuthenticated ? (
                                        <Card style={{
                                            marginBottom: '2rem',
                                            border: 'none',
                                            boxShadow: 'var(--news-shadow-md)',
                                            borderRadius: 'var(--news-radius-md)'
                                        }}>
                                            <Card.Body>
                                                <Form onSubmit={(e) => handleCommentSubmit(e)}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Control
                                                            as="textarea"
                                                            rows={3}
                                                            placeholder="Share your thoughts..."
                                                            value={replyTo ? '' : commentContent}
                                                            onChange={(e) => {
                                                                setReplyTo(null)
                                                                setCommentContent(e.target.value)
                                                            }}
                                                            style={{
                                                                fontFamily: 'var(--news-body-font)',
                                                                fontSize: 'var(--news-body-small)',
                                                                borderRadius: 'var(--news-radius-md)'
                                                            }}
                                                        />
                                                    </Form.Group>
                                                    <div className="d-flex justify-content-end">
                                                        <Button
                                                            type="submit"
                                                            disabled={submitting || (!replyTo && !commentContent.trim())}
                                                            style={{
                                                                background: 'var(--news-primary)',
                                                                border: 'none',
                                                                borderRadius: 'var(--news-radius-pill)',
                                                                padding: '0.75rem 1.5rem',
                                                                fontFamily: 'var(--news-ui-font)',
                                                                fontWeight: '600'
                                                            }}
                                                        >
                                                            Post Comment
                                                        </Button>
                                                    </div>
                                                </Form>
                                            </Card.Body>
                                        </Card>
                                    ) : (
                                        <div style={{
                                            padding: '1rem',
                                            background: 'var(--news-bg-secondary)',
                                            borderRadius: 'var(--news-radius-md)',
                                            marginBottom: '2rem',
                                            fontFamily: 'var(--news-ui-font)'
                                        }}>
                                            <Link to="/login" style={{
                                                fontWeight: '600',
                                                color: 'var(--news-primary)'
                                            }}>
                                                Login
                                            </Link> to join the conversation.
                                        </div>
                                    )}

                                    {/* Comments List */}
                                    <div>
                                        {comments.length > 0 ? (
                                            comments.map(comment => (
                                                <CommentItem key={comment.commentId} comment={comment} />
                                            ))
                                        ) : (
                                            <p style={{
                                                textAlign: 'center',
                                                padding: '3rem 1rem',
                                                fontFamily: 'var(--news-body-font)',
                                                color: 'var(--news-text-light)'
                                            }}>
                                                No comments yet. Be the first to share your thoughts!
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </article>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default NewsDetail
