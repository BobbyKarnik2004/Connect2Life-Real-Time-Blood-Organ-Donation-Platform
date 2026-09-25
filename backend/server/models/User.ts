import { model, Schema, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUser as IUserBase } from '../../shared/mongo-schemas.js';

// Interface for JWT payload
interface JwtPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
}

// Base user interface that matches the schema
export interface IUser extends IUserBase {
  // Add any additional fields from the schema that aren't in IUserBase
  isEmailVerified: boolean;
  isTwoFactorEnabled: boolean;
  passwordChangedAt?: Date;
}

// Document interface that includes Mongoose document methods
export interface IUserDocument extends Omit<IUser, '_id'>, Document<Types.ObjectId> {
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  changedPasswordAfter(JWTTimestamp: number): boolean;
  generateAuthToken(): string;
}

// Create the schema with all fields
const userSchema = new Schema<IUserDocument>({
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false
  },
  role: { 
    type: String, 
    enum: ['donor', 'recipient', 'medical'],
    required: [true, 'Role is required'],
    default: 'donor'
  },
  firstName: { type: String },
  lastName: { type: String },
  profileImageUrl: { type: String },
  isEmailVerified: { type: Boolean, default: false },
  isTwoFactorEnabled: { type: Boolean, default: false },
  phoneNumber: { type: String },
  bloodType: { type: String },
  organType: { type: String },
  medicalHistory: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  zipCode: { type: String },
  country: { type: String },
  dateOfBirth: { type: Date },
  gender: { type: String },
  height: { type: Number },
  // OAuth fields
  googleId: { type: String, select: false },
  avatar: { type: String },
  weight: { type: Number },
  bloodPressure: { type: String },
  allergies: { type: [String], default: [] },
  currentMedications: { type: [String], default: [] },
  // Track when password was last changed for token invalidation
  passwordChangedAt: { type: Date, select: false },
}, {
  timestamps: true
});

// Add a pre-save hook to hash password before saving
userSchema.pre<IUserDocument>('save', async function(next) {
  // Only hash the password if it has been modified (or is new) and exists
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);
    
    // Set passwordChangedAt if this is not a new user
    if (!this.isNew) {
      this.passwordChangedAt = new Date(Date.now() - 1000); // 1 second in the past to ensure token is valid
    }
    
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(this: IUserDocument, candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check if user changed password after the token was issued
userSchema.methods.changedPasswordAfter = function(this: IUserDocument, JWTTimestamp: number): boolean {
  if (this.passwordChangedAt) {
    const changedTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);
    return JWTTimestamp < changedTimestamp;
  }
  return false; // Not changed
};

// Method to generate JWT token
userSchema.methods.generateAuthToken = function(this: IUserDocument): string {
  const payload: JwtPayload = {
    id: this._id.toString(),
    email: this.email,
    role: this.role
  };

  const secret = process.env.JWT_SECRET || 'your-secret-key';
  const token = jwt.sign(payload, secret, { 
    expiresIn: process.env.JWT_EXPIRES_IN || '30d' 
  } as jwt.SignOptions);

  return token;
};

// Create and export the User model
export const User = model<IUserDocument>('User', userSchema);

// Export IUser type from shared types
export type { IUser as UserType } from '../../shared/mongo-schemas.js';

