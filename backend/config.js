import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configure dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/connect2life',
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || 'dummy_client_id',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || 'dummy_client_secret',
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback'
};

// Validate required configuration
if (!config.MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

if (!config.JWT_SECRET || config.JWT_SECRET === 'your_jwt_secret_key_here') {
  console.warn('⚠️  Using default JWT_SECRET. This is not recommended for production.');
}

console.log('🔧 Loaded configuration:', {
  ...config,
  JWT_SECRET: config.JWT_SECRET ? '***' : 'Not set'
});

export default config;
