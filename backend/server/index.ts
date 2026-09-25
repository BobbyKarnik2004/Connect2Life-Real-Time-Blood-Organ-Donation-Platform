import express, { Request, Response, NextFunction, Express } from "express";
import http from 'http';
import { storage } from "./mongodb-storage";
import { setupVite, serveStatic, log } from "./vite";
import { connectDB } from "./db";
import 'dotenv/config';
import { registerRoutes } from "./routes";
import corsMiddleware from './middleware/cors';

const app = express();
const server = http.createServer(app);

app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logging middleware5
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  res.status(status).json({ 
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Initialize server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('✅ MongoDB connected successfully');
    
    // Register API routes
    await registerRoutes(app as unknown as Express);

    // Setup Vite in development or serve static files in production
    if (app.get("env") === "development") {
      await setupVite(app as unknown as Express, server);
    } else {
      serveStatic(app as unknown as Express);
    }

    // Start the server
    const port = parseInt(process.env.PORT || '5000', 10);
    server.listen(port, "0.0.0.0", () => {
      log(`🚀 Server running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

// Start the application
startServer();
