import mongoose from 'mongoose';

/**
 * Database Configuration
 * @todo Add connection retry logic
 * @todo Add connection pool configuration
 * @todo Add mongoose debug in development
 */

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/collegebuddy';
    
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4
    };

    await mongoose.connect(uri, options);
    console.log('✅ MongoDB Connected');
    
    // Log connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB Error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB Disconnected');
    });

  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

export default connectDB;