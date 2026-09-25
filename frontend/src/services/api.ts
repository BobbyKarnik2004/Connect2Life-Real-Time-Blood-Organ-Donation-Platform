import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { store } from '../store/store';
import { logout } from '../store/slices/authSlice';

export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    
    // If the error status is 401 and there's no retry flag
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
        const { token, refreshToken: newRefreshToken } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        // Update the Authorization header
        originalRequest.headers.Authorization = `Bearer ${token}`;
        
        // Retry the original request
        return api(originalRequest);
      } catch (error) {
        // If refresh token fails, log the user out
        store.dispatch(logout());
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'donor' | 'recipient' | 'admin';
  isVerified: boolean;
  has2FAEnabled: boolean;
  bloodGroup?: string;
  location?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// Auth API
export const authApi = {
  login: (email: string, password: string) => 
    api.post<{ data: LoginResponse }>('/auth/login', { email, password }),
  
  register: (userData: {
    name: string;
    email: string;
    password: string;
    role: 'donor' | 'recipient';
    bloodGroup?: string;
    location?: string;
  }) => api.post<{ message: string }>('/auth/register', userData),
  
  verifyEmail: (token: string) =>
    api.post<{ message: string }>('/auth/verify-email', { token }),
  
  verify2FA: (token: string, code: string) => 
    api.post<{ verified: boolean }>('/auth/verify-2fa', { token, code }),
  
  requestPasswordReset: (email: string) => 
    api.post<{ message: string }>('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, password: string) => 
    api.post<{ message: string }>('/auth/reset-password', { token, password }),
  
  logout: () => api.post<{ message: string }>('/auth/logout'),
  
  getProfile: () => 
    api.get<{ data: User }>('/auth/me'),
  
  updateProfile: (userData: Partial<User>) => 
    api.put<{ data: User }>('/auth/me', userData),
};

// Donors API
export const donorsApi = {
  getDonors: (filters: any) => 
    api.get('/donors', { params: filters }),
  
  getDonorById: (id: string) => 
    api.get(`/donors/${id}`),
  
  createDonor: (donorData: any) => 
    api.post('/donors', donorData),
  
  updateDonor: (id: string, donorData: any) => 
    api.put(`/donors/${id}`, donorData),
  
  deleteDonor: (id: string) => 
    api.delete(`/donors/${id}`),
};

// Recipients API
export const recipientsApi = {
  getRecipients: (filters: any) => 
    api.get('/recipients', { params: filters }),
  
  getRecipientById: (id: string) => 
    api.get(`/recipients/${id}`),
  
  createRecipient: (recipientData: any) => 
    api.post('/recipients', recipientData),
  
  updateRecipient: (id: string, recipientData: any) => 
    api.put(`/recipients/${id}`, recipientData),
  
  deleteRecipient: (id: string) => 
    api.delete(`/recipients/${id}`),
};

// Matching API
export const matchingApi = {
  getMatches: (filters: any) => 
    api.get('/matching', { params: filters }),
  
  requestDonation: (donorId: string, message: string) => 
    api.post('/matching/request', { donorId, message }),
  
  respondToRequest: (requestId: string, accept: boolean) => 
    api.post(`/matching/respond/${requestId}`, { accept }),
};

export default api;
