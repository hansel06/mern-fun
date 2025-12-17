import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';

const app = express();

// Middleware
// CORS configuration - allow requests from frontend
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://hansel-event-platform.vercel.app',
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, curl, etc.)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS: Origin not allowed:', origin);
      callback(null, true); // Temporarily allow all for debugging
      // For production, use: callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

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

export default app;

