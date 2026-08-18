'use client'

import { motion } from 'framer-motion'
import { Bot, User, Terminal, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useState } from 'react'

interface FormOption {
  id: string
  label: string
  description?: string
  icon?: string
}

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
  formData?: {
    type: 'cards' | 'chips' | 'slider' | 'range' | 'connect'
    options?: FormOption[]
    multi?: boolean
    min?: number
    max?: number
    prefix?: string
    services?: string[]
  }
  onFormSubmit?: (value: any) => void
}

export function ChatMessage({ role, content, timestamp, formData, onFormSubmit }: ChatMessageProps) {
  const [selectedValue, setSelectedValue] = useState<string | string[] | null>(null)

  const renderForm = () => {
    if (!formData) return null

    switch (formData.type) {
      case 'cards':
        return (
          <div className="grid grid-cols-2 gap-2 mt-3">
            {formData.options?.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  setSelectedValue(opt.id)
                  onFormSubmit?.(opt.id)
                }}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedValue === opt.id
                    ? 'bg-violet-500/20 border-violet-500/50'
                    : 'bg-white/5 border-white/10 hover:border-violet-500/30'
                }`}
              >
                {opt.icon && <span className="text-2xl mb-1 block">{opt.icon}</span>}
                <div className="text-sm text-white font-medium">{opt.label}</div>
                {opt.description && (
                  <div className="text-xs text-slate-400 mt-1">{opt.description}</div>
                )}
              </button>
            ))}
          </div>
        )

      case 'chips':
        return (
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.options?.map((opt) => {
              const isSelected = Array.isArray(selectedValue) 
                ? selectedValue.includes(opt.id)
                : selectedValue === opt.id
              
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    if (formData.multi) {
                      const current = Array.isArray(selectedValue) ? selectedValue : []
                      const updated = current.includes(opt.id)
                        ? current.filter(id => id !== opt.id)
                        : [...current, opt.id]
                      setSelectedValue(updated)
                    } else {
                      setSelectedValue(opt.id)
                      onFormSubmit?.(opt.id)
                    }
                  }}
                  className={`px-3 py-2 rounded-full text-sm border transition-all ${
                    isSelected
                      ? 'bg-violet-500/20 border-violet-500/50 text-violet-300'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:border-violet-500/30'
                  }`}
                >
                  {opt.icon && <span className="mr-1">{opt.icon}</span>}
                  {opt.label}
                </button>
              )
            })}
            {formData.multi && Array.isArray(selectedValue) && selectedValue.length > 0 && (
              <Button
                onClick={() => onFormSubmit?.(selectedValue)}
                className="bg-violet-600 hover:bg-violet-500 ml-2"
                size="sm"
              >
                Continue
              </Button>
            )}
          </div>
        )

      case 'slider':
        return (
          <div className="mt-3 p-4 bg-white/5 rounded-lg border border-white/10">
            <input
              type="range"
              min={formData.min || 0}
              max={formData.max || 10}
              value={typeof selectedValue === 'number' ? selectedValue : 5}
              onChange={(e) => setSelectedValue(Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>{formData.min || 0}</span>
              <span className="text-white font-medium">{selectedValue || 5}</span>
              <span>{formData.max || 10}</span>
            </div>
            <Button
              onClick={() => onFormSubmit?.(selectedValue || 5)}
              className="w-full mt-3 bg-violet-600 hover:bg-violet-500"
              size="sm"
            >
              Continue
            </Button>
          </div>
        )

      case 'range':
        return (
          <div className="mt-3 p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="text-center text-2xl font-bold text-white mb-4">
              {formData.prefix}{selectedValue || ((formData.min || 0) + (formData.max || 100)) / 2}
            </div>
            <input
              type="range"
              min={formData.min || 0}
              max={formData.max || 100}
              step={10}
              value={typeof selectedValue === 'number' ? selectedValue : ((formData.min || 0) + (formData.max || 100)) / 2}
              onChange={(e) => setSelectedValue(Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
            />
            <Button
              onClick={() => onFormSubmit?.(selectedValue || ((formData.min || 0) + (formData.max || 100)) / 2)}
              className="w-full mt-3 bg-violet-600 hover:bg-violet-500"
              size="sm"
            >
              Continue
            </Button>
          </div>
        )

      case 'connect':
        return (
          <div className="mt-3 space-y-2">
            {formData.services?.map((service) => (
              <Card
                key={service}
                className="p-3 bg-white/5 border-white/10 hover:border-violet-500/30 cursor-pointer transition-all"
                onClick={() => onFormSubmit?.(service)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
                      <Terminal className="w-4 h-4 text-slate-400" />
                    </div>
                    <span className="text-white text-sm">{service}</span>
                  </div>
                  <Button size="sm" variant="outline" className="border-violet-500/30 text-violet-300">
                    Connect
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <div className={`flex gap-3 ${role === 'user' ? 'flex-row-reverse' : ''}`}>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            role === 'user' 
              ? 'bg-violet-500/20' 
              : 'bg-gradient-to-br from-violet-500 to-pink-500'
          }`}
        >
          {role === 'user' ? (
            <User className="w-4 h-4 text-violet-300" />
          ) : (
            <Bot className="w-4 h-4 text-white" />
          )}
        </div>
        <div className={`max-w-[80%] ${role === 'user' ? 'text-right' : ''}`}>
          <div
            className={`inline-block p-3 rounded-lg whitespace-pre-wrap text-left ${
              role === 'user'
                ? 'bg-violet-500/20 text-white'
                : 'bg-white/5 text-slate-200'
            }`}
          >
            {content}
          </div>
          {renderForm()}
        </div>
      </div>
      {timestamp && (
        <div className={`text-[10px] text-slate-500 ${role === 'user' ? 'text-right' : ''} px-11`}>
          {timestamp}
        </div>
      )}
    </motion.div>
  )
}
