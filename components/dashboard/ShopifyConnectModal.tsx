'use client'

import { useState } from 'react'
import { X, Store, Loader2, ChevronRight, CheckCircle, Copy, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'

interface ShopifyConnectModalProps {
  storeId: string
  onClose: () => void
  onConnected: () => void
}

const STEPS = [
  {
    id: 'url',
    title: 'Enter Store URL',
    description: 'Your Shopify store URL',
  },
  {
    id: 'create_app',
    title: 'Create Shopify App',
    description: 'Create a custom app in Shopify admin',
  },
  {
    id: 'permissions',
    title: 'Set Permissions',
    description: 'Configure API access scopes',
  },
  {
    id: 'install',
    title: 'Install App',
    description: 'Install the app in your store',
  },
  {
    id: 'token',
    title: 'Enter API Token',
    description: 'Paste your Admin API access token',
  },
]

const REQUIRED_SCOPES = [
  'read_products',
  'write_products',
  'read_orders',
  'write_orders',
  'read_customers',
  'write_customers',
  'read_inventory',
  'write_inventory',
  'read_analytics',
  'read_content',
  'write_content',
]

export function ShopifyConnectModal({ storeId, onClose, onConnected }: ShopifyConnectModalProps) {
  const [step, setStep] = useState(0)
  const [storeUrl, setStoreUrl] = useState('')
  const [apiToken, setApiToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [connected, setConnected] = useState(false)

  const getAdminUrl = () => {
    const url = storeUrl.replace(/\/$/, '')
    return `${url}/admin`
  }

  const getAppsUrl = () => `${getAdminUrl()}/settings/apps`

  const handleVerifyToken = async () => {
    setError('')
    setLoading(true)

    try {
      // Save credentials
      await api.stores.saveCredentials(storeId, 'shopify', {
        store_url: storeUrl,
        api_token: apiToken,
      })
      setConnected(true)
      onConnected()
    } catch (err: any) {
      setError(err.message || 'Failed to connect Shopify')
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <p className="text-slate-300">
              Enter your Shopify store URL to get started:
            </p>
            <div>
              <input
                type="url"
                value={storeUrl}
                onChange={(e) => setStoreUrl(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="https://your-store.myshopify.com"
              />
            </div>
            <Button
              onClick={() => setStep(1)}
              disabled={!storeUrl.includes('.myshopify.com')}
              className="w-full bg-gradient-to-r from-violet-600 to-pink-600"
            >
              Continue <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )

      case 1:
        return (
          <div className="space-y-4">
            <div className="p-4 bg-violet-500/10 border border-violet-500/30 rounded-xl">
              <h3 className="font-semibold text-white mb-2">Step 1: Create a Custom App</h3>
              <ol className="text-sm text-slate-300 space-y-2 list-decimal list-inside">
                <li>Go to your{' '}
                  <a href={getAppsUrl()} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline inline-flex items-center gap-1">
                    Shopify Admin <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>Click "Develop apps" at the bottom</li>
                <li>Click "Create an app"</li>
                <li>Name it "ShoppDropp Automation"</li>
                <li>Click "Create"</li>
              </ol>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(0)} className="flex-1">
                Back
              </Button>
              <Button onClick={() => setStep(2)} className="flex-1 bg-gradient-to-r from-violet-600 to-pink-600">
                I created the app <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div className="p-4 bg-violet-500/10 border border-violet-500/30 rounded-xl">
              <h3 className="font-semibold text-white mb-2">Step 2: Configure API Scopes</h3>
              <p className="text-sm text-slate-300 mb-3">
                In your app, go to "Configuration" tab and add these permissions:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {REQUIRED_SCOPES.map((scope) => (
                  <div key={scope} className="flex items-center gap-2 text-xs">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <code className="text-slate-300 font-mono">{scope}</code>
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-400 mt-3">
                Click "Save" after selecting all permissions.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button onClick={() => setStep(3)} className="flex-1 bg-gradient-to-r from-violet-600 to-pink-600">
                Permissions set <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div className="p-4 bg-violet-500/10 border border-violet-500/30 rounded-xl">
              <h3 className="font-semibold text-white mb-2">Step 3: Install the App</h3>
              <ol className="text-sm text-slate-300 space-y-2 list-decimal list-inside">
                <li>Click "Install app" at the top right</li>
                <li>Review the permissions and click "Install"</li>
                <li>After installation, you'll see the API access tokens section</li>
              </ol>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                Back
              </Button>
              <Button onClick={() => setStep(4)} className="flex-1 bg-gradient-to-r from-violet-600 to-pink-600">
                App installed <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <div className="p-4 bg-violet-500/10 border border-violet-500/30 rounded-xl">
              <h3 className="font-semibold text-white mb-2">Step 4: Copy Admin API Token</h3>
              <ol className="text-sm text-slate-300 space-y-2 list-decimal list-inside mb-4">
                <li>In the API credentials tab</li>
                <li>Click "Reveal token once" next to Admin API access token</li>
                <li>Copy the token (starts with <code className="text-violet-300">shpat_</code>)</li>
              </ol>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Admin API Access Token
              </label>
              <input
                type="password"
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 font-mono text-sm"
                placeholder="shpat_xxxxxxxxxxxxxxxx"
              />
              <p className="mt-2 text-xs text-slate-500">
                This token is encrypted and stored securely. It's only used to manage your store.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(3)} className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleVerifyToken}
                disabled={loading || !apiToken.startsWith('shpat_')}
                className="flex-1 bg-gradient-to-r from-violet-600 to-pink-600"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Connect Store'}
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (connected) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="w-full max-w-md bg-[#111118] rounded-2xl border border-white/10 shadow-xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Shopify Connected!</h2>
          <p className="text-slate-300 mb-6">
            Your store is now connected. The AI can now manage products, orders, and inventory.
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
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Store className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Connect Shopify</h2>
              <p className="text-sm text-slate-400">
                Step {step + 1} of {STEPS.length}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1 mb-6">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className={`h-1 flex-1 rounded-full ${
                i <= step ? 'bg-gradient-to-r from-violet-500 to-pink-500' : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        {renderStepContent()}
      </div>
    </div>
  )
}