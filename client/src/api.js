import axios from 'axios';

// 1. Create an Axios instance with base URL from environment or localhost
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

// 2. Request Interceptor: runs before every outgoing HTTP request
api.interceptors.request.use(
  (config) => {
    // Retrieve JWT token stored in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Attach the Bearer token to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

