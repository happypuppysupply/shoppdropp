'use client'

import { STEPS, STEP_LABELS, OnboardingStep } from '../types'
import { Check } from 'lucide-react'

interface ProgressBarProps {
  currentStep: number
  completedSteps: Set<number>
  onStepClick?: (step: number) => void
}

export function ProgressBar({ currentStep, completedSteps, onStepClick }: ProgressBarProps) {
  return (
    <div className="w-full">
      {/* Progress line */}
      <div className="relative mb-4">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2" />
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-violet-500 to-pink-500 -translate-y-1/2 transition-all duration-300"
          style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
        />
        
        {/* Step indicators */}
        <div className="relative flex justify-between">
          {STEPS.map((step, index) => {
            const isCompleted = completedSteps.has(index) || index < currentStep
            const isCurrent = index === currentStep
            const isClickable = isCompleted || index <= currentStep + 1
            
            return (
              <button
                key={step}
                onClick={() => isClickable && onStepClick?.(index)}
                disabled={!isClickable}
                className={`
                  flex flex-col items-center gap-2 transition-all
                  ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
                `}
              >
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    transition-all duration-200 border-2
                    ${isCurrent 
                      ? 'bg-violet-500 border-violet-500 text-white shadow-lg shadow-violet-500/30' 
                      : isCompleted
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'bg-[#111118] border-white/20 text-slate-400'
                    }
                  `}
                >
                  {isCompleted && !isCurrent ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`
                    text-xs hidden sm:block max-w-[80px] text-center leading-tight
                    ${isCurrent ? 'text-violet-400 font-medium' : 'text-slate-500'}
                  `}
                >
                  {STEP_LABELS[step]}
                </span>
              </button>
            )
          })}
        </div>
      </div>
      
      {/* Mobile step label */}
      <div className="sm:hidden text-center">
        <span className="text-sm text-violet-400 font-medium">
          Step {currentStep + 1}: {STEP_LABELS[STEPS[currentStep]]}
        </span>
      </div>
    </div>
  )
}
