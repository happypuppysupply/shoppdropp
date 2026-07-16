'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Store, Plus, ExternalLink, Settings, Sparkles, LogOut, User, 
  Bot, Send, Search, Database, DollarSign, Megaphone,
  ChevronLeft, LayoutGrid, Cpu, Cog, Link2, Play, RotateCcw, TrendingUp, Package, Target, BarChart3, ArrowRight
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { api } from '@/lib/api'
import { AddStoreModal } from '@/components/dashboard/AddStoreModal'
import { StoreDetailsModal } from '@/components/dashboard/StoreDetailsModal'
import { StoreIntegrations } from '@/components/dashboard/StoreIntegrations'
import { AIProviderModal } from '@/components/dashboard/AIProviderModal'

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
  const [activeTab, setActiveTab] = useState<'overview' | 'ai-agent' | 'integrations' | 'settings'>('ai-agent')
  
  // Integrations state
  const [integrations, setIntegrations] = useState({
    shopify: { connected: true },
    meta_ads: { connected: false },
    autods: { connected: false },
    cj_dropshipping: { connected: false },
    ai: { connected: true },
    github: { connected: false },
    vercel: { connected: false },
    rapidapi: { connected: false, apis: [] as string[] },
  })
  
  // VPS state
  const [vpsStatus, setVpsStatus] = useState<{
    provisioned: boolean;
    status: string;
    server?: {
      id: number;
      name: string;
      status: string;
      type: string;
      cores: number;
      memory: number;
      disk: number;
      ip: string;
      created: string;
    };
    loading: boolean;
    error?: string;
  }>({
    provisioned: false,
    status: 'idle',
    loading: false,
  })

  // AI Provider modal state
  const [showAIConfig, setShowAIConfig] = useState(false)
  
  // Chat state
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'assistant', content: "Hello! I'm your ShoppDropp AI Agent. I can help you:\n\n• Provision and manage VPS workers\n• Check worker status and metrics\n• Run automation tasks (product research, catalog sync, pricing)\n• Analyze store performance\n\nTry: 'provision a vps' or 'check worker status'" }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth')
    }
  }, [isLoading, isAuthenticated, router])

  // Auto-poll VPS status when provisioning
  useEffect(() => {
    if (!store.worker_id) return
    if (vpsStatus.status === 'provisioning' || vpsStatus.status === 'configuring') {
      const interval = setInterval(loadVpsStatus, 5000) // Poll every 5 seconds
      return () => clearInterval(interval)
    }
  }, [vpsStatus.status, store.worker_id])

  useEffect(() => {
    if (isAuthenticated) {
      loadStores()
    }
  }, [isAuthenticated])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  useEffect(() => {
    if (isAuthenticated && activeTab === 'ai-agent') {
      loadVpsStatus()
    }
  }, [isAuthenticated, activeTab])

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

  async function loadVpsStatus() {
    if (!store.worker_id) return
    
    try {
      setVpsStatus(prev => ({ ...prev, loading: true }))
      const data = await api.vps.getStatus(store.worker_id)
      setVpsStatus({
        provisioned: data.provisioned,
        status: data.status,
        server: data.server,
        loading: false,
      })
    } catch (error) {
      console.error('Failed to load VPS status:', error)
      setVpsStatus(prev => ({ ...prev, loading: false, error: 'Failed to load status' }))
    }
  }

  async function provisionVps() {
    const workerId = store.worker_id
    if (!workerId) return
    
    try {
      setVpsStatus(prev => ({ ...prev, loading: true }))
      await api.vps.provision(workerId)
      // Start polling for status
      const interval = setInterval(async () => {
        try {
          const data = await api.vps.getStatus(workerId)
          setVpsStatus({
            provisioned: data.provisioned,
            status: data.status,
            server: data.server,
            loading: false,
          })
          if (data.status === 'running' || data.status === 'error') {
            clearInterval(interval)
          }
        } catch (e) {
          console.error('Polling error:', e)
        }
      }, 5000)
      
      // Stop polling after 5 minutes
      setTimeout(() => clearInterval(interval), 300000)
    } catch (error) {
      console.error('Failed to provision VPS:', error)
      setVpsStatus(prev => ({ ...prev, loading: false, error: 'Provisioning failed' }))
    }
  }

  async function rebootVps() {
    if (!store.worker_id) return
    
    try {
      await api.vps.reboot(store.worker_id)
      await loadVpsStatus()
    } catch (error) {
      console.error('Failed to reboot VPS:', error)
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
    
    try {
      // Build conversation history (last 10 messages)
      const history = chatMessages
        .slice(-10)
        .map(m => ({ role: m.role, content: m.content }))
      
      // Call real AI API
      const response = await api.ai.chat(chatInput, history)
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response
      }
      
      setChatMessages(prev => [...prev, assistantMessage])
      
      // If a command was executed, refresh VPS status
      if (response.command_executed) {
        if (store.worker_id) {
          loadVpsStatus()
        }
      }
    } catch (error: any) {
      console.error('AI chat error:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${error.message || 'Failed to get AI response. Make sure your AI provider is configured in Settings.'}`
      }
      setChatMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
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
            onClick={() => setActiveTab('integrations')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              activeTab === 'integrations'
                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Link2 className="w-4 h-4" />
            Integrations
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
            <div className="space-y-6 max-w-5xl">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Cpu className="w-6 h-6 text-violet-400" />
                  <div>
                    <h1 className="text-2xl font-bold text-white">AI Workflow</h1>
                    <p className="text-sm text-slate-400">Autonomous dropshipping pipeline</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-violet-600 to-pink-600"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Run Full Workflow
                  </Button>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm text-green-400">Worker Active</span>
                  </div>
                </div>
              </div>

              {/* Hetzner VPS Card */}
              <VPSCard 
                workerId={store.worker_id}
                status={vpsStatus}
                onProvision={provisionVps}
                onReboot={rebootVps}
                onRefresh={loadVpsStatus}
              />

              {/* AI Workflow Pipeline */}
              <div className="relative">
                {/* Connection Line */}
                <div className="absolute left-8 top-16 bottom-16 w-0.5 bg-gradient-to-b from-blue-500 via-orange-500 via-pink-500 to-violet-500 opacity-30" />
                
                <div className="space-y-4">
                  {/* Step 1: Product Research */}
                  <WorkflowStep
                    number={1}
                    title="Product Research"
                    description="AI analyzes trending products, competitor data, and market demand"
                    icon={Search}
                    color="blue"
                    status="completed"
                    details={["Found 12 trending pet products", "3 high-margin opportunities identified"]}
                  />

                  {/* Step 2: CJ Dropshipping Import */}
                  <WorkflowStep
                    number={2}
                    title="CJ Dropshipping Import"
                    description="Import winning products from CJ Dropshipping to Shopify"
                    icon={Package}
                    color="orange"
                    status="in_progress"
                    details={["Connecting to CJ API", "Syncing inventory..."]}
                  />

                  {/* Step 3: Meta Ads Launch */}
                  <WorkflowStep
                    number={3}
                    title="Meta Ads Launch"
                    description="Auto-create and launch Facebook & Instagram campaigns"
                    icon={Target}
                    color="pink"
                    status="pending"
                    details={["Campaign setup ready", "Budget: $50/day allocated"]}
                  />

                  {/* Step 4: Measure Results */}
                  <WorkflowStep
                    number={4}
                    title="Measure Results"
                    description="Track ROAS, conversions, and performance metrics"
                    icon={BarChart3}
                    color="violet"
                    status="pending"
                    details={["Waiting for ad data", "Analytics dashboard ready"]}
                  />

                  {/* Step 5: Iterate & Optimize */}
                  <WorkflowStep
                    number={5}
                    title="Iterate & Optimize"
                    description="AI analyzes performance and suggests improvements"
                    icon={RotateCcw}
                    color="emerald"
                    status="pending"
                    details={["Auto-optimization enabled", "Will adjust based on results"]}
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-4 gap-4">
                <QuickActionCard
                  title="Product Research"
                  icon={Search}
                  color="blue"
                  onClick={() => {}}
                />
                <QuickActionCard
                  title="CJ Import"
                  icon={Package}
                  color="orange"
                  onClick={() => {}}
                />
                <QuickActionCard
                  title="Meta Ads"
                  icon={Megaphone}
                  color="pink"
                  onClick={() => {}}
                />
                <QuickActionCard
                  title="Analytics"
                  icon={TrendingUp}
                  color="violet"
                  onClick={() => {}}
                />
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

          {activeTab === 'integrations' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center gap-3">
                <Link2 className="w-6 h-6 text-violet-400" />
                <h1 className="text-2xl font-bold text-white">Integrations</h1>
              </div>
              <StoreIntegrations
                storeId={store.id}
                storeName={store.name}
                integrations={integrations}
                onConnectShopify={() => {}}
                onConnectMeta={() => {}}
                onConnectAutoDS={() => {}}
                onConnectCJDropshipping={() => {}}
                onConfigureAI={() => setShowAIConfig(true)}
                onConnectGitHub={() => {}}
                onConnectVercel={() => {}}
              />
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

      {showAIConfig && (
        <AIProviderModal 
          onClose={() => setShowAIConfig(false)} 
          onConfigured={() => {
            setShowAIConfig(false)
            // Refresh integrations to show AI as connected
            setIntegrations(prev => ({ ...prev, ai: { connected: true } }))
          }} 
        />
      )}
    </div>
  )
}

// Workflow Step Component
interface WorkflowStepProps {
  number: number
  title: string
  description: string
  icon: React.ElementType
  color: 'blue' | 'orange' | 'pink' | 'violet' | 'emerald'
  status: 'completed' | 'in_progress' | 'pending'
  details: string[]
}

function WorkflowStep({ number, title, description, icon: Icon, color, status, details }: WorkflowStepProps) {
  const colorStyles = {
    blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', gradient: 'from-blue-500 to-blue-600' },
    orange: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30', gradient: 'from-orange-500 to-orange-600' },
    pink: { bg: 'bg-pink-500/20', text: 'text-pink-400', border: 'border-pink-500/30', gradient: 'from-pink-500 to-pink-600' },
    violet: { bg: 'bg-violet-500/20', text: 'text-violet-400', border: 'border-violet-500/30', gradient: 'from-violet-500 to-violet-600' },
    emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30', gradient: 'from-emerald-500 to-emerald-600' },
  }

  const styles = colorStyles[color]

  return (
    <div className={`relative flex gap-4 p-4 rounded-xl border ${status === 'completed' ? 'bg-white/5 border-white/20' : status === 'in_progress' ? 'bg-white/[0.03] border-white/20' : 'bg-transparent border-white/5'} transition-all`}>
      {/* Step Number */}
      <div className="relative z-10 flex-shrink-0">
        <div className={`w-16 h-16 rounded-2xl ${styles.bg} border ${styles.border} flex items-center justify-center`}>
          {status === 'completed' ? (
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : status === 'in_progress' ? (
            <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${styles.gradient} flex items-center justify-center animate-pulse`}>
              <span className="text-white font-bold text-sm">{number}</span>
            </div>
          ) : (
            <span className={`${styles.text} font-bold text-xl`}>{number}</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <Icon className={`w-5 h-5 ${styles.text}`} />
          <h3 className="font-semibold text-white">{title}</h3>
          {status === 'in_progress' && (
            <span className="px-2 py-0.5 rounded-full text-xs bg-violet-500/20 text-violet-400 border border-violet-500/30">
              Running
            </span>
          )}
          {status === 'completed' && (
            <span className="px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/30">
              Done
            </span>
          )}
        </div>
        <p className="text-sm text-slate-400 mb-2">{description}</p>
        
        {/* Details */}
        <div className="space-y-1">
          {details.map((detail, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-slate-500">
              {status === 'in_progress' && idx === details.length - 1 ? (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                  <span className="text-violet-400">{detail}</span>
                </>
              ) : status === 'completed' ? (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span>{detail}</span>
                </>
              ) : (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                  <span>{detail}</span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="flex-shrink-0 flex items-center">
        {status === 'pending' ? (
          <Button size="sm" variant="outline" className="border-white/20 text-slate-400" disabled>
            Waiting
          </Button>
        ) : status === 'in_progress' ? (
          <Button size="sm" className={`bg-gradient-to-r ${styles.gradient}`}>
            <Play className="w-3 h-3 mr-1" />
            Run
          </Button>
        ) : (
          <Button size="sm" variant="outline" className="border-white/20 text-slate-300 hover:bg-white/5">
            <RotateCcw className="w-3 h-3 mr-1" />
            Re-run
          </Button>
        )}
      </div>
    </div>
  )
}

// Quick Action Card Component
interface QuickActionCardProps {
  title: string
  icon: React.ElementType
  color: 'blue' | 'orange' | 'pink' | 'violet' | 'emerald'
  onClick: () => void
}

function QuickActionCard({ title, icon: Icon, color, onClick }: QuickActionCardProps) {
  const colorStyles = {
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', hover: 'hover:bg-blue-500/20' },
    orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', hover: 'hover:bg-orange-500/20' },
    pink: { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/20', hover: 'hover:bg-pink-500/20' },
    violet: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20', hover: 'hover:bg-violet-500/20' },
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', hover: 'hover:bg-emerald-500/20' },
  }

  const styles = colorStyles[color]

  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl ${styles.bg} border ${styles.border} ${styles.hover} transition-all text-left group`}
    >
      <div className="flex items-center justify-between mb-2">
        <Icon className={`w-5 h-5 ${styles.text}`} />
        <ArrowRight className={`w-4 h-4 ${styles.text} opacity-0 group-hover:opacity-100 transition-opacity`} />
      </div>
      <span className="text-sm font-medium text-white">{title}</span>
    </button>
  )
}

// VPS Card Component
interface VPSCardProps {
  workerId: string | null
  status: {
    provisioned: boolean
    status: string
    server?: {
      id: number
      name: string
      status: string
      type: string
      cores: number
      memory: number
      disk: number
      ip: string
      created: string
    }
    loading: boolean
    error?: string
  }
  onProvision: () => void
  onReboot: () => void
  onRefresh: () => void
}

function VPSCard({ workerId, status, onProvision, onReboot, onRefresh }: VPSCardProps) {
  if (!workerId) {
    return (
      <div className="p-6 rounded-xl bg-[#111118] border border-white/10 text-center">
        <p className="text-slate-400 mb-4">No worker assigned to this store</p>
      </div>
    )
  }

  if (status.loading && !status.provisioned) {
    return (
      <div className="p-6 rounded-xl bg-[#111118] border border-white/10">
        <div className="flex items-center justify-center gap-3">
          <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-300">{status.status === 'provisioning' ? 'Provisioning VPS...' : 'Loading...'}</span>
        </div>
      </div>
    )
  }

  if (!status.provisioned) {
    return (
      <div className="p-6 rounded-xl bg-[#111118] border border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#D50c2d]/20 flex items-center justify-center">
              <span className="text-[#D50c2d] font-bold text-lg">H</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">Hetzner VPS</h3>
              <p className="text-xs text-slate-400">Not provisioned yet</p>
            </div>
          </div>
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-violet-600 to-pink-600"
            onClick={onProvision}
          >
            <Play className="w-4 h-4 mr-2" />
            Provision VPS
          </Button>
        </div>
      </div>
    )
  }

  const server = status.server
  
  return (
    <div className="p-6 rounded-xl bg-[#111118] border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#D50c2d]/20 flex items-center justify-center">
            <span className="text-[#D50c2d] font-bold text-lg">H</span>
          </div>
          <div>
            <h3 className="font-semibold text-white">{server?.name || `VPS Worker #${workerId.slice(-6)}`}</h3>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className={`px-1.5 py-0.5 rounded ${status.status === 'running' ? 'bg-emerald-500/20 text-emerald-400' : status.status === 'provisioning' || status.status === 'configuring' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'} text-[10px]`}>
                {status.status === 'running' ? 'Running' : status.status === 'provisioning' ? 'Provisioning' : status.status === 'configuring' ? 'Configuring' : status.status}
              </span>
              {server && (
                <>
                  <span>•</span>
                  <span>{server.type}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 h-8" onClick={onRefresh}>
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 h-8" onClick={onReboot}>
            <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Restart
          </Button>
        </div>
      </div>
      
      {server && (
        <>
          {/* VPS Stats Grid */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="p-3 rounded-lg bg-white/5">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Uptime</p>
              <p className="text-sm font-medium text-white">Running</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Public IPv4</p>
              <p className="text-sm font-medium text-white font-mono">{server.ip}</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Location</p>
              <p className="text-sm font-medium text-white">Nuremberg</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Specs</p>
              <p className="text-sm font-medium text-white">{server.cores} vCPU • {server.memory}GB • {server.disk}GB</p>
            </div>
          </div>
          
          {/* Resource Usage Bars */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-400">CPU</span>
                <span className="text-xs text-white">--</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-[0%] bg-emerald-500 rounded-full animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-400">Memory</span>
                <span className="text-xs text-white">{server.memory} GB</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-[0%] bg-blue-500 rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-400">Disk</span>
                <span className="text-xs text-white">{server.disk} GB</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-[0%] bg-violet-500 rounded-full" />
              </div>
            </div>
          </div>
          
          {/* Connection Info */}
          <div className="mt-4 p-3 rounded-lg bg-black/30 border border-white/5">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span className="text-slate-500">$</span>
              <span>ssh root@{server.ip}</span>
              <button className="ml-auto text-slate-500 hover:text-white transition-colors" onClick={() => navigator.clipboard.writeText(`ssh root@${server.ip}`)}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
