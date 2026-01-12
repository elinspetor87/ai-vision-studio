import api from '../config/api';

export interface Settings {
  _id: string;
  quote: {
    mainText: string;
    highlightedText: string;
  };
  bio: string;
  showcases: {
    projectsCompleted: string;
    yearsExperience: string;
    happyClients: string;
    aiRenders: string;
  };
  aboutSection?: {
    sectionTitle: string;
    heading: string;
    headingHighlight: string;
    paragraph1: string;
    paragraph2: string;
    stats: {
      filmsShows: string;
      yearsExp: string;
    };
    skills: {
      icon: string;
      label: string;
      years: string;
    }[];
    tools: string[];
  };
  profileImage?: {
    url: string;
    publicId: string;
    alt: string;
  };
  logo?: {
    url: string;
    publicId: string;
    alt: string;
  };
  logoText?: string;
  favicon?: {
    url: string;
    publicId: string;
  };
  contactEmail?: string;
  heroSection?: {
    line1: string;
    line2: string;
    line3: string;
    tagline: string;
    description: string;
    animation: {
      animationType: 'fadeSlide' | 'typewriter' | 'rotateScale' | 'glitch';
      speed: number;
      delay: number;
      typewriterCursor?: boolean;
      glitchIntensity?: number;
    };
  };
  emailSettings?: {
    host: string;
    port: number;
    user: string;
    pass: string;
    secure: boolean;
    fromEmail: string;
  };
  apiKeys?: {
    key: string;
    label: string;
    lastUsed?: string;
    createdAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export const settingsService = {
  // Get settings
  getSettings: async () => {
    const response = await api.get<{ success: boolean; data: Settings }>('/api/settings');
    return response.data.data;
  },

  // Update settings (admin only)
  updateSettings: async (settingsData: Partial<Settings>) => {
    const response = await api.put<{ success: boolean; data: Settings }>('/api/settings', settingsData);
    return response.data.data;
  },

  // Generate API Key
  generateApiKey: async (label: string) => {
    const response = await api.post<{ success: boolean; data: { key: string; label: string } }>('/api/settings/keys', { label });
    return response.data.data;
  },

  // Revoke API Key
  revokeApiKey: async (key: string) => {
    const response = await api.delete<{ success: boolean; data: any }>(`/api/settings/keys/${key}`);
    return response.data.data;
  },
};
