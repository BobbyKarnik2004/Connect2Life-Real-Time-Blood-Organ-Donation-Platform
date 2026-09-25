import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const processAuth = async () => {
      try {
        // 1. Check for errors in URL
        const error = searchParams.get('error');
        if (error) {
          throw new Error(error);
        }

        // 2. Extract token from URL fragment or query params
        let token;
        
        // Try to get token from hash fragment first (OAuth flow)
        const hash = window.location.hash.substring(1);
        if (hash) {
          const params = new URLSearchParams(hash);
          token = params.get('token');
        }
        
        // If no token in hash, try query params (for direct token access or testing)
        if (!token) {
          token = searchParams.get('token');
        }

        if (!token) {
          throw new Error('No authentication token found in the URL');
        }

        // 3. Store the token in localStorage and axios headers
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // 4. Fetch user data using the token
        const response = await axios.get(`${API_BASE_URL}/auth/me`);
        
        if (!response.data?.data) {
          throw new Error('Invalid user data received from server');
        }

        // 5. Update auth context with user data
        login(response.data.data);
        
        // 6. Show success message
        toast.success('Login Successful', {
          description: 'You have been successfully logged in!'
        });

        // 7. Redirect to intended URL or dashboard
        const redirectTo = localStorage.getItem('redirectAfterLogin') || '/dashboard';
        localStorage.removeItem('redirectAfterLogin');
        navigate(redirectTo);
        
      } catch (err) {
        console.error('Authentication error:', err);
        setError(err.message || 'Authentication failed');
        
        // Show error toast
        toast.error('Authentication Failed', {
          description: err.message || 'There was an error during authentication.'
        });
        
        // Redirect to login with error message
        const errorMessage = encodeURIComponent(
          err.response?.data?.message || err.message || 'authentication_failed'
        );
        navigate(`/login?error=${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    processAuth();
  }, [searchParams, navigate, login, location]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Completing authentication...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Authentication Error
            </h2>
            <p className="mt-2 text-sm text-red-600">{error}</p>
            <button
              onClick={() => navigate('/login')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Authenticating...</p>
      </div>
    </div>
  );
}
