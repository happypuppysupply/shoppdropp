'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Store, Plus, ExternalLink, Settings, Sparkles, LogOut, User, Brain, Target, RefreshCw, TrendingUp, MessageCircle, Play, Pause, CheckCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
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

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, signOut } = useAuth()
  const [stores, setStores] = useState<StoreData[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedStore, setSelectedStore] = useState<StoreData | null>(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth')
    }
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) {
      loadStores()
    }
  }, [isAuthenticated])

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

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
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
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#111118] to-[#0a0a0f]">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <span className="font-bold text-lg">
                <span className="text-white">SHOPP</span>
                <span className="text-pink-400">DROPP</span>
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center">
                  <User size={16} className="text-violet-400" />
                </div>
                <span className="hidden sm:block">{user?.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
              >
                <LogOut size={16} />
                <span className="hidden sm:block">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">{user?.email?.split('@')[0] || 'User'}</span>
            </h1>
            <p className="text-slate-400 mt-1">Manage your AI-powered Shopify stores and integrations.</p>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Demo Store Card - Happy Puppy Supply */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-[#111118] border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-violet-500/20 to-pink-500/20 rounded-xl flex items-center justify-center border border-violet-500/20">
                        <Store className="w-7 h-7 text-violet-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-white">Happy Puppy Supply Store</h3>
                        <p className="text-sm text-slate-400">yourname.myshopify.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                        Active
                      </span>
                      <button className="p-2 text-slate-400 hover:text-violet-400 transition-colors">
                        <Settings className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Store Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="text-xs text-slate-400 mb-1">Products</p>
                      <p className="text-xl font-bold text-white">156</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="text-xs text-slate-400 mb-1">Today's Sales</p>
                      <p className="text-xl font-bold text-emerald-400">$1,247</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="text-xs text-slate-400 mb-1">AI Tasks</p>
                      <p className="text-xl font-bold text-violet-400">4</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Agent Section */}
              <Card className="bg-[#111118] border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-violet-500/20 rounded-lg flex items-center justify-center">
                      <Brain className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Automation Agent</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        Running 4 tasks
                      </p>
                    </div>
                  </div>

                  {/* AI Tasks */}
                  <div className="space-y-3">
                    {[
                      { icon: Target, name: 'Product Research', status: 'running', desc: 'Scanning CJ dropshipping for trending pet supplies' },
                      { icon: RefreshCw, name: 'Catalog Sync', status: 'running', desc: 'Syncing 156 products with inventory updates' },
                      { icon: TrendingUp, name: 'Price Optimization', status: 'running', desc: 'Adjusting prices based on competitor analysis' },
                      { icon: MessageCircle, name: 'Meta Ads Sync', status: 'pending', desc: 'Updating Facebook/Instagram campaign budgets' },
                    ].map((task, idx) => (
                      <div key={task.name} className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          task.status === 'running' ? 'bg-violet-500/20' : 'bg-amber-500/20'
                        }`}>
                          <task.icon className={`w-5 h-5 ${
                            task.status === 'running' ? 'text-violet-400' : 'text-amber-400'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">{task.name}</span>
                            {task.status === 'running' ? (
                              <span className="text-[10px] px-2 py-0.5 bg-violet-500/20 text-violet-300 rounded-full">Running</span>
                            ) : (
                              <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-full">Pending</span>
                            )}
                          </div>
                          <p className="text-sm text-slate-400">{task.desc}</p>
                        </div>
                        <button className="p-2 text-slate-500 hover:text-white transition-colors">
                          {task.status === 'running' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Integration Status */}
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Connected: Shopify, CJ Dropshipping, OpenRouter
                      <span className="text-slate-600">• GitHub, Vercel pending setup</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              <Card className="bg-[#111118] border-white/10">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-white mb-4">Add a Real Store</h3>
                  <p className="text-sm text-slate-400 mb-4">
                    This demo shows what your dashboard will look like. Connect your actual Shopify store to activate AI automation.
                  </p>
                  <Button 
                    className="w-full bg-gradient-to-r from-violet-600 to-pink-600"
                    onClick={() => setShowAddModal(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Connect Store
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
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
      </main>

      {showAddModal && (
        <AddStoreModal onClose={() => setShowAddModal(false)} onStoreAdded={loadStores} />
      )}

      {selectedStore && (
        <StoreDetailsModal store={selectedStore} onClose={() => setSelectedStore(null)} />
      )}
    </div>
  )
}