'use client'

import { motion } from 'framer-motion'
import { ChipSelect } from '../components/ChipSelect'
import { NICHE_ANGLES, AUDIENCES } from '../types'
import type { OnboardingData } from '../types'

interface AudienceStepProps {
  data: {
    nicheAngles: string[]
    targetAudience: string[]
  }
  onToggleNiche: (id: string) => void
  onToggleAudience: (id: string) => void
}

export function AudienceStep({ 
  data, 
  onToggleNiche, 
  onToggleAudience 
}: AudienceStepProps) {
  return (
    <div className="space-y-8">
      {/* Step header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">Who are your customers?</h2>
        <p className="text-slate-400">Define your niche angles and target audience</p>
      </div>

      {/* Niche Angles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Niche Angles (select up to 3)</h3>
          <span className="text-sm text-slate-500">
            {data.nicheAngles.length}/3 selected
          </span>
        </div>
        <ChipSelect
          options={NICHE_ANGLES.map(n => ({
            id: n.id,
            label: n.label,
            icon: n.icon,
          }))}
          selected={data.nicheAngles}
          onToggle={onToggleNiche}
          maxSelection={3}
          columns={2}
        />
      </motion.div>

      {/* Target Audience */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Target Audience (select up to 3)</h3>
          <span className="text-sm text-slate-500">
            {data.targetAudience.length}/3 selected
          </span>
        </div>
        <ChipSelect
          options={AUDIENCES}
          selected={data.targetAudience}
          onToggle={onToggleAudience}
          maxSelection={3}
          columns={2}
        />
      </motion.div>

      {/* Summary hint */}
      {(data.nicheAngles.length > 0 || data.targetAudience.length > 0) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/30"
        >
          <p className="text-sm text-violet-300">
            <span className="font-medium">Your positioning:</span>{' '}
            {data.nicheAngles.length > 0 && (
              <>
                A{' '}
                <span className="text-white">
                  {data.nicheAngles.map(id => NICHE_ANGLES.find(n => n.id === id)?.label).join(', ')}
                </span>{' '}
                brand
              </>
            )}
            {data.nicheAngles.length > 0 && data.targetAudience.length > 0 && ' for '}
            {data.targetAudience.length > 0 && (
              <span className="text-white">
                {data.targetAudience.map(id => AUDIENCES.find(a => a.id === id)?.label).join(', ')}
              </span>
            )}
          </p>
        </motion.div>
      )}
    </div>
  )
}
