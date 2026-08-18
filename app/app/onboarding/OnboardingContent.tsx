'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { OnboardingWizard } from '@/components/onboarding'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function OnboardingContent() {
  const searchParams = useSearchParams()
  const storeId = searchParams.get('storeId') || ''
  const storeName = searchParams.get('storeName') || 'Your Store'
  const [isComplete, setIsComplete] = useState(false)

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/app/ai-agent"
            className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-lg font-medium text-white">Store Onboarding</h1>
            <p className="text-sm text-slate-500">Configure your AI agent</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <OnboardingWizard
          storeId={storeId}
          storeName={storeName}
          onComplete={() => setIsComplete(true)}
        />
      </div>
    </div>
  )
}
