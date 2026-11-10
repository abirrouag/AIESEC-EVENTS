import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Main Application component managing global user authentication state and page navigation
function App() {
  // State for logged-in user: initialized from localStorage if available
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Current page state: 'home' | 'login' | 'register'
  const [currentPage, setCurrentPage] = useState('home');

  // Handle successful login or registration
  const handleAuthSuccess = (userData, token) => {
    setUser(userData);
    setCurrentPage('home');
  };

  // Handle logout: clear localStorage and reset user state
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentPage('home');
  };

  return (
    <div>
      {/* Top navigation bar */}
      <Navbar
        user={user}
        onLogout={handleLogout}
        onNavigate={setCurrentPage}
        currentPage={currentPage}
      />

      {/* Main content container */}
      <main className="container">
        {currentPage === 'home' && (
          <Home
            currentUser={user}
            onNavigate={setCurrentPage}
          />
        )}

        {currentPage === 'login' && (
          <Login
            onLoginSuccess={handleAuthSuccess}
            onNavigate={setCurrentPage}
          />
        )}

        {currentPage === 'register' && (
          <Register
            onRegisterSuccess={handleAuthSuccess}
            onNavigate={setCurrentPage}
          />
        )}
      </main>
    </div>
  );
}

export default App;

