"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Brain, 
  ShoppingCart, 
  TrendingUp, 
  Shield, 
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Store,
  Zap,
  BarChart3,
  Users,
  Clock,
  Search,
  Target,
  Server,
  Cpu,
  RefreshCw,
  Lock
} from "lucide-react";
import { ShoppDroppLogo, ShoppDroppText } from "@/components/Logo";
import { WaitlistForm } from "@/components/WaitlistForm";
import { ExpandableSection } from "@/components/ExpandableSection";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AgentVisualization } from "@/components/AgentVisualization";
import { Preloader } from "@/components/Preloader";
import { AuthModal } from "@/components/AuthModal";

const features = [
  {
    icon: Brain,
    title: "AI Catalog Optimization",
    description: "Automatically rewrites product descriptions, generates SEO meta tags, and optimizes images for higher conversion rates.",
    color: "from-violet-500 to-purple-500",
  },
  {
    icon: Search,
    title: "AI Product Research",
    description: "Discovers winning products by analyzing market trends, competitor data, and supplier catalogs. Auto-imports to your store.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Target,
    title: "Meta Ads Automation",
    description: "Creates, launches, and optimizes Facebook & Instagram ad campaigns. AI handles targeting, creatives, and budget allocation.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: TrendingUp,
    title: "Dynamic Pricing",
    description: "Monitors competitor prices and adjusts your pricing strategy in real-time to maximize margins and win sales.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "Inventory Sync",
    description: "Keeps your store in sync with AutoDS or your supplier. Auto-pauses out-of-stock items and updates quantities.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: ShoppingCart,
    title: "Smart Collections",
    description: "AI organizes products into collections based on performance, seasonality, and buyer behavior patterns.",
    color: "from-fuchsia-500 to-violet-500",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Connect or Create",
    description: "Transfer your existing Shopify store OR let our AI build a new one from scratch with optimized themes and collections.",
  },
  {
    step: "02",
    title: "Configure Your AI",
    description: "Set your preferences: brand voice, pricing rules, supplier connections, Meta Ads budget, and automation thresholds.",
  },
  {
    step: "03",
    title: "Go Autonomous",
    description: "The AI manages product research, catalog optimization, inventory, pricing, and ad campaigns — 24/7 hands-free.",
  },
];



