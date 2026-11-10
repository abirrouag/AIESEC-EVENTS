import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './redux/authSlice';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Main Application component managing page navigation and accessing Redux state
function App() {
  const dispatch = useDispatch();

  // Access user from Redux store
  const user = useSelector((state) => state.auth.user);

  // Current page state: 'home' | 'login' | 'register'
  const [currentPage, setCurrentPage] = useState('home');

  // Handle logout via Redux action
  const handleLogout = () => {
    dispatch(logout());
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
            onLoginSuccess={() => setCurrentPage('home')}
            onNavigate={setCurrentPage}
          />
        )}

        {currentPage === 'register' && (
          <Register
            onRegisterSuccess={() => setCurrentPage('home')}
            onNavigate={setCurrentPage}
          />
        )}
      </main>
    </div>
  );
}

export default App;
