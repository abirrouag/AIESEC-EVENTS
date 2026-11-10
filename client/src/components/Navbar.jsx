import React from 'react';

// Navbar component: displays organization header and authentication controls
function Navbar({ user, onLogout, onNavigate, currentPage }) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand / Logo */}
        <div
          className="navbar-brand"
          onClick={() => onNavigate('home')}
          title="Go to Home"
        >
          <span>🌐</span> AIESEC Hub
        </div>

        {/* Navigation / User Controls */}
        <nav className="navbar-nav">
          <button
            className={`btn ${currentPage === 'home' ? 'btn-primary' : 'btn-outline'} btn-small`}
            onClick={() => onNavigate('home')}
          >
            Events
          </button>

          {user ? (
            // Shown when user is logged in
            <>
              <span className="navbar-user">
                Hi, <strong>{user.name}</strong>
              </span>
              <button
                className="btn btn-outline btn-small"
                onClick={onLogout}
              >
                Logout
              </button>
            </>
          ) : (
            // Shown when user is a visitor (not logged in)
            <>
              <button
                className={`btn ${currentPage === 'login' ? 'btn-primary' : 'btn-outline'} btn-small`}
                onClick={() => onNavigate('login')}
              >
                Login
              </button>
              <button
                className={`btn ${currentPage === 'register' ? 'btn-primary' : 'btn-outline'} btn-small`}
                onClick={() => onNavigate('register')}
              >
                Register
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;

