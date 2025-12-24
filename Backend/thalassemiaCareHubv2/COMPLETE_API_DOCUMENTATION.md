# Complete API Documentation - Thalassemia Care Hub Backend

## Base URL
```
http://localhost:5000/api
```
or
```
https://your-domain.com/api
```

## Authentication
Most endpoints require JWT Bearer token authentication. Include the token in the Authorization header:
```
Authorization: Bearer {your-jwt-token}
```

---

## 1. Authentication APIs (`/api/auth`)

### 1.1 Signup
**POST** `/api/auth/signup`

Register a new user account. Sends verification email automatically.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "1234567890",
  "address": "123 Main Street, City, State",
  "bloodGroup": "A+",
  "roleID": 1
}
```

**Response (200):**
```json
{
  "message": "Signup Successful"
}
```

**Response (400):**
```json
{
  "message": "User with this email already exists."
}
```

---

### 1.2 Login
**POST** `/api/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2024-01-01T12:00:00Z",
  "user": {
    "userId": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "Patient"
  }
}
```

**Response (401):**
```json
{
  "message": "Invalid email or password."
}
```

---

### 1.3 Verify Email
**POST** `/api/auth/verify-email`

Verify user email with verification code sent during signup.

**Request Body:**
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully!"
}
```

**Response (400):**
```json
{
  "success": false,
  "message": "Invalid or expired verification code."
}
```

---

### 1.4 Update Password
**POST** `/api/auth/update-password`

Update user password (requires current password).

**Request Body:**
```json
{
  "email": "user@example.com",
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

**Response (200):**
```json
{
  "message": "Password updated successfully."
}
```

**Response (400):**
```json
{
  "message": "Current password is incorrect or email not found."
}
```

---

### 1.5 Logout
**POST** `/api/auth/logout`

Logout user (client-side token invalidation).

**Response (200):**
```json
{
  "message": "Logout successful. Please remove the token from client storage."
}
```

---

## 2. User Management APIs (`/api/users`)

### 2.1 Get All Users
**GET** `/api/users`

Get list of all users in the system.

**Response (200):**
```json
[
  {
    "userId": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "1234567890",
    "address": "123 Main Street",
    "bloodGroup": "A+",
    "gender": "Male",
    "guardianName": null,
    "guardianNumber": null,
    "role": "Patient"
  }
]
```

---

### 2.2 Get User Profile
**GET** `/api/users/{id}`

Get user profile by user ID.

**Response (200):**
```json
{
  "userId": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "1234567890",
  "address": "123 Main Street",
  "bloodGroup": "A+",
  "gender": "Male",
  "guardianName": null,
  "guardianNumber": null,
  "role": "Patient"
}
```

**Response (404):**
```json
{
  "message": "User not found."
}
```

---

### 2.3 Update User Profile
**PUT** `/api/users/{id}`

Update user profile information.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "1234567890",
  "address": "123 Main Street",
  "bloodGroup": "A+",
  "gender": "Male",
  "guardianName": "Jane Doe",
  "guardianNumber": "9876543210"
}
```

**Response (200):**
```json
{
  "userId": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  ...
}
```

---

### 2.4 Delete User
**DELETE** `/api/users/{id}`

Soft delete a user (sets IsDelete flag to true).

**Response (200):**
```json
{
  "message": "User deleted successfully."
}
```

**Response (404):**
```json
{
  "message": "User not found or already deleted."
}
```

---

### 2.5 Update User Role
**PUT** `/api/users/{id}/role`

Update user role (Admin only).

**Request Body:**
```json
{
  "roleId": 2
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User role updated successfully",
  "user": {
    "userId": 1,
    "role": "Admin"
  }
}
```

---

### 2.6 Associate User (Caregiver-Patient)
**POST** `/api/users/associate`

Create caregiver-patient association.

**Request Body:**
```json
{
  "caregiverEmail": "caregiver@example.com",
  "patientEmail": "patient@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Association created successfully",
  "caregiver": { ... },
  "patient": { ... }
}
```

---

### 2.7 Get Current User Info
**GET** `/api/users/me`
**Requires:** Authentication

Get current authenticated user's information from JWT token.

