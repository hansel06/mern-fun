import mongoose from 'mongoose';

/**
 * Connect to MongoDB using Mongoose
 * Uses connection string from environment variables
 */
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('ERROR: MONGODB_URI environment variable is not set!');
      console.error('Please set MONGODB_URI in your environment variables.');
      process.exit(1);
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Server will continue running but database operations will fail.');
    // Don't exit - let server start but log the error
    // In production, you might want to exit: process.exit(1);
  }
};

export default connectDB;

