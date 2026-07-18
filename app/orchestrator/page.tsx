import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function OrchestratorPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Orchestrator System</h1>
          <p className="text-slate-400">VPS provisioning, Docker deployment, and worker lifecycle</p>
        </div>
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Infrastructure</Badge>
      </div>

      {/* Orchestrator Responsibilities */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Orchestrator Responsibilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { task: "Create VPS", desc: "Provision Ubuntu 24.04 on Hetzner Cloud" },
              { task: "Wait for Active", desc: "Poll until server is running" },
              { task: "SSH Bootstrap", desc: "Connect and run setup scripts" },
              { task: "Install Docker", desc: "Install Docker CE and compose" },
              { task: "Deploy Worker", desc: "Pull and start worker container" },
              { task: "Inject Config", desc: "Write env vars to container" },
              { task: "Start Worker", desc: "Initialize worker process" },
              { task: "Monitor Worker", desc: "Track health via heartbeat" },
              { task: "Restart Worker", desc: "Auto-restart on failure" },
              { task: "Destroy Worker", desc: "Cleanup on project deletion" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-400 text-xs font-bold">{i + 1}</span>
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{item.task}</p>
                  <p className="text-slate-400 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* VPS Bootstrap Flow */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">VPS Bootstrap Process</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { step: "Provision Ubuntu 24.04", time: "30s", detail: "Hetzner CX21 or higher" },
              { step: "Install Docker", time: "60s", detail: "Docker CE, docker-compose" },
              { step: "Create App Folder", time: "5s", detail: "/opt/shoppdropp-worker" },
              { step: "Deploy Container", time: "45s", detail: "Pull from registry" },
              { step: "Inject Environment", time: "5s", detail: "All credentials mounted" },
              { step: "Start Container", time: "10s", detail: "Worker process starts" },
              { step: "Worker Registers", time: "5s", detail: "POST /api/v1/workers/register" },
              { step: "Return READY", time: "0s", detail: "Status updated in Supabase" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-white/5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">{i + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{item.step}</p>
                  <p className="text-slate-400 text-sm">{item.detail}</p>
                </div>
                <Badge variant="outline" className="text-slate-400">{item.time}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Provider Abstraction */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Provider Interface</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="code-block p-4">
              <pre className="text-sm text-slate-300">
{`interface VPSProvider {
  // Server lifecycle
  createServer(config: ServerConfig): Promise<Server>;
  deleteServer(id: string): Promise<void>;
  getServer(id: string): Promise<Server>;
  
  // Server state
  startServer(id: string): Promise<void>;
  stopServer(id: string): Promise<void>;
  rebootServer(id: string): Promise<void>;
  
  // Networking
  getIPAddress(id: string): Promise<string>;
  
  // Monitoring
  getMetrics(id: string): Promise<Metrics>;
}

// Implementations:
// - HetznerProvider
// - AWSProvider (future)
// - DigitalOceanProvider (future)`}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Worker Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="code-block p-4">
              <pre className="text-sm text-slate-300">
{`// Environment variables injected
WORKER_ID=worker_abc123
PROJECT_ID=proj_xyz789
API_SERVER_URL=https://api.shoppdropp.com

// Shopify
SHOPIFY_STORE=store.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_***

// AutoDS
AUTODS_API_KEY=ad_***

// AI Provider
AI_PROVIDER=openai
AI_API_KEY=sk-***

// Meta
META_ACCESS_TOKEN=EAAB***
META_AD_ACCOUNT_ID=act_***

// Supabase
SUPABASE_URL=https://***.supabase.co
SUPABASE_SERVICE_KEY=eyJ***

// Redis
REDIS_URL=redis://***:6379`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recovery Logic */}
      <Card className="bg-slate-900/50 border-white/10 border-red-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <span>🔄</span> Recovery Logic
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <RecoveryCard
              title="Worker Crash"
              trigger="Heartbeat timeout > 2 min"
              action="Auto-restart container, resume jobs"
            />
            <RecoveryCard
              title="VPS Failure"
              trigger="Server unreachable"
              action="Provision new VPS, migrate data"
            />
            <RecoveryCard
              title="Job Stuck"
              trigger="Job running > 4 hours"
              action="Mark failed, alert user, cleanup"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RecoveryCard({ title, trigger, action }: { title: string; trigger: string; action: string }) {
  return (
    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
      <h3 className="text-white font-semibold mb-2">{title}</h3>
      <div className="space-y-2">
        <div>
          <p className="text-xs text-slate-500">Trigger</p>
          <p className="text-sm text-slate-300">{trigger}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Action</p>
          <p className="text-sm text-slate-300">{action}</p>
        </div>
      </div>
    </div>
  );
}
