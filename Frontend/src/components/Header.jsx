import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FaUser, FaSignOutAlt, FaRobot } from 'react-icons/fa'

const Header = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <Navbar bg="white" expand="lg" className="shadow-sm py-2" sticky="top">
            <Container>
                {/* Logo and Brand - Always links to home */}
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
                    {/* Blood Drop Icon */}
                    <img src="/blood.svg" alt="Thalassemia Care Hub Logo" width="35" height="35" className="me-2" />
                    {/* Brand Text */}
                    <div className="d-flex flex-column" style={{ lineHeight: '1.1' }}>
                        <span style={{
                            fontSize: '18px',
                            fontWeight: '700',
                            color: '#0EA5E9',
                            letterSpacing: '-0.3px'
                        }}>
                            Thalassemia
                        </span>
                        <span style={{
                            fontSize: '18px',
                            fontWeight: '700',
                            color: '#1F2937',
                            letterSpacing: '-0.3px'
                        }}>
                            Care Hub
                        </span>
                    </div>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center gap-3">
                        {!user ? (
                            // Navigation for non-logged-in users
                            <>
                                <Nav.Link
                                    as={Link}
                                    to="/"
                                    className={`fw-semibold nav-link-hover ${location.pathname === '/' ? 'active' : ''}`}
                                    style={{ color: location.pathname === '/' ? '#0EA5E9' : '#1F2937' }}
                                >
                                    Home
                                </Nav.Link>
                                <Nav.Link
                                    as={Link}
                                    to="/about"
                                    className={`fw-semibold nav-link-hover ${location.pathname === '/about' ? 'active' : ''}`}
                                    style={{ color: location.pathname === '/about' ? '#0EA5E9' : '#1F2937' }}
                                >
                                    About
                                </Nav.Link>
                                <Nav.Link
                                    as={Link}
                                    to="/resources"
                                    className={`fw-semibold nav-link-hover ${location.pathname === '/resources' ? 'active' : ''}`}
                                    style={{ color: location.pathname === '/resources' ? '#0EA5E9' : '#1F2937' }}
                                >
                                    Resources
                                </Nav.Link>
                                <Nav.Link
                                    as={Link}
                                    to="/news"
                                    className={`fw-semibold nav-link-hover ${location.pathname === '/news' ? 'active' : ''}`}
                                    style={{ color: location.pathname === '/news' ? '#0EA5E9' : '#1F2937' }}
                                >
                                    News
                                </Nav.Link>
                                <Button
                                    as={Link}
                                    to="/login"
                                    className="logout-btn"
                                    style={{
                                        backgroundColor: '#F87171',
                                        borderColor: '#F87171',
                                        borderRadius: '25px',
                                        padding: '8px 24px',
                                        fontWeight: '600',
                                        color: 'white',
                                        textDecoration: 'none',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    Login
                                </Button>
                            </>
                        ) : (
                            // Navigation for logged-in users
                            <>
                                <Nav.Link
                                    as={Link}
                                    to="/dashboard"
                                    className={`fw-semibold nav-link-hover ${location.pathname === '/dashboard' ? 'active' : ''}`}
                                    style={{ color: location.pathname === '/dashboard' ? '#0EA5E9' : '#1F2937' }}
                                >
                                    Dashboard
                                </Nav.Link>
                                <Nav.Link
                                    as={Link}
                                    to="/community"
                                    className={`fw-semibold nav-link-hover ${location.pathname === '/community' ? 'active' : ''}`}
                                    style={{ color: location.pathname === '/community' ? '#0EA5E9' : '#1F2937' }}
                                >
                                    Community
                                </Nav.Link>
                                <Nav.Link
                                    as={Link}
                                    to="/resources"
                                    className={`fw-semibold nav-link-hover ${location.pathname === '/resources' ? 'active' : ''}`}
                                    style={{ color: location.pathname === '/resources' ? '#0EA5E9' : '#1F2937' }}
                                >
                                    Resources
                                </Nav.Link>
                                <Nav.Link
                                    as={Link}
                                    to="/news"
                                    className={`fw-semibold nav-link-hover ${location.pathname === '/news' ? 'active' : ''}`}
                                    style={{ color: location.pathname === '/news' ? '#0EA5E9' : '#1F2937' }}
                                >
                                    News
                                </Nav.Link>
                                <Nav.Link
                                    as={Link}
                                    to="/chat"
                                    className={`fw-semibold nav-link-hover ${location.pathname === '/chat' ? 'active' : ''}`}
                                    style={{ color: location.pathname === '/chat' ? '#0EA5E9' : '#1F2937' }}
                                >
                                    AI Chatbot
                                </Nav.Link>

                                <NavDropdown
                                    title={
                                        <span className="fw-semibold" style={{ color: '#1F2937' }}>
                                            <FaUser className="me-1" />
                                            {user.firstName} {user.lastName}
                                        </span>
                                    }
                                    id="user-dropdown"
                                    align="end"
                                    className="user-profile-dropdown"
                                >
                                    <NavDropdown.Item as={Link} to={`/profile/${user.userId}`}>
                                        My Profile
                                    </NavDropdown.Item>
                                    {user?.role?.toLowerCase() === 'admin' && (
                                        <NavDropdown.Item as={Link} to="/admin">
                                            Admin Dashboard
                                        </NavDropdown.Item>
                                    )}
                                </NavDropdown>

                                <Button
                                    variant="danger"
                                    onClick={handleLogout}
                                    className="ms-2 d-none d-lg-block logout-btn"
                                    style={{
                                        backgroundColor: '#F87171',
                                        borderColor: '#F87171',
                                        borderRadius: '25px',
                                        padding: '8px 24px',
                                        fontWeight: '600',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    Logout
                                </Button>

                                {/* Mobile Logout Button */}
                                <Button
                                    variant="outline-danger"
                                    onClick={handleLogout}
                                    className="d-lg-none mt-2 px-4"
                                    style={{
                                        borderRadius: '25px',
                                        fontWeight: '600'
                                    }}
                                >
                                    <FaSignOutAlt className="me-2" />
                                    Logout
                                </Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>

            <style>{`
                .navbar {
                    z-index: 1100 !important;
                }

                .nav-link-hover {
                    position: relative;
                    transition: color 0.3s ease;
                }
                
                .nav-link-hover:hover {
                    color: #0EA5E9 !important;
                }
                
                .nav-link-hover::after {
                    content: '';
                    position: absolute;
                    width: 0;
                    height: 2px;
                    bottom: -5px;
                    left: 50%;
                    background-color: #0EA5E9;
                    transition: all 0.3s ease;
                    transform: translateX(-50%);
                }
                
                .nav-link-hover:hover::after,
                .nav-link-hover.active::after {
                    width: 100%;
                }
                
                .logout-btn:hover {
                    background-color: #EF4444 !important;
                    border-color: #EF4444 !important;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
                }

                /* Custom User Dropdown Styles - Enforced */
                .user-profile-dropdown .dropdown-menu {
                    background-color: #ffffff !important;
                    border: 1px solid #e5e7eb !important;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.15) !important;
                    border-radius: 12px !important;
                    padding: 8px !important;
                    min-width: 220px !important;
                    z-index: 10000 !important;
                    margin-top: 10px !important;
                    display: none; /* Let Bootstrap handle display */
                }

                .user-profile-dropdown .dropdown-menu.show {
                    display: block !important;
                }

                .user-profile-dropdown .dropdown-item {
                    border-radius: 8px !important;
                    padding: 10px 15px !important;
                    font-weight: 500 !important;
                    color: #374151 !important;
                    margin-bottom: 2px !important;
                    transition: all 0.2s ease !important;
                }

                .user-profile-dropdown .dropdown-item:hover {
                    background-color: #F3F4F6 !important;
                    color: #0EA5E9 !important;
                }
            `}</style>
        </Navbar>
    )
}

export default Header
