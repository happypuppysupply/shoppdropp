import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function StoreBuilderPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Store Builder System</h1>
          <p className="text-slate-400">Autonomous Shopify store creation and optimization pipeline</p>
        </div>
        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Core Feature</Badge>
      </div>

      {/* Build Pipeline */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Build Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { step: "Research Market", desc: "Analyze competitors, trends, winning products", tool: "research.query", api: "Serper/Tavily" },
              { step: "Generate Brand", desc: "Create brand name, story, identity", tool: "ai.generate_text", api: "OpenAI" },
              { step: "Generate Logo", desc: "Create logo assets", tool: "ai.generate_image", api: "DALL-E/Midjourney" },
              { step: "Choose Theme", desc: "Select and customize Shopify theme", tool: "shopify.theme", api: "Shopify API" },
              { step: "Import Products", desc: "Import from AutoDS to Shopify", tool: "autods.import_product", api: "AutoDS + Shopify" },
              { step: "Optimize Listings", desc: "SEO titles, descriptions, tags", tool: "ai.generate_text", api: "OpenAI" },
              { step: "Create Collections", desc: "Organize products into collections", tool: "shopify.create_collection", api: "Shopify API" },
              { step: "Build Homepage", desc: "Generate sections, banners, content", tool: "shopify.update_theme", api: "Shopify API" },
              { step: "Create Pages", desc: "About, Contact, Policy pages", tool: "shopify.create_page", api: "Shopify API" },
              { step: "SEO Optimization", desc: "Meta tags, structured data", tool: "shopify.update_product", api: "Shopify API" },
              { step: "Marketing Assets", desc: "Ad creatives, social graphics", tool: "ai.generate_image", api: "OpenAI" },
              { step: "Quality Checks", desc: "Validate store completeness", tool: "shopify.validate", api: "Shopify API" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-white/5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">{i + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{item.step}</p>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </div>
                <div className="text-right">
                  <p className="text-purple-400 font-mono text-sm">{item.tool}</p>
                  <p className="text-slate-500 text-xs">{item.api}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Shopify Integration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Shopify API Operations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { op: "create_product", desc: "Create new product with variants" },
                { op: "update_product", desc: "Update product details" },
                { op: "create_collection", desc: "Create smart/custom collection" },
                { op: "update_collection", desc: "Modify collection rules" },
                { op: "create_page", desc: "Create CMS page" },
                { op: "update_theme", desc: "Modify theme settings" },
                { op: "create_blog", desc: "Create blog post" },
                { op: "create_metafield", desc: "Add custom data" },
              ].map((op, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded bg-white/5 text-sm">
                  <span className="text-green-400 font-mono">{op.op}</span>
                  <span className="text-slate-500 text-xs">{op.desc}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">AutoDS Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { op: "search_products", desc: "Search supplier catalog" },
                { op: "import_product", desc: "Import to Shopify" },
                { op: "update_price", desc: "Sync pricing changes" },
                { op: "sync_inventory", desc: "Update stock levels" },
                { op: "monitor_supplier", desc: "Track availability" },
                { op: "auto_replace", desc: "Replace out-of-stock" },
              ].map((op, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded bg-white/5 text-sm">
                  <span className="text-blue-400 font-mono">{op.op}</span>
                  <span className="text-slate-500 text-xs">{op.desc}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Automation Rules */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Automation Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AutomationCard
              title="Product Import"
              trigger="New winning product found"
              action="Auto-import to Shopify"
              approval="Required unless auto-mode"
            />
            <AutomationCard
              title="Price Sync"
              trigger="Supplier price change"
              action="Update Shopify price"
              approval="Auto if within margin"
            />
            <AutomationCard
              title="Inventory Sync"
              trigger="Stock level change"
              action="Update Shopify inventory"
              approval="Always automatic"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AutomationCard({ title, trigger, action, approval }: { title: string; trigger: string; action: string; approval: string }) {
  return (
    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
      <h3 className="text-white font-semibold mb-3">{title}</h3>
      <div className="space-y-2 text-sm">
        <div>
          <span className="text-slate-500">Trigger:</span>
          <p className="text-slate-300">{trigger}</p>
        </div>
        <div>
          <span className="text-slate-500">Action:</span>
          <p className="text-slate-300">{action}</p>
        </div>
        <div>
          <span className="text-slate-500">Approval:</span>
          <p className="text-slate-300">{approval}</p>
        </div>
      </div>
    </div>
  );
}
