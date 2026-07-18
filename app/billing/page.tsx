import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function BillingPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Billing System</h1>
          <p className="text-slate-400">Stripe subscription and usage-based billing</p>
        </div>
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Stripe</Badge>
      </div>

      {/* Pricing Model */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Pricing Model</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 mb-4">
            <p className="text-center text-lg text-white font-semibold">
              Customer Price = Actual Cost × Plan Multiplier
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { name: "Free", price: "$0", multiplier: "N/A", features: ["1 project", "Basic features", "Community support"] },
              { name: "Pay As You Go", price: "Cost + 20%", multiplier: "1.2x", features: ["Unlimited projects", "All features", "Email support"] },
              { name: "Pro", price: "$99/mo", multiplier: "1.0x", features: ["Unlimited projects", "Priority support", "API access"] },
              { name: "Agency", price: "$299/mo", multiplier: "0.9x", features: ["White label", "Client management", "Dedicated support"] },
              { name: "Enterprise", price: "Custom", multiplier: "0.8x", features: ["SLA", "Custom features", "Account manager"] },
            ].map((plan, i) => (
              <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/10">
                <h3 className="text-white font-bold text-lg mb-1">{plan.name}</h3>
                <p className="text-2xl font-bold text-purple-400 mb-2">{plan.price}</p>
                <p className="text-xs text-slate-500 mb-3">Multiplier: {plan.multiplier}</p>
                <div className="space-y-1">
                  {plan.features.map((f, j) => (
                    <p key={j} className="text-xs text-slate-400">• {f}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Usage Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Tracked Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { metric: "Store Build Fees", desc: "One-time per store creation", unit: "$25-50" },
                { metric: "Worker Runtime", desc: "VPS compute hours", unit: "$0.05/hr" },
                { metric: "AI API Usage", desc: "OpenAI/Anthropic tokens", unit: "Pass-through" },
                { metric: "Research API Usage", desc: "Serper/Tavily calls", unit: "Pass-through" },
                { metric: "Meta Ad Spend", desc: "Ad budget (handled by Meta)", unit: "N/A" },
                { metric: "Storage", desc: "Supabase storage", unit: "$0.02/GB" },
              ].map((u, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded bg-white/5">
                  <div>
                    <p className="text-white text-sm font-medium">{u.metric}</p>
                    <p className="text-slate-500 text-xs">{u.desc}</p>
                  </div>
                  <Badge variant="outline" className="text-slate-400">{u.unit}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Stripe Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="code-block p-4">
              <pre className="text-sm text-slate-300">
{`// Stripe Webhook Events
interface StripeEvents {
  "checkout.session.completed"
    → Create subscription
    
  "invoice.payment_succeeded"
    → Record payment
    
  "invoice.payment_failed"
    → Alert user, grace period
    
  "customer.subscription.updated"
    → Update plan
    
  "customer.subscription.deleted"
    → Downgrade to free
}

// Usage Records
stripe.subscriptionItems.createUsageRecord(
  subscriptionItemId,
  {
    quantity: workerHours,
    timestamp: now(),
    action: "increment"
  }
)`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Database Schema */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Billing Tables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="code-block p-4">
            <pre className="text-sm text-slate-300">
{`// subscriptions table
{
  id: uuid,
  user_id: uuid,
  stripe_customer_id: string,
  stripe_subscription_id: string,
  plan: "free" | "payg" | "pro" | "agency" | "enterprise",
  status: "active" | "canceled" | "past_due",
  current_period_start: timestamp,
  current_period_end: timestamp,
  cancel_at_period_end: boolean
}

// usage_records table
{
  id: uuid,
  project_id: uuid,
  metric_type: "worker_hours" | "ai_tokens" | "storage",
  quantity: decimal,
  recorded_at: timestamp
}

// invoices table (sync from Stripe)
{
  id: uuid,
  user_id: uuid,
  stripe_invoice_id: string,
  amount_due: integer (cents),
  amount_paid: integer (cents),
  status: "draft" | "open" | "paid" | "void",
  pdf_url: string
}`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
