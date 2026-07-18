'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Store, 
  ChevronRight, 
  ChevronDown, 
  Plus,
  LayoutDashboard,
  ShoppingBag,
  MessageCircle,
  Brain,
  Code2,
  Triangle,
  Settings,
  ArrowLeft,
  Sparkles,
  LogOut,
  User,
  Bot
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { AddStoreModal } from './AddStoreModal'

interface StoreData {
  id: string
  name: string
  url: string
  status: 'pending' | 'provisioning' | 'active' | 'error'
  worker_id: string | null
}

interface StoreContextType {
  selectedStore: string | null
  selectedPage: string
  selectStore: (storeId: string | null) => void
  selectPage: (page: string) => void
  stores: StoreData[]
  refreshStores: () => Promise<void>
}

const StoreContext = createContext<StoreContextType | null>(null)

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) throw new Error('useStore must be used within StoreLayout')
  return context
}

const STORE_PAGES = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'ai-agent', label: 'AI Agent', icon: Bot },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function StoreLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, signOut } = useAuth()
  const [stores, setStores] = useState<StoreData[]>([])
  const [selectedStore, setSelectedStore] = useState<string | null>(null)
  const [selectedPage, setSelectedPage] = useState('overview')
  const [showAddModal, setShowAddModal] = useState(false)

  // Auth check - redirect to home if not authenticated
  useEffect(() => {
    if (isLoading) return
    
    if (!isAuthenticated) {
      router.push('/')
    }
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) {
      loadStores()
      
      // Subscribe to realtime store updates
      const subscription = supabase
        .channel('stores-changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'stores' },
          () => {
            loadStores()
          }
        )
        .subscribe()
      
      return () => {
        subscription.unsubscribe()
      }
    }
  }, [isAuthenticated])

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

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const currentStore = selectedStore === 'demo' 
    ? { id: 'demo', name: 'Demo Store', url: 'https://demo-store.myshopify.com', status: 'active', worker_id: 'demo-worker-123' }
    : stores.find(s => s.id === selectedStore)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0f] via-[#111118] to-[#0a0a0f]">
        <div className="flex items-center gap-3 text-white/50">
          <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <StoreContext.Provider value={{
      selectedStore,
      selectedPage,
      selectStore: setSelectedStore,
      selectPage: setSelectedPage,
      stores,
      refreshStores: loadStores
    }}>
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#111118] to-[#0a0a0f] flex">
        {/* Sidebar */}
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

          {/* Sidebar Content */}
          {selectedStore && currentStore ? (
            /* Store Selected - Show Subpages */
            <>
              <div className="p-4 border-b border-white/10">
                <button
                  onClick={() => setSelectedStore(null)}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Stores
                </button>
                <div className="mt-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                    <Store className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">{currentStore.name}</p>
                    <p className="text-xs text-slate-500 truncate">{currentStore.url.replace('https://', '')}</p>
                  </div>
                </div>
              </div>
              
              <div className="py-2">
                {STORE_PAGES.map((page) => {
                  const Icon = page.icon
                  const isSelected = selectedPage === page.id
                  
                  return (
                    <button
                      key={page.id}
                      onClick={() => setSelectedPage(page.id)}
                      className={`w-full px-4 py-3 flex items-center gap-3 text-sm hover:bg-white/5 transition-colors ${
                        isSelected ? 'text-violet-400 bg-violet-500/10 border-l-2 border-violet-500' : 'text-slate-400 border-l-2 border-transparent'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {page.label}
                    </button>
                  )
                })}
              </div>
            </>
          ) : (
            /* No Store Selected - Show Store List */
            <>
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Your Stores</h2>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => setShowAddModal(true)}
                    className="h-8 w-8 p-0 text-violet-400 hover:text-violet-300 hover:bg-violet-500/10"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Demo Store Card */}
              <div className="px-4 py-2">
                <button
                  onClick={() => {
                    setSelectedStore('demo')
                    setSelectedPage('overview')
                  }}
                  className="w-full p-3 rounded-xl bg-gradient-to-r from-violet-500/20 to-pink-500/20 border border-violet-500/30 hover:border-violet-500/50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-violet-500/30 flex items-center justify-center">
                      <Store className="w-5 h-5 text-violet-300" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white">Demo Store</p>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-violet-500/30 text-violet-300">DEMO</span>
                      </div>
                      <p className="text-xs text-slate-400">See how it works</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-violet-400" />
                  </div>
                </button>
              </div>

              <div className="py-2">
                {stores.length === 0 ? (
                  <div className="px-4 py-6 text-center">
                    <p className="text-xs text-slate-500 mb-3">No real stores yet</p>
                    <Button 
                      size="sm" 
                      onClick={() => setShowAddModal(true)}
                      className="bg-violet-600 text-xs"
                    >
                      Connect Real Store
                    </Button>
                  </div>
                ) : (
                  stores.map((store) => (
                    <button
                      key={store.id}
                      onClick={() => {
                        setSelectedStore(store.id)
                        setSelectedPage('overview')
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-violet-500"
                    >
                      <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                        <Store className="w-4 h-4 text-violet-400" />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-medium text-white truncate">{store.name}</p>
                        <p className="text-xs text-slate-500 truncate">{store.url.replace('https://', '')}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    </button>
                  ))
                )}
              </div>
            </>
          )}

          {/* User Section */}
          <div className="p-4 border-t border-white/10 mt-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center">
                  <User size={16} className="text-violet-400" />
                </div>
                <span className="text-xs truncate max-w-[100px]">{user?.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>

        {showAddModal && (
          <AddStoreModal 
            onClose={() => setShowAddModal(false)} 
            onStoreAdded={() => {
              loadStores()
              setShowAddModal(false)
            }} 
          />
        )}
      </div>
    </StoreContext.Provider>
  )
}
