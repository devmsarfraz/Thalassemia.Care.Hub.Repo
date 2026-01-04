import { useState, useRef, useEffect, useCallback } from 'react'
import { Container, Button, Form, Spinner, Image } from 'react-bootstrap'
import {
    FaPlus,
    FaPaperPlane,
    FaBars,
    FaTrash,
    FaEdit,
    FaRobot,
    FaUser,
    FaSearch,
    FaCheck,
    FaTimes,
    FaStar
} from 'react-icons/fa'
import { chatAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { API_BASE_URL } from '../config/api'
import './Chat.css'

const Chat = () => {
    const { user } = useAuth()
    const [messages, setMessages] = useState([])
    const [inputMessage, setInputMessage] = useState('')
    const [isTyping, setIsTyping] = useState(false)

    // Debug: Log user data to check profile picture
    useEffect(() => {
        console.log('Current user data:', user)
        console.log('Profile picture:', user?.profilePicture)
    }, [user])
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [conversations, setConversations] = useState([])
    const [currentSessionId, setCurrentSessionId] = useState(null)
    const [loadingHistory, setLoadingHistory] = useState(false)

    // Search state
    const [searchQuery, setSearchQuery] = useState('')

    // Rename state
    const [editingSessionId, setEditingSessionId] = useState(null)
    const [editTitle, setEditTitle] = useState('')

    const messagesEndRef = useRef(null)
    const textareaRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isTyping])

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
        }
    }, [inputMessage])

    // Fetch all chat sessions on mount
    const fetchSessions = useCallback(async () => {
        try {
            const response = await chatAPI.getSessions()
            const sessions = response.data || []
            const sortedSessions = sessions.sort((a, b) =>
                new Date(b.lastMessageDate || b.creationDate) - new Date(a.lastMessageDate || a.creationDate)
            )
            setConversations(sortedSessions)

            // Don't auto-select any session - let user start fresh or choose a conversation
        } catch (error) {
            console.error("Error fetching sessions:", error)
        }
    }, [currentSessionId])

    useEffect(() => {
        if (user) {
            fetchSessions()
        }
    }, [user, fetchSessions])

    // Load messages when session changes
    useEffect(() => {
        if (!currentSessionId) {
            setMessages([])
            return
        }

        const loadMessages = async () => {
            setLoadingHistory(true)
            try {
                const response = await chatAPI.getSessionHistory(currentSessionId)
                if (response.data && response.data.messages) {
                    const uiMessages = response.data.messages.map(m => ({
                        id: m.messageId,
                        role: m.senderType === 'User' ? 'user' : 'assistant',
                        content: m.messageContent,
                        timestamp: new Date(m.timestamp)
                    }))
                    uiMessages.sort((a, b) => a.timestamp - b.timestamp)
                    setMessages(uiMessages)
                }
            } catch (error) {
                console.error("Error loading chat history:", error)
            } finally {
                setLoadingHistory(false)
            }
        }

        loadMessages()
    }, [currentSessionId])

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!inputMessage.trim()) return

        const tempId = Date.now()
        const userMsg = {
            id: tempId,
            role: 'user',
            content: inputMessage,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMsg])
        setInputMessage('')
        setIsTyping(true)

        try {
            let sessionId = currentSessionId

            if (!sessionId) {
                const createRes = await chatAPI.createSession({
                    sessionTitle: inputMessage.substring(0, 30) || "New Conversation"
                })
                sessionId = createRes.data.chatSessionId
                setCurrentSessionId(sessionId)
                fetchSessions()
            }

            const response = await chatAPI.sendMessage(sessionId, { messageContent: userMsg.content })
            setIsTyping(false)

            if (response.data && response.data.success) {
                const aiMsg = response.data.aiMessage
                const uiAiMsg = {
                    id: aiMsg.messageId,
                    role: 'assistant',
                    content: aiMsg.messageContent,
                    timestamp: new Date(aiMsg.timestamp)
                }

                const realUserMsg = response.data.userMessage
                const uiRealUserMsg = {
                    id: realUserMsg.messageId,
                    role: 'user',
                    content: realUserMsg.messageContent,
                    timestamp: new Date(realUserMsg.timestamp)
                }

                setMessages(prev => prev.map(m => m.id === tempId ? uiRealUserMsg : m).concat(uiAiMsg))
                fetchSessions()
            } else {
                console.error("Failed to send message")
            }

        } catch (error) {
            console.error("Error sending message:", error)
            setIsTyping(false)
            setMessages(prev => [...prev, {
                id: Date.now(),
                role: 'assistant',
                content: "I'm sorry, I'm having trouble connecting right now. Please try again.",
                timestamp: new Date()
            }])
        }
    }

    const handleNewChat = async () => {
        try {
            const createRes = await chatAPI.createSession({
                sessionTitle: "New Chat"
            })
            if (createRes.data) {
                setCurrentSessionId(createRes.data.chatSessionId)
                fetchSessions()
                setMessages([])
            }
        } catch (error) {
            console.error("Error creating new chat:", error)
        }
    }

    const handleDeleteSession = async (sessionId, e) => {
        e.stopPropagation()
        if (!window.confirm("Are you sure you want to delete this chat?")) return

        try {
            await chatAPI.deleteSession(sessionId)
            if (sessionId === currentSessionId) {
                setCurrentSessionId(null)
                setMessages([])
            }
            fetchSessions()
        } catch (error) {
            console.error("Error deleting session:", error)
        }
    }

    const startEditing = (e, session) => {
        e.stopPropagation()
        setEditingSessionId(session.chatSessionId)
        setEditTitle(session.sessionTitle)
    }

    const cancelEditing = (e) => {
        e.stopPropagation()
        setEditingSessionId(null)
        setEditTitle('')
    }

    const saveTitle = async (e, sessionId) => {
        e.stopPropagation()
        if (!editTitle.trim()) return

        try {
            await chatAPI.updateSession(sessionId, { sessionTitle: editTitle })
            setEditingSessionId(null)
            fetchSessions()
        } catch (error) {
            console.error("Error updating session title:", error)
        }
    }

    const formatTime = (dateString) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        const now = new Date()
        const diff = now - date
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))

        if (days === 0) return 'Today'
        if (days === 1) return 'Yesterday'
        if (days < 7) return `${days} days ago`
        return date.toLocaleDateString()
    }

    const filteredConversations = conversations.filter(conv =>
        conv.sessionTitle.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="chat-page">
            {/* Sidebar */}
            <div className={`chat-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <Button className="new-chat-btn mb-3" onClick={handleNewChat}>
                        <FaPlus /> New chat
                    </Button>

                    <div className="search-wrapper">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            className="search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="conversations-list">
                    {filteredConversations.length === 0 && searchQuery && (
                        <div className="text-center text-muted p-3" style={{ fontSize: '0.9rem' }}>
                            No chats found
                        </div>
                    )}

                    {filteredConversations.map(conv => (
                        <div
                            key={conv.chatSessionId}
                            className={`conversation-item ${currentSessionId === conv.chatSessionId ? 'active' : ''}`}
                            onClick={() => setCurrentSessionId(conv.chatSessionId)}
                        >
                            <div className="conversation-content">
                                {editingSessionId === conv.chatSessionId ? (
                                    <div className="edit-title-wrapper" onClick={(e) => e.stopPropagation()}>
                                        <input
                                            type="text"
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            className="edit-title-input"
                                            autoFocus
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') saveTitle(e, conv.chatSessionId)
                                                if (e.key === 'Escape') cancelEditing(e)
                                            }}
                                        />
                                        <div className="edit-actions">
                                            <button className="conv-action-btn text-success" onClick={(e) => saveTitle(e, conv.chatSessionId)}>
                                                <FaCheck />
                                            </button>
                                            <button className="conv-action-btn text-danger" onClick={cancelEditing}>
                                                <FaTimes />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <span className="conversation-title">{conv.sessionTitle || "Untitled Chat"}</span>
                                        <span className="conversation-date">{formatTime(conv.lastMessageDate || conv.creationDate)}</span>
                                    </>
                                )}
                            </div>

                            {editingSessionId !== conv.chatSessionId && (
                                <div className="conversation-actions">
                                    <button
                                        className="conv-action-btn"
                                        onClick={(e) => startEditing(e, conv)}
                                        title="Rename Chat"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        className="conv-action-btn delete-btn"
                                        onClick={(e) => handleDeleteSession(conv.chatSessionId, e)}
                                        title="Delete Chat"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="chat-main">
                {/* Header */}
                <div className="chat-header">
                    <button
                        className="sidebar-toggle-btn"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <FaBars />
                    </button>
                    <h5 className="chat-title">
                        AI Health Assistant
                    </h5>
                </div>

                {/* Messages */}
                <div className="messages-area">
                    {loadingHistory ? (
                        <div className="d-flex justify-content-center align-items-center h-100">
                            <Spinner animation="border" style={{ color: '#6366f1' }} />
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">🤖</div>
                            <h2>How can I help you today?</h2>
                            <p>I'm powered by Google Gemini AI to assist you with Thalassemia-related medical information.</p>
                            <div className="suggestion-cards">
                                <div className="suggestion-card" onClick={() => setInputMessage('What are the symptoms of Thalassemia?')}>
                                    <span className="suggestion-icon">📚</span>
                                    <span>What are the symptoms?</span>
                                </div>
                                <div className="suggestion-card" onClick={() => setInputMessage('Foods to avoid with Thalassemia?')}>
                                    <span className="suggestion-icon">🥗</span>
                                    <span>Dietary recommendations?</span>
                                </div>
                                <div className="suggestion-card" onClick={() => setInputMessage('Explain Chelation Therapy')}>
                                    <span className="suggestion-icon">💊</span>
                                    <span>Treatment options?</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="messages-container">
                            {messages.map(message => (
                                <div key={message.id} className={`message ${message.role}`}>
                                    <div className="message-avatar">
                                        {message.role === 'user' ? (
                                            user?.profilePicture ? (
                                                <Image
                                                    src={`${API_BASE_URL.replace('/api', '')}${user.profilePicture}`}
                                                    roundedCircle
                                                    className="user-avatar-img"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none'
                                                        e.target.nextSibling.style.display = 'flex'
                                                    }}
                                                />
                                            ) : (
                                                <FaUser />
                                            )
                                        ) : (
                                            <FaRobot />
                                        )}
                                        {message.role === 'user' && user?.profilePicture && (
                                            <FaUser style={{ display: 'none' }} />
                                        )}
                                    </div>
                                    <div className="message-content">
                                        <div className="message-text">
                                            {message.content}
                                        </div>
                                        <div className="message-time">
                                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="message assistant">
                                    <div className="message-avatar"><FaRobot /></div>
                                    <div className="message-content">
                                        <div className="message-text">
                                            <div className="typing-indicator">
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="input-area">
                    <Form onSubmit={handleSendMessage} className="input-form">
                        <div className="input-wrapper">
                            <Form.Control
                                as="textarea"
                                ref={textareaRef}
                                rows={1}
                                placeholder="Ask about symptoms, diet, or treatment..."
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault()
                                        handleSendMessage(e)
                                    }
                                }}
                                className="message-input"
                                disabled={isTyping}
                                style={{
                                    minHeight: '24px',
                                    maxHeight: '150px',
                                    overflow: 'auto'
                                }}
                            />
                            <button
                                type="submit"
                                className="send-button"
                                disabled={!inputMessage.trim() || isTyping}
                            >
                                {isTyping ? <Spinner animation="border" size="sm" /> : <FaPaperPlane />}
                            </button>
                        </div>
                    </Form>
                    <p className="input-disclaimer">
                        AI can make mistakes. Always consult a doctor for medical decisions.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Chat
