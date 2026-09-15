import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Bell, User as UserIcon, LogOut, ChevronDown, Menu, X } from 'lucide-react';
import { api } from '../services/api.js';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      api.get('/notifications')
        .then((res) => {
          if (res.success) setUnreadNotifications(res.unreadCount || 0);
        })
        .catch(() => {});
    }
  }, [isAuthenticated, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'STUDENT') return '/student/dashboard';
    if (user.role === 'RECRUITER') return '/recruiter/dashboard';
    if (user.role === 'ADMIN' || user.role === 'COLLEGE_ADMIN') return '/admin/dashboard';
    return '/';
  };

  return (
    <header style={styles.header}>
      <div className="container" style={styles.navContainer}>
        {/* Brand Logo */}
        <Link to="/" style={styles.logoLink}>
          <div style={styles.logoIcon}>
            <span style={styles.logoGlyph}>P</span>
          </div>
          <div>
            <span style={styles.brandTitle}>PLACERA</span>
            <span style={styles.brandSubtitle}>Smart Placement. Better Opportunities.</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={styles.desktopNav}>
          <Link to="/" style={styles.navLink}>Home</Link>
          <Link to="/opportunities" style={styles.navLink}>Opportunities</Link>
          <Link to="/how-it-works" style={styles.navLink}>How It Works</Link>
          <Link to="/register/recruiter" style={styles.navLink}>For Recruiters</Link>
          <Link to="/register/college" style={styles.navLink}>For Colleges</Link>
          <Link to="/about" style={styles.navLink}>About</Link>
        </nav>

        {/* User CTAs / Account controls */}
        <div style={styles.authArea}>
          {isAuthenticated ? (
            <div style={styles.loggedInRow}>
              {/* Notifications */}
              <Link to={user?.role === 'STUDENT' ? '/student/notifications' : getDashboardPath()} style={styles.notifBtn} title="Notifications">
                <Bell size={20} color="#3B4953" />
                {unreadNotifications > 0 && (
                  <span style={styles.notifBadge}>{unreadNotifications}</span>
                )}
              </Link>

              {/* Portal Dashboard Button */}
              <Link to={getDashboardPath()} className="btn btn-primary btn-sm">
                Dashboard
              </Link>

              {/* User Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  style={styles.userMenuTrigger}
                >
                  <div style={styles.avatarCircle}>
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <span style={styles.userRoleBadge}>{user.role}</span>
                  <ChevronDown size={14} />
                </button>

                {userDropdownOpen && (
                  <div style={styles.dropdownMenu} onClick={() => setUserDropdownOpen(false)}>
                    <div style={styles.dropdownHeader}>
                      <p style={{ fontWeight: '600', fontSize: '0.85rem' }}>{user.email}</p>
                      <span className="badge badge-sage">{user.role}</span>
                    </div>
                    <Link to={getDashboardPath()} style={styles.dropdownItem}>
                      <UserIcon size={16} /> Portal Dashboard
                    </Link>
                    <button onClick={handleLogout} style={styles.dropdownLogout}>
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={styles.guestRow}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Login
              </Link>
              <Link to="/register/student" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={styles.mobileHamburger}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div style={styles.mobileDrawer} onClick={() => setMobileMenuOpen(false)}>
          <Link to="/" style={styles.mobileNavLink}>Home</Link>
          <Link to="/how-it-works" style={styles.mobileNavLink}>How It Works</Link>
          <Link to="/opportunities" style={styles.mobileNavLink}>For Students</Link>
          <Link to="/register/recruiter" style={styles.mobileNavLink}>For Recruiters</Link>
          <Link to="/about" style={styles.mobileNavLink}>About</Link>
          <div style={{ padding: '16px 0', borderTop: '1px solid #D6E4C6' }}>
            {isAuthenticated ? (
              <Link to={getDashboardPath()} className="btn btn-primary" style={{ width: '100%' }}>
                Go to Dashboard
              </Link>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link to="/login" className="btn btn-outline" style={{ width: '100%' }}>Login</Link>
                <Link to="/register/student" className="btn btn-primary" style={{ width: '100%' }}>Get Started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #D6E4C6',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  navContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '70px',
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textDecoration: 'none',
  },
  logoIcon: {
    width: '38px',
    height: '38px',
    borderRadius: '8px',
    backgroundColor: '#5A7863',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoGlyph: {
    color: '#EBF4DD',
    fontWeight: '800',
    fontSize: '1rem',
    letterSpacing: '1px',
  },
  brandTitle: {
    display: 'block',
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '1.45rem',
    letterSpacing: '0.04em',
    color: '#3B4953',
    lineHeight: 1,
  },
  brandSubtitle: {
    display: 'block',
    fontSize: '0.68rem',
    color: '#718290',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: '600',
  },
  desktopNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '28px',
  },
  navLink: {
    fontSize: '0.92rem',
    fontWeight: '500',
    color: '#4A5B67',
    transition: 'color 0.2s ease',
  },
  authArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  loggedInRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  guestRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  notifBtn: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#F6FAEE',
    border: '1px solid #D6E4C6',
  },
  notifBadge: {
    position: 'absolute',
    top: '-2px',
    right: '-2px',
    backgroundColor: '#DC2626',
    color: '#fff',
    fontSize: '0.7rem',
    fontWeight: '700',
    borderRadius: '10px',
    padding: '1px 5px',
  },
  userMenuTrigger: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'none',
    border: '1px solid #D6E4C6',
    padding: '4px 10px',
    borderRadius: '20px',
    cursor: 'pointer',
    backgroundColor: '#F6FAEE',
  },
  avatarCircle: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    backgroundColor: '#5A7863',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
    fontWeight: '700',
  },
  userRoleBadge: {
    fontSize: '0.74rem',
    fontWeight: '600',
    color: '#5A7863',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '44px',
    right: 0,
    backgroundColor: '#fff',
    border: '1px solid #D6E4C6',
    borderRadius: '10px',
    boxShadow: '0 8px 24px rgba(59,73,83,0.12)',
    width: '220px',
    padding: '8px 0',
    zIndex: 100,
  },
  dropdownHeader: {
    padding: '10px 16px',
    borderBottom: '1px solid #EBF4DD',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    fontSize: '0.88rem',
    color: '#3B4953',
    textDecoration: 'none',
  },
  dropdownLogout: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    fontSize: '0.88rem',
    color: '#DC2626',
    background: 'none',
    border: 'none',
    borderTop: '1px solid #EBF4DD',
    cursor: 'pointer',
    textAlign: 'left',
  },
  mobileHamburger: {
    display: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#3B4953',
  },
  mobileDrawer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderBottom: '1px solid #D6E4C6',
    padding: '16px',
    gap: '12px',
  },
  mobileNavLink: {
    padding: '8px 0',
    color: '#3B4953',
    fontWeight: '500',
  },
};

export default Navbar;
