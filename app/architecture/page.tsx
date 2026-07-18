import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ArchitecturePage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Architecture Map</h1>
          <p className="text-slate-400">Complete system topology and interaction patterns</p>
        </div>
        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Technical Spec</Badge>
      </div>

      {/* System Flow Diagram */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">End-to-End System Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <FlowStep
              number={1}
              title="User Initiates Action"
              description="User clicks button in Dashboard (Next.js 15 on Vercel)"
              component="Dashboard"
              type="frontend"
            />
            <FlowArrow />
            <FlowStep
              number={2}
              title="API Receives Request"
              description="NestJS API validates auth, processes business logic"
              component="API"
              type="backend"
            />
            <FlowArrow />
            <FlowStep
              number={3}
              title="State Persisted"
              description="Data stored in Supabase PostgreSQL, job queued in Redis"
              component="Supabase + Redis"
              type="data"
            />
            <FlowArrow />
            <FlowStep
              number={4}
              title="Orchestrator Provisions"
              description="VPS created on Hetzner, Docker installed, Worker deployed"
              component="Orchestrator"
              type="infra"
            />
            <FlowArrow />
            <FlowStep
              number={5}
              title="Worker Executes"
              description="Pulls job from queue, loads config, calls OpenClaw for plan"
              component="Worker"
              type="worker"
            />
            <FlowArrow />
            <FlowStep
              number={6}
              title="AI Planning"
              description="OpenClaw generates execution plan, returns structured JSON"
              component="OpenClaw"
              type="ai"
            />
            <FlowArrow />
            <FlowStep
              number={7}
              title="External API Calls"
              description="Worker executes Shopify, Meta, AutoDS API calls"
              component="External APIs"
              type="external"
            />
            <FlowArrow />
            <FlowStep
              number={8}
              title="Progress Reported"
              description="Logs and state written to Supabase, Dashboard updates realtime"
              component="Feedback Loop"
              type="data"
            />
          </div>
        </CardContent>
      </Card>

      {/* Component Interaction Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">API Endpoints</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { method: "POST", path: "/api/v1/projects", desc: "Create new project" },
              { method: "GET", path: "/api/v1/projects/:id", desc: "Get project details" },
              { method: "POST", path: "/api/v1/projects/:id/launch", desc: "Launch AI workspace" },
              { method: "GET", path: "/api/v1/workers/:id/status", desc: "Get worker status" },
              { method: "POST", path: "/api/v1/jobs", desc: "Create job" },
              { method: "GET", path: "/api/v1/jobs/:id", desc: "Get job status" },
              { method: "POST", path: "/api/v1/billing/subscribe", desc: "Create subscription" },
              { method: "POST", path: "/api/v1/webhooks/stripe", desc: "Stripe webhook" },
            ].map((endpoint, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded bg-white/5 text-sm">
                <Badge className={endpoint.method === "GET" ? "bg-blue-500/20 text-blue-400" : "bg-green-500/20 text-green-400"}>
                  {endpoint.method}
                </Badge>
                <span className="text-slate-300 font-mono">{endpoint.path}</span>
                <span className="text-slate-500 text-xs ml-auto">{endpoint.desc}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Database Schema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { table: "users", desc: "Authentication & profiles" },
              { table: "projects", desc: "Project configuration" },
              { table: "stores", desc: "Shopify store details" },
              { table: "workers", desc: "Worker instances" },
              { table: "jobs", desc: "Job queue state" },
              { table: "logs", desc: "Execution logs" },
              { table: "api_keys", desc: "Encrypted credentials" },
              { table: "subscriptions", desc: "Billing records" },
              { table: "meta_campaigns", desc: "Ad campaigns" },
              { table: "autods_products", desc: "Product inventory" },
            ].map((table, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded bg-white/5 text-sm">
                <span className="text-purple-400 font-mono">{table.table}</span>
                <span className="text-slate-500 text-xs ml-auto">{table.desc}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Deployment Architecture */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Deployment Architecture</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DeploymentCard
              name="Vercel"
              purpose="Dashboard Hosting"
              config="Edge Network, Auto-deploy"
            />
            <DeploymentCard
              name="Docker"
              purpose="API & Orchestrator"
              config="Containerized Services"
            />
            <DeploymentCard
              name="Hetzner VPS"
              purpose="Worker Instances"
              config="Isolated per Project"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FlowStep({ number, title, description, component, type }: { number: number; title: string; description: string; component: string; type: string }) {
  const colors: Record<string, string> = {
    frontend: "border-purple-500/50 bg-purple-500/10",
    backend: "border-blue-500/50 bg-blue-500/10",
    data: "border-pink-500/50 bg-pink-500/10",
    infra: "border-green-500/50 bg-green-500/10",
    worker: "border-orange-500/50 bg-orange-500/10",
    ai: "border-red-500/50 bg-red-500/10",
    external: "border-yellow-500/50 bg-yellow-500/10",
  };

  return (
    <div className={`flex items-center gap-4 p-4 rounded-lg border ${colors[type]}`}>
      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
        <span className="text-white font-bold">{number}</span>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-white font-semibold">{title}</h3>
          <Badge variant="outline" className="text-xs">{component}</Badge>
        </div>
        <p className="text-slate-400 text-sm">{description}</p>
      </div>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="flex justify-center">
      <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </div>
  );
}

function DeploymentCard({ name, purpose, config }: { name: string; purpose: string; config: string }) {
  return (
    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
      <h3 className="text-white font-semibold mb-1">{name}</h3>
      <p className="text-sm text-slate-400 mb-2">{purpose}</p>
      <p className="text-xs text-slate-500">{config}</p>
    </div>
  );
}
