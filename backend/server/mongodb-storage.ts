import { connectDB } from './db.js';
import { User, IUser } from './models/User.js';
import type { 
  IUser as IUserProfile,
  IMatch, 
  IMessage, 
  INotification
} from '../shared/mongo-schemas.js';
import { 
  userSchema,
  matchSchema,
  messageSchema,
  notificationSchema
} from '../shared/mongo-schemas.js';
import { model, Types, type Document } from 'mongoose';

// Create models from schemas
const Match = model<IMatch & Document>('Match', matchSchema);
const Message = model<IMessage & Document>('Message', messageSchema);
const Notification = model<INotification & Document>('Notification', notificationSchema);

// Define storage interface
export interface IStorage {
  // User operations
  getUser(id: string): Promise<IUser | null>;
  upsertUser(userData: Partial<IUser>): Promise<IUser>;
  createUser(userData: Partial<IUser>): Promise<IUser>;
  updateUser(id: string, userData: Partial<IUser>): Promise<IUser | null>;
  findUserByEmail(email: string): Promise<IUser | null>;
  
  // User profile operations
  createUserProfile(profile: Partial<IUserProfile>): Promise<IUserProfile>;
  getUserProfile(userId: string): Promise<IUserProfile | null>;
  updateUserProfile(userId: string, updates: Partial<IUserProfile>): Promise<IUserProfile | null>;
  
  // Match operations
  createMatch(matchData: Partial<IMatch>): Promise<IMatch>;
  getMatches(userId: string): Promise<IMatch[]>;
  updateMatchStatus(matchId: string, status: IMatch['status']): Promise<IMatch | null>;
  
  // Message operations
  createMessage(messageData: Partial<IMessage>): Promise<IMessage>;
  getMessages(senderId: string, recipientId: string): Promise<IMessage[]>;
  
  // Notification operations
  createNotification(notificationData: Partial<INotification>): Promise<INotification>;
  getUserNotifications(userId: string): Promise<INotification[]>;
  markNotificationAsRead(notificationId: string): Promise<INotification | null>;
  
  // Search operations
  searchDonors(organType: string, bloodType: string): Promise<IUser[]>;
  searchRecipients(organType: string, bloodType: string): Promise<IUser[]>;
  
  // Medical admin operations
  getUsersByRole(role: 'donor' | 'recipient' | 'medical'): Promise<IUser[]>;
  updateUserStatus(userId: string, status: { isActive: boolean }): Promise<IUser | null>;
}

class MongoDBStorage implements IStorage {
  // Statistics
  totalUsers: number = 0;
  totalMatches: number = 0;
  successfulTransplants: number = 0;
  activeUsers: number = 0;

  constructor() {
    this.initializeStats();
  }

  private async initializeStats() {
    try {
      await connectDB();
      this.totalUsers = await User.countDocuments({});
      this.totalMatches = await Match.countDocuments({});
      this.successfulTransplants = await Match.countDocuments({ status: 'completed' });
      this.activeUsers = await User.countDocuments({ isActive: true });
    } catch (error) {
      console.error('Error initializing stats:', error);
    }
  }

