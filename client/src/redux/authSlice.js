import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

// Retrieve initial user and token from localStorage if present
const token = localStorage.getItem('token') || null;
const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

// Async Thunk: Member Login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      // Persist session to localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed. Please check credentials.');
    }
  }
);

// Async Thunk: Member Registration
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', userData);
      // Persist session to localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed. Try again.');
    }
  }
);

// Auth Slice managing user authentication state
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: user,
    token: token,
    loading: false,
    error: null
  },
  reducers: {
    // Logout action to clear state and localStorage
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.user = null;
      state.token = null;
      state.error = null;
    },
    // Clear any authentication error message
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login handling
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register handling
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;

