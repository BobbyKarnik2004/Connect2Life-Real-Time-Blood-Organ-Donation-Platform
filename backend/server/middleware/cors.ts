import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// In development, allow all origins for easier debugging
const isDevelopment = process.env.NODE_ENV !== 'production';

const allowedOrigins = isDevelopment 
  ? ['*'] // Allow all origins in development
  : [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5000',
      'https://lifematch.preview.emergentagent.com',
      process.env.FRONTEND_URL
    ].filter(Boolean) as string[];

export const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Allow requests from any origin in development
  if (isDevelopment) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Type, Authorization');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
      return res.status(200).end();
    }
    return next();
  }

  // Production CORS settings
  const origin = req.headers.origin;
  
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Type, Authorization');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
      return res.status(200).end();
    }
    return next();
  }
  
  // Origin not allowed
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
};

export default corsMiddleware;
