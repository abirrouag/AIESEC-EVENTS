// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import route modules
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const feedbackRoutes = require('./routes/feedbacks');

const app = express();

// Middlewares
// 1. Enable CORS (Cross-Origin Resource Sharing)
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like Postman, curl, server-to-server)
      if (!origin) return callback(null, true);
      
      const configuredClient = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, '') : null;
      const localOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'];

      // Allow local dev, configured client URL, and Vercel deployments
      if (!configuredClient || configuredClient === '*' || origin === configuredClient || localOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true
  })
);

// 2. Parse incoming JSON request bodies
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'AIESEC Hub API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/feedbacks', feedbackRoutes);

// Global 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aiesec-hub';

// Start server listening
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Connect to MongoDB database
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch((err) => {
    console.warn('MongoDB connection warning:', err.message);
  });

module.exports = { app, server };
