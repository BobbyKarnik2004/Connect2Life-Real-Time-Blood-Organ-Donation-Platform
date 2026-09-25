import mongoose from 'mongoose';
import config from '../config.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface CachedMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  lastConnectionAttempt: number;
  retryCount: number;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: CachedMongoose | undefined;
}

// Get MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI || config.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MongoDB connection string is not defined in the configuration');
  console.log('Current config:', {
    MONGODB_URI: MONGODB_URI,
    NODE_ENV: process.env.NODE_ENV || 'development'
  });
  throw new Error('MongoDB connection string is not defined in the configuration');
}
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds

// Enable debug mode in development
const NODE_ENV = process.env.NODE_ENV || config.NODE_ENV || 'development';
if (NODE_ENV === 'development') {
  mongoose.set('debug', true);
  console.log('🔍 MongoDB debug mode enabled');
}

// Connection events
mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected successfully');});

mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB connection error:', error.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('ℹ️  MongoDB disconnected');
});

// Close the Mongoose connection when the Node process ends
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    process.exit(1);
  }
});

const globalWithMongoose = global as typeof globalThis & {
  mongoose: CachedMongoose;
};

// Initialize or get the cached connection
let cached = globalWithMongoose.mongoose;

if (!cached) {
  cached = globalWithMongoose.mongoose = { 
    conn: null, 
    promise: null,
    lastConnectionAttempt: 0,
    retryCount: 0
  };
}

/**
 * Attempt to connect to MongoDB with retry logic
 */
async function connectWithRetry(attempt = 1): Promise<typeof mongoose> {
  try {
    const connection = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority',
    });
    
    // Reset retry count on successful connection
    if (cached) {
      cached.retryCount = 0;
    }
    
    return connection;
  } catch (error: any) {
    console.error(`❌ MongoDB connection attempt ${attempt} failed:`, error.message);
    
    // Check if we should retry
    if (attempt >= MAX_RETRIES) {
      console.error('❌ Max retries reached. Could not connect to MongoDB');
      throw new Error(`Failed to connect to MongoDB after ${MAX_RETRIES} attempts: ${error.message}`);
    }
    
    // Exponential backoff
    const delay = Math.min(RETRY_DELAY * Math.pow(2, attempt - 1), 30000);
    console.log(`⏳ Retrying connection in ${delay}ms... (${attempt}/${MAX_RETRIES})`);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return connectWithRetry(attempt + 1);
  }
}

/**
 * Connect to MongoDB with connection pooling and caching
 */
async function connectDB(): Promise<typeof mongoose> {
  console.log('🔌 Connecting to MongoDB...');
  
  // Return existing connection if available
  if (cached.conn) {
    console.log('ℹ️  Using existing database connection');
    return cached.conn;
  }
  
  // Prevent multiple connection attempts within the retry delay
  const now = Date.now();
  if (cached.promise && (now - cached.lastConnectionAttempt) < RETRY_DELAY) {
    console.log('ℹ️  Using existing connection promise');
    return cached.promise;
  }
  
  // Create a new connection promise
  cached.lastConnectionAttempt = now;
  
  try {
    const conn = await connectWithRetry(1);
    cached.conn = conn;
    cached.promise = null; // Clear the promise since we have a connection
    return conn;
  } catch (error) {
    // Reset the promise on error to allow retries
    cached.promise = null;
    throw error;
  }
}

export { mongoose, connectDB };