import api from '../config/api';

export interface UploadResponse {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
}

export const uploadService = {
  // Upload blog image
  uploadBlogImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post<UploadResponse>('/api/upload/blog', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload film poster
  uploadFilmPoster: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post<UploadResponse>('/api/upload/film', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload video thumbnail
  uploadVideoThumbnail: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post<UploadResponse>('/api/upload/video', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload general image
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post<UploadResponse>('/api/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete image by publicId
  deleteImage: async (publicId: string) => {
    const response = await api.delete(`/api/upload/${publicId}`);
    return response.data;
  },
};
