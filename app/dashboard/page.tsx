'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Store, Cpu, LayoutGrid, Link2, Cog } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('ai-agent')

  const store = {
    id: 'store-1',
    name: 'Happy Puppy Supply',
    url: 'happypuppysupply.com',
    worker_id: null as string | null
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
          {activeTab === 'ai-agent' && (
            <div className="space-y-6">
              {/* VPS Status Card */}
              <div className="bg-[#111118] border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">VPS Worker Status</h2>
                  {!store.worker_id && (
                    <button 
                      onClick={() => router.push('/dashboard/build-progress')}
                      className="px-4 py-2 bg-gradient-to-r from-violet-600 to-pink-600 rounded-lg text-sm font-medium"
                    >
                      Provision VPS
                    </button>
                  )}
                </div>
                
                {!store.worker_id ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                      <Cpu className="w-8 h-8 text-slate-600" />
                    </div>
                    <p className="text-slate-400 mb-2">No VPS worker assigned</p>
                    <p className="text-sm text-slate-500">Provision a VPS to run automation tasks</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-4">
                    <div className="p-4 bg-white/5 rounded-lg">
                      <p className="text-xs text-slate-400 mb-1">Status</p>
                      <p className="text-emerald-400 font-medium">Running</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg">
                      <p className="text-xs text-slate-400 mb-1">IP Address</p>
                      <p className="font-mono text-sm">157.90.23.115</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg">
                      <p className="text-xs text-slate-400 mb-1">Type</p>
                      <p>cpx12</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg">
                      <p className="text-xs text-slate-400 mb-1">Uptime</p>
                      <p>2h 34m</p>
                    </div>
                  </div>
                )}
              </div>

              {/* AI Workflow */}
              <div className="bg-[#111118] border border-white/10 rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4">AI Workflow</h2>
                <div className="space-y-3">
                  {[
                    { step: 1, title: 'Product Research', status: 'ready', desc: 'Find trending products' },
                    { step: 2, title: 'CJ Dropshipping Import', status: 'locked', desc: 'Import to Shopify' },
                    { step: 3, title: 'Meta Ads Launch', status: 'locked', desc: 'Create ad campaigns' },
                    { step: 4, title: 'Measure Results', status: 'locked', desc: 'Track performance' },
                    { step: 5, title: 'Optimize', status: 'locked', desc: 'Scale winning campaigns' },
                  ].map((item) => (
                    <div key={item.step} className={`flex items-center gap-4 p-4 rounded-lg border ${
                      item.status === 'ready' 
                        ? 'bg-violet-500/5 border-violet-500/20' 
                        : 'bg-white/5 border-white/5 opacity-60'
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        item.status === 'ready'
                          ? 'bg-violet-500/20 text-violet-400'
                          : 'bg-white/10 text-slate-500'
                      }`}>
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-slate-400">{item.desc}</p>
                      </div>
                      {item.status === 'ready' && (
                        <button className="px-3 py-1.5 bg-violet-600 rounded-lg text-sm">
                          Run
                        </button>
                      )}
                      {item.status === 'locked' && (
                        <span className="text-xs text-slate-500">Locked</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="text-center py-20 text-slate-500">
              Overview content coming soon
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="text-center py-20 text-slate-500">
              Integrations content coming soon
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="text-center py-20 text-slate-500">
              Settings content coming soon
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
