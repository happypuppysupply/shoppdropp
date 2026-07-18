import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function MonitoringPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Monitoring & Logs</h1>
          <p className="text-slate-400">Real-time observability and system health tracking</p>
        </div>
        <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">Observability</Badge>
      </div>

      {/* Monitored Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Worker Status" value="Online/Offline/Busy" indicator="green" />
        <MetricCard title="Current Job" value="Job type & progress" indicator="blue" />
        <MetricCard title="CPU Usage" value="0-100% per worker" indicator="yellow" />
        <MetricCard title="RAM Usage" value="MB/GB consumed" indicator="purple" />
        <MetricCard title="Heartbeat" value="Last seen timestamp" indicator="green" />
        <MetricCard title="Logs" value="Realtime stream" indicator="cyan" />
        <MetricCard title="Version" value="Worker version" indicator="slate" />
        <MetricCard title="Uptime" value="Duration since start" indicator="green" />
      </div>

      {/* Heartbeat System */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Heartbeat Protocol</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="code-block p-4">
            <pre className="text-sm text-slate-300">
{`// Worker sends every 30 seconds
interface Heartbeat {
  worker_id: string;
  timestamp: ISO8601;
  status: "idle" | "busy" | "error";
  current_job_id: string | null;
  progress: number;  // 0-100
  
  // System metrics
  cpu_percent: number;
  memory_mb: number;
  disk_mb: number;
  
  // Health checks
  supabase_connected: boolean;
  redis_connected: boolean;
  ai_provider_available: boolean;
}

// Orchestrator monitors
if (last_heartbeat > 2_minutes) {
  mark_worker_offline();
  trigger_recovery();
}`}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Log Streaming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Log Structure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="code-block p-4">
              <pre className="text-sm text-slate-300">
{`interface LogEntry {
  id: uuid;
  worker_id: string;
  project_id: string;
  job_id: string;
  level: "debug" | "info" | "warn" | "error";
  message: string;
  metadata: JSON;
  timestamp: DateTime;
  step_id?: string;
  tool?: string;
  duration_ms?: number;
}

// Realtime subscription
supabase
  .channel("logs")
  .on("INSERT", (payload) => {
    update_dashboard(payload.new);
  })`}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Health Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { check: "API Server", interval: "10s", status: "healthy" },
                { check: "Database", interval: "10s", status: "healthy" },
                { check: "Redis", interval: "10s", status: "healthy" },
                { check: "Worker Pool", interval: "30s", status: "healthy" },
                { check: "Stripe API", interval: "60s", status: "healthy" },
              ].map((h, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${h.status === "healthy" ? "bg-green-500" : "bg-red-500"}`} />
                    <span className="text-white text-sm">{h.check}</span>
                  </div>
                  <span className="text-slate-500 text-xs">Every {h.interval}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerting */}
      <Card className="bg-slate-900/50 border-white/10 border-red-500/30">
        <CardHeader>
          <CardTitle className="text-white">Alert Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AlertCard
              condition="Worker Offline > 2 min"
              severity="critical"
              action="Auto-restart, notify user"
            />
            <AlertCard
              condition="Job Failed"
              severity="warning"
              action="Retry, escalate if max retries"
            />
            <AlertCard
              condition="API Rate Limited"
              severity="warning"
              action="Backoff, queue for retry"
            />
            <AlertCard
              condition="High CPU > 90%"
              severity="warning"
              action="Scale up, notify admin"
            />
            <AlertCard
              condition="Disk Full > 85%"
              severity="critical"
              action="Cleanup, expand volume"
            />
            <AlertCard
              condition="Payment Failed"
              severity="info"
              action="Notify user, grace period"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ title, value, indicator }: { title: string; value: string; indicator: string }) {
  const colors: Record<string, string> = {
    green: "bg-green-500",
    blue: "bg-blue-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
    cyan: "bg-cyan-500",
    slate: "bg-slate-500",
  };

  return (
    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-2 h-2 rounded-full ${colors[indicator]}`} />
        <span className="text-slate-400 text-xs">{title}</span>
      </div>
      <p className="text-white text-sm font-medium">{value}</p>
    </div>
  );
}

function AlertCard({ condition, severity, action }: { condition: string; severity: string; action: string }) {
  const colors: Record<string, string> = {
    critical: "border-red-500/30 bg-red-500/10",
    warning: "border-yellow-500/30 bg-yellow-500/10",
    info: "border-blue-500/30 bg-blue-500/10",
  };

  return (
    <div className={`p-4 rounded-lg border ${colors[severity]}`}>
      <p className="text-white font-medium text-sm mb-1">{condition}</p>
      <p className="text-xs text-slate-400">{action}</p>
    </div>
  );
}
