"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { 
  Server, 
  Database, 
  Brain, 
  ShoppingBag, 
  TrendingUp, 
  Shield,
  CheckCircle2,
  Clock,
  Zap
} from "lucide-react";

const steps = [
  { icon: Server, label: "VPS Connected", color: "from-green-500 to-emerald-500" },
  { icon: Database, label: "Store Synced", color: "from-blue-500 to-cyan-500" },
  { icon: Brain, label: "AI Analysis", color: "from-violet-500 to-purple-500" },
  { icon: ShoppingBag, label: "Catalog Optimized", color: "from-pink-500 to-rose-500" },
  { icon: TrendingUp, label: "Pricing Adjusted", color: "from-amber-500 to-orange-500" },
  { icon: Shield, label: "Inventory Monitored", color: "from-teal-500 to-green-500" },
];

const activityLogs = [
  "Scanning 1,247 products for optimization opportunities...",
  "Identified 23 underperforming listings",
  "Updating product descriptions with AI copy...",
  "Syncing inventory from AutoDS...",
  "Adjusting prices based on competitor analysis...",
  "Generating meta tags for SEO...",
  "Creating collection organization...",
  "Monitoring stock levels across suppliers...",
];

export function AgentVisualization() {
  const [activeStep, setActiveStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [currentLog, setCurrentLog] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2500);

    return () => clearInterval(stepInterval);
  }, []);

  useEffect(() => {
    const logInterval = setInterval(() => {
      setCurrentLog((prev) => {
        const next = (prev + 1) % activityLogs.length;
        setLogs((prevLogs) => [activityLogs[next], ...prevLogs.slice(0, 4)]);
        return next;
      });
    }, 2000);

    // Initialize with first log
    setLogs([activityLogs[0]]);

    return () => clearInterval(logInterval);
  }, []);

  return (
    <div className="relative">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-pink-500/10 to-blue-500/10 blur-3xl" />
      
      <div className="relative glass rounded-2xl p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">AI Agent Status</h3>
              <p className="text-sm text-green-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Autonomous Mode Active
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Uptime: 99.9%
            </span>
            <span className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-amber-400" />
              Last action: 2s ago
            </span>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === activeStep;
            const isCompleted = index < activeStep;

            return (
              <motion.div
                key={step.label}
                initial={false}
                animate={{
                  scale: isActive ? 1.05 : 1,
                  opacity: isCompleted ? 0.6 : 1,
                }}
                className={`relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                  isActive ? "bg-white/5" : ""
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    isActive
                      ? `bg-gradient-to-br ${step.color} shadow-lg shadow-violet-500/25`
                      : isCompleted
                      ? "bg-green-500/20"
                      : "bg-white/5"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  ) : (
                    <Icon className={`w-6 h-6 ${isActive ? "text-white" : "text-slate-400"}`} />
                  )}
                </div>
                <span
                  className={`text-xs text-center ${
                    isActive ? "text-white font-medium" : "text-slate-500"
                  }`}
                >
                  {step.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute inset-0 rounded-xl border-2 border-violet-500/50"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Activity Log */}
        <div className="bg-black/30 rounded-xl p-4 font-mono text-sm">
          <div className="flex items-center gap-2 mb-3 text-slate-400 text-xs uppercase tracking-wider">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Live Activity Log
          </div>
          <div className="space-y-2 h-32 overflow-hidden">
            {logs.map((log, index) => (
              <motion.div
                key={`${log}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 text-slate-300"
              >
                <span className="text-violet-400">[{new Date().toLocaleTimeString()}]</span>
                <span>{log}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">24/7</p>
            <p className="text-xs text-slate-500">Autonomous Operation</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">1,247</p>
            <p className="text-xs text-slate-500">Products Managed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">+34%</p>
            <p className="text-xs text-slate-500">Avg. Conversion Lift</p>
          </div>
        </div>
      </div>
    </div>
  );
}
