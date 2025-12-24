import React, { useState } from 'react';
import { Button, Form, Dropdown, Image } from 'react-bootstrap';
import { FaUserCircle, FaReply, FaShare, FaEdit, FaTrash, FaEllipsisH, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

const CommentItem = ({ comment, postId, currentUserId, onReply, onEdit, onDelete }) => {
    const [showReplyInput, setShowReplyInput] = useState(false);

    const [showReplies, setShowReplies] = useState(false);
    const [replyText, setReplyText] = useState('');

    const handleReplySubmit = (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        onReply(postId, replyText, comment.commentId);
        setReplyText('');
        setShowReplyInput(false);
    };

    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.commentContent);

    const handleUpdate = () => {
        if (onEdit) {
            onEdit(comment.commentId, editContent);
            setIsEditing(false);
        }
    };

    return (
        <div className="comment-item mb-3">
            <div className="d-flex">
                {comment.profilePicture ? (
                    <Image
                        src={`${API_BASE_URL.replace('/api', '')}${comment.profilePicture}`}
                        roundedCircle
                        width="32"
                        height="32"
                        className="me-2 mt-1 object-fit-cover flex-shrink-0"
                    />
                ) : (
                    <FaUserCircle size={32} className="text-secondary me-2 mt-1 flex-shrink-0" />
                )}
                <div className="flex-grow-1">
                    <div className="bg-light p-2 rounded-3">
                        <div className="d-flex justify-content-between align-items-start">
                            <span className="fw-bold small">{comment.userName}</span>
                            {currentUserId === comment.userId && !isEditing && (
                                <Dropdown align="end" className="ms-2">
                                    <Dropdown.Toggle variant="link" className="text-secondary p-0 border-0 no-caret" size="sm" style={{ lineHeight: '1' }}>
                                        <FaEllipsisH size={14} />
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu style={{ minWidth: '150px' }}>
                                        {onEdit && (
                                            <Dropdown.Item onClick={() => setIsEditing(true)}>
                                                <FaEdit className="me-2" /> Edit
                                            </Dropdown.Item>
                                        )}
                                        {onDelete && (
                                            <Dropdown.Item className="text-danger" onClick={() => onDelete(comment.commentId)}>
                                                <FaTrash className="me-2" /> Delete
                                            </Dropdown.Item>
                                        )}
                                    </Dropdown.Menu>
                                </Dropdown>
                            )}
                        </div>
                        {isEditing ? (
                            <div className="mt-2">
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className="mb-2 text-sm"
                                    style={{ fontSize: '0.9rem' }}
                                />
                                <div className="d-flex gap-2 justify-content-end align-items-center">
                                    <small className="text-secondary me-2" style={{ cursor: 'pointer' }} onClick={() => setIsEditing(false)}>Cancel</small>
                                    <Button size="sm" variant="primary" className="rounded-pill px-3 py-1" onClick={handleUpdate} style={{ fontSize: '0.8rem' }}>Save</Button>
                                </div>
                            </div>
                        ) : (
                            <div className="small text-break">{comment.commentContent}</div>
                        )}
                    </div>

                    <div className="d-flex align-items-center gap-3 mt-1 ms-1">
                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                            {new Date(comment.creationDate).toLocaleString()}
                        </small>
                        <Button
                            variant="link"
                            className="p-0 text-decoration-none small text-secondary fw-bold"
                            style={{ fontSize: '0.75rem' }}
                            onClick={() => {
                                setShowReplyInput(!showReplyInput);
                                if (!showReplyInput && comment.replies && comment.replies.length > 0) {
                                    setShowReplies(true);
                                }
                            }}
                        >
                            Reply
                        </Button>
                        {/* Can add Like button for comments later */}
                    </div>

                    {/* Reply Input */}
                    {showReplyInput && (
                        <Form onSubmit={handleReplySubmit} className="mt-2 d-flex gap-2">
                            <FaUserCircle size={24} className="text-secondary mt-1" />
                            <Form.Control
                                type="text"
                                placeholder={`Reply to ${comment.userName}...`}
                                className="rounded-pill bg-light form-control-sm"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                autoFocus
                            />

                        </Form>
                    )}

                    {/* Recursive Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-2">
                            {!showReplies && (
                                <Button
                                    variant="link"
                                    className="p-0 text-decoration-none small text-muted fw-bold d-flex align-items-center mb-2"
                                    onClick={() => setShowReplies(true)}
                                >
                                    <FaReply className="me-2" style={{ transform: 'rotate(180deg)' }} />
                                    View {comment.replies.length} replies
                                </Button>
                            )}

                            {showReplies && (
                                <>
                                    <div className="replies-container border-start ps-3 ms-2">
                                        {comment.replies.map(reply => (
                                            <CommentItem
                                                key={reply.commentId}
                                                comment={reply}
                                                postId={postId}
                                                currentUserId={currentUserId}
                                                onReply={onReply}
                                                onEdit={onEdit}
                                                onDelete={onDelete}
                                            />
                                        ))}
                                    </div>
                                    {/* Hide option at the bottom */}
                                    <Button
                                        variant="link"
                                        className="p-0 text-decoration-none small text-muted fw-bold d-flex align-items-center mt-1 ms-3"
                                        onClick={() => setShowReplies(false)}
                                    >
                                        Hide replies
                                    </Button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommentItem;
