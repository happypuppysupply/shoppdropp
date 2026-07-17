'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { 
  CheckCircle2, 
  Loader2, 
  Clock, 
  Server, 
  Play,
  ChevronLeft,
  Activity,
  Timer,
  Zap,
  AlertCircle,
  Terminal
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/app/hooks/useAuth'
import { api } from '@/lib/api'

interface BuildStep {
  id: number
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'error'
  progress: number
}

interface BuildState {
  overallProgress: number
  currentStep: number
  status: 'idle' | 'provisioning' | 'configuring' | 'running' | 'error'
  elapsedTime: number
  estimatedRemaining: number
  steps: BuildStep[]
  logs: string[]
  error?: string
  serverInfo?: {
    ip?: string
    type?: string
    cores?: number
    memory?: number
    disk?: number
  }
  workerCreatedAt?: string
}

const BUILD_STEPS: BuildStep[] = [
  { id: 1, title: 'Initialize VPS', description: 'Creating server instance on Hetzner', status: 'pending', progress: 0 },
  { id: 2, title: 'Install Dependencies', description: 'Installing Node.js, Docker, and system packages', status: 'pending', progress: 0 },
  { id: 3, title: 'Configure SSH', description: 'Setting up secure access keys', status: 'pending', progress: 0 },
  { id: 4, title: 'Install OpenClaw', description: 'Downloading and installing OpenClaw agent', status: 'pending', progress: 0 },
  { id: 5, title: 'Configure Environment', description: 'Setting up API keys and store credentials', status: 'pending', progress: 0 },
  { id: 6, title: 'Start Services', description: 'Starting OpenClaw and WebSocket connection', status: 'pending', progress: 0 },
  { id: 7, title: 'Health Check', description: 'Verifying worker is operational', status: 'pending', progress: 0 },
  { id: 8, title: 'Ready', description: 'VPS worker is ready for tasks', status: 'pending', progress: 0 },
]

// Step timing configuration (in seconds)
const STEP_TIMINGS = [
  { step: 0, duration: 45, name: 'Initialize VPS' },      // 0-45s: Creating server
  { step: 1, duration: 90, name: 'Install Dependencies' }, // 45-135s: Installing packages
  { step: 2, duration: 30, name: 'Configure SSH' },       // 135-165s: SSH setup
  { step: 3, duration: 40, name: 'Install OpenClaw' },    // 165-205s: Installing OpenClaw
  { step: 4, duration: 30, name: 'Configure Environment' }, // 205-235s: Env setup
  { step: 5, duration: 40, name: 'Start Services' },      // 235-275s: Starting services
  { step: 6, duration: 30, name: 'Health Check' },        // 275-305s: Health check
  { step: 7, duration: 10, name: 'Ready' },               // 305s+: Ready
]

