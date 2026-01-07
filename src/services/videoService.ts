import api from '../config/api';
import { VideoProject } from '../types';

export const videoService = {
  // Get all video projects
  getAllVideos: async (category?: string, featured?: boolean) => {
    const params = new URLSearchParams();

    if (category) {
      params.append('category', category);
    }

    if (featured !== undefined) {
      params.append('featured', featured.toString());
    }

    const queryString = params.toString();
    const response = await api.get<{success: boolean; data: VideoProject[]}>(`/api/videos${queryString ? `?${queryString}` : ''}`);
    return response.data.data;
  },

  // Get single video by slug
  getVideoBySlug: async (slug: string) => {
    const response = await api.get<{success: boolean; data: VideoProject}>(`/api/videos/slug/${slug}`);
    return response.data.data;
  },

  // Create video (admin only)
  createVideo: async (videoData: Partial<VideoProject>) => {
    const response = await api.post<{success: boolean; data: VideoProject}>('/api/videos', videoData);
    return response.data.data;
  },

  // Update video (admin only)
  updateVideo: async (id: string, videoData: Partial<VideoProject>) => {
    const response = await api.put<{success: boolean; data: VideoProject}>(`/api/videos/${id}`, videoData);
    return response.data.data;
  },

  // Delete video (admin only)
  deleteVideo: async (id: string) => {
    const response = await api.delete(`/api/videos/${id}`);
    return response.data;
  },

  // Reorder videos (admin only)
  reorderVideos: async (videoIds: string[]) => {
    const response = await api.patch('/api/videos/reorder', { videoIds });
    return response.data;
  },
};
