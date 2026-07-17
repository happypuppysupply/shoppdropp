'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Store, Cpu } from 'lucide-react'

interface StoreItem {
  id: string
  name: string
  url: string
  status: 'active' | 'pending'
  worker_id: string | null
  niche: string
}

const DEMO_STORES: StoreItem[] = [
  {
    id: 'store-1',
    name: 'Happy Puppy Supply',
    url: 'happypuppysupply.com',
    status: 'active',
    worker_id: null,
    niche: 'Pet Supplies'
  },
  {
    id: 'store-2',
    name: 'Beauty Glow Co',
    url: 'beautyglowco.com',
    status: 'active',
    worker_id: 'worker-123',
    niche: 'Beauty & Personal Care'
  }
]

export default function StoresPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="min-h-screen bg-[#0a0a0f]" />
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="border-b border-white/10 bg-[#111118]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Store className="w-6 h-6 text-violet-400" />
            <h1 className="text-xl font-bold">Your Stores</h1>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-pink-600 rounded-lg text-sm font-medium">
            <Plus className="w-4 h-4" />
            Create Store
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEMO_STORES.map((store) => (
            <div
              key={store.id}
              onClick={() => router.push('/dashboard')}
              className="cursor-pointer rounded-xl overflow-hidden bg-[#1a1a24] border border-white/5 hover:border-violet-500/30 transition-all hover:scale-[1.02]"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-slate-700/30 to-slate-800/30 flex items-center justify-center relative">
                <Store className="w-12 h-12 text-slate-600" />
                {store.worker_id && (
                  <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
                    <Cpu className="w-4 h-4 text-violet-400" />
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{store.name}</h3>
                <p className="text-sm text-slate-400 mb-2">{store.niche}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{store.url}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
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
