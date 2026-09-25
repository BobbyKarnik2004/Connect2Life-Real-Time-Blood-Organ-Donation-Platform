import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Types } from 'mongoose';
import * as authService from '../services/auth.service.js';
import { User } from '../models/User.js';
import { auth, AuthRequest } from '../middleware/auth.js';
import { ApiError } from '../utils/ApiError.js';
import config from '../../config.js';

// User roles for type safety
type UserRole = 'donor' | 'recipient' | 'medical';

// Extend Express types
declare global {
  namespace Express {
    interface User {
      _id: Types.ObjectId;
      email: string;
      role: string; // Changed from UserRole to string to match the auth middleware
      [key: string]: any;
    }
    
    interface Request {
      user?: User;
    }
  }
}

// Type for request handlers that require authentication
type AuthenticatedRequestHandler = (
  req: Request & { user: Express.User },
  res: Response,
  next: NextFunction
) => Promise<void> | void;

// For HTTP status codes
const httpStatus = {
  CREATED: 201,
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const;

// Configure Passport with Google OAuth
passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: config.GOOGLE_CALLBACK_URL,
    scope: ['profile', 'email'],
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      const { user } = await authService.findOrCreateGoogleUser({
        googleId: profile.id,
        email: profile.emails?.[0]?.value || '',
        emailVerified: profile.emails?.[0]?.verified || false,
        givenName: profile.name?.givenName,
        familyName: profile.name?.familyName,
        picture: profile.photos?.[0]?.value,
        name: profile.displayName
      });
      
      return done(null, user);
    } catch (error) {
      return done(error as Error, undefined);
    }
  }
));

// Serialize/Deserialize user
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await authService.getCurrentUser(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

const router = Router();

// Initialize passport
router.use(passport.initialize());

/**
 * @swagger
 * /api/auth/user:
 *   get:
 *     summary: Get current user information
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The user information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
// Get current user profile
router.get('/user', auth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get current user
    if (!req.user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');
    }
    const user = await authService.getCurrentUser(req.user._id.toString());
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    res.status(httpStatus.OK).json({
      success: true,
      data: user
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               role:
 *                 type: string
 *                 enum: [donor, recipient]
 *                 default: donor
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 */
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    // Register the user with required fields
    const user = await authService.registerUser({
      email,
      password,
      firstName,
      lastName,
      role: 'donor' as const,
      phoneNumber: '',
      address: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
      dateOfBirth: new Date(),
      gender: 'other',
      bloodType: '',
      organType: '',
      medicalHistory: '',
      isEmailVerified: false,
      isTwoFactorEnabled: false,
      currentMedications: [],
      allergies: [],
      // These will be set by the model
      comparePassword: async () => false,
      changedPasswordAfter: () => false,
      generateAuthToken: () => ''
    } as any);
    
    // Login the user to get the token
    const { token } = await authService.loginUser(email, password);
    
    // Set the auth cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
    
    // Return the user and token
    const userResponse = { ...user };
    
    res.status(httpStatus.CREATED).json({
      status: 'success',
      data: {
        user: userResponse,
        token
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Please provide email and password');
    }
    
    const { user, token } = await authService.loginUser(email, password);
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
    
    res.status(200).json({
      success: true,
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user data
 *       401:
 *         description: Not authenticated
 */
router.get('/me', auth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      throw new ApiError(401, 'Not authenticated');
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('token');
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Initiate Google OAuth flow
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to Google for authentication
 */
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully authenticated with Google
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 */
/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The user's profile data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The user's profile data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
// Get current user's profile
router.get('/me', auth, async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
    // The auth middleware adds the user to req.user
    const user = await User.findById(req.user?._id).select('-password');
    
    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }
    
    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    next(new ApiError(500, 'Error fetching user data'));
  }
});

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback URL
 *     description: Handles the callback from Google OAuth and redirects to the frontend with JWT token
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         description: The authorization code from Google
 *     responses:
 *       302:
 *         description: Redirects to frontend with JWT token in URL fragment
 *       401:
 *         description: Authentication failed
 */
router.get('/google/callback',
  passport.authenticate('google', { 
    session: false, 
    failureRedirect: `${config.FRONTEND_URL}/login?error=authentication_failed`,
    failureMessage: true
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as any;
      if (!user) {
        return next(new ApiError(401, 'Authentication failed: No user data'));
      }
      
      // Generate JWT token
      const token = user.generateAuthToken();
      
      if (!token) {
        return next(new ApiError(500, 'Failed to generate authentication token'));
      }
      
      // Create a secure, httpOnly cookie with the token
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/',
      });
      
      // Also include token in URL fragment for frontend to pick up
      const redirectUrl = new URL(`${config.FRONTEND_URL}/auth/callback`);
      redirectUrl.hash = `token=${encodeURIComponent(token)}`;
      
      // Redirect to frontend with token in URL fragment
      res.redirect(redirectUrl.toString());
      
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      
      // Redirect to login with error message
      const errorMessage = error instanceof Error ? 
        `authentication_failed&message=${encodeURIComponent(error.message)}` : 
        'authentication_failed';
      
      res.redirect(`${config.FRONTEND_URL}/login?error=${errorMessage}`);
    }
  }
);

/**
 * @swagger
 * /api/auth/google/token:
 *   post:
 *     summary: Authenticate with Google ID token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idToken
 *             properties:
 *               idToken:
 *                 type: string
 *                 description: Google ID token from the client
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *                 user:
 *                   $ref: '#/components/schemas/User'
 */
router.post('/google/token', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idToken } = req.body;
    
    if (!idToken) {
      throw new ApiError(400, 'ID token is required');
    }
    
    // Verify Google token and get user profile
    const googleProfile = await authService.verifyGoogleToken(idToken);
    
    // Find or create user
    const { user, token, isNewUser } = await authService.findOrCreateGoogleUser({
      googleId: googleProfile.googleId,
      email: googleProfile.email,
      emailVerified: googleProfile.emailVerified,
      name: googleProfile.name,
      givenName: googleProfile.givenName,
      familyName: googleProfile.familyName,
      picture: googleProfile.picture
    });
    
    // Return token and user data
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: googleProfile.name,
        avatar: googleProfile.picture,
        isNewUser
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
