import axios from 'axios';

// Em desenvolvimento, usa o proxy do Vite (URL relativa)
// Em produção, usa a URL completa
const API_BASE_URL = import.meta.env.MODE === 'development'
  ? '' // URL relativa - vai usar o proxy do Vite
  : 'https://ai-vision-studioai-vision-studio-backend.onrender.com';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Redirect to login if needed
    }
    return Promise.reject(error);
  }
);

export default api;
