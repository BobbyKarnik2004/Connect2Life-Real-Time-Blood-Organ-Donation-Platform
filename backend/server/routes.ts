import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./mongodb-storage.js";
import { auth, restrictTo } from "./middleware/auth.js";
import { IUser, User } from "./models/User.js";
import { Match } from "./models/Match.js";

// Extend the Express Request type to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

// Type for authenticated requests
type AuthenticatedRequest = Request & { user: IUser };
import { IMedicalProfile, IMatch, IMessage, INotification } from "../shared/mongo-schemas.js";
import { 
  insertMedicalProfileSchema, 
  insertMatchSchema, 
  insertMessageSchema, 
  insertNotificationSchema 
} from "../shared/schemas.js";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes are imported from auth.routes.ts
  
  // Stats endpoint - public
  app.get('/api/stats', async (req: Request, res: Response) => {
    try {
      // Get counts from database
      const [users, matches, donors, recipients] = await Promise.all([
        User.countDocuments(),
        Match.countDocuments(),
        User.countDocuments({ role: 'donor' }),
        User.countDocuments({ role: 'recipient' })
      ]);
      
      res.json({
        totalUsers: users,
        totalMatches: matches,
        activeDonors: donors,
        activeRecipients: recipients
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ message: 'Failed to fetch statistics' });
    }
  });

  // Protected routes - require authentication
  app.get('/api/auth/me', auth, async (req: Request, res: Response) => {
    const reqWithUser = req as AuthenticatedRequest;
    try {
      // reqWithUser.user is set by the auth middleware
      const user = reqWithUser.user;
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove sensitive data before sending
      const userObj = user.toObject();
      delete userObj.password;
      
      res.json(userObj);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Medical Profile routes
  app.post('/api/medical-profile', auth, async (req: Request, res: Response) => {
    const reqWithUser = req as AuthenticatedRequest;
    try {
      const userId = reqWithUser.user._id.toString();
      const profileData = insertMedicalProfileSchema.parse({
        ...req.body,
        userId,
      });
      
      const profile = await storage.createMedicalProfile(profileData);
      res.status(201).json(profile);
    } catch (error) {
      console.error("Error creating medical profile:", error);
      res.status(400).json({ message: "Invalid medical profile data" });
    }
  });

  app.get('/api/medical-profile', auth, async (req: Request, res: Response) => {
    const reqWithUser = req as AuthenticatedRequest;
    try {
      const userId = reqWithUser.user._id.toString();
      const profile = await storage.getMedicalProfile(userId);
      res.json(profile);
    } catch (error) {
      console.error("Error fetching medical profile:", error);
      res.status(500).json({ message: "Failed to fetch medical profile" });
    }
  });

  app.put('/api/medical-profile', auth, async (req: Request, res: Response) => {
    const reqWithUser = req as AuthenticatedRequest;
    try {
      const userId = reqWithUser.user._id.toString();
      const profileData = req.body;
      
      const profile = await storage.updateMedicalProfile(userId, profileData);
      res.json(profile);
    } catch (error) {
      console.error("Error updating medical profile:", error);
      res.status(500).json({ message: "Failed to update medical profile" });
    }
  });

  // Match routes
  app.post('/api/matches', auth, async (req: Request, res: Response) => {
    const reqWithUser = req as AuthenticatedRequest;
    try {
      const userId = reqWithUser.user._id.toString();
      const matchData = insertMatchSchema.parse(req.body);
      const match = await storage.createMatch(matchData);
      
      // Notify via WebSocket
      broadcastToUser(matchData.recipientId, {
        type: 'new_match',
        data: match
      });
      
      res.status(201).json(match);
    } catch (error) {
      console.error("Error creating match:", error);
      res.status(400).json({ message: "Invalid match data" });
    }
  });

  app.get('/api/matches', auth, async (req: Request, res: Response) => {
    const reqWithUser = req as AuthenticatedRequest;
    try {
      const userId = reqWithUser.user._id.toString();
      const matches = await storage.getMatches(userId);
      res.json(matches);
    } catch (error) {
      console.error("Error fetching matches:", error);
      res.status(500).json({ message: "Failed to fetch matches" });
    }
  });

  app.put('/api/matches/:id/status', auth, async (req: Request, res: Response) => {
    const reqWithUser = req as AuthenticatedRequest;
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const match = await storage.updateMatchStatus(id, status);
      
      if (!match) {
        return res.status(404).json({ message: "Match not found" });
      }
      
      // Notify all parties
      if (match.donorId) {
        broadcastToUser(match.donorId, {
          type: 'match_status_update',
          data: match
        });
      }
      
      if (match.recipientId) {
        broadcastToUser(match.recipientId, {
          type: 'match_status_update',
          data: match
        });
      }
      
      res.json(match);
    } catch (error) {
      console.error("Error updating match status:", error);
      res.status(500).json({ message: "Failed to update match status" });
    }
  });

  // Message routes
  app.post('/api/messages', auth, async (req: Request, res: Response) => {
    const reqWithUser = req as AuthenticatedRequest;
    try {
      const userId = reqWithUser.user._id.toString();
      const messageData = insertMessageSchema.parse({
        ...req.body,
        senderId: userId,
      });
      
      const message = await storage.createMessage(messageData);
      
      // Notify recipient via WebSocket
      broadcastToUser(messageData.recipientId, {
        type: 'new_message',
        data: message
      });
      
      res.status(201).json(message);
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(400).json({ message: "Invalid message data" });
    }
  });

  app.get('/api/messages/:recipientId', auth, async (req: Request, res: Response) => {
    const reqWithUser = req as AuthenticatedRequest;
    try {
      const userId = reqWithUser.user._id.toString();
      const { recipientId } = req.params;
      
      const messages = await storage.getMessages(userId, recipientId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Notification routes
  app.get('/api/notifications', auth, async (req: Request, res: Response) => {
    const reqWithUser = req as AuthenticatedRequest;
    try {
      const userId = reqWithUser.user._id.toString();
      const notifications = await storage.getUserNotifications(userId);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.put('/api/notifications/:id/read', auth, async (req: Request, res: Response) => {
    const reqWithUser = req as AuthenticatedRequest;
    try {
      const { id } = req.params;
      await storage.markNotificationAsRead(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  // Search routes
  app.post('/api/search/donors', auth, async (req: Request, res: Response) => {
    const user = req.user; // TypeScript now knows this is IUser | undefined
    try {
      const { organType, bloodType } = req.query;
      const donors = await storage.searchDonors(organType as string, bloodType as string);
      res.json(donors);
    } catch (error) {
      console.error("Error searching donors:", error);
      res.status(500).json({ message: "Failed to search donors" });
    }
  });

  app.get('/api/search/recipients', auth, async (req: Request, res: Response) => {
    const user = req.user; // TypeScript now knows this is IUser | undefined
    try {
      const { organType, bloodType } = req.query;
      const recipients = await storage.searchRecipients(organType as string, bloodType as string);
      res.json(recipients);
    } catch (error) {
      console.error("Error searching recipients:", error);
      res.status(500).json({ message: "Failed to search recipients" });
    }
  });

  // Statistics routes
  app.get('/api/stats', async (req, res) => {
    try {
      const stats = {
        totalUsers: storage.totalUsers,
        totalMatches: storage.totalMatches,
        successfulTransplants: storage.successfulTransplants,
        activeUsers: storage.activeUsers
      };
      res.json(stats);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  // WebSocket server setup
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const clients = new Map<string, WebSocket>();

  wss.on('connection', (ws, req) => {
    console.log('WebSocket connection established');
    
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'auth' && data.userId) {
          const userId = data.userId;
          const match = await storage.getMatchByUserId(userId);
          if (match && (!match.donorId || !match.recipientId || (match.donorId !== userId && match.recipientId !== userId))) {
            clients.set(userId, ws);
            console.log(`User ${userId} connected to WebSocket`);
          }
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      // Remove client from map
      for (const [userId, client] of Array.from(clients.entries())) {
        if (client === ws) {
          clients.delete(userId);
          console.log(`User ${userId} disconnected from WebSocket`);
          break;
        }
      }
    });
  });

  // Broadcast function
  function broadcastToUser(userId: string, message: any) {
    const client = clients.get(userId);
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  }

  // Store broadcast function for use in routes
  (global as any).broadcastToUser = broadcastToUser;

  return httpServer;
}
