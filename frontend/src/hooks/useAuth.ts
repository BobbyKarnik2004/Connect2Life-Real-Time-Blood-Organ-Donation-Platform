import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authApi, User, LoginResponse } from '../services/api';
import { loginSuccess, logout as logoutAction } from '../store/slices/authSlice';

interface LoginCredentials {
  email: string;
  password: string;
}

export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, any, LoginCredentials>({
    mutationFn: async ({ email, password }: LoginCredentials) => {
      const response = await authApi.login(email, password);
      // The API response is { data: LoginResponse }
      if (!response.data) {
        throw new Error('Invalid response from server');
      }
      // Return the nested data from the API response
      return response.data.data; // This is LoginResponse
    },
    onSuccess: (data) => {
      const { user, token, refreshToken } = data;
      dispatch(loginSuccess({ user, token, refreshToken }));
      queryClient.setQueryData(['user'], user);
      navigate('/dashboard');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Login failed');
    },
  });
};

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'donor' | 'recipient';
  bloodGroup?: string;
  location?: string;
}

export const useRegister = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: RegisterData) => authApi.register(userData),
    onSuccess: () => {
      toast.success('Registration successful! Please check your email to verify your account.');
      navigate('/login');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Registration failed');
    },
  });
};

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        // Call logout API if available
        await authApi.logout();
      } catch (error) {
        console.error('Logout error:', error);
        // Continue with client-side logout even if API call fails
      }
      return Promise.resolve();
    },
    onSuccess: () => {
      dispatch(logoutAction());
      queryClient.clear();
      navigate('/login');
    },
  });
};

export const useUser = () => {
  return useQuery<User>({
    queryKey: ['user'],
    queryFn: async (): Promise<User> => {
      const response = await authApi.getProfile();
      // The API response is { data: User }
      if (!response.data || !response.data.data) {
        throw new Error('Failed to load user profile');
      }
      // Return the nested user data from the API response
      return response.data.data as User;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount: number, error: any) => {
      // Don't retry on 401
      if (error?.response?.status === 401) return false;
      return failureCount < 3;
    },
  });
};

export const useAuth = () => {
  const { data: user, isLoading, isError } = useUser();
  const login = useLogin();
  const register = useRegister();
  const logout = useLogout();
  const requestPasswordReset = useRequestPasswordReset();
  const resetPassword = useResetPassword();
  const verifyEmail = useVerifyEmail();

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isError,
    login,
    register,
    logout,
    requestPasswordReset,
    resetPassword,
    verifyEmail,
  };
};

interface UpdateProfileData {
  name?: string;
  email?: string;
  bloodGroup?: string;
  location?: string;
  avatar?: string;
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation<User, any, UpdateProfileData>({
    mutationFn: async (userData: UpdateProfileData): Promise<User> => {
      const response = await authApi.updateProfile(userData);
      // The API response is { data: User }
      if (!response.data || !response.data.data) {
        throw new Error('Failed to update profile');
      }
      // Return the nested user data from the API response
      return response.data.data as User;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data);
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });
};

export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: (email: string) => authApi.requestPasswordReset(email),
    onSuccess: () => {
      toast.success('Password reset link sent to your email');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to send reset link');
    },
  });
};

export const useResetPassword = () => {
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      authApi.resetPassword(token, password),
    onSuccess: () => {
      toast.success('Password reset successful. You can now login with your new password.');
      navigate('/login');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    },
  });
};

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: ({ token }: { token: string }) =>
      authApi.verifyEmail(token),
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to verify email');
    },
  });
};