**Response (200):**
```json
{
  "userId": "1",
  "email": "user@example.com",
  "role": "Patient",
  "isAdmin": false,
  "allClaims": [...]
}
```

---

### 2.8 Get Admin Users
**GET** `/api/users/admins`
**Requires:** Authentication

Get all admin users (for debugging).

**Response (200):**
```json
{
  "adminCount": 2,
  "adminUsers": [...],
  "message": "Found 2 admin users"
}
```

---

## 3. Community Posts APIs (`/api/posts`)

### 3.1 Create Post
**POST** `/api/posts`
**Requires:** Authentication

Create a new community post.

**Request Body:**
```json
{
  "postTitle": "Tips for Managing Thalassemia Symptoms",
  "postContent": "Here are some helpful tips I've learned...",
  "mediaUrl": "https://storage.example.com/files/image.jpg"
}
```

**Response (201):**
```json
{
  "postId": 1,
  "userId": 1,
  "userName": "John Doe",
  "postTitle": "Tips for Managing Thalassemia Symptoms",
  "postContent": "Here are some helpful tips...",
  "mediaUrl": "https://storage.example.com/files/image.jpg",
  "creationDate": "2024-01-01T10:00:00Z",
  "lastEditedDate": null,
  "comments": [],
  "media": []
}
```

---

### 3.2 Get All Posts
**GET** `/api/posts`

Get all community posts (no authentication required).

**Response (200):**
```json
[
  {
    "postId": 1,
    "userId": 1,
    "userName": "John Doe",
    "postTitle": "Tips for Managing Thalassemia Symptoms",
    "postContent": "...",
    "creationDate": "2024-01-01T10:00:00Z",
    "comments": [...],
    "media": []
  }
]
```

---

### 3.3 Get Post by ID
**GET** `/api/posts/{id}`

Get a specific post with comments and media.

**Response (200):**
```json
{
  "postId": 1,
  "userId": 1,
  "userName": "John Doe",
  "postTitle": "...",
  "postContent": "...",
  "comments": [
    {
      "commentId": 1,
      "postId": 1,
      "userId": 2,
      "userName": "Jane Smith",
      "commentContent": "Great post!",
      "creationDate": "2024-01-01T11:00:00Z"
    }
  ],
  "media": []
}
```

---

### 3.4 Update Post
**PUT** `/api/posts/{id}`
**Requires:** Authentication (Owner only)

Update a post (only the owner can update).

**Request Body:**
```json
{
  "postTitle": "Updated Title",
  "postContent": "Updated content",
  "mediaUrl": "https://storage.example.com/files/updated-image.jpg"
}
```

**Response (200):**
```json
{
  "postId": 1,
  "postTitle": "Updated Title",
  ...
}
```

---

### 3.5 Delete Post
**DELETE** `/api/posts/{id}`
**Requires:** Authentication (Owner only)

Soft delete a post.

**Response (204):** No Content

---

### 3.6 Create Comment
**POST** `/api/posts/{id}/comments`
**Requires:** Authentication

Create a comment on a post.

**Request Body:**
```json
{
  "commentContent": "Great post! I found this very helpful."
}
```

**Response (201):**
```json
{
  "commentId": 1,
  "postId": 1,
  "userId": 2,
  "userName": "Jane Smith",
  "commentContent": "Great post!",
  "creationDate": "2024-01-01T11:00:00Z"
}
```

---

### 3.7 Get Comments for Post
**GET** `/api/posts/{id}/comments`

Get all comments for a specific post.

**Response (200):**
```json
[
  {
    "commentId": 1,
    "postId": 1,
    "userId": 2,
    "userName": "Jane Smith",
    "commentContent": "Great post!",
    "creationDate": "2024-01-01T11:00:00Z"
  }
]
```

---

### 3.8 Update Comment
**PUT** `/api/posts/comments/{commentId}`
**Requires:** Authentication (Owner only)

Update a comment.

**Request Body:**
```json
{
  "commentContent": "Updated comment content"
}
```

**Response (200):**
```json
{
  "commentId": 1,
  "commentContent": "Updated comment content",
  ...
}
```

---

### 3.9 Delete Comment
**DELETE** `/api/posts/comments/{commentId}`
**Requires:** Authentication (Owner only)

