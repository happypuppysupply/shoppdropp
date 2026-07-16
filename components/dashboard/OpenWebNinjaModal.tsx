'use client'

import { useState, useEffect } from 'react'
import { X, Search, Loader2, AlertTriangle, Check, ExternalLink, Package, TrendingUp, BarChart3, Store } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'

const PLATFORMS = [
  {
    id: 'amazon',
    name: 'Amazon',
    description: 'Real-time Amazon product data, prices, reviews, and sales volume',
    icon: Store,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
    features: ['Product search', 'Price tracking', 'Sales volume', 'Reviews', 'Prime status']
  },
  {
    id: 'walmart',
    name: 'Walmart',
    description: 'Walmart product listings, pricing, and availability data',
    icon: Package,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    features: ['Product search', 'Price comparison', 'Stock status', 'Store availability']
  },
  {
    id: 'ebay',
    name: 'eBay',
    description: 'eBay listings, auction data, and seller information',
    icon: TrendingUp,
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    features: ['Active listings', 'Auction data', 'Seller ratings', 'Sold prices']
  },
  {
    id: 'product-search',
    name: 'Product Search',
    description: 'Aggregated product search across multiple platforms',
    icon: Search,
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/20',
    features: ['Multi-platform', 'Price comparison', 'Reviews aggregation', 'Trending detection']
  },
  {
    id: 'ecommerce',
    name: 'E-commerce Data',
    description: 'Comprehensive e-commerce market data and analytics',
    icon: BarChart3,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/20',
    features: ['Market trends', 'Competitor analysis', 'Price history', 'Demand forecasting']
  },
]

interface OpenWebNinjaModalProps {
  onClose: () => void
  onConfigured: () => void
}

export function OpenWebNinjaModal({ onClose, onConfigured }: OpenWebNinjaModalProps) {
  const [apiKey, setApiKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isConfigured, setIsConfigured] = useState(false)
  const [activeTab, setActiveTab] = useState<'configure' | 'platforms'>('configure')

  useEffect(() => {
    checkExistingConfig()
  }, [])

  const checkExistingConfig = async () => {
    try {
      const config = await api.openwebninja.getConfig()
      if (config.configured) {
        setIsConfigured(true)
      }
    } catch (e) {
      // Not configured yet
    }
  }

  const testApiKey = async () => {
    setTesting(true)
    setError('')
    
    try {
      // Test with a simple search
      const response = await fetch('https://api.openwebninja.com/realtime-amazon-data/search?query=test&page=1', {
        headers: {
          'X-API-Key': apiKey,
        },
      })
      
      if (response.status === 401 || response.status === 403) {
        setError('Invalid API key. Please check your key and try again.')
        setTesting(false)
        return false
      }
      
      return true
    } catch (e) {
      setError('Failed to test API key. Please check your connection.')
      return false
    } finally {
      setTesting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // First test the key
      const isValid = await testApiKey()
      if (!isValid) {
        setLoading(false)
        return
      }

      // Save configuration
      await api.openwebninja.configure(apiKey)
      setSuccess(true)
      setIsConfigured(true)
      
      setTimeout(() => {
        onConfigured()
        onClose()
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Failed to configure OpenWeb Ninja')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl bg-[#111118] rounded-2xl border border-white/10 shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-orange-500/20 to-violet-500/20 rounded-lg border border-orange-500/30">
                <Search className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">OpenWeb Ninja</h2>
                <p className="text-sm text-slate-400">
                  Real-time product research across Amazon, Walmart, eBay & more
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setActiveTab('configure')}
              className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'configure'
                  ? 'text-white border-violet-500'
                  : 'text-slate-400 border-transparent hover:text-white'
              }`}
            >
              Configuration
            </button>
            <button
              onClick={() => setActiveTab('platforms')}
              className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'platforms'
                  ? 'text-white border-violet-500'
                  : 'text-slate-400 border-transparent hover:text-white'
              }`}
            >
              Available Platforms
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-sm flex items-center gap-2">
              <Check className="w-4 h-4" />
              OpenWeb Ninja configured successfully!
            </div>
          )}

          {activeTab === 'configure' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Info Card */}
              <div className="p-4 bg-gradient-to-r from-orange-500/10 to-violet-500/10 border border-orange-500/20 rounded-xl">
                <h3 className="font-medium text-white mb-2">What is OpenWeb Ninja?</h3>
                <p className="text-sm text-slate-300 mb-3">
                  OpenWeb Ninja provides real-time access to product data from major e-commerce platforms. 
                  Use it to research winning products, analyze competitors, and find pricing opportunities.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Amazon', 'Walmart', 'eBay', 'Product Search', 'Market Analytics'].map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-white/10 rounded text-xs text-slate-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* API Key Input */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  OpenWeb Ninja API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 font-mono text-sm"
                  placeholder="ak_..."
                  required
                />
                <div className="mt-2 flex items-start gap-2 text-xs text-slate-500">
                  <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>
                    Your API key is encrypted and stored securely. Get your key from{' '}
                    <a 
                      href="https://openwebninja.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-violet-400 hover:underline inline-flex items-center gap-1"
                    >
                      OpenWeb Ninja
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </span>
                </div>
              </div>

              {/* Test Status */}
              {testing && (
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Testing API key...
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-white/20 text-slate-300 rounded-lg hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  disabled={loading || !apiKey.trim() || testing}
                  className="flex-1 bg-gradient-to-r from-violet-600 to-pink-600 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isConfigured ? (
                    'Update Configuration'
                  ) : (
                    'Save Configuration'
                  )}
                </Button>
              </div>
            </form>
          )}

          {activeTab === 'platforms' && (
            <div className="space-y-4">
              <p className="text-slate-300 text-sm">
                OpenWeb Ninja provides access to the following e-commerce platforms:
              </p>
              
              <div className="grid gap-4">
                {PLATFORMS.map((platform) => (
                  <div
                    key={platform.id}
                    className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 ${platform.bgColor} rounded-lg`}>
                        <platform.icon className={`w-5 h-5 ${platform.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{platform.name}</h3>
                        <p className="text-sm text-slate-400 mt-1">{platform.description}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {platform.features.map((feature) => (
                            <span
                              key={feature}
                              className="px-2 py-0.5 bg-white/5 rounded text-xs text-slate-500"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-violet-500/10 border border-violet-500/30 rounded-xl mt-4">
                <h4 className="font-medium text-violet-300 mb-2">Research Capabilities</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-violet-400" />
                    Find trending products with real sales volume data
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-violet-400" />
                    Compare prices across Amazon, Walmart, and eBay
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-violet-400" />
                    Analyze competitor products and pricing strategies
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-violet-400" />
                    Get product images, descriptions, and specifications
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-violet-400" />
                    Track reviews and ratings to validate product quality
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
