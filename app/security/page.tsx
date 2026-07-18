import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SecurityPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Security Model</h1>
          <p className="text-slate-400">Comprehensive security architecture and data protection</p>
        </div>
        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Critical</Badge>
      </div>

      {/* Security Principles */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Security Principles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { principle: "Encrypt Secrets", desc: "All API keys encrypted at rest (AES-256)" },
              { principle: "HTTPS Everywhere", desc: "TLS 1.3 for all communications" },
              { principle: "JWT Authentication", desc: "Short-lived tokens with refresh rotation" },
              { principle: "Role Based Access", desc: "RBAC with principle of least privilege" },
              { principle: "Rotate Secrets", desc: "Automatic key rotation every 90 days" },
              { principle: "No Secrets in Browser", desc: "Credentials never exposed to frontend" },
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-white/5">
                <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-red-400 text-xs font-bold">{i + 1}</span>
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{s.principle}</p>
                  <p className="text-slate-400 text-xs">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Encryption */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Encryption Architecture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-white/5">
                <h3 className="text-white font-semibold mb-2">At Rest</h3>
                <ul className="space-y-1 text-sm text-slate-400">
                  <li>• Database: AES-256 encryption</li>
                  <li>• API Keys: Encrypted columns in Supabase</li>
                  <li>• Backups: Encrypted S3 storage</li>
                  <li>• Keys: AWS KMS / HashiCorp Vault</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-white/5">
                <h3 className="text-white font-semibold mb-2">In Transit</h3>
                <ul className="space-y-1 text-sm text-slate-400">
                  <li>• TLS 1.3 for all connections</li>
                  <li>• Certificate pinning for Workers</li>
                  <li>• mTLS between internal services</li>
                  <li>• VPN for VPS management</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Authentication Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="code-block p-4">
              <pre className="text-sm text-slate-300">
{`// JWT Token Structure
interface JWTPayload {
  sub: string;        // user_id
  email: string;
  role: "user" | "admin";
  plan: string;
  iat: number;        // issued at
  exp: number;        // expires (1 hour)
}

// Refresh Token
interface RefreshPayload {
  sub: string;
  token_version: number;
  exp: number;        // expires (7 days)
}

// Row Level Security
policies: {
  "users can only read own data":
    auth.uid() = user_id,
  "admins can read all":
    auth.jwt()->>'role' = 'admin'
}`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Isolation */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Execution Environment Isolation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <IsolationCard
              title="VPS Isolation"
              desc="Each project has dedicated Hetzner VPS"
            />
            <IsolationCard
              title="Docker Containers"
              desc="Worker runs in isolated container"
            />
            <IsolationCard
              title="Network Segmentation"
              desc="Private networks per customer"
            />
            <IsolationCard
              title="Credential Isolation"
              desc="No shared secrets between projects"
            />
          </div>
        </CardContent>
      </Card>

      {/* Audit */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Audit Logging</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="code-block p-4">
            <pre className="text-sm text-slate-300">
{`// All security events logged
interface AuditEvent {
  id: uuid;
  user_id: string;
  action: string;
  resource: string;
  resource_id: string;
  changes: JSON;
  ip_address: string;
  user_agent: string;
  timestamp: DateTime;
}

// Events tracked:
// - Login/logout
// - API key creation/deletion
// - Project creation/deletion
// - Credential access
// - Billing changes
// - Permission changes`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function IsolationCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
      <h3 className="text-white font-semibold mb-2">{title}</h3>
      <p className="text-sm text-slate-400">{desc}</p>
    </div>
  );
}
