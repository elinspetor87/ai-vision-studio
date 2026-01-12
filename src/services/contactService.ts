import api from '../config/api';
import { ContactSubmission } from '../types';

export interface ContactFormData {
  name: string;
  email: string;
  date?: string;
  time?: string;
  message: string;
}

export const contactService = {
  // Submit contact form (public)
  submitContactForm: async (formData: ContactFormData) => {
    const response = await api.post<{
      success: boolean;
      message: string;
      data: ContactSubmission;
    }>(
      '/api/contact',
      formData
    );
    return response.data;
  },

  // Get all submissions (admin only)
  getAllSubmissions: async (status?: string) => {
    const params = status ? `?status=${status}` : '';
    const response = await api.get<{ success: boolean; data: ContactSubmission[] }>(`/api/contact${params}`);
    return response.data.data;
  },

  // Get submission statistics (admin only)
  getStats: async () => {
    const response = await api.get<{
      success: boolean;
      data: {
        total: number;
        byStatus: Record<string, number>;
        recentSubmissions: ContactSubmission[];
      };
    }>('/api/contact/stats');
    return response.data.data;
  },

  // Get single submission (admin only)
  getSubmissionById: async (id: string) => {
    const response = await api.get<{ success: boolean; data: ContactSubmission }>(`/api/contact/${id}`);
    return response.data.data;
  },

  // Update submission status (admin only)
  updateStatus: async (id: string, status: string, notes?: string) => {
    const response = await api.patch<{ success: boolean; data: ContactSubmission }>(`/api/contact/${id}/status`, {
      status,
      notes,
    });
    return response.data.data;
  },

  // Delete submission (admin only)
  deleteSubmission: async (id: string) => {
    const response = await api.delete(`/api/contact/${id}`);
    return response.data;
  },
};
