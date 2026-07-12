'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Store, Plus, ExternalLink, Settings, Sparkles, LogOut, User, 
  Bot, Send, Search, Database, DollarSign, Megaphone,
  ChevronLeft, LayoutGrid, Cpu, Cog
} from 'lucide-react'
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

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, signOut } = useAuth()
  const [stores, setStores] = useState<StoreData[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedStore, setSelectedStore] = useState<StoreData | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'ai-agent' | 'settings'>('ai-agent')
  
  // Chat state
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'assistant', content: 'Hi! I\'m your AI Agent. I can help you manage your store, analyze ads, suggest products, and more. What would you like to do?' }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

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

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput
    }
    
    setChatMessages(prev => [...prev, userMessage])
    setChatInput('')
    setIsTyping(true)
    
    setTimeout(() => {
      const responses = [
        "I've analyzed your store data. Your Meta Ads are performing 23% better than last week. Would you like me to optimize the budget?",
        "I found 3 trending products in your niche. Should I add them to your queue for review?",
        "Your Shopify inventory shows 2 items running low. I've created a restock alert for you.",
        "I can see your AI Worker completed the catalog sync successfully. Everything is up to date!"
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: randomResponse
      }
      
      setChatMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  const demoStore: StoreData = {
    id: 'demo',
    name: 'Happy Puppy Supply Store',
    url: 'yourname.myshopify.com',
    status: 'active',
    worker_id: 'a4841dfd-4ab3-40bc-aaad-4e3b8e941363',
    created_at: new Date().toISOString()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050508]">
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

  const store = stores[0] || demoStore

  return (
    <div className="flex h-screen bg-[#050508]">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-[#0a0a0f] border-r border-white/5 flex flex-col">
        {/* Back to Stores */}
        <div className="p-4 border-b border-white/5">
          <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Back to Stores
          </button>
        </div>

        {/* Store Info */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-500/20 rounded-lg flex items-center justify-center">
              <Store className="w-5 h-5 text-violet-400" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-white text-sm truncate">{store.name}</h3>
              <p className="text-xs text-slate-500 truncate">{store.url}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              activeTab === 'overview'
                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('ai-agent')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              activeTab === 'ai-agent'
                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Cpu className="w-4 h-4" />
            AI Agent
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              activeTab === 'settings'
                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Cog className="w-4 h-4" />
            Settings
          </button>
        </nav>

        {/* User */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <div className="w-8 h-8 bg-violet-500/20 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-violet-400" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm text-white truncate">{user?.email?.split('@')[0] || 'User'}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email || ''}</p>
            </div>
            <LogOut className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'ai-agent' && (
            <div className="space-y-6 max-w-4xl">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Cpu className="w-6 h-6 text-violet-400" />
                  <div>
                    <h1 className="text-2xl font-bold text-white">AI Agent</h1>
                    <p className="text-sm text-slate-400">Your autonomous dropshipping assistant</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-green-400">Worker Active</span>
                </div>
              </div>

              {/* VPS Worker Card */}
              <div className="p-6 rounded-xl bg-gradient-to-r from-violet-500/10 to-pink-500/10 border border-violet-500/30">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-violet-500/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">VPS Worker #{store.worker_id?.slice(-6) || 'DEMO-01'}</h3>
                    <p className="text-sm text-slate-400">Hetzner Cloud • CX21 Instance</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      <span>IP: 116.203.XXX.XXX</span>
                      <span>•</span>
                      <span>Uptime: 3d 12h</span>
                      <span>•</span>
                      <span>CPU: 12%</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                      Restart
                    </Button>
                    <Button variant="outline" size="sm" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                      Stop
                    </Button>
                  </div>
                </div>
              </div>

              {/* Task Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-[#111118] border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Search className="w-4 h-4 text-blue-400" />
                    </div>
                    <h4 className="font-medium text-white">Product Research</h4>
                  </div>
                  <p className="text-sm text-slate-400 mb-3">Find trending products using AI analysis</p>
                  <Button size="sm" className="w-full bg-blue-600/50 hover:bg-blue-600">
                    Run Task
                  </Button>
                </div>

                <div className="p-4 rounded-lg bg-[#111118] border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <Database className="w-4 h-4 text-green-400" />
                    </div>
                    <h4 className="font-medium text-white">Catalog Sync</h4>
                  </div>
                  <p className="text-sm text-slate-400 mb-3">Sync products with Shopify</p>
                  <Button size="sm" className="w-full bg-green-600/50 hover:bg-green-600">
                    Run Task
                  </Button>
                </div>

                <div className="p-4 rounded-lg bg-[#111118] border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-orange-400" />
                    </div>
                    <h4 className="font-medium text-white">Price Optimization</h4>
                  </div>
                  <p className="text-sm text-slate-400 mb-3">AI-powered pricing adjustments</p>
                  <Button size="sm" className="w-full bg-orange-600/50 hover:bg-orange-600">
                    Run Task
                  </Button>
                </div>

                <div className="p-4 rounded-lg bg-[#111118] border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
                      <Megaphone className="w-4 h-4 text-pink-400" />
                    </div>
                    <h4 className="font-medium text-white">Meta Ads Sync</h4>
                  </div>
                  <p className="text-sm text-slate-400 mb-3">Sync campaigns and analytics</p>
                  <Button size="sm" className="w-full bg-pink-600/50 hover:bg-pink-600">
                    Run Task
                  </Button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="p-4 rounded-lg bg-black/20 border border-white/5">
                <h4 className="font-medium text-white mb-3">Recent Activity</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-3 text-slate-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Catalog sync completed</span>
                    <span className="text-slate-600 ml-auto">2 min ago</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span>Product research started</span>
                    <span className="text-slate-600 ml-auto">15 min ago</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400">
                    <div className="w-2 h-2 bg-violet-500 rounded-full" />
                    <span>Worker provisioned</span>
                    <span className="text-slate-600 ml-auto">1 hour ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center gap-3">
                <LayoutGrid className="w-6 h-6 text-violet-400" />
                <h1 className="text-2xl font-bold text-white">Overview</h1>
              </div>
              
              <Card className="bg-[#111118] border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-violet-500/20 to-pink-500/20 rounded-xl flex items-center justify-center border border-violet-500/20">
                        <Store className="w-7 h-7 text-violet-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-white">{store.name}</h3>
                        <p className="text-sm text-slate-400">{store.url}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                        Active
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
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
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center gap-3">
                <Cog className="w-6 h-6 text-violet-400" />
                <h1 className="text-2xl font-bold text-white">Settings</h1>
              </div>
              <div className="p-6 bg-[#111118] border border-white/10 rounded-xl">
                <p className="text-slate-400">Store settings coming soon...</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Chat Panel */}
        <div className="w-80 border-l border-white/10 flex flex-col bg-[#0a0a0f]">
          <div className="p-4 border-b border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h3 className="font-medium text-white text-sm">AI Agent Chat</h3>
              <p className="text-xs text-slate-500">Always here to help</p>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((message) => (
              <div key={message.id} className={`flex gap-2 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' ? 'bg-violet-500/20' : 'bg-blue-500/20'
                }`}>
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-violet-400" />
                  ) : (
                    <Bot className="w-4 h-4 text-blue-400" />
                  )}
                </div>
                <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                  message.role === 'user' 
                    ? 'bg-violet-500/20 text-white' 
                    : 'bg-white/10 text-slate-300'
                }`}>
                  {message.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-blue-400" />
                </div>
                <div className="bg-white/10 p-3 rounded-lg text-sm text-slate-400 flex items-center gap-2">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask anything..."
                className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              />
              <Button 
                size="sm" 
                onClick={handleSendMessage}
                disabled={!chatInput.trim()}
                className="bg-violet-600 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
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
