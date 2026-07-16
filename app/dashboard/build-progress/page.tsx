'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { 
  CheckCircle2, 
  Loader2, 
  Clock, 
  Cpu, 
  Server, 
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  Activity,
  Timer,
  Zap
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
  startTime?: string
  endTime?: string
}

interface BuildState {
  overallProgress: number
  currentStep: number
  status: 'idle' | 'provisioning' | 'configuring' | 'running' | 'error'
  elapsedTime: number // seconds
  estimatedRemaining: number // seconds
  steps: BuildStep[]
  logs: string[]
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
    estimatedRemaining: 180, // 3 minutes estimate
    steps: BUILD_STEPS,
    logs: []
  })
  const [workerId, setWorkerId] = useState<string | null>(null)
  const [serverInfo, setServerInfo] = useState<any>(null)

  // Format time as HH:MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Load worker status with detailed progress
  const loadStatus = useCallback(async () => {
    try {
      // Get workers list directly instead of from store
      const workers = await api.workers.list()
      const worker = workers[0] // Get first worker
      
      // If no worker yet, just return (might be creating)
      if (!worker) {
        console.log('No worker found yet, waiting...')
        // If we're not already provisioning, make sure status is idle
        if (buildState.status !== 'provisioning' && buildState.status !== 'configuring') {
          setBuildState(prev => ({ ...prev, status: 'idle' }))
        }
        return
      }

      // Only update workerId if it changed
      if (worker.id !== workerId) {
        setWorkerId(worker.id)
        setBuildState(prev => ({
          ...prev,
          logs: [...prev.logs, `${new Date().toLocaleTimeString()}: Worker found: ${worker.id.slice(0, 8)}...`]
        }))
      }

      // Update build state based on worker status
      if (worker.status === 'error') {
        setBuildState(prev => ({ ...prev, status: 'error' }))
        return
      }
      
      // Use detailed progress from worker if available
      const currentStep = worker.provisioning_step || 0
      const stepName = worker.provisioning_step_name || 'Initialize VPS'
      const progress = worker.provisioning_progress || 0
      
      // Map to build steps
      const newSteps = [...BUILD_STEPS]
      let overallProgress = 0
      
      if (worker.status === 'running') {
        // All steps complete
        newSteps.forEach((step, i) => {
          step.status = 'completed'
          step.progress = 100
        })
        overallProgress = 100
      } else if (worker.status === 'provisioning' || worker.status === 'configuring') {
        // Update steps based on current progress
        newSteps.forEach((step, i) => {
          if (i < currentStep - 1) {
            step.status = 'completed'
            step.progress = 100
          } else if (i === currentStep - 1) {
            step.status = 'in_progress'
            step.progress = progress
          } else {
            step.status = 'pending'
            step.progress = 0
          }
        })
        
        // Calculate overall progress
        overallProgress = Math.round(((currentStep - 1) * 100 + progress) / 8)
      }
      
      // Add log entry if we have one
      const newLogs = [...buildState.logs]
      if (worker.provisioning_logs) {
        try {
          const logs = JSON.parse(worker.provisioning_logs)
          if (Array.isArray(logs) && logs.length > 0) {
            const lastLog = logs[logs.length - 1]
            const logText = typeof lastLog === 'string' 
              ? lastLog 
              : `[${lastLog.timestamp}] Step ${lastLog.step}: ${lastLog.message}`
            if (!newLogs.includes(logText)) {
              newLogs.push(logText)
            }
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
      
      // Update server info if available
      if (worker.server_ip || worker.hetzner_server_id) {
        setServerInfo({
          ip: worker.server_ip,
          type: worker.hetzner_server_type || 'cpx12',
          cores: 1,
          memory: 2,
          disk: 40
        })
      }

      setBuildState(prev => ({
        ...prev,
        status: worker.status,
        steps: newSteps,
        currentStep: currentStep > 0 ? currentStep - 1 : 0,
        overallProgress,
        logs: newLogs.length > prev.logs.length ? newLogs : prev.logs
      }))
    } catch (error) {
      console.error('Failed to load status:', error)
    }
  }, [workerId, buildState.logs])

  // Start provisioning
  const startProvisioning = async () => {
    try {
      setBuildState(prev => ({
        ...prev,
        status: 'provisioning',
        logs: [...prev.logs, `${new Date().toLocaleTimeString()}: Starting VPS provisioning...`]
      }))

      // Call direct API to create worker and provision VPS
      const response = await api.vps.createAndProvision()
      
      if (response.workerId) {
        setWorkerId(response.workerId)
        setBuildState(prev => ({
          ...prev,
          logs: [
            ...prev.logs, 
            `${new Date().toLocaleTimeString()}: Worker created: ${response.workerId.slice(0, 8)}...`,
            `${new Date().toLocaleTimeString()}: ${response.message}`
          ]
        }))
      }
    } catch (error: any) {
      setBuildState(prev => ({
        ...prev,
        status: 'error',
        logs: [...prev.logs, `${new Date().toLocaleTimeString()}: Error - ${error.message}`]
      }))
    }
  }

  // Timer effect
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

  // Poll for status updates
  useEffect(() => {
    if (!isAuthenticated) return

    // Always try to load status - it will find worker if exists
    loadStatus()

    // Poll more aggressively during provisioning
    if (buildState.status === 'provisioning' || buildState.status === 'configuring' || !workerId) {
      const interval = setInterval(loadStatus, 3000) // Poll every 3 seconds
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
              <span>AI Agent Active</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {buildState.status === 'idle' ? (
          // Start screen
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500/20 to-pink-500/20 flex items-center justify-center">
              <Server className="w-10 h-10 text-violet-400" />
            </div>
            <h1 className="text-3xl font-bold mb-4">No VPS Worker Assigned</h1>
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
          // Build progress screen
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main progress area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hero card */}
              <Card className="bg-[#111118] border-white/10 p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-pink-500/20 flex items-center justify-center">
                    {buildState.status === 'running' ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    ) : buildState.status === 'error' ? (
                      <div className="w-6 h-6 rounded-full bg-red-500" />
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
                        ? 'Something went wrong. Check the logs below.'
                        : 'Sit back and relax. Our AI is setting up your dedicated server.'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-violet-400">
                      {buildState.overallProgress}%
                    </div>
                    <div className="text-sm text-slate-500">Complete</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-3 bg-white/5 rounded-full overflow-hidden mb-8">
                  <div 
                    className="h-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all duration-500"
                    style={{ width: `${buildState.overallProgress}%` }}
                  />
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-white/5">
                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                      <Activity className="w-4 h-4" />
                      Current Task
                    </div>
                    <div className="font-medium">
                      {buildState.steps[buildState.currentStep]?.title || 'Waiting...'}
                    </div>
                    <div className="text-xs text-violet-400 mt-1">
                      {buildState.steps[buildState.currentStep]?.progress || 0}% complete
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5">
                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                      <Timer className="w-4 h-4" />
                      Elapsed Time
                    </div>
                    <div className="font-mono text-lg">
                      {formatTime(buildState.elapsedTime)}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5">
                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                      <Clock className="w-4 h-4" />
                      Estimated Left
                    </div>
                    <div className="font-mono text-lg">
                      ~{formatTime(buildState.estimatedRemaining)}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Build steps */}
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
                          : 'opacity-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        step.status === 'completed' 
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : step.status === 'in_progress'
                          ? 'bg-violet-500/20 text-violet-400'
                          : 'bg-white/10 text-slate-500'
                      }`}>
                        {step.status === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : step.status === 'in_progress' ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <span className="text-sm font-medium">{step.id}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-medium ${
                            step.status === 'in_progress' ? 'text-violet-300' : ''
                          }`}>
                            {step.title}
                          </h3>
                          {step.status === 'in_progress' && (
                            <span className="text-xs text-violet-400">
                              {step.progress}%
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-400">{step.description}</p>
                        {step.status === 'in_progress' && (
                          <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-violet-500 transition-all"
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

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Live Activity Log */}
              <Card className="bg-[#111118] border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    Live Activity Log
                  </h3>
                  <span className="text-xs text-emerald-400">● Live</span>
                </div>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {buildState.logs.length === 0 ? (
                    <p className="text-sm text-slate-500 italic">No activity yet...</p>
                  ) : (
                    buildState.logs.map((log, i) => (
                      <div key={i} className="text-sm text-slate-300 border-l-2 border-violet-500/30 pl-3">
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </Card>

              {/* Server Info */}
              {serverInfo && (
                <Card className="bg-[#111118] border-white/10 p-6">
                  <h3 className="font-semibold mb-4">Server Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Type</span>
                      <span>{serverInfo.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">IP Address</span>
                      <span className="font-mono">{serverInfo.ip}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">vCPUs</span>
                      <span>{serverInfo.cores}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Memory</span>
                      <span>{serverInfo.memory}GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Disk</span>
                      <span>{serverInfo.disk}GB NVMe</span>
                    </div>
                  </div>
                </Card>
              )}

              {/* Actions */}
              {buildState.status === 'running' && (
                <Card className="bg-[#111118] border-white/10 p-6">
                  <h3 className="font-semibold mb-4">Actions</h3>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full border-white/20"
                      onClick={() => loadStatus()}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Refresh Status
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
