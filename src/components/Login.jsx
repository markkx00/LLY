import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent;
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful');
    } catch (error) {
      console.error('Login error:', error);
      
      switch (error.code) {
        case 'auth/invalid-email':
          setError('Invalid email address format.');
          break;
        case 'auth/user-disabled':
          setError('This account has been disabled.');
          break;
        case 'auth/user-not-found':
          setError('No account found with this email address.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password.');
          break;
        case 'auth/invalid-credential':
          setError('Invalid email or password. Please check your credentials.');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed login attempts. Please try again later.');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your internet connection.');
          break;
        default:
          setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (isMobile) {
    return (
      <div className="mobile-login-container">
        <div className="mobile-login-header">
          <div className="mobile-logo">
            <div className="logo-icon">👤</div>
            <h1 className="mobile-title">Employee Portal</h1>
          </div>
        </div>

        <div className="mobile-login-content">
          <div className="mobile-welcome">
            <h2>Welcome Back</h2>
            <p>Sign in to access your dashboard</p>
          </div>

          <form className="mobile-login-form" onSubmit={handleSubmit}>
            {error && (
              <div className="mobile-error-message">
                {error}
              </div>
            )}

            <div className="mobile-form-group">
              <label htmlFor="mobile-email" className="mobile-form-label">
                📧 Email Address
              </label>
              <input
                type="email"
                id="mobile-email"
                className="mobile-form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@company.com"
                required
              />
            </div>

            <div className="mobile-form-group">
              <label htmlFor="mobile-password" className="mobile-form-label">
                🔒 Password
              </label>
              <input
                type="password"
                id="mobile-password"
                className="mobile-form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="mobile-login-btn"
              disabled={loading}
            >
              {loading ? (
                <span>
                  <div className="mobile-spinner"></div>
                  Signing In...
                </span>
              ) : (
                'Sign In'
              )}
            </button>

          </form>
        </div>

        <div className="mobile-footer">
          <p>Secure Employee Access</p>
        </div>
      </div>
    );
  }

  return (
    <div className="desktop-login-container">
      <div className="desktop-login-left">
        <div className="desktop-branding">
          <div className="desktop-logo">
            <div className="desktop-logo-icon">🏢</div>
            <h1 className="desktop-brand-title">Employee Dashboard</h1>
          </div>
          <p className="desktop-tagline">
            Your comprehensive workplace management solution
          </p>
          
          <div className="desktop-features">
            <div className="feature-item">
              <div className="feature-icon">📊</div>
              <div>
                <h3>Performance Tracking</h3>
                <p>Monitor your progress and achievements</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📋</div>
              <div>
                <h3>Task Management</h3>
                <p>Organize and track your daily tasks</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">⏰</div>
              <div>
                <h3>Attendance Tracking</h3>
                <p>Easy check-in and time management</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="desktop-login-right">
        <div className="desktop-login-form-container">
          <div className="desktop-form-header">
            <h2 className="desktop-form-title">Welcome Back</h2>
            <p className="desktop-form-subtitle">Please sign in to your account</p>
          </div>

          <form className="desktop-login-form" onSubmit={handleSubmit}>
            {error && (
              <div className="desktop-error-message">
                <div className="error-icon">⚠️</div>
                <div>{error}</div>
              </div>
            )}

            <div className="desktop-form-group">
              <label htmlFor="desktop-email" className="desktop-form-label">
                Email Address
              </label>
              <div className="desktop-input-wrapper">
                <div className="input-icon">📧</div>
                <input
                  type="email"
                  id="desktop-email"
                  className="desktop-form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>

            <div className="desktop-form-group">
              <label htmlFor="desktop-password" className="desktop-form-label">
                Password
              </label>
              <div className="desktop-input-wrapper">
                <div className="input-icon">🔒</div>
                <input
                  type="password"
                  id="desktop-password"
                  className="desktop-form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="desktop-login-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="loading-content">
                  <div className="desktop-spinner"></div>
                  Signing In...
                </span>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
