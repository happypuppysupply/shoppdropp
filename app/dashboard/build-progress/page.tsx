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

  // Simulated progress for visual feedback during provisioning
  const simulateProgress = useCallback(() => {
    setBuildState(prev => {
      if (prev.status !== 'provisioning' && prev.status !== 'configuring') return prev
      
      const elapsed = prev.elapsedTime
      const newSteps = [...prev.steps]
      let currentStepIndex = 0
      let overallProgress = 0
      
      // Simulate step progression based on elapsed time
      // Total estimated time: ~3-4 minutes (180-240 seconds)
      if (elapsed < 30) {
        // Step 1: Initialize VPS (0-30s)
        currentStepIndex = 0
        newSteps[0].status = 'in_progress'
        newSteps[0].progress = Math.min(100, (elapsed / 30) * 100)
        overallProgress = Math.round((elapsed / 30) * 15)
      } else if (elapsed < 90) {
        // Step 2: Install Dependencies (30-90s)
        currentStepIndex = 1
        newSteps[0].status = 'completed'
        newSteps[0].progress = 100
        newSteps[1].status = 'in_progress'
        newSteps[1].progress = Math.min(100, ((elapsed - 30) / 60) * 100)
        overallProgress = 15 + Math.round(((elapsed - 30) / 60) * 15)
      } else if (elapsed < 110) {
        // Step 3: Configure SSH (90-110s)
        currentStepIndex = 2
        newSteps[0].status = 'completed'
        newSteps[0].progress = 100
        newSteps[1].status = 'completed'
        newSteps[1].progress = 100
        newSteps[2].status = 'in_progress'
        newSteps[2].progress = Math.min(100, ((elapsed - 90) / 20) * 100)
        overallProgress = 30 + Math.round(((elapsed - 90) / 20) * 5)
      } else if (elapsed < 140) {
        // Step 4: Install OpenClaw (110-140s)
        currentStepIndex = 3
        newSteps[0].status = 'completed'
        newSteps[0].progress = 100
        newSteps[1].status = 'completed'
        newSteps[1].progress = 100
        newSteps[2].status = 'completed'
        newSteps[2].progress = 100
        newSteps[3].status = 'in_progress'
        newSteps[3].progress = Math.min(100, ((elapsed - 110) / 30) * 100)
        overallProgress = 35 + Math.round(((elapsed - 110) / 30) * 15)
      } else if (elapsed < 170) {
        // Step 5: Configure Environment (140-170s)
        currentStepIndex = 4
        for (let i = 0; i <= 3; i++) {
          newSteps[i].status = 'completed'
          newSteps[i].progress = 100
        }
        newSteps[4].status = 'in_progress'
        newSteps[4].progress = Math.min(100, ((elapsed - 140) / 30) * 100)
        overallProgress = 50 + Math.round(((elapsed - 140) / 30) * 15)
      } else if (elapsed < 200) {
        // Step 6: Start Services (170-200s)
        currentStepIndex = 5
        for (let i = 0; i <= 4; i++) {
          newSteps[i].status = 'completed'
          newSteps[i].progress = 100
        }
        newSteps[5].status = 'in_progress'
        newSteps[5].progress = Math.min(100, ((elapsed - 170) / 30) * 100)
        overallProgress = 65 + Math.round(((elapsed - 170) / 30) * 15)
      } else if (elapsed < 230) {
        // Step 7: Health Check (200-230s)
        currentStepIndex = 6
        for (let i = 0; i <= 5; i++) {
          newSteps[i].status = 'completed'
          newSteps[i].progress = 100
        }
        newSteps[6].status = 'in_progress'
        newSteps[6].progress = Math.min(100, ((elapsed - 200) / 30) * 100)
        overallProgress = 80 + Math.round(((elapsed - 200) / 30) * 15)
      } else {
        // Step 8: Ready (230s+)
        currentStepIndex = 7
        for (let i = 0; i <= 6; i++) {
          newSteps[i].status = 'completed'
          newSteps[i].progress = 100
        }
        newSteps[7].status = 'in_progress'
        newSteps[7].progress = Math.min(100, ((elapsed - 230) / 20) * 100)
        overallProgress = 95 + Math.round(((elapsed - 230) / 20) * 5)
      }
      
      // Generate logs based on current step
      const newLogs = [...prev.logs]
      const stepMessages = [
        'Creating server instance on Hetzner...',
        'Installing Node.js, Docker, and system packages...',
        'Setting up secure access keys...',
        'Downloading and installing OpenClaw agent...',
        'Setting up API keys and store credentials...',
        'Starting OpenClaw and WebSocket connection...',
        'Verifying worker is operational...',
        'VPS worker is ready for tasks'
      ]
      
      // Add log entry when step changes
      const lastLog = newLogs[newLogs.length - 1]
      const expectedLog = stepMessages[currentStepIndex]
      if (!lastLog?.includes(expectedLog)) {
        newLogs.push(`${new Date().toLocaleTimeString()}: ${expectedLog}`)
      }
      
      return {
        ...prev,
        steps: newSteps,
        currentStep: currentStepIndex,
        overallProgress: Math.min(99, overallProgress), // Cap at 99% until confirmed running
        logs: newLogs
      }
    })
  }, [])

  // Load worker status with detailed logs
  const loadStatus = useCallback(async () => {
    try {
      // Get workers list
      const workers = await api.workers.list()
      const worker = workers[0] // Get first worker
      
      // If no worker yet, just return (might be creating)
      if (!worker) {
        if (buildState.status !== 'provisioning' && buildState.status !== 'configuring') {
          setBuildState(prev => ({ ...prev, status: 'idle' }))
        }
        return
      }

      // Update workerId if it changed
      if (worker.id !== workerId) {
        setWorkerId(worker.id)
      }

      // Fetch detailed provision status from new endpoint
      let provisionStatus: any = null
      if (worker.status === 'provisioning' || worker.status === 'configuring') {
        try {
          const res = await fetch(`https://shoppdropp-api.onrender.com/api/vps-debug/provision-status/${worker.id}`)
          provisionStatus = await res.json()
        } catch (e) {
          console.log('Could not fetch provision status:', e)
        }
      }

      // Update based on worker status
      if (worker.status === 'error') {
        setBuildState(prev => ({ 
          ...prev, 
          status: 'error',
          logs: provisionStatus?.logs ? [...prev.logs, ...provisionStatus.logs] : prev.logs
        }))
        return
      }
      
      if (worker.status === 'running') {
        const newSteps = [...BUILD_STEPS]
        newSteps.forEach((step) => {
          step.status = 'completed'
          step.progress = 100
        })
        setBuildState(prev => ({
          ...prev,
          status: 'running',
          steps: newSteps,
          currentStep: 7,
          overallProgress: 100,
          logs: provisionStatus?.logs 
            ? [...prev.logs, ...provisionStatus.logs, `${new Date().toLocaleTimeString()}: VPS worker is ready!`]
            : [...prev.logs, `${new Date().toLocaleTimeString()}: VPS worker is ready!`]
        }))
        
        // Update server info
        if (worker.ip_address) {
          setServerInfo({
            ip: worker.ip_address,
            type: worker.hetzner_server_type || 'cpx12',
            cores: 1,
            memory: 2,
            disk: 40
          })
        }
        return
      }
      
      // For provisioning/configuring, use logs from API if available
      if (worker.status === 'provisioning' || worker.status === 'configuring') {
        setBuildState(prev => ({
          ...prev, 
          status: worker.status,
          logs: provisionStatus?.logs 
            ? [...provisionStatus.logs.slice(-10)] // Keep last 10 logs
            : prev.logs,
          serverInfo: worker.ip_address ? {
            ip: worker.ip_address,
            type: worker.hetzner_server_type || 'cpx12',
            cores: 1,
            memory: 2,
            disk: 40
          } : prev.serverInfo
        }))
      }
    } catch (error) {
      console.error('Failed to load status:', error)
    }
  }, [workerId, buildState.status])

  // Start provisioning
  const startProvisioning = async () => {
    try {
      setBuildState(prev => ({
        ...prev,
        status: 'provisioning',
        logs: [...prev.logs, `${new Date().toLocaleTimeString()}: Starting VPS provisioning...`]
      }))

      // Call API to start async provision
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
        logs: [...prev.logs, `${new Date().toLocaleTimeString()}: Error - ${error.message}`]
      }))
    }
  }

  // Timer effect - updates elapsed time and simulates progress
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
      // Simulate visual progress
      simulateProgress()
    }, 1000)

    return () => clearInterval(timer)
  }, [buildState.status, simulateProgress])

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
