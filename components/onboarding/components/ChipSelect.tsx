'use client'

import { Check } from 'lucide-react'

interface ChipOption {
  id: string
  label: string
  icon?: string
  description?: string
}

interface ChipSelectProps {
  options: ChipOption[]
  selected: string[]
  onToggle: (id: string) => void
  maxSelection?: number
  columns?: 2 | 3 | 4
}

export function ChipSelect({
  options,
  selected,
  onToggle,
  maxSelection,
  columns = 2,
}: ChipSelectProps) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
  }

  const isMaxReached = maxSelection ? selected.length >= maxSelection : false

  return (
    <div className={`grid ${gridCols[columns]} gap-3`}>
      {options.map((option) => {
        const isSelected = selected.includes(option.id)
        const isDisabled = !isSelected && isMaxReached

        return (
          <button
            key={option.id}
            onClick={() => !isDisabled && onToggle(option.id)}
            disabled={isDisabled}
            className={`
              relative p-4 rounded-xl border-2 text-left transition-all duration-200
              ${isSelected 
                ? 'border-violet-500 bg-violet-500/10 shadow-md shadow-violet-500/10' 
                : isDisabled
                  ? 'border-white/5 bg-white/5 opacity-50 cursor-not-allowed'
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10 cursor-pointer'
              }
            `}
          >
            <div className="flex items-start gap-3">
              {/* Selection box */}
              <div className={`
                w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center mt-0.5
                transition-colors
                ${isSelected 
                  ? 'bg-violet-500 border-violet-500' 
                  : 'border-white/30'
                }
              `}>
                {isSelected && <Check className="w-3 h-3 text-white" />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {option.icon && <span className="text-lg">{option.icon}</span>}
                  <span className={`font-medium ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                    {option.label}
                  </span>
                </div>
                {option.description && (
                  <p className="text-xs text-slate-400 mt-1">
                    {option.description}
                  </p>
                )}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
