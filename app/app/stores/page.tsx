'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Store, Plus, ExternalLink, Settings } from 'lucide-react'
import { api } from '@/lib/api'
import { AddStoreModal } from '@/components/dashboard/AddStoreModal'
import { StoreDetailsModal } from '@/components/dashboard/StoreDetailsModal'

interface StoreData {
  id: string
  name: string
  url: string
  status: 'pending' | 'provisioning' | 'active' | 'error'
  worker_id: string | null
  created_at: string
}

export default function StoresPage() {
  const [stores, setStores] = useState<StoreData[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedStore, setSelectedStore] = useState<StoreData | null>(null)

  useEffect(() => {
    loadStores()
  }, [])

  async function loadStores() {
    try {
      const data = await api.stores.list()
      setStores(data)
    } catch (error) {
      console.error('Failed to load stores:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'pending':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Stores</h1>
          <p className="text-slate-400 mt-1">Connect and manage your Shopify stores</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-violet-600 to-pink-600"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Connect Store
        </Button>
      </div>

      {loading ? (
        <Card className="bg-[#111118] border-white/10">
          <CardContent className="py-12 text-center">
            <div className="animate-pulse text-slate-400">Loading stores...</div>
          </CardContent>
        </Card>
      ) : stores.length === 0 ? (
        <Card className="bg-[#111118] border-white/10">
          <CardContent className="py-12 text-center">
            <Store className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-4">No stores connected. Connect your Shopify store to get started.</p>
            <Button 
              className="bg-gradient-to-r from-violet-600 to-pink-600"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Connect Your First Store
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {stores.map((store) => (
            <Card key={store.id} className="bg-[#111118] border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-violet-500/20 rounded-lg flex items-center justify-center">
                      <Store className="w-6 h-6 text-violet-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{store.name}</h3>
                      <a
                        href={store.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-slate-400 hover:text-violet-400 flex items-center gap-1"
                      >
                        {store.url}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(store.status)}`}>
                      {store.status}
                    </span>
                    <button
                      onClick={() => setSelectedStore(store)}
                      className="p-2 text-slate-400 hover:text-violet-400 transition-colors"
                    >
                      <Settings className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {store.worker_id && (
                  <div className="mt-4 ml-16 flex items-center gap-2 text-sm text-green-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    AI Worker active
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showAddModal && (
        <AddStoreModal onClose={() => setShowAddModal(false)} onStoreAdded={loadStores} />
      )}

      {selectedStore && (
        <StoreDetailsModal store={selectedStore} onClose={() => setSelectedStore(null)} />
      )}
    </div>
  )
}