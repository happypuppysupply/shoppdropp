import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ExternalAPIsPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">External API Layer</h1>
          <p className="text-slate-400">All third-party integrations and provider abstractions</p>
        </div>
        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Integrations</Badge>
      </div>

      {/* Shopify */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <span>🛍️</span> Shopify Admin API
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 rounded-lg bg-white/5">
              <p className="text-slate-500 text-xs mb-1">Auth Method</p>
              <p className="text-white text-sm">Admin API Access Token</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5">
              <p className="text-slate-500 text-xs mb-1">Rate Limit</p>
              <p className="text-white text-sm">2 calls/second (Shopify Plus: 4/s)</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5">
              <p className="text-slate-500 text-xs mb-1">Retry Strategy</p>
              <p className="text-white text-sm">Exponential backoff on 429</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AutoDS */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <span>📦</span> AutoDS API
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 rounded-lg bg-white/5">
              <p className="text-slate-500 text-xs mb-1">Auth Method</p>
              <p className="text-white text-sm">API Key (Header: X-API-KEY)</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5">
              <p className="text-slate-500 text-xs mb-1">Endpoints</p>
              <p className="text-white text-sm">Products, Orders, Suppliers</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5">
              <p className="text-slate-500 text-xs mb-1">Webhooks</p>
              <p className="text-white text-sm">Price changes, stock updates</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meta */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <span>📢</span> Meta Marketing API
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 rounded-lg bg-white/5">
              <p className="text-slate-500 text-xs mb-1">Auth Method</p>
              <p className="text-white text-sm">OAuth 2.0 Access Token</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5">
              <p className="text-slate-500 text-xs mb-1">API Version</p>
              <p className="text-white text-sm">v18.0+ (auto-upgrade)</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5">
              <p className="text-slate-500 text-xs mb-1">Rate Limit</p>
              <p className="text-white text-sm">200 calls/hour per user</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Providers */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <span>🤖</span> AI Providers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <ProviderCard name="OpenAI" auth="API Key" models="GPT-4, GPT-4o, DALL-E" />
            <ProviderCard name="Anthropic" auth="API Key" models="Claude 3.5, Claude 3" />
            <ProviderCard name="OpenRouter" auth="API Key" models="Multi-provider" />
            <ProviderCard name="Google" auth="API Key" models="Gemini 1.5" />
          </div>
        </CardContent>
      </Card>

      {/* Research */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <span>🔍</span> Research APIs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProviderCard name="Serper" auth="API Key" models="Google Search" />
            <ProviderCard name="Tavily" auth="API Key" models="AI Search" />
          </div>
        </CardContent>
      </Card>

      {/* Provider Abstraction */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Provider Abstraction Pattern</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="code-block p-4">
            <pre className="text-sm text-slate-300">
{`// Abstract base class
abstract class APIProvider {
  abstract authenticate(credentials: Credentials): Promise<void>;
  abstract execute<T>(request: APIRequest): Promise<T>;
  abstract handleError(error: Error): APIError;
  abstract rateLimit(): RateLimitInfo;
}

// Implementations
class ShopifyProvider extends APIProvider { ... }
class AutoDSProvider extends APIProvider { ... }
class MetaAdsProvider extends APIProvider { ... }

// Factory
class ProviderFactory {
  getProvider(type: string): APIProvider {
    switch(type) {
      case "shopify": return new ShopifyProvider();
      case "autods": return new AutoDSProvider();
      case "meta": return new MetaAdsProvider();
    }
  }
}`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ProviderCard({ name, auth, models }: { name: string; auth: string; models: string }) {
  return (
    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
      <h3 className="text-white font-semibold mb-2">{name}</h3>
      <p className="text-xs text-slate-500 mb-1">Auth: {auth}</p>
      <p className="text-xs text-slate-400">{models}</p>
    </div>
  );
}
