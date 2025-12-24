# Thalassemia Care Hub - Complete System Documentation

## Table of Contents
1. [System Architecture Overview](#system-architecture-overview)
2. [API Endpoints Specification](#api-endpoints-specification)
3. [Detailed Application Workflows](#detailed-application-workflows)
4. [Database Schema](#database-schema)
5. [Entity-Relationship Diagram](#entity-relationship-diagram)
6. [Technical Implementation Details](#technical-implementation-details)

---

## System Architecture Overview

### Three-Layer Architecture
- **Frontend**: React.js + Bootstrap (User Interface)
- **Backend**: ASP.NET Core (Server Logic & API Bridge)
- **Database**: SQL Server (Data Storage)
- **AI Integration**: Dialogflow/Microsoft Bot Framework (Chatbot Service)

### Core Features
- User authentication and role-based access control
- Caregiver-patient association system
- Community forum with posts and comments
- AI-powered chatbot for medical guidance
- News and information management (Admin-only)
- Media file management and attachments

---

## API Endpoints Specification

### 1. Authentication & User Management API (12 endpoints)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Create new user account |
| `/api/auth/login` | POST | Login/Authentication with JWT token |
| `/api/auth/logout` | POST | Logout/Invalidate session |
| `/api/auth/forgot-password` | POST | Send password reset link |
| `/api/auth/reset-password` | POST | Reset password with token |
| `/api/users/{id}` | GET | Read user profile information |
| `/api/users/{id}` | PUT | Update user profile (name, email, phone, etc.) |
| `/api/users/{id}/password` | PUT | Change password (when logged in) |
| `/api/users/associate` | POST | Create caregiver-patient association |
| `/api/users/{id}` | DELETE | Soft delete user (IsDelete = true) |
| `/api/users` | GET | List all users (Admin only) |
| `/api/users/{id}/role` | PUT | Update user role (Admin only) |

### 2. Community Forum API (11 endpoints)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/posts` | POST | Create new community post |
| `/api/posts` | GET | List all community posts |
| `/api/posts/{id}` | GET | Read single post with comments & media |
| `/api/posts/{id}` | PUT | Update post (owner only) |
| `/api/posts/{id}` | DELETE | Soft delete post |
| `/api/posts/{id}/comments` | POST | Create comment on post |
| `/api/posts/{id}/comments` | GET | List comments for a post |
| `/api/comments/{commentId}` | PUT | Update comment (owner only) |
| `/api/comments/{commentId}` | DELETE | Soft delete comment |
| `/api/posts/{id}/media` | POST | Upload media for a post |
| `/api/media/{mediaId}` | DELETE | Delete media record |

### 3. News & Information API (7 endpoints)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/news` | POST | Create news post (Admin only) |
| `/api/news` | GET | List news posts |
| `/api/news/{id}` | GET | Read single news post |
| `/api/news/{id}` | PUT | Update news post (Admin only) |
| `/api/news/{id}` | DELETE | Soft delete news post (Admin only) |
| `/api/news/{id}/media` | POST | Upload media for news post (Admin only) |
| `/api/news/media/{mediaId}` | DELETE | Delete news media record (Admin only) |

### 4. AI Chatbot API (6 endpoints)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat/session` | POST | Create new chat session |
| `/api/chat/history` | GET | List user's chat sessions |
| `/api/chat/history/{sessionId}` | GET | Get messages for session |
| `/api/chat/session/{sessionId}/message` | POST | Send user message to AI |
| `/api/chat/session/{sessionId}` | DELETE | Delete chat session (soft delete) |
| `/api/chat/message/{messageId}` | DELETE | Delete single message |

**Total: 36 API Endpoints**

---

## Detailed Application Workflows

### User Registration & Login Flow
1. User opens the web application
2. User enters registration/login details
3. Frontend sends data to backend
4. Backend verifies credentials against SQL Server database
5. Backend sends success message and JWT token to frontend
6. User accesses personalized features

### Password Reset Flow
1. User clicks "Forgot Password" on login page
2. User enters email address
3. Backend generates reset token and sends email
4. User clicks reset link in email
5. User enters new password
6. Backend validates token and updates password
7. User can login with new password

### Logout Flow
1. User clicks logout button
2. Frontend sends logout request to backend
3. Backend invalidates JWT token (if token blacklisting implemented)
4. Frontend removes token from local storage
5. User redirected to login page

### Caretaker Workflow
1. **Caregiver Registration**: New user registers with 'Caregiver' role
2. **Patient-Caregiver Association**: Caregiver links account to specific patient via AssociatedUserID
3. **Access to Information**: System provides personalized content based on association
4. **Community Engagement**: Caregiver interacts in community forum
5. **AI Chatbot**: Trained to answer caregiver-specific questions

### AI Chatbot Interaction Flow (Critical)
1. User types query in chatbot interface
2. Frontend sends query to backend
3. Backend forwards query to AI tool (Dialogflow/Microsoft Bot Framework)
4. AI processes query and retrieves information from database if needed
5. AI sends response back to backend
6. Backend forwards response to frontend
7. Chatbot displays response to user

### Community Forum Workflow
1. User creates post or comment
2. Frontend sends data to backend
3. Backend saves to SQL Server database
4. Frontend retrieves and displays content to all users

### News and Information Workflow
1. Admin logs into secure admin section
2. Admin creates new post with title, content, and optional image
3. Backend saves post data to database
4. Regular users access "News and Information" page
5. Frontend retrieves posts from backend
6. Frontend displays posts in blog-like format

### Chat History Workflow
1. User starts new chat session
2. User sends message to backend
3. Backend forwards to AI chatbot and saves both messages
4. Frontend displays conversation in real-time
5. User can create new chat tabs/sessions
6. User can access complete chat history for any session

### Admin Dashboard Workflow
1. Existing admin logs into secure Admin Dashboard
2. Admin navigates to user management page
3. Admin creates new user account
4. System automatically sets UserRole to 'Admin'

### Role-Based NewsPost Workflow
1. Authenticated user attempts to create NewsPost
2. Backend receives request with UserID
3. System queries User table for UserRole
4. **Authorization Check**:
   - IF UserRole = 'Admin' → Authorized, proceed
   - ELSE → Access Denied
5. Only admin users can create NewsPost

### Community Post Creation Workflow
1. Any registered user logs in
2. User navigates to community forum
3. User submits post title and content
4. Frontend sends POST request with UserID
5. Backend verifies UserID is valid and authenticated
6. Backend creates new Post record with UserID as foreign key
7. Backend returns success message

### Editing a Post Workflow
1. Logged-in user attempts to edit post
2. System sends request with UserID and PostID
3. Backend compares requesting UserID with Post's UserID
4. **Authorization**: IF UserIDs match → Allow update, ELSE → Deny
5. Backend updates PostContent and LastEditedDate

### Post Workflow with Multiple Media
1. User selects multiple images/videos
2. Frontend sends files to backend
3. Backend uploads to cloud storage
4. Backend returns unique URLs for each file
5. Backend creates Post record first
6. Backend creates Media record for each file with PostID foreign key

---

## Database Schema

### User Table
```sql
UserID (Primary Key)
Username
Email
PasswordHash
UserRole (Values: 'Patient', 'Caregiver', 'Admin')
RegistrationDate
AssociatedUserID (Foreign Key, links caregiver to patient)
IsDelete
```

### CommunityPost Table
```sql
PostID (Primary Key)
UserID (Foreign Key)
PostTitle
PostContent
CreationDate
LastEditedDate
IsDelete
```

### CommunityPostComment Table
```sql
CommentID (Primary Key)
PostID (Foreign Key, links to Post)
UserID (Foreign Key, links to User)
CommentContent
CreationDate
LastEditedDate
IsDelete
```

### NewsPost Table
```sql
NewsPostID (Primary Key)
UserID (Foreign Key)
PostTitle
PostContent
PublicationDate
Category (e.g., "Research," "Treatment," "Community Events")
Reference (Link)
LastEditedDate
IsDelete
```

### ChatSession Table
```sql
ChatSessionID (Primary Key)
UserID (Foreign Key, links session to user)
SessionTitle (e.g., "Symptom Check, Feb 10, 2025")
CreationDate
IsDelete
```

### ChatMessage Table
```sql
MessageID (Primary Key)
ChatSessionID (Foreign Key, links message to session)
SenderType (Values: 'User' or 'Bot')
MessageContent
Timestamp
```

### Media Table
```sql
MediaID (Primary Key)
PostID (Foreign Key, links to Community Post)
CommentID (Foreign Key, links to Comment)
NewsPostID (Foreign Key, links to Admin News Post)
MediaURL (URL for uploaded file)
MediaType (Values: 'image', 'video', 'document')
IsDelete
```

---

## Entity-Relationship Diagram

### Relationships

#### One-to-Many Relationships
- **User to Post**: One User can create many Posts. Each Post is created by one User.
- **User to Comment**: One User can write many Comments. Each Comment is written by one User.
- **Post to Comment**: One Post can have many Comments. Each Comment belongs to one Post.
- **Admin to NewsPost**: One Admin can create many NewsPosts. Each NewsPost is created by one Admin.
- **User to ChatSession**: A User can have many ChatSessions. Each ChatSession belongs to only one User.
- **ChatSession to ChatMessage**: A ChatSession can contain many ChatMessages. Each ChatMessage belongs to only one ChatSession.

#### Self-Referencing Relationship
- **User to CareTaker**: The AssociatedUserID attribute creates a self-referencing relationship. A patient (User A) is linked to a caregiver (User B), and a caregiver (User B) is linked to a patient (User A).

#### Media Relationships
- **NewsPost to Media**: One NewsPost can have many Media records.
- **CommunityPost to Media**: One CommunityPost can have many Media records.
- **Comment to Media**: One Comment can have many Media records.

---

## Technical Implementation Details

### Authentication & Security
- **JWT Token-based Authentication**: Secure token management for all API calls
- **Role-based Access Control**: Different access levels for Patient, Caregiver, and Admin
- **Owner Verification**: Users can only edit their own posts/comments
- **Admin-only Features**: News creation and management restricted to Admin role

### AI Integration Architecture
- **Backend as Intermediary**: ASP.NET Core acts as bridge between frontend and AI service
- **Database Integration**: AI can query database for personalized responses
- **Session Management**: Chat conversations organized by sessions
- **Real-time Processing**: Messages processed and responses delivered in real-time

### Media Management
- **Cloud Storage**: Files uploaded to cloud storage with unique URLs
- **Multiple File Support**: Posts can have multiple media attachments
- **Foreign Key Relationships**: Media linked to Posts/Comments/NewsPosts
- **Media Type Classification**: Support for images, videos, and documents

### Data Management Patterns
- **Soft Delete**: All entities use IsDelete flag instead of hard deletion
- **Audit Trail**: Creation and modification timestamps for all records
- **Foreign Key Constraints**: Proper referential integrity maintained
- **Cascade Operations**: Related data properly managed on updates/deletes

### API Design Patterns
- **RESTful Architecture**: Standard HTTP methods and status codes
- **DTO Pattern**: Data Transfer Objects for API requests/responses
- **Repository Pattern**: Data access abstraction layer
- **Service Layer**: Business logic separation from controllers
- **Dependency Injection**: Loose coupling and testability

### Performance Considerations
- **Pagination**: Large data sets paginated for better performance
- **Caching**: Frequently accessed data cached for faster retrieval
- **Database Indexing**: Proper indexes on foreign keys and search fields
- **Async Operations**: Non-blocking operations for better scalability

---

## Current Implementation Status

### ✅ Completed Features
- User authentication and JWT management
- User registration and login
- User logout functionality
- User role management and authorization
- Caregiver-patient association system
- Basic user CRUD operations
- Password encryption and security
- Swagger API documentation
- User profile management
- Admin-only user listing
- Admin-only role updates

### 🔄 Ready for Implementation
- Password reset functionality (forgot/reset password)
- Community Forum API (11 endpoints)
- News & Information API (7 endpoints)
- AI Chatbot API (6 endpoints)
- Media management system
- File upload and cloud storage integration
- AI service integration

### 🎯 Future Enhancements
- Advanced AI training for medical guidance
- Real-time notifications
- Advanced search functionality
- Mobile app integration
- Analytics and reporting dashboard
- Multi-language support

---

## Development Guidelines

### Code Standards
- Follow ASP.NET Core best practices
- Implement proper error handling and logging
- Use async/await patterns for database operations
- Maintain consistent naming conventions
- Write comprehensive unit tests

### Security Best Practices
- Validate all input data
- Implement proper authentication checks
- Use parameterized queries to prevent SQL injection
- Encrypt sensitive data
- Regular security audits

### Testing Strategy
- Unit tests for business logic
- Integration tests for API endpoints
- Database migration testing
- Performance testing for scalability
- Security testing for vulnerabilities

---

*This documentation serves as the complete reference for the Thalassemia Care Hub system architecture, workflows, and implementation guidelines.*
