"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { 
  Store, 
  Settings, 
  BarChart3, 
  Package, 
  LogOut, 
  User,
  Sparkles,
  Plus,
  X
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddStore, setShowAddStore] = useState(false);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0f] via-[#111118] to-[#0a0a0f]">
        <div className="flex items-center gap-3 text-white/50">
          <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#111118] to-[#0a0a0f]">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <span className="font-bold text-lg">
                <span className="text-white">SHOPP</span>
                <span className="text-pink-400">DROPP</span>
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center">
                  <User size={16} className="text-violet-400" />
                </div>
                <span className="hidden sm:block">{user?.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
              >
                <LogOut size={16} />
                <span className="hidden sm:block">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, <span className="gradient-text">{user?.email?.split("@")[0] || "User"}</span>
          </h1>
          <p className="text-white/50">
            Manage your AI-powered Shopify stores from one dashboard.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Store size={20} />}
            label="Active Stores"
            value="0"
            color="violet"
          />
          <StatCard
            icon={<Package size={20} />}
            label="Total Products"
            value="0"
            color="pink"
          />
          <StatCard
            icon={<BarChart3 size={20} />}
            label="Today's Revenue"
            value="$0.00"
            color="emerald"
          />
          <StatCard
            icon={<Settings size={20} />}
            label="AI Tasks Running"
            value="0"
            color="amber"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stores Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="glass rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Store size={20} className="text-violet-400" />
                  Your Stores
                </h2>
                <Link
                  href="/stores/new"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-pink-600 text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <Plus size={16} />
                  Add Store
                </Link>
              </div>

              {/* Empty State */}
              <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-violet-500/10 flex items-center justify-center">
                  <Store size={32} className="text-violet-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">No stores yet</h3>
                <p className="text-white/50 text-sm mb-4 max-w-md mx-auto">
                  Connect your first Shopify store to start using AI automation.
                </p>
                <Link
                  href="/stores/new"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 font-medium hover:opacity-90 transition-opacity"
                >
                  <Plus size={18} />
                  Create Your First Store
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Plan Info */}
            <div className="glass rounded-2xl p-6 border border-white/10">
              <h3 className="font-semibold mb-4">Your Plan</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-sm font-medium">
                  Pay As You Go
                </div>
              </div>
              <ul className="space-y-2 text-sm text-white/60 mb-4">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                  1 store limit
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                  200 products
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                  24/7 AI worker
                </li>
              </ul>
              <Link
                href="/pricing"
                className="w-full py-2 rounded-lg border border-white/10 text-center text-sm text-white/70 hover:bg-white/5 transition-colors block"
              >
                Upgrade Plan
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="glass rounded-2xl p-6 border border-white/10">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <QuickAction 
                  icon={<Store size={18} />} 
                  label="Connect Shopify Store" 
                  onClick={() => setShowAddStore(true)}
                />
                <QuickAction icon={<Settings size={18} />} label="API Settings" />
                <QuickAction icon={<BarChart3 size={18} />} label="View Analytics" />
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass rounded-2xl p-6 border border-white/10">
              <h3 className="font-semibold mb-4">Recent Activity</h3>
              <div className="text-center py-4 text-white/40 text-sm">
                No recent activity
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <AddStoreModal isOpen={showAddStore} onClose={() => setShowAddStore(false)} />
    </div>
  );
}

// Stat Card Component
function StatCard({ 
  icon, 
  label, 
  value, 
  color 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  color: "violet" | "pink" | "emerald" | "amber";
}) {
  const colorClasses = {
    violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    pink: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`glass rounded-xl p-5 border ${colorClasses[color]}`}
    >
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <span className="text-sm font-medium opacity-80">{label}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </motion.div>
  );
}

// Store Modal Component
function AddStoreModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [storeName, setStoreName] = useState("");
  const [storeUrl, setStoreUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    // Simulate store creation - in production this would call the backend API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    onClose();
    alert(`Store "${storeName}" added successfully! In production, this would provision a worker and start automation.`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#111118] shadow-2xl p-6"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-pink-500 to-blue-500" />
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold gradient-text">Connect Shopify Store</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-white/70 mb-1">Store Name</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="My Shopify Store"
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-sm text-white placeholder-white/30 outline-none focus:border-violet-500/50"
            />
          </div>
          
          <div>
            <label className="block text-sm text-white/70 mb-1">Shopify Store URL</label>
            <input
              type="url"
              value={storeUrl}
              onChange={(e) => setStoreUrl(e.target.value)}
              placeholder="https://my-store.myshopify.com"
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-sm text-white placeholder-white/30 outline-none focus:border-violet-500/50"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Connecting...
              </span>
            ) : (
              "Connect Store"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// Quick Action Component
function QuickAction({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-lg text-sm text-white/70 hover:bg-white/5 transition-colors"
    >
      <span className="text-violet-400">{icon}</span>
      {label}
    </button>
  );
}
