import api from '../config/api';
import { Project } from '../types';

export const projectService = {
  // Get all projects
  getAllProjects: async (status?: string, category?: string, featured?: boolean) => {
    const params = new URLSearchParams();

    if (status) {
      params.append('status', status);
    }

    if (category) {
      params.append('category', category);
    }

    if (featured !== undefined) {
      params.append('featured', featured.toString());
    }

    const queryString = params.toString();
    const response = await api.get<{success: boolean; data: Project[]}>(`/api/projects${queryString ? `?${queryString}` : ''}`);
    return response.data.data;
  },

  // Get single project by slug
  getProjectBySlug: async (slug: string) => {
    const response = await api.get<{success: boolean; data: Project}>(`/api/projects/slug/${slug}`);
    return response.data.data;
  },

  // Create project (admin only)
  createProject: async (projectData: Partial<Project>) => {
    const response = await api.post<{success: boolean; data: Project}>('/api/projects', projectData);
    return response.data.data;
  },

  // Update project (admin only)
  updateProject: async (id: string, projectData: Partial<Project>) => {
    const response = await api.put<{success: boolean; data: Project}>(`/api/projects/${id}`, projectData);
    return response.data.data;
  },

  // Delete project (admin only)
  deleteProject: async (id: string) => {
    const response = await api.delete(`/api/projects/${id}`);
    return response.data;
  },

  // Reorder projects (admin only)
  reorderProjects: async (projectIds: string[]) => {
    const response = await api.patch('/api/projects/reorder', { projectIds });
    return response.data;
  },
};
