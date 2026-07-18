'use client'

import { Store, Sparkles, Send, Bot, User, TrendingUp, Eye, MousePointer, DollarSign, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StoreIntegrations } from './StoreIntegrations'
import { ShopifyConnectModal } from './ShopifyConnectModal'
import { MetaAdsConnectModal } from './MetaAdsConnectModal'
import { CJDropshippingConnectModal } from './CJDropshippingConnectModal'
import { AIProviderModal } from './AIProviderModal'
import { GitHubConnectModal } from './GitHubConnectModal'
import { VercelConnectModal } from './VercelConnectModal'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useStore } from './StoreLayout'

interface StoreData {
  id: string
  name: string
  url: string
  status: string
  worker_id: string | null
}

interface StoreContentProps {
  store: StoreData
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function StoreContent({ store }: StoreContentProps) {
  const { selectedPage } = useStore()
  const [integrations, setIntegrations] = useState({
    shopify: { connected: false },
    meta_ads: { connected: false },
    cj_dropshipping: { connected: false },
    ai: { connected: false },
    github: { connected: false },
    vercel: { connected: false },
  })
  
  const [activeModal, setActiveModal] = useState<string | null>(null)
  
  // Chat state
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'assistant', content: 'Hi! I\'m your AI Agent. I can help you manage your store, analyze ads, suggest products, and more. What would you like to do?', timestamp: new Date() }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadIntegrations()
  }, [store.id])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  async function loadIntegrations() {
    if (store.id === 'demo') {
      setIntegrations({
        shopify: { connected: true },
        meta_ads: { connected: true },
        cj_dropshipping: { connected: true },
        ai: { connected: true },
        github: { connected: true },
        vercel: { connected: true },
      })
      return
    }

    try {
      const { data: creds } = await supabase
        .from('store_credentials')
        .select('*')
        .eq('store_id', store.id)

      const { data: aiConfig } = await supabase
        .from('ai_configs')
        .select('*')
        .single()

      const { data: githubConfig } = await supabase
        .from('user_credentials')
        .select('*')
        .eq('type', 'github')
        .single()

      const { data: vercelConfig } = await supabase
        .from('user_credentials')
        .select('*')
        .eq('type', 'vercel')
        .single()

      const shopifyCreds = creds?.find((c: any) => c.type === 'shopify')
      const metaCreds = creds?.find((c: any) => c.type === 'meta_ads')
      const cjCreds = creds?.find((c: any) => c.type === 'cj_dropshipping')

      setIntegrations({
        shopify: { connected: !!shopifyCreds },
        meta_ads: { connected: !!metaCreds },
        cj_dropshipping: { connected: !!cjCreds },
        ai: { connected: !!aiConfig },
        github: { connected: !!githubConfig },
        vercel: { connected: !!vercelConfig },
      })
    } catch (error) {
      console.error('Failed to load integrations:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput,
      timestamp: new Date()
    }
    
    setChatMessages(prev => [...prev, userMessage])
    setChatInput('')
    setIsTyping(true)
    
    // Simulate AI response
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
        content: randomResponse,
        timestamp: new Date()
      }
      
      setChatMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  // Render specific page content
  const renderContent = () => {
    switch (selectedPage) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Demo Banner */}
            {store.id === 'demo' && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-violet-500/20 to-pink-500/20 border border-violet-500/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/30 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-violet-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Demo Store</h3>
                    <p className="text-sm text-slate-400">
                      This is a demo showing all features. Connect a real store to use actual integrations.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Store Header */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-violet-500/20 rounded-xl flex items-center justify-center">
                <Store className="w-8 h-8 text-violet-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{store.name}</h1>
                <a href={store.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-violet-400">
                  {store.url}
                </a>
              </div>
            </div>
            
            {/* Integration Cards */}
            <StoreIntegrations
              storeId={store.id}
              integrations={integrations}
              onConnectShopify={() => setActiveModal('shopify')}
              onConnectMeta={() => setActiveModal('meta')}
              onConnectCJ={() => setActiveModal('cj')}
              onConfigureAI={() => setActiveModal('ai')}
              onConnectGitHub={() => setActiveModal('github')}
              onConnectVercel={() => setActiveModal('vercel')}
            />

            {/* Meta Ads Performance Section */}
            {integrations.meta_ads.connected && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Meta Ads Performance
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* AI Queued Ads */}
                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-white flex items-center gap-2">
                        <Bot className="w-4 h-4 text-blue-400" />
                        AI Queued Ads
                      </h3>
                      <span className="px-2 py-1 rounded-full bg-blue-500/30 text-blue-300 text-xs">3 Pending</span>
                    </div>
                    <div className="space-y-2">
                      <div className="p-2 rounded-lg bg-white/5 flex items-center justify-between">
                        <span className="text-sm text-slate-300">Summer Collection Promo</span>
                        <span className="text-xs text-slate-500">Created 2h ago</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white/5 flex items-center justify-between">
                        <span className="text-sm text-slate-300">Flash Sale Retargeting</span>
                        <span className="text-xs text-slate-500">Created 5h ago</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white/5 flex items-center justify-between">
                        <span className="text-sm text-slate-300">Abandoned Cart Recovery</span>
                        <span className="text-xs text-slate-500">Created 8h ago</span>
                      </div>
                    </div>
                    <Button size="sm" className="w-full mt-3 bg-blue-600/50 hover:bg-blue-600">
                      Review & Launch
                    </Button>
                  </div>

                  {/* Current Performance */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      Current Performance
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Eye className="w-4 h-4" />
                          <span className="text-sm">Impressions</span>
                        </div>
                        <span className="text-white font-medium">47.2K</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-400">
                          <MousePointer className="w-4 h-4" />
                          <span className="text-sm">CTR</span>
                        </div>
                        <span className="text-green-400 font-medium">3.8% ↑</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-400">
                          <DollarSign className="w-4 h-4" />
                          <span className="text-sm">ROAS</span>
                        </div>
                        <span className="text-green-400 font-medium">4.2x ↑</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-400">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-sm">Spend</span>
                        </div>
                        <span className="text-white font-medium">$1,247</span>
                      </div>
                    </div>
                  </div>

                  {/* Actionable Items */}
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                      Actionable Items
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-300">Increase budget on "Summer Sale" campaign (+23% ROAS)</span>
      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-300">Pause underperforming ad set (0.8% CTR)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-300">Test new creative for retargeting audience</span>
                      </div>
                    </div>
                    <Button size="sm" className="w-full mt-3 bg-amber-600/50 hover:bg-amber-600">
                      Apply Suggestions
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      
      case 'ai-agent':
        return (
          <div className="h-full flex gap-6">
            {/* Main Content - Tasks & Worker Status */}
            <div className="flex-1 space-y-6 overflow-y-auto">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">AI Agent</h1>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-green-400">Worker Active</span>
                </div>
              </div>
              
              {/* Worker Status Card */}
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
                    <Button variant="outline" size="sm" className="border-white/20 text-white">
                      Restart
                    </Button>
                    <Button variant="outline" size="sm" className="border-red-500/50 text-red-400">
                      Stop
                    </Button>
                  </div>
                </div>
              </div>

              {/* Available Tasks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h4 className="font-medium text-white">Product Research</h4>
                  </div>
                  <p className="text-sm text-slate-400 mb-3">Find trending products using AI analysis</p>
                  <Button size="sm" className="w-full bg-blue-600/50 hover:bg-blue-600">
                    Run Task
                  </Button>
                </div>

                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                      </svg>
                    </div>
                    <h4 className="font-medium text-white">Catalog Sync</h4>
                  </div>
                  <p className="text-sm text-slate-400 mb-3">Sync products with Shopify</p>
                  <Button size="sm" className="w-full bg-green-600/50 hover:bg-green-600">
                    Run Task
                  </Button>
                </div>

                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="font-medium text-white">Price Optimization</h4>
                  </div>
                  <p className="text-sm text-slate-400 mb-3">AI-powered pricing adjustments</p>
                  <Button size="sm" className="w-full bg-orange-600/50 hover:bg-orange-600">
                    Run Task
                  </Button>
                </div>

                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                      </svg>
                    </div>
                    <h4 className="font-medium text-white">Meta Ads Sync</h4>
                  </div>
                  <p className="text-sm text-slate-400 mb-3">Sync campaigns and analytics</p>
                  <Button size="sm" className="w-full bg-pink-600/50 hover:bg-pink-600">
                    Run Task
                  </Button>
                </div>
              </div>

              {/* Task Log */}
              <div className="p-4 rounded-lg bg-black/20 border border-white/5">
                <h4 className="font-medium text-white mb-3">Recent Activity</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-3 text-slate-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Catalog sync completed</span>
                    <span className="text-slate-600">2 min ago</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span>Product research started</span>
                    <span className="text-slate-600">15 min ago</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400">
                    <div className="w-2 h-2 bg-violet-500 rounded-full" />
                    <span>Worker provisioned</span>
                    <span className="text-slate-600">1 hour ago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Box - Far Right */}
            <div className="w-80 border-l border-white/10 flex flex-col bg-black/20">
              <div className="p-4 border-b border-white/10 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-violet-400" />
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
                      {message.role === 'user' ? <User className="w-4 h-4 text-violet-400" /> : <Bot className="w-4 h-4 text-blue-400" />}
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
          </div>
        )

      case 'settings':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Store Settings</h1>
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <p className="text-slate-400">Store settings coming soon...</p>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="p-8 h-full overflow-y-auto">
      {renderContent()}
      
      {/* Modals */}
      {activeModal === 'shopify' && (
        <ShopifyConnectModal storeId={store.id} onClose={() => setActiveModal(null)} onConnected={loadIntegrations} />
      )}
      {activeModal === 'meta' && (
        <MetaAdsConnectModal storeId={store.id} onClose={() => setActiveModal(null)} onConnected={loadIntegrations} />
      )}
      {activeModal === 'cj' && (
        <CJDropshippingConnectModal storeId={store.id} onClose={() => setActiveModal(null)} onConnected={loadIntegrations} />
      )}
      {activeModal === 'ai' && (
        <AIProviderModal onClose={() => setActiveModal(null)} onConfigured={loadIntegrations} />
      )}
      {activeModal === 'github' && (
        <GitHubConnectModal onClose={() => setActiveModal(null)} onConnected={loadIntegrations} />
      )}
      {activeModal === 'vercel' && (
        <VercelConnectModal onClose={() => setActiveModal(null)} onConnected={loadIntegrations} />
      )}
    </div>
  )
}
