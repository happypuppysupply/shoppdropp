'use client'

import { useState } from 'react'
import { X, ShoppingBag, Loader2, ChevronRight, CheckCircle, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'

interface AutoDSConnectModalProps {
  storeId: string
  onClose: () => void
  onConnected: () => void
}

export function AutoDSConnectModal({ storeId, onClose, onConnected }: AutoDSConnectModalProps) {
  const [step, setStep] = useState<'intro' | 'token'>('intro')
  const [apiKey, setApiKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [connected, setConnected] = useState(false)

  const handleConnect = async () => {
    setError('')
    setLoading(true)

    try {
      await api.stores.saveCredentials(storeId, 'autods', {
        api_key: apiKey,
      })
      setConnected(true)
      onConnected()
    } catch (err: any) {
      setError(err.message || 'Failed to connect AutoDS')
    } finally {
      setLoading(false)
    }
  }

  if (connected) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="w-full max-w-md bg-[#111118] rounded-2xl border border-white/10 shadow-xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-orange-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">AutoDS Connected!</h2>
          <p className="text-slate-300 mb-6">
            AutoDS is now connected. The AI can source products and automate your dropshipping.
          </p>
          <Button onClick={onClose} className="bg-gradient-to-r from-violet-600 to-pink-600">
            Done
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full max-w-lg bg-[#111118] rounded-2xl border border-white/10 shadow-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-orange-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Connect AutoDS</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'intro' && (
          <div className="space-y-4">
            <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl">
              <h3 className="font-semibold text-white mb-2">How to get your AutoDS API Key:</h3>
              <ol className="text-sm text-slate-300 space-y-2 list-decimal list-inside">
                <li>Log in to your{' '}
                  <a href="https://autods.com" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline inline-flex items-center gap-1">
                    AutoDS account <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>Go to Settings → API</li>
                <li>Click "Generate new API key"</li>
                <li>Copy the API key (starts with <code className="text-orange-300">ads_</code>)</li>
              </ol>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <p className="text-sm text-slate-400">
                <strong className="text-white">What AutoDS does:</strong> AutoDS sources products from suppliers, 
                manages inventory, and automates order fulfillment for your Shopify store.
              </p>
            </div>
            <Button onClick={() => setStep('token')} className="w-full bg-gradient-to-r from-orange-600 to-pink-600">
              I have my API key <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {step === 'token' && (
          <form onSubmit={(e) => { e.preventDefault(); handleConnect() }} className="space-y-4">
            <button
              type="button"
              onClick={() => setStep('intro')}
              className="text-sm text-orange-400 hover:text-orange-300"
            >
              ← Back to instructions
            </button>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                AutoDS API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm"
                placeholder="ads_xxxxxxxxxxxx"
                required
              />
              <p className="mt-2 text-xs text-slate-500">
                This key allows AI to automate product sourcing and order fulfillment.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-600 to-pink-600"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Connect AutoDS'}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}