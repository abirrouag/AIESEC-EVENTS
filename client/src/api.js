import axios from 'axios';

// Determine and sanitize API base URL
let rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// If user accidentally pasted placeholder text containing a URL, extract the actual URL
if (rawBaseUrl && !rawBaseUrl.startsWith('http://') && !rawBaseUrl.startsWith('https://')) {
  const match = rawBaseUrl.match(/https?:\/\/[^\s\)]+/);
  if (match) {
    rawBaseUrl = match[0];
  }
}

// Remove any trailing slashes
const baseURL = rawBaseUrl.replace(/\/+$/, '');

// 1. Create an Axios instance with sanitized base URL
const api = axios.create({
  baseURL: baseURL
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