  // User operations
  async getUser(id: string): Promise<IUser | null> {
    try {
      await connectDB();
      return await User.findById(new Types.ObjectId(id)).select('-__v -password').lean();
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  async createUser(userData: Partial<IUser>): Promise<IUser> {
    try {
      await connectDB();
      const user = new User(userData);
      return await user.save();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(id: string, userData: Partial<IUser>): Promise<IUser | null> {
    try {
      await connectDB();
      return await User.findByIdAndUpdate(
        new Types.ObjectId(id),
        { $set: userData },
        { new: true }
      ).select('-__v -password').lean();
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    try {
      await connectDB();
      return await User.findOne({ email }).select('-__v -password').lean();
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  async upsertUser(userData: Partial<IUser>): Promise<IUser> {
    try {
      await connectDB();
      if (!userData._id) {
        throw new Error('User ID is required for upsert operation');
      }

      // Try to find existing user
      const existingUser = await User.findById(userData._id);
      
      if (existingUser) {
        // Update existing user
        const updatedUser = await User.findByIdAndUpdate(
          userData._id, 
          { $set: userData },
          { new: true, upsert: false }
        );
        
        if (!updatedUser) {
          throw new Error('Failed to update user');
        }
        return updatedUser;
      } else {
        // Create new user
        const newUser = new User({
          ...userData,
          _id: userData._id || new Types.ObjectId()
        });
        return await newUser.save();
      }
    } catch (error) {
      console.error('Error in upsertUser:', error);
      throw error;
    }
  }

  // User profile operations
  async createUserProfile(profile: Partial<IUserProfile>): Promise<IUserProfile> {
    try {
      await connectDB();
      const user = new User(profile);
      return await user.save();
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  async getUserProfile(userId: string): Promise<IUserProfile | null> {
    try {
      await connectDB();
      return await User.findById(userId).select('-password').lean();
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  async updateUserProfile(userId: string, updates: Partial<IUserProfile>): Promise<IUserProfile | null> {
    try {
      await connectDB();
      return await User.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true }
      ).select('-password').lean();
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // User management for medical admins
  async getUsersByRole(role: 'donor' | 'recipient' | 'medical'): Promise<IUser[]> {
    try {
      await connectDB();
      return await User.find({ role }).select('-password').lean();
    } catch (error) {
      console.error(`Error getting ${role}s:`, error);
      throw error;
    }
  }

  async updateUserStatus(userId: string, status: { isActive: boolean }): Promise<IUser | null> {
    try {
      await connectDB();
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { isActive: status.isActive } },
        { new: true }
      ).select('-password').lean().exec();
      
      if (!updatedUser) return null;
      
      // Convert to plain object and cast to IUser
      return updatedUser as unknown as IUser;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  // Match operations
  async createMatch(matchData: Partial<IMatch>): Promise<IMatch> {
    try {
      await connectDB();
      const match = new Match({
        ...matchData,
        donorId: new Types.ObjectId(matchData.donorId),
        recipientId: new Types.ObjectId(matchData.recipientId!)
      });
      return await match.save();
    } catch (error) {
      console.error('Error creating match:', error);
      throw error;
    }
  }

  async getMatches(userId: string): Promise<IMatch[]> {
    try {
      await connectDB();
      return await Match.find({
        $or: [
          { donorId: new Types.ObjectId(userId) },
          { recipientId: new Types.ObjectId(userId) }
        ]
      }).sort({ createdAt: -1 }).lean();
    } catch (error) {
      console.error('Error getting matches:', error);
      throw error;
    }
  }

  async updateMatchStatus(matchId: string, status: IMatch['status']): Promise<IMatch | null> {
    try {
      await connectDB();
      return await Match.findByIdAndUpdate(
        new Types.ObjectId(matchId),
        { $set: { status } },
        { new: true }
      ).lean();
    } catch (error) {
      console.error('Error updating match status:', error);
      throw error;
    }
  }

  // Message operations
  async createMessage(messageData: Partial<IMessage>): Promise<IMessage> {
    try {
      await connectDB();
      const message = new Message({
        ...messageData,
        senderId: new Types.ObjectId(messageData.senderId),
        recipientId: new Types.ObjectId(messageData.recipientId!)
      });
      return await message.save();
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  }

  async getMessages(senderId: string, recipientId: string): Promise<IMessage[]> {
    try {
      await connectDB();
      return await Message.find({
        $or: [
          { 
            senderId: new Types.ObjectId(senderId), 
            recipientId: new Types.ObjectId(recipientId) 
          },
          { 
            senderId: new Types.ObjectId(recipientId), 
            recipientId: new Types.ObjectId(senderId) 
          }
        ]
      }).sort({ createdAt: 1 }).lean();
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  }

  // Notification operations
  async createNotification(notificationData: Partial<INotification>): Promise<INotification> {
    try {
      await connectDB();
      const notification = new Notification({
        ...notificationData,
        userId: new Types.ObjectId(notificationData.userId!)
      });
      return await notification.save();
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  async getUserNotifications(userId: string): Promise<INotification[]> {
    try {
      await connectDB();
      return await Notification.find({ 
        userId: new Types.ObjectId(userId) 
      }).sort({ createdAt: -1 }).lean();
    } catch (error) {
      console.error('Error getting user notifications:', error);
      throw error;
    }
  }

  async markNotificationAsRead(notificationId: string): Promise<INotification | null> {
    try {
      await connectDB();
      return await Notification.findByIdAndUpdate(
        new Types.ObjectId(notificationId),
        { $set: { read: true } },
        { new: true }
      ).lean();
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Search operations
  async searchDonors(organType: string, bloodType: string): Promise<IUser[]> {
    try {
      await connectDB();
      return await User.find({
        role: 'donor',
        'medicalProfile.bloodType': bloodType,
        'medicalProfile.organType': organType,
        'medicalProfile.isEligible': true
      }).select('-__v -password').lean();
    } catch (error) {
      console.error('Error searching donors:', error);
      throw error;
    }
  }

  async searchRecipients(organType: string, bloodType: string): Promise<IUser[]> {
    try {
      await connectDB();
      return await User.find({
        role: 'recipient',
        'medicalProfile.bloodType': bloodType,
        'medicalProfile.organType': organType,
        'medicalProfile.isEligible': true
      }).select('-__v -password').lean();
    } catch (error) {
      console.error('Error searching recipients:', error);
      throw error;
    }
  }

  async getMatchByUserId(userId: string): Promise<IMatch | null> {
    try {
      await connectDB();
      return await Match.findOne({
        $or: [
          { donorId: new Types.ObjectId(userId) },
          { recipientId: new Types.ObjectId(userId) }
        ]
      }).lean();
    } catch (error) {
      console.error('Error getting match by user ID:', error);
      throw error;
    }
  }
}

export const storage = new MongoDBStorage();
