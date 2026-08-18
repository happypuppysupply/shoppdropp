'use client'

import { motion } from 'framer-motion'
import { Check, ExternalLink, Store, Package } from 'lucide-react'
import { ChipSelect } from '../components/ChipSelect'
import { SUPPLIERS } from '../types'
import type { OnboardingData } from '../types'

interface ConnectStepProps {
  data: {
    shopifyConnected: boolean
    shopifyStoreUrl?: string
    suppliers: string[]
  }
  onUpdate: (data: Partial<OnboardingData>) => void
}

export function ConnectStep({ data, onUpdate }: ConnectStepProps) {
  return (
    <div className="space-y-8">
      {/* Step header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">Connect Your Platforms</h2>
        <p className="text-slate-400">Link your store and choose suppliers</p>
      </div>

      {/* Shopify Connection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3">
          <Store className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-medium text-white">Shopify Store</h3>
        </div>

        {data.shopifyConnected ? (
          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Check className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-white font-medium">Connected</p>
                <p className="text-sm text-slate-400">{data.shopifyStoreUrl || 'your-store.myshopify.com'}</p>
              </div>
            </div>
            <button
              onClick={() => onUpdate({ shopifyConnected: false, shopifyStoreUrl: undefined })}
              className="text-sm text-red-400 hover:text-red-300"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-6 rounded-xl bg-white/5 border border-white/10 border-dashed text-center">
              <Store className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <h4 className="text-white font-medium mb-2">Connect Shopify Store</h4>
              <p className="text-sm text-slate-400 mb-4">
                Link your Shopify store to enable product sync, inventory management, and automated pricing
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    // Simulate OAuth connection
                    onUpdate({ shopifyConnected: true, shopifyStoreUrl: 'your-store.myshopify.com' })
                  }}
                  className="px-6 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                  <Store className="w-4 h-4" />
                  Connect Shopify
                </button>
                <button
                  onClick={() => onUpdate({ shopifyConnected: true })}
                  className="px-6 py-2.5 border border-white/20 hover:border-white/40 text-slate-300 rounded-lg font-medium transition-colors"
                >
                  Skip for now
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Suppliers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3">
          <Package className="w-5 h-5 text-violet-400" />
          <h3 className="text-lg font-medium text-white">Suppliers</h3>
          <span className="text-sm text-slate-500">
            {data.suppliers.length} selected
          </span>
        </div>
        <p className="text-sm text-slate-400">
          Choose your suppliers or sourcing method. You can add more later.
        </p>
        <ChipSelect
          options={SUPPLIERS}
          selected={data.suppliers}
          onToggle={(id) => {
            const current = data.suppliers
            if (current.includes(id)) {
              onUpdate({ suppliers: current.filter(s => s !== id) })
            } else {
              onUpdate({ suppliers: [...current, id] })
            }
          }}
          columns={2}
        />
      </motion.div>

      {/* Summary */}
      {(data.shopifyConnected || data.suppliers.length > 0) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/30"
        >
          <h4 className="text-sm font-medium text-violet-300 mb-2">Setup Summary</h4>
          <ul className="space-y-1 text-sm text-slate-300">
            {data.shopifyConnected && (
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                Shopify store connected
              </li>
            )}
            {data.suppliers.length > 0 && (
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                {data.suppliers.length} supplier{data.suppliers.length > 1 ? 's' : ''} selected
              </li>
            )}
          </ul>
        </motion.div>
      )}
    </div>
  )
}
