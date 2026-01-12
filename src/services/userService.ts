import api from '../config/api';

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'editor';
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  role?: 'admin' | 'editor';
  profilePicture?: {
    url: string;
    publicId: string;
  };
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor';
  profilePicture?: {
    url: string;
    publicId: string;
  };
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UsersResponse {
  success: boolean;
  data: User[];
}

export interface UserResponse {
  success: boolean;
  data: User;
}

export const userService = {
  // Get all users
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<UsersResponse>('/api/users');
    return response.data.data;
  },

  // Get single user
  getUserById: async (id: string): Promise<User> => {
    const response = await api.get<UserResponse>(`/api/users/${id}`);
    return response.data.data;
  },

  // Create new user
  createUser: async (data: CreateUserData): Promise<User> => {
    const response = await api.post<any>('/api/auth/register', data);
    return response.data.data.user;
  },

  // Update user
  updateUser: async (id: string, data: UpdateUserData): Promise<User> => {
    const response = await api.patch<UserResponse>(`/api/users/${id}`, data);
    return response.data.data;
  },

  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/api/users/${id}`);
  },
};
