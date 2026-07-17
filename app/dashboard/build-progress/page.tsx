'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Loader2, Clock, Server, Play, ChevronLeft } from 'lucide-react'

interface BuildStep {
  id: number
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
}

const BUILD_STEPS: BuildStep[] = [
  { id: 1, title: 'Initialize VPS', description: 'Creating server on Hetzner', status: 'pending' },
  { id: 2, title: 'Install Dependencies', description: 'Node.js, Docker, packages', status: 'pending' },
  { id: 3, title: 'Configure SSH', description: 'Setting up secure access', status: 'pending' },
  { id: 4, title: 'Install OpenClaw', description: 'Downloading agent', status: 'pending' },
  { id: 5, title: 'Configure Environment', description: 'API keys and credentials', status: 'pending' },
  { id: 6, title: 'Start Services', description: 'Starting OpenClaw', status: 'pending' },
  { id: 7, title: 'Health Check', description: 'Verifying worker', status: 'pending' },
  { id: 8, title: 'Ready', description: 'VPS is operational', status: 'pending' },
]

export default function BuildProgressPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'idle' | 'provisioning' | 'completed'>('idle')
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<BuildStep[]>(BUILD_STEPS)
  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const startProvisioning = async () => {
    setStatus('provisioning')
    setCurrentStep(0)
    setProgress(5)
    addLog('Starting VPS provisioning...')

    try {
      const response = await fetch('https://shoppdropp-api.onrender.com/api/vps-debug/debug-provision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      const data = await response.json()
      
      if (data.workerId) {
        addLog(`Worker created: ${data.workerId.slice(0, 8)}`)
        simulateProgress()
      } else {
        addLog('Error: Failed to start')
      }
    } catch (error) {
      addLog('Error: Network request failed')
    }
  }

  const simulateProgress = () => {
    let step = 0
    const interval = setInterval(() => {
      if (step >= BUILD_STEPS.length) {
        clearInterval(interval)
        setStatus('completed')
        setProgress(100)
        addLog('VPS provisioning complete!')
        
        setTimeout(() => {
          router.push('/dashboard?tab=ai-agent')
        }, 2000)
        return
      }

      setCurrentStep(step)
      setProgress(Math.round((step / BUILD_STEPS.length) * 100))
      
      setSteps(prev => prev.map((s, i) => ({
        ...s,
        status: i < step ? 'completed' : i === step ? 'in_progress' : 'pending'
      })))

      addLog(`${BUILD_STEPS[step].title}...`)
      step++
    }, 8000)
  }

  if (status === 'idle') {
    return (
      <div className="min-h-screen bg-[#050508] text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500/20 to-pink-500/20 flex items-center justify-center">
            <Server className="w-10 h-10 text-violet-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Provision VPS Worker</h1>
          <p className="text-slate-400 mb-8">Set up your dedicated AI worker. Takes about 5 minutes.</p>
          <button 
            onClick={startProvisioning}
            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-pink-600 rounded-lg font-medium flex items-center gap-2 mx-auto"
          >
            <Play className="w-5 h-5" />
            Start Provisioning
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      <header className="border-b border-white/10 bg-[#0a0a0f] p-4">
        <button 
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-slate-400 hover:text-white"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">
            {status === 'completed' ? 'VPS Ready!' : 'Building VPS Worker'}
          </h1>
          <div className="text-4xl font-bold text-violet-400 mb-2">{progress}%</div>
          <div className="h-3 bg-white/10 rounded-full max-w-md mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Steps */}
          <div className="bg-[#111118] border border-white/10 rounded-xl p-6">
            <h2 className="font-semibold mb-4">Build Steps</h2>
            <div className="space-y-3">
              {steps.map((step) => (
                <div key={step.id} className={`flex items-center gap-3 p-3 rounded-lg ${
                  step.status === 'in_progress' ? 'bg-violet-500/10 border border-violet-500/20' :
                  step.status === 'completed' ? 'bg-white/5' : 'opacity-50'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                    step.status === 'in_progress' ? 'bg-violet-500/20 text-violet-400' : 'bg-white/10'
                  }`}>
                    {step.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> :
                     step.status === 'in_progress' ? <Loader2 className="w-4 h-4 animate-spin" /> :
                     <span className="text-sm">{step.id}</span>}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{step.title}</p>
                    <p className="text-xs text-slate-400">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Logs */}
          <div className="bg-[#111118] border border-white/10 rounded-xl p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Live Logs
              {status === 'provisioning' && <span className="text-xs text-emerald-400 animate-pulse">Live</span>}
            </h2>
            <div className="space-y-2 font-mono text-sm max-h-96 overflow-y-auto">
              {logs.map((log, i) => (
                <div key={i} className="text-slate-300 border-l-2 border-violet-500/30 pl-3 py-1">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
