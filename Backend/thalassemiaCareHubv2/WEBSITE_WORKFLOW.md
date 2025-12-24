# Thalassemia Care Hub - Website Workflow & Page Structure

## 🏠 Home Page Design

### Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│                    HEADER / NAVBAR                       │
│  [Logo]  [Home] [Community] [News] [Chat] [Profile]     │
│                                  [Login] [Sign Up]      │
├─────────────────────────────────────────────────────────┤
│                                                           │
│              HERO SECTION                                 │
│  ┌─────────────────────────────────────────────┐        │
│  │   Welcome to Thalassemia Care Hub           │        │
│  │   Your Supportive Community Platform        │        │
│  │                                             │        │
│  │   [Get Started] [Learn More]                │        │
│  └─────────────────────────────────────────────┘        │
│                                                           │
│         FEATURES SECTION (3 Cards)                       │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │ AI Chatbot   │ │  Community   │ │  News & Info │   │
│  │ Instant help │ │  Support     │ │  Updates     │   │
│  └──────────────┘ └──────────────┘ └──────────────┘   │
│                                                           │
│         STATISTICS / QUICK INFO                          │
│  • X Active Users  • Y Community Posts  • Z News        │
│                                                           │
│         RECENT COMMUNITY POSTS (3-4 Cards)              │
│  ┌──────────────────────────────────────────┐          │
│  │ [Post 1 Preview with title + excerpt]     │          │
│  └──────────────────────────────────────────┘          │
│  ┌──────────────────────────────────────────┐          │
│  │ [Post 2 Preview with title + excerpt]    │          │
│  └──────────────────────────────────────────┘          │
│                                                           │
│         CALL TO ACTION                                   │
│  Join Our Community Today! [Sign Up Now]                │
│                                                           │
├─────────────────────────────────────────────────────────┤
│                    FOOTER                                │
│  About | Contact | Privacy | Terms                      │
│  © 2024 Thalassemia Care Hub                            │
└─────────────────────────────────────────────────────────┘
```

### Home Page Elements:

1. **Hero Section**
   - Large, welcoming headline
   - Subtitle describing the platform
   - Two buttons: "Get Started" (signup) and "Learn More" (scroll to features)

2. **Features Section**
   - 3 feature cards with icons:
     - 🤖 AI Chatbot - "Get instant answers from our AI assistant"
     - 👥 Community Forum - "Connect with patients and caregivers"
     - 📰 News & Updates - "Stay informed about latest research"

3. **Statistics Bar**
   - Quick numbers: Active users, Posts, News articles

4. **Recent Community Posts Preview**
   - Show 3-4 latest posts with title, author, date
   - "View All Posts" button linking to Community page

5. **Call-to-Action Section**
   - Encourages signup if not logged in

---

## 📄 All Pages Structure

### 1. **Home Page** (`/`)
- **Purpose**: Landing page, first impression
- **Elements**: Hero, Features, Stats, Recent Posts Preview
- **Access**: Public (everyone can see)
- **Navigation**: Always accessible

### 2. **Login Page** (`/login`)
- **Purpose**: User authentication
- **Layout**:
  ```
  ┌─────────────────────────┐
  │  Thalassemia Care Hub    │
  │         Logo             │
  │                          │
  │  ┌───────────────────┐  │
  │  │   Login Form      │  │
  │  │                   │  │
  │  │  Email: [_______]  │  │
  │  │  Password: [____] │  │
  │  │                   │  │
  │  │  [Login Button]   │  │
  │  │                   │  │
  │  │  Forgot Password? │  │
  │  │  New? Sign Up     │  │
  │  └───────────────────┘  │
  └─────────────────────────┘
  ```
- **Features**: Email/Password fields, "Remember Me", "Forgot Password" link
- **Redirect**: After login → Dashboard or previous page

### 3. **Sign Up Page** (`/signup`)
- **Purpose**: New user registration
- **Layout**: Similar to Login but with more fields:
  - Email, Password, Confirm Password
  - First Name, Last Name
  - Phone Number (optional)
  - Address (optional)
  - Blood Group (optional)
  - **Role Selection**: Patient / Caregiver / Admin (admin usually restricted)
- **After Signup**: Redirect to Login page

### 4. **Dashboard** (`/dashboard`)
- **Purpose**: User's personal overview page (after login)
- **Layout**:
  ```
  ┌─────────────────────────────────────┐
  │  Welcome, [User Name]!              │
  │  [Quick Stats: Posts, Messages, etc]  │
  ├─────────────────────────────────────┤
  │                                      │
  │  [Your Recent Posts]                 │
  │  [Your Recent Chat Sessions]        │
  │  [Quick Actions: Create Post, Chat]  │
  │                                      │
  └─────────────────────────────────────┘
  ```
- **Access**: Protected (requires login)

### 5. **Community Forum** (`/community`)
- **Purpose**: View and create community posts
- **Layout**:
  ```
  ┌─────────────────────────────────────┐
  │  Community Forum                    │
  │  [+ Create New Post] Button         │
  ├─────────────────────────────────────┤
  │                                      │
  │  [Filter: All | My Posts]          │
  │                                      │
  │  ┌──────────────────────────────┐   │
  │  │ Post Card 1                  │   │
  │  │ Title, Author, Date          │   │
  │  │ Content preview...            │   │
  │  │ [Image if any]                │   │
  │  │ 💬 X Comments  🔍 Read More   │   │
  │  └──────────────────────────────┘   │
  │                                      │
  │  ┌──────────────────────────────┐   │
  │  │ Post Card 2                  │   │
  │  └──────────────────────────────┘   │
  │                                      │
  │  [Load More / Pagination]           │
  │                                      │
  └─────────────────────────────────────┘
  ```
- **Features**: 
  - List of all posts (paginated)
  - Create Post button (opens modal)
  - Filter/Search posts
  - Click post to view details

### 6. **Post Detail Page** (`/community/post/:id`)
- **Purpose**: View full post with comments
- **Layout**:
  ```
  ┌─────────────────────────────────────┐
  │  ← Back to Community                │
  ├─────────────────────────────────────┤
  │                                      │
  │  ┌──────────────────────────────┐  │
  │  │ POST HEADER                  │  │
  │  │ Author: John Doe • Date       │  │
  │  │                              │  │
  │  │ POST TITLE                   │  │
  │  │                              │  │
  │  │ POST CONTENT (full text)     │  │
  │  │                              │  │
  │  │ [Image/Media if any]         │  │
  │  │                              │  │
  │  │ [Edit] [Delete] (if owner)   │  │
  │  └──────────────────────────────┘  │
  │                                      │
  │  ┌──────────────────────────────┐  │
  │  │ COMMENTS (X comments)         │  │
  │  │                              │  │
  │  │ ┌────────────────────────┐   │  │
  │  │ │ Comment 1              │   │  │
  │  │ │ User: Jane • Date       │   │  │
  │  │ └────────────────────────┘   │  │
  │  │                              │  │
  │  │ ┌────────────────────────┐   │  │
  │  │ │ Comment 2              │   │  │
  │  │ └────────────────────────┘   │  │
  │  │                              │  │
  │  │ [Add Comment Input]          │  │
  │  │ [Post Comment Button]        │  │
  │  └──────────────────────────────┘  │
  │                                      │
  └─────────────────────────────────────┘
  ```

### 7. **News & Information** (`/news`)
- **Purpose**: View admin-created news posts
- **Layout**: Similar to Community but for news
  ```
  ┌─────────────────────────────────────┐
  │  News & Information                 │
  │  Latest updates about Thalassemia   │
  ├─────────────────────────────────────┤
  │                                      │
  │  ┌──────────────────────────────┐  │
  │  │ News Card 1                  │  │
  │  │ [Image]                      │  │
  │  │ Title | Date                 │  │
  │  │ Excerpt...                    │  │
  │  │ [Read More]                   │  │
  │  └──────────────────────────────┘  │
  │                                      │
  │  ┌──────────────────────────────┐  │
  │  │ News Card 2                  │  │
  │  └──────────────────────────────┘  │
  │                                      │
  └─────────────────────────────────────┘
  ```
- **Access**: Public (read), Admin only (create/edit)

### 8. **News Detail Page** (`/news/:id`)
- **Purpose**: View full news article
- **Layout**: Similar to Post Detail but focused on article format
- **Features**: Full article text, images, publication date

### 9. **AI Chatbot Page** (`/chat`) - ChatGPT Style
- **Purpose**: Interact with AI chatbot
- **Layout**: **ChatGPT-like Interface**
  ```
  ┌──────────────────────────────────────────────┐
  │  AI Chatbot Assistant                       │
  │  [⚙️ Settings]  [📝 New Chat]               │
  ├──────────────────────────────────────────────┤
  │                                              │
  │  ┌─── SIDEBAR (Left) ───┐ │ ┌─── MAIN ────┐ │
  │  │                      │ │ │             │ │
  │  │  [+ New Chat]        │ │ │             │ │
  │  │                      │ │ │             │ │
  │  │  Chat History:       │ │ │             │ │
  │  │  ┌──────────────┐   │ │ │  WELCOME    │ │
  │  │  │ Session 1    │   │ │ │  MESSAGE    │ │
  │  │  └──────────────┘   │ │ │             │ │
  │  │  ┌──────────────┐   │ │ │  How can I  │ │
  │  │  │ Session 2    │   │ │ │  help you?  │ │
  │  │  └──────────────┘   │ │ │             │ │
  │  │                      │ │ │             │ │
  │  │  [Trash Icon]        │ │ │             │ │
  │  │                      │ │ │             │ │
  │  └──────────────────────┘ │ └─────────────┘ │
  │                           │                 │
  │                           │ ┌─────────────┐ │
  │                           │ │ INPUT BOX   │ │
  │                           │ │ [Type here] │ │
  │                           │ │ [Send ⚡]   │ │
  │                           │ └─────────────┘ │
  └──────────────────────────────────────────────┘
  ```

#### ChatGPT-Style Features:

1. **Sidebar (Left)**
   - **New Chat Button** (top) - Creates new session
   - **Chat History List** - All previous chat sessions
   - **Search** - Search through chat history
   - **Session Actions** - Rename, Delete (hover/click)

2. **Main Chat Window**
   - **Welcome Message** (if no messages)
   - **Message List**:
     ```
     ┌──────────────────────────────────┐
     │  [User Avatar]                  │
     │  User Name                      │
     │  Your question here...           │
     │  [Timestamp]                     │
     ├──────────────────────────────────┤
     │              [Bot Avatar]       │
     │              Bot Name            │
     │              Bot response here...│
     │              [Timestamp]         │
     └──────────────────────────────────┘
     ```
   - **Message Styling**:
     - User messages: Right-aligned, colored background
     - Bot messages: Left-aligned, different colored background
     - Timestamp below each message
     - Loading indicator when bot is typing

3. **Input Area (Bottom)**
   - **Text Input Box**: Large, expandable textarea
   - **Send Button**: Arrow/Paper plane icon (disabled when empty)
   - **Attach Files** (optional): If needed
   - **Keyboard Shortcut**: Enter to send, Shift+Enter for new line

4. **Chat Features**:
   - Real-time typing indicators
   - Markdown support in bot responses
   - Copy message button (hover)
   - Edit/Regenerate (if needed)
   - Scroll to bottom on new message
   - Smooth animations

### 10. **User Profile Page** (`/profile/:id` or `/profile`)
- **Purpose**: View and edit user profile
- **Layout**:
  ```
  ┌─────────────────────────────────────┐
  │  ┌──────────────────────────────┐  │
  │  │  PROFILE HEADER               │  │
  │  │  [Avatar/Photo]               │  │
  │  │  John Doe                     │  │
  │  │  [Patient/Caregiver Badge]    │  │
  │  │  [Edit Profile Button]        │  │
  │  └──────────────────────────────┘  │
  ├─────────────────────────────────────┤
  │                                      │
  │  TABS: [Personal Info] [Settings]   │
  │                                      │
  │  ┌──────────────────────────────┐  │
  │  │  PERSONAL INFORMATION         │  │
  │  │  Email: user@example.com     │  │
  │  │  Phone: +1234567890          │  │
  │  │  Address: ...                 │  │
  │  │  Blood Group: A+              │  │
  │  │  Gender: Male                 │  │
  │  └──────────────────────────────┘  │
  │                                      │
  │  ┌──────────────────────────────┐  │
  │  │  ACTIVITY                    │  │
  │  │  Posts: X                    │  │
  │  │  Comments: Y                  │  │
  │  │  Chat Sessions: Z            │  │
  │  └──────────────────────────────┘  │
  │                                      │
  └─────────────────────────────────────┘
  ```

### 11. **Admin Dashboard** (`/admin`)
- **Purpose**: Admin-only management panel
- **Layout**:
  ```
  ┌─────────────────────────────────────┐
  │  Admin Dashboard                    │
  ├─────────────────────────────────────┤
  │                                      │
  │  STATISTICS CARDS:                   │
  │  [Total Users] [Posts] [News]       │
  │                                      │
  │  TABS: [Users] [News] [Settings]    │
  │                                      │
  │  ┌──────────────────────────────┐  │
  │  │  USER MANAGEMENT              │  │
  │  │  [Search Users]               │  │
  │  │  [User List Table]            │  │
  │  │  [Edit Roles] [Delete]        │  │
  │  └──────────────────────────────┘  │
  │                                      │
  │  ┌──────────────────────────────┐  │
  │  │  NEWS MANAGEMENT              │  │
  │  │  [+ Create News]              │  │
  │  │  [News List]                  │  │
  │  │  [Edit] [Delete]              │  │
  │  └──────────────────────────────┘  │
  │                                      │
  └─────────────────────────────────────┘
  ```
- **Access**: Admin role only

---

## 🔄 Complete User Flow

### Flow 1: New User Journey
```
1. Land on Home Page
   ↓
