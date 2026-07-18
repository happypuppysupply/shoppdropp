import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function WizardFlowPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Project Wizard Flow</h1>
          <p className="text-slate-400">Step-by-step onboarding with backend integration mapping</p>
        </div>
        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">12 Steps</Badge>
      </div>

      {/* Wizard Steps */}
      <div className="space-y-4">
        <WizardStep
          step={1}
          title="Sign Up"
          ui="Email/Google/GitHub auth forms"
          backend="POST /api/v1/auth/register"
          database="INSERT users"
          worker="None"
        />
        <WizardStep
          step={2}
          title="Create Project"
          ui="Project name, niche selection"
          backend="POST /api/v1/projects"
          database="INSERT projects (status: draft)"
          worker="None"
        />
        <WizardStep
          step={3}
          title="Connect Shopify"
          ui="Store URL input, API token"
          backend="POST /api/v1/projects/:id/shopify"
          database="UPDATE projects (shopify credentials)"
          worker="Test connection job"
        />
        <WizardStep
          step={4}
          title="Connect AutoDS"
          ui="API key input"
          backend="POST /api/v1/projects/:id/autods"
          database="UPDATE projects (autods credentials)"
          worker="Validate AutoDS key"
        />
        <WizardStep
          step={5}
          title="Connect AI Provider"
          ui="Provider select, API key"
          backend="POST /api/v1/projects/:id/ai"
          database="UPDATE projects (ai config)"
          worker="Test AI generation"
        />
        <WizardStep
          step={6}
          title="Connect Research APIs"
          ui="Serper, Tavily keys"
          backend="POST /api/v1/projects/:id/research"
          database="UPDATE projects (research keys)"
          worker="None"
        />
        <WizardStep
          step={7}
          title="Review Configuration"
          ui="Summary page, validation status"
          backend="GET /api/v1/projects/:id/validate"
          database="SELECT all credentials"
          worker="None"
        />
        <WizardStep
          step={8}
          title="Launch AI Workspace"
          ui="Launch button, confirmation"
          backend="POST /api/v1/projects/:id/launch"
          database="UPDATE projects (status: provisioning)"
          worker="None (triggers Orchestrator)"
        />
        <WizardStep
          step={9}
          title="Provision VPS"
          ui="Progress bar, logs stream"
          backend="Orchestrator creates VPS"
          database="INSERT workers (status: creating)"
          worker="None"
        />
        <WizardStep
          step={10}
          title="Research Phase"
          ui="Live logs, progress indicators"
          backend="Job queued in Redis"
          database="INSERT jobs (type: research)"
          worker="Execute market research"
        />
        <WizardStep
          step={11}
          title="Building Store"
          ui="Real-time build progress"
          backend="Multiple jobs queued"
          database="UPDATE jobs (status: running)"
          worker="Execute store build pipeline"
        />
        <WizardStep
          step={12}
          title="Completed"
          ui="Store preview, next steps"
          backend="Project marked active"
          database="UPDATE projects (status: active)"
          worker="Continuous automation"
        />
      </div>

      {/* Backend Mapping */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Backend Integration Points</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <h3 className="text-blue-400 font-semibold mb-2">API Layer</h3>
              <ul className="space-y-1 text-sm text-slate-300">
                <li>• Input validation (Zod)</li>
                <li>• JWT authentication</li>
                <li>• Credential encryption</li>
                <li>• Rate limiting</li>
                <li>• Audit logging</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-pink-500/10 border border-pink-500/30">
              <h3 className="text-pink-400 font-semibold mb-2">Database Layer</h3>
              <ul className="space-y-1 text-sm text-slate-300">
                <li>• Prisma ORM</li>
                <li>• Row Level Security</li>
                <li>• Encrypted columns</li>
                <li>• Audit timestamps</li>
                <li>• Realtime subscriptions</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
              <h3 className="text-green-400 font-semibold mb-2">Queue Layer</h3>
              <ul className="space-y-1 text-sm text-slate-300">
                <li>• BullMQ jobs</li>
                <li>• Job state persistence</li>
                <li>• Retry with backoff</li>
                <li>• Priority queues</li>
                <li>• Dead letter handling</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function WizardStep({ step, title, ui, backend, database, worker }: { step: number; title: string; ui: string; backend: string; database: string; worker: string }) {
  return (
    <Card className="bg-slate-900/50 border-white/10">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold">{step}</span>
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <h3 className="text-white font-semibold mb-1">{title}</h3>
              <Badge variant="outline" className="text-xs">UI Layer</Badge>
              <p className="text-sm text-slate-400 mt-1">{ui}</p>
            </div>
            <div className="p-3 rounded bg-blue-500/10">
              <p className="text-xs text-blue-400 font-medium mb-1">Backend</p>
              <p className="text-sm text-slate-300">{backend}</p>
            </div>
            <div className="p-3 rounded bg-pink-500/10">
              <p className="text-xs text-pink-400 font-medium mb-1">Database</p>
              <p className="text-sm text-slate-300">{database}</p>
            </div>
            <div className="p-3 rounded bg-green-500/10">
              <p className="text-xs text-green-400 font-medium mb-1">Worker</p>
              <p className="text-sm text-slate-300">{worker}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
