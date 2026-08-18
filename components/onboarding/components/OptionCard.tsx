'use client'

import { Check } from 'lucide-react'

interface OptionCardProps {
  icon?: string
  label: string
  description?: string
  selected?: boolean
  onClick: () => void
  color?: string
  disabled?: boolean
}

export function OptionCard({
  icon,
  label,
  description,
  selected,
  onClick,
  color = 'from-violet-500/20 to-pink-500/20',
  disabled,
}: OptionCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative p-4 rounded-xl border-2 text-left transition-all duration-200
        ${selected 
          ? 'border-violet-500 bg-violet-500/10 shadow-lg shadow-violet-500/20' 
          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {/* Selection indicator */}
      {selected && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
      
      {/* Icon or gradient background */}
      {icon ? (
        <div className={`
          w-12 h-12 rounded-lg mb-3 flex items-center justify-center text-2xl
          bg-gradient-to-br ${color}
        `}>
          {icon}
        </div>
      ) : (
        <div className={`
          w-12 h-12 rounded-lg mb-3
          bg-gradient-to-br ${color}
        `} />
      )}
      
      {/* Label */}
      <h3 className={`font-medium ${selected ? 'text-white' : 'text-slate-200'}`}>
        {label}
      </h3>
      
      {/* Description */}
      {description && (
        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
          {description}
        </p>
      )}
    </button>
  )
}