export default function BuildProgressPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const [buildState, setBuildState] = useState<BuildState>({
    overallProgress: 0,
    currentStep: 0,
    status: 'idle',
    elapsedTime: 0,
    estimatedRemaining: 300,
    steps: JSON.parse(JSON.stringify(BUILD_STEPS)),
    logs: []
  })
  const [workerId, setWorkerId] = useState<string | null>(null)
  const [startTime, setStartTime] = useState<number | null>(null)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Calculate which step we're on based on elapsed time
  const calculateStepFromElapsed = (elapsedSeconds: number): { step: number; stepProgress: number; overallProgress: number } => {
    let accumulatedTime = 0
    
    for (let i = 0; i < STEP_TIMINGS.length; i++) {
      const stepTiming = STEP_TIMINGS[i]
      
      if (elapsedSeconds < accumulatedTime + stepTiming.duration) {
        // We're in this step
        const stepElapsed = elapsedSeconds - accumulatedTime
        const stepProgress = Math.min(100, (stepElapsed / stepTiming.duration) * 100)
        const overallProgress = Math.min(99, (i / STEP_TIMINGS.length) * 100 + (stepProgress / STEP_TIMINGS.length))
        
        return { step: i, stepProgress, overallProgress }
      }
      
      accumulatedTime += stepTiming.duration
    }
    
    // All steps complete
    return { step: 7, stepProgress: 100, overallProgress: 100 }
  }

  // Update steps UI based on current step
  const updateStepsUI = (currentStep: number, stepProgress: number): BuildStep[] => {
    const newSteps = JSON.parse(JSON.stringify(BUILD_STEPS))
    
    for (let i = 0; i < newSteps.length; i++) {
      if (i < currentStep) {
        newSteps[i].status = 'completed'
        newSteps[i].progress = 100
      } else if (i === currentStep) {
        newSteps[i].status = 'in_progress'
        newSteps[i].progress = Math.round(stepProgress)
      } else {
        newSteps[i].status = 'pending'
        newSteps[i].progress = 0
      }
    }
    
    return newSteps
  }

  // Load real worker status from API
  const loadStatus = useCallback(async () => {
    try {
      const workers = await api.workers.list()
      const worker = workers[0]
      
      if (!worker) {
        setBuildState(prev => ({ ...prev, status: 'idle' }))
        return
      }

      if (worker.id !== workerId) {
        setWorkerId(worker.id)
        // Set start time when we first see the worker
        if (worker.created_at) {
          setStartTime(new Date(worker.created_at).getTime())
        }
      }

      // Fetch detailed provision status
      let provisionStatus: any = null
      try {
        const res = await fetch(`https://shoppdropp-api.onrender.com/api/vps-debug/provision-status/${worker.id}`)
        provisionStatus = await res.json()
      } catch (e) {
        console.log('Could not fetch provision status:', e)
      }

      const logs = provisionStatus?.logs || []
      const error = provisionStatus?.error

      // Calculate elapsed time
      const now = Date.now()
      const workerStart = startTime || (worker.created_at ? new Date(worker.created_at).getTime() : now)
      const elapsedSeconds = Math.floor((now - workerStart) / 1000)

      if (worker.status === 'error') {
        const newSteps = updateStepsUI(buildState.currentStep, 0)
        newSteps[buildState.currentStep].status = 'error'
        setBuildState(prev => ({ 
          ...prev, 
          status: 'error',
          error: error || 'Provisioning failed',
          logs: [...prev.logs, ...logs],
          steps: newSteps,
          elapsedTime: elapsedSeconds
        }))
        return
      }
      
      if (worker.status === 'running') {
        const newSteps = updateStepsUI(7, 100)
        setBuildState(prev => ({
          ...prev,
          status: 'running',
          steps: newSteps,
          currentStep: 7,
          overallProgress: 100,
          elapsedTime: elapsedSeconds,
          logs: [...prev.logs, ...logs, `${new Date().toLocaleTimeString()}: VPS worker is ready!`],
          serverInfo: worker.ip_address ? {
            ip: worker.ip_address,
            type: worker.hetzner_server_type || 'cpx12',
            cores: 1,
            memory: 2,
            disk: 40
          } : prev.serverInfo
        }))
        
        // Redirect to store configuration after success
        setTimeout(() => {
          router.push('/dashboard/store-config')
        }, 3000)
        return
      }
      
      // Provisioning/configuring - calculate progress based on elapsed time
      const { step, stepProgress, overallProgress } = calculateStepFromElapsed(elapsedSeconds)
      const newSteps = updateStepsUI(step, stepProgress)
      
      // Add step change logs
      const currentLogs = [...buildState.logs, ...logs]
      const stepNames = STEP_TIMINGS.map(s => s.name)
      if (step < stepNames.length && step !== buildState.currentStep) {
        currentLogs.push(`${new Date().toLocaleTimeString()}: ${stepNames[step]}...`)
      }
      
      setBuildState(prev => ({
        ...prev,
        status: worker.status as any,
        steps: newSteps,
        currentStep: step,
        overallProgress,
        elapsedTime: elapsedSeconds,
        estimatedRemaining: Math.max(0, 300 - elapsedSeconds),
        logs: currentLogs,
        serverInfo: worker.ip_address ? {
          ip: worker.ip_address,
          type: worker.hetzner_server_type || 'cpx12',
          cores: 1,
          memory: 2,
          disk: 40
        } : prev.serverInfo
      }))
    } catch (error) {
      console.error('Failed to load status:', error)
    }
  }, [workerId, startTime, buildState.currentStep, buildState.logs, router])

  // Start provisioning
  const startProvisioning = async () => {
    try {
      const now = Date.now()
      setStartTime(now)
      setBuildState(prev => ({
        ...prev,
        status: 'provisioning',
        logs: [`${new Date().toLocaleTimeString()}: Starting VPS provisioning...`, `${new Date().toLocaleTimeString()}: Initialize VPS...`],
        currentStep: 0,
        overallProgress: 0,
        steps: updateStepsUI(0, 5)
      }))

      const response = await fetch('https://shoppdropp-api.onrender.com/api/vps-debug/debug-provision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      const data = await response.json()
      
      if (data.workerId) {
        setWorkerId(data.workerId)
        setBuildState(prev => ({
          ...prev,
          logs: [
            ...prev.logs, 
            `${new Date().toLocaleTimeString()}: Worker created: ${data.workerId.slice(0, 8)}...`,
          ]
        }))
      } else {
        throw new Error(data.error || 'Failed to start provisioning')
      }
    } catch (error: any) {
      setBuildState(prev => ({
        ...prev,
        status: 'error',
        error: error.message,
        logs: [...prev.logs, `${new Date().toLocaleTimeString()}: Error - ${error.message}`]
      }))
    }
  }

  // Timer for elapsed time and progress updates
  useEffect(() => {
    if (buildState.status === 'idle' || buildState.status === 'running' || buildState.status === 'error') {
      return
    }

    const timer = setInterval(() => {
      loadStatus()
    }, 1000)

    return () => clearInterval(timer)
  }, [buildState.status, loadStatus])

  // Poll for status updates from API
  useEffect(() => {
    if (!isAuthenticated) return

    loadStatus()

    if (buildState.status === 'provisioning' || buildState.status === 'configuring' || !workerId) {
      const interval = setInterval(loadStatus, 5000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated, buildState.status, workerId, loadStatus])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050508]">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    )
  }

  if (!isAuthenticated) {
    router.push('/auth')
    return null
  }

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Dashboard
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/20 text-violet-400 text-sm">
              <Zap className="w-4 h-4" />
              <span>AI Agent Setup</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {buildState.status === 'idle' ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500/20 to-pink-500/20 flex items-center justify-center">
              <Server className="w-10 h-10 text-violet-400" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Step 1: Provision VPS Worker</h1>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Your store needs a dedicated VPS worker to run automation tasks. 
              This takes about 5 minutes to set up.
            </p>
            <Button 
              size="lg"
              onClick={startProvisioning}
              className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500"
            >
              <Play className="w-5 h-5 mr-2" />
              Provision VPS Worker
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-[#111118] border-white/10 p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-pink-500/20 flex items-center justify-center">
                    {buildState.status === 'running' ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    ) : buildState.status === 'error' ? (
                      <AlertCircle className="w-6 h-6 text-red-400" />
                    ) : (
                      <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold mb-1">
                      {buildState.status === 'running' 
                        ? 'VPS Worker Ready!' 
                        : buildState.status === 'error'
                        ? 'Provisioning Failed'
                        : `Step ${buildState.currentStep + 1}: ${BUILD_STEPS[buildState.currentStep]?.title}`}
                    </h1>
                    <p className="text-slate-400">
                      {buildState.status === 'running'
                        ? 'Your worker is online and ready for automation tasks.'
                        : buildState.status === 'error'
                        ? buildState.error || 'Something went wrong. Check the logs below.'
                        : BUILD_STEPS[buildState.currentStep]?.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-violet-400">
                      {Math.round(buildState.overallProgress)}%
                    </div>
                    <div className="text-sm text-slate-500">Complete</div>
                  </div>
                </div>

                <div className="h-3 bg-white/5 rounded-full overflow-hidden mb-8">
                  <div 
                    className="h-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all duration-1000"
                    style={{ width: `${buildState.overallProgress}%` }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-white/5">
                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                      <Activity className="w-4 h-4" />
                      Current Step
                    </div>
                    <div className="font-medium">
                      {buildState.currentStep + 1} of {BUILD_STEPS.length}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5">
                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                      <Timer className="w-4 h-4" />
                      Elapsed
                    </div>
                    <div className="font-mono text-lg">
                      {formatTime(buildState.elapsedTime)}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5">
                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                      <Clock className="w-4 h-4" />
                      Remaining
                    </div>
                    <div className="font-mono text-lg">
                      ~{formatTime(buildState.estimatedRemaining)}
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-[#111118] border-white/10 p-6">
                <h2 className="text-lg font-semibold mb-6">Build Steps</h2>
                <div className="space-y-4">
                  {buildState.steps.map((step, index) => (
                    <div 
                      key={step.id}
                      className={`flex items-start gap-4 p-4 rounded-xl transition-all ${
                        step.status === 'in_progress' 
                          ? 'bg-violet-500/10 border border-violet-500/30' 
                          : step.status === 'completed'
                          ? 'bg-white/5'
                          : step.status === 'error'
                          ? 'bg-red-500/10 border border-red-500/30'
                          : 'opacity-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        step.status === 'completed' 
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : step.status === 'in_progress'
                          ? 'bg-violet-500/20 text-violet-400'
                          : step.status === 'error'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-white/10 text-slate-500'
                      }`}>
                        {step.status === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : step.status === 'in_progress' ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : step.status === 'error' ? (
                          <AlertCircle className="w-5 h-5" />
                        ) : (
                          <span className="text-sm font-medium">{step.id}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-medium truncate ${
                            step.status === 'in_progress' ? 'text-violet-300' : ''
                          }`}>
                            {step.title}
                          </h3>
                          {step.status === 'in_progress' && (
                            <span className="text-xs text-violet-400 ml-2">
                              {step.progress}%
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-400">{step.description}</p>
                        {step.status === 'in_progress' && (
                          <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-violet-500 transition-all duration-500"
                              style={{ width: `${step.progress}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-[#111118] border-white/10 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-semibold">Live Logs</h3>
                  {(buildState.status === 'provisioning' || buildState.status === 'configuring') && (
                    <span className="ml-auto text-xs text-emerald-400 animate-pulse">● Live</span>
                  )}
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto font-mono text-sm">
                  {buildState.logs.length === 0 ? (
                    <p className="text-slate-500 italic">Waiting to start...</p>
                  ) : (
                    buildState.logs.map((log, i) => (
                      <div key={i} className="text-slate-300 border-l-2 border-violet-500/30 pl-3 py-1">
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </Card>

              {buildState.serverInfo?.ip && (
                <Card className="bg-[#111118] border-white/10 p-6">
                  <h3 className="font-semibold mb-4">Server Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">IP Address</span>
                      <span className="font-mono">{buildState.serverInfo.ip}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Type</span>
                      <span>{buildState.serverInfo.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Specs</span>
                      <span>{buildState.serverInfo.cores} vCPU • {buildState.serverInfo.memory}GB • {buildState.serverInfo.disk}GB</span>
                    </div>
                  </div>
                </Card>
              )}

              {buildState.status === 'error' && (
                <Button 
                  size="lg"
                  onClick={startProvisioning}
                  className="w-full bg-gradient-to-r from-violet-600 to-pink-600"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Retry Provisioning
                </Button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
