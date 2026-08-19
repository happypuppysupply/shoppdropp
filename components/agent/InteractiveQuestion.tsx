'use client'

import { useState } from 'react'
import { CheckSquare, Square } from 'lucide-react'

interface Option {
  id: string
  label: string
  description?: string
}

interface InteractiveQuestionProps {
  question: string
  options: Option[]
  allowMultiple?: boolean
  onSubmit: (selected: string | string[]) => void
}

export function InteractiveQuestion({
  question,
  options,
  allowMultiple = false,
  onSubmit,
}: InteractiveQuestionProps) {
  const [selected, setSelected] = useState<string[]>([])

  const toggleOption = (id: string) => {
    if (allowMultiple) {
      setSelected((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      )
    } else {
      setSelected([id])
    }
  }

  return (
    <div className="bg-gradient-to-br from-violet-500/10 to-pink-500/10 border border-violet-500/20 p-4 rounded-2xl my-2">
      <p className="text-white font-medium mb-3">{question}</p>
      <div className="space-y-2">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => toggleOption(option.id)}
            className={`w-full flex items-start gap-3 p-3 rounded-xl border transition-all text-left ${
              selected.includes(option.id)
                ? 'bg-violet-500/20 border-violet-500/50'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="mt-0.5">
              {selected.includes(option.id) ? (
                <CheckSquare className="w-5 h-5 text-violet-400" />
              ) : (
                <Square className="w-5 h-5 text-slate-500" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">{option.label}</p>
              {option.description && (
                <p className="text-slate-400 text-xs mt-0.5">
                  {option.description}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
      <button
        onClick={() => onSubmit(allowMultiple ? selected : selected[0])}
        disabled={selected.length === 0}
        className="mt-4 w-full py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
      >
        {allowMultiple ? `Send ${selected.length} selected` : 'Confirm'}
      </button>
    </div>
  )
}
