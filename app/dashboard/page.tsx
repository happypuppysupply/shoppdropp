'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ChevronLeft, Store, Cpu, LayoutGrid, Link2, Cog, Send, 
  Search, Package, Target, BarChart3, Loader2
} from 'lucide-react'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface Integration {
  id: string
  name: string
  icon: string
  status: 'connected' | 'disconnected'
  description: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('ai-agent')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isAiLoading, setIsAiLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const store = {
    id: 'store-1',
    name: 'Happy Puppy Supply',
    url: 'happypuppysupply.com',
    worker_id: null as string | null
  }

  const integrations: Integration[] = [
    { id: 'shopify', name: 'Shopify', icon: '🛍️', status: 'disconnected', description: 'Connect your Shopify store' },
    { id: 'meta', name: 'Meta Ads', icon: '📱', status: 'disconnected', description: 'Facebook & Instagram ads' },
    { id: 'cj', name: 'CJ Dropshipping', icon: '📦', status: 'disconnected', description: 'Import products from CJ' },
    { id: 'openwebninja', name: 'OpenWeb Ninja', icon: '🌐', status: 'disconnected', description: 'Web scraping & research' },
  ]

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  async function handleSendMessage() {
    if (!inputMessage.trim()) return
    
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage
    }
    
    setChatMessages(prev => [...prev, userMsg])
    setInputMessage('')
    setIsAiLoading(true)

    try {
      const response = await fetch('https://shoppdropp-api.onrender.com/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputMessage })
      })
      
      const data = await response.json()
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'I received your message. How can I help you today?'
      }
      
      setChatMessages(prev => [...prev, aiMsg])
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I could not process your message. Please try again.'
      }
      setChatMessages(prev => [...prev, errorMsg])
    } finally {
      setIsAiLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-[#050508]">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-[#0a0a0f] border-r border-white/5 flex flex-col">
        {/* Back to Stores */}
        <div className="p-4 border-b border-white/5">
          <button 
            onClick={() => router.push('/stores')}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
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
            <div>
              <h3 className="font-semibold text-white text-sm">{store.name}</h3>
              <p className="text-xs text-slate-500">{store.url}</p>
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
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-[#050508]">
        {/* Header */}
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-bold">
              {activeTab === 'overview' && 'Overview'}
              {activeTab === 'ai-agent' && 'AI Agent'}
              {activeTab === 'integrations' && 'Integrations'}
              {activeTab === 'settings' && 'Settings'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
              store.worker_id 
                ? 'bg-green-500/10 border-green-500/30' 
                : 'bg-yellow-500/10 border-yellow-500/30'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                store.worker_id ? 'bg-green-500' : 'bg-yellow-500'
              }`} />
              <span className={`text-sm ${
                store.worker_id ? 'text-green-400' : 'text-yellow-400'
              }`}>
                {store.worker_id ? 'Worker Ready' : 'No Worker'}
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          {/* AI AGENT TAB */}
          {activeTab === 'ai-agent' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
              {/* AI Chat */}
              <div className="lg:col-span-2 bg-[#111118] border border-white/10 rounded-xl flex flex-col h-[calc(100vh-140px)]">
                {/* Chat Header */}
                <div className="p-4 border-b border-white/10">
                  <h2 className="font-semibold flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-violet-400" />
                    ShoppDropp AI
                  </h2>
                </div>
                
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.length === 0 && (
                    <div className="text-center text-slate-500 py-8">
                      <Cpu className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                      <p>Ask me anything about your store!</p>
                      <p className="text-sm mt-2">Try: &quot;Find trending pet products&quot; or &quot;Help me set up Meta ads&quot;</p>
                    </div>
                  )}
                  
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                      {msg.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                          <Cpu className="w-4 h-4 text-violet-400" />
                        </div>
                      )}
                      <div className={`max-w-[80%] p-3 rounded-xl ${
                        msg.role === 'user' 
                          ? 'bg-violet-600 text-white' 
                          : 'bg-white/5 text-slate-200'
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  
                  {isAiLoading && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center">
                        <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
                      </div>
                      <div className="bg-white/5 p-3 rounded-xl">
                        <p className="text-sm text-slate-400">Thinking...</p>
                      </div>
                    </div>
                  )}
                  
                  <div ref={chatEndRef} />
                </div>
                
                {/* Input */}
                <div className="p-4 border-t border-white/10">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={isAiLoading || !inputMessage.trim()}
                      className="px-4 py-3 bg-violet-600 rounded-lg hover:bg-violet-500 transition-colors disabled:opacity-50"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Sidebar - VPS & Workflow */}
              <div className="space-y-6">
                {/* VPS Status */}
                <div className="bg-[#111118] border border-white/10 rounded-xl p-6">
                  <h2 className="text-lg font-semibold mb-4">VPS Worker</h2>
                  
                  {!store.worker_id ? (
                    <div className="text-center py-4">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/5 flex items-center justify-center">
                        <Cpu className="w-6 h-6 text-slate-600" />
                      </div>
                      <p className="text-slate-400 text-sm mb-3">No VPS worker assigned</p>
                      <button 
                        onClick={() => router.push('/dashboard/build-progress')}
                        className="w-full px-4 py-2 bg-gradient-to-r from-violet-600 to-pink-600 rounded-lg text-sm font-medium"
                      >
                        Provision VPS
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Status</span>
                        <span className="text-emerald-400">Running</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">IP</span>
                        <span className="font-mono">157.90.23.115</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Type</span>
                        <span>cpx12</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* AI Workflow */}
                <div className="bg-[#111118] border border-white/10 rounded-xl p-6">
                  <h2 className="text-lg font-semibold mb-4">Workflow</h2>
                  <div className="space-y-3">
                    {[
                      { step: 1, title: 'Product Research', status: 'ready', icon: Search },
                      { step: 2, title: 'CJ Import', status: 'locked', icon: Package },
                      { step: 3, title: 'Meta Ads', status: 'locked', icon: Target },
                      { step: 4, title: 'Analytics', status: 'locked', icon: BarChart3 },
                    ].map((item) => {
                      const Icon = item.icon
                      return (
                        <div key={item.step} className={`flex items-center gap-3 p-3 rounded-lg ${
                          item.status === 'ready' 
                            ? 'bg-violet-500/10 border border-violet-500/20' 
                            : 'bg-white/5 opacity-50'
                        }`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            item.status === 'ready' 
                              ? 'bg-violet-500/20 text-violet-400' 
                              : 'bg-white/10 text-slate-500'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{item.title}</p>
                          </div>
                          {item.status === 'ready' && (
                            <button className="px-2 py-1 bg-violet-600 rounded text-xs">Run</button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* INTEGRATIONS TAB */}
          {activeTab === 'integrations' && (
            <div className="max-w-4xl">
              <h2 className="text-xl font-bold mb-6">Connect Your Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {integrations.map((integration) => (
                  <div key={integration.id} className="bg-[#111118] border border-white/10 rounded-xl p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl">
                      {integration.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold">{integration.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          integration.status === 'connected'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-slate-500/20 text-slate-400'
                        }`}>
                          {integration.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 mb-3">{integration.description}</p>
                      <button className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        integration.status === 'connected'
                          ? 'bg-white/10 text-slate-300'
                          : 'bg-gradient-to-r from-violet-600 to-pink-600 text-white'
                      }`}>
                        {integration.status === 'connected' ? 'Manage' : 'Connect'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="text-center py-20 text-slate-500">
              <LayoutGrid className="w-16 h-16 mx-auto mb-4 text-slate-700" />
              <h2 className="text-xl font-semibold mb-2">Overview</h2>
              <p>Store analytics and performance metrics coming soon.</p>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="text-center py-20 text-slate-500">
              <Cog className="w-16 h-16 mx-auto mb-4 text-slate-700" />
              <h2 className="text-xl font-semibold mb-2">Settings</h2>
              <p>Store configuration and preferences coming soon.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
