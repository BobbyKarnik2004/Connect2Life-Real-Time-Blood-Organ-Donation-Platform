import express, { Application, Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { connectDB } from './db.js';
import { errorHandler } from './utils/ApiError.js';
import authRoutes from './routes/auth.routes.js';
import { corsMiddleware } from './middleware/cors.js';
import dotenv from 'dotenv';
import path from 'path';
import session from 'express-session';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const app: Application = express();

// 1) GLOBAL MIDDLEWARES

// Enable CORS with custom middleware
app.use(corsMiddleware);

// Test route
app.get('/api/test', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Trust first proxy
app.set('trust proxy', 1);

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Cookie parser
app.use(cookieParser(process.env.SESSION_SECRET));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// 2) ROUTES
app.use('/api/auth', authRoutes);

// 3) HEALTH CHECK
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 4) HANDLE UNHANDLED ROUTES
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// 5) GLOBAL ERROR HANDLER
app.use(errorHandler);

// 6) START SERVER
const port = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server running on port ${port}...`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startServer();
}

export default app;
