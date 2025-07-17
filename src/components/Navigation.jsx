import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = ({ user, onLogout }) => {
  const location = useLocation();

  // Check if user is admin
  const isAdmin = user?.email === 'admin@company.com';

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getUserInitials = (email) => {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  };

  return (
    <nav className="nav">
      <div className="nav-brand">
        Employee Dashboard
      </div>

      <div className="nav-links">
        <Link 
          to="/" 
          className={`nav-link ${isActive('/') ? 'active' : ''}`}
        >
          {isAdmin ? 'Admin Dashboard' : 'Dashboard'}
        </Link>
        {isAdmin ? (
          <>
            <Link 
              to="/data" 
              className={`nav-link ${isActive('/data') ? 'active' : ''}`}
            >
              Data
            </Link>
            <Link 
              to="/backup" 
              className={`nav-link ${isActive('/backup') ? 'active' : ''}`}
            >
              Backup
            </Link>
            <Link 
              to="/events" 
              className={`nav-link ${isActive('/events') ? 'active' : ''}`}
            >
              Events
            </Link>
            <Link 
              to="/tasks" 
              className={`nav-link ${isActive('/tasks') ? 'active' : ''}`}
            >
              Task Management
            </Link>
          </>
        ) : (
          <>
            <Link 
              to="/profile" 
              className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
            >
              Profile
            </Link>
            <Link 
              to="/tasks" 
              className={`nav-link ${isActive('/tasks') ? 'active' : ''}`}
            >
              Tasks
            </Link>
            <Link 
              to="/activity" 
              className={`nav-link ${isActive('/activity') ? 'active' : ''}`}
            >
              Activity
            </Link>
            <Link 
              to="/personal-potential" 
              className={`nav-link ${isActive('/personal-potential') ? 'active' : ''}`}
            >
              Personal Potential
            </Link>
          </>
        )}
      </div>

      <div className="nav-user">
        <div className="user-avatar">
          {getUserInitials(user?.email)}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span style={{ color: '#64748b', fontWeight: 500, fontSize: '0.875rem' }}>
            {user?.email || 'User'}
          </span>
          {isAdmin && (
            <span style={{ 
              color: '#dc2626', 
              fontWeight: 600, 
              fontSize: '0.75rem',
              background: '#fee2e2',
              padding: '0.125rem 0.5rem',
              borderRadius: '0.25rem'
            }}>
              ADMIN
            </span>
          )}
        </div>
        <button onClick={onLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navigation; 