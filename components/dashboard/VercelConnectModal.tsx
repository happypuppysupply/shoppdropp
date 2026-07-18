'use client'

import { useState } from 'react'
import { X, Triangle, Loader2, ChevronRight, CheckCircle, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'

interface VercelConnectModalProps {
  onClose: () => void
  onConnected: () => void
}

export function VercelConnectModal({ onClose, onConnected }: VercelConnectModalProps) {
  const [step, setStep] = useState<'intro' | 'token'>('intro')
  const [token, setToken] = useState('')
  const [teamId, setTeamId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [connected, setConnected] = useState(false)

  const handleConnect = async () => {
    setError('')
    setLoading(true)

    try {
      await api.request('/user/vercel', {
        method: 'POST',
        body: JSON.stringify({ token, team_id: teamId || null }),
      })
      setConnected(true)
      onConnected()
    } catch (err: any) {
      setError(err.message || 'Failed to connect Vercel')
    } finally {
      setLoading(false)
    }
  }

  if (connected) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="w-full max-w-md bg-[#111118] rounded-2xl border border-white/10 shadow-xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-white mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Vercel Connected!</h2>
          <p className="text-slate-300 mb-6">
            AI can now deploy websites, apps, and landing pages instantly.
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
            <div className="p-2 bg-white rounded-lg">
              <Triangle className="w-5 h-5 text-black fill-black" />
            </div>
            <h2 className="text-xl font-semibold text-white">Connect Vercel</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'intro' && (
          <div className="space-y-4">
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <h3 className="font-semibold text-white mb-2">Why connect Vercel?</h3>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>• AI can deploy websites instantly</li>
                <li>• Create landing pages and marketing sites</li>
                <li>• Build custom Shopify apps and themes</li>
                <li>• Automatic CI/CD for your projects</li>
              </ul>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <h3 className="font-semibold text-white mb-2">How to create a token:</h3>
              <ol className="text-sm text-slate-300 space-y-2 list-decimal list-inside">
                <li>Go to{' '}
                  <a href="https://vercel.com/account/tokens" target="_blank" rel="noopener noreferrer" className="text-white hover:underline inline-flex items-center gap-1">
                    Vercel Tokens <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>Click "Create Token"</li>
                <li>Name it "ShoppDropp"</li>
                <li>Select scope: Full Account</li>
                <li>Copy the token</li>
              </ol>
            </div>
            <Button onClick={() => setStep('token')} className="w-full bg-white text-black hover:bg-gray-200">
              I have my token <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {step === 'token' && (
          <form onSubmit={(e) => { e.preventDefault(); handleConnect() }} className="space-y-4">
            <button
              type="button"
              onClick={() => setStep('intro')}
              className="text-sm text-slate-400 hover:text-slate-300"
            >
              ← Back
            </button>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Vercel Token
              </label>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white font-mono text-sm"
                placeholder="vercel_token_xxx"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Team ID (optional)
              </label>
              <input
                type="text"
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white font-mono text-sm"
                placeholder="team_xxxxxxxx"
              />
              <p className="mt-2 text-xs text-slate-500">
                Only needed if deploying to a team. Leave blank for personal account.
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
              className="w-full bg-white text-black hover:bg-gray-200"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Connect Vercel'}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}