Soft delete a comment.

**Response (204):** No Content

---

### 3.10 Upload Media for Post
**POST** `/api/posts/{id}/media`
**Requires:** Authentication (Owner only)

Upload media URL for a post.

**Request Body:**
```json
{
  "mediaUrl": "https://storage.example.com/files/image.jpg",
  "mediaType": "image"
}
```

**Response (200):**
```json
{
  "postId": 1,
  "mediaUrl": "https://storage.example.com/files/image.jpg",
  ...
}
```

---

## 4. News APIs (`/api/news`)

### 4.1 Create News Post
**POST** `/api/news`
**Requires:** Authentication (Admin only)

Create a new news post (Admin only).

**Request Body:**
```json
{
  "postTitle": "New Thalassemia Treatment Breakthrough",
  "postContent": "Researchers have announced a breakthrough...",
  "reference": "https://medicaljournal.org/thalassemia-breakthrough",
  "mediaUrl": "https://storage.example.com/files/news-image.jpg"
}
```

**Response (200):**
```json
{
  "newsPostId": 1,
  "userId": 1,
  "userName": "Admin User",
  "postTitle": "New Thalassemia Treatment Breakthrough",
  "postContent": "...",
  "publicationDate": "2024-01-01T10:00:00Z",
  "reference": "https://medicaljournal.org/...",
  "mediaUrl": "https://storage.example.com/files/news-image.jpg",
  "media": []
}
```

---

### 4.2 Get All News Posts
**GET** `/api/news`

Get all news posts (public access).

**Response (200):**
```json
[
  {
    "newsPostId": 1,
    "userId": 1,
    "userName": "Admin User",
    "postTitle": "New Thalassemia Treatment Breakthrough",
    "postContent": "...",
    "publicationDate": "2024-01-01T10:00:00Z",
    "media": []
  }
]
```

---

### 4.3 Get News Post by ID
**GET** `/api/news/{id}`

Get a specific news post with media.

**Response (200):**
```json
{
  "newsPostId": 1,
  "userId": 1,
  "userName": "Admin User",
  "postTitle": "...",
  "postContent": "...",
  "publicationDate": "2024-01-01T10:00:00Z",
  "reference": "https://medicaljournal.org/...",
  "media": [
    {
      "mediaId": 1,
      "newsPostId": 1,
      "mediaUrl": "https://storage.example.com/files/news-image.jpg",
      "mediaType": "image",
      "createdDate": "2024-01-01T10:00:00Z"
    }
  ]
}
```

---

### 4.4 Update News Post
**PUT** `/api/news/{id}`
**Requires:** Authentication

Update a news post.

**Request Body:**
```json
{
  "postTitle": "Updated Title",
  "postContent": "Updated content",
  "reference": "https://updated-reference.com",
  "mediaUrl": "https://storage.example.com/files/updated-image.jpg"
}
```

**Response (200):**
```json
{
  "newsPostId": 1,
  "postTitle": "Updated Title",
  ...
}
```

---

### 4.5 Delete News Post
**DELETE** `/api/news/{id}`
**Requires:** Authentication

Soft delete a news post.

**Response (204):** No Content

---

### 4.6 Upload Media for News Post
**POST** `/api/news/{id}/media`
**Requires:** Authentication

Upload media for a news post.

**Request Body:**
```json
{
  "mediaUrl": "https://storage.example.com/files/news-medical-image.jpg",
  "mediaType": "image"
}
```

**Response (200):**
```json
{
  "mediaId": 1,
  "newsPostId": 1,
  "mediaUrl": "https://storage.example.com/files/news-medical-image.jpg",
  "mediaType": "image",
  "createdDate": "2024-01-01T10:00:00Z"
}
```

---

### 4.7 Delete Media
**DELETE** `/api/news/media/{mediaId}`
**Requires:** Authentication (Admin only)

Delete a media record.

**Response (204):** No Content

---

## 5. Chat APIs (`/api/chat`)

### 5.1 Create Chat Session
**POST** `/api/chat/session`
**Requires:** Authentication

Create a new chat session with AI.

