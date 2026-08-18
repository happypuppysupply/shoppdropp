'use client'

import { motion } from 'framer-motion'
import { SingleRangeSlider } from '../components/RangeSlider'
import { OptionCard } from '../components/OptionCard'
import { PRIMARY_CHANNELS } from '../types'
import type { OnboardingData } from '../types'
import { TrendingUp, DollarSign, Target } from 'lucide-react'

interface MarketingStepProps {
  data: {
    monthlyBudget: number
    revenueGoal: number
    primaryChannel: string
  }
  onUpdate: (data: Partial<OnboardingData>) => void
}

export function MarketingStep({ data, onUpdate }: MarketingStepProps) {
  // Calculate projections
  const roas = 3.5 // Estimated return on ad spend
  const projectedRevenue = data.monthlyBudget * roas
  const roasRatio = (projectedRevenue / data.revenueGoal) * 100

  return (
    <div className="space-y-8">
      {/* Step header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">Marketing Strategy</h2>
        <p className="text-slate-400">Set your budget and primary growth channel</p>
      </div>

      {/* Monthly Budget */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-4"
      >
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-violet-400" />
          <h3 className="text-lg font-medium text-white">Monthly Ad Budget</h3>
        </div>
        <p className="text-sm text-slate-400">
          How much will you spend on advertising per month?
        </p>
        <SingleRangeSlider
          min={0}
          max={10000}
          value={data.monthlyBudget}
          onChange={(value) => onUpdate({ monthlyBudget: value })}
          prefix="$"
          step={100}
        />
        <div className="flex justify-between text-xs text-slate-500">
          <span>$0 (Organic only)</span>
          <span>$10,000+ (Aggressive)</span>
        </div>
      </motion.div>

      {/* Revenue Goal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-4"
      >
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-pink-400" />
          <h3 className="text-lg font-medium text-white">Monthly Revenue Goal</h3>
        </div>
        <p className="text-sm text-slate-400">
          What's your target monthly revenue?
        </p>
        <SingleRangeSlider
          min={1000}
          max={50000}
          value={data.revenueGoal}
          onChange={(value) => onUpdate({ revenueGoal: value })}
          prefix="$"
          step={500}
        />
        <div className="flex justify-between text-xs text-slate-500">
          <span>$1,000</span>
          <span>$50,000+</span>
        </div>
      </motion.div>

      {/* Projection Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="p-6 rounded-xl bg-gradient-to-br from-violet-500/10 to-pink-500/10 border border-violet-500/30"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-green-400" />
          <h4 className="font-medium text-white">Projected Performance</h4>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-xs text-slate-400 mb-1">Ad Spend</div>
            <div className="text-lg font-bold text-white">${data.monthlyBudget.toLocaleString()}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-400 mb-1">Est. Revenue</div>
            <div className="text-lg font-bold text-green-400">${projectedRevenue.toLocaleString()}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-400 mb-1">Goal Progress</div>
            <div className={`text-lg font-bold ${roasRatio >= 100 ? 'text-green-400' : 'text-yellow-400'}`}>
              {roasRatio.toFixed(0)}%
            </div>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-3 text-center">
          Based on estimated {roas}x ROAS. Actual results may vary.
        </p>
      </motion.div>

      {/* Primary Channel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-medium text-white">Primary Marketing Channel</h3>
        <p className="text-sm text-slate-400">
          Which channel will be your main growth driver?
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PRIMARY_CHANNELS.map((channel) => (
            <button
              key={channel.id}
              onClick={() => onUpdate({ primaryChannel: channel.id })}
              className={`
                p-4 rounded-xl border-2 text-center transition-all duration-200
                ${data.primaryChannel === channel.id
                  ? 'border-violet-500 bg-violet-500/10'
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                }
              `}
            >
              <div className="text-2xl mb-2">{channel.icon}</div>
              <div className={`text-sm font-medium ${data.primaryChannel === channel.id ? 'text-white' : 'text-slate-200'}`}>
                {channel.label}
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
