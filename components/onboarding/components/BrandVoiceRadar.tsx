'use client'

import { useState } from 'react'

interface BrandVoiceRadarProps {
  values: {
    playful: number
    professional: number
    luxury: number
  }
  onChange: (key: 'playful' | 'professional' | 'luxury', value: number) => void
}

export function BrandVoiceRadar({ values, onChange }: BrandVoiceRadarProps) {
  const dimensions = [
    { key: 'playful' as const, label: 'Playful', color: 'text-pink-400', bg: 'bg-pink-500' },
    { key: 'professional' as const, label: 'Professional', color: 'text-blue-400', bg: 'bg-blue-500' },
    { key: 'luxury' as const, label: 'Luxury', color: 'text-amber-400', bg: 'bg-amber-500' },
  ]

  // Calculate polygon points for the radar chart
  const size = 160
  const center = size / 2
  const maxRadius = size * 0.4

  const getPoint = (index: number, value: number) => {
    const angle = (index * 2 * Math.PI) / 3 - Math.PI / 2
    const radius = (value / 10) * maxRadius
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    }
  }

  const points = dimensions.map((d, i) => getPoint(i, values[d.key]))
  const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ')

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Radar chart visualization */}
      <div className="relative">
        <svg width={size} height={size} className="transform">
          {/* Background grid */}
          {[2, 4, 6, 8, 10].map((level) => {
            const radius = (level / 10) * maxRadius
            const circlePoints = dimensions.map((_, i) => {
              const angle = (i * 2 * Math.PI) / 3 - Math.PI / 2
              return {
                x: center + radius * Math.cos(angle),
                y: center + radius * Math.sin(angle),
              }
            })
            const d = `M ${circlePoints.map(p => `${p.x},${p.y}`).join(' L ')} Z`
            
            return (
              <path
                key={level}
                d={d}
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
            )
          })}

          {/* Axis lines */}
          {dimensions.map((_, i) => {
            const end = getPoint(i, 10)
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={end.x}
                y2={end.y}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
            )
          })}

          {/* Data polygon */}
          <polygon
            points={polygonPoints}
            fill="rgba(139, 92, 246, 0.3)"
            stroke="#8b5cf6"
            strokeWidth="2"
          />

          {/* Data points */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="4"
              fill="#8b5cf6"
            />
          ))}
        </svg>

        {/* Labels */}
        {dimensions.map((dim, i) => {
          const pos = getPoint(i, 12)
          return (
            <div
              key={dim.key}
              className={`absolute text-xs font-medium ${dim.color}`}
              style={{
                left: pos.x,
                top: pos.y,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {dim.label}
            </div>
          )
        })}
      </div>

      {/* Sliders */}
      <div className="w-full max-w-md space-y-4">
        {dimensions.map((dim) => (
          <div key={dim.key} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className={`text-sm font-medium ${dim.color}`}>{dim.label}</span>
              <span className="text-sm text-white">{values[dim.key]}/10</span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={values[dim.key]}
              onChange={(e) => onChange(dim.key, Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>Subtle</span>
              <span>Strong</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
