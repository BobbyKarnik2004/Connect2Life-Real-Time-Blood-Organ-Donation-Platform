import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios, { AxiosError } from 'axios';
import { User } from '../types';

// Configure axios defaults - direct backend URL for testing
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
axios.defaults.baseURL = `${BACKEND_URL}/api`;
axios.defaults.withCredentials = true;

type LoginResponse = {
  user: User;
  token: string;
  refreshToken: string;
  requires2FA?: boolean;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  requires2FA: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<LoginResponse>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    role: 'donor' | 'recipient';
  }) => Promise<void>;
  logout: () => Promise<void>;
  verify2FA: (token: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [requires2FA, setRequires2FA] = useState<boolean>(false);
  const [tempToken, setTempToken] = useState<string | null>(null);

  // Set up axios response interceptor for handling 401s
  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // If we get a 401 and have a user, they need to re-authenticate
          if (user) {
            setUser(null);
            clearAuthTokens();
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [user]);

  // Set auth tokens in storage
  const setAuthTokens = (token: string, refreshToken: string, rememberMe: boolean = false) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('authToken', token);
    storage.setItem('refreshToken', refreshToken);
    
    // Also set in axios default headers
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  // Clear auth tokens from storage
  const clearAuthTokens = () => {
    ['localStorage', 'sessionStorage'].forEach(storageType => {
      try {
        const storage = window[storageType as keyof Window] as Storage;
        storage.removeItem('authToken');
        storage.removeItem('refreshToken');
      } catch (e) {
        console.error(`Error clearing ${storageType}:`, e);
      }
    });
    
    // Remove from axios default headers
    delete axios.defaults.headers.common['Authorization'];
  };

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // Check for existing auth token
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        
        if (token) {
          // Set axios auth header
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        
        // Always try to fetch user data (will use cookie if no token)
        const response = await axios.get('/auth/me');
        if (response.data && response.data.success && response.data.data) {
          setUser(response.data.data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        setUser(null);
        clearAuthTokens();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = false): Promise<LoginResponse> => {
    try {
      const response = await axios.post('/auth/login', { email, password });

      if (response.data.success && response.data.data) {
        const { user, token } = response.data.data;
        
        // Store token if provided (for API calls)
        if (token) {
          setAuthTokens(token, token, rememberMe);
        }
        
        setUser(user);
        return { user, token, refreshToken: token };
      }

      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const verify2FA = async (token: string): Promise<void> => {
    if (!tempToken) throw new Error('No authentication in progress');
    
    const response = await axios.post<{ user: User; token: string; refreshToken: string }>(
      '/auth/verify-2fa',
      { token },
      { headers: { Authorization: `Bearer ${tempToken}` } }
    );
    
    // Get remember me preference from the original login
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    
    // Store tokens based on remember me preference
    setAuthTokens(response.data.token, response.data.refreshToken, rememberMe);
    setUser(response.data.user);
    setRequires2FA(false);
    setTempToken(null);
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    role: 'donor' | 'recipient';
  }): Promise<void> => {
    try {
      await axios.post('/auth/register', userData);
      // After registration, we don't automatically log in the user
      // They'll need to verify their email first
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await axios.post('/auth/logout');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Clear all auth data
      clearAuthTokens();
      setUser(null);
      setRequires2FA(false);
      setTempToken(null);
    }
  };

  const requestPasswordReset = async (email: string): Promise<void> => {
    await axios.post('/auth/request-password-reset', { email });
  };

  const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    await axios.post('/auth/reset-password', { token, newPassword });
  };

  const verifyEmail = async (token: string): Promise<void> => {
    await axios.post('/auth/verify-email', { token });
    // Optionally update user's verification status
    if (user) {
      setUser({ ...user, isVerified: true });
    }
  };

  const value = {
    user,
    loading,
    requires2FA,
    login,
    register,
    logout,
    verify2FA,
    requestPasswordReset,
    resetPassword,
    verifyEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
