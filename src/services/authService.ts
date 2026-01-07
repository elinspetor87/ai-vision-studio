import api from '../config/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export const authService = {
  // Login
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<AuthResponse>('/api/auth/login', credentials);
    if (response.data.data?.accessToken) {
      localStorage.setItem('token', response.data.data.accessToken);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
    }
    return response.data.data;
  },

  // Register
  register: async (data: RegisterData) => {
    const response = await api.post<AuthResponse>('/api/auth/register', data);
    if (response.data.data?.accessToken) {
      localStorage.setItem('token', response.data.data.accessToken);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
    }
    return response.data.data;
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/api/auth/logout');
    } finally {
      localStorage.removeItem('token');
    }
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get<{success: boolean; data: {user: User}}>('/api/auth/me');
    return response.data.data.user;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get token
  getToken: () => {
    return localStorage.getItem('token');
  },
};
