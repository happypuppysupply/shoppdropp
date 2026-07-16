'use client'

import { useState, useEffect } from 'react'
import { X, Store, Loader2, Trash2, Brain } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { StoreIntegrations } from './StoreIntegrations'
import { ShopifyConnectModal } from './ShopifyConnectModal'
import { MetaAdsConnectModal } from './MetaAdsConnectModal'
import { AutoDSConnectModal } from './AutoDSConnectModal'
import { AIProviderModal } from './AIProviderModal'
import { GitHubConnectModal } from './GitHubConnectModal'
import { VercelConnectModal } from './VercelConnectModal'

interface StoreData {
  id: string
  name: string
  url: string
  status: string
  worker_id: string | null
  created_at: string
}

interface StoreDetailsModalProps {
  store: StoreData
  onClose: () => void
}

export function StoreDetailsModal({ store, onClose }: StoreDetailsModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [integrations, setIntegrations] = useState({
    shopify: { connected: false },
    meta_ads: { connected: false },
    autods: { connected: false },
    cj_dropshipping: { connected: false },
    ai: { connected: false },
    github: { connected: false },
    vercel: { connected: false },
    rapidapi: { connected: false, apis: [] as string[] },
  })
  
  // Modal states
  const [showShopifyModal, setShowShopifyModal] = useState(false)
  const [showMetaModal, setShowMetaModal] = useState(false)
  const [showAutoDSModal, setShowAutoDSModal] = useState(false)
  const [showCJModal, setShowCJModal] = useState(false)
  const [showAIModal, setShowAIModal] = useState(false)
  const [showGitHubModal, setShowGitHubModal] = useState(false)
  const [showVercelModal, setShowVercelModal] = useState(false)

  useEffect(() => {
    loadIntegrations()
  }, [store.id])

  async function loadIntegrations() {
    try {
      // Load credentials from API
      const [creds, aiConfig, githubConfig, vercelConfig] = await Promise.all([
        api.stores.getCredentials(store.id).catch(() => []),
        api.ai.getConfig().catch(() => ({ configured: false })),
        api.request('/user/github').catch(() => ({ connected: false })),
        api.request('/user/vercel').catch(() => ({ connected: false })),
      ])

      const shopifyCreds = creds.find((c: any) => c.type === 'shopify')
      const metaCreds = creds.find((c: any) => c.type === 'meta_ads')
      const autodsCreds = creds.find((c: any) => c.type === 'autods')
      const cjCreds = creds.find((c: any) => c.type === 'cj_dropshipping')
      const rapidapiCreds = creds.find((c: any) => c.type === 'rapidapi')

      setIntegrations({
        shopify: { connected: !!shopifyCreds },
        meta_ads: { connected: !!metaCreds },
        autods: { connected: !!autodsCreds },
        cj_dropshipping: { connected: !!cjCreds },
        ai: { connected: aiConfig.configured },
        github: { connected: githubConfig.connected },
        vercel: { connected: vercelConfig.connected },
        rapidapi: { 
          connected: !!rapidapiCreds, 
          apis: rapidapiCreds?.metadata?.apis || []
        },
      })
    } catch (error) {
      console.error('Failed to load integrations:', error)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this store? This cannot be undone.')) {
      return
    }
    setLoading(true)
    try {
      await api.request(`/stores/${store.id}`, { method: 'DELETE' })
      onClose()
      window.location.reload()
    } catch (err: any) {
      setError(err.message || 'Failed to delete store')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-4xl bg-[#111118] rounded-2xl border border-white/10 shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#111118] border-b border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-violet-500/20 rounded-xl">
                <Store className="w-6 h-6 text-violet-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{store.name}</h2>
                <a 
                  href={store.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-slate-400 hover:text-violet-400"
                >
                  {store.url}
                </a>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300">
              {error}
            </div>
          )}

          {/* Integrations */}
          <StoreIntegrations
            storeId={store.id}
            storeName={store.name}
            integrations={integrations}
            onConnectShopify={() => setShowShopifyModal(true)}
            onConnectMeta={() => setShowMetaModal(true)}
            onConnectAutoDS={() => setShowAutoDSModal(true)}
            onConnectCJDropshipping={() => setShowCJModal(true)}
            onConfigureAI={() => setShowAIModal(true)}
            onConnectGitHub={() => setShowGitHubModal(true)}
            onConnectVercel={() => setShowVercelModal(true)}
          />

          {/* AI Worker Section */}
          <div className="p-4 bg-violet-500/10 border border-violet-500/30 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <Brain className="w-5 h-5 text-violet-400" />
              <h3 className="font-semibold text-white">AI Worker Status</h3>
            </div>
            <p className="text-sm text-slate-300 mb-4">
              {store.worker_id 
                ? 'Your AI worker is provisioned and ready to automate tasks for this store.'
                : 'Connect required integrations (Shopify + AI Provider) to activate your AI worker.'
              }
            </p>
            {store.worker_id ? (
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Worker ID: {store.worker_id.slice(0, 8)}... | Status: Active
              </div>
            ) : (
              <Button 
                disabled={!integrations.shopify.connected || !integrations.ai.connected}
                className="bg-violet-600 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Request AI Worker'}
              </Button>
            )}
          </div>

          {/* Danger Zone */}
          <div className="pt-6 border-t border-white/10">
            <h3 className="text-red-400 font-semibold mb-4 flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Danger Zone
            </h3>
            <Button
              variant="outline"
              onClick={handleDelete}
              disabled={loading}
              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete Store'}
            </Button>
          </div>
        </div>
      </div>

      {/* Integration Modals */}
      {showShopifyModal && (
        <ShopifyConnectModal
          storeId={store.id}
          onClose={() => setShowShopifyModal(false)}
          onConnected={loadIntegrations}
        />
      )}
      {showMetaModal && (
        <MetaAdsConnectModal
          storeId={store.id}
          onClose={() => setShowMetaModal(false)}
          onConnected={loadIntegrations}
        />
      )}
      {showAutoDSModal && (
        <AutoDSConnectModal
          storeId={store.id}
          onClose={() => setShowAutoDSModal(false)}
          onConnected={loadIntegrations}
        />
      )}
      {showCJModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="w-full max-w-md bg-[#111118] rounded-2xl border border-white/10 p-6">
            <h3 className="text-xl font-bold text-white mb-2">Connect CJ Dropshipping</h3>
            <p className="text-slate-400 text-sm mb-4">
              Enter your CJ Dropshipping API credentials to enable product sourcing.
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 block mb-1">API Key</label>
                <input 
                  type="text" 
                  placeholder="Enter your CJ API key"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 block mb-1">Email</label>
                <input 
                  type="email" 
                  placeholder="your@email.com"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setShowCJModal(false)}
                className="flex-1 border-white/20 text-white"
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-orange-600 hover:bg-orange-700"
                onClick={() => {
                  setShowCJModal(false)
                  loadIntegrations()
                }}
              >
                Connect
              </Button>
            </div>
          </div>
        </div>
      )}
      {showAIModal && (
        <AIProviderModal
          onClose={() => setShowAIModal(false)}
          onConfigured={loadIntegrations}
        />
      )}
      {showGitHubModal && (
        <GitHubConnectModal
          onClose={() => setShowGitHubModal(false)}
          onConnected={loadIntegrations}
        />
      )}
      {showVercelModal && (
        <VercelConnectModal
          onClose={() => setShowVercelModal(false)}
          onConnected={loadIntegrations}
        />
      )}
    </div>
  )
}