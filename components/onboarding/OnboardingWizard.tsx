'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check, Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useOnboarding } from './hooks/useOnboarding'
import { ProgressBar } from './components/ProgressBar'
import { CategoryStep } from './steps/CategoryStep'
import { AudienceStep } from './steps/AudienceStep'
import { BrandStep } from './steps/BrandStep'
import { ProductStep } from './steps/ProductStep'
import { MarketingStep } from './steps/MarketingStep'
import { ConnectStep } from './steps/ConnectStep'
import { STEPS, type OnboardingData } from './types'

interface OnboardingWizardProps {
  storeId: string
  storeName: string
  onComplete?: () => void
  onClose?: () => void
}

export function OnboardingWizard({ storeId, storeName, onComplete, onClose }: OnboardingWizardProps) {
  const {
    data,
    currentStep,
    currentStepId,
    completedSteps,
    progress,
    isFirstStep,
    isLastStep,
    canProceed,
    updateData,
    updateNestedData,
    toggleArrayItem,
    goToStep,
    nextStep,
    prevStep,
    reset,
  } = useOnboarding()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://shoppdropp-api.onrender.com'

      const response = await fetch(`${API_URL}/api/onboarding/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          storeId,
          storeName,
          onboardingData: data,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save onboarding data')
      }

      setIsComplete(true)
      onComplete?.()
    } catch (error) {
      console.error('Onboarding submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStepId) {
      case 'category':
        return (
          <CategoryStep
            data={data.category}
            onUpdate={(category) => updateData('category', category)}
          />
        )
      case 'audience':
        return (
          <AudienceStep
            data={{
              nicheAngles: data.nicheAngles,
              targetAudience: data.targetAudience,
            }}
            onToggleNiche={(id) => toggleArrayItem('nicheAngles', id, 3)}
            onToggleAudience={(id) => toggleArrayItem('targetAudience', id, 3)}
          />
        )
      case 'brand':
        return (
          <BrandStep
            data={{
              brandVoice: data.brandVoice,
              visualStyle: data.visualStyle,
            }}
            onUpdateVoice={(key, value) => 
              updateNestedData('brandVoice', key, value)
            }
            onUpdateStyle={(style) => updateData('visualStyle', style)}
          />
        )
      case 'product':
        return (
          <ProductStep
            data={{
              pricing: data.pricing,
              productTypes: data.productTypes,
            }}
            onUpdatePricing={(pricing) => updateData('pricing', pricing)}
            onToggleProductType={(id) => toggleArrayItem('productTypes', id)}
          />
        )
      case 'marketing':
        return (
          <MarketingStep
            data={{
              monthlyBudget: data.monthlyBudget,
              revenueGoal: data.revenueGoal,
              primaryChannel: data.primaryChannel,
            }}
            onUpdate={(updates) => {
              Object.entries(updates).forEach(([key, value]) => {
                updateData(key as keyof OnboardingData, value)
              })
            }}
          />
        )
      case 'connect':
        return (
          <ConnectStep
            data={{
              shopifyConnected: data.shopifyConnected,
              shopifyStoreUrl: data.shopifyStoreUrl,
              suppliers: data.suppliers,
            }}
            onUpdate={(updates) => {
              Object.entries(updates).forEach(([key, value]) => {
                updateData(key as keyof OnboardingData, value)
              })
            }}
          />
        )
      default:
        return null
    }
  }

  // Completion screen
  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-12 space-y-6 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
          <Check className="w-10 h-10 text-green-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white">All Set! 🎉</h2>
          <p className="text-slate-400 max-w-md">
            Your store profile has been saved. The AI agent now has everything it needs to help you build and grow {storeName}.
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 max-w-md w-full">
          <h4 className="text-sm font-medium text-white mb-3">What happens next?</h4>
          <ul className="space-y-2 text-sm text-slate-400 text-left">
            <li className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
              AI will analyze your niche and suggest winning products
            </li>
            <li className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
              Automated pricing based on your margin targets
            </li>
            <li className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
              Marketing campaigns aligned with your budget
            </li>
          </ul>
        </div>
        <Button
          onClick={onClose}
          className="bg-violet-600 hover:bg-violet-500 text-white px-8"
        >
          Go to Dashboard
        </Button>
      </motion.div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Store Setup Wizard</h1>
            <p className="text-slate-400">Configure {storeName} for AI automation</p>
          </div>
          <div className="text-sm text-slate-500">
            Step {currentStep + 1} of {STEPS.length}
          </div>
        </div>
        
        <ProgressBar
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={goToStep}
        />
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStepId}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="min-h-[400px]"
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={isFirstStep}
          className="border-white/20 text-slate-300 hover:bg-white/5"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="flex items-center gap-3">
          {!isLastStep ? (
            <Button
              onClick={nextStep}
              disabled={!canProceed}
              className="bg-violet-600 hover:bg-violet-500 text-white"
            >
              Continue
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed || isSubmitting}
              className="bg-green-600 hover:bg-green-500 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Complete Setup
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