2. Click "Sign Up"
   ↓
3. Fill Signup Form → Submit
   ↓
4. Redirect to Login Page
   ↓
5. Enter Credentials → Login
   ↓
6. Redirect to Dashboard
   ↓
7. Can now access:
   - Community Forum
   - AI Chatbot
   - News
   - Profile
```

### Flow 2: Using AI Chatbot
```
1. Click "Chat" in Navigation
   ↓
2. Chat Page Opens (ChatGPT-style)
   ↓
3. Sidebar shows:
   - New Chat button
   - Previous sessions (if any)
   ↓
4. Click "New Chat" or type in input
   ↓
5. Type message → Press Enter
   ↓
6. Message appears (User message)
   ↓
7. Loading indicator (Bot typing)
   ↓
8. Bot response appears
   ↓
9. Continue conversation
   ↓
10. Session saved automatically
```

### Flow 3: Creating Community Post
```
1. Navigate to Community Page
   ↓
2. Click "+ Create New Post" button
   ↓
3. Modal/Form Opens:
   - Title input
   - Content textarea
   - Upload image (optional)
   ↓
4. Fill form → Click "Post"
   ↓
5. Post appears in list
   ↓
6. Redirect to Post Detail page
```

---

## 🎨 Design Principles

1. **Responsive Design**: Works on Desktop, Tablet, Mobile
2. **Color Scheme**: Medical/Healthcare theme (Blues, Greens, Clean whites)
3. **Typography**: Clear, readable fonts
4. **Accessibility**: Proper contrast, keyboard navigation
5. **Loading States**: Spinners, skeletons for content
6. **Error Handling**: Toast notifications for errors
7. **Success Feedback**: Success messages

---

## 📱 Component Summary

| Page | Route | Access | Key Features |
|------|-------|--------|--------------|
| Home | `/` | Public | Hero, Features, Stats |
| Login | `/login` | Public | Email/Password form |
| Signup | `/signup` | Public | Registration form |
| Dashboard | `/dashboard` | Protected | User overview |
| Community | `/community` | Protected | Posts list, Create post |
| Post Detail | `/community/post/:id` | Protected | Full post + comments |
| News | `/news` | Public (read) | News articles list |
| News Detail | `/news/:id` | Public (read) | Full article |
| Chat | `/chat` | Protected | ChatGPT-style AI chat |
| Profile | `/profile/:id` | Protected | User profile |
| Admin | `/admin` | Admin only | Management panel |

---

## 🚀 Navigation Structure

```
HEADER NAVBAR (Always Visible):
├── Logo (link to Home)
├── Home
├── Community
├── News
├── Chat
├── Profile (if logged in)
└── Login/Signup OR Logout (if logged in)
```

**Footer** (Always Visible):
- About Us
- Contact
- Privacy Policy
- Terms of Service
- Social Media Links (optional)

---

This workflow provides a complete overview of how users will interact with the Thalassemia Care Hub website, with special focus on the ChatGPT-style chatbot interface.

