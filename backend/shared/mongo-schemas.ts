import { Schema, Document, Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId | string;
  email: string;
  role: 'donor' | 'recipient' | 'medical';
  password: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  isEmailVerified?: boolean;
  isTwoFactorEnabled?: boolean;
  phoneNumber?: string;
  bloodType?: string;
  organType?: string;
  medicalHistory?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  dateOfBirth?: Date;
  gender?: string;
  height?: number;
  weight?: number;
  bloodPressure?: string;
  allergies?: string[];
  currentMedications?: string[];
  // OAuth fields
  googleId?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // These will be added by the schema methods
}

export const userSchema = new Schema<IUser>({
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
    required: [true, 'Role is required'],
    enum: {
      values: ['donor', 'recipient', 'medical'],
      message: 'Role must be either donor, recipient, or medical'
    }
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
  weight: { type: Number },
  bloodPressure: { type: String },
  allergies: { type: [String], default: [] },
  currentMedications: { type: [String], default: [] }
}, { timestamps: true });

export interface IMedicalProfile extends Document {
  userId: string;
  bloodType: string;
  organType: string;
  medicalHistory: string;
  height: number;
  weight: number;
  bloodPressure: string;
  allergies: string[];
  currentMedications: string[];
  isAvailableForDonation: boolean;
  isUrgent: boolean;
  compatibilityScore?: number;
  lastDonationDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const medicalProfileSchema = new Schema<IMedicalProfile>({
  userId: { type: String, required: true, ref: 'User' },
  bloodType: { type: String, required: true },
  organType: { type: String, required: true },
  medicalHistory: { type: String, required: true },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  bloodPressure: { type: String, required: true },
  allergies: { type: [String], default: [] },
  currentMedications: { type: [String], default: [] },
  isAvailableForDonation: { type: Boolean, default: false },
  isUrgent: { type: Boolean, default: false },
  compatibilityScore: { type: Number },
  lastDonationDate: { type: Date }
}, { timestamps: true });

export interface IMatch extends Document {
  donorId: string;
  recipientId: string;
  organType: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  matchScore: number;
  notes?: string;
  scheduledDate?: Date;
  completedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const matchSchema = new Schema<IMatch>({
  donorId: { type: String, required: true, ref: 'User' },
  recipientId: { type: String, required: true, ref: 'User' },
  organType: { type: String, required: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  matchScore: { type: Number, required: true },
  notes: { type: String },
  scheduledDate: { type: Date },
  completedDate: { type: Date }
}, { timestamps: true });

export interface IMessage extends Document {
  senderId: string;
  recipientId: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const messageSchema = new Schema<IMessage>({
  senderId: { type: String, required: true, ref: 'User' },
  recipientId: { type: String, required: true, ref: 'User' },
  content: { type: String, required: true },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

export interface INotification extends Document {
  userId: string;
  type: 'match' | 'message' | 'system' | 'alert';
  title: string;
  message: string;
  isRead: boolean;
  relatedEntityId?: string;
  relatedEntityType?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const notificationSchema = new Schema<INotification>({
  userId: { type: String, required: true, ref: 'User' },
  type: { 
    type: String, 
    required: true, 
    enum: ['match', 'message', 'system', 'alert'] 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  relatedEntityId: { type: String },
  relatedEntityType: { type: String }
}, { timestamps: true });
