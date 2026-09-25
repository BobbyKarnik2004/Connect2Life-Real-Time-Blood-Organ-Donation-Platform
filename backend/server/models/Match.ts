import { model, Schema, Document, Types } from 'mongoose';
import { IMatch as IMatchBase } from '../../shared/mongo-schemas.js';

// Define the document interface
type IMatchDocument = IMatchBase & {
  _id: Types.ObjectId;
  // Mongoose will handle createdAt and updatedAt automatically with timestamps
  createdAt: Date;
  updatedAt: Date;
} & Document;

// Export the base interface for use in other files
export { IMatchBase };

// Create the schema with all fields
const matchSchema = new Schema<IMatchDocument>({
  donorId: { 
    type: String, 
    required: true, 
    ref: 'User' 
  },
  recipientId: { 
    type: String, 
    required: true, 
    ref: 'User' 
  },
  organType: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending',
    required: true 
  },
  matchScore: { 
    type: Number, 
    required: true 
  },
  notes: { 
    type: String 
  },
  scheduledDate: { 
    type: Date 
  },
  completedDate: { 
    type: Date 
  },
  // Add timestamps for created and updated dates
}, { timestamps: true });

// Create and export the Match model
export const Match = model<IMatchDocument>('Match', matchSchema);
