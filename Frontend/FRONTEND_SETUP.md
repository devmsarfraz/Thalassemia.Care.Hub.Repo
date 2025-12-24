# Frontend Setup Guide - Thalassemia Care Hub

## Project Structure

```
Frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Header.jsx       # Navigation header
│   │   ├── Footer.jsx       # Footer component
│   │   ├── ProtectedRoute.jsx # Route protection
│   │   ├── AdminRoute.jsx   # Admin route protection
│   │   └── ErrorBoundary.jsx # Error handling
│   ├── contexts/            # React contexts
│   │   └── AuthContext.jsx  # Authentication context
│   ├── pages/               # Page components
│   │   ├── Home.jsx         # Landing page
│   │   ├── Login.jsx        # Login page
│   │   ├── Signup.jsx       # Registration page
│   │   ├── VerifyEmail.jsx  # Email verification page
│   │   ├── Dashboard.jsx   # User dashboard
│   │   ├── Community.jsx    # Community posts
│   │   ├── News.jsx        # News page
│   │   ├── Chat.jsx        # AI Chatbot
│   │   ├── Profile.jsx     # User profile
│   │   └── AdminDashboard.jsx # Admin panel
│   ├── services/            # API services
│   │   └── api.js          # Axios API client
│   ├── config/             # Configuration
│   │   └── api.js          # API base URL config
│   ├── App.jsx             # Main app component
│   ├── App.css             # App styles
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── index.html              # HTML template
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
└── .env.example            # Environment variables example
```

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Update `VITE_API_BASE_URL` with your backend API URL
   ```env
   VITE_API_BASE_URL=http://localhost:5195/api
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Layout Structure

### Simple Layout Components

1. **Header** (`components/Header.jsx`)
   - Navigation bar with logo
   - Menu items (Home, Community, News, Chat)
   - User dropdown (Profile, Admin Dashboard, Logout)
   - Login/Signup buttons for unauthenticated users

2. **Footer** (`components/Footer.jsx`)
   - Company information
   - Quick links
   - Contact information
   - Copyright notice

3. **Main Content Area**
   - Flexbox layout with `min-vh-100`
   - Header at top
   - Main content in middle (flex-grow-1)
   - Footer at bottom

### Routing Structure

```
/                    → Home (Public)
/login               → Login (Public)
/signup              → Signup (Public)
/verify-email        → Email Verification (Public)
/news                → News (Public)
/dashboard           → Dashboard (Protected)
/community           → Community Posts (Protected)
/chat                → AI Chatbot (Protected)
/profile/:id         → User Profile (Protected)
/admin               → Admin Dashboard (Admin Only)
```

## Key Features

### 1. Authentication Flow
- **Signup** → User registers → Receives verification email
- **Verify Email** → User enters 6-digit code → Email verified
- **Login** → User logs in → Receives JWT token
- **Protected Routes** → Require authentication
- **Admin Routes** → Require Admin role

### 2. API Integration
- Centralized API configuration in `config/api.js`
- Axios interceptors for token management
- Automatic token refresh handling
- Error handling and redirects

### 3. State Management
- React Context API for authentication
- LocalStorage for token persistence
- Automatic token injection in API requests

## Styling

- **Bootstrap 5** for UI components
- **Custom CSS** in `index.css` and `App.css`
- **CSS Variables** for theming
- **Responsive Design** with Bootstrap grid

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5195/api
```

For production:
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

## API Configuration

The API base URL is configured in `src/config/api.js`:

```javascript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5195/api'
```

All API calls use this centralized configuration.

## Development Notes

- Uses **Vite** as build tool
- **React Router v6** for routing
- **Axios** for HTTP requests
- **React Bootstrap** for UI components
- **React Toastify** for notifications
- **React Icons** for icons

## Common Issues

1. **CORS Errors**: Ensure backend CORS is configured correctly
2. **API Connection**: Check `VITE_API_BASE_URL` in `.env`
3. **Token Expiry**: Tokens expire after 60 minutes, user needs to re-login
4. **Email Verification**: Check spam folder for verification codes

## Next Steps

1. Update `.env` file with correct API URL
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start development server
4. Test authentication flow
5. Test protected routes
6. Test email verification

