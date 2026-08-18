'use client'

import { motion } from 'framer-motion'
import { OptionCard } from '../components/OptionCard'
import { CATEGORIES } from '../types'
import type { OnboardingData } from '../types'

interface CategoryStepProps {
  data: OnboardingData['category']
  onUpdate: (data: OnboardingData['category']) => void
}

export function CategoryStep({ data, onUpdate }: CategoryStepProps) {
  const selectedCategory = CATEGORIES.find(c => c.id === data.primary)

  return (
    <div className="space-y-6">
      {/* Step header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">What will you sell?</h2>
        <p className="text-slate-400">Choose your main product category to get started</p>
      </div>

      {/* Primary categories */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {CATEGORIES.map((category) => (
          <OptionCard
            key={category.id}
            icon={category.icon}
            label={category.label}
            selected={data.primary === category.id}
            onClick={() => onUpdate({ primary: category.id, subcategory: '' })}
            color={category.color}
          />
        ))}
      </motion.div>

      {/* Subcategories */}
      {selectedCategory && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          <div className="border-t border-white/10 pt-4">
            <h3 className="text-lg font-medium text-white mb-4">
              Select your niche within {selectedCategory.label}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedCategory.subcategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => onUpdate({ ...data, subcategory: sub.id })}
                  className={`
                    p-4 rounded-xl border-2 text-left transition-all duration-200
                    ${data.subcategory === sub.id
                      ? 'border-violet-500 bg-violet-500/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                    }
                  `}
                >
                  <h4 className={`font-medium ${data.subcategory === sub.id ? 'text-white' : 'text-slate-200'}`}>
                    {sub.label}
                  </h4>
                  <p className="text-sm text-slate-400 mt-1">{sub.description}</p>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
