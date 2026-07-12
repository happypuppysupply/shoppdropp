'use client'

import { useState } from 'react'
import { X, Brain, Loader2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'

const AI_PROVIDERS = [
  { 
    id: 'openai', 
    name: 'OpenAI', 
    description: 'GPT-4, GPT-4o, GPT-3.5',
    models: ['gpt-4o', 'gpt-4', 'gpt-3.5-turbo'],
    docsUrl: 'https://platform.openai.com/api-keys'
  },
  { 
    id: 'openrouter', 
    name: 'OpenRouter', 
    description: 'Kimi, Claude, Mistral, Llama + more',
    models: ['moonshotai/kimi-k2.5', 'anthropic/claude-3.5-sonnet', 'meta-llama/llama-3.1-405b'],
    docsUrl: 'https://openrouter.ai/keys'
  },
  { 
    id: 'anthropic', 
    name: 'Anthropic', 
    description: 'Claude 3.5 Sonnet, Claude 3 Opus',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229'],
    docsUrl: 'https://console.anthropic.com/settings/keys'
  },
  { 
    id: 'google', 
    name: 'Google AI', 
    description: 'Gemini Pro, Gemini Flash',
    models: ['gemini-1.5-pro', 'gemini-1.5-flash'],
    docsUrl: 'https://aistudio.google.com/app/apikey'
  },
  { 
    id: 'mistral', 
    name: 'Mistral AI', 
    description: 'Mistral Large, Medium, Small',
    models: ['mistral-large-latest', 'mistral-medium-latest'],
    docsUrl: 'https://console.mistral.ai/api-keys/'
  },
]

interface AIProviderModalProps {
  onClose: () => void
  onConfigured: () => void
}

export function AIProviderModal({ onClose, onConfigured }: AIProviderModalProps) {
  const [selectedProvider, setSelectedProvider] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<'provider' | 'model' | 'key'>('provider')

  const provider = AI_PROVIDERS.find(p => p.id === selectedProvider)

  const handleProviderSelect = (id: string) => {
    setSelectedProvider(id)
    setSelectedModel('')
    setStep('model')
  }

  const handleModelSelect = (model: string) => {
    setSelectedModel(model)
    setStep('key')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.ai.configure(selectedProvider, selectedModel, apiKey)
      onConfigured()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to configure AI provider')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full max-w-lg bg-[#111118] rounded-2xl border border-white/10 shadow-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-500/20 rounded-lg">
              <Brain className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Configure AI Provider</h2>
              <p className="text-sm text-slate-400">
                Step {step === 'provider' ? 1 : step === 'model' ? 2 : 3} of 3
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Step 1: Provider Selection */}
        {step === 'provider' && (
          <div className="space-y-3">
            <p className="text-slate-300 mb-4">
              Select the AI provider that will power your automation workers:
            </p>
            {AI_PROVIDERS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleProviderSelect(p.id)}
                className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/50 rounded-xl text-left transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white">{p.name}</h3>
                    <p className="text-sm text-slate-400">{p.description}</p>
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-white/20" />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Model Selection */}
        {step === 'model' && provider && (
          <div className="space-y-4">
            <button
              onClick={() => setStep('provider')}
              className="text-sm text-violet-400 hover:text-violet-300"
            >
              ← Back to providers
            </button>
            <p className="text-slate-300">
              Select a model from {provider.name}:
            </p>
            <div className="space-y-2">
              {provider.models.map((model) => (
                <button
                  key={model}
                  onClick={() => handleModelSelect(model)}
                  className={`w-full p-4 border rounded-xl text-left transition-all ${
                    selectedModel === model
                      ? 'bg-violet-500/20 border-violet-500'
                      : 'bg-white/5 border-white/10 hover:border-white/30'
                  }`}
                >
                  <code className="text-white font-mono text-sm">{model}</code>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: API Key */}
        {step === 'key' && provider && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <button
              type="button"
              onClick={() => setStep('model')}
              className="text-sm text-violet-400 hover:text-violet-300"
            >
              ← Back to models
            </button>
            
            <div className="p-4 bg-violet-500/10 border border-violet-500/30 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-violet-400" />
                <span className="font-medium text-white">{provider.name}</span>
              </div>
              <code className="text-sm text-violet-300 font-mono">{selectedModel}</code>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 font-mono text-sm"
                placeholder={`sk-... or ${provider.id}-...`}
                required
              />
              <div className="mt-2 flex items-start gap-2 text-xs text-slate-500">
                <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>
                  Your API key is encrypted and stored securely. We never share or log your keys.
                  Get your key from{' '}
                  <a 
                    href={provider.docsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-violet-400 hover:underline"
                  >
                    {provider.name} console
                  </a>
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-white/20 text-slate-300 rounded-lg hover:bg-white/5"
              >
                Cancel
              </button>
              <Button
                type="submit"
                disabled={loading || !apiKey.trim()}
                className="flex-1 bg-gradient-to-r from-violet-600 to-pink-600 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Save Configuration'
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}