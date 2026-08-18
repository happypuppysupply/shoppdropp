'use client'

import { motion } from 'framer-motion'
import { BrandVoiceRadar } from '../components/BrandVoiceRadar'
import { OptionCard } from '../components/OptionCard'
import { VISUAL_STYLES } from '../types'
import type { OnboardingData } from '../types'

interface BrandStepProps {
  data: {
    brandVoice: OnboardingData['brandVoice']
    visualStyle: string
  }
  onUpdateVoice: (key: 'playful' | 'professional' | 'luxury', value: number) => void
  onUpdateStyle: (style: string) => void
}

export function BrandStep({ data, onUpdateVoice, onUpdateStyle }: BrandStepProps) {
  return (
    <div className="space-y-8">
      {/* Step header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">Define your brand</h2>
        <p className="text-slate-400">Set your brand voice and visual style</p>
      </div>

      {/* Brand Voice Radar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-6 rounded-xl bg-white/5 border border-white/10"
      >
        <h3 className="text-lg font-medium text-white mb-4 text-center">Brand Voice Mix</h3>
        <p className="text-sm text-slate-400 text-center mb-4">
          Adjust how your brand should sound to customers
        </p>
        <BrandVoiceRadar
          values={data.brandVoice}
          onChange={onUpdateVoice}
        />
      </motion.div>

      {/* Visual Style */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-medium text-white">Visual Style</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {VISUAL_STYLES.map((style) => (
            <OptionCard
              key={style.id}
              label={style.label}
              description={style.description}
              selected={data.visualStyle === style.id}
              onClick={() => onUpdateStyle(style.id)}
              color={
                style.id === 'minimal' ? 'from-slate-500/20 to-gray-500/20' :
                style.id === 'bold' ? 'from-red-500/20 to-orange-500/20' :
                style.id === 'rustic' ? 'from-amber-500/20 to-yellow-500/20' :
                style.id === 'luxury' ? 'from-yellow-500/20 to-amber-500/20' :
                style.id === 'playful' ? 'from-pink-500/20 to-purple-500/20' :
                'from-blue-500/20 to-cyan-500/20'
              }
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
