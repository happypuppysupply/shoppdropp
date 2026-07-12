'use client'

import { useState } from 'react'
import { X, MessageCircle, Loader2, ChevronRight, CheckCircle, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'

interface MetaAdsConnectModalProps {
  storeId: string
  onClose: () => void
  onConnected: () => void
}

export function MetaAdsConnectModal({ storeId, onClose, onConnected }: MetaAdsConnectModalProps) {
  const [step, setStep] = useState<'intro' | 'token' | 'verify'>('intro')
  const [accessToken, setAccessToken] = useState('')
  const [accountId, setAccountId] = useState('')
  const [pixelId, setPixelId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [connected, setConnected] = useState(false)

  const handleConnect = async () => {
    setError('')
    setLoading(true)

    try {
      await api.stores.saveCredentials(storeId, 'meta_ads', {
        access_token: accessToken,
        account_id: accountId,
        pixel_id: pixelId || null,
      })
      setConnected(true)
      onConnected()
    } catch (err: any) {
      setError(err.message || 'Failed to connect Meta Ads')
    } finally {
      setLoading(false)
    }
  }

  if (connected) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="w-full max-w-md bg-[#111118] rounded-2xl border border-white/10 shadow-xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Meta Ads Connected!</h2>
          <p className="text-slate-300 mb-6">
            Your Facebook Ads account is now connected. The AI can manage campaigns and audiences.
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
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <MessageCircle className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Connect Meta Ads</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'intro' && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <h3 className="font-semibold text-white mb-2">How to get your credentials:</h3>
              <ol className="text-sm text-slate-300 space-y-2 list-decimal list-inside">
                <li>Go to{' '}
                  <a href="https://business.facebook.com/settings/system-users" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline inline-flex items-center gap-1">
                    Meta Business Settings <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>Click "System Users" → "Add" to create one</li>
                <li>Assign "Admin" role</li>
                <li>Generate a new token with ads_management, ads_read permissions</li>
                <li>Copy your Ad Account ID (starts with act_)</li>
              </ol>
            </div>
            <Button onClick={() => setStep('token')} className="w-full bg-gradient-to-r from-blue-600 to-violet-600">
              I have my credentials <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {step === 'token' && (
          <form onSubmit={(e) => { e.preventDefault(); handleConnect() }} className="space-y-4">
            <button
              type="button"
              onClick={() => setStep('intro')}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              ← Back to instructions
            </button>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Access Token
              </label>
              <input
                type="password"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="EAAB..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Ad Account ID
              </label>
              <input
                type="text"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="act_123456789"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Pixel ID (optional)
              </label>
              <input
                type="text"
                value={pixelId}
                onChange={(e) => setPixelId(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="1234567890"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-violet-600"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Connect Meta Ads'}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}