import { User, IUser } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { OAuth2Client } from 'google-auth-library';
import config from '../../config.js';

// Initialize Google OAuth2 client
const client = new OAuth2Client({
  clientId: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRET
});

// Type for user data without sensitive fields
type SafeUser = Omit<IUser, 'password' | 'passwordChangedAt'> & {
  _id: string;
  __v?: number;
};

/**
 * Register a new user
 */
export const registerUser = async (userData: Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>): Promise<SafeUser> => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new ApiError(400, 'User already exists with this email');
    }

    // Create new user
    const user = new User(userData);
    await user.save();
    
    // Return user without sensitive data
    const { password, passwordChangedAt, ...safeUser } = user.toObject();
    return safeUser as SafeUser;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, 'Failed to register user');
  }
};

/**
 * Login user with email and password
 */
export const loginUser = async (email: string, password: string): Promise<{ user: SafeUser; token: string }> => {
  try {
    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Check if password is correct
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Generate JWT token
    const token = user.generateAuthToken();
    
    // Return user without sensitive data
    const { password: _, passwordChangedAt: __, ...safeUser } = user.toObject();
    return { user: safeUser as SafeUser, token };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, 'Failed to login');
  }
};

/**
 * Verify Google ID token
 */
export const verifyGoogleToken = async (idToken: string) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: config.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload) {
      throw new ApiError(401, 'Invalid Google token');
    }
    
    return {
      googleId: payload.sub,
      email: payload.email || '',
      emailVerified: payload.email_verified || false,
      name: payload.name || '',
      givenName: payload.given_name || '',
      familyName: payload.family_name || '',
      picture: payload.picture,
      locale: payload.locale
    };
  } catch (error) {
    console.error('Google token verification error:', error);
    throw new ApiError(401, 'Invalid Google token');
  }
};

/**
 * Find or create a user from Google profile
 */
export const findOrCreateGoogleUser = async (googleUser: {
  googleId: string;
  email: string;
  emailVerified: boolean;
  name?: string;
  givenName?: string;
  familyName?: string;
  picture?: string;
}): Promise<{ user: SafeUser; isNewUser: boolean; token: string }> => {
  try {
    // Check if user exists with this Google ID
    let user = await User.findOne({ googleId: googleUser.googleId });
    let isNewUser = false;
    
    if (!user) {
      // Check if user with this email already exists
      user = await User.findOne({ email: googleUser.email });
      
      if (user) {
        // Link Google account to existing user
        user.googleId = googleUser.googleId;
        if (googleUser.picture) user.avatar = googleUser.picture;
        await user.save();
      } else {
        // Create new user
        user = new User({
          email: googleUser.email,
          firstName: googleUser.givenName || '',
          lastName: googleUser.familyName || '',
          googleId: googleUser.googleId,
          avatar: googleUser.picture,
          isEmailVerified: googleUser.emailVerified,
          role: 'user'
        });
        
        await user.save();
        isNewUser = true;
      }
    }
    
    // Generate JWT token
    const token = user.generateAuthToken();
    
    // Return user without sensitive data
    const { password, passwordChangedAt, ...safeUser } = user.toObject();
    return { user: safeUser as SafeUser, isNewUser, token };
  } catch (error) {
    console.error('Error in findOrCreateGoogleUser:', error);
    throw new ApiError(500, 'Failed to authenticate with Google');
  }
};

/**
 * Get current user profile
 */
export const getCurrentUser = async (userId: string): Promise<SafeUser | null> => {
  try {
    const user = await User.findById(userId).select('-password -passwordChangedAt');
    if (!user) return null;
    
    const { password, passwordChangedAt, ...safeUser } = user.toObject();
    return safeUser as SafeUser;
  } catch (error) {
    console.error('Error getting current user:', error);
    throw new ApiError(500, 'Failed to get user profile');
  }
};
