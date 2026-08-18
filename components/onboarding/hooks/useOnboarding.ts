'use client'

import { useState, useCallback } from 'react'
import {
  OnboardingData,
  OnboardingStep,
  STEPS,
  DEFAULT_ONBOARDING_DATA,
} from '../types'

export function useOnboarding() {
  const [data, setData] = useState<OnboardingData>(DEFAULT_ONBOARDING_DATA)
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  const currentStepId = STEPS[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === STEPS.length - 1
  const progress = ((currentStep + 1) / STEPS.length) * 100

  const updateData = useCallback(<K extends keyof OnboardingData>(
    key: K,
    value: OnboardingData[K]
  ) => {
    setData(prev => ({ ...prev, [key]: value }))
  }, [])

  const updateNestedData = useCallback(<K extends keyof OnboardingData>(
    key: K,
    nestedKey: string,
    value: any
  ) => {
    setData(prev => {
      const currentValue = prev[key] as Record<string, any>
      return {
        ...prev,
        [key]: {
          ...currentValue,
          [nestedKey]: value,
        },
      }
    })
  }, [])

  const toggleArrayItem = useCallback(<K extends keyof OnboardingData>(
    key: K,
    item: string,
    maxItems?: number
  ) => {
    setData(prev => {
      const current = prev[key] as string[]
      if (current.includes(item)) {
        return {
          ...prev,
          [key]: current.filter(i => i !== item),
        }
      }
      if (maxItems && current.length >= maxItems) {
        return prev
      }
      return {
        ...prev,
        [key]: [...current, item],
      }
    })
  }, [])

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < STEPS.length) {
      setCurrentStep(step)
    }
  }, [])

  const nextStep = useCallback(() => {
    if (currentStep < STEPS.length - 1) {
      setCompletedSteps(prev => new Set(prev).add(currentStep))
      setCurrentStep(prev => prev + 1)
    }
  }, [currentStep])

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }, [currentStep])

  const reset = useCallback(() => {
    setData(DEFAULT_ONBOARDING_DATA)
    setCurrentStep(0)
    setCompletedSteps(new Set())
  }, [])

  // Validation for each step
  const isStepValid = useCallback((step: number = currentStep): boolean => {
    const stepId = STEPS[step]
    
    switch (stepId) {
      case 'category':
        return !!data.category.primary && !!data.category.subcategory
      
      case 'audience':
        return data.nicheAngles.length > 0 && data.targetAudience.length > 0
      
      case 'brand':
        return !!data.visualStyle
      
      case 'product':
        return data.productTypes.length > 0 && data.pricing.min < data.pricing.max
      
      case 'marketing':
        return !!data.primaryChannel && data.monthlyBudget > 0
      
      case 'connect':
        return data.shopifyConnected || data.suppliers.length > 0
      
      default:
        return true
    }
  }, [currentStep, data])

  const canProceed = isStepValid()

  return {
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
    isStepValid,
  }
}
