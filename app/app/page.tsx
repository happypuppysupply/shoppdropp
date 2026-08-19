'use client'

import { useState, useEffect } from 'react'
import { Store, Sparkles, TrendingUp, Eye, MousePointer, DollarSign, CheckCircle, AlertCircle, Bot } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StoreIntegrations } from '@/components/dashboard/StoreIntegrations'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface StoreData {
  id: string
  name: string
  url: string
  status: string
  worker_id: string | null
}

interface IntegrationsState {
  shopify: { connected: boolean; store?: string }
  meta_ads: { connected: boolean; account?: string }
  cj_dropshipping: { connected: boolean; apiKey?: string }
  ai: { connected: boolean; provider?: string; model?: string }
  github: { connected: boolean; user?: string }
  vercel: { connected: boolean; team?: string }
}

export default function Dashboard() {
  const [store, setStore] = useState<StoreData | null>(null)
  const [integrations, setIntegrations] = useState<IntegrationsState>({
    shopify: { connected: false },
    meta_ads: { connected: false },
    cj_dropshipping: { connected: false },
    ai: { connected: false },
    github: { connected: false },
    vercel: { connected: false },
  })
  const [loading, setLoading] = useState(true)
  const [activeModal, setActiveModal] = useState<string | null>(null)

  useEffect(() => {
    loadStoreAndIntegrations()
  }, [])

  async function loadStoreAndIntegrations() {
    try {
      // Get first store
      const { data: stores } = await supabase.from('stores').select('*').limit(1)
      
      if (stores && stores.length > 0) {
        setStore(stores[0])
        await loadIntegrations(stores[0].id)
      }
    } catch (error) {
      console.error('Failed to load store:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadIntegrations(storeId: string) {
    try {
      // Check for Happy Puppy store (demo data)
      const { data: storeData } = await supabase.from('stores').select('name').eq('id', storeId).single()
      
      if (storeData?.name === 'Happy Puppy Supply') {
        setIntegrations({
          shopify: { connected: true, store: 'Happy Puppy Supply' },
          meta_ads: { connected: true, account: 'act_123456789' },
          cj_dropshipping: { connected: true, apiKey: 'CJ5604***' },
          ai: { connected: true, provider: 'OpenRouter', model: 'Kimi K2.5' },
          github: { connected: true, user: 'happypuppy-dev' },
          vercel: { connected: true, team: 'happypuppy' },
        })
        return
      }

      // Load real integrations
      const { data: creds } = await supabase
        .from('store_credentials')
        .select('*')
        .eq('store_id', storeId)

      const { data: aiConfig } = await supabase.from('ai_configs').select('*').single()
      const { data: githubConfig } = await supabase.from('user_credentials').select('*').eq('type', 'github').single()
      const { data: vercelConfig } = await supabase.from('user_credentials').select('*').eq('type', 'vercel').single()

      setIntegrations({
        shopify: { connected: !!creds?.find((c: any) => c.type === 'shopify') },
        meta_ads: { connected: !!creds?.find((c: any) => c.type === 'meta_ads') },
        cj_dropshipping: { connected: !!creds?.find((c: any) => c.type === 'cj_dropshipping') },
        ai: { connected: !!aiConfig, provider: aiConfig?.provider, model: aiConfig?.model },
        github: { connected: !!githubConfig },
        vercel: { connected: !!vercelConfig },
      })
    } catch (error) {
      console.error('Failed to load integrations:', error)
    }
  }

  const handleConnect = (type: string) => {
    setActiveModal(type)
    // For now, just log - modals would be implemented separately
    console.log('Connect:', type)
  }

  const handleEdit = (type: string, credentials: any) => {
    setActiveModal(type)
    console.log('Edit:', type, credentials)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!store) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-violet-500/20 flex items-center justify-center">
          <Store className="w-8 h-8 text-violet-400" />
        </div>
        <h1 className="text-2xl font-bold text-white">Welcome to ShoppDropp</h1>
        <p className="text-slate-400 text-center max-w-md">
          You don't have any stores yet. Create your first store to get started with AI-powered dropshipping.
        </p>
        <Link href="/app/stores/new">
          <Button className="bg-violet-600 hover:bg-violet-500">
            Create Your First Store
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Demo Banner */}
      {store.name === 'Happy Puppy Supply' && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-violet-500/20 to-pink-500/20 border border-violet-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-500/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-violet-300" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Demo Store</h3>
              <p className="text-sm text-slate-400">
                This is a demo showing all features. Connect a real store to use actual integrations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Store Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-violet-500/20 rounded-xl flex items-center justify-center">
          <Store className="w-8 h-8 text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{store.name}</h1>
          <a 
            href={store.url || '#'} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-slate-400 hover:text-violet-400 transition-colors"
          >
            {store.url?.replace('https://', '') || 'No URL configured'}
          </a>
        </div>
      </div>

      {/* Integrations */}
      <StoreIntegrations
        storeId={store.id}
        integrations={integrations}
        onConnectShopify={() => handleConnect('shopify')}
        onConnectMeta={() => handleConnect('meta')}
        onConnectCJ={() => handleConnect('cj')}
        onConfigureAI={() => handleConnect('ai')}
        onConnectGitHub={() => handleConnect('github')}
        onConnectVercel={() => handleConnect('vercel')}
        onEditShopify={(creds) => handleEdit('shopify', creds)}
        onEditMeta={(creds) => handleEdit('meta', creds)}
        onEditCJ={(creds) => handleEdit('cj', creds)}
        onEditAI={(creds) => handleEdit('ai', creds)}
        onEditGitHub={(creds) => handleEdit('github', creds)}
        onEditVercel={(creds) => handleEdit('vercel', creds)}
      />

      {/* Meta Ads Performance Section */}
      {integrations.meta_ads.connected && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Meta Ads Performance
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* AI Queued Ads */}
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-white flex items-center gap-2">
                  <Bot className="w-4 h-4 text-blue-400" />
                  AI Queued Ads
                </h3>
                <span className="px-2 py-1 rounded-full bg-blue-500/30 text-blue-300 text-xs">3 Pending</span>
              </div>
              <div className="space-y-2">
                <div className="p-2 rounded-lg bg-white/5 flex items-center justify-between">
                  <span className="text-sm text-slate-300">Summer Collection Promo</span>
                  <span className="text-xs text-slate-500">Created 2h ago</span>
                </div>
                <div className="p-2 rounded-lg bg-white/5 flex items-center justify-between">
                  <span className="text-sm text-slate-300">Flash Sale Retargeting</span>
                  <span className="text-xs text-slate-500">Created 5h ago</span>
                </div>
                <div className="p-2 rounded-lg bg-white/5 flex items-center justify-between">
                  <span className="text-sm text-slate-300">Abandoned Cart Recovery</span>
                  <span className="text-xs text-slate-500">Created 8h ago</span>
                </div>
              </div>
              <Button size="sm" className="w-full mt-3 bg-blue-600/50 hover:bg-blue-600">
                Review & Launch
              </Button>
            </div>

            {/* Current Performance */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                Current Performance
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">Impressions</span>
                  </div>
                  <span className="text-white font-medium">47.2K</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400">
                    <MousePointer className="w-4 h-4" />
                    <span className="text-sm">CTR</span>
                  </div>
                  <span className="text-green-400 font-medium">3.8% ↑</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">ROAS</span>
                  </div>
                  <span className="text-green-400 font-medium">4.2x ↑</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">Spend</span>
                  </div>
                  <span className="text-white font-medium">$1,247</span>
                </div>
              </div>
            </div>

            {/* Actionable Items */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                Actionable Items
              </h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-300">Increase budget on &quot;Summer Sale&quot; campaign (+23% ROAS)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-300">Pause underperforming ad set (0.8% CTR)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-300">Test new creative for retargeting audience</span>
                </div>
              </div>
              <Button size="sm" className="w-full mt-3 bg-amber-600/50 hover:bg-amber-600">
                Apply Suggestions
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/app/ai-agent">
          <div className="p-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-pink-500/10 border border-violet-500/20 hover:border-violet-500/40 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">AI Agent</h3>
                <p className="text-xs text-slate-400">Chat with your automation assistant</p>
              </div>
            </div>
          </div>
        </Link>
        
        <Link href="/app/products">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Store className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">Products</h3>
                <p className="text-xs text-slate-400">Manage your product catalog</p>
              </div>
            </div>
          </div>
        </Link>
        
        <Link href="/app/ads">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">Ads</h3>
                <p className="text-xs text-slate-400">Manage advertising campaigns</p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
