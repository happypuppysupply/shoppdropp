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
    ai: { connected: false },
    github: { connected: false },
    vercel: { connected: false },
  })
  
  // Modal states
  const [showShopifyModal, setShowShopifyModal] = useState(false)
  const [showMetaModal, setShowMetaModal] = useState(false)
  const [showAutoDSModal, setShowAutoDSModal] = useState(false)
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

      setIntegrations({
        shopify: { connected: !!shopifyCreds },
        meta_ads: { connected: !!metaCreds },
        autods: { connected: !!autodsCreds },
        ai: { connected: aiConfig.configured },
        github: { connected: githubConfig.connected },
        vercel: { connected: vercelConfig.connected },
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
            integrations={integrations}
            onConnectShopify={() => setShowShopifyModal(true)}
            onConnectMeta={() => setShowMetaModal(true)}
            onConnectAutoDS={() => setShowAutoDSModal(true)}
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