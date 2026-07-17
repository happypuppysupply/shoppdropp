'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Store, Cpu, ChevronLeft, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface StoreData {
  id: string
  name: string
  url: string
  status: 'active' | 'pending' | 'inactive'
  worker_id: string | null
  niche?: string
}

// Demo stores for testing
const DEMO_STORES: StoreData[] = [
  {
    id: '000fdf9a-74b4-4069-b441-2a000b4f3b08',
    name: 'Happy Puppy Supply',
    url: 'happypuppysupply.com',
    status: 'active',
    worker_id: null,
    niche: 'Pet Supplies'
  },
  {
    id: '111fdf9a-74b4-4069-b441-2a000b4f3b09',
    name: 'Beauty Glow Co',
    url: 'beautyglowco.com',
    status: 'active',
    worker_id: 'a1234567-1234-1234-1234-123456789012',
    niche: 'Beauty & Personal Care'
  }
]

export default function StoresPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [stores] = useState<StoreData[]>(DEMO_STORES)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Simple Header */}
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
          <Button className="bg-gradient-to-r from-violet-600 to-pink-600">
            <Plus className="w-4 h-4 mr-2" />
            Create Store
          </Button>
        </div>
      </header>

      {/* Store Grid */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <div
              key={store.id}
              onClick={() => router.push(`/dashboard?storeId=${store.id}`)}
              className="group cursor-pointer rounded-xl overflow-hidden bg-[#1a1a24] border border-white/5 hover:border-violet-500/30 transition-all hover:scale-[1.02]"
            >
              {/* Image Area */}
              <div className="aspect-[4/3] bg-gradient-to-br from-slate-700/30 to-slate-800/30 flex items-center justify-center relative">
                <div className="text-center">
                  <Store className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                  <span className="text-xs text-slate-500">{store.niche}</span>
                </div>
                
                {/* VPS Badge */}
                {store.worker_id && (
                  <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
                    <Cpu className="w-4 h-4 text-violet-400" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1 group-hover:text-violet-400 transition-colors">
                  {store.name}
                </h3>
                <p className="text-sm text-slate-400 mb-2">{store.niche}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{store.url}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    store.status === 'active' 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-500/20 text-slate-400'
                  }`}>
                    {store.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
