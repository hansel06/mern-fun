import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';

const app = express();

// CORS configuration - MUST be before other middleware
// Allow all origins for now (safe with authentication)
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  optionsSuccessStatus: 200
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection check middleware (skip for root route)
app.use((req, res, next) => {
  if (req.path === '/') {
    return next(); // Skip check for root route
  }
  
  if (mongoose.connection.readyState !== 1) {
    console.error('MongoDB not connected. State:', mongoose.connection.readyState);
    return res.status(503).json({
      success: false,
      message: 'Database connection unavailable. Please try again later.'
    });
  }
  next();
});

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Event Platform API is running',
    status: 'success'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl 
  });
});

// Global error handler (must be 4 parameters)
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err);
  console.error('Error name:', err.name);
  console.error('Error message:', err.message);
  
  // Handle Multer errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10MB.'
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload error'
    });
  }
  
  // Handle other errors
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      error: err.toString()
    })
  });
});

export default app;

