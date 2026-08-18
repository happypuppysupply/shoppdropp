'use client'

import { motion } from 'framer-motion'
import { DualRangeSlider, SingleRangeSlider } from '../components/RangeSlider'
import { ChipSelect } from '../components/ChipSelect'
import { PRODUCT_TYPES } from '../types'
import type { OnboardingData } from '../types'

interface ProductStepProps {
  data: {
    pricing: OnboardingData['pricing']
    productTypes: string[]
  }
  onUpdatePricing: (pricing: OnboardingData['pricing']) => void
  onToggleProductType: (id: string) => void
}

export function ProductStep({ data, onUpdatePricing, onToggleProductType }: ProductStepProps) {
  const avgPrice = (data.pricing.min + data.pricing.max) / 2
  const marginAmount = avgPrice * (data.pricing.targetMargin / 100)
  const costPrice = avgPrice - marginAmount

  return (
    <div className="space-y-8">
      {/* Step header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">Product Strategy</h2>
        <p className="text-slate-400">Define your pricing and product approach</p>
      </div>

      {/* Product Types */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-medium text-white">Product Types</h3>
        <ChipSelect
          options={PRODUCT_TYPES}
          selected={data.productTypes}
          onToggle={onToggleProductType}
          columns={2}
        />
      </motion.div>

      {/* Price Range */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-4"
      >
        <h3 className="text-lg font-medium text-white">Price Range</h3>
        <p className="text-sm text-slate-400">
          Set your target price range for products
        </p>
        <DualRangeSlider
          min={10}
          max={500}
          minValue={data.pricing.min}
          maxValue={data.pricing.max}
          onChange={(min, max) => onUpdatePricing({ ...data.pricing, min, max })}
          prefix="$"
        />
      </motion.div>

      {/* Target Margin */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-4"
      >
        <h3 className="text-lg font-medium text-white">Target Margin</h3>
        <p className="text-sm text-slate-400">
          What profit margin do you aim for? (Industry standard: 40-60%)
        </p>
        <SingleRangeSlider
          min={20}
          max={80}
          value={data.pricing.targetMargin}
          onChange={(value) => onUpdatePricing({ ...data.pricing, targetMargin: value })}
          suffix="%"
        />
      </motion.div>

      {/* Live Calculator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="p-6 rounded-xl bg-gradient-to-br from-violet-500/10 to-pink-500/10 border border-violet-500/30"
      >
        <h4 className="text-sm font-medium text-violet-300 mb-3">Profit Calculator Preview</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs text-slate-400 mb-1">Avg Sale Price</div>
            <div className="text-xl font-bold text-white">${avgPrice.toFixed(0)}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400 mb-1">Est. Cost</div>
            <div className="text-xl font-bold text-slate-400">${costPrice.toFixed(0)}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400 mb-1">Est. Profit</div>
            <div className="text-xl font-bold text-green-400">${marginAmount.toFixed(0)}</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
