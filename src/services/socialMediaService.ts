import api from '../config/api';

export interface SocialMediaLink {
  _id: string;
  platform: string;
  username: string;
  url: string;
  icon: string;
  enabled: boolean;
  order: number;
  stats?: {
    followers?: number;
    lastUpdated?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSocialMediaData {
  platform: string;
  username: string;
  url: string;
  icon?: string;
  enabled?: boolean;
  order?: number;
}

export interface SocialMediaResponse {
  success: boolean;
  data: SocialMediaLink[];
}

export interface SingleSocialMediaResponse {
  success: boolean;
  message: string;
  data: SocialMediaLink;
}

export const socialMediaService = {
  // Get public social media links
  getPublicLinks: async (): Promise<SocialMediaLink[]> => {
    const response = await api.get<SocialMediaResponse>('/api/social-media/public');
    return response.data.data;
  },

  // Get all social media links (admin)
  getAllLinks: async (): Promise<SocialMediaLink[]> => {
    const response = await api.get<SocialMediaResponse>('/api/social-media');
    return response.data.data;
  },

  // Create social media link
  createLink: async (data: CreateSocialMediaData): Promise<SocialMediaLink> => {
    const response = await api.post<SingleSocialMediaResponse>('/api/social-media', data);
    return response.data.data;
  },

  // Update social media link
  updateLink: async (id: string, data: Partial<CreateSocialMediaData>): Promise<SocialMediaLink> => {
    const response = await api.put<SingleSocialMediaResponse>(`/api/social-media/${id}`, data);
    return response.data.data;
  },

  // Delete social media link
  deleteLink: async (id: string): Promise<void> => {
    await api.delete(`/api/social-media/${id}`);
  },

  // Reorder links
  reorderLinks: async (linkIds: string[]): Promise<SocialMediaLink[]> => {
    const response = await api.patch<SocialMediaResponse>('/api/social-media/reorder', { linkIds });
    return response.data.data;
  },
};
