const VPS_API_URL = process.env.VPS_API_URL || 'http://localhost:3001'
const VPS_API_KEY = process.env.VPS_API_KEY

interface VPSApiOptions {
  method?: string
  body?: any
  headers?: Record<string, string>
}

export async function vpsApi(endpoint: string, options: VPSApiOptions = {}) {
  const { method = 'GET', body, headers = {} } = options

  const res = await fetch(`${VPS_API_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(VPS_API_KEY && { 'X-API-Key': VPS_API_KEY }),
      ...headers,
    },
    ...(body && { body: JSON.stringify(body) }),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`VPS API error: ${res.status} ${error}`)
  }

  return res.json()
}

// Common VPS API endpoints
export const vps = {
  // Project management
  projects: {
    list: () => vpsApi('/projects'),
    get: (id: string) => vpsApi(`/projects/${id}`),
    create: (data: any) => vpsApi('/projects', { method: 'POST', body: data }),
    update: (id: string, data: any) => vpsApi(`/projects/${id}`, { method: 'PATCH', body: data }),
    delete: (id: string) => vpsApi(`/projects/${id}`, { method: 'DELETE' }),
  },

  // Store operations
  stores: {
    list: () => vpsApi('/stores'),
    create: (data: any) => vpsApi('/stores', { method: 'POST', body: data }),
    get: (id: string) => vpsApi(`/stores/${id}`),
  },

  // Worker/Jobs
  workers: {
    list: () => vpsApi('/workers'),
    run: (type: string, config: any) => vpsApi('/jobs', { method: 'POST', body: { type, config } }),
    getJob: (id: string) => vpsApi(`/jobs/${id}`),
  },

  // Ads
  ads: {
    campaigns: () => vpsApi('/ads/campaigns'),
    create: (data: any) => vpsApi('/ads/campaigns', { method: 'POST', body: data }),
  },

  // Products
  products: {
    list: () => vpsApi('/products'),
    sync: (storeId: string) => vpsApi(`/products/sync`, { method: 'POST', body: { storeId } }),
  },

  // Health check
  health: () => vpsApi('/health'),
}
