import api from '../config/api';
import { ContactSubmission } from '../types';

export interface ContactFormData {
  name: string;
  email: string;
  date: string;
  time: string;
  message: string;
}

export const contactService = {
  // Submit contact form (public)
  submitContactForm: async (formData: ContactFormData) => {
    const response = await api.post<{ message: string; submission: ContactSubmission }>(
      '/api/contact',
      formData
    );
    return response.data;
  },

  // Get all submissions (admin only)
  getAllSubmissions: async (status?: string) => {
    const params = status ? `?status=${status}` : '';
    const response = await api.get<ContactSubmission[]>(`/api/contact${params}`);
    return response.data;
  },

  // Get submission statistics (admin only)
  getStats: async () => {
    const response = await api.get<{
      total: number;
      byStatus: Record<string, number>;
      recentSubmissions: ContactSubmission[];
    }>('/api/contact/stats');
    return response.data;
  },

  // Get single submission (admin only)
  getSubmissionById: async (id: string) => {
    const response = await api.get<ContactSubmission>(`/api/contact/${id}`);
    return response.data;
  },

  // Update submission status (admin only)
  updateStatus: async (id: string, status: string, notes?: string) => {
    const response = await api.patch<ContactSubmission>(`/api/contact/${id}/status`, {
      status,
      notes,
    });
    return response.data;
  },

  // Delete submission (admin only)
  deleteSubmission: async (id: string) => {
    const response = await api.delete(`/api/contact/${id}`);
    return response.data;
  },
};
