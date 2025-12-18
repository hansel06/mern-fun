import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import app from './src/app.js';

// Load environment variables from .env file
dotenv.config();

// Verify Cloudinary env vars are loaded (for debugging)
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.warn('Warning: Cloudinary environment variables not found. Image uploads will fail.');
} else {
  console.log('Cloudinary configuration loaded successfully');
}

// Get port from environment variables or use default
const PORT = process.env.PORT || 5000;

// Connect to MongoDB (non-blocking)
connectDB().catch((error) => {
  console.error('Failed to connect to MongoDB:', error);
  // Server will still start, but DB operations will fail
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Server URL: http://localhost:${PORT}`);
});

