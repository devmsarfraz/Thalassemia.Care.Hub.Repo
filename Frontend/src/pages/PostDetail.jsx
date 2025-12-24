import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button, Image } from 'react-bootstrap'
import { postsAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-toastify'
import { FaUserCircle, FaCalendarAlt, FaArrowLeft, FaThumbsUp, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa'
import CommentItem from '../components/CommentItem'
import './Community.css'

const PostDetail = () => {
    const { id } = useParams()
    const { user } = useAuth()
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const [commentContent, setCommentContent] = useState('')
    const [submitting, setSubmitting] = useState(false)


    useEffect(() => {
        loadPost()
    }, [id])

    const loadPost = async () => {
        try {
            const response = await postsAPI.getById(id)
            setPost(response.data)
            setLoading(false)
        } catch (error) {
            console.error(error)
            toast.error('Failed to load post')
            setLoading(false)
        }
    }

    const toggleLike = async (postId) => {
        // Optimistic update
        setPost(prev => ({
            ...prev,
            isLiked: !prev.isLiked,
            likeCount: prev.isLiked ? prev.likeCount - 1 : prev.likeCount + 1
        }))

        try {
            await postsAPI.toggleLike(postId)
        } catch (error) {
            console.error(error)
            toast.error('Failed to like post')
            // Revert
            setPost(prev => ({
                ...prev,
                isLiked: !prev.isLiked,
                likeCount: prev.isLiked ? prev.likeCount - 1 : prev.likeCount + 1
            }))
        }
    }

    const handleCommentSubmit = async (e) => {
        e.preventDefault()
        if (!commentContent.trim()) return

        setSubmitting(true)
        try {
            await postsAPI.createComment(id, { commentContent })
            toast.success('Comment added successfully')
            setCommentContent('')
            loadPost() // Reload to show new comment
        } catch (error) {
            console.error(error)
            toast.error('Failed to add comment')
        } finally {
            setSubmitting(false)
        }
    }

    const handleUpdateComment = async (commentId, content) => {
        if (!content || !content.trim()) return

        try {
            await postsAPI.updateComment(commentId, { commentContent: content })
            toast.success('Comment updated successfully')
            loadPost()
        } catch (error) {
            console.error(error)
            toast.error('Failed to update comment')
        }
    }

    const handleReply = async (postId, text, parentId) => {
        try {
            await postsAPI.createComment(postId, {
                commentContent: text,
                parentCommentId: parentId
            })
            toast.success('Reply added')
            loadPost()
        } catch (error) {
            console.error(error)
            toast.error('Failed to add reply')
        }
    }

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Are you sure you want to delete this comment?")) return

        try {
            await postsAPI.deleteComment(commentId)
            toast.success('Comment deleted successfully')
            loadPost()
        } catch (error) {
            console.error(error)
            toast.error('Failed to delete comment')
        }
    }

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </Container>
        )
    }

    if (!post) {
        return (
            <Container className="mt-5 text-center">
                <h3>Post not found</h3>
                <Link to="/community" className="btn btn-primary mt-3">Back to Community</Link>
            </Container>
        )
    }

    return (
        <Container className="mt-4 mb-5">
            <Link to="/community" className="btn btn-outline-secondary mb-4">
                <FaArrowLeft className="me-2" /> Back to Forums
            </Link>

            <Row>
                <Col md={8} className="mx-auto">
                    {/* Post Content */}
                    <Card className="shadow-sm border-0 mb-4">
                        <Card.Body>
                            <h1 className="h3 mb-3">{post.postTitle}</h1>

                            <div className="d-flex align-items-center mb-4 text-muted">
                                <FaUserCircle size={24} className="me-2" />
                                <span className="me-3">{post.userName || 'Unknown User'}</span>
                                <FaCalendarAlt className="me-2" />
                                <span>{new Date(post.creationDate).toLocaleDateString()} {new Date(post.creationDate).toLocaleTimeString()}</span>
                            </div>

                            {post.mediaUrl && (
                                <div className="mb-4 text-center bg-light rounded" style={{ maxHeight: '600px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Image
                                        src={post.mediaUrl}
                                        fluid
                                        style={{ maxHeight: '600px', objectFit: 'contain', width: '100%' }}
                                    />
                                </div>
                            )}

                            <Card.Text style={{ whiteSpace: 'pre-line', fontSize: '1.1rem' }}>
                                {post.postContent}
                            </Card.Text>
                            <div className="d-flex align-items-center mt-3 pt-3 border-top">
                                <Button
                                    variant={post.isLiked ? "primary" : "outline-primary"}
                                    className="me-3"
                                    onClick={() => toggleLike(post.postId)}
                                >
                                    <FaThumbsUp className="me-2" />
                                    {post.isLiked ? 'Liked' : 'Like'} ({post.likeCount || 0})
                                </Button>
                                <div className="text-muted">
                                    {post.comments ? post.comments.length : 0} comments
                                </div>
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Comments Section */}
                    <h4 className="mb-3">Comments ({post.comments ? post.comments.length : 0})</h4>

                    <Card className="shadow-sm border-0 mb-4">
                        <Card.Body>
                            <Form onSubmit={handleCommentSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Write a comment..."
                                        value={commentContent}
                                        onChange={(e) => setCommentContent(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <div className="d-flex justify-content-end">
                                    <Button variant="primary" type="submit" disabled={submitting}>
                                        {submitting ? 'Posting...' : 'Post Comment'}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>


                    {post.comments && post.comments.length > 0 ? (
                        post.comments.map((comment) => (
                            <CommentItem
                                key={comment.commentId}
                                comment={comment}
                                postId={post.postId}
                                currentUserId={user?.userId}
                                onReply={handleReply}
                                onEdit={handleUpdateComment}
                                onDelete={handleDeleteComment}
                            />
                        ))
                    ) : (
                        <div className="text-center text-muted py-4">
                            <p>No comments yet. Be the first to share your thoughts!</p>
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    )
}

export default PostDetail
