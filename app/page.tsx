import Link from 'next/link';
import { 
  ShoppingBag, 
  Bot, 
  Zap, 
  ArrowRight,
  CheckCircle2,
  Store,
  Megaphone,
  Package,
  BarChart3,
  Sparkles
} from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: <Bot className="w-6 h-6" />,
      title: 'AI-Powered Automation',
      description: 'Let AI handle product research, pricing optimization, and inventory management 24/7.'
    },
    {
      icon: <Store className="w-6 h-6" />,
      title: 'Shopify Integration',
      description: 'Seamlessly connect your Shopify store with one-click setup and automatic syncing.'
    },
    {
      icon: <Megaphone className="w-6 h-6" />,
      title: 'Meta Ads Management',
      description: 'AI optimizes your Facebook and Instagram ad campaigns for maximum ROI.'
    },
    {
      icon: <Package className="w-6 h-6" />,
      title: 'AutoDS Integration',
      description: 'Automated dropshipping from product sourcing to order fulfillment.'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Dedicated AI Workers',
      description: 'Each store gets its own cloud worker running your automation tasks.'
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Analytics Dashboard',
      description: 'Real-time insights into sales, ad performance, and AI agent activity.'
    }
  ];

  const pricingPlans = [
    {
      name: 'Pay-as-you-go',
      price: '$0',
      period: '/month',
      description: 'Perfect for getting started',
      features: [
        '1 store',
        '1 AI worker',
        'Basic automation',
        'Email support'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Growth',
      price: '$49',
      period: '/month',
      description: 'For growing businesses',
      features: [
        'Up to 5 stores',
        '5 AI workers',
        'Advanced automation',
        'Priority support',
        'Meta Ads optimization'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Scale',
      price: '$149',
      period: '/month',
      description: 'For established brands',
      features: [
        'Unlimited stores',
        'Unlimited workers',
        'Custom AI models',
        '24/7 phone support',
        'Dedicated account manager'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-violet-500 to-pink-500 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">
                <span className="text-white">SHOPP</span>
                <span className="text-pink-400">DROPP</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="/login" 
                className="text-slate-400 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/login"
                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-500/10 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-300 text-sm mb-8">
              <Sparkles className="w-4 h-4" />
              <span>Now with AI-powered automation</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Run Your Shopify Store{' '}
              <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                on Autopilot
              </span>
            </h1>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
              AI agents that handle product research, pricing, ads, and inventory. 
              Connect Shopify, Meta Ads, and AutoDS in minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/login"
                className="w-full sm:w-auto px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a 
                href="#features"
                className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-colors border border-white/10"
              >
                See Features
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '10K+', label: 'Active Stores' },
              { value: '$2M+', label: 'Revenue Generated' },
              { value: '50K+', label: 'Tasks Automated' },
              { value: '99.9%', label: 'Uptime' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything You Need to Scale
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Powerful AI automation tools that work together to grow your business
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div 
                key={i}
                className="p-6 bg-white/5 rounded-xl border border-white/10 hover:border-violet-500/30 transition-colors"
              >
                <div className="w-12 h-12 bg-violet-500/10 rounded-lg flex items-center justify-center text-violet-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Get Started in 3 Steps
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Connect Your Store',
                description: 'Link your Shopify store and other platforms in minutes with our guided setup.'
              },
              {
                step: '02',
                title: 'Configure AI Agent',
                description: 'Choose your AI provider and set up automation rules for your business.'
              },
              {
                step: '03',
                title: 'Watch It Grow',
                description: 'Your AI worker runs 24/7, optimizing pricing, ads, and inventory automatically.'
              }
            ].map((item, i) => (
              <div key={i} className="relative p-6 bg-white/5 rounded-xl border border-white/10">
                <div className="text-5xl font-bold text-violet-500/20 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Connect Your Favorite Tools
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Seamless integrations with the platforms you already use
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {['Shopify', 'Meta Ads', 'AutoDS', 'OpenAI', 'GitHub', 'Vercel'].map((integration) => (
              <div 
                key={integration}
                className="px-6 py-3 bg-white/5 rounded-lg border border-white/10 text-slate-300 font-medium hover:border-violet-500/30 transition-colors"
              >
                {integration}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Start free and scale as you grow. No hidden fees.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <div 
                key={i}
                className={`p-6 rounded-xl border ${
                  plan.popular 
                    ? 'bg-violet-500/10 border-violet-500/30' 
                    : 'bg-white/5 border-white/10'
                }`}
              >
                {plan.popular && (
                  <div className="inline-block px-3 py-1 bg-violet-500 text-white text-xs font-semibold rounded-full mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-semibold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-2">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-slate-400 ml-1">{plan.period}</span>
                </div>
                <p className="text-slate-400 mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-violet-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className={`block w-full py-3 rounded-lg font-semibold text-center transition-colors ${
                    plan.popular
                      ? 'bg-violet-600 hover:bg-violet-500 text-white'
                      : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Automate Your Store?
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Join thousands of store owners who use ShoppDropp to scale their business with AI.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold transition-colors"
          >
            Start Free Trial
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-violet-500 to-pink-500 rounded-lg">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold">
                <span className="text-white">SHOPP</span>
                <span className="text-pink-400">DROPP</span>
              </span>
            </div>
            <div className="text-slate-400 text-sm">
              © 2025 ShoppDropp. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
