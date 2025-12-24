import axios from 'axios'
import { API_BASE_URL } from '../config/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config.url.includes('/auth/login')) {
      // Token expired or invalid
      localStorage.removeItem('authToken')
      localStorage.removeItem('userData')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  logout: () => api.post('/auth/logout'),
  updatePassword: (data) => api.post('/auth/update-password', data),
  verifyEmail: (data) => api.post('/auth/verify-email', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  verifyResetCode: (data) => api.post('/auth/verify-reset-code', data),
  resetPassword: (data) => api.post('/auth/reset-password', data)
}

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  restore: (id) => api.put(`/users/${id}/restore`),
  updateRole: (id, data) => api.put(`/users/${id}/role`, data),
  associate: (data) => api.post('/users/associate', data),
  // Association Request APIs
  createAssociationRequest: (data) => api.post('/users/association-request', data),
  getPendingAssociationRequests: (userId) => api.get(`/users/${userId}/association-requests/pending`),
  getSentAssociationRequests: (userId) => api.get(`/users/${userId}/association-requests/sent`),
  acceptAssociationRequest: (requestId, userId) => api.put(`/users/association-request/${requestId}/accept`, userId),
  rejectAssociationRequest: (requestId, userId) => api.put(`/users/association-request/${requestId}/reject`, userId),
  uploadProfilePicture: (id, formData) => api.post(`/users/${id}/profile-picture`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// Community Posts API
export const postsAPI = {
  getAll: () => api.get('/posts'),
  getById: (id) => api.get(`/posts/${id}`),
  create: (data) => api.post('/posts', data),
  update: (id, data) => api.put(`/posts/${id}`, data),
  delete: (id) => api.delete(`/posts/${id}`),
  getComments: (postId) => api.get(`/posts/${postId}/comments`),
  createComment: (postId, data) => api.post(`/posts/${postId}/comments`, data),
  updateComment: (commentId, data) => api.put(`/posts/comments/${commentId}`, data),
  deleteComment: (commentId) => api.delete(`/posts/comments/${commentId}`),
  uploadMedia: (postId, data) => api.post(`/posts/${postId}/media`, data),
  toggleLike: (id) => api.post(`/posts/${id}/like`)
}

// News API
export const newsAPI = {
  getAll: () => api.get('/news'),
  getById: (id) => api.get(`/news/${id}`),
  create: (data) => api.post('/news', data),
  update: (id, data) => api.put(`/news/${id}`, data),
  delete: (id) => api.delete(`/news/${id}`),

  // Social features
  addComment: (id, data) => api.post(`/news/${id}/comment`, data),
  deleteComment: (id) => api.delete(`/news/comment/${id}`),
  toggleLike: (id) => api.post(`/news/${id}/like`, {}),
  uploadMedia: (id, data) => api.post(`/news/${id}/media`, data),
  deleteMedia: (mediaId) => api.delete(`/news/media/${mediaId}`)
}

// Chat API
export const chatAPI = {
  createSession: (data) => api.post('/chat/session', data),
  getSessions: () => api.get('/chat/history'),
  getSessionHistory: (sessionId) => api.get(`/chat/history/${sessionId}`),
  sendMessage: (sessionId, data) => api.post(`/chat/session/${sessionId}/message`, data),
  updateSession: (sessionId, data) => api.put(`/chat/session/${sessionId}`, data),
  deleteSession: (sessionId) => api.delete(`/chat/session/${sessionId}`),
  deleteMessage: (messageId) => api.delete(`/chat/message/${messageId}`)
}

// Upload API
export const uploadAPI = {
  uploadFile: (formData) => api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  uploadFiles: (formData) => api.post('/upload/multiple', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export default api
