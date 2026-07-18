import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function WorkerSystemPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Worker Execution System</h1>
          <p className="text-slate-400">Stateless job execution engine with OpenClaw integration</p>
        </div>
        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Critical</Badge>
      </div>

      {/* Worker Responsibilities */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Worker Responsibilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { task: "Load Configuration", desc: "Read env vars, connect to Supabase/Redis" },
              { task: "Authenticate", desc: "Validate credentials with API server" },
              { task: "Register Worker", desc: "Announce presence to orchestrator" },
              { task: "Heartbeat", desc: "Send health metrics every 30s" },
              { task: "Receive Jobs", desc: "Pull from Redis queue" },
              { task: "Execute Jobs", desc: "Run job pipeline with state machine" },
              { task: "Report Logs", desc: "Stream logs to Supabase" },
              { task: "Report Progress", desc: "Update job completion percentage" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-400 text-xs font-bold">{i + 1}</span>
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

      {/* OpenClaw Integration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">OpenClaw Integration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="code-block p-4">
              <p className="text-xs text-slate-500 mb-2">// Worker → OpenClaw Flow</p>
              <pre className="text-sm text-slate-300">
{`1. Worker builds prompt
   - Job context
   - Available tools
   - Execution constraints

2. OpenClaw generates plan
   - JSON execution_plan
   - Step-by-step actions
   - Tool calls specified

3. Worker validates plan
   - AJV schema validation
   - Tool authorization check
   - Input sanitization

4. Worker executes steps
   - Call tool registry
   - Handle responses
   - Retry on failure

5. Persist state
   - After each step
   - Enable recovery`}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Tool Registry</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { tool: "shopify.create_product", auth: "Shopify Admin API" },
                { tool: "shopify.update_product", auth: "Shopify Admin API" },
                { tool: "shopify.create_collection", auth: "Shopify Admin API" },
                { tool: "autods.search_products", auth: "AutoDS API Key" },
                { tool: "autods.import_product", auth: "AutoDS API Key" },
                { tool: "autods.sync_inventory", auth: "AutoDS API Key" },
                { tool: "meta.create_campaign", auth: "Meta Access Token" },
                { tool: "meta.create_ad_set", auth: "Meta Access Token" },
                { tool: "meta.create_ad", auth: "Meta Access Token" },
                { tool: "meta.get_insights", auth: "Meta Access Token" },
                { tool: "ai.generate_text", auth: "AI Provider Key" },
                { tool: "ai.generate_image", auth: "AI Provider Key" },
                { tool: "research.query", auth: "Research API Key" },
              ].map((t, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded bg-white/5 text-sm">
                  <span className="text-purple-400 font-mono">{t.tool}</span>
                  <span className="text-slate-500 text-xs">{t.auth}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* State Machine */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Job State Machine</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="code-block p-4">
            <pre className="text-sm text-slate-300">
{`interface JobStateMachine {
  states: {
    queued:        → ["running"]
    running:       → ["step_running", "failed", "completed", "crashed"]
    step_running:  → ["retrying", "failed", "completed", "crashed"]
    retrying:      → ["step_running", "failed"]
    crashed:       → ["resumed", "failed"]
    failed:        → []  // terminal
    completed:     → []  // terminal
    resumed:       → ["running"]
  }
}

// State transitions are strictly validated
// Invalid transitions throw errors
// All state changes are logged`}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Execution Model */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Step Execution Model</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <ExecutionStep
              number={1}
              title="Validate Plan"
              desc="AJV schema validation against plan schema"
            />
            <ExecutionStep
              number={2}
              title="Execute Step"
              desc="Call tool registry with input"
            />
            <ExecutionStep
              number={3}
              title="Handle Result"
              desc="Process output, check for errors"
            />
            <ExecutionStep
              number={4}
              title="Persist State"
              desc="Save to Supabase for recovery"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ExecutionStep({ number, title, desc }: { number: number; title: string; desc: string }) {
  return (
    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
      <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center mb-3">
        <span className="text-orange-400 font-bold">{number}</span>
      </div>
      <h3 className="text-white font-semibold mb-1">{title}</h3>
      <p className="text-sm text-slate-400">{desc}</p>
    </div>
  );
}