export default function LandingPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  
  return (
    <>
      <Preloader />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <main className="relative min-h-screen bg-background text-foreground">
        {/* Background */}
      <div className="fixed inset-0 grid-pattern -z-10 opacity-50" />
      <div className="fixed inset-0 bg-gradient-to-b from-background via-transparent to-background -z-10" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <ShoppDroppLogo size={32} />
              <span className="font-bold text-xl tracking-tight">
                <span className="text-foreground">SHOPP</span>
                <span className="text-[#ec4899]">DROPP</span>
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
              <a href="#infrastructure" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Infrastructure</a>
              <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Now in Private Beta</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Your Shopify Store,<br />
                <span className="gradient-text">Managed by AI</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Bring your existing Shopify store OR let our AI build one from scratch. 
                Our agent handles product research, catalog optimization, Meta ads, pricing, 
                inventory sync, and content — 24/7 autonomous management for dropshippers 
                and agencies.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  Sign Up <ArrowRight className="w-5 h-5" />
                </button>
                <a
                  href="#how-it-works"
                  className="px-8 py-4 rounded-xl glass border border-border text-foreground font-semibold hover:bg-secondary transition-colors flex items-center justify-center"
                >
                  See How It Works
                </a>
              </div>
              <div className="flex items-center gap-6 mt-8 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  No credit card required
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  Transfer existing or create new
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <AgentVisualization />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Autonomous Store Management
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your AI agent works 24/7 to optimize your catalog, sync inventory, 
              adjust pricing, and generate content — so you can scale.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group p-6 rounded-2xl glass border border-border hover:border-violet-500/30 transition-all hover:bg-secondary"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Connect Your Store in Minutes
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Already have a Shopify store? Perfect. ShoppDropp integrates with 
              any setup — no migration needed.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="text-6xl font-bold text-foreground/5 absolute -top-4 -left-2">
                  {step.step}
                </div>
                <div className="relative p-6 rounded-2xl glass border border-border">
                  <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-violet-500/50 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* For Whom Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Built for Dropshippers & Agencies
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                    <Store className="w-6 h-6 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">Dropshippers</h3>
                    <p className="text-muted-foreground text-sm">
                      Running multiple stores? Let AI handle the repetitive catalog 
                      work while you find winning products and scale ad spend.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">Agencies</h3>
                    <p className="text-muted-foreground text-sm">
                      Manage client stores at scale. Offer autonomous management 
                      as a premium service with white-label dashboards.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">Solo Entrepreneurs</h3>
                    <p className="text-muted-foreground text-sm">
                      Can't afford a VA? The AI handles catalog updates, inventory 
                      management, and content while you focus on growth.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-8"
            >
              <h3 className="text-xl font-semibold text-foreground mb-6">What You Get</h3>
              <div className="space-y-4">
                {[
                  "AI product research & winning products",
                  "AI catalog optimization & SEO",
                  "Meta & TikTok ads automation",
                  "Dynamic pricing based on competition",
                  "AutoDS / supplier inventory sync",
                  "Smart collections & organization",
                  "Content generation (blog, social, ads)",
                  "Performance analytics & reporting",
                  "24/7 automated monitoring",
                  "Approval workflows (optional)",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-foreground text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Infrastructure Section */}
      <section id="infrastructure" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Dedicated AI Infrastructure
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every store gets its own isolated VPS and dedicated AI worker. 
              Your data stays separate, secure, and always running.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* VPS Creation Flow */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-6"
            >
              <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <Server className="w-5 h-5 text-violet-400" />
                VPS Provisioning Pipeline
              </h3>
              <div className="space-y-3">
                <ExpandableSection title="Step 1: Provision VPS (~30s)">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>We spin up a fresh Ubuntu 24.04 LTS server on Hetzner Cloud in the Falkenstein, Germany datacenter (EU). Your store's VPS is completely isolated — no shared resources with other customers.</p>
                    <p><strong className="text-foreground">Default specs by plan:</strong></p>
                    <ul className="list-disc list-inside text-xs space-y-1 ml-2">
                      <li>Pay As You Go: CX21 (2 vCPU, 4 GB RAM, 40 GB SSD)</li>
                      <li>Growth: CPX31 (4 vCPU, 8 GB RAM, 160 GB NVMe)</li>
                      <li>Agency: CCX33 (8 vCPU, 32 GB RAM, 240 GB NVMe)</li>
                    </ul>
                    <p className="text-xs">Upgrade/downgrade VPS size anytime from your dashboard.</p>
                  </div>
                </ExpandableSection>

                <ExpandableSection title="Step 2: Install Docker (~60s)">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>The VPS is hardened with automated scripts that install Docker CE, docker-compose, and container networking. We also configure:</p>
                    <ul className="list-disc list-inside text-xs space-y-1 ml-2">
                      <li>UFW firewall (only ports 22, 80, 443 open)</li>
                      <li>Fail2ban for brute-force protection</li>
                      <li>Unattended security updates</li>
                      <li>Log rotation to prevent disk bloat</li>
                    </ul>
                  </div>
                </ExpandableSection>

                <ExpandableSection title="Step 3: Deploy Worker (~45s)">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Your AI worker image is pulled from our private container registry. The image includes:</p>
                    <ul className="list-disc list-inside text-xs space-y-1 ml-2">
                      <li>Node.js 20 runtime with PM2 process manager</li>
                      <li>Python 3.11 for ML inference (product scoring, pricing)</li>
                      <li>Chrome headless for web scraping</li>
                      <li>Pre-installed Shopify Admin API client</li>
                      <li>Pre-installed Meta Marketing API client</li>
                    </ul>
                  </div>
                </ExpandableSection>

                <ExpandableSection title="Step 4: Inject Config (~5s)">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Your store's credentials are mounted as encrypted environment variables. This includes:</p>
                    <ul className="list-disc list-inside text-xs space-y-1 ml-2">
                      <li>Shopify Admin API access token</li>
                      <li>Supplier API key (AutoDS, Spocket, etc.)</li>
                      <li>Meta Business Suite access token (if ads enabled)</li>
                      <li>OpenAI/Anthropic API key for LLM inference</li>
                      <li>Your configured pricing rules and thresholds</li>
                    </ul>
                    <p className="text-xs">Credentials are encrypted with AES-256-GCM and never logged.</p>
                  </div>
                </ExpandableSection>

                <ExpandableSection title="Step 5: Start Agent (~10s)">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>The worker registers itself with our central orchestrator via secure WebSocket. The orchestrator:</p>
                    <ul className="list-disc list-inside text-xs space-y-1 ml-2">
                      <li>Verifies the worker's identity with a signed JWT</li>
                      <li>Assigns a unique worker ID to your store</li>
                      <li>Pushes the latest AI model weights</li>
                      <li>Syncs the initial product catalog from Shopify</li>
                    </ul>
                  </div>
                </ExpandableSection>

                <ExpandableSection title="Step 6: Go Live (Instant)">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>The AI begins its first autonomous cycle immediately:</p>
                    <ul className="list-disc list-inside text-xs space-y-1 ml-2">
                      <li>Scans all products and creates optimization queue</li>
                      <li>Checks inventory levels against supplier feed</li>
                      <li>Runs competitor price scan</li>
                      <li>Generates first batch of SEO recommendations</li>
                    </ul>
                    <p className="text-xs">You'll see activity in your dashboard within 30 seconds.</p>
                  </div>
                </ExpandableSection>
              </div>
              <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="text-green-600 dark:text-green-400 text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Total boot time: ~3 minutes
                </p>
              </div>
            </motion.div>

            {/* What Worker Does */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-6"
            >
              <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-cyan-400" />
                What Your AI Worker Does
              </h3>
              <div className="space-y-3">
                <ExpandableSection title="Product Research — Finding Winners">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>The AI monitors market signals across multiple platforms to surface high-potential products:</p>
                    <ul className="list-disc list-inside text-xs space-y-1 ml-2">
                      <li><strong className="text-foreground">TikTok Creative Center</strong> — Tracks trending products before saturation</li>
                      <li><strong className="text-foreground">Google Trends</strong> — Identifies breakout search terms</li>
                      <li><strong className="text-foreground">Competitor Monitoring</strong> — Watches 50+ competitor stores in your niche</li>
                      <li><strong className="text-foreground">Supplier Feeds</strong> — New arrivals with high demand, low competition</li>
                      <li><strong className="text-foreground">Margin Calculator</strong> — Only suggests products with &gt;30% margin</li>
                    </ul>
                    <p className="text-xs">Products scoring 75+ are queued for your review. Score 90&gt; triggers auto-import if you enable it.</p>
                  </div>
                </ExpandableSection>

                <ExpandableSection title="Catalog Optimization — SEO & Conversion">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Your product pages are continuously improved for both search ranking and conversion rate:</p>
                    <ul className="list-disc list-inside text-xs space-y-1 ml-2">
                      <li><strong className="text-foreground">Title Optimization</strong> — Keyword-rich, under 70 chars, click-optimized</li>
                      <li><strong className="text-foreground">Description Rewriting</strong> — AIDA format, pain point focus, CTA included</li>
                      <li><strong className="text-foreground">Meta Tags</strong> — Auto-generated meta descriptions, Open Graph tags</li>
                      <li><strong className="text-foreground">Image Optimization</strong> — WebP compression, alt text, structured data</li>
                      <li><strong className="text-foreground">Schema Markup</strong> — Product, Review, and Organization schema</li>
                    </ul>
                    <p className="text-xs">Changes are queued for approval by default. Enable auto-publish after you trust the AI.</p>
                  </div>
                </ExpandableSection>

                <ExpandableSection title="Meta Ads Management — Full Funnel">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>The AI handles the complete Meta ads lifecycle, from creation to optimization:</p>
                    <ul className="list-disc list-inside text-xs space-y-1 ml-2">
                      <li><strong className="text-foreground">Campaign Setup</strong> — CAPI pixel, custom audiences, budget allocation</li>
                      <li><strong className="text-foreground">Creative Generation</strong> — 5 ad copy variants per product, carousel generation</li>
                      <li><strong className="text-foreground">Targeting</strong> — Lookalike from purchasers, interest stacking, LLA refresh</li>
                      <li><strong className="text-foreground">KPI Guards</strong> — Auto-pause below 1.5 ROAS, scale winners at 3+ ROAS</li>
                    </ul>
                    <p className="text-xs">Requires Meta Business Manager. You set daily budget caps — AI never exceeds them.</p>
                  </div>
                </ExpandableSection>

                <ExpandableSection title="Dynamic Pricing — Smart Margins">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Pricing adjusts automatically while protecting your bottom line:</p>
                    <ul className="list-disc list-inside text-xs space-y-1 ml-2">
                      <li><strong className="text-foreground">Competitor Tracking</strong> — Up to 10 competitors per product, checked every 6 hours</li>
                      <li><strong className="text-foreground">Floor Price Guard</strong> — Never below your minimum margin (you set this)</li>
                      <li><strong className="text-foreground">Elasticity Scoring</strong> — Learns which products are price-sensitive</li>
                      <li><strong className="text-foreground">Time-Based Pricing</strong> — Higher during peak hours, lower during slow periods</li>
                    </ul>
                    <p className="text-xs">All changes logged. Bulk revert available. Approval required for changes &gt;15%.</p>
                  </div>
                </ExpandableSection>

                <ExpandableSection title="Inventory Sync — Never Sell Out">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Real-time inventory sync prevents overselling and lost sales:</p>
                    <ul className="list-disc list-inside text-xs space-y-1 ml-2">
                      <li><strong className="text-foreground">AutoDS Sync</strong> — Stock levels pulled every 15 minutes</li>
                      <li><strong className="text-foreground">Auto-Pause</strong> — Products go out of stock instantly at supplier</li>
                      <li><strong className="text-foreground">Restock Alerts</strong> — Slack/email push when supplier adds inventory</li>
                      <li><strong className="text-foreground">Variant Granularity</strong> — Color/size variants synced individually</li>
                    </ul>
                    <p className="text-xs">Also supports Spocket, CJ Dropshipping, Zendrop, and custom CSV feeds.</p>
                  </div>
                </ExpandableSection>

                <ExpandableSection title="Order Fulfillment — Hands-Free">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>The AI routes orders automatically to your supplier:</p>
                    <ul className="list-disc list-inside text-xs space-y-1 ml-2">
                      <li><strong className="text-foreground">Auto Ordering</strong> — Orders forwarded to supplier within 5 minutes</li>
                      <li><strong className="text-foreground">Tracking Sync</strong> — Tracking numbers pushed back to Shopify</li>
                      <li><strong className="text-foreground">Address Validation</strong> — Flags undeliverable addresses before ordering</li>
                      <li><strong className="text-foreground">Exception Handling</strong> — Rejected orders escalated to human review</li>
                    </ul>
                    <p className="text-xs">Currently supports AutoDS auto-ordering. Other suppliers coming soon.</p>
                  </div>
                </ExpandableSection>

                <ExpandableSection title="Analytics — Data-Driven Decisions">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Comprehensive reporting with actionable insights:</p>
                    <ul className="list-disc list-inside text-xs space-y-1 ml-2">
                      <li><strong className="text-foreground">Product Performance</strong> — Revenue, margin, return rate by SKU</li>
                      <li><strong className="text-foreground">Catalog Health</strong> — Missing images, broken links, SEO gaps</li>
                      <li><strong className="text-foreground">Competitor Delta</strong>—— Where your pricing/positioning differs</li>
                      <li><strong className="text-foreground">Weekly Digest</strong> — Summary email every Monday</li>
                    </ul>
                    <p className="text-xs">Reports available in dashboard and sent via email/Slack.</p>
                  </div>
                </ExpandableSection>

                <ExpandableSection title="Content Creation — Scale Your Brand">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>AI generates content to drive organic traffic and engagement:</p>
                    <ul className="list-disc list-inside text-xs space-y-1 ml-2">
                      <li><strong className="text-foreground">Blog Posts</strong> — SEO-optimized, 800-1500 words, 2-4x/week</li>
                      <li><strong className="text-foreground">Social Posts</strong>—— Instagram/Facebook copy, hashtag suggestions</li>
                      <li><strong className="text-foreground">Email Sequences</strong> — Abandoned cart, win-back, product drops</li>
                      <li><strong className="text-foreground">Ad Creative Copy</strong>—— Meta/TikTok headlines and body text</li>
                    </ul>
                    <p className="text-xs">All content matches your brand voice (set during onboarding). Includes real product data for accuracy.</p>
                  </div>
                </ExpandableSection>
              </div>
            </motion.div>
          </div>

          {/* Security & Recovery */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl glass border border-border">
              <Shield className="w-8 h-8 text-emerald-400 mb-3" />
              <h4 className="text-foreground font-semibold mb-1">Isolated Environment</h4>
              <p className="text-muted-foreground text-sm">Each store runs on its own VPS. No shared resources, no cross-contamination.</p>
            </div>
            <div className="p-4 rounded-xl glass border border-border">
              <RefreshCw className="w-8 h-8 text-amber-400 mb-3" />
              <h4 className="text-foreground font-semibold mb-1">Auto-Recovery</h4>
              <p className="text-muted-foreground text-sm">Worker crashes? VPS fails? Auto-restarts and re-provisions in minutes.</p>
            </div>
            <div className="p-4 rounded-xl glass border border-border">
              <Lock className="w-8 h-8 text-pink-400 mb-3" />
              <h4 className="text-foreground font-semibold mb-1">Encrypted Credentials</h4>
              <p className="text-muted-foreground text-sm">All API keys and store credentials encrypted at rest and in transit.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Usage-Based Pricing
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Pay for VPS and runtime costs with our markup. Subscribe to reduce markup and unlock more stores.
            </p>
          </div>

          {/* How Pricing Works */}
          <div className="glass rounded-2xl p-6 mb-12 max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold text-foreground mb-4 text-center">How You're Billed</h3>
            <div className="grid md:grid-cols-2 gap-6 text-center max-w-2xl mx-auto">
              <div>
                <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto mb-3">
                  <Server className="w-6 h-6 text-violet-400" />
                </div>
                <p className="text-foreground font-medium mb-1">VPS Cost</p>
                <p className="text-muted-foreground text-sm">We pay Hetzner ~$6-30/mo per VPS</p>
              </div>
              <div>
                <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-pink-400" />
                </div>
                <p className="text-foreground font-medium mb-1">Runtime Hours</p>
                <p className="text-muted-foreground text-sm">Billed per hour your AI worker runs</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Pay As You Go */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-6 border border-border"
            >
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">Pay As You Go</h3>
                <p className="text-muted-foreground text-sm">No subscription, just usage</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">$0</span>
                <span className="text-muted-foreground">/mo subscription</span>
              </div>
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 mb-4">
                <p className="text-sm text-amber-300">High markup on VPS + runtime</p>
                <p className="text-xs text-muted-foreground">~$45-85/mo per store typical</p>
              </div>
              <ul className="space-y-3 mb-6">
                {[
                  "1 store limit",
                  "200 product limit",
                  "CX21 VPS",
                  "24/7 AI worker",
                  "Basic catalog optimization",
                  "Inventory sync",
                  "Email support",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => setAuthModalOpen(true)}
                className="w-full py-3 rounded-xl glass border border-border text-foreground font-medium hover:bg-secondary transition-colors"
              >
                Get Started Free
              </button>
            </motion.div>

            {/* Growth - Popular */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-6 border-2 border-violet-500/50 relative"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 text-white text-xs font-medium">
                Most Popular
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">Growth</h3>
                <p className="text-muted-foreground text-sm">Lower markup, more stores</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">$29</span>
                <span className="text-muted-foreground">/mo subscription</span>
              </div>
              <div className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/20 mb-4">
                <p className="text-sm text-violet-300">Medium markup on VPS + runtime</p>
                <p className="text-xs text-muted-foreground">~$35-65/mo per store typical</p>
              </div>
              <ul className="space-y-3 mb-6">
                {[
                  "Up to 4 stores",
                  "2,000 products per store",
                  "CPX31 VPS",
                  "24/7 AI worker per store",
                  "Meta Ads automation",
                  "AI product research",
                  "Priority support",
                  "All Pay As You Go features",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => setAuthModalOpen(true)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity"
              >
                Start 14-Day Free Trial
              </button>
            </motion.div>

            {/* Agency */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-6 border border-border"
            >
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">Agency</h3>
                <p className="text-muted-foreground text-sm">Lowest markup, up to 100 stores</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">$199</span>
                <span className="text-muted-foreground">/mo subscription</span>
              </div>
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 mb-4">
                <p className="text-sm text-emerald-300">Low markup on VPS + runtime</p>
                <p className="text-xs text-muted-foreground">~$25-50/mo per store typical</p>
              </div>
              <ul className="space-y-3 mb-6">
                {[
                  "Up to 100 stores",
                  "Unlimited products",
                  "CCX33 VPS",
                  "24/7 AI worker per store",
                  "Meta + TikTok Ads",
                  "Advanced product research",
                  "White-label dashboard",
                  "API access",
                  "Dedicated account manager",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => setAuthModalOpen(true)}
                className="w-full py-3 rounded-xl glass border border-border text-foreground font-medium hover:bg-secondary transition-colors"
              >
                Start 14-Day Free Trial
              </button>
            </motion.div>
          </div>

          {/* Cost Example */}
          <div className="mt-12 glass rounded-2xl p-6 max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold text-foreground mb-4 text-center">Example: 4 Store Costs</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 rounded-lg glass">
                <p className="text-muted-foreground text-sm mb-2">Pay As You Go</p>
                <p className="text-2xl font-bold text-foreground">~$180-340</p>
                <p className="text-muted-foreground text-xs">4 stores × ~$45-85/mo</p>
              </div>
              <div className="p-4 rounded-lg bg-violet-500/10 border border-violet-500/20">
                <p className="text-violet-300 text-sm mb-2">Growth Plan</p>
                <p className="text-2xl font-bold text-foreground">~$169-289</p>
                <p className="text-muted-foreground text-xs">$29/mo + 4 stores × ~$35-65/mo</p>
              </div>
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-emerald-300 text-sm mb-2">Agency Plan</p>
                <p className="text-2xl font-bold text-foreground">~$299-399</p>
                <p className="text-muted-foreground text-xs">$199/mo + 4 stores × ~$25-50/mo</p>
                <p className="text-emerald-400 text-xs mt-1">Best for 10+ stores</p>
              </div>
            </div>
            <p className="text-center text-muted-foreground text-sm mt-4">
              * Costs vary by VPS size and runtime hours. Higher subscription = lower markup = lower total at scale.
            </p>
          </div>

          {/* FAQ Note */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground text-sm">
              All plans include dedicated VPS, 24/7 AI worker, automatic backups, and SSL certificates. 
              No hidden fees. Cancel anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Deep Dive */}
      <section id="feature-details" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              How Each Feature Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Deep dive into each AI capability and how it operates autonomously on your store.
            </p>
          </div>

          <div className="space-y-4">
            <ExpandableSection title="AI Product Research — Finding Winning Products">
              <div className="space-y-4 text-foreground text-sm">
                <p>
                  Our AI scans multiple data sources to identify products with high sales potential before they become saturated. It analyzes:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong className="text-foreground">Market trend data</strong> — Google Trends, TikTok viral velocity, search volume changes</li>
                  <li><strong className="text-foreground">Competitor catalogs</strong> — Price tracking across similar stores, gap analysis</li>
                  <li><strong className="text-foreground">Supplier availability</strong> — AutoDS, Spocket, CJ Dropshipping inventory depth</li>
                  <li><strong className="text-foreground">Margin analysis</strong> — Shipping costs, supplier price, recommended retail price</li>
                  <li><strong className="text-foreground">Seasonality scoring</strong> — Historical demand patterns, upcoming events</li>
                </ul>
                <p>
                  Products scoring above 75/100 on our "winning product score" get auto-imported to your store with AI-generated listings. You review before publish, or set auto-publish for scores above 90.
                </p>
                <div className="p-3 rounded-lg glass border border-border mt-2">
                  <p className="text-xs text-muted-foreground">Data sources: Serper API, Tavily, AutoDS, Google Trends, TikTok Creative Center</p>
                </div>
              </div>
            </ExpandableSection>

            <ExpandableSection title="Meta Ads Automation — Campaign Creation to Optimization">
              <div className="space-y-4 text-foreground text-sm">
                <p>
                  The AI handles the full Meta Ads lifecycle without manual intervention:
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-3">
                  <div className="p-3 rounded-lg glass">
                    <p className="text-foreground font-medium mb-2">Campaign Setup</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Creates CAPI pixel connection</li>
                      <li>• Builds custom audiences from store data</li>
                      <li>• Sets budget based on product margin</li>
                    </ul>
                  </div>
                  <div className="p-3 rounded-lg glass">
                    <p className="text-foreground font-medium mb-2">Creative Generation</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Generates ad copy (5 variants)</li>
                      <li>• Creates product carousels</li>
                      <li>• A/B tests thumbnails</li>
                    </ul>
                  </div>
                  <div className="p-3 rounded-lg glass">
                    <p className="text-foreground font-medium mb-2">Targeting</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Lookalike from purchasers</li>
                      <li>• Interest stacking</li>
                      <li>• Retargeting funnel stages</li>
                    </ul>
                  </div>
                  <div className="p-3 rounded-lg glass">
                    <p className="text-foreground font-medium mb-2">Optimization</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Kills ads below 1.5 ROAS</li>
                      <li>• Scales winners (+20% daily)</li>
                      <li>• Budget reallocation weekly</li>
                    </ul>
                  </div>
                </div>
                <p className="mt-2">
                  Requires Meta Business Manager access. The AI never spends above your daily budget cap and pauses all ads if ROAS drops below your threshold for 3 days.
                </p>
              </div>
            </ExpandableSection>

            <ExpandableSection title="Catalog Optimization — SEO & Conversion">
              <div className="space-y-4 text-foreground text-sm">
                <p>
                  The AI continuously improves your product listings using data-driven optimization:
                </p>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg glass">
                    <p className="text-foreground font-medium text-sm mb-1">Description Rewriting</p>
                    <p className="text-xs">Analyzes top 10 competitors for each product, identifies common keywords, pain points, and emotional triggers. Writes descriptions that rank for both SEO and conversion.</p>
                  </div>
                  <div className="p-3 rounded-lg glass">
                    <p className="text-foreground font-medium text-sm mb-1">Meta Tags</p>
                    <p className="text-xs">Auto-generates title tags (&lt;70 chars), meta descriptions (&lt;160 chars), and alt text. Tracks Google Search Console data to iterate on underperforming pages.</p>
                  </div>
                  <div className="p-3 rounded-lg glass">
                    <p className="text-foreground font-medium text-sm mb-1">Image Optimization</p>
                    <p className="text-xs">Compresses images to WebP, adds structured data, generates alt text. If enabled, can generate AI product images for dropshipped items to avoid supplier photos.</p>
                  </div>
                </div>
                <p>
                  <strong className="text-foreground">Approval mode:</strong> By default, changes are queued in a "Pending Review" state. You approve individually or in bulk. Can switch to "Auto-publish" once you trust the AI's taste.
                </p>
              </div>
            </ExpandableSection>

            <ExpandableSection title="Dynamic Pricing — Margin Protection">
              <div className="space-y-4 text-foreground text-sm">
                <p>
                  Pricing adjusts automatically based on real-time market conditions while protecting your minimum margin:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong className="text-foreground">Competitor monitoring</strong> — Tracks up to 10 competitor prices per product, checks every 6 hours</li>
                  <li><strong className="text-foreground">Floor price protection</strong> — Never prices below your set minimum margin (e.g., 30%)</li>
                  <li><strong className="text-foreground">Elasticity scoring</strong> — Learns which products are price-sensitive vs. brand-sensitive</li>
                  <li><strong className="text-foreground">Flash sale detection</strong> — Identifies when competitors run promos and adjusts accordingly</li>
                  <li><strong className="text-foreground">Time-based pricing</strong> — Higher prices during peak hours, discounts during slow periods</li>
                </ul>
                <p>
                  Pricing changes are logged with before/after. Can be reverted in bulk or set to require approval for changes over 15%.
                </p>
              </div>
            </ExpandableSection>

            <ExpandableSection title="Inventory Sync — Never Sell Out">
              <div className="space-y-4 text-foreground text-sm">
                <p>
                  Real-time inventory synchronization prevents overselling and lost sales:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong className="text-foreground">AutoDS sync</strong> — Pulls stock levels every 15 minutes. Auto-pauses products at 0 inventory.</li>
                  <li><strong className="text-foreground">Restock alerts</strong> — Notifies you when supplier restocks (push to Slack/email)</li>
                  <li><strong className="text-foreground">Variant mapping</strong> — Syncs color/size variants individually, not just parent SKU</li>
                  <li><strong className="text-foreground">Safety buffer</strong> — Keeps 5-10% of displayed stock in reserve to prevent overselling</li>
                </ul>
                <p>
                  Supports AutoDS, Spocket, CJ Dropshipping, Zendrop, and custom supplier CSV/API feeds.
                </p>
              </div>
            </ExpandableSection>

            <ExpandableSection title="AI Content Generation — Blog, Social, Email">
              <div className="space-y-4 text-foreground text-sm">
                <p>
                  Beyond product pages, the AI creates a full content ecosystem:
                </p>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg glass">
                    <p className="text-foreground text-sm font-medium">Blog Posts</p>
                    <p className="text-xs text-muted-foreground mt-1">SEO-optimized articles related to your niche, published 2-4x/week</p>
                  </div>
                  <div className="p-3 rounded-lg glass">
                    <p className="text-foreground text-sm font-medium">Social Media</p>
                    <p className="text-xs text-muted-foreground mt-1">Instagram/Facebook posts and stories, scheduled via buffer</p>
                  </div>
                  <div className="p-3 rounded-lg glass">
                    <p className="text-foreground text-sm font-medium">Email Campaigns</p>
                    <p className="text-xs text-muted-foreground mt-1">Abandoned cart, win-back, product launch sequences</p>
                  </div>
                  <div className="p-3 rounded-lg glass">
                    <p className="text-foreground text-sm font-medium">Ad Creative</p>
                    <p className="text-xs text-muted-foreground mt-1">Meta/TikTok ad copy, headlines, call-to-actions</p>
                  </div>
                </div>
                <p>
                  All content matches your configured brand voice (professional, playful, luxury, etc.) and can include your store's actual product data for contextual accuracy.
                </p>
              </div>
            </ExpandableSection>
          </div>
        </div>
      </section>

      {/* Integration Requirements */}
      <section id="integrations" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              What You Need to Get Started
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything the AI needs access to. We never store credentials in plain text.
            </p>
          </div>

          <div className="space-y-4">
            <ExpandableSection title="Shopify Store (Existing or New)">
              <div className="text-foreground text-sm space-y-3">
                <p><strong className="text-foreground">Option A: Connect existing store</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Shopify Admin API access token</li>
                  <li>Permissions: read_products, write_products, read_orders, write_orders, read_inventory, write_inventory</li>
                  <li>Works with any theme (Dawn, Impulse, Prestige, Shopify 2.0)</li>
                </ul>
                <p className="mt-2"><strong className="text-foreground">Option B: Create from scratch</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>We set up a new Shopify store for you</li>
                  <li>AI selects optimal theme based on niche</li>
                  <li>Initial product research and import included</li>
                </ul>
              </div>
            </ExpandableSection>

            <ExpandableSection title="Supplier Integration (AutoDS Recommended)">
              <div className="text-foreground text-sm space-y-3">
                <p><strong className="text-foreground">Required for inventory sync and order fulfillment</strong></p>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg glass">
                    <p className="text-foreground text-sm font-medium">AutoDS</p>
                    <p className="text-xs text-muted-foreground">Full sync + automated ordering. API key from AutoDS settings.</p>
                  </div>
                  <div className="p-3 rounded-lg glass">
                    <p className="text-foreground text-sm font-medium">Spocket</p>
                    <p className="text-xs text-muted-foreground">US/EU suppliers. API key from Spocket dashboard.</p>
                  </div>
                  <div className="p-3 rounded-lg glass">
                    <p className="text-foreground text-sm font-medium">CJ Dropshipping</p>
                    <p className="text-xs text-muted-foreground">Wide product range. Email + API key.</p>
                  </div>
                  <div className="p-3 rounded-lg glass">
                    <p className="text-foreground text-sm font-medium">Zendrop</p>
                    <p className="text-xs text-muted-foreground">Fast US shipping. API key from account.</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Don't have a supplier yet? Our AI can suggest the best supplier for your niche during onboarding.
                </p>
              </div>
            </ExpandableSection>

            <ExpandableSection title="Meta Business Manager (For Ads)">
              <div className="text-foreground text-sm space-y-3">
                <p>
                  Required only if you want Meta Ads automation. If you only want catalog/product management, this is optional.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Meta Business Account ID</li>
                  <li>Ad Account ID (act_)</li>
                  <li>Meta Access Token (with ads_management permission)</li>
                  <li>Facebook Pixel installed on Shopify (or we install it)</li>
                </ul>
                <p className="text-xs text-muted-foreground mt-2">
                  The AI creates campaigns under your existing Business Manager. You retain full billing control and can override any decision.
                </p>
              </div>
            </ExpandableSection>

            <ExpandableSection title="AI Provider (OpenAI Recommended)">
              <div className="text-foreground text-sm space-y-3">
                <p>
                  The AI needs an LLM for reasoning, content generation, and decision-making.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong className="text-foreground">OpenAI</strong> — GPT-4o recommended. API key from platform.openai.com</li>
                  <li><strong className="text-foreground">Anthropic</strong> — Claude 3.5 Sonnet. API key from console.anthropic.com</li>
                  <li><strong className="text-foreground">Groq</strong> — Fast inference. API key from groq.com</li>
                </ul>
                <p className="text-xs text-muted-foreground mt-2">
                  Costs ~$5-20/mo in API usage depending on store size and activity. Not included in ShoppDropp pricing.
                </p>
              </div>
            </ExpandableSection>

            <ExpandableSection title="Research APIs (Optional)">
              <div className="text-foreground text-sm space-y-3">
                <p>
                  Optional but recommended for better product research:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong className="text-foreground">Serper API</strong> — Google search results. serper.dev</li>
                  <li><strong className="text-foreground">Tavily</strong> — AI search. tavily.com</li>
                  <li><strong className="text-foreground">Google Trends</strong> — Free, used for seasonality</li>
                </ul>
              </div>
            </ExpandableSection>
          </div>
        </div>
      </section>

      {/* Comprehensive FAQ */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything else you need to know before signing up.
            </p>
          </div>

          <div className="space-y-4">
            <ExpandableSection title="Will this work with my existing Shopify store?">
              <p className="text-foreground text-sm">
                Yes. The AI connects via Shopify Admin API and works with any theme, any builder, any collection structure. It reads your existing catalog, optimizes it, and makes changes through the API. Nothing is broken, everything is reversible.
              </p>
            </ExpandableSection>

            <ExpandableSection title="Can I try it on one product first?">
              <p className="text-foreground text-sm">
                Yes. You can enable "Dry Run" mode where the AI shows you exactly what it would do without actually making changes. Or restrict it to a single collection or product while you evaluate. Full control.
              </p>
            </ExpandableSection>

            <ExpandableSection title="What if the AI makes a mistake?">
              <p className="text-foreground text-sm">
                Every change is logged. You can revert any product to a previous version with one click. The AI also learns from your corrections — if you undo a price change, it notes that and adjusts its strategy for that product category.
              </p>
            </ExpandableSection>

            <ExpandableSection title="How long does setup take?">
              <p className="text-foreground text-sm">
                Connecting an existing store: ~10 minutes. Creating from scratch: ~45 minutes (includes AI research phase). The VPS provisioning takes ~3 minutes. The AI starts working immediately after that.
              </p>
            </ExpandableSection>

            <ExpandableSection title="Can I pause the AI?">
              <p className="text-foreground text-sm">
                Yes, anytime. Pause all automation, or pause specific features (e.g., keep inventory sync active but pause pricing changes). The VPS stays running but the AI stops acting. You only pay for runtime when it's active.
              </p>
            </ExpandableSection>

            <ExpandableSection title="Do I own the store?">
              <p className="text-foreground text-sm">
                Completely. Shopify account is yours, Meta Business Manager is yours, supplier accounts are yours. We're just the AI layer. If you leave, you keep everything. We provide an export of all AI configurations and decision logs.
              </p>
            </ExpandableSection>

            <ExpandableSection title="Is my data secure?">
              <p className="text-foreground text-sm">
                Each store runs on its own isolated VPS. API keys are encrypted at rest (AES-256) and in transit (TLS 1.3). We never share data between stores. Infrastructure is on Hetzner in EU (GDPR compliant). We don't sell or train on your data.
              </p>
            </ExpandableSection>

            <ExpandableSection title="What if the VPS goes down?">
              <p className="text-foreground text-sm">
                Auto-recovery monitors each VPS every 30 seconds. If a worker crashes, it's restarted. If the VPS fails, a new one is provisioned and the store config is restored from backup within ~5 minutes. Your Shopify store stays up regardless — the AI is just the management layer.
              </p>
            </ExpandableSection>

            <ExpandableSection title="Can agencies white-label this?">
              <p className="text-foreground text-sm">
                Yes, on Agency plan. You get a white-label dashboard showing store status, AI activity, and performance metrics that you can show clients under your own branding. API access lets you build custom reports.
              </p>
            </ExpandableSection>

            <ExpandableSection title="How does billing work exactly?">
              <p className="text-foreground text-sm">
                Two parts: (1) Your subscription fee (monthly, fixed), and (2) VPS + runtime costs (usage-based). The subscription determines your markup tier on part 2. We bill usage weekly in arrears based on actual Hetzner hours + our tiered markup. No long-term contracts.
              </p>
            </ExpandableSection>

            <ExpandableSection title="What happens if I exceed my plan's store limit?">
              <p className="text-foreground text-sm">
                You need to upgrade. We'll notify you when you're at 80% capacity. If you hit the limit, the 5th store won't provision until you upgrade. No surprise overages.
              </p>
            </ExpandableSection>

            <ExpandableSection title="Can I import my existing product catalog?">
              <p className="text-foreground text-sm">
                Yes, that's the default flow. The AI reads your existing products on first sync and starts optimizing immediately. For new stores, the AI researches and imports products from your chosen supplier.
              </p>
            </ExpandableSection>

            <ExpandableSection title="Do I need to know coding or AI?">
              <p className="text-foreground text-sm">
                No. The entire interface is visual. You configure the AI through dropdowns, sliders, and toggles. The only "technical" part is copying API keys, and we provide step-by-step screenshots for each platform.
              </p>
            </ExpandableSection>

            <ExpandableSection title="What's the refund policy?">
              <p className="text-foreground text-sm">
                30-day money-back on subscription fees. VPS/runtime costs are billed in arrears based on actual usage and are non-refundable (you used the compute). No questions asked for subscriptions.
              </p>
            </ExpandableSection>
          </div>
        </div>
      </section>

      {/* Sign Up CTA */}
      <section id="signup" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-8 md:p-12 text-center relative overflow-hidden"
          >
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-pink-500/20 to-violet-500/20 blur-3xl" />
            
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Get Started Today
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Sign up now and let AI start managing your Shopify store. 
                No credit card required to get started.
              </p>
              <button 
                onClick={() => setAuthModalOpen(true)}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mx-auto"
              >
                Sign Up Free <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <ShoppDroppLogo size={28} />
              <ShoppDroppText />
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition-colors">Features</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="mailto:hello@shoppdropp.com" className="hover:text-foreground transition-colors">Contact</a>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 ShoppDropp. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      </main>
    </>
  );
}
