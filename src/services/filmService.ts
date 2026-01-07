import api from '../config/api';
import { Film } from '../types';

export const filmService = {
  // Get all films
  getAllFilms: async (category?: string, featured?: boolean) => {
    const params = new URLSearchParams();

    if (category) {
      params.append('category', category);
    }

    if (featured !== undefined) {
      params.append('featured', featured.toString());
    }

    const queryString = params.toString();
    const response = await api.get<{success: boolean; data: Film[]}>(`/api/films${queryString ? `?${queryString}` : ''}`);
    return response.data.data;
  },

  // Get single film by slug
  getFilmBySlug: async (slug: string) => {
    const response = await api.get<{success: boolean; data: Film}>(`/api/films/slug/${slug}`);
    return response.data.data;
  },

  // Create film (admin only)
  createFilm: async (filmData: Partial<Film>) => {
    const response = await api.post<{success: boolean; data: Film}>('/api/films', filmData);
    return response.data.data;
  },

  // Update film (admin only)
  updateFilm: async (id: string, filmData: Partial<Film>) => {
    const response = await api.put<{success: boolean; data: Film}>(`/api/films/${id}`, filmData);
    return response.data.data;
  },

  // Delete film (admin only)
  deleteFilm: async (id: string) => {
    const response = await api.delete(`/api/films/${id}`);
    return response.data;
  },

  // Reorder films (admin only)
  reorderFilms: async (filmIds: string[]) => {
    const response = await api.patch('/api/films/reorder', { filmIds });
    return response.data;
  },
};
