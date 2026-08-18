'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Loader2,
  Terminal,
  Wrench,
  FileText,
  Globe,
  Database,
  Zap,
  Square
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export interface Activity {
  id: string
  type: 'tool' | 'command' | 'api' | 'file' | 'system' | 'thinking'
  status: 'running' | 'completed' | 'error' | 'pending'
  label: string
  detail?: string
  timestamp: string
  duration?: string
  toolsUsed?: number
}

interface ActivityLogProps {
  activities: Activity[]
  isRunning: boolean
  totalTools: number
  onStop?: () => void
}

const typeIcons = {
  tool: Wrench,
  command: Terminal,
  api: Globe,
  file: FileText,
  system: Database,
  thinking: Zap,
}

const statusColors = {
  running: 'text-amber-400',
  completed: 'text-green-400',
  error: 'text-red-400',
  pending: 'text-slate-500',
}

const statusBgColors = {
  running: 'bg-amber-500/10 border-amber-500/30',
  completed: 'bg-green-500/10 border-green-500/30',
  error: 'bg-red-500/10 border-red-500/30',
  pending: 'bg-slate-500/5 border-slate-500/10',
}

export function ActivityLog({ activities, isRunning, totalTools, onStop }: ActivityLogProps) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30">
            <Terminal className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-violet-300 font-medium">
              {isRunning ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Executing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3" />
                  Idle
                </span>
              )}
            </span>
          </div>
          {totalTools > 0 && (
            <Badge variant="outline" className="border-white/20 text-slate-400">
              {totalTools} tools used
            </Badge>
          )}
        </div>
        
        {isRunning && onStop && (
          <Button
            onClick={onStop}
            variant="destructive"
            size="sm"
            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30"
          >
            <Square className="w-3 h-3 mr-1 fill-current" />
            Stop Agent
          </Button>
        )}
      </div>

      {/* Activity List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
        <AnimatePresence>
          {activities.map((activity) => {
            const Icon = typeIcons[activity.type] || Terminal
            
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`p-3 rounded-lg border ${statusBgColors[activity.status]} transition-all`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 ${statusColors[activity.status]}`}>
                    {activity.status === 'running' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : activity.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : activity.status === 'error' ? (
                      <XCircle className="w-4 h-4" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3 h-3 text-slate-500" />
                      <span className="text-sm text-white font-medium">
                        {activity.label}
                      </span>
                      {activity.toolsUsed && (
                        <Badge variant="outline" className="text-[10px] border-white/10 text-slate-500">
                          {activity.toolsUsed} tools
                        </Badge>
                      )}
                    </div>
                    
                    {activity.detail && (
                      <p className="text-xs text-slate-400 mt-1 font-mono">
                        {activity.detail}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] text-slate-500">
                        {activity.timestamp}
                      </span>
                      {activity.duration && (
                        <span className="text-[10px] text-slate-500">
                          Duration: {activity.duration}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}


