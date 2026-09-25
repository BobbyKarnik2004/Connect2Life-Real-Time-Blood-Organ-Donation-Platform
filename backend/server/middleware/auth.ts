import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import config from '../../config.js';

// For HTTP status codes
const httpStatus = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const;

// Extend Express types
declare global {
  namespace Express {
    interface User {
      _id: Types.ObjectId;
      email: string;
      role: string;
      [key: string]: any;
    }

    interface Request {
      user?: User;
    }
  }
}

export interface AuthRequest extends Request {
  user: Express.User;
}

interface JwtPayload {
  id: string;
  email: string;
  iat?: number;
  role?: string;
}

/**
 * Authentication middleware to protect routes
 * Verifies JWT token and attaches user to request object
 */
export const auth = (async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // 1) Get token from header, cookies, or query params
    let token;
    const authHeader = req.headers.authorization;
    
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    } else if (req.query.token && typeof req.query.token === 'string') {
      token = req.query.token;
    } else if (req.headers['x-access-token']) {
      token = req.headers['x-access-token'] as string;
    }

    if (!token) {
      return next(
        new ApiError(
          httpStatus.UNAUTHORIZED,
          'Authentication required. Please log in to access this resource.'
        )
      );
    }

    // 2) Verify token
    if (!config.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    let decoded: JwtPayload & { id: string };
    try {
      decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload & { id: string };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return next(
          new ApiError(
            httpStatus.UNAUTHORIZED,
            'Your session has expired. Please log in again.'
          )
        );
      } else if (error instanceof jwt.JsonWebTokenError) {
        return next(
          new ApiError(
            httpStatus.UNAUTHORIZED,
            'Invalid token. Please log in again.'
          )
        );
      }
      throw error;
    }

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    
    if (!currentUser) {
      return next(
        new ApiError(
          httpStatus.UNAUTHORIZED,
          'The user belonging to this token does not exist.'
        )
      );
    }

    // 4) Check if user changed password after the token was issued (if iat exists)
    if (decoded.iat && 'changedPasswordAfter' in currentUser) {
      const userDoc = currentUser as any; // Type assertion to access the method
      if (userDoc.changedPasswordAfter(decoded.iat)) {
        return next(
          new ApiError(
            httpStatus.UNAUTHORIZED,
            'User recently changed password! Please log in again.'
          )
        );
      }
    }

    // 5) Grant access to protected route
    req.user = currentUser;
    res.locals.user = currentUser;
    
    next();
  } catch (err) {
    // Handle JWT errors
    if (err instanceof jwt.JsonWebTokenError) {
      return next(
        new ApiError(
          httpStatus.UNAUTHORIZED,
          'Invalid token. Please log in again.'
        )
      );
    }
    if (err instanceof jwt.TokenExpiredError) {
      return next(
        new ApiError(
          httpStatus.UNAUTHORIZED,
          'Your token has expired! Please log in again.'
        )
      );
    }
    
    // Pass other errors to the error handler
    next(err);
  }
});

/**
 * Role-based authorization middleware
 * @param roles - Array of allowed roles
 */
export const restrictTo = (...roles: string[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !('role' in req.user) || !roles.includes(req.user.role as string)) {
      return next(
        new ApiError(
          httpStatus.FORBIDDEN,
          'You do not have permission to perform this action.'
        )
      );
    }
    next();
  };
};

/**
 * Optional authentication middleware
 * Similar to auth() but doesn't throw an error if no token is provided
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;
    const authHeader = req.headers.authorization;
    
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (token && config.JWT_SECRET) {
      try {
        const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
        const currentUser = await User.findById(decoded.id);
        
        if (currentUser) {
          req.user = currentUser;
          res.locals.user = currentUser;
        }
      } catch (error) {
        // Ignore token verification errors for optional auth
      }
    }
    
    next();
  } catch (error) {
    next(error);
  }
};
