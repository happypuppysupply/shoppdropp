'use client'

import { useState } from 'react'
import { 
  Store, MessageCircle, Truck, Brain, Code2, Triangle, 
  CheckCircle, AlertCircle, ChevronRight, Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

interface Credentials {
  [key: string]: any
}

interface StoreIntegrationsProps {
  storeId: string
  onConnectShopify: () => void
  onConnectMeta: () => void
  onConnectCJ: () => void
  onConfigureAI: () => void
  onConnectGitHub: () => void
  onConnectVercel: () => void
  onEditShopify?: (credentials: Credentials) => void
  onEditMeta?: (credentials: Credentials) => void
  onEditCJ?: (credentials: Credentials) => void
  onEditAI?: (credentials: Credentials) => void
  onEditGitHub?: (credentials: Credentials) => void
  onEditVercel?: (credentials: Credentials) => void
  integrations: {
    shopify?: { connected: boolean; store?: string }
    meta_ads?: { connected: boolean; account?: string }
    cj_dropshipping?: { connected: boolean; apiKey?: string }
    ai?: { connected: boolean; provider?: string; model?: string }
    github?: { connected: boolean; user?: string }
    vercel?: { connected: boolean; team?: string }
  }
}

const INTEGRATIONS = [
  {
    id: 'shopify' as const,
    name: 'Shopify',
    description: 'Manage products, orders, inventory',
    icon: Store,
    color: 'green',
    bgColor: 'bg-green-500/20',
    textColor: 'text-green-400',
    required: true,
  },
  {
    id: 'meta_ads' as const,
    name: 'Meta Ads',
    description: 'Manage Facebook & Instagram campaigns',
    icon: MessageCircle,
    color: 'blue',
    bgColor: 'bg-blue-500/20',
    textColor: 'text-blue-400',
    required: false,
  },
  {
    id: 'cj_dropshipping' as const,
    name: 'CJ Dropshipping',
    description: 'Product sourcing & fulfillment',
    icon: Truck,
    color: 'orange',
    bgColor: 'bg-orange-500/20',
    textColor: 'text-orange-400',
    required: false,
  },
  {
    id: 'ai' as const,
    name: 'AI Provider',
    description: 'Power your automation workers',
    icon: Brain,
    color: 'violet',
    bgColor: 'bg-violet-500/20',
    textColor: 'text-violet-400',
    required: true,
  },
  {
    id: 'github' as const,
    name: 'GitHub',
    description: 'Code generation & repo management',
    icon: Code2,
    color: 'gray',
    bgColor: 'bg-white/10',
    textColor: 'text-white',
    required: false,
  },
  {
    id: 'vercel' as const,
    name: 'Vercel',
    description: 'Deploy sites & apps instantly',
    icon: Triangle,
    color: 'white',
    bgColor: 'bg-white/10',
    textColor: 'text-white',
    required: false,
  },
]

export function StoreIntegrations({ 
  storeId, 
  onConnectShopify,
  onConnectMeta,
  onConnectCJ,
  onConfigureAI,
  onConnectGitHub,
  onConnectVercel,
  onEditShopify,
  onEditMeta,
  onEditCJ,
  onEditAI,
  onEditGitHub,
  onEditVercel,
  integrations 
}: StoreIntegrationsProps) {
  const [editingId, setEditingId] = useState<string | null>(null)

  const handlers: Record<string, () => void> = {
    shopify: onConnectShopify,
    meta_ads: onConnectMeta,
    cj_dropshipping: onConnectCJ,
    ai: onConfigureAI,
    github: onConnectGitHub,
    vercel: onConnectVercel,
  }

  const editHandlers: Record<string, ((creds: Credentials) => void) | undefined> = {
    shopify: onEditShopify,
    meta_ads: onEditMeta,
    cj_dropshipping: onEditCJ,
    ai: onEditAI,
    github: onEditGitHub,
    vercel: onEditVercel,
  }

  const getStatus = (id: string) => {
    const integration = integrations[id as keyof typeof integrations]
    return integration?.connected || false
  }

  const getDetails = (id: string) => {
    const integration = integrations[id as keyof typeof integrations]
    if (!integration?.connected) return 'Not connected'
    
    // Return specific details if available
    if (id === 'shopify' && integration.store) return integration.store
    if (id === 'meta_ads' && integration.account) return integration.account
    if (id === 'cj_dropshipping' && integration.apiKey) return integration.apiKey
    if (id === 'ai' && integration.provider) return `${integration.provider} (${integration.model})`
    if (id === 'github' && integration.user) return integration.user
    if (id === 'vercel' && integration.team) return integration.team
    
    return 'Connected'
  }

  const fetchCredentials = async (id: string): Promise<Credentials | null> => {
    try {
      if (id === 'shopify' || id === 'meta_ads' || id === 'cj_dropshipping') {
        const { data, error } = await supabase
          .from('store_credentials')
          .select('credentials')
          .eq('store_id', storeId)
          .eq('type', id)
          .single()
        
        if (error) throw error
        
        const creds = { ...data.credentials }
        if (creds.token) creds.token = '***'
        if (creds.api_key) creds.api_key = '***'
        if (creds.access_token) creds.access_token = '***'
        if (creds.password) creds.password = '***'
        
        return creds
      } else if (id === 'ai') {
        const { data, error } = await supabase
          .from('ai_configs')
          .select('*')
          .single()
        
        if (error) throw error
        
        const creds = { ...data }
        if (creds.api_key) creds.api_key = '***'
        
        return creds
      } else if (id === 'github' || id === 'vercel') {
        const { data, error } = await supabase
          .from('user_credentials')
          .select('credentials')
          .eq('type', id)
          .single()
        
        if (error) throw error
        
        const creds = { ...data.credentials }
        if (creds.token) creds.token = '***'
        
        return creds
      }
    } catch (error) {
      console.error(`Failed to fetch credentials for ${id}:`, error)
    }
    return null
  }

  const handleEdit = async (id: string) => {
    const editHandler = editHandlers[id]
    if (!editHandler) {
      handlers[id]?.()
      return
    }

    setEditingId(id)
    const credentials = await fetchCredentials(id)
    setEditingId(null)
    
    editHandler(credentials || {})
  }

  const connectedCount = Object.values(integrations).filter(i => i?.connected).length
  const totalCount = INTEGRATIONS.length

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Integrations</h3>
          <p className="text-sm text-slate-400">
            {connectedCount} of {totalCount} connected
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all"
              style={{ width: `${(connectedCount / totalCount) * 100}%` }}
            />
          </div>
          <span className="text-sm text-slate-400">
            {Math.round((connectedCount / totalCount) * 100)}%
          </span>
        </div>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {INTEGRATIONS.map((integration) => {
          const isConnected = getStatus(integration.id)
          const isEditing = editingId === integration.id
          const Icon = integration.icon
          
          return (
            <div 
              key={integration.id}
              className={`p-4 rounded-xl border ${
                isConnected 
                  ? 'bg-white/5 border-white/20' 
                  : 'bg-white/[0.02] border-white/10 hover:border-white/20'
              } transition-all`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 ${integration.bgColor} rounded-lg`}>
                    <Icon className={`w-5 h-5 ${integration.textColor}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-white">{integration.name}</h4>
                      {integration.required && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{integration.description}</p>
                  </div>
                </div>
                {isConnected ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-slate-600" />
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`text-xs ${isConnected ? 'text-green-400' : 'text-slate-500'}`}>
                  {getDetails(integration.id)}
                </span>
                {isConnected ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(integration.id)}
                    disabled={isEditing}
                    className='border-white/20 text-slate-300 hover:bg-white/5'
                  >
                    {isEditing ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <>
                        Edit
                        <ChevronRight className="w-3 h-3 ml-1" />
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={handlers[integration.id]}
                    className='bg-gradient-to-r from-violet-600 to-pink-600'
                  >
                    Connect
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
