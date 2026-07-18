import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SystemOverviewPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">System Overview</h1>
          <p className="text-slate-400">Complete architectural specification of the ShoppDropp platform</p>
        </div>
        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Core Module</Badge>
      </div>

      {/* System Definition */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">System Definition</CardTitle>
          <CardDescription className="text-slate-400">
            ShoppDropp is an autonomous eCommerce operating system that connects product sourcing (AutoDS), 
            store operations (Shopify), and marketing execution (Meta Ads) into a single AI-driven closed-loop growth engine.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <h3 className="text-white font-semibold mb-2">Primary Function</h3>
              <p className="text-sm text-slate-400">
                Autonomously build, manage, and optimize Shopify dropshipping stores using AI-driven workflows.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <h3 className="text-white font-semibold mb-2">Target Users</h3>
              <p className="text-sm text-slate-400">
                eCommerce entrepreneurs, dropshippers, marketing agencies, and enterprise clients.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Core Architecture Rules */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Core Architecture Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { rule: "OpenClaw = planning engine ONLY", desc: "AI generates execution plans, never calls APIs directly" },
              { rule: "Worker = executes ALL API calls", desc: "All external integrations happen through Worker" },
              { rule: "Orchestrator = infrastructure ONLY", desc: "VPS, Docker, lifecycle management" },
              { rule: "Dashboard = visualization ONLY", desc: "UI layer, no business logic" },
              { rule: "Supabase = system of record", desc: "All state persisted in PostgreSQL" },
              { rule: "Redis = job queue", desc: "BullMQ for job orchestration" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-white/5">
                <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-400 text-xs font-bold">{i + 1}</span>
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{item.rule}</p>
                  <p className="text-slate-400 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Components */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ComponentCard
          title="Dashboard"
          tech="Next.js 15 + React"
          role="User Interface Layer"
          features={["Authentication", "Project Management", "Billing", "Monitoring", "Real-time Updates"]}
          color="purple"
        />
        <ComponentCard
          title="API"
          tech="NestJS + TypeScript"
          role="Business Logic Layer"
          features={["REST Endpoints", "JWT Auth", "Stripe Integration", "Job Orchestration", "Webhooks"]}
          color="blue"
        />
        <ComponentCard
          title="Database"
          tech="Supabase + PostgreSQL"
          role="Data Persistence Layer"
          features={["Auth", "Storage", "Realtime", "Row Level Security", "Encrypted Secrets"]}
          color="pink"
        />
        <ComponentCard
          title="Queue"
          tech="Redis + BullMQ"
          role="Job Orchestration Layer"
          features={["Job Scheduling", "Retry Logic", "Priority Queues", "Job State Tracking", "Dead Letter Queue"]}
          color="orange"
        />
        <ComponentCard
          title="Orchestrator"
          tech="Docker + Node.js"
          role="Infrastructure Layer"
          features={["VPS Provisioning", "Docker Management", "Worker Deployment", "Health Monitoring", "Auto-recovery"]}
          color="green"
        />
        <ComponentCard
          title="Worker"
          tech="Docker + TypeScript"
          role="Execution Layer"
          features={["Job Execution", "API Integration", "AI Planning", "State Machine", "Heartbeat Reporting"]}
          color="red"
        />
      </div>

      {/* Data Flow */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Unified System Loop</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-center gap-2 py-6">
            {["RESEARCH", "STORE BUILD", "PRODUCT SOURCING", "LISTING OPTIMIZATION", "META ADS", "MONITORING", "OPTIMIZATION"].map((step, i, arr) => (
              <div key={step} className="flex items-center gap-2">
                <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                  <span className="text-white text-sm font-medium">{step}</span>
                </div>
                {i < arr.length - 1 && (
                  <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-slate-400 mt-4">
            Continuous autonomous optimization loop connecting all subsystems
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function ComponentCard({ title, tech, role, features, color }: { title: string; tech: string; role: string; features: string[]; color: string }) {
  const colors: Record<string, string> = {
    purple: "from-purple-500/20 to-purple-600/10 border-purple-500/30",
    blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30",
    pink: "from-pink-500/20 to-pink-600/10 border-pink-500/30",
    orange: "from-orange-500/20 to-orange-600/10 border-orange-500/30",
    green: "from-green-500/20 to-green-600/10 border-green-500/30",
    red: "from-red-500/20 to-red-600/10 border-red-500/30",
  };

  return (
    <Card className={`bg-gradient-to-br ${colors[color]} border`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-lg">{title}</CardTitle>
        <CardDescription className="text-slate-300">{tech}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-white/80 font-medium">{role}</p>
        <div className="space-y-1">
          {features.map((feature, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
              <span className="w-1 h-1 rounded-full bg-white/50" />
              {feature}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
