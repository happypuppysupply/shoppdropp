import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AILayerPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">AI Integration Layer</h1>
          <p className="text-slate-400">OpenClaw planning engine and AI provider abstraction</p>
        </div>
        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Core Engine</Badge>
      </div>

      {/* Architecture Rule */}
      <Card className="bg-slate-900/50 border-white/10 border-red-500/30">
        <CardHeader>
          <CardTitle className="text-white">⚠️ Critical Architecture Rule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
            <p className="text-white text-lg font-semibold mb-2">OpenClaw is ONLY the reasoning engine</p>
            <p className="text-slate-300">Worker owns all business logic. OpenClaw should NEVER directly call Shopify, AutoDS, or Meta APIs.</p>
          </div>
        </CardContent>
      </Card>

      {/* OpenClaw Flow */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">OpenClaw Execution Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { step: 1, title: "Worker Builds Prompt", desc: "Context + available tools + constraints" },
              { step: 2, title: "OpenClaw Generates Plan", desc: "Returns structured execution_plan JSON" },
              { step: 3, title: "Worker Validates Plan", desc: "AJV schema validation + tool authorization" },
              { step: 4, title: "Worker Executes Steps", desc: "Calls tool registry, handles responses" },
              { step: 5, title: "Worker Persists State", desc: "Save after each step for recovery" },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">{item.step}</span>
                </div>
                <div>
                  <p className="text-white font-semibold">{item.title}</p>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Plan Schema */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">OpenClaw Plan Schema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="code-block p-4 overflow-x-auto">
              <pre className="text-sm text-slate-300">
{`{
  "goal": "Create Shopify product",
  "execution_plan": [
    {
      "step_id": "1",
      "tool": "ai.generate_text",
      "action": "generate_product_description",
      "input": {
        "product_name": "Wireless Earbuds",
        "tone": "professional"
      },
      "output_schema": {
        "description": "string",
        "seo_title": "string"
      }
    },
    {
      "step_id": "2",
      "tool": "shopify.create_product",
      "action": "create_product",
      "input": {
        "title": "{{step_1.seo_title}}",
        "body_html": "{{step_1.description}}"
      },
      "depends_on": ["1"]
    }
  ],
  "estimated_duration": "30s"
}`}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">AI Providers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "OpenAI", models: "GPT-4, GPT-4o, DALL-E", usage: "Text + Image" },
                { name: "Anthropic", models: "Claude 3.5 Sonnet, Claude 3 Opus", usage: "Text (long context)" },
                { name: "OpenRouter", models: "Multi-provider routing", usage: "Fallback + Cost opt" },
                { name: "Google", models: "Gemini 1.5 Pro", usage: "Multimodal" },
              ].map((p, i) => (
                <div key={i} className="p-3 rounded-lg bg-white/5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-semibold">{p.name}</span>
                    <Badge className="bg-purple-500/20 text-purple-400">{p.usage}</Badge>
                  </div>
                  <p className="text-slate-500 text-xs">{p.models}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Constraints */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Execution Constraints</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ConstraintCard
              title="Tool Authorization"
              desc="Worker validates every tool call against authorized registry"
            />
            <ConstraintCard
              title="Input Sanitization"
              desc="All inputs validated against Zod schemas before execution"
            />
            <ConstraintCard
              title="Output Validation"
              desc="Tool outputs validated against expected schema"
            />
            <ConstraintCard
              title="Deterministic"
              desc="Same input always produces same plan structure"
            />
            <ConstraintCard
              title="Replay-Safe"
              desc="Plan can be re-executed from any step with saved state"
            />
            <ConstraintCard
              title="Timeout Bound"
              desc="Each step has max execution time, job has global timeout"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ConstraintCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
      <h3 className="text-white font-semibold mb-2">{title}</h3>
      <p className="text-sm text-slate-400">{desc}</p>
    </div>
  );
}
