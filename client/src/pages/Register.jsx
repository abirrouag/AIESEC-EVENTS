import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../redux/authSlice';

// Register page: creates a new member account via Redux Toolkit thunk
function Register({ onRegisterSuccess, onNavigate }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    setLocalError('');
    dispatch(clearError());

    // Dispatch Redux thunk
    const resultAction = await dispatch(registerUser({ name, email, password }));

    if (registerUser.fulfilled.match(resultAction)) {
      onRegisterSuccess();
    }
  };

  const displayError = localError || error;

  return (
    <div className="auth-wrapper">
      <div className="card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join AIESEC Hub as a member</p>
        </div>

        {displayError && <div className="alert alert-error">{displayError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Sarah Benali"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="sarah@aiesec.net"
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
              placeholder="At least 6 characters"
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
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="auth-footer">
          Already registered?{' '}
          <button onClick={() => { dispatch(clearError()); onNavigate('login'); }}>
            Sign in here
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
