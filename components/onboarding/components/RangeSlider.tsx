'use client'

import { useState, useCallback, useEffect } from 'react'

interface DualRangeSliderProps {
  min: number
  max: number
  minValue: number
  maxValue: number
  onChange: (min: number, max: number) => void
  prefix?: string
  suffix?: string
  step?: number
}

export function DualRangeSlider({
  min,
  max,
  minValue,
  maxValue,
  onChange,
  prefix = '$',
  suffix = '',
  step = 1,
}: DualRangeSliderProps) {
  const [localMin, setLocalMin] = useState(minValue)
  const [localMax, setLocalMax] = useState(maxValue)
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null)

  useEffect(() => {
    setLocalMin(minValue)
    setLocalMax(maxValue)
  }, [minValue, maxValue])

  const getPercentage = useCallback((value: number) => {
    return ((value - min) / (max - min)) * 100
  }, [min, max])

  const getValueFromPercentage = useCallback((percentage: number) => {
    const value = min + (percentage / 100) * (max - min)
    return Math.round(value / step) * step
  }, [min, max, step])

  const handleMouseDown = (handle: 'min' | 'max') => (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(handle)
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return

    const rect = (e.target as HTMLElement).closest('.range-slider')?.getBoundingClientRect()
    if (!rect) return

    const percentage = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    const value = getValueFromPercentage(percentage)

    if (isDragging === 'min') {
      const newMin = Math.min(value, localMax - step)
      setLocalMin(newMin)
      onChange(newMin, localMax)
    } else {
      const newMax = Math.max(value, localMin + step)
      setLocalMax(newMax)
      onChange(localMin, newMax)
    }
  }, [isDragging, localMin, localMax, step, onChange, getValueFromPercentage])

  const handleMouseUp = useCallback(() => {
    setIsDragging(null)
  }, [])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  const minPercent = getPercentage(localMin)
  const maxPercent = getPercentage(localMax)

  return (
    <div className="range-slider w-full py-4">
      {/* Track */}
      <div className="relative h-2 bg-white/10 rounded-full">
        {/* Filled range */}
        <div
          className="absolute h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />

        {/* Min handle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform"
          style={{ left: `calc(${minPercent}% - 10px)` }}
          onMouseDown={handleMouseDown('min')}
        />

        {/* Max handle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform"
          style={{ left: `calc(${maxPercent}% - 10px)` }}
          onMouseDown={handleMouseDown('max')}
        />
      </div>

      {/* Values */}
      <div className="flex justify-between mt-3 text-sm">
        <div className="text-slate-400">
          Min: <span className="text-white font-medium">{prefix}{localMin}{suffix}</span>
        </div>
        <div className="text-slate-400">
          Max: <span className="text-white font-medium">{prefix}{localMax}{suffix}</span>
        </div>
      </div>
    </div>
  )
}

interface SingleRangeSliderProps {
  min: number
  max: number
  value: number
  onChange: (value: number) => void
  prefix?: string
  suffix?: string
  step?: number
  showLabels?: boolean
  labels?: string[]
}

export function SingleRangeSlider({
  min,
  max,
  value,
  onChange,
  prefix = '',
  suffix = '',
  step = 1,
  showLabels,
  labels,
}: SingleRangeSliderProps) {
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className="w-full py-4">
      {/* Track */}
      <div className="relative h-2 bg-white/10 rounded-full">
        {/* Filled portion */}
        <div
          className="absolute h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full"
          style={{ width: `${percentage}%` }}
        />

        {/* Handle */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {/* Visual handle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg pointer-events-none"
          style={{ left: `calc(${percentage}% - 10px)` }}
        />
      </div>

      {/* Value display */}
      <div className="text-center mt-3">
        <span className="text-2xl font-bold text-white">
          {prefix}{value.toLocaleString()}{suffix}
        </span>
      </div>

      {/* Labels */}
      {showLabels && labels && (
        <div className="flex justify-between mt-2 text-xs text-slate-500">
          {labels.map((label, i) => (
            <span key={i}>{label}</span>
          ))}
        </div>
      )}
    </div>
  )
}
