'use client'

import { useState, useEffect } from 'react'
import { X, Search, Loader2, AlertTriangle, Check, ExternalLink, Package, TrendingUp, BarChart3, Store, Globe, ShoppingCart, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'

const SERVICES = [
  {
    id: 'amazon',
    name: 'Amazon Data API',
    description: 'Real-time Amazon product search, prices, reviews, and sales data',
    icon: Store,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
    docsUrl: 'https://openwebninja.com/dashboard/realtime-amazon-data',
    placeholder: 'ak_your_amazon_api_key...',
  },
  {
    id: 'walmart',
    name: 'Walmart Data API',
    description: 'Walmart product listings, pricing, and availability',
    icon: ShoppingCart,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    docsUrl: 'https://openwebninja.com/dashboard/real-time-walmart-data',
    placeholder: 'ak_your_walmart_api_key...',
  },
  {
    id: 'ebay',
    name: 'eBay Data API',
    description: 'eBay listings, auction data, and sold prices',
    icon: Globe,
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    docsUrl: 'https://openwebninja.com/dashboard/real-time-ebay-data',
    placeholder: 'ak_your_ebay_api_key...',
  },
  {
    id: 'product_search',
    name: 'Product Search API',
    description: 'Aggregated product search across multiple platforms',
    icon: Search,
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/20',
    docsUrl: 'https://openwebninja.com/dashboard/realtime-product-search',
    placeholder: 'ak_your_product_search_api_key...',
  },
  {
    id: 'ecommerce',
    name: 'E-commerce Data API',
    description: 'Comprehensive e-commerce market data and analytics',
    icon: BarChart3,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/20',
    docsUrl: 'https://openwebninja.com/dashboard/realtime-ecommerce-data',
    placeholder: 'ak_your_ecommerce_api_key...',
  },
]

interface OpenWebNinjaModalProps {
  onClose: () => void
  onConfigured: () => void
}

export function OpenWebNinjaModal({ onClose, onConfigured }: OpenWebNinjaModalProps) {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({
    amazon: '',
    walmart: '',
    ebay: '',
    product_search: '',
    ecommerce: '',
  })
  const [configuredServices, setConfiguredServices] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState<Record<string, boolean>>({})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState<'configure' | 'overview'>('configure')
  const [expandedService, setExpandedService] = useState<string | null>(null)

  useEffect(() => {
    loadExistingConfig()
  }, [])

  const loadExistingConfig = async () => {
    try {
      const config = await api.openwebninja.getConfig()
      if (config.configured && config.services) {
        setConfiguredServices(config.services)
      }
    } catch (e) {
      // Not configured yet
    }
  }

  const handleApiKeyChange = (serviceId: string, value: string) => {
    setApiKeys(prev => ({ ...prev, [serviceId]: value }))
    setError('')
  }

  const testService = async (serviceId: string) => {
    const apiKey = apiKeys[serviceId]
    if (!apiKey.trim()) return

    setTesting(prev => ({ ...prev, [serviceId]: true }))
    
    try {
      // Test via backend
      await api.openwebninja.configure(serviceId, apiKey)
      setConfiguredServices(prev => ({ ...prev, [serviceId]: true }))
    } catch (e: any) {
      // Test failed
    } finally {
      setTesting(prev => ({ ...prev, [serviceId]: false }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Filter out empty keys
      const keysToSave: Record<string, string> = {}
      for (const [service, key] of Object.entries(apiKeys)) {
        if (key.trim()) {
          keysToSave[service] = key.trim()
        }
      }

      if (Object.keys(keysToSave).length === 0) {
        setError('Please enter at least one API key')
        setLoading(false)
        return
      }

      // Save all keys at once
      const result = await api.openwebninja.configureAll(keysToSave)
      
      // Update configured status based on results
      const newConfigured: Record<string, boolean> = {}
      for (const [service, res] of Object.entries(result.results as Record<string, { success: boolean }>)) {
        newConfigured[service] = res.success
      }
      setConfiguredServices(prev => ({ ...prev, ...newConfigured }))
      
      setSuccess(true)
      
      setTimeout(() => {
        onConfigured()
        onClose()
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Failed to configure OpenWeb Ninja APIs')
    } finally {
      setLoading(false)
    }
  }

  const configuredCount = Object.values(configuredServices).filter(Boolean).length
  const hasAnyKeys = Object.values(apiKeys).some(k => k.trim().length > 0)

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-3xl bg-[#111118] rounded-2xl border border-white/10 shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-orange-500/20 to-violet-500/20 rounded-lg border border-orange-500/30">
                <Search className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">OpenWeb Ninja APIs</h2>
                <p className="text-sm text-slate-400">
                  {configuredCount > 0 
                    ? `${configuredCount} of ${SERVICES.length} APIs connected`
                    : 'Configure your product research APIs'
                  }
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
              Configure APIs
            </button>
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'text-white border-violet-500'
                  : 'text-slate-400 border-transparent hover:text-white'
              }`}
            >
              Available Services
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
              OpenWeb Ninja APIs configured successfully!
            </div>
          )}

          {activeTab === 'configure' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Info Card */}
              <div className="p-4 bg-gradient-to-r from-orange-500/10 to-violet-500/10 border border-orange-500/20 rounded-xl">
                <h3 className="font-medium text-white mb-2">Configure Your API Keys</h3>
                <p className="text-sm text-slate-300">
                  Enter your OpenWeb Ninja API keys below. Each service requires its own API key. 
                  You can configure all of them or just the ones you need.
                </p>
              </div>

              {/* API Key Inputs */}
              <div className="space-y-3">
                {SERVICES.map((service) => {
                  const isConfigured = configuredServices[service.id]
                  const isTesting = testing[service.id]
                  const hasValue = apiKeys[service.id].trim().length > 0
                  const isExpanded = expandedService === service.id

                  return (
                    <div
                      key={service.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isConfigured
                          ? 'bg-green-500/5 border-green-500/30'
                          : hasValue
                          ? 'bg-violet-500/5 border-violet-500/30'
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 ${service.bgColor} rounded-lg flex-shrink-0`}>
                          <service.icon className={`w-5 h-5 ${service.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-white flex items-center gap-2">
                                {service.name}
                                {isConfigured && (
                                  <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">
                                    Connected
                                  </span>
                                )}
                              </h4>
                              <p className="text-xs text-slate-400 mt-0.5">{service.description}</p>
                            </div>
                            <a
                              href={service.docsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 flex-shrink-0"
                            >
                              Get Key
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>

                          {/* API Key Input */}
                          <div className="mt-3 flex gap-2">
                            <input
                              type="password"
                              value={apiKeys[service.id]}
                              onChange={(e) => handleApiKeyChange(service.id, e.target.value)}
                              className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 font-mono text-sm"
                              placeholder={service.placeholder}
                            />
                            {hasValue && !isConfigured && (
                              <button
                                type="button"
                                onClick={() => testService(service.id)}
                                disabled={isTesting}
                                className="px-3 py-2 bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                              >
                                {isTesting ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  'Test'
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Security Note */}
              <div className="flex items-start gap-2 text-xs text-slate-500 mt-4">
                <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>
                  Your API keys are encrypted and stored securely. We never share or log your keys. 
                  Get your keys from the{' '}
                  <a 
                    href="https://openwebninja.com/dashboard" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-violet-400 hover:underline"
                  >
                    OpenWeb Ninja Dashboard
                  </a>
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-white/20 text-slate-300 rounded-lg hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  disabled={loading || !hasAnyKeys}
                  className="flex-1 bg-gradient-to-r from-violet-600 to-pink-600 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : configuredCount > 0 ? (
                    'Update APIs'
                  ) : (
                    'Save API Keys'
                  )}
                </Button>
              </div>
            </form>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-4">
              <p className="text-slate-300 text-sm">
                OpenWeb Ninja provides access to the following e-commerce platforms for product research:
              </p>
              
              <div className="grid gap-4">
                {SERVICES.map((service) => (
                  <div
                    key={service.id}
                    className="p-4 bg-white/5 border border-white/10 rounded-xl"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 ${service.bgColor} rounded-lg`}>
                        <service.icon className={`w-5 h-5 ${service.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-white">{service.name}</h3>
                          {configuredServices[service.id] ? (
                            <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              Connected
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-0.5 bg-slate-500/20 text-slate-400 rounded-full">
                              Not connected
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-400 mt-1">{service.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-violet-500/10 border border-violet-500/30 rounded-xl mt-4">
                <h4 className="font-medium text-violet-300 mb-3">Research Capabilities</h4>
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
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-violet-400" />
                    Identify arbitrage opportunities between platforms
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