**Request Body:**
```json
{
  "sessionTitle": "Thalassemia Treatment Questions"
}
```

**Response (201):**
```json
{
  "chatSessionId": 1,
  "sessionTitle": "Thalassemia Treatment Questions",
  "creationDate": "2024-01-01T10:00:00Z",
  "isDelete": false,
  "userId": 1,
  "messageCount": 0,
  "lastMessageDate": null
}
```

---

### 5.2 Get User Sessions
**GET** `/api/chat/history`
**Requires:** Authentication

Get all chat sessions for the current user.

**Response (200):**
```json
[
  {
    "chatSessionId": 1,
    "sessionTitle": "Thalassemia Treatment Questions",
    "creationDate": "2024-01-01T10:00:00Z",
    "messageCount": 5,
    "lastMessageDate": "2024-01-01T11:00:00Z"
  }
]
```

---

### 5.3 Get Session History
**GET** `/api/chat/history/{sessionId}`
**Requires:** Authentication

Get chat history (messages) for a specific session.

**Response (200):**
```json
{
  "session": {
    "chatSessionId": 1,
    "sessionTitle": "Thalassemia Treatment Questions",
    "creationDate": "2024-01-01T10:00:00Z",
    "messageCount": 2
  },
  "messages": [
    {
      "messageId": 1,
      "chatSessionId": 1,
      "senderType": "User",
      "messageContent": "What are the common symptoms of thalassemia?",
      "timestamp": "2024-01-01T10:00:00Z"
    },
    {
      "messageId": 2,
      "chatSessionId": 1,
      "senderType": "AI",
      "messageContent": "Common symptoms include fatigue, weakness, pale skin...",
      "timestamp": "2024-01-01T10:00:05Z"
    }
  ]
}
```

---

### 5.4 Send Message
**POST** `/api/chat/session/{sessionId}/message`
**Requires:** Authentication

Send a message to AI chatbot and get response.

**Request Body:**
```json
{
  "messageContent": "What are the common symptoms of thalassemia?"
}
```

**Response (200):**
```json
{
  "userMessage": {
    "messageId": 1,
    "chatSessionId": 1,
    "senderType": "User",
    "messageContent": "What are the common symptoms of thalassemia?",
    "timestamp": "2024-01-01T10:00:00Z"
  },
  "aiMessage": {
    "messageId": 2,
    "chatSessionId": 1,
    "senderType": "AI",
    "messageContent": "Common symptoms include fatigue, weakness, pale skin...",
    "timestamp": "2024-01-01T10:00:05Z"
  },
  "success": true,
  "errorMessage": null
}
```

---

### 5.5 Delete Session
**DELETE** `/api/chat/session/{sessionId}`
**Requires:** Authentication

Soft delete a chat session.

**Response (204):** No Content

---

### 5.6 Delete Message
**DELETE** `/api/chat/message/{messageId}`
**Requires:** Authentication

Delete a specific message from a chat session.

**Response (204):** No Content

---

## Error Responses

### Common Error Codes

**400 Bad Request:**
```json
{
  "message": "Invalid request data"
}
```

**401 Unauthorized:**
```json
{
  "message": "User not authenticated"
}
```

**403 Forbidden:**
```json
{
  "message": "Admin access required"
}
```

**404 Not Found:**
```json
{
  "message": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "message": "An error occurred while processing your request",
  "error": "Detailed error message"
}
```

---

## Authentication Flow

1. **Signup**: User registers → receives verification email
2. **Verify Email**: User verifies email with code
3. **Login**: User logs in → receives JWT token
4. **Use Token**: Include token in Authorization header for protected endpoints

---

## Role-Based Access Control

- **Public**: No authentication required
- **Authenticated**: Any logged-in user
- **Admin**: Only users with Admin role
- **Owner**: Only the user who created the resource

---

## Notes

- All timestamps are in UTC
- Soft deletes are used (IsDelete flag)
- Media URLs should be uploaded to storage service first
- JWT tokens expire after 60 minutes
- Email verification codes expire after 15 minutes (configurable)

---

## Swagger Documentation

When running in Development mode, Swagger UI is available at:
```
http://localhost:5000
```

This provides interactive API documentation with the ability to test endpoints directly.

