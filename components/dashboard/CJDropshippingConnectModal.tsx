'use client'

import { useState } from 'react'
import { X, Truck, Loader2, ChevronRight, CheckCircle, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

interface CJDropshippingConnectModalProps {
  storeId: string
  onClose: () => void
  onConnected: () => void
}

export function CJDropshippingConnectModal({ storeId, onClose, onConnected }: CJDropshippingConnectModalProps) {
  const [step, setStep] = useState<'intro' | 'token'>('intro')
  const [email, setEmail] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [connected, setConnected] = useState(false)

  const handleConnect = async () => {
    setError('')
    setLoading(true)

    try {
      const { error: dbError } = await supabase
        .from('store_credentials')
        .upsert({
          store_id: storeId,
          type: 'cj_dropshipping',
          credentials: { email, api_key: apiKey },
        })

      if (dbError) throw dbError

      setConnected(true)
      onConnected()
    } catch (err: any) {
      setError(err.message || 'Failed to connect CJ Dropshipping')
    } finally {
      setLoading(false)
    }
  }

  if (connected) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="w-full max-w-md bg-[#111118] rounded-2xl border border-white/10 shadow-xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-orange-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">CJ Dropshipping Connected!</h2>
          <p className="text-slate-300 mb-6">
            CJ Dropshipping is now connected. The AI can source products and automate fulfillment from CJ.
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
              <Truck className="w-5 h-5 text-orange-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Connect CJ Dropshipping</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'intro' && (
          <div className="space-y-4">
            <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl">
              <h3 className="font-semibold text-white mb-2">How to get your CJ Dropshipping API Key:</h3>
              <ol className="text-sm text-slate-300 space-y-2 list-decimal list-inside">
                <li>Log in to your{' '}
                  <a href="https://cjdropshipping.com" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline inline-flex items-center gap-1">
                    CJ Dropshipping account <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>Go to Profile → API Authorization</li>
                <li>Click "Create API Key"</li>
                <li>Copy the API key</li>
              </ol>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <p className="text-sm text-slate-400">
                <strong className="text-white">What CJ Dropshipping does:</strong> CJ sources products from suppliers, 
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
                CJ Dropshipping Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                CJ Dropshipping API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm"
                placeholder="cj_xxxxxxxxxxxx"
                required
              />
              <p className="mt-2 text-xs text-slate-500">
                This key allows AI to automate product sourcing and order fulfillment via CJ Dropshipping.
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
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Connect CJ Dropshipping'}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
