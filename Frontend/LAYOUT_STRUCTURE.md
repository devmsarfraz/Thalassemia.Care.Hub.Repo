# Frontend Layout Structure

## Simple Layout Overview

The frontend uses a simple, clean layout structure with three main sections:

```
┌─────────────────────────────────────┐
│           HEADER                    │
│  (Navigation, Logo, User Menu)      │
├─────────────────────────────────────┤
│                                     │
│         MAIN CONTENT                │
│  (Pages: Home, Dashboard, etc.)     │
│                                     │
├─────────────────────────────────────┤
│           FOOTER                    │
│  (Links, Contact, Copyright)        │
└─────────────────────────────────────┘
```

## Layout Components

### 1. Header Component
**Location**: `src/components/Header.jsx`

**Features**:
- Responsive navigation bar
- Logo/Brand name
- Navigation links (Home, Community, News, Chat)
- User dropdown menu (when authenticated)
- Login/Signup buttons (when not authenticated)
- Admin Dashboard link (for Admin users)

**Structure**:
```jsx
<Navbar>
  <Brand>Thalassemia Care Hub</Brand>
  <Nav>
    <Link to="/">Home</Link>
    <Link to="/community">Community</Link>
    <Link to="/news">News</Link>
    <Link to="/chat">Chat</Link>
  </Nav>
  <UserMenu>
    <Profile />
    <AdminDashboard />
    <Logout />
  </UserMenu>
</Navbar>
```

### 2. Main Content Area
**Location**: `src/App.jsx` (main element)

**Features**:
- Flexbox layout with `flex-grow-1`
- Contains all page components
- Responsive padding
- Error boundary wrapper

**Structure**:
```jsx
<main className="flex-grow-1 main-content">
  <ErrorBoundary>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      {/* ... other routes */}
    </Routes>
  </ErrorBoundary>
</main>
```

### 3. Footer Component
**Location**: `src/components/Footer.jsx`

**Features**:
- Company information
- Quick links section
- Contact information
- Copyright notice
- Responsive grid layout

**Structure**:
```jsx
<Footer>
  <Container>
    <Row>
      <Col>Company Info</Col>
      <Col>Quick Links</Col>
      <Col>Contact</Col>
    </Row>
    <Row>Copyright</Row>
  </Container>
</Footer>
```

## Page Layouts

### Public Pages
- **Home**: Hero section + Features + CTA
- **Login**: Centered card form
- **Signup**: Centered card form
- **Verify Email**: Centered card with code input
- **News**: List/grid of news posts

### Protected Pages
- **Dashboard**: User dashboard with stats/cards
- **Community**: Posts list with create post button
- **Chat**: Chat interface with message history
- **Profile**: User profile form

### Admin Pages
- **Admin Dashboard**: Admin panel with user management

## CSS Structure

### Global Styles (`index.css`)
- CSS variables for theming
- Base styles (body, root)
- Utility classes
- Chat-specific styles
- Scrollbar customization

### App Styles (`App.css`)
- App container styles
- Loading spinner
- Error/success messages
- Component-specific styles

### Bootstrap Integration
- Bootstrap 5 CSS imported in `main.jsx`
- React Bootstrap components used throughout
- Custom overrides in `index.css`

## Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 992px
- **Desktop**: > 992px

### Responsive Features
- Mobile-friendly navigation (hamburger menu)
- Responsive grid layouts
- Flexible card components
- Touch-friendly buttons

## Color Scheme

```css
--primary-color: #0d6efd (Blue)
--secondary-color: #6c757d (Gray)
--success-color: #198754 (Green)
--danger-color: #dc3545 (Red)
--warning-color: #ffc107 (Yellow)
--info-color: #0dcaf0 (Cyan)
--light-color: #f8f9fa (Light Gray)
--dark-color: #212529 (Dark Gray)
```

## Layout Flow

1. **App.jsx** wraps everything in:
   - ErrorBoundary
   - AuthProvider
   - Router
   - ToastContainer

2. **Main Layout**:
   - Header (always visible)
   - Main content (flex-grow-1)
   - Footer (always visible)

3. **Page Components**:
   - Each page is self-contained
   - Uses Bootstrap Container for width control
   - Responsive padding and margins

## Key Design Principles

1. **Simplicity**: Clean, minimal design
2. **Consistency**: Same layout structure across pages
3. **Responsiveness**: Works on all screen sizes
4. **Accessibility**: Semantic HTML, proper ARIA labels
5. **User Experience**: Clear navigation, intuitive flow

## Component Hierarchy

```
App
├── ErrorBoundary
│   └── AuthProvider
│       └── Router
│           ├── Header (always visible)
│           ├── Main Content (routes)
│           │   ├── Home
│           │   ├── Login
│           │   ├── Signup
│           │   ├── VerifyEmail
│           │   ├── Dashboard
│           │   ├── Community
│           │   ├── News
│           │   ├── Chat
│           │   ├── Profile
│           │   └── AdminDashboard
│           └── Footer (always visible)
└── ToastContainer
```

This simple layout structure ensures:
- Easy navigation
- Consistent user experience
- Maintainable code
- Scalable design

