"use client";

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
  Clock
} from "lucide-react";
import { ShoppDroppLogo, ShoppDroppText } from "./components/Logo";
import { WaitlistForm } from "./components/WaitlistForm";
import { AgentVisualization } from "./components/AgentVisualization";

const features = [
  {
    icon: Brain,
    title: "AI Catalog Optimization",
    description: "Automatically rewrites product descriptions, generates SEO meta tags, and optimizes images for higher conversion rates.",
    color: "from-violet-500 to-purple-500",
  },
  {
    icon: TrendingUp,
    title: "Dynamic Pricing",
    description: "Monitors competitor prices and adjusts your pricing strategy in real-time to maximize margins and win sales.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: Shield,
    title: "Inventory Sync",
    description: "Keeps your store in sync with AutoDS or your supplier. Auto-pauses out-of-stock items and updates quantities.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: ShoppingCart,
    title: "Smart Collections",
    description: "AI organizes products into collections based on performance, seasonality, and buyer behavior patterns.",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Tracks underperforming products and surfaces actionable insights to improve your catalog health.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Sparkles,
    title: "Content Generation",
    description: "Creates blog posts, social content, and ad copy tailored to your store's brand voice and audience.",
    color: "from-fuchsia-500 to-violet-500",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Connect Your Store",
    description: "Link your existing Shopify store in seconds. Works with any theme, any builder, any setup.",
  },
  {
    step: "02",
    title: "Configure Your AI",
    description: "Set your preferences: brand voice, pricing rules, supplier connections, and automation thresholds.",
  },
  {
    step: "03",
    title: "Go Autonomous",
    description: "The AI takes over catalog management. Review and approve changes, or let it run hands-free.",
  },
];

const stats = [
  { value: "200+", label: "Stores Connected" },
  { value: "1M+", label: "Products Optimized" },
  { value: "34%", label: "Avg. Conversion Lift" },
  { value: "2.4M", label: "Hours Saved" },
];

const testimonials = [
  {
    quote: "I used to spend 6 hours a day managing my catalog. Now ShoppDropp handles it while I focus on scaling.",
    author: "Marcus Chen",
    role: "Dropshipper, 8 Stores",
    metric: "+47% revenue",
  },
  {
    quote: "We manage 40+ client stores. ShoppDropp lets us offer autonomous management as a premium service.",
    author: "Sarah Williams",
    role: "Agency Owner",
    metric: "3x client capacity",
  },
  {
    quote: "The AI caught pricing errors and inventory issues I would've missed. It's like having a full-time VA.",
    author: "James Rodriguez",
    role: "Solo Entrepreneur",
    metric: "99.7% uptime",
  },
];

export default function LandingPage() {
  return (
    <main className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 grid-pattern -z-10" />
      <div className="fixed inset-0 bg-gradient-to-b from-[#0a0a0f] via-transparent to-[#0a0a0f] -z-10" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <ShoppDroppLogo size={32} />
              <ShoppDroppText />
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-slate-400 hover:text-white transition-colors">How It Works</a>
              <a href="#pricing" className="text-sm text-slate-400 hover:text-white transition-colors">Pricing</a>
            </div>
            <a
              href="#waitlist"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Join Waitlist
            </a>
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
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Your Shopify Store,<br />
                <span className="gradient-text">Managed by AI</span>
              </h1>
              <p className="text-lg text-slate-400 mb-8 max-w-lg">
                Connect your existing Shopify store and let our AI agent handle catalog optimization, 
                pricing, inventory sync, and content — 24/7 autonomous management for dropshippers 
                and agencies.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#waitlist"
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  Get Early Access <ArrowRight className="w-5 h-5" />
                </a>
                <a
                  href="#how-it-works"
                  className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-colors flex items-center justify-center"
                >
                  See How It Works
                </a>
              </div>
              <div className="flex items-center gap-6 mt-8 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  No credit card required
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  Works with any theme
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

      {/* Stats Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <p className="text-3xl sm:text-4xl font-bold gradient-text">{stat.value}</p>
                <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Autonomous Store Management
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
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
                  className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-violet-500/30 transition-all hover:bg-white/[0.07]"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm">{feature.description}</p>
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
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Connect Your Store in Minutes
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
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
                <div className="text-6xl font-bold text-white/5 absolute -top-4 -left-2">
                  {step.step}
                </div>
                <div className="relative p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-slate-400">{step.description}</p>
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Built for Dropshippers & Agencies
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                    <Store className="w-6 h-6 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Dropshippers</h3>
                    <p className="text-slate-400 text-sm">
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
                    <h3 className="text-lg font-semibold text-white mb-1">Agencies</h3>
                    <p className="text-slate-400 text-sm">
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
                    <h3 className="text-lg font-semibold text-white mb-1">Solo Entrepreneurs</h3>
                    <p className="text-slate-400 text-sm">
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
              <h3 className="text-xl font-semibold text-white mb-6">What You Get</h3>
              <div className="space-y-4">
                {[
                  "AI catalog optimization & SEO",
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
                    <span className="text-slate-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Trusted by Dropshippers
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10"
              >
                <p className="text-slate-300 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{testimonial.author}</p>
                    <p className="text-slate-500 text-sm">{testimonial.role}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                    {testimonial.metric}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist CTA */}
      <section id="waitlist" className="py-20 px-4 sm:px-6 lg:px-8">
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
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Get Early Access
              </h2>
              <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                Join the private beta and be among the first to let AI manage your 
                Shopify store. Limited spots available.
              </p>
              <WaitlistForm />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <ShoppDroppLogo size={28} />
              <ShoppDroppText />
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="mailto:hello@shoppdropp.com" className="hover:text-white transition-colors">Contact</a>
            </div>
            <p className="text-sm text-slate-600">
              © 2025 ShoppDropp. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
