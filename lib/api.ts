// API client for ShoppDropp backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://shoppdropp-api.onrender.com'

// Import supabase to get session
import { createClient } from '@supabase/supabase-js'

// Singleton Supabase client for browser
let supabaseClient: any = null

function getSupabaseClient() {
  if (supabaseClient) return supabaseClient
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  
  supabaseClient = createClient(url, key, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    }
  })
  return supabaseClient
}

export const api = {
  async getToken(): Promise<string | null> {
    // Try localStorage first (for our JWT)
    const localToken = localStorage.getItem('token')
    if (localToken) return localToken
    
    // Fallback to Supabase session
    const supabase = getSupabaseClient()
    if (!supabase) return null
    
    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token || null
  },

  // Set token manually (called by AuthProvider on login)
  setToken(token: string | null) {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
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

  // VPS Management
  vps: {
    provision: (workerId: string, envVars?: Record<string, string>) =>
      api.request(`/vps/provision/${workerId}`, { method: 'POST', body: JSON.stringify({ envVars }) }),
    getStatus: (workerId: string) => api.request(`/vps/status/${workerId}`),
    getMetrics: (workerId: string) => api.request(`/vps/metrics/${workerId}`),
    reboot: (workerId: string) => api.request(`/vps/reboot/${workerId}`, { method: 'POST' }),
    destroy: (workerId: string) => api.request(`/vps/${workerId}`, { method: 'DELETE' }),
    getServerTypes: () => api.request('/vps/server-types'),
    getLocations: () => api.request('/vps/locations'),
  },

  // AI Provider
  ai: {
    configure: (provider: string, model: string, apiKey: string) =>
      api.request('/ai/configure', { method: 'POST', body: JSON.stringify({ provider, model, apiKey }) }),
    getConfig: () => api.request('/ai/config'),
    // AI Chat with OpenRouter
    chat: (message: string, conversationHistory: any[] = []) =>
      api.request('/ai-chat/chat', { method: 'POST', body: JSON.stringify({ message, conversation_history: conversationHistory }) }),
    getContext: () => api.request('/ai-chat/context'),
  },

  // Stripe
  stripe: {
    createCheckout: (plan: string) => 
      api.request('/stripe/checkout', { method: 'POST', body: JSON.stringify({ plan }) }),
    getSubscription: () => api.request('/stripe/subscription'),
  },
}

export default api