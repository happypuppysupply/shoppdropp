import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ProjectSystemPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Project System</h1>
          <p className="text-slate-400">Complete project lifecycle management and configuration</p>
        </div>
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Implemented</Badge>
      </div>

      {/* Project Flow */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Project Lifecycle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
            {[
              "Sign Up",
              "Create Project",
              "Connect Shopify",
              "Connect AutoDS",
              "Connect AI",
              "Connect Research",
              "Review",
              "Launch",
            ].map((step, i) => (
              <div key={step} className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-2">
                  <span className="text-white font-bold text-sm">{i + 1}</span>
                </div>
                <span className="text-xs text-slate-400 text-center">{step}</span>
                {i < 7 && (
                  <div className="hidden lg:block absolute transform translate-x-8 mt-4">
                    <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Model */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Project Entity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="code-block p-4 overflow-x-auto">
              <pre className="text-sm text-slate-300">
{`interface Project {
  id: string;              // UUID
  user_id: string;         // Foreign key
  name: string;            // Project name
  status: ProjectStatus;   // draft | active | paused | archived
  
  // Shopify Configuration
  shopify_store: string;
  shopify_access_token: string; // Encrypted
  
  // AutoDS Configuration
  autods_api_key: string;  // Encrypted
  
  // AI Provider
  ai_provider: string;     // openai | anthropic | openrouter
  ai_api_key: string;      // Encrypted
  
  // Meta Ads
  meta_access_token: string;    // Encrypted
  meta_ad_account_id: string;
  meta_pixel_id: string;
  
  // Worker Assignment
  worker_id: string | null;
  
  // Timestamps
  created_at: DateTime;
  updated_at: DateTime;
}`}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Project States</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { state: "draft", desc: "Project created, configuration pending", color: "bg-slate-500" },
              { state: "configuring", desc: "User entering API credentials", color: "bg-blue-500" },
              { state: "ready", desc: "All credentials validated, ready to launch", color: "bg-yellow-500" },
              { state: "provisioning", desc: "Orchestrator creating VPS", color: "bg-orange-500" },
              { state: "active", desc: "Worker online, jobs executing", color: "bg-green-500" },
              { state: "paused", desc: "Automation paused by user", color: "bg-purple-500" },
              { state: "error", desc: "System error, manual intervention needed", color: "bg-red-500" },
              { state: "archived", desc: "Project deleted, resources cleaned up", color: "bg-gray-500" },
            ].map((s) => (
              <div key={s.state} className="flex items-center gap-3 p-2 rounded bg-white/5">
                <div className={`w-3 h-3 rounded-full ${s.color}`} />
                <span className="text-white font-mono text-sm">{s.state}</span>
                <span className="text-slate-500 text-xs ml-auto">{s.desc}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* API Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <IntegrationCard
          name="Shopify"
          icon="🛍️"
          fields={["Store URL", "Admin API Token", "Storefront Token"]}
          validation="API test on save"
        />
        <IntegrationCard
          name="AutoDS"
          icon="📦"
          fields={["API Key", "Webhook URL"]}
          validation="Key validation"
        />
        <IntegrationCard
          name="AI Provider"
          icon="🤖"
          fields={["Provider", "API Key", "Model Preference"]}
          validation="Test generation"
        />
        <IntegrationCard
          name="Meta Ads"
          icon="📢"
          fields={["Access Token", "Ad Account ID", "Pixel ID"]}
          validation="Token scope check"
        />
      </div>

      {/* Security */}
      <Card className="bg-slate-900/50 border-white/10 border-red-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <span className="text-red-400">🔒</span>
            Security Requirements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "All API keys encrypted at rest (AES-256)",
              "Keys never exposed to frontend",
              "Environment variables only",
              "No secrets in Git repository",
              "Automatic key rotation support",
              "Audit log for all credential access",
            ].map((req, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                <span className="text-red-400">•</span>
                {req}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function IntegrationCard({ name, icon, fields, validation }: { name: string; icon: string; fields: string[]; validation: string }) {
  return (
    <Card className="bg-slate-900/50 border-white/10 card-hover">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <CardTitle className="text-white text-lg">{name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          {fields.map((field, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-slate-400">
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              {field}
            </div>
          ))}
        </div>
        <Badge variant="outline" className="text-xs">{validation}</Badge>
      </CardContent>
    </Card>
  );
}
