'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Store, Settings, MoreVertical, Cpu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/app/hooks/useAuth'
import { api } from '@/lib/api'

interface StoreData {
  id: string
  name: string
  url: string
  status: 'active' | 'pending' | 'inactive'
  worker_id: string | null
  created_at: string
  logo_url?: string
  niche?: string
}

export default function StoresGridPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const [stores, setStores] = useState<StoreData[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      loadStores()
    }
  }, [isAuthenticated])

  async function loadStores() {
    try {
      const data = await api.stores.list()
      // Add demo stores if no stores exist
      if (data.length === 0) {
        setStores([
          {
            id: '000fdf9a-74b4-4069-b441-2a000b4f3b08',
            name: 'Happy Puppy Supply',
            url: 'https://happypuppysupply.com',
            status: 'active',
            worker_id: null,
            created_at: new Date().toISOString(),
            niche: 'Pet Supplies'
          },
          {
            id: '111fdf9a-74b4-4069-b441-2a000b4f3b09',
            name: 'Beauty Glow Co',
            url: 'https://beautyglowco.com',
            status: 'active',
            worker_id: 'a1234567-1234-1234-1234-123456789012',
            created_at: new Date().toISOString(),
            niche: 'Beauty & Personal Care'
          }
        ])
      } else {
        setStores(data)
      }
    } catch (error) {
      console.error('Failed to load stores:', error)
      // Show demo stores on error
      setStores([
        {
          id: '000fdf9a-74b4-4069-b441-2a000b4f3b08',
          name: 'Happy Puppy Supply',
          url: 'https://happypuppysupply.com',
          status: 'active',
          worker_id: null,
          created_at: new Date().toISOString(),
          niche: 'Pet Supplies'
        },
        {
          id: '111fdf9a-74b4-4069-b441-2a000b4f3b09',
          name: 'Beauty Glow Co',
          url: 'https://beautyglowco.com',
          status: 'active',
          worker_id: 'a1234567-1234-1234-1234-123456789012',
          created_at: new Date().toISOString(),
          niche: 'Beauty & Personal Care'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleStoreClick(storeId: string) {
    router.push(`/dashboard?storeId=${storeId}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    router.push('/auth')
    return null
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#111118]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-pink-500/20 flex items-center justify-center">
              <Store className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Your Stores</h1>
              <p className="text-sm text-slate-400">Manage all your Shopify stores</p>
            </div>
          </div>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-violet-600 to-pink-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Store
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : stores.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 flex items-center justify-center">
              <Store className="w-10 h-10 text-slate-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No stores yet</h2>
            <p className="text-slate-400 mb-6">Create your first store to get started</p>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-violet-600 to-pink-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Store
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store, index) => (
              <div
                key={store.id}
                onClick={() => handleStoreClick(store.id)}
                className={`group cursor-pointer rounded-xl overflow-hidden transition-all hover:scale-[1.02] ${
                  index % 2 === 0 ? 'bg-[#1a1a24]' : 'bg-[#15151c]'
                } border border-white/5 hover:border-violet-500/30`}
              >
                {/* Store Image/Placeholder */}
                <div className="aspect-[4/3] bg-gradient-to-br from-slate-700/50 to-slate-800/50 flex items-center justify-center relative">
                  {store.logo_url ? (
                    <img 
                      src={store.logo_url} 
                      alt={store.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <Store className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                      <span className="text-xs text-slate-500">No logo</span>
                    </div>
                  )}
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      store.status === 'active' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : store.status === 'pending'
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                    }`}>
                      {store.status}
                    </span>
                  </div>
                  {/* VPS Status */}
                  {store.worker_id && (
                    <div className="absolute bottom-3 right-3">
                      <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
                        <Cpu className="w-4 h-4 text-violet-400" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Store Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-violet-400 transition-colors">
                    {store.name}
                  </h3>
                  <p className="text-sm text-slate-400 mb-2">{store.niche || 'General Store'}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 truncate max-w-[200px]">
                      {store.url}
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        // Open settings for this store
                      }}
                      className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Store Modal */}
      {showCreateModal && (
        <CreateStoreModal 
          onClose={() => setShowCreateModal(false)} 
          onCreated={() => {
            setShowCreateModal(false)
            loadStores()
          }}
        />
      )}
    </div>
  )
}

// Create Store Modal Component
function CreateStoreModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    niche: '',
    logo: null as File | null
  })
  const [creating, setCreating] = useState(false)

  const niches = [
    'Pet Supplies',
    'Beauty & Personal Care',
    'Fitness & Health',
    'Home & Garden',
    'Tech & Gadgets',
    'Fashion & Accessories',
    'Baby & Kids',
    'Food & Beverage',
    'Other'
  ]

  async function handleCreate() {
    setCreating(true)
    try {
      await api.stores.create(formData.name, formData.url)
      onCreated()
    } catch (error) {
      console.error('Failed to create store:', error)
      alert('Failed to create store')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#111118] border border-white/10 rounded-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Create New Store</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Store Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Happy Puppy Supply"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Shopify URL</label>
              <input
                type="text"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="yourstore.myshopify.com"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Niche</label>
              <div className="grid grid-cols-2 gap-2">
                {niches.map((niche) => (
                  <button
                    key={niche}
                    onClick={() => setFormData({ ...formData, niche })}
                    className={`p-2 rounded-lg border text-sm text-left transition-colors ${
                      formData.niche === niche
                        ? 'bg-violet-500/20 border-violet-500/50 text-violet-400'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    {niche}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={onClose} className="border-white/20">
                Cancel
              </Button>
              <Button 
                onClick={() => setStep(2)}
                disabled={!formData.name || !formData.url}
                className="bg-gradient-to-r from-violet-600 to-pink-600"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Store Logo (Optional)</label>
              <div className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center hover:border-violet-500/30 transition-colors cursor-pointer">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                  <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm text-slate-400">Click to upload logo</p>
                <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 2MB</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setStep(1)} className="border-white/20">
                Back
              </Button>
              <Button 
                onClick={handleCreate}
                disabled={creating}
                className="bg-gradient-to-r from-violet-600 to-pink-600"
              >
                {creating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Store
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
