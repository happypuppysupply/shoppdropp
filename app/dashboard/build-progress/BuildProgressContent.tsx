"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import {
  Sparkles,
  LogOut,
  User,
  CheckCircle2,
  Circle,
  Loader2,
  XCircle,
  Clock,
  Server,
  Cpu,
  HardDrive,
  MemoryStick,
  RefreshCw,
  ArrowRight,
  Activity,
  Terminal,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

interface ProvisionStatus {
  workerId: string;
  status: "provisioning" | "running" | "error" | "stopped";
  progress: number;
  currentStep: number;
  stepProgress: number;
  serverDetails?: {
    id: string;
    ip: string;
    type: string;
    vcpus: number;
    memory: number;
    disk: number;
  };
  error?: string;
  startedAt: string;
  estimatedCompletion?: string;
}

interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  level: "info" | "success" | "error" | "warning";
  stepNumber?: number;
}

const BUILD_STEPS = [
  { number: 1, name: "Initialize VPS", description: "Creating server instance on Hetzner", icon: Server },
  { number: 2, name: "Install Dependencies", description: "Installing Node.js, Docker, and system packages", icon: Cpu },
  { number: 3, name: "Configure SSH", description: "Setting up secure access keys", icon: Terminal },
  { number: 4, name: "Install OpenClaw", description: "Downloading and installing OpenClaw agent", icon: Sparkles },
  { number: 5, name: "Configure Environment", description: "Setting up API keys and store credentials", icon: MemoryStick },
  { number: 6, name: "Start Services", description: "Starting OpenClaw and WebSocket connection", icon: Activity },
  { number: 7, name: "Health Check", description: "Verifying worker is operational", icon: CheckCircle2 },
  { number: 8, name: "Ready", description: "Worker is ready for tasks", icon: HardDrive },
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://shoppdropp-backend.onrender.com";

export default function BuildProgressContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading: authLoading, signOut } = useAuth();
  const workerId = searchParams.get("workerId") || "";
  const [status, setStatus] = useState<ProvisionStatus | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/");
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!authLoading && isAuthenticated && !workerId) router.push("/dashboard");
  }, [authLoading, isAuthenticated, workerId, router]);

  const fetchStatus = useCallback(async () => {
    if (!workerId) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/vps-debug/provision-status/${workerId}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError("Worker not found. It may have been deleted or the ID is incorrect.");
          return;
        }
        throw new Error(`Failed to fetch status: ${response.statusText}`);
      }
      const data = await response.json();
      setStatus(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching status:", err);
    }
  }, [workerId]);

  const fetchLogs = useCallback(async () => {
    if (!workerId) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/vps-debug/worker-logs/${workerId}`);
      if (!response.ok) return;
      const data = await response.json();
      if (data.logs && Array.isArray(data.logs)) setLogs(data.logs);
    } catch (err) {
      console.error("Error fetching logs:", err);
    }
  }, [workerId]);

  useEffect(() => {
    if (!workerId || !isAuthenticated) return;
    fetchStatus();
    fetchLogs();
    setIsLoading(false);
    const interval = setInterval(() => { fetchStatus(); fetchLogs(); }, 3000);
    return () => clearInterval(interval);
  }, [workerId, isAuthenticated, fetchStatus, fetchLogs]);

  useEffect(() => {
    if (!status?.startedAt) return;
    const startTime = new Date(status.startedAt).getTime();
    const updateElapsed = () => setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);
    return () => clearInterval(interval);
  }, [status?.startedAt]);

  useEffect(() => {
    if (logsEndRef.current) logsEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleRetry = async () => {
    if (!workerId) return;
    setIsRetrying(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/vps-debug/retry-provision/${workerId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error(`Retry failed: ${response.statusText}`);
      await fetchStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to retry provisioning");
    } finally {
      setIsRetrying(false);
    }
  };

  const formatDuration = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getEstimatedRemaining = (): string => {
    if (!status || status.progress === 0) return "~00:03:00";
    if (status.status === "running") return "00:00:00";
    const elapsed = elapsedTime;
    const progress = status.progress / 100;
    const totalEstimated = elapsed / progress;
    const remaining = Math.max(0, totalEstimated - elapsed);
    return `~${formatDuration(Math.floor(remaining))}`;
  };

  const getCurrentStepInfo = () => {
    if (!status) return BUILD_STEPS[0];
    const stepIndex = Math.min(status.currentStep - 1, BUILD_STEPS.length - 1);
    return BUILD_STEPS[stepIndex] || BUILD_STEPS[0];
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0f] via-[#111118] to-[#0a0a0f]">
        <div className="flex items-center gap-3 text-white/50">
          <Loader2 size={24} className="animate-spin text-violet-500" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const currentStep = getCurrentStepInfo();
  const isFailed = status?.status === "error";
  const isComplete = status?.status === "running";
  const isProvisioning = status?.status === "provisioning";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#111118] to-[#0a0a0f]">
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <Link href="/dashboard" className="font-bold text-lg">
                <span className="text-white">SHOPP</span>
                <span className="text-pink-400">DROPP</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center">
                  <User size={16} className="text-violet-400" />
                </div>
                <span className="hidden sm:block">{user?.email}</span>
              </div>
              <button onClick={handleSignOut} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                <LogOut size={16} />
                <span className="hidden sm:block">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            {isFailed ? <XCircle size={32} className="text-red-500" /> : isComplete ? <CheckCircle2 size={32} className="text-emerald-500" /> : <Loader2 size={32} className="animate-spin text-violet-500" />}
            <h1 className="text-3xl font-bold">
              {isFailed ? <span className="text-red-400">Provisioning Failed</span> : isComplete ? <span className="gradient-text">Build Complete!</span> : <span className="text-white">Building Your VPS Worker</span>}
            </h1>
            <span className="text-white/40 text-lg">{status?.progress || 0}% Complete</span>
          </div>
          <p className="text-white/50">
            {isFailed ? "Something went wrong. Check the logs below for details." : isComplete ? "Your AI worker is ready to handle tasks." : "Sit back and relax. Our AI is setting up your dedicated server."}
          </p>
        </motion.div>

        {error && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3">
            <AlertTriangle size={20} />
            <span>{error}</span>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6 border border-white/10 mb-8">
          <div className="mb-6">
            <div className="flex justify-between text-sm text-white/60 mb-2">
              <span>Progress</span>
              <span>{status?.progress || 0}%</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div className={`h-full rounded-full ${isFailed ? "bg-red-500" : isComplete ? "bg-emerald-500" : "bg-gradient-to-r from-violet-500 to-pink-500"}`} initial={{ width: 0 }} animate={{ width: `${status?.progress || 0}%` }} transition={{ duration: 0.5, ease: "easeOut" }} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-sm text-white/50 mb-1">Current Task</div>
              <div className="font-medium text-white">{currentStep.name}</div>
              <div className="text-sm text-white/40 mt-1">{isProvisioning ? `${status?.stepProgress || 0}% complete` : isComplete ? "Completed" : status?.stepProgress ? `${status.stepProgress}% complete` : "Pending"}</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-sm text-white/50 mb-1 flex items-center gap-2"><Clock size={14} /> Elapsed Time</div>
              <div className="font-medium text-white text-lg">{formatDuration(elapsedTime)}</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-sm text-white/50 mb-1">Estimated Left</div>
              <div className="font-medium text-white text-lg">{isComplete ? "Done!" : getEstimatedRemaining()}</div>
            </div>
          </div>
        </motion.div>

        {isFailed && status?.serverDetails && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass rounded-2xl p-6 border border-white/10 mb-8">
            <h3 className="text-lg font-semibold mb-4 text-white/80">Server Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 rounded-lg bg-white/5"><div className="text-sm text-white/40">Type</div><div className="font-medium text-white">{status.serverDetails.type}</div></div>
              <div className="p-3 rounded-lg bg-white/5"><div className="text-sm text-white/40">IP Address</div><div className="font-medium text-white font-mono text-sm">{status.serverDetails.ip}</div></div>
              <div className="p-3 rounded-lg bg-white/5"><div className="text-sm text-white/40">vCPUs</div><div className="font-medium text-white">{status.serverDetails.vcpus}</div></div>
              <div className="p-3 rounded-lg bg-white/5"><div className="text-sm text-white/40">Memory</div><div className="font-medium text-white">{status.serverDetails.memory}GB</div></div>
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-6 border border-white/10 mb-8">
          <h3 className="text-lg font-semibold mb-6 text-white/80">Build Steps</h3>
          <div className="space-y-4">
            {BUILD_STEPS.map((step, index) => {
              const StepIcon = step.icon;
              let stepStatus: "completed" | "active" | "pending" | "error" = "pending";
              if (status) {
                if (isFailed && status.currentStep === step.number) stepStatus = "error";
                else if (status.currentStep > step.number) stepStatus = "completed";
                else if (status.currentStep === step.number) stepStatus = "active";
              }
              return (
                <motion.div key={step.number} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * index }} className={`flex items-start gap-4 p-4 rounded-xl transition-colors ${stepStatus === "active" ? "bg-violet-500/10 border border-violet-500/20" : stepStatus === "error" ? "bg-red-500/10 border border-red-500/20" : "bg-white/5 border border-transparent"}`}>
                  <div className="flex-shrink-0 mt-0.5">
                    {stepStatus === "completed" ? <CheckCircle2 size={22} className="text-emerald-500" /> : stepStatus === "active" ? <Loader2 size={22} className="animate-spin text-violet-500" /> : stepStatus === "error" ? <XCircle size={22} className="text-red-500" /> : <Circle size={22} className="text-white/20" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <StepIcon size={16} className={stepStatus === "active" ? "text-violet-400" : stepStatus === "completed" ? "text-emerald-400" : stepStatus === "error" ? "text-red-400" : "text-white/30"} />
                      <span className={`font-medium ${stepStatus === "active" ? "text-white" : stepStatus === "completed" ? "text-emerald-400" : stepStatus === "error" ? "text-red-400" : "text-white/50"}`}>{step.number}. {step.name}</span>
                    </div>
                    <p className={`text-sm ${stepStatus === "active" ? "text-white/60" : "text-white/40"}`}>{step.description}</p>
                    {stepStatus === "active" && status && (
                      <div className="mt-3">
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <motion.div className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full" initial={{ width: 0 }} animate={{ width: `${status.stepProgress || 0}%` }} transition={{ duration: 0.5 }} />
                        </div>
                        <div className="text-xs text-white/40 mt-1">{status.stepProgress || 0}% complete</div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-2xl border border-white/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white/80 flex items-center gap-2"><Terminal size={18} className="text-violet-400" /> Live Activity Log</h3>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span></span>
              <span className="text-sm text-emerald-400">Live</span>
            </div>
          </div>
          <div className="p-4 bg-black/30 max-h-80 overflow-y-auto font-mono text-sm">
            {logs.length === 0 ? (
              <div className="text-white/30 text-center py-8">Waiting for logs...</div>
            ) : (
              <div className="space-y-1">
                {logs.map((log, index) => (
                  <motion.div key={log.id || index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className={`flex gap-3 ${log.level === "error" ? "text-red-400" : log.level === "success" ? "text-emerald-400" : log.level === "warning" ? "text-amber-400" : "text-white/60"}`}>
                    <span className="text-white/30 flex-shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                    <span className="break-all">{log.message}</span>
                  </motion.div>
                ))}
                <div ref={logsEndRef} />
              </div>
            )}
          </div>
        </motion.div>

        <AnimatePresence>
          {(isFailed || isComplete) && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="mt-8 flex justify-center">
              {isFailed ? (
                <button onClick={handleRetry} disabled={isRetrying} className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
                  {isRetrying ? <><Loader2 size={20} className="animate-spin" /> Retrying...</> : <><RefreshCw size={20} /> Retry Provisioning</>}
                </button>
              ) : (
                <Link href="/app/ai-agent" className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 font-medium text-white hover:opacity-90 transition-opacity">
                  Go to AI Agent <ArrowRight size={20} />
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
