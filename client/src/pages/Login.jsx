import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../redux/authSlice';

// Login page: authenticates existing members via Redux Toolkit thunk
function Login({ onLoginSuccess, onNavigate }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setLocalError('Please fill in both email and password');
      return;
    }

    setLocalError('');
    dispatch(clearError());

    // Dispatch Redux thunk
    const resultAction = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(resultAction)) {
      onLoginSuccess();
    }
  };

  const displayError = localError || error;

  return (
    <div className="auth-wrapper">
      <div className="card">
        <div className="auth-header">
          <h2>Member Login</h2>
          <p>Access your AIESEC Hub member account</p>
        </div>

        {displayError && <div className="alert alert-error">{displayError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="member@aiesec.net"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account yet?{' '}
          <button onClick={() => { dispatch(clearError()); onNavigate('register'); }}>
            Register here
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
