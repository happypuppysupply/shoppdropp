import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const auth = {
  register: (email: string, plan: string = 'payg') => 
    api.post('/auth/register', { email, plan }),
  login: (email: string) => 
    api.post('/auth/login', { email }),
};

// Stores
export const stores = {
  list: () => api.get('/stores'),
  create: (name: string, url: string) => 
    api.post('/stores', { name, url }),
  get: (id: string) => api.get(`/stores/${id}`),
  saveCredentials: (id: string, type: string, credentials: any) =>
    api.post(`/stores/${id}/credentials`, { type, credentials }),
  getCredentials: (id: string) => api.get(`/stores/${id}/credentials`),
};

// Workers
export const workers = {
  list: () => api.get('/workers'),
  getStatus: (id: string) => api.get(`/workers/${id}/status`),
};

// Stripe
export const stripe = {
  createCheckout: (plan: string) => 
    api.post('/stripe/checkout', { plan }),
  getSubscription: () => 
    api.get('/stripe/subscription'),
};

// AI
export const ai = {
  configure: (provider: string, model: string, apiKey: string) =>
    api.post('/ai/config', { provider, model, apiKey }),
  getConfig: () =>
    api.get('/ai/config'),
};