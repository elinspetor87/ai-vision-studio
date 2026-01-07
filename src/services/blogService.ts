import api from '../config/api';
import { BlogPost, PaginatedResponse } from '../types';

export const blogService = {
  // Get all blog posts with pagination
  getAllPosts: async (page: number = 1, limit: number = 10, category?: string, status: string = 'published') => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      status,
    });

    if (category) {
      params.append('category', category);
    }

    const response = await api.get<{success: boolean; data: BlogPost[]; pagination: any}>(`/api/blog?${params}`);
    return {
      data: response.data.data,
      pagination: response.data.pagination
    };
  },

  // Get featured posts
  getFeaturedPosts: async (limit: number = 3) => {
    const response = await api.get<{success: boolean; data: BlogPost[]}>(`/api/blog/featured?limit=${limit}`);
    return response.data.data;
  },

  // Get single post by slug
  getPostBySlug: async (slug: string) => {
    const response = await api.get<{success: boolean; data: BlogPost}>(`/api/blog/slug/${slug}`);
    return response.data.data;
  },

  // Get single post by ID (admin only)
  getPostById: async (id: string) => {
    const response = await api.get<{success: boolean; data: BlogPost}>(`/api/blog/${id}`);
    return response.data.data;
  },

  // Create post (admin only)
  createPost: async (postData: Partial<BlogPost>) => {
    const response = await api.post<{success: boolean; data: BlogPost}>('/api/blog', postData);
    return response.data.data;
  },

  // Update post (admin only)
  updatePost: async (id: string, postData: Partial<BlogPost>) => {
    const response = await api.put<{success: boolean; data: BlogPost}>(`/api/blog/${id}`, postData);
    return response.data.data;
  },

  // Delete post (admin only)
  deletePost: async (id: string) => {
    const response = await api.delete(`/api/blog/${id}`);
    return response.data;
  },

  // Publish post (admin only)
  publishPost: async (id: string) => {
    const response = await api.patch<{success: boolean; data: BlogPost}>(`/api/blog/${id}/publish`);
    return response.data.data;
  },
};
