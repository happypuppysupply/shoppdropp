'use client'

import { useState } from 'react'
import { X, Code2, Loader2, ChevronRight, CheckCircle, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'

interface GitHubConnectModalProps {
  onClose: () => void
  onConnected: () => void
}

export function GitHubConnectModal({ onClose, onConnected }: GitHubConnectModalProps) {
  const [step, setStep] = useState<'intro' | 'token'>('intro')
  const [token, setToken] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [connected, setConnected] = useState(false)

  const handleConnect = async () => {
    setError('')
    setLoading(true)

    try {
      await api.request('/user/github', {
        method: 'POST',
        body: JSON.stringify({ token, username }),
      })
      setConnected(true)
      onConnected()
    } catch (err: any) {
      setError(err.message || 'Failed to connect GitHub')
    } finally {
      setLoading(false)
    }
  }

  if (connected) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="w-full max-w-md bg-[#111118] rounded-2xl border border-white/10 shadow-xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-white mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">GitHub Connected!</h2>
          <p className="text-slate-300 mb-6">
            AI can now create repos, write code, and deploy projects for you.
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
            <div className="p-2 bg-white/10 rounded-lg">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Connect GitHub</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'intro' && (
          <div className="space-y-4">
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <h3 className="font-semibold text-white mb-2">Why connect GitHub?</h3>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>• AI can create and manage code repositories</li>
                <li>• Auto-generate custom Shopify themes and apps</li>
                <li>• Build landing pages and marketing sites</li>
                <li>• Deploy to Vercel automatically</li>
              </ul>
            </div>
            <div className="p-4 bg-gray-500/10 border border-gray-500/30 rounded-xl">
              <h3 className="font-semibold text-white mb-2">How to create a token:</h3>
              <ol className="text-sm text-slate-300 space-y-2 list-decimal list-inside">
                <li>Go to{' '}
                  <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:underline inline-flex items-center gap-1">
                    GitHub Settings → Tokens <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>Click "Generate new token (classic)"</li>
                <li>Select scopes: repo, workflow, write:packages</li>
                <li>Copy the token (starts with <code className="text-gray-300">ghp_</code>)</li>
              </ol>
            </div>
            <Button onClick={() => setStep('token')} className="w-full bg-gradient-to-r from-gray-700 to-gray-600">
              I have my token <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {step === 'token' && (
          <form onSubmit={(e) => { e.preventDefault(); handleConnect() }} className="space-y-4">
            <button
              type="button"
              onClick={() => setStep('intro')}
              className="text-sm text-gray-400 hover:text-gray-300"
            >
              ← Back
            </button>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                GitHub Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gray-500 font-mono text-sm"
                placeholder="your-username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Personal Access Token
              </label>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gray-500 font-mono text-sm"
                placeholder="ghp_xxxxxxxxxxxx"
                required
              />
              <p className="mt-2 text-xs text-slate-500">
                Token is encrypted and only used to push code and create repos.
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
              className="w-full bg-gradient-to-r from-gray-700 to-gray-600"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Connect GitHub'}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}