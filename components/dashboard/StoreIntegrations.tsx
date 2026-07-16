'use client'

import { useState } from 'react'
import { 
  Store, MessageCircle, ShoppingBag, Brain, Code2, Triangle, 
  Link2, CheckCircle, AlertCircle, ChevronRight, Zap, Cloud
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface StoreIntegrationsProps {
  storeId: string
  storeName: string
  onConnectShopify: () => void
  onConnectMeta: () => void
  onConnectAutoDS: () => void
  onConnectCJDropshipping: () => void
  onConfigureAI: () => void
  onConnectGitHub: () => void
  onConnectVercel: () => void
  integrations: {
    shopify?: { connected: boolean }
    meta_ads?: { connected: boolean }
    autods?: { connected: boolean }
    cj_dropshipping?: { connected: boolean }
    ai?: { connected: boolean }
    github?: { connected: boolean }
    vercel?: { connected: boolean }
    rapidapi?: { connected: boolean; apis?: string[] }
  }
}

const getIntegrations = (isHappyPuppy: boolean) => [
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
  ...(isHappyPuppy ? [{
    id: 'cj_dropshipping' as const,
    name: 'CJ Dropshipping',
    description: 'Product sourcing & fulfillment',
    icon: Cloud,
    color: 'orange',
    bgColor: 'bg-orange-500/20',
    textColor: 'text-orange-400',
    required: false,
  }] : [{
    id: 'autods' as const,
    name: 'AutoDS',
    description: 'Product sourcing & fulfillment',
    icon: ShoppingBag,
    color: 'orange',
    bgColor: 'bg-orange-500/20',
    textColor: 'text-orange-400',
    required: false,
  }]),
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

const RAPIDAPI_INTEGRATION = {
  id: 'rapidapi' as const,
  name: 'RapidAPI',
  description: 'Access 40,000+ APIs for data enrichment',
  icon: Zap,
  color: 'cyan',
  bgColor: 'bg-cyan-500/20',
  textColor: 'text-cyan-400',
  required: false,
}

const HANDLERS: Record<string, string> = {
  shopify: 'onConnectShopify',
  meta_ads: 'onConnectMeta',
  autods: 'onConnectAutoDS',
  cj_dropshipping: 'onConnectCJDropshipping',
  ai: 'onConfigureAI',
  github: 'onConnectGitHub',
  vercel: 'onConnectVercel',
  rapidapi: 'onConnectRapidAPI',
}

export function StoreIntegrations({ 
  storeId,
  storeName,
  onConnectShopify,
  onConnectMeta,
  onConnectAutoDS,
  onConnectCJDropshipping,
  onConfigureAI,
  onConnectGitHub,
  onConnectVercel,
  integrations 
}: StoreIntegrationsProps) {
  const isHappyPuppy = storeName.toLowerCase().includes('happy puppy')
  const INTEGRATIONS = getIntegrations(isHappyPuppy)
  
  const handlers: Record<string, () => void> = {
    shopify: onConnectShopify,
    meta_ads: onConnectMeta,
    autods: onConnectAutoDS,
    cj_dropshipping: onConnectCJDropshipping,
    ai: onConfigureAI,
    github: onConnectGitHub,
    vercel: onConnectVercel,
  }

  const getStatus = (id: string) => {
    const integration = integrations[id as keyof typeof integrations]
    return integration?.connected || false
  }

  const getDetails = (id: string) => {
    const integration = integrations[id as keyof typeof integrations]
    if (!integration?.connected) return 'Not connected'
    if (id === 'rapidapi') {
      const rapidapi = integration as { connected: boolean; apis?: string[] }
      if (rapidapi.apis && rapidapi.apis.length > 0) {
        return `${rapidapi.apis.length} APIs connected`
      }
    }
    return 'Connected'
  }

  const connectedCount = Object.values(integrations).filter(i => i?.connected).length
  const totalCount = INTEGRATIONS.length + 1 // +1 for RapidAPI

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
                <Button
                  size="sm"
                  variant={isConnected ? "outline" : "default"}
                  onClick={handlers[integration.id]}
                  className={isConnected 
                    ? 'border-white/20 text-slate-300 hover:bg-white/5' 
                    : 'bg-gradient-to-r from-violet-600 to-pink-600'
                  }
                >
                  {isConnected ? 'Manage' : 'Connect'}
                  <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          )
        })}
        
        {/* RapidAPI Card */}
        {(() => {
          const isConnected = getStatus('rapidapi')
          const Icon = RAPIDAPI_INTEGRATION.icon
          return (
            <div 
              className={`p-4 rounded-xl border ${
                isConnected 
                  ? 'bg-white/5 border-white/20' 
                  : 'bg-white/[0.02] border-white/10 hover:border-white/20'
              } transition-all`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 ${RAPIDAPI_INTEGRATION.bgColor} rounded-lg`}>
                    <Icon className={`w-5 h-5 ${RAPIDAPI_INTEGRATION.textColor}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-white">{RAPIDAPI_INTEGRATION.name}</h4>
                    </div>
                    <p className="text-xs text-slate-400">{RAPIDAPI_INTEGRATION.description}</p>
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
                  {getDetails('rapidapi')}
                </span>
                <Button
                  size="sm"
                  variant={isConnected ? "outline" : "default"}
                  className={isConnected 
                    ? 'border-white/20 text-slate-300 hover:bg-white/5' 
                    : 'bg-gradient-to-r from-cyan-600 to-blue-600'
                  }
                >
                  {isConnected ? 'Manage' : 'Connect'}
                  <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}