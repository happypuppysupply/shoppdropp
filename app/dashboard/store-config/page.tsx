'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Store, 
  Target, 
  Package, 
  DollarSign, 
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Bot
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/app/hooks/useAuth'

interface StoreConfig {
  storeName: string
  niche: string
  targetMarket: string
  productTypes: string[]
  adBudget: number
  aiCreditBudget: number
  goals: string[]
}

const NICHES = [
  { id: 'pet', name: 'Pet Supplies', icon: '🐕', description: 'Dog/cat products, accessories, food' },
  { id: 'beauty', name: 'Beauty & Personal Care', icon: '💄', description: 'Skincare, makeup, grooming tools' },
  { id: 'fitness', name: 'Fitness & Health', icon: '💪', description: 'Workout gear, supplements, equipment' },
  { id: 'home', name: 'Home & Garden', icon: '🏠', description: 'Decor, kitchen, outdoor, organization' },
  { id: 'tech', name: 'Tech & Gadgets', icon: '📱', description: 'Electronics, accessories, smart devices' },
  { id: 'fashion', name: 'Fashion & Accessories', icon: '👕', description: 'Clothing, jewelry, bags, watches' },
  { id: 'baby', name: 'Baby & Kids', icon: '👶', description: 'Toys, clothing, nursery items' },
  { id: 'other', name: 'Other', icon: '✨', description: 'Something else unique' },
]

const TARGET_MARKETS = [
  { id: 'usa', name: 'United States', description: 'Largest market, higher competition' },
  { id: 'europe', name: 'Europe (EU)', description: 'UK, Germany, France, etc.' },
  { id: 'canada', name: 'Canada', description: 'English/French speaking' },
  { id: 'australia', name: 'Australia/NZ', description: 'English speaking, high purchasing power' },
  { id: 'global', name: 'Global/Multi', description: 'Multiple countries worldwide' },
]

const PRODUCT_TYPES = [
  { id: 'physical', name: 'Physical Products', description: 'Items shipped to customers' },
  { id: 'digital', name: 'Digital Products', description: 'Downloads, courses, templates' },
  { id: 'subscription', name: 'Subscription Box', description: 'Recurring monthly deliveries' },
  { id: 'print_on_demand', name: 'Print on Demand', description: 'Custom printed items' },
  { id: 'dropshipping', name: 'Dropshipping', description: 'Supplier ships directly' },
]

const GOALS = [
  { id: 'sales', name: 'Generate Sales', description: 'Focus on revenue and conversions' },
  { id: 'brand', name: 'Build Brand Awareness', description: 'Grow social presence and recognition' },
  { id: 'traffic', name: 'Drive Traffic', description: 'Get more visitors to the store' },
  { id: 'test', name: 'Test Products', description: 'Find winning products quickly' },
  { id: 'scale', name: 'Scale Existing', description: 'Grow what is already working' },
]

