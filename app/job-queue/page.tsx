import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function JobQueuePage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Job Queue System</h1>
          <p className="text-slate-400">Redis + BullMQ job orchestration with retry and persistence</p>
        </div>
        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Queue</Badge>
      </div>

      {/* Job Types */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Job Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { job: "research_market", desc: "Market and competitor research", priority: "normal" },
              { job: "generate_brand", desc: "Brand identity generation", priority: "normal" },
              { job: "generate_logo", desc: "Logo image generation", priority: "normal" },
              { job: "choose_theme", desc: "Shopify theme selection", priority: "normal" },
              { job: "import_products", desc: "AutoDS product import", priority: "high" },
              { job: "optimize_products", desc: "SEO and content optimization", priority: "normal" },
              { job: "create_collections", desc: "Shopify collection setup", priority: "normal" },
              { job: "build_homepage", desc: "Homepage content generation", priority: "high" },
              { job: "create_policies", desc: "Store policy pages", priority: "low" },
              { job: "seo_optimization", desc: "Meta tags and SEO", priority: "normal" },
              { job: "generate_blogs", desc: "Blog content creation", priority: "low" },
              { job: "marketing_assets", desc: "Ad creative generation", priority: "normal" },
              { job: "quality_checks", desc: "Store quality validation", priority: "high" },
              { job: "autods_sync", desc: "Inventory synchronization", priority: "high" },
              { job: "meta_campaign_generate", desc: "Ad campaign planning", priority: "normal" },
              { job: "meta_campaign_deploy", desc: "Campaign deployment", priority: "high" },
              { job: "meta_campaign_optimize", desc: "Campaign optimization", priority: "normal" },
              { job: "performance_analysis", desc: "Analytics and reporting", priority: "low" },
            ].map((j, i) => (
              <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-purple-400 font-mono text-sm">{j.job}</span>
                  <Badge className={j.priority === "high" ? "bg-red-500/20 text-red-400" : j.priority === "normal" ? "bg-yellow-500/20 text-yellow-400" : "bg-slate-500/20 text-slate-400"}>
                    {j.priority}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500">{j.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Job States */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Job State Transitions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { from: "queued", to: "running", trigger: "Worker available" },
                { from: "running", to: "completed", trigger: "All steps success" },
                { from: "running", to: "failed", trigger: "Max retries exceeded" },
                { from: "running", to: "retrying", trigger: "Transient error" },
                { from: "retrying", to: "running", trigger: "Backoff complete" },
                { from: "running", to: "crashed", trigger: "Worker crash" },
                { from: "crashed", to: "running", trigger: "Worker recovered" },
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded bg-white/5 text-sm">
                  <span className="text-slate-400 font-mono">{t.from}</span>
                  <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  <span className="text-green-400 font-mono">{t.to}</span>
                  <span className="text-slate-500 text-xs ml-auto">{t.trigger}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Retry Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="code-block p-4">
              <pre className="text-sm text-slate-300">
{`interface RetryConfig {
  attempts: 3,           // Max retry attempts
  backoff: "exponential", // exponential | linear | fixed
  delay: 5000,           // Initial delay (ms)
  maxDelay: 60000,       // Max delay (ms)
}

// Per-job-type override
retryPolicies: {
  "import_products": {
    attempts: 5,
    backoff: "exponential"
  },
  "meta_campaign_deploy": {
    attempts: 3,
    backoff: "fixed",
    delay: 10000
  }
}`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Queue Architecture */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Queue Architecture</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <QueueComponent
              title="BullMQ"
              desc="Redis-based queue library"
              features={["Job scheduling", "Priority queues", "Rate limiting", "Delayed jobs"]}
            />
            <QueueComponent
              title="Redis"
              desc="In-memory data store"
              features={["Pub/sub", "Persistence", "Clustering", "High availability"]}
            />
            <QueueComponent
              title="Job Processor"
              desc="Worker job handler"
              features={["Concurrency control", "Graceful shutdown", "Stalled job recovery", "Progress tracking"]}
            />
            <QueueComponent
              title="Event System"
              desc="Job lifecycle events"
              features={["completed", "failed", "progress", "stalled", "removed"]}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function QueueComponent({ title, desc, features }: { title: string; desc: string; features: string[] }) {
  return (
    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
      <h3 className="text-white font-semibold mb-1">{title}</h3>
      <p className="text-xs text-slate-500 mb-3">{desc}</p>
      <div className="space-y-1">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-1 h-1 rounded-full bg-yellow-500" />
            {f}
          </div>
        ))}
      </div>
    </div>
  );
}
