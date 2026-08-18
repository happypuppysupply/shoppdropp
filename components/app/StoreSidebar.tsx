'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Store, 
  ChevronRight, 
  Plus,
  Sparkles,
  Rocket
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

interface StoreData {
  id: string
  name: string
  url: string
  status: 'pending' | 'provisioning' | 'active' | 'error'
}

interface StoreSidebarProps {
  selectedStore: string | null
  onSelectStore: (storeId: string | null) => void
}

export function StoreSidebar({ selectedStore, onSelectStore }: StoreSidebarProps) {
  const [stores, setStores] = useState<StoreData[]>([])
  const pathname = usePathname()

  useEffect(() => {
    loadStores()
  }, [])

  async function loadStores() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error loading stores:', error)
        return
      }
      setStores(data || [])
    } catch (error) {
      console.error('Failed to load stores:', error)
    }
  }

  const isOnboardingPage = pathname === '/app/onboarding'

  return (
    <div className="w-64 bg-[#0a0a0f] border-r border-white/10 h-screen overflow-y-auto flex-shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg">
            <span className="text-white">SHOPP</span>
            <span className="text-pink-400">DROPP</span>
          </span>
        </div>
      </div>

      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Your Stores</h2>
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 w-8 p-0 text-violet-400 hover:text-violet-300 hover:bg-violet-500/10"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Demo Store Card */}
      <div className="px-4 py-2">
        <button
          onClick={() => onSelectStore('demo')}
          className={`w-full p-3 rounded-xl border transition-all duration-300 ${
            selectedStore === 'demo'
              ? 'bg-gradient-to-r from-violet-500/20 to-pink-500/20 border-violet-500/50 shadow-lg shadow-violet-500/10'
              : 'bg-white/5 border-white/10 hover:border-violet-500/30 hover:bg-white/10'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
              selectedStore === 'demo' ? 'bg-violet-500/30' : 'bg-white/10'
            }`}>
              <Store className={`w-5 h-5 ${selectedStore === 'demo' ? 'text-violet-300' : 'text-slate-400'}`} />
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <p className={`text-sm font-medium ${selectedStore === 'demo' ? 'text-white' : 'text-slate-300'}`}>Demo Store</p>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-violet-500/30 text-violet-300">DEMO</span>
              </div>
              <p className="text-xs text-slate-400">See how it works</p>
            </div>
            <ChevronRight className={`w-4 h-4 transition-colors ${selectedStore === 'demo' ? 'text-violet-400' : 'text-slate-500'}`} />
          </div>
        </button>
      </div>

      {/* Real Stores */}
      <div className="py-2">
        {stores.length === 0 ? (
          <div className="px-4 py-6 text-center">
            <p className="text-xs text-slate-500 mb-3">No real stores yet</p>
            <Button 
              size="sm" 
              className="bg-violet-600 text-xs"
            >
              Connect Real Store
            </Button>
          </div>
        ) : (
          stores.map((store) => (
            <button
              key={store.id}
              onClick={() => onSelectStore(store.id)}
              className={`w-full px-4 py-3 flex items-center gap-3 transition-all duration-300 border-l-2 ${
                selectedStore === store.id
                  ? 'bg-violet-500/10 border-violet-500'
                  : 'hover:bg-white/5 border-transparent hover:border-violet-500/50'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                selectedStore === store.id ? 'bg-violet-500/30' : 'bg-violet-500/20'
              }`}>
                <Store className={`w-4 h-4 ${selectedStore === store.id ? 'text-violet-300' : 'text-violet-400'}`} />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className={`text-sm font-medium truncate ${selectedStore === store.id ? 'text-white' : 'text-slate-300'}`}>{store.name}</p>
                <p className="text-xs text-slate-500 truncate">{store.url.replace('https://', '')}</p>
              </div>
              <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-colors ${
                selectedStore === store.id ? 'text-violet-400' : 'text-slate-400'
              }`} />
            </button>
          ))
        )}
      </div>

      {/* Onboarding CTA */}
      {!isOnboardingPage && stores.length > 0 && (
        <div className="px-4 py-3">
          <Link
            href={`/app/onboarding?storeId=${stores[0].id}&storeName=${encodeURIComponent(stores[0].name)}`}
          >
            <div className="p-3 rounded-xl bg-gradient-to-r from-violet-500/20 to-pink-500/20 border border-violet-500/30 hover:border-violet-500/50 transition-all cursor-pointer group">
              <div className="flex items-center gap-2">
                <Rocket className="w-4 h-4 text-violet-400 group-hover:text-violet-300" />
                <span className="text-sm font-medium text-white">Complete Setup</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">6 steps • 3 minutes</p>
            </div>
          </Link>
        </div>
      )}
    </div>
  )
}
