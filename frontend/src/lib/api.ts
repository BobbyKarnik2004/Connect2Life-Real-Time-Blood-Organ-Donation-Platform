import { API_BASE_URL } from '../config';

// Base URL for API requests

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Set default headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Include credentials for cross-origin requests
  const requestOptions: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // Important for sending cookies with CORS
  };

  try {
    const response = await fetch(url, requestOptions);
    const data = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      return {
        error: data.message || 'Something went wrong',
        status: response.status,
      };
    }

    return { data, status: response.status };
  } catch (error) {
    console.error('API request failed:', error);
    return {
      error: error instanceof Error ? error.message : 'Network error',
      status: 500,
    };
  }
}

// Auth API functions
export const authApi = {
  async login(email: string, password: string) {
    return apiRequest<{ token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async register(userData: { email: string; password: string; name: string }) {
    return apiRequest<{ id: string; email: string; name: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async getCurrentUser() {
    return apiRequest<{ id: string; email: string; name: string }>('/auth/me');
  },

  async logout() {
    return apiRequest('/auth/logout', { method: 'POST' });
  },
};
