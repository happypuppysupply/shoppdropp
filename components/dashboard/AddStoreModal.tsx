'use client'

import { useState } from 'react'
import { X, Store, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'

interface AddStoreModalProps {
  onClose: () => void
  onStoreAdded: () => void
}

export function AddStoreModal({ onClose, onStoreAdded }: AddStoreModalProps) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.stores.create(name, url)
      onStoreAdded()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to create store')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full max-w-md bg-[#111118] rounded-2xl border border-white/10 shadow-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-500/20 rounded-lg">
              <Store className="w-5 h-5 text-violet-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Add Store</h2>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Store Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="My Shopify Store"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Store URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="https://my-store.myshopify.com"
              required
            />
            <p className="mt-1 text-xs text-slate-500">
              Your Shopify store URL (e.g., https://store.myshopify.com)
            </p>
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
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-violet-600 to-pink-600 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Add Store'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}