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

export default function BuildProgressPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const [buildState, setBuildState] = useState<BuildState>({
    overallProgress: 0,
    currentStep: 0,
    status: 'idle',
    elapsedTime: 0,
    estimatedRemaining: 240,
    steps: BUILD_STEPS,
    logs: []
  })
  const [workerId, setWorkerId] = useState<string | null>(null)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Calculate progress based on actual worker status and logs
  const calculateProgress = useCallback((status: string, logs: string[]): { step: number; progress: number } => {
    if (status === 'running') return { step: 7, progress: 100 }
    if (status === 'error') return { step: buildState.currentStep, progress: 0 }
    
    // Parse logs to determine actual progress
    const logText = logs.join(' ').toLowerCase()
    
    if (logText.includes('health check') || logText.includes('service is active')) {
      return { step: 6, progress: 90 }
    }
    if (logText.includes('start services') || logText.includes('systemctl start')) {
      return { step: 5, progress: 75 }
    }
    if (logText.includes('configure environment') || logText.includes('.env')) {
      return { step: 4, progress: 60 }
    }
    if (logText.includes('install openclaw') || logText.includes('worker script')) {
      return { step: 3, progress: 45 }
    }
    if (logText.includes('configure ssh') || logText.includes('ssh') && logText.includes('connected')) {
      return { step: 2, progress: 30 }
    }
    if (logText.includes('install dependencies') || logText.includes('node.js') || logText.includes('apt-get')) {
      return { step: 1, progress: 15 }
    }
    if (logText.includes('provision start') || logText.includes('creating server')) {
      return { step: 0, progress: 5 }
    }
    
    return { step: 0, progress: 0 }
  }, [buildState.currentStep])

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

      // Calculate real progress
      const { step, progress } = calculateProgress(worker.status, logs)

      // Update steps based on actual progress
      const newSteps = [...BUILD_STEPS]
      for (let i = 0; i < newSteps.length; i++) {
        if (i < step) {
          newSteps[i].status = 'completed'
          newSteps[i].progress = 100
        } else if (i === step) {
          newSteps[i].status = 'in_progress'
          newSteps[i].progress = progress % 100
        } else {
          newSteps[i].status = 'pending'
          newSteps[i].progress = 0
        }
      }

      if (worker.status === 'error') {
        newSteps[step].status = 'error'
        setBuildState(prev => ({ 
          ...prev, 
          status: 'error',
          error: error || 'Provisioning failed',
          logs,
          steps: newSteps,
          currentStep: step,
          overallProgress: progress
        }))
        return
      }
      
      if (worker.status === 'running') {
        newSteps.forEach(s => { s.status = 'completed'; s.progress = 100 })
        setBuildState(prev => ({
          ...prev,
          status: 'running',
          steps: newSteps,
          currentStep: 7,
          overallProgress: 100,
          logs: [...logs, `${new Date().toLocaleTimeString()}: VPS worker is ready!`],
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
      
      // Provisioning/configuring - show real status
      setBuildState(prev => ({
        ...prev,
        status: worker.status as any,
        steps: newSteps,
        currentStep: step,
        overallProgress: progress,
        logs,
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
  }, [workerId, calculateProgress, router])

  // Start provisioning
  const startProvisioning = async () => {
    try {
      setBuildState(prev => ({
        ...prev,
        status: 'provisioning',
        logs: [`${new Date().toLocaleTimeString()}: Starting VPS provisioning...`],
        currentStep: 0,
        overallProgress: 5
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
            `${new Date().toLocaleTimeString()}: ${data.message}`
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

  // Timer for elapsed time only (not for simulated progress)
  useEffect(() => {
    if (buildState.status === 'idle' || buildState.status === 'running' || buildState.status === 'error') {
      return
    }

    const timer = setInterval(() => {
      setBuildState(prev => ({
        ...prev,
        elapsedTime: prev.elapsedTime + 1,
        estimatedRemaining: Math.max(0, prev.estimatedRemaining - 1)
      }))
    }, 1000)

    return () => clearInterval(timer)
  }, [buildState.status])

  // Poll for real status updates
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
              This takes about 3-5 minutes to set up.
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
                        : 'Building Your VPS Worker'}
                    </h1>
                    <p className="text-slate-400">
                      {buildState.status === 'running'
                        ? 'Your worker is online and ready for automation tasks.'
                        : buildState.status === 'error'
                        ? buildState.error || 'Something went wrong. Check the logs below.'
                        : 'Setting up your dedicated server. This may take a few minutes.'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-violet-400">
                      {buildState.overallProgress}%
                    </div>
                    <div className="text-sm text-slate-500">Complete</div>
                  </div>
                </div>

                <div className="h-3 bg-white/5 rounded-full overflow-hidden mb-8">
                  <div 
                    className="h-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all duration-500"
                    style={{ width: `${buildState.overallProgress}%` }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-white/5">
                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                      <Activity className="w-4 h-4" />
                      Current Task
                    </div>
                    <div className="font-medium">
                      {buildState.steps[buildState.currentStep]?.title || 'Waiting...'}
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
                      Estimated
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
                  {buildState.steps.map((step) => (
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
                      <div className="flex-1">
                        <h3 className={`font-medium ${
                          step.status === 'in_progress' ? 'text-violet-300' : ''
                        }`}>
                          {step.title}
                        </h3>
                        <p className="text-sm text-slate-400">{step.description}</p>
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
