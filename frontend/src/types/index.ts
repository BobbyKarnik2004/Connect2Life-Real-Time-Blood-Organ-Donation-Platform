// User and Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'donor' | 'recipient' | 'admin';
  isVerified?: boolean;
  has2FAEnabled?: boolean;
  avatar?: string;
  profileCompletion?: number;
  bloodGroup?: string;
  location?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  lastDonationDate?: string | null;
  medicalConditions?: string[];
  medications?: string[];
  allergies?: string[];
  createdAt?: string;
  // Additional fields to match the codebase
  phone?: string; // Alias for phoneNumber
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  requires2FA?: boolean; // For 2FA status
  updatedAt?: string;
  [key: string]: any; // Allow additional properties
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Matching Types
export interface Donor {
  id: string;
  name: string;
  bloodGroup: string;
  lastDonation: string;
  location: string;
  distance: number;
  availability: string[];
  contact: {
    phone: string;
    email: string;
  };
}

export interface Recipient {
  id: string;
  name: string;
  bloodGroup: string;
  requiredBy: string;
  hospital: string;
  location: string;
  contact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface MatchingState {
  donors: Donor[];
  recipients: Recipient[];
  filters: {
    bloodGroup: string;
    distance: number;
    searchQuery: string;
  };
  isLoading: boolean;
  error: string | null;
}

// Notification Types
export interface NotificationAction {
  label: string;
  onClick: () => void;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'urgent';
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  action?: NotificationAction;
}

export interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
}

// Dashboard Types
export interface DashboardStats {
  totalMatches: number;
  activeRequests: number;
  liveSaved: number;
  donorPoints: number;
  responseTime: string;
  urgentRequests: number;
}

export interface ProfileStatus {
  medicalProfile: boolean;
  donorProfile: boolean;
  recipientProfile: boolean;
  completionPercentage: number;
}

export interface Match {
  id: string;
  type: string;
  title: string;
  date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  user: {
    id: string;
    name: string;
    bloodGroup: string;
    location: string;
  };
  details: string;
  urgency: 'low' | 'medium' | 'high';
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  statusCode?: number;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'donor' | 'recipient';
  acceptTerms: boolean;
}

export interface ProfileFormData {
  name: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  medicalConditions: string[];
  medications: string[];
  allergies: string[];
  lastDonationDate?: string;
  canContact: boolean;
  receiveUpdates: boolean;
}

// Component Props
export interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
  requireVerification?: boolean;
}

export interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  containerClass?: string;
}

// Utility Types
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
