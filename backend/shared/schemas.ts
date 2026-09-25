import { z } from 'zod';

export const insertMedicalProfileSchema = z.object({
  userId: z.string(),
  bloodType: z.string(),
  organType: z.string(),
  medicalHistory: z.string().optional(),
  height: z.number().optional(),
  weight: z.number().optional(),
  bloodPressure: z.string().optional(),
  allergies: z.array(z.string()).optional(),
  currentMedications: z.array(z.string()).optional(),
  isAvailableForDonation: z.boolean().optional(),
  isUrgent: z.boolean().optional(),
  compatibilityScore: z.number().optional(),
  lastDonationDate: z.date().optional(),
});

export const insertMatchSchema = z.object({
  donorId: z.string(),
  recipientId: z.string(),
  organType: z.string(),
  status: z.enum(['pending', 'accepted', 'rejected', 'completed', 'cancelled']),
  matchScore: z.number(),
  notes: z.string().optional(),
  scheduledDate: z.date().optional(),
  completedDate: z.date().optional(),
});

export const insertMessageSchema = z.object({
  senderId: z.string(),
  recipientId: z.string(),
  content: z.string(),
  isRead: z.boolean().default(false),
});

export const insertNotificationSchema = z.object({
  userId: z.string(),
  type: z.enum(['match', 'message', 'system', 'alert']),
  title: z.string(),
  message: z.string(),
  isRead: z.boolean().default(false),
  relatedEntityId: z.string().optional(),
  relatedEntityType: z.string().optional(),
});
