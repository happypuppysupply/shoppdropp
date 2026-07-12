// API client for ShoppDropp backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://shoppdropp-api.onrender.com'

export const api = {
  async getToken(): Promise<string | null> {
    return localStorage.getItem('token')
  },

  async request(endpoint: string, options: RequestInit = {}) {
    const token = await this.getToken()
    const url = `${API_URL}/api${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    return response.json()
  },

  // Auth
  auth: {
    register: (email: string, plan: string = 'payg') => 
      api.request('/auth/register', { method: 'POST', body: JSON.stringify({ email, plan }) }),
    login: (email: string) => 
      api.request('/auth/login', { method: 'POST', body: JSON.stringify({ email }) }),
  },

  // Stores
  stores: {
    list: () => api.request('/stores'),
    create: (name: string, url: string) => 
      api.request('/stores', { method: 'POST', body: JSON.stringify({ name, url }) }),
    get: (id: string) => api.request(`/stores/${id}`),
    saveCredentials: (id: string, type: string, credentials: any) =>
      api.request(`/stores/${id}/credentials`, { method: 'POST', body: JSON.stringify({ type, credentials }) }),
    getCredentials: (id: string) => api.request(`/stores/${id}/credentials`),
  },

  // Workers
  workers: {
    list: () => api.request('/workers'),
    getStatus: (id: string) => api.request(`/workers/${id}/status`),
  },

  // AI Provider
  ai: {
    configure: (provider: string, model: string, apiKey: string) =>
      api.request('/ai/configure', { method: 'POST', body: JSON.stringify({ provider, model, apiKey }) }),
    getConfig: () => api.request('/ai/config'),
  },

  // Stripe
  stripe: {
    createCheckout: (plan: string) => 
      api.request('/stripe/checkout', { method: 'POST', body: JSON.stringify({ plan }) }),
    getSubscription: () => api.request('/stripe/subscription'),
  },
}

export default api