export default function StoreConfigPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const [step, setStep] = useState(1)
  const [isSaving, setIsSaving] = useState(false)
  const [config, setConfig] = useState<StoreConfig>({
    storeName: '',
    niche: '',
    targetMarket: '',
    productTypes: [],
    adBudget: 50,
    aiCreditBudget: 100,
    goals: []
  })

  const totalSteps = 5

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Save to backend/memory
      const response = await fetch('https://shoppdropp-api.onrender.com/api/store-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })
      
      if (response.ok) {
        // Navigate to AI workflow
        router.push('/dashboard?tab=ai-agent')
      } else {
        console.error('Failed to save config')
      }
    } catch (error) {
      console.error('Error saving config:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050508]">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    router.push('/auth')
    return null
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">What is your store name?</h2>
              <p className="text-slate-400">This helps the AI personalize your experience</p>
            </div>
            <div className="max-w-md mx-auto">
              <input
                type="text"
                value={config.storeName}
                onChange={(e) => setConfig({ ...config, storeName: e.target.value })}
                placeholder="e.g., Happy Puppy Supply"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              />
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Choose your niche</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {NICHES.map((niche) => (
                  <button
                    key={niche.id}
                    onClick={() => setConfig({ ...config, niche: niche.id })}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      config.niche === niche.id
                        ? 'bg-violet-500/20 border-violet-500/50'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-2xl mb-2">{niche.icon}</div>
                    <div className="font-medium text-sm">{niche.name}</div>
                    <div className="text-xs text-slate-400 mt-1">{niche.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Who is your target market?</h2>
              <p className="text-slate-400">The AI will optimize for this region</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {TARGET_MARKETS.map((market) => (
                <button
                  key={market.id}
                  onClick={() => setConfig({ ...config, targetMarket: market.id })}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    config.targetMarket === market.id
                      ? 'bg-violet-500/20 border-violet-500/50'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="font-medium">{market.name}</div>
                  <div className="text-sm text-slate-400 mt-1">{market.description}</div>
                </button>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">What type of products?</h2>
              <p className="text-slate-400">Select all that apply</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {PRODUCT_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => {
                    const newTypes = config.productTypes.includes(type.id)
                      ? config.productTypes.filter(t => t !== type.id)
                      : [...config.productTypes, type.id]
                    setConfig({ ...config, productTypes: newTypes })
                  }}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    config.productTypes.includes(type.id)
                      ? 'bg-violet-500/20 border-violet-500/50'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                      config.productTypes.includes(type.id)
                        ? 'bg-violet-500 border-violet-500'
                        : 'border-white/30'
                    }`}>
                      {config.productTypes.includes(type.id) && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{type.name}</div>
                      <div className="text-sm text-slate-400">{type.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Set your budgets</h2>
              <p className="text-slate-400">The AI will work within these limits</p>
            </div>
            
            <div className="max-w-md mx-auto space-y-6">
              <div className="bg-white/5 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-medium">Daily Ad Budget</h3>
                </div>
                <input
                  type="range"
                  min="10"
                  max="500"
                  step="10"
                  value={config.adBudget}
                  onChange={(e) => setConfig({ ...config, adBudget: parseInt(e.target.value) })}
                  className="w-full mb-2"
                />
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">$10/day</span>
                  <span className="text-emerald-400 font-bold">${config.adBudget}/day</span>
                  <span className="text-slate-400">$500/day</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Estimated monthly: ${config.adBudget * 30}
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-5 h-5 text-violet-400" />
                  <h3 className="font-medium">AI Credit Budget (per week)</h3>
                </div>
                <input
                  type="range"
                  min="50"
                  max="500"
                  step="10"
                  value={config.aiCreditBudget}
                  onChange={(e) => setConfig({ ...config, aiCreditBudget: parseInt(e.target.value) })}
                  className="w-full mb-2"
                />
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">$50/week</span>
                  <span className="text-violet-400 font-bold">${config.aiCreditBudget}/week</span>
                  <span className="text-slate-400">$500/week</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Covers AI tasks, product research, and ad creation
                </p>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">What are your goals?</h2>
              <p className="text-slate-400">Select your primary objectives</p>
            </div>
            <div className="grid grid-cols-1 gap-4 max-w-xl mx-auto">
              {GOALS.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => {
                    const newGoals = config.goals.includes(goal.id)
                      ? config.goals.filter(g => g !== goal.id)
                      : [...config.goals, goal.id]
                    setConfig({ ...config, goals: newGoals })
                  }}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    config.goals.includes(goal.id)
                      ? 'bg-violet-500/20 border-violet-500/50'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                      config.goals.includes(goal.id)
                        ? 'bg-violet-500 border-violet-500'
                        : 'border-white/30'
                    }`}>
                      {config.goals.includes(goal.id) && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{goal.name}</div>
                      <div className="text-sm text-slate-400">{goal.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 p-6 bg-violet-500/10 rounded-xl border border-violet-500/30">
              <div className="flex items-start gap-4">
                <Bot className="w-8 h-8 text-violet-400 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-2">AI Agent Ready</h3>
                  <p className="text-sm text-slate-400">
                    Your configuration will be saved and the AI will use these settings to 
                    optimize your store. You can update these anytime in settings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0a0a0f]">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Step 2: Store Configuration</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">Step {step} of {totalSteps}</span>
              <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-violet-500 transition-all"
                  style={{ width: `${(step / totalSteps) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <Card className="bg-[#111118] border-white/10 p-8">
          {renderStep()}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-8 border-t border-white/10">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {step < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={
                  (step === 1 && (!config.storeName || !config.niche)) ||
                  (step === 2 && !config.targetMarket) ||
                  (step === 3 && config.productTypes.length === 0)
                }
                className="bg-gradient-to-r from-violet-600 to-pink-600"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSave}
                disabled={config.goals.length === 0 || isSaving}
                className="bg-gradient-to-r from-violet-600 to-pink-600"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Start AI Workflow
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>
      </main>
    </div>
  )
}
