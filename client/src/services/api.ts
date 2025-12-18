import axios, { type AxiosInstance, type AxiosError } from 'axios';
import type {
  LoginCredentials,
  SignupData,
  AuthResponse,
  EventsResponse,
  EventResponse,
} from '../types';
import { getToken } from '../utils/token';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Remove Content-Type header for FormData - let Axios set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle connection refused (backend not running)
    if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      const customError = new Error('Cannot connect to server. Please make sure the backend server is running on http://localhost:5000');
      return Promise.reject(customError);
    }

    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: async (data: SignupData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/signup', data);
    return response.data;
  },

  login: async (data: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },
};

// Events API
export const eventsAPI = {
  getAll: async (): Promise<EventsResponse> => {
    const response = await api.get<EventsResponse>('/events');
    return response.data;
  },

  getOne: async (id: string): Promise<EventResponse> => {
    const response = await api.get<EventResponse>(`/events/${id}`);
    return response.data;
  },

  create: async (formData: FormData): Promise<EventResponse> => {
    // Don't set Content-Type - let Axios handle multipart/form-data with boundary
    const response = await api.post<EventResponse>('/events', formData);
    return response.data;
  },

  update: async (id: string, formData: FormData): Promise<EventResponse> => {
    // Don't set Content-Type - let Axios handle multipart/form-data with boundary
    const response = await api.put<EventResponse>(`/events/${id}`, formData);
    return response.data;
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

  rsvp: async (id: string): Promise<EventResponse> => {
    const response = await api.post<EventResponse>(`/events/${id}/rsvp`);
    return response.data;
  },

  cancelRsvp: async (id: string): Promise<EventResponse> => {
    const response = await api.post<EventResponse>(`/events/${id}/cancel`);
    return response.data;
  },

  generateDescription: async (data: { title: string; location: string; date?: string; capacity?: number }): Promise<{ success: boolean; description: string }> => {
    const response = await api.post<{ success: boolean; description: string }>('/events/generate-description', data);
    return response.data;
  },
};

export default api;

