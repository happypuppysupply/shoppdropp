'use client'

import { useState, useEffect } from 'react'
import { X, Store, Key, Check, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'

interface StoreDetailsModalProps {
  store: {
    id: string
    name: string
    url: string
    status: string
  }
  onClose: () => void
}

interface Credentials {
  type: string
  hasCredentials: boolean
}

export function StoreDetailsModal({ store, onClose }: StoreDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'shopify' | 'meta' | 'autods'>('shopify')
  const [credentials, setCredentials] = useState<Credentials[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  // Form states
  const [shopifyKey, setShopifyKey] = useState('')
  const [shopifySecret, setShopifySecret] = useState('')
  const [metaToken, setMetaToken] = useState('')
  const [metaAdAccount, setMetaAdAccount] = useState('')
  const [autodsKey, setAutodsKey] = useState('')

  useEffect(() => {
    fetchCredentials()
  }, [])

  const fetchCredentials = async () => {
    try {
      const data = await api.stores.getCredentials(store.id)
      setCredentials(data)
    } catch (error) {
      console.error('Failed to fetch credentials:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveCredentials = async (type: string, creds: any) => {
    setSaving(true)
    setMessage('')

    try {
      await api.stores.saveCredentials(store.id, type, creds)
      setMessage('Credentials saved successfully!')
      fetchCredentials()
    } catch (error: any) {
      setMessage(error.message || 'Failed to save credentials')
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'shopify' as const, label: 'Shopify', icon: Store },
    { id: 'meta' as const, label: 'Meta Ads', icon: Key },
    { id: 'autods' as const, label: 'AutoDS', icon: Key },
  ]

  const hasCreds = (type: string) => credentials.some(c => c.type === type)

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full max-w-lg bg-[#111118] rounded-2xl border border-white/10 shadow-xl p-6 max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">{store.name}</h2>
            <p className="text-sm text-slate-400">Configure API credentials</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            message.includes('success') 
              ? 'bg-green-500/20 text-green-300' 
              : 'bg-red-500/20 text-red-300'
          }`}>
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white/5 p-1 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isConfigured = hasCreds(tab.id === 'meta' ? 'meta_ads' : tab.id)
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-violet-500/20 text-violet-300'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {isConfigured && <Check className="w-3 h-3 text-green-400" />}
              </button>
            )
          })}
        </div>

        {/* Shopify Tab */}
        {activeTab === 'shopify' && (
          <div className="space-y-4">
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5" />
                <div className="text-sm text-amber-300">
                  <p className="font-medium">Private App Required</p>
                  <p className="mt-1">
                    Create a private app with: read_products, write_products, read_orders, read_inventory
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Admin API Access Token</label>
              <input
                type="password"
                value={shopifyKey}
                onChange={(e) => setShopifyKey(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="shpat_..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">API Secret Key</label>
              <input
                type="password"
                value={shopifySecret}
                onChange={(e) => setShopifySecret(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <Button
              onClick={() => saveCredentials('shopify', { apiKey: shopifyKey, apiSecret: shopifySecret })}
              disabled={saving || !shopifyKey}
              className="w-full bg-gradient-to-r from-violet-600 to-pink-600 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Shopify Credentials'}
            </Button>
          </div>
        )}

        {/* Meta Ads Tab */}
        {activeTab === 'meta' && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                <div className="text-sm text-blue-300">
                  <p className="font-medium">Meta Business Account</p>
                  <p className="mt-1">Generate token from Meta Business Settings with ads_management permission.</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Access Token</label>
              <input
                type="password"
                value={metaToken}
                onChange={(e) => setMetaToken(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="EAA..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Ad Account ID</label>
              <input
                type="text"
                value={metaAdAccount}
                onChange={(e) => setMetaAdAccount(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="act_123456789"
              />
            </div>

            <Button
              onClick={() => saveCredentials('meta_ads', { accessToken: metaToken, adAccountId: metaAdAccount })}
              disabled={saving || !metaToken}
              className="w-full bg-gradient-to-r from-violet-600 to-pink-600 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Meta Ads Credentials'}
            </Button>
          </div>
        )}

        {/* AutoDS Tab */}
        {activeTab === 'autods' && (
          <div className="space-y-4">
            <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-purple-400 mt-0.5" />
                <div className="text-sm text-purple-300">
                  <p className="font-medium">AutoDS API Access</p>
                  <p className="mt-1">Get API key from AutoDS Settings &gt; API &gt; Generate API Key.</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">API Key</label>
              <input
                type="password"
                value={autodsKey}
                onChange={(e) => setAutodsKey(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <Button
              onClick={() => saveCredentials('autods', { apiKey: autodsKey })}
              disabled={saving || !autodsKey}
              className="w-full bg-gradient-to-r from-violet-600 to-pink-600 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save AutoDS Credentials'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}