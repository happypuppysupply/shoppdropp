"use client";

import { useState, useEffect, ReactNode } from "react";

// ============================================
// TYPES
// ============================================
type ScreenId = string;

interface ScreenDef {
  id: ScreenId;
  name: string;
  category: string;
  parent: string | null;
}

interface NavItem {
  id: ScreenId;
  label: string;
  icon: string;
}

// ============================================
// NAVIGATION STRUCTURE
// ============================================
const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" },
  { id: "projects", label: "Projects", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
  { id: "products", label: "Products", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { id: "orders", label: "Orders", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" },
  { id: "content", label: "Content", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
  { id: "ads", label: "Ads", icon: "M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" },
  { id: "analytics", label: "Analytics", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { id: "ai-agent", label: "AI Agent", icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" },
  { id: "automation", label: "Automation", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { id: "integrations", label: "Integrations", icon: "M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" },
  { id: "settings", label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
];

// ============================================
// ALL SCREENS REGISTRY (65+ screens)
// ============================================
const allScreens: ScreenDef[] = [
  // Auth Flow
  { id: "login", name: "Login", category: "Auth", parent: null },
  { id: "signup", name: "Sign Up", category: "Auth", parent: null },
  { id: "forgot-password", name: "Forgot Password", category: "Auth", parent: null },
  { id: "onboarding-welcome", name: "Welcome", category: "Auth", parent: null },
  { id: "onboarding-experience", name: "Experience", category: "Auth", parent: "onboarding-welcome" },
  { id: "onboarding-goals", name: "Goals", category: "Auth", parent: "onboarding-experience" },
  { id: "onboarding-connect", name: "Connect", category: "Auth", parent: "onboarding-goals" },
  { id: "onboarding-ai-setup", name: "AI Setup", category: "Auth", parent: "onboarding-connect" },
  { id: "onboarding-review", name: "Review", category: "Auth", parent: "onboarding-ai-setup" },
  { id: "builder", name: "Store Builder", category: "Dashboard", parent: null },
  
  // Dashboard
  { id: "dashboard", name: "Dashboard", category: "Dashboard", parent: null },
  { id: "dashboard-activity", name: "Activity", category: "Dashboard", parent: "dashboard" },
  { id: "notifications", name: "Notifications", category: "Dashboard", parent: null },
  
  // Projects
  { id: "projects", name: "Projects", category: "Projects", parent: null },
  { id: "project-detail", name: "Project Detail", category: "Projects", parent: "projects" },
  { id: "project-create", name: "Create Project", category: "Projects", parent: "projects" },
  { id: "project-edit", name: "Edit Project", category: "Projects", parent: "project-detail" },
  { id: "project-settings", name: "Project Settings", category: "Projects", parent: "project-detail" },
  
  // Products
  { id: "products", name: "Products", category: "Products", parent: null },
  { id: "product-detail", name: "Product Detail", category: "Products", parent: "products" },
  { id: "product-create", name: "Add Product", category: "Products", parent: "products" },
  { id: "product-edit", name: "Edit Product", category: "Products", parent: "product-detail" },
  { id: "product-import", name: "AutoDS Import", category: "Products", parent: "products" },
  { id: "product-bulk", name: "Bulk Edit", category: "Products", parent: "products" },
  
  // Orders
  { id: "orders", name: "Orders", category: "Orders", parent: null },
  { id: "order-detail", name: "Order Detail", category: "Orders", parent: "orders" },
  { id: "order-fulfill", name: "Fulfill Order", category: "Orders", parent: "order-detail" },
  { id: "order-refund", name: "Process Refund", category: "Orders", parent: "order-detail" },
  { id: "returns", name: "Returns", category: "Orders", parent: null },
  
  // Content
  { id: "content", name: "Content", category: "Content", parent: null },
  { id: "content-blog", name: "Blog Posts", category: "Content", parent: "content" },
  { id: "content-social", name: "Social Posts", category: "Content", parent: "content" },
  { id: "content-ads", name: "Ad Creatives", category: "Content", parent: "content" },
  { id: "content-create", name: "Create Content", category: "Content", parent: "content" },
  { id: "content-editor", name: "Editor", category: "Content", parent: "content" },
  { id: "content-preview", name: "Preview", category: "Content", parent: "content-editor" },
  
  // Ads
  { id: "ads", name: "Campaigns", category: "Ads", parent: null },
  { id: "ads-create", name: "Create Campaign", category: "Ads", parent: "ads" },
  { id: "ads-detail", name: "Campaign Detail", category: "Ads", parent: "ads" },
  { id: "ads-edit", name: "Edit Campaign", category: "Ads", parent: "ads-detail" },
  { id: "ads-audience", name: "Audience", category: "Ads", parent: "ads-create" },
  { id: "ads-creative", name: "Creative Studio", category: "Ads", parent: "ads-audience" },
  { id: "ads-analytics", name: "Ad Analytics", category: "Ads", parent: "ads" },
  
  // Analytics
  { id: "analytics", name: "Analytics", category: "Analytics", parent: null },
  { id: "analytics-sales", name: "Sales Reports", category: "Analytics", parent: "analytics" },
  { id: "analytics-traffic", name: "Traffic", category: "Analytics", parent: "analytics" },
  { id: "analytics-products", name: "Product Performance", category: "Analytics", parent: "analytics" },
  { id: "analytics-export", name: "Export Data", category: "Analytics", parent: "analytics" },
  
  // AI Agent
  { id: "ai-agent", name: "AI Chat", category: "AI Agent", parent: null },
  { id: "ai-history", name: "Chat History", category: "AI Agent", parent: "ai-agent" },
  { id: "ai-tasks", name: "AI Tasks", category: "AI Agent", parent: "ai-agent" },
  { id: "ai-templates", name: "Templates", category: "AI Agent", parent: "ai-agent" },
  
  // Automation
  { id: "automation", name: "Automation", category: "Automation", parent: null },
  { id: "automation-create", name: "Create Rule", category: "Automation", parent: "automation" },
  { id: "automation-edit", name: "Edit Rule", category: "Automation", parent: "automation" },
  { id: "automation-logs", name: "Execution Logs", category: "Automation", parent: "automation" },
  { id: "workflows", name: "Workflows", category: "Automation", parent: null },
  
  // Integrations
  { id: "integrations", name: "Integrations", category: "Integrations", parent: null },
  { id: "integration-shopify", name: "Shopify", category: "Integrations", parent: "integrations" },
  { id: "integration-autods", name: "AutoDS", category: "Integrations", parent: "integrations" },
  { id: "integration-meta", name: "Meta", category: "Integrations", parent: "integrations" },
  { id: "integration-tiktok", name: "TikTok", category: "Integrations", parent: "integrations" },
  { id: "api-keys", name: "API Keys", category: "Integrations", parent: null },
  { id: "webhooks", name: "Webhooks", category: "Integrations", parent: null },
  
  // Settings
  { id: "settings", name: "Settings", category: "Settings", parent: null },
  { id: "settings-profile", name: "Profile", category: "Settings", parent: "settings" },
  { id: "settings-team", name: "Team", category: "Settings", parent: "settings" },
  { id: "settings-billing", name: "Billing", category: "Settings", parent: "settings" },
  { id: "settings-notifications", name: "Notifications", category: "Settings", parent: "settings" },
  { id: "settings-security", name: "Security", category: "Settings", parent: "settings" },
  { id: "settings-billing-history", name: "Billing History", category: "Settings", parent: "settings-billing" },
  { id: "settings-plan", name: "Plan", category: "Settings", parent: "settings-billing" },
];

const categories = ["All", ...new Set(allScreens.map(s => s.category))];

// ============================================
// STORES DATA
// ============================================
const stores = [
  { id: 1, name: "Gadget Hub", niche: "Electronics", revenue: "$8.2K", active: true },
  { id: 2, name: "Fashion Forward", niche: "Fashion", revenue: "$4.3K", active: false },
  { id: 3, name: "Home Comfort", niche: "Home", revenue: "$1.2K", active: false },
];

// ============================================
// COMPONENTS
// ============================================

function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "w-7 h-7", md: "w-8 h-8", lg: "w-10 h-10" };
  const iconSizes = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-6 h-6" };
  return (
    <div className={`${sizes[size]} rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-500/20`}>
      <svg className={`${iconSizes[size]} text-white`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
      </svg>
    </div>
  );
}

function LogoWithText({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const textSizes = { sm: "text-sm", md: "text-base", lg: "text-lg" };
  return (
    <div className="flex items-center gap-2">
      <Logo size={size} />
      <span className={`${textSizes[size]} font-bold tracking-tight`}>
        <span className="text-white">SHOPP</span>
        <span className="text-violet-400">DROPP</span>
      </span>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
    </div>
  );
}

function Sidebar({ activeId, onNavigate }: { activeId: string; onNavigate: (id: string) => void }) {
  const isActive = (itemId: string) => {
    if (activeId === itemId) return true;
    if (activeId.startsWith(itemId + "-")) return true;
    const screen = allScreens.find(s => s.id === activeId);
    return screen?.parent === itemId || screen?.parent?.startsWith(itemId);
  };

  return (
    <div className="w-16 h-full bg-[#0a0a0f] border-r border-white/5 flex flex-col">
      <button onClick={() => onNavigate("dashboard")} className="h-14 flex items-center justify-center border-b border-white/5 hover:bg-white/5 transition-colors">
        <Logo size="sm" />
      </button>
      
      <div className="flex-1 py-3 space-y-1 px-2 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.id);
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                active 
                  ? "bg-violet-500/20 text-violet-400" 
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
              }`}
              title={item.label}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2 : 1.5} d={item.icon} />
              </svg>
              <span className="text-[8px] font-medium truncate w-full text-center px-1">{item.label}</span>
            </button>
          );
        })}
      </div>
      
      <div className="p-2 border-t border-white/5 space-y-1">
        <button 
          onClick={() => onNavigate("notifications")}
          className="w-full aspect-square rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors relative"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 border-2 border-[#0a0a0f]" />
        </button>
        <button 
          onClick={() => onNavigate("settings")}
          className="w-full aspect-square rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500/30 to-pink-500/30 flex items-center justify-center text-xs font-bold text-white">JS</div>
        </button>
      </div>
    </div>
  );
}

function StoreSelector({ currentStore, onStoreChange }: { currentStore: typeof stores[0]; onStoreChange: (store: typeof stores[0]) => void }) {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="relative">
      <button 
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
      >
        <div className="w-6 h-6 rounded bg-gradient-to-br from-violet-500/30 to-pink-500/30 flex items-center justify-center text-xs">{currentStore.name[0]}</div>
        <span className="text-white text-xs font-medium">{currentStore.name}</span>
        <svg className={`w-3 h-3 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 w-56 bg-[#0d0d12] border border-white/10 rounded-xl shadow-xl z-50 py-1">
            <div className="px-3 py-2 border-b border-white/5">
              <p className="text-slate-500 text-[10px] uppercase">Your Stores</p>
            </div>
            {stores.map(store => (
              <button
                key={store.id}
                onClick={() => { onStoreChange(store); setOpen(false); }}
                className={`w-full px-3 py-2 flex items-center gap-2 hover:bg-white/5 transition-colors ${store.id === currentStore.id ? "bg-violet-500/10" : ""}`}
              >
                <div className="w-8 h-8 rounded bg-gradient-to-br from-violet-500/30 to-pink-500/30 flex items-center justify-center text-sm">{store.name[0]}</div>
                <div className="text-left">
                  <p className="text-white text-xs font-medium">{store.name}</p>
                  <p className="text-slate-500 text-[10px]">{store.niche} • {store.revenue}</p>
                </div>
                {store.id === currentStore.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500" />}
              </button>
            ))}
            <div className="border-t border-white/5 mt-1 pt-1">
              <button onClick={() => { setOpen(false); }} className="w-full px-3 py-2 text-violet-400 text-xs text-left hover:bg-white/5 transition-colors">
                + Create New Store
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Header({ 
  title, 
  subtitle, 
  actions,
  currentStore,
  onStoreChange,
  showStoreSelector = true
}: { 
  title: string; 
  subtitle?: string; 
  actions?: ReactNode;
  currentStore?: typeof stores[0];
  onStoreChange?: (store: typeof stores[0]) => void;
  showStoreSelector?: boolean;
}) {
  return (
    <div className="h-14 border-b border-white/5 flex items-center justify-between px-4 bg-[#0a0a0f]">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-sm font-semibold text-white">{title}</h1>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {showStoreSelector && currentStore && onStoreChange && (
          <StoreSelector currentStore={currentStore} onStoreChange={onStoreChange} />
        )}
        {actions}
      </div>
    </div>
  );
}

// ============================================
// MAIN PAGE
// ============================================
export default function PlatformUIPage() {
  const [selCat, setSelCat] = useState("All");
  const [currentScreen, setCurrentScreen] = useState<ScreenId>("dashboard");
  const [modalScreen, setModalScreen] = useState<ScreenId | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentStore, setCurrentStore] = useState(stores[0]);

  const filtered = selCat === "All" ? allScreens : allScreens.filter(s => s.category === selCat);
  const currentScreenDef = allScreens.find(s => s.id === currentScreen);

  const handleNavigate = (screenId: ScreenId) => {
    setLoading(true);
    setTimeout(() => {
      setCurrentScreen(screenId);
      setLoading(false);
    }, 300);
  };

  const handlePrevScreen = () => {
    const currentIndex = allScreens.findIndex(s => s.id === currentScreen);
    if (currentIndex > 0) {
      handleNavigate(allScreens[currentIndex - 1].id);
    }
  };

  const handleNextScreen = () => {
    const currentIndex = allScreens.findIndex(s => s.id === currentScreen);
    if (currentIndex < allScreens.length - 1) {
      handleNavigate(allScreens[currentIndex + 1].id);
    }
  };

  const getBreadcrumb = (screenId: string): string[] => {
    const screen = allScreens.find(s => s.id === screenId);
    if (!screen) return ["Dashboard"];
    if (screen.parent) {
      const parent = allScreens.find(s => s.id === screen.parent);
      return parent ? [parent.name, screen.name] : [screen.name];
    }
    return [screen.name];
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Platform UI Gallery</h1>
          <p className="text-slate-400 text-sm md:text-base">{allScreens.length} interactive screens — fully clickable demo</p>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-violet-500/20 text-violet-400 text-xs font-medium w-fit border border-violet-500/30">
          {allScreens.length} Screens
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button key={cat} onClick={() => setSelCat(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selCat === cat ? "bg-gradient-to-r from-violet-500 to-pink-500 text-white" : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"}`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((screen) => (
          <div key={screen.id} onClick={() => setModalScreen(screen.id)} className="group cursor-pointer">
            <div className="overflow-hidden rounded-2xl bg-[#0d0d12] border border-white/10 hover:border-violet-500/50 transition-all hover:shadow-lg hover:shadow-violet-500/10">
              <div className="aspect-[4/3] bg-[#08080c]">
                <ScreenRender 
                  screen={screen.id} 
                  onNavigate={() => {}}
                  preview={true}
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500">{screen.category}</span>
                  {screen.parent && <span className="text-[10px] text-violet-400">↳ {screen.parent}</span>}
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">{screen.name}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalScreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setModalScreen(null)}>
          <div className="w-full max-w-6xl h-[85vh] bg-[#0a0a0f] rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-[#0a0a0f] shrink-0">
              <div className="flex items-center gap-4">
                {/* Navigation Arrows */}
                <div className="flex items-center gap-1">
                  <button 
                    onClick={handlePrevScreen}
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button 
                    onClick={handleNextScreen}
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
                
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm">
                  {getBreadcrumb(currentScreen).map((crumb, i, arr) => (
                    <span key={i} className="flex items-center">
                      {i > 0 && <span className="mx-2 text-slate-600">/</span>}
                      <span className={i === arr.length - 1 ? "text-white font-medium" : "text-slate-500"}>{crumb}</span>
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">
                  {allScreens.findIndex(s => s.id === currentScreen) + 1} / {allScreens.length}
                </span>
                <button onClick={() => setModalScreen(null)} className="w-8 h-8 rounded-lg bg-white/5 text-slate-400 hover:text-white flex items-center justify-center hover:bg-white/10 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Screen Content */}
            <div className="flex-1 overflow-hidden relative">
              {loading && (
                <div className="absolute inset-0 bg-[#08080c] z-50 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-3 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
                    <p className="text-slate-400 text-sm">Loading...</p>
                  </div>
                </div>
              )}
              <ScreenRender 
                screen={currentScreen} 
                onNavigate={handleNavigate}
                currentStore={currentStore}
                onStoreChange={setCurrentStore}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// SCREEN RENDERER
// ============================================
function ScreenRender({ 
  screen, 
  onNavigate,
  currentStore,
  onStoreChange,
  preview = false
}: { 
  screen: ScreenId; 
  onNavigate: (id: string) => void;
  currentStore?: typeof stores[0];
  onStoreChange?: (store: typeof stores[0]) => void;
  preview?: boolean;
}) {
  const props = { onNavigate, currentStore, onStoreChange };
  
  switch (screen) {
    // Auth
    case "login": return <LoginScreen {...props} />;
    case "signup": return <SignupScreen {...props} />;
    case "forgot-password": return <ForgotPasswordScreen {...props} />;
    case "onboarding-welcome": return <OnboardingWelcome {...props} />;
    case "onboarding-experience": return <OnboardingExperience {...props} />;
    case "onboarding-goals": return <OnboardingGoals {...props} />;
    case "onboarding-connect": return <OnboardingConnect {...props} />;
    case "onboarding-ai-setup": return <OnboardingAISetup {...props} />;
    case "onboarding-review": return <OnboardingReview {...props} />;
    case "builder": return <BuilderScreen {...props} />;
    
    // Dashboard
    case "dashboard": return <DashboardScreen {...props} />;
    case "dashboard-activity": return <DashboardActivity {...props} />;
    case "notifications": return <NotificationsScreen {...props} />;
    
    // Projects
    case "projects": return <ProjectsScreen {...props} />;
    case "project-detail": return <ProjectDetail {...props} />;
    case "project-create": return <ProjectCreate {...props} />;
    case "project-edit": return <ProjectEdit {...props} />;
    case "project-settings": return <ProjectSettings {...props} />;
    
    // Products
    case "products": return <ProductsScreen {...props} />;
    case "product-detail": return <ProductDetail {...props} />;
    case "product-create": return <ProductCreate {...props} />;
    case "product-edit": return <ProductEdit {...props} />;
    case "product-import": return <ProductImport {...props} />;
    case "product-bulk": return <ProductBulk {...props} />;
    
    // Orders
    case "orders": return <OrdersScreen {...props} />;
    case "order-detail": return <OrderDetail {...props} />;
    case "order-fulfill": return <OrderFulfill {...props} />;
    case "order-refund": return <OrderRefund {...props} />;
    case "returns": return <ReturnsScreen {...props} />;
    
    // Content
    case "content": return <ContentScreen {...props} />;
    case "content-blog": return <ContentBlog {...props} />;
    case "content-social": return <ContentSocial {...props} />;
    case "content-ads": return <ContentAds {...props} />;
    case "content-create": return <ContentCreate {...props} />;
    case "content-editor": return <ContentEditor {...props} />;
    case "content-preview": return <ContentPreview {...props} />;
    
    // Ads
    case "ads": return <AdsScreen {...props} />;
    case "ads-create": return <AdsCreate {...props} />;
    case "ads-detail": return <AdsDetail {...props} />;
    case "ads-edit": return <AdsEdit {...props} />;
    case "ads-audience": return <AdsAudience {...props} />;
    case "ads-creative": return <AdsCreative {...props} />;
    case "ads-analytics": return <AdsAnalytics {...props} />;
    
    // Analytics
    case "analytics": return <AnalyticsScreen {...props} />;
    case "analytics-sales": return <AnalyticsSales {...props} />;
    case "analytics-traffic": return <AnalyticsSales {...props} />;
    case "analytics-products": return <AnalyticsSales {...props} />;
    case "analytics-export": return <AnalyticsExport {...props} />;
    
    // AI Agent
    case "ai-agent": return <AIAgentScreen {...props} />;
    case "ai-history": return <AIHistory {...props} />;
    case "ai-tasks": return <AITasks {...props} />;
    case "ai-templates": return <AITemplates {...props} />;
    
    // Automation
    case "automation": return <AutomationScreen {...props} />;
    case "automation-create": return <AutomationCreate {...props} />;
    case "automation-edit": return <AutomationEdit {...props} />;
    case "automation-logs": return <AutomationLogs {...props} />;
    case "workflows": return <WorkflowsScreen {...props} />;
    
    // Integrations
    case "integrations": return <IntegrationsScreen {...props} />;
    case "integration-shopify": return <IntegrationShopify {...props} />;
    case "integration-autods": return <IntegrationAutoDS {...props} />;
    case "integration-meta": return <IntegrationMeta {...props} />;
    case "integration-tiktok": return <IntegrationMeta {...props} />;
    case "api-keys": return <APIKeysScreen {...props} />;
    case "webhooks": return <IntegrationMeta {...props} />;
    
    // Settings
    case "settings": return <SettingsScreen {...props} />;
    case "settings-profile": return <SettingsProfile {...props} />;
    case "settings-team": return <SettingsTeam {...props} />;
    case "settings-billing": return <SettingsBilling {...props} />;
    case "settings-notifications": return <SettingsNotifications {...props} />;
    case "settings-security": return <SettingsSecurity {...props} />;
    case "settings-billing-history": return <SettingsBilling {...props} />;
    case "settings-plan": return <SettingsPlan {...props} />;
    
    default: return <DashboardScreen {...props} />;
  }
}

// ============================================
// AUTH SCREENS
// ============================================
function LoginScreen({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  return (
    <div className="h-full flex flex-col items-center justify-center bg-[#08080c] p-6">
      <div className="w-full max-w-[280px] space-y-5">
        <div className="text-center">
          <LogoWithText size="lg" />
          <h2 className="text-lg font-bold text-white mt-4 mb-1">Welcome back</h2>
          <p className="text-slate-500 text-xs">Sign in to your AI store</p>
        </div>
        
        <button onClick={() => onNavigate("dashboard")} className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          <span className="text-white text-xs font-medium">Continue with Google</span>
        </button>
        
        <button className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.59.11.82-.261.82-.577v-2.235c-3.335.725-4.035-1.415-4.035-1.415-.545-1.385-1.335-1.755-1.335-1.755-1.09-.745.085-.73.085-.73 1.205.085 1.84 1.24 1.84 1.24 1.065 1.83 2.805 1.3 3.49.995.105-.775.42-1.305.765-1.605-2.665-.305-5.47-1.335-5.47-5.93 0-1.31.465-2.38 1.235-3.22-.135-.305-.54-1.525.105-3.175 0 0 1.005-.32 3.3 1.23.955-.265 1.98-.4 3-.405 1.02.005 2.045.14 3.005.405 2.29-1.55 3.3-1.23 3.3-1.23.645 1.65.24 2.87.12 3.175.765.84 1.23 1.905 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.095.81 2.22v3.295c0 .315.225.69.825.57C20.565 21.795 24 17.31 24 12c0-6.63-5.37-12-12-12z"/></svg>
          <span className="text-white text-xs font-medium">Continue with GitHub</span>
        </button>
        
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/10"/>
          <span className="text-slate-500 text-xs">or</span>
          <div className="flex-1 h-px bg-white/10"/>
        </div>
        
        <div className="space-y-3">
          <input 
            type="text" 
            placeholder="Email address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-slate-500 outline-none focus:border-violet-500/50 transition-colors"
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-slate-500 outline-none focus:border-violet-500/50 transition-colors"
          />
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
            <input type="checkbox" className="rounded bg-white/5 border-white/10" />
            Remember me
          </label>
          <button onClick={() => onNavigate("forgot-password")} className="text-violet-400 hover:text-violet-300 transition-colors">Forgot password?</button>
        </div>
        
        <button 
          onClick={() => onNavigate("dashboard")} 
          className="w-full p-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Sign In
        </button>
        
        <p className="text-center text-slate-500 text-xs">
          Don't have an account? <button onClick={() => onNavigate("signup")} className="text-violet-400 hover:text-violet-300 transition-colors">Sign up</button>
        </p>
      </div>
    </div>
  );
}

function SignupScreen({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-[#08080c] p-6">
      <div className="w-full max-w-[280px] space-y-5">
        <div className="text-center">
          <LogoWithText size="lg" />
          <h2 className="text-lg font-bold text-white mt-4 mb-1">Create account</h2>
          <p className="text-slate-500 text-xs">Start your AI-powered store</p>
        </div>
        
        <div className="space-y-3">
          <input type="text" placeholder="Full name" className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-slate-500 outline-none focus:border-violet-500/50" />
          <input type="text" placeholder="Email address" className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-slate-500 outline-none focus:border-violet-500/50" />
          <input type="password" placeholder="Password" className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-slate-500 outline-none focus:border-violet-500/50" />
          <input type="password" placeholder="Confirm password" className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-slate-500 outline-none focus:border-violet-500/50" />
        </div>
        
        <label className="flex items-start gap-2 text-xs text-slate-400 cursor-pointer">
          <input type="checkbox" className="rounded bg-white/5 border-white/10 mt-0.5" />
          <span>I agree to the <span className="text-violet-400">Terms</span> and <span className="text-violet-400">Privacy Policy</span></span>
        </label>
        
        <button onClick={() => onNavigate("onboarding-welcome")} className="w-full p-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity">
          Create Account
        </button>
        
        <p className="text-center text-slate-500 text-xs">
          Already have an account? <button onClick={() => onNavigate("login")} className="text-violet-400 hover:text-violet-300 transition-colors">Sign in</button>
        </p>
      </div>
    </div>
  );
}

function ForgotPasswordScreen({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-[#08080c] p-6">
      <div className="w-full max-w-[280px] space-y-5">
        <div className="text-center">
          <LogoWithText size="lg" />
          <h2 className="text-lg font-bold text-white mt-4 mb-1">Reset password</h2>
          <p className="text-slate-500 text-xs">Enter your email for reset instructions</p>
        </div>
        
        <input type="text" placeholder="Email address" className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-slate-500 outline-none focus:border-violet-500/50" />
        
        <button onClick={() => onNavigate("login")} className="w-full p-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity">
          Send Reset Link
        </button>
        
        <button onClick={() => onNavigate("login")} className="w-full text-center text-slate-500 text-xs hover:text-white transition-colors flex items-center justify-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to login
        </button>
      </div>
    </div>
  );
}

function OnboardingWelcome({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-[#08080c] p-6">
      <div className="w-full max-w-[320px] text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 mx-auto flex items-center justify-center text-4xl shadow-xl shadow-violet-500/20">🚀</div>
        <div>
          <h2 className="text-xl font-bold text-white mb-2">Welcome to ShoppDropp!</h2>
          <p className="text-slate-400 text-sm">Let's set up your AI-powered store in just a few minutes.</p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          {[{i:"⚡",t:"5 min setup"}, {i:"🤖",t:"AI powered"}, {i:"📈",t:"Auto scale"}].map((item,idx) => (
            <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="text-2xl mb-1">{item.i}</div>
              <p className="text-[10px] text-slate-400">{item.t}</p>
            </div>
          ))}
        </div>
        <button onClick={() => onNavigate("onboarding-experience")} className="w-full p-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity">
          Get Started
        </button>
      </div>
    </div>
  );
}

function OnboardingExperience({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [selected, setSelected] = useState<string>("intermediate");
  const options = [
    {id: "beginner", title: "Beginner", desc: "New to e-commerce", icon: "🌱"},
    {id: "intermediate", title: "Intermediate", desc: "Some experience", icon: "📊"},
    {id: "expert", title: "Expert", desc: "Multiple stores", icon: "🚀"},
  ];
  
  return (
    <div className="h-full flex flex-col bg-[#08080c] p-6">
      <div className="flex-1 max-w-[400px] mx-auto w-full space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className={`flex-1 h-1 rounded-full ${i === 1 ? "bg-violet-500" : "bg-white/10"}`} />
            ))}
          </div>
          <h2 className="text-lg font-bold text-white mb-1">Experience Level?</h2>
          <p className="text-slate-400 text-sm">This helps us personalize your AI</p>
        </div>
        
        <div className="space-y-3">
          {options.map(opt => (
            <button
              key={opt.id}
              onClick={() => setSelected(opt.id)}
              className={`w-full p-4 rounded-xl border text-left transition-all ${selected === opt.id ? "bg-violet-500/10 border-violet-500/50" : "bg-white/5 border-white/5 hover:bg-white/10"}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{opt.icon}</span>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{opt.title}</p>
                  <p className="text-slate-400 text-xs">{opt.desc}</p>
                </div>
                {selected === opt.id && (
                  <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
        
        <div className="flex gap-3">
          <button onClick={() => onNavigate("signup")} className="flex-1 p-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back
          </button>
          <button onClick={() => onNavigate("onboarding-goals")} className="flex-1 p-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

function OnboardingGoals({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [goals, setGoals] = useState<string[]>(["scale", "automate"]);
  const toggleGoal = (id: string) => {
    setGoals(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
  };
  
  const options = [
    {id: "launch", title: "Launch new store", desc: "Start dropshipping", icon: "🚀"},
    {id: "scale", title: "Scale existing", desc: "Grow & automate", icon: "📈"},
    {id: "products", title: "Find products", desc: "AI discovery", icon: "🎯"},
    {id: "ads", title: "Optimize ads", desc: "Improve ROAS", icon: "📢"},
    {id: "automate", title: "Automate all", desc: "Hands-off ops", icon: "🤖"},
  ];
  
  return (
    <div className="h-full flex flex-col bg-[#08080c] p-6">
      <div className="flex-1 max-w-[400px] mx-auto w-full space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className={`flex-1 h-1 rounded-full ${i <= 2 ? "bg-violet-500" : "bg-white/10"}`} />
            ))}
          </div>
          <h2 className="text-lg font-bold text-white mb-1">Your Goals?</h2>
          <p className="text-slate-400 text-sm">Select all that apply</p>
        </div>
        
        <div className="space-y-3">
          {options.map(opt => (
            <button
              key={opt.id}
              onClick={() => toggleGoal(opt.id)}
              className={`w-full p-4 rounded-xl border text-left transition-all ${goals.includes(opt.id) ? "bg-violet-500/10 border-violet-500/50" : "bg-white/5 border-white/5 hover:bg-white/10"}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{opt.icon}</span>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{opt.title}</p>
                  <p className="text-slate-400 text-xs">{opt.desc}</p>
                </div>
                <div className={`w-5 h-5 rounded border flex items-center justify-center ${goals.includes(opt.id) ? "bg-violet-500 border-violet-500" : "border-white/20"}`}>
                  {goals.includes(opt.id) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                </div>
              </div>
            </button>
          ))}
        </div>
        
        <div className="flex gap-3">
          <button onClick={() => onNavigate("onboarding-experience")} className="flex-1 p-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back
          </button>
          <button onClick={() => onNavigate("onboarding-connect")} className="flex-1 p-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

function OnboardingConnect({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [connected, setConnected] = useState<string[]>(["shopify", "autods"]);
  const platforms = [
    {id: "shopify", name: "Shopify", desc: "E-commerce platform", icon: "🛍️"},
    {id: "autods", name: "AutoDS", desc: "Dropshipping", icon: "📦"},
    {id: "meta", name: "Meta Ads", desc: "Facebook/Instagram", icon: "📢"},
    {id: "tiktok", name: "TikTok Ads", desc: "TikTok ads", icon: "🎵"},
  ];
  
  return (
    <div className="h-full flex flex-col bg-[#08080c] p-6">
      <div className="flex-1 max-w-[400px] mx-auto w-full space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className={`flex-1 h-1 rounded-full ${i <= 3 ? "bg-violet-500" : "bg-white/10"}`} />
            ))}
          </div>
          <h2 className="text-lg font-bold text-white mb-1">Connect Tools</h2>
          <p className="text-slate-400 text-sm">Link platforms to automate</p>
        </div>
        
        <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center gap-2">
          <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00 2 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          <p className="text-violet-300 text-xs">AES-256 encrypted</p>
        </div>
        
        <div className="space-y-2">
          {platforms.map(p => (
            <div key={p.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl">{p.icon}</div>
                <div>
                  <p className="text-white text-sm font-medium">{p.name}</p>
                  <p className="text-slate-500 text-xs">{p.desc}</p>
                </div>
              </div>
              {connected.includes(p.id) ? (
                <div className="flex items-center gap-2">
                  <span className="text-green-400 text-xs">Connected</span>
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                  </div>
                </div>
              ) : (
                <button onClick={() => setConnected([...connected, p.id])} className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 text-white text-xs font-medium hover:opacity-90 transition-opacity">
                  Connect
                </button>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex gap-3">
          <button onClick={() => onNavigate("onboarding-goals")} className="flex-1 p-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back
          </button>
          <button onClick={() => onNavigate("onboarding-ai-setup")} className="flex-1 p-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

function OnboardingAISetup({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [budget, setBudget] = useState(50);
  
  return (
    <div className="h-full flex flex-col bg-[#08080c] p-6">
      <div className="flex-1 max-w-[400px] mx-auto w-full space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className={`flex-1 h-1 rounded-full ${i <= 4 ? "bg-violet-500" : "bg-white/10"}`} />
            ))}
          </div>
          <h2 className="text-lg font-bold text-white mb-1">Configure AI</h2>
          <p className="text-slate-400 text-sm">Set your automation preferences</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-slate-400 text-xs block mb-2">Store Niche</label>
            <select className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-violet-500/50">
              <option>Electronics</option>
              <option>Fashion</option>
              <option>Home & Garden</option>
            </select>
          </div>
          
          <div>
            <label className="text-slate-400 text-xs block mb-2">Target Audience</label>
            <select className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-violet-500/50">
              <option>18-35 Tech</option>
              <option>25-45 Professionals</option>
              <option>18-24 Gen Z</option>
            </select>
          </div>
          
          <div>
            <label className="text-slate-400 text-xs block mb-2">Daily Ad Budget: ${budget}</label>
            <input 
              type="range" 
              min="10" 
              max="500" 
              value={budget}
              onChange={(e) => setBudget(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-pink-500/10 border border-violet-500/20">
            <p className="text-white text-sm font-medium mb-1">🤖 AI Strategy</p>
            <p className="text-slate-400 text-xs">Auto-import products, generate content, optimize ads daily.</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button onClick={() => onNavigate("onboarding-connect")} className="flex-1 p-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back
          </button>
          <button onClick={() => onNavigate("onboarding-review")} className="flex-1 p-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

function OnboardingReview({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex flex-col bg-[#08080c] p-6">
      <div className="flex-1 max-w-[400px] mx-auto w-full space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex-1 h-1 rounded-full bg-violet-500" />
            ))}
          </div>
          <h2 className="text-lg font-bold text-white mb-1">Ready?</h2>
          <p className="text-slate-400 text-sm">Review your configuration</p>
        </div>
        
        <div className="space-y-3">
          {[
            {label: "Experience", value: "Intermediate", icon: "📊"},
            {label: "Goals", value: "Scale, Automate", icon: "🎯"},
            {label: "Connected", value: "Shopify, AutoDS", icon: "🔗"},
            {label: "Niche", value: "Electronics", icon: "🛍️"},
            {label: "Ad Budget", value: "$50/day", icon: "💰"},
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span className="text-slate-400 text-xs">{item.label}</span>
              </div>
              <span className="text-white text-sm font-medium">{item.value}</span>
            </div>
          ))}
        </div>
        
        <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/30">
          <p className="text-white text-sm font-medium mb-1">⚡ What happens next?</p>
          <p className="text-slate-400 text-xs">AI will build your store in 5-10 minutes.</p>
        </div>
        
        <div className="flex gap-3">
          <button onClick={() => onNavigate("onboarding-ai-setup")} className="flex-1 p-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back
          </button>
          <button onClick={() => onNavigate("builder")} className="flex-1 p-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity">
            Build My Store
          </button>
        </div>
      </div>
    </div>
  );
}

function BuilderScreen({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [progress, setProgress] = useState(63);
  const [logs, setLogs] = useState([
    {t: "Authenticating with Shopify...", s: "done"},
    {t: "Connecting AutoDS API...", s: "done"},
    {t: "Configuring Meta Ads...", s: "done"},
    {t: "Syncing product catalog...", s: "active"},
    {t: "Generating AI descriptions...", s: "pending"},
    {t: "Creating store theme...", s: "pending"},
    {t: "Setting up analytics...", s: "pending"},
    {t: "Configuring automation rules...", s: "pending"},
    {t: "Optimizing SEO metadata...", s: "pending"},
    {t: "Final launch preparation...", s: "pending"},
  ]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 1;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="h-full flex bg-[#08080c]">
      <div className="flex-1 flex flex-col min-h-0">
        {/* Progress Steps */}
        <div className="px-4 py-3 border-b border-white/5 bg-[#0a0a0f]">
          <div className="flex items-center gap-2 max-w-[600px]">
            {[
              {n: "Account", s: "completed"},
              {n: "Connect", s: "completed"},
              {n: "Review", s: "completed"},
              {n: "Building", s: "in_progress"},
            ].map((step, i, arr) => (
              <div key={i} className="flex items-center gap-1">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] ${step.s === "completed" ? "bg-green-500/20 text-green-400 border border-green-500/30" : step.s === "in_progress" ? "bg-violet-500 text-white" : "bg-white/5 text-slate-500"}`}>
                  {step.s === "completed" ? <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg> : i + 1}
                </div>
                <span className={`text-[10px] ${step.s === "in_progress" ? "text-white" : "text-slate-500"}`}>{step.n}</span>
                {i < arr.length - 1 && <div className="w-3 h-px bg-white/10 mx-1" />}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex-1 flex gap-4 p-4 overflow-auto">
          <div className="flex-1 space-y-4">
            {/* Progress Card */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-violet-500/15 to-pink-500/10 border border-violet-500/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Building your store!</h3>
                  <p className="text-slate-400 text-xs">Usually takes 5-10 minutes</p>
                </div>
                <div className="w-14 h-14 relative">
                  <svg className="w-14 h-14 -rotate-90" viewBox="0 0 48 48">
                    <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4"/>
                    <circle cx="24" cy="24" r="20" fill="none" stroke="url(#grad)" strokeWidth="4" strokeDasharray="126" strokeDashoffset={126 - (126 * progress / 100)} strokeLinecap="round"/>
                    <defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#8b5cf6"/><stop offset="100%" stopColor="#ec4899"/></linearGradient></defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">{progress}%</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span>Elapsed: <span className="text-white font-mono">04:12</span></span>
                <span>Remaining: <span className="text-white font-mono">02:30</span></span>
              </div>
            </div>
            
            {/* Build Steps */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-white text-sm font-medium mb-3">Build Steps</p>
              <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
                {logs.map((log, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-[#0d0d12]">
                    <span className="text-[10px] text-slate-500 w-4">{idx + 1}</span>
                    {log.s === "done" ? (
                      <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                      </div>
                    ) : log.s === "active" ? (
                      <div className="w-4 h-4 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin" />
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-white/5" />
                    )}
                    <span className={`text-[11px] flex-1 ${log.s === "done" ? "text-slate-500" : log.s === "active" ? "text-white" : "text-slate-600"}`}>{log.t}</span>
                    {log.s === "active" && <span className="text-[9px] text-violet-400 animate-pulse">Working...</span>}
                  </div>
                ))}
              </div>
            </div>
            
            {progress >= 100 && (
              <button onClick={() => onNavigate("dashboard")} className="w-full p-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity">
                Go to Dashboard →
              </button>
            )}
          </div>
          
          {/* Right Panel */}
          <div className="w-48 space-y-4 hidden md:block">
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <p className="text-white text-xs font-medium mb-2">Store Details</p>
              {[{l:"Name",v:"Gadget Hub"}, {l:"Platform",v:"Shopify"}, {l:"Niche",v:"Electronics"}, {l:"Region",v:"US"}].map(d => (
                <div key={d.l} className="flex justify-between items-center py-1">
                  <span className="text-[10px] text-slate-500">{d.l}</span>
                  <span className="text-[10px] text-white">{d.v}</span>
                </div>
              ))}
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <p className="text-white text-xs font-medium mb-2">Live Activity</p>
              <div className="space-y-1.5">
                {[{t:"Connected Shopify",c:"green"}, {t:"AutoDS login OK",c:"green"}, {t:"Fetching products...",c:"violet"}].map((a,i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${a.c==="green"?"bg-green-400":"bg-violet-400 animate-pulse"}`} />
                    <span className="text-[10px] text-slate-400 truncate">{a.t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardScreen({ onNavigate, currentStore, onStoreChange }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="dashboard" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header 
          title="Dashboard" 
          subtitle={`Welcome back, ${currentStore?.name || 'Store'}`}
          currentStore={currentStore}
          onStoreChange={onStoreChange}
          actions={
            <button onClick={() => onNavigate("ai-agent")} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500/20 text-violet-300 text-xs border border-violet-500/30 hover:bg-violet-500/30 transition-colors">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              AI Online
            </button>
          }
        />
        <div className="flex-1 p-4 space-y-4 overflow-auto">
          <div className="grid grid-cols-3 gap-3">
            {[{l:"Revenue",v:"$12.5K",c:"+18.5%",t:"vs last month",nav:"analytics-sales"}, {l:"Orders",v:"326",c:"+12.4%",t:"vs last month",nav:"orders"}, {l:"ROAS",v:"3.8x",c:"+22.7%",t:"vs last month",nav:"ads-analytics"}].map((s,i) => (
              <button key={i} onClick={() => onNavigate(s.nav)} className={`p-4 rounded-xl text-left transition-all hover:scale-[1.02] ${i===0 ? "bg-gradient-to-br from-violet-500/20 to-violet-600/10 border border-violet-500/30" : "bg-white/5 border border-white/5 hover:border-white/10"}`}>
                <p className="text-slate-500 text-[10px] uppercase tracking-wider">{s.l}</p>
                <p className="text-white text-xl font-bold mt-1">{s.v}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-green-400 text-xs">{s.c}</span>
                  <span className="text-slate-500 text-[10px]">{s.t}</span>
                </div>
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-white text-sm font-medium">Sales Overview</p>
                <select className="bg-white/5 border border-white/10 rounded-lg text-xs text-slate-400 px-2 py-1 outline-none">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                </select>
              </div>
              <div className="h-24 flex items-end gap-1">
                {[35,55,42,78,62,85,70].map((h,i) => (
                  <div key={i} className="flex-1 bg-gradient-to-t from-violet-500 to-pink-500 rounded-t" style={{height:`${h}%`}} />
                ))}
              </div>
              <div className="flex justify-between mt-2">
                {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => <span key={d} className="text-[9px] text-slate-600 flex-1 text-center">{d}</span>)}
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-white text-sm font-medium">AI Activity</p>
                <button onClick={() => onNavigate("dashboard-activity")} className="text-violet-400 text-xs hover:underline">View all</button>
              </div>
              <div className="space-y-2">
                {[{e:"🤖",t:"Imported 12 products from AutoDS",tm:"2m ago"}, {e:"✍️",t:"Generated 5 blog posts for SEO",tm:"15m ago"}, {e:"📢",t:"Launched Meta ad campaign",tm:"1h ago"}].map((a,i) => (
                  <div key={i} onClick={() => onNavigate("ai-agent")} className="flex items-center gap-2.5 p-2 rounded-lg bg-[#0d0d12] hover:bg-white/5 transition-colors cursor-pointer">
                    <span className="text-base">{a.e}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs truncate">{a.t}</p>
                      <p className="text-slate-500 text-[10px]">{a.tm}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <button onClick={() => onNavigate("products")} className="p-4 rounded-xl bg-white/5 border border-white/5 text-left hover:border-white/10 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center mb-2">
                <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
              </div>
              <p className="text-white text-sm font-medium">Products</p>
              <p className="text-slate-500 text-xs">156 active</p>
            </button>
            <button onClick={() => onNavigate("orders")} className="p-4 rounded-xl bg-white/5 border border-white/5 text-left hover:border-white/10 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center mb-2">
                <svg className="w-4 h-4 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
              </div>
              <p className="text-white text-sm font-medium">Orders</p>
              <p className="text-slate-500 text-xs">24 pending</p>
            </button>
            <button onClick={() => onNavigate("ads")} className="p-4 rounded-xl bg-white/5 border border-white/5 text-left hover:border-white/10 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center mb-2">
                <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"/></svg>
              </div>
              <p className="text-white text-sm font-medium">Campaigns</p>
              <p className="text-slate-500 text-xs">4 active</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardActivity({ onNavigate }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="dashboard" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header 
          title="Activity Log" 
          subtitle="All AI and user actions"
          showStoreSelector={false}
          actions={<button onClick={() => onNavigate("dashboard")} className="px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">← Back</button>}
        />
        <div className="flex-1 p-4 overflow-auto">
          <div className="space-y-2">
            {[
              {e:"🤖",t:"Imported 12 products",d:"From AutoDS",tm:"2m ago",type:"AI"},
              {e:"✍️",t:"Generated blog posts",d:"5 posts for SEO",tm:"15m ago",type:"AI"},
              {e:"📢",t:"Launched campaign",d:"Summer Sale 2026",tm:"1h ago",type:"User"},
              {e:"🎯",t:"Optimized targeting",d:"ROAS 2.8x → 3.2x",tm:"2h ago",type:"AI"},
            ].map((a,i) => (
              <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3">
                <span className="text-xl">{a.e}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-white text-sm font-medium">{a.t}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400">{a.type}</span>
                  </div>
                  <p className="text-slate-400 text-xs mt-0.5">{a.d}</p>
                  <p className="text-slate-600 text-[10px] mt-2">{a.tm}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationsScreen({ onNavigate }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="settings" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Notifications" showStoreSelector={false} />
        <div className="flex-1 p-4 overflow-auto">
          <div className="space-y-2">
            {[
              {t:"High ROAS Alert",d:"ROAS reached 4.5x",time:"5m ago",read:false,type:"success"},
              {t:"Low Stock",d:"Earbuds Pro < 10 units",time:"1h ago",read:false,type:"warning"},
              {t:"Order Delivered",d:"Order #1234 delivered",time:"3h ago",read:true,type:"info"},
            ].map((n,i) => (
              <div key={i} className={`p-4 rounded-xl border flex items-start gap-3 ${n.read ? "bg-white/5 border-white/5" : "bg-violet-500/5 border-violet-500/20"}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${n.type === "success" ? "bg-green-500/20" : n.type === "warning" ? "bg-yellow-500/20" : "bg-blue-500/20"}`}>
                  <span className="text-base">{n.type === "success" ? "✅" : n.type === "warning" ? "⚠️" : "ℹ️"}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-white text-sm font-medium">{n.t}</p>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-violet-500" />}
                  </div>
                  <p className="text-slate-400 text-xs mt-0.5">{n.d}</p>
                  <p className="text-slate-600 text-[10px] mt-2">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectsScreen({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="projects" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header 
          title="Projects" 
          subtitle="Manage your stores"
          currentStore={currentStore}
          actions={
            <button onClick={() => onNavigate("project-create")} className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 text-white text-xs font-medium hover:opacity-90 transition-opacity">
              + New Project
            </button>
          }
        />
        <div className="flex-1 p-4 overflow-auto">
          <div className="grid grid-cols-2 gap-3">
            {[
              {n:"Gadget Hub",s:"active",r:"$8.2K",p:24,m:"23%",t:"Electronics",i:"⚡"},
              {n:"Fashion Forward",s:"active",r:"$4.3K",p:156,m:"45%",t:"Fashion",i:"👕"},
              {n:"Home Comfort",s:"paused",r:"$1.2K",p:89,m:"32%",t:"Home",i:"🏠"},
            ].map((proj,i) => (
              <button key={i} onClick={() => onNavigate("project-detail")} className="p-4 rounded-xl bg-white/5 border border-white/5 text-left hover:border-white/10 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/30 to-pink-500/30 flex items-center justify-center text-2xl">{proj.i}</div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${proj.s==="active"?"bg-green-500/15 text-green-400 border border-green-500/20":"bg-yellow-500/15 text-yellow-400 border border-yellow-500/20"}`}>{proj.s}</span>
                </div>
                <p className="text-white text-sm font-semibold">{proj.n}</p>
                <p className="text-slate-500 text-xs">{proj.t}</p>
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/5">
                  <div><p className="text-[10px] text-slate-500">Revenue</p><p className="text-white text-sm font-medium">{proj.r}</p></div>
                  <div><p className="text-[10px] text-slate-500">Products</p><p className="text-white text-sm font-medium">{proj.p}</p></div>
                  <div><p className="text-[10px] text-slate-500">Margin</p><p className="text-green-400 text-sm font-medium">{proj.m}</p></div>
                </div>
              </button>
            ))}
            <button onClick={() => onNavigate("project-create")} className="p-4 rounded-xl bg-white/5 border border-dashed border-white/10 flex flex-col items-center justify-center gap-2 hover:border-violet-500/30 transition-colors">
              <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
              </div>
              <span className="text-slate-400 text-xs">Create New Project</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectDetail({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="projects" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header 
          title="Gadget Hub" 
          subtitle="Electronics store"
          currentStore={currentStore}
          actions={
            <>
              <button onClick={() => onNavigate("project-edit")} className="px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">Edit</button>
              <button onClick={() => onNavigate("project-settings")} className="px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">Settings</button>
            </>
          }
        />
        <div className="flex-1 p-4 overflow-auto">
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[{l:"Revenue",v:"$8.2K",c:"+12%"}, {l:"Orders",v:"142",c:"+8%"}, {l:"Products",v:"24",c:"+5"}, {l:"ROAS",v:"3.2x",c:"+0.4"}].map((s,i) => (
              <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5">
                <p className="text-slate-500 text-[10px] uppercase">{s.l}</p>
                <p className="text-white text-lg font-bold">{s.v}</p>
                <span className="text-green-400 text-[10px]">{s.c}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-white text-sm font-medium">Recent Orders</p>
                <button onClick={() => onNavigate("orders")} className="text-violet-400 text-xs hover:underline">View all</button>
              </div>
              <div className="space-y-2">
                {[{id:"#1421",amt:"$89.99",s:"fulfilled"}, {id:"#1420",amt:"$156.50",s:"processing"}].map(o => (
                  <div key={o.id} className="flex items-center justify-between p-2 rounded-lg bg-[#0d0d12]">
                    <span className="text-white text-xs font-medium">{o.id}</span>
                    <span className="text-white text-xs">{o.amt}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${o.s==="fulfilled"?"bg-green-500/15 text-green-400":"bg-yellow-500/15 text-yellow-400"}`}>{o.s}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-white text-sm font-medium">Top Products</p>
                <button onClick={() => onNavigate("products")} className="text-violet-400 text-xs hover:underline">View all</button>
              </div>
              <div className="space-y-2">
                {[{n:"Wireless Earbuds",s:45}, {n:"Phone Stand",s:32}].map((p,i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-[#0d0d12]">
                    <span className="text-white text-xs flex-1">{p.n}</span>
                    <div className="w-16 h-1.5 bg-white/10 rounded-full"><div className="h-full bg-violet-500 rounded-full" style={{width:`${p.s}%`}}/></div>
                    <span className="text-slate-400 text-[10px] w-6 text-right">{p.s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCreate({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="projects" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Create New Project" currentStore={currentStore} showStoreSelector={false} />
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-lg mx-auto space-y-4">
            <div>
              <label className="text-slate-400 text-xs block mb-2">Project Name</label>
              <input type="text" placeholder="My AI Store" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-500 outline-none focus:border-violet-500/50" />
            </div>
            <div>
              <label className="text-slate-400 text-xs block mb-2">Store Niche</label>
              <select className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50">
                <option>Select niche...</option>
                <option>Electronics</option>
                <option>Fashion</option>
              </select>
            </div>
            <div className="flex gap-3 pt-4">
              <button onClick={() => onNavigate("projects")} className="flex-1 p-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">Cancel</button>
              <button onClick={() => onNavigate("project-detail")} className="flex-1 p-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity">Create</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectEdit({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="projects" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Edit Project" currentStore={currentStore} showStoreSelector={false} />
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-lg mx-auto space-y-4">
            <div>
              <label className="text-slate-400 text-xs block mb-2">Project Name</label>
              <input type="text" defaultValue="Gadget Hub" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50" />
            </div>
            <div className="flex gap-3 pt-4">
              <button onClick={() => onNavigate("project-detail")} className="flex-1 p-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">Cancel</button>
              <button onClick={() => onNavigate("project-detail")} className="flex-1 p-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectSettings({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="projects" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Project Settings" currentStore={currentStore} showStoreSelector={false} />
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-lg mx-auto space-y-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <h3 className="text-white text-sm font-medium mb-3">AI Configuration</h3>
              <div className="space-y-3">
                {["Auto-import products","Auto-generate content","Auto-optimize ads"].map((l,i) => (
                  <label key={l} className="flex items-center justify-between">
                    <span className="text-slate-400 text-xs">{l}</span>
                    <div className={`w-8 h-4 rounded-full ${i<2?"bg-violet-500":"bg-white/10"} relative cursor-pointer`}>
                      <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${i<2?"right-0.5":"left-0.5"}`} />
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
              <h3 className="text-red-400 text-sm font-medium mb-2">Danger Zone</h3>
              <button className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs border border-red-500/30 hover:bg-red-500/30 transition-colors">Delete Project</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductsScreen({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="products" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header 
          title="Products" 
          subtitle="156 products"
          currentStore={currentStore}
          actions={
            <>
              <button onClick={() => onNavigate("product-import")} className="px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">Import</button>
              <button onClick={() => onNavigate("product-create")} className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 text-white text-xs font-medium hover:opacity-90 transition-opacity">+ Add</button>
            </>
          }
        />
        <div className="flex-1 p-4 overflow-auto">
          <div className="grid grid-cols-3 gap-3">
            {[
              {id:"1",n:"Wireless Earbuds Pro",p:"$49.99",c:"$23.50",s:24,m:"47%"},
              {id:"2",n:"Smart Watch Series 5",p:"$129.99",c:"$45.00",s:12,m:"65%"},
              {id:"3",n:"Phone Stand Adjustable",p:"$19.99",c:"$8.50",s:156,m:"57%"},
              {id:"4",n:"LED Desk Lamp",p:"$34.99",c:"$15.00",s:0,m:"57%"},
              {id:"5",n:"USB-C Cable 2m",p:"$12.99",c:"$4.50",s:89,m:"65%"},
              {id:"6",n:"Bluetooth Speaker",p:"$59.99",c:"$28.00",s:34,m:"53%"},
            ].map(prod => (
              <button key={prod.id} onClick={() => onNavigate("product-detail")} className="p-3 rounded-xl bg-white/5 border border-white/5 text-left hover:border-white/10 transition-all">
                <div className="h-20 bg-gradient-to-br from-white/5 to-white/10 rounded-xl mb-3 flex items-center justify-center text-3xl">📦</div>
                <p className="text-white text-xs font-medium truncate">{prod.n}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-violet-400 text-sm font-bold">{prod.p}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${prod.s>0?"bg-green-500/15 text-green-400 border border-green-500/20":"bg-red-500/15 text-red-400 border border-red-500/20"}`}>{prod.s>0?`${prod.s} in stock`:"Out"}</span>
                </div>
                <p className="text-slate-500 text-[10px] mt-1">Margin: {prod.m}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductDetail({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="products" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header 
          title="Wireless Earbuds Pro" 
          subtitle="SKU: WEP-2026-001"
          currentStore={currentStore}
          actions={
            <>
              <button onClick={() => onNavigate("product-edit")} className="px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">Edit</button>
              <button className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs border border-red-500/30 hover:bg-red-500/30 transition-colors">Delete</button>
            </>
          }
        />
        <div className="flex-1 p-4 overflow-auto">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <div className="aspect-square bg-gradient-to-br from-white/5 to-white/10 rounded-xl flex items-center justify-center text-6xl mb-4">📦</div>
            </div>
            <div className="col-span-2 space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <h3 className="text-white text-sm font-medium mb-3">Pricing</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div><p className="text-slate-500 text-xs">Price</p><p className="text-white text-lg font-bold">$49.99</p></div>
                  <div><p className="text-slate-500 text-xs">Cost</p><p className="text-white text-lg font-bold">$23.50</p></div>
                  <div><p className="text-slate-500 text-xs">Margin</p><p className="text-green-400 text-lg font-bold">47%</p></div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <h3 className="text-white text-sm font-medium mb-3">Inventory</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div><p className="text-slate-500 text-xs">In Stock</p><p className="text-white text-lg font-bold">24</p></div>
                  <div><p className="text-slate-500 text-xs">Reserved</p><p className="text-white text-lg font-bold">3</p></div>
                  <div><p className="text-slate-500 text-xs">Available</p><p className="text-white text-lg font-bold">21</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCreate({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="products" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Add Product" currentStore={currentStore} showStoreSelector={false} />
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-xs block mb-2">Product Name</label>
                <input type="text" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50" />
              </div>
              <div>
                <label className="text-slate-400 text-xs block mb-2">SKU</label>
                <input type="text" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-slate-400 text-xs block mb-2">Price</label>
                <input type="text" placeholder="$0.00" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50" />
              </div>
              <div>
                <label className="text-slate-400 text-xs block mb-2">Cost</label>
                <input type="text" placeholder="$0.00" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50" />
              </div>
              <div>
                <label className="text-slate-400 text-xs block mb-2">Stock</label>
                <input type="number" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50" />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button onClick={() => onNavigate("products")} className="flex-1 p-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">Cancel</button>
              <button onClick={() => onNavigate("product-detail")} className="flex-1 p-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity">Create</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductEdit({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="products" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Edit Product" currentStore={currentStore} showStoreSelector={false} />
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-2xl mx-auto space-y-4">
            <input type="text" defaultValue="Wireless Earbuds Pro" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50" />
            <div className="flex gap-3 pt-4">
              <button onClick={() => onNavigate("product-detail")} className="flex-1 p-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">Cancel</button>
              <button onClick={() => onNavigate("product-detail")} className="flex-1 p-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductImport({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="products" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="AutoDS Import" currentStore={currentStore} showStoreSelector={false} />
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-lg mx-auto text-center space-y-6 py-8">
            <div className="w-16 h-16 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
            </div>
            <h3 className="text-white text-lg font-bold">Import from AutoDS</h3>
            <div className="flex gap-3">
              <button onClick={() => onNavigate("products")} className="flex-1 p-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">Cancel</button>
              <button onClick={() => onNavigate("products")} className="flex-1 p-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity">Connect</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductBulk({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="products" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Bulk Edit" currentStore={currentStore} showStoreSelector={false} />
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-lg mx-auto space-y-4">
            <p className="text-slate-400 text-sm">Editing 24 products</p>
            <div className="flex gap-3">
              <button onClick={() => onNavigate("products")} className="flex-1 p-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">Cancel</button>
              <button onClick={() => onNavigate("products")} className="flex-1 p-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity">Apply</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrdersScreen({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="orders" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Orders" subtitle="326 total" currentStore={currentStore} actions={<button onClick={() => onNavigate("returns")} className="px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">Returns</button>} />
        <div className="flex-1 p-4 overflow-auto">
          <div className="flex gap-2 mb-4">
            {["All","Pending","Processing","Shipped","Delivered"].map((f,i) => (
              <button key={f} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${i===0?"bg-violet-500/20 text-violet-300 border border-violet-500/30":"bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10"}`}>{f}</button>
            ))}
          </div>
          <div className="space-y-2">
            {[{id:"#1425",c:"Sarah Johnson",t:"$156.97",s:"processing",d:"Today"}, {id:"#1424",c:"Mike Chen",t:"$89.50",s:"shipped",d:"Yesterday"}, {id:"#1423",c:"Emily Davis",t:"$245.00",s:"delivered",d:"Jan 5"}].map(o => (
              <button key={o.id} onClick={() => onNavigate("order-detail")} className="w-full p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3 hover:border-white/10 transition-colors text-left">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg">📦</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-semibold">{o.id}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${o.s==="delivered"?"bg-green-500/15 text-green-400":o.s==="shipped"?"bg-blue-500/15 text-blue-400":o.s==="processing"?"bg-yellow-500/15 text-yellow-400":"bg-slate-500/15 text-slate-400"}`}>{o.s}</span>
                  </div>
                  <p className="text-slate-400 text-xs">{o.c}</p>
                </div>
                <div className="text-right">
                  <p className="text-white text-sm font-semibold">{o.t}</p>
                  <p className="text-slate-500 text-[10px]">{o.d}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderDetail({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="orders" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header 
          title="Order #1425" 
          subtitle="Placed Jan 6, 2026"
          currentStore={currentStore}
          actions={
            <>
              <button onClick={() => onNavigate("order-fulfill")} className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 text-white text-xs font-medium">Fulfill</button>
              <button onClick={() => onNavigate("order-refund")} className="px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">Refund</button>
            </>
          }
        />
        <div className="flex-1 p-4 overflow-auto">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <h3 className="text-white text-sm font-medium mb-3">Items</h3>
                <div className="space-y-3">
                  {[{n:"Wireless Earbuds Pro",p:"$49.99",q:2}].map((item,i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-[#0d0d12]">
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">📦</div>
                      <div className="flex-1">
                        <p className="text-white text-xs font-medium">{item.n}</p>
                        <p className="text-slate-500 text-[10px]">Qty: {item.q}</p>
                      </div>
                      <span className="text-white text-sm">{item.p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <h3 className="text-white text-sm font-medium mb-3">Customer</h3>
                <p className="text-white text-sm">Sarah Johnson</p>
                <p className="text-slate-400 text-xs">sarah@example.com</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <h3 className="text-white text-sm font-medium mb-3">Summary</h3>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400"><span>Subtotal</span><span className="text-white">$141.97</span></div>
                  <div className="flex justify-between text-slate-400"><span>Shipping</span><span className="text-white">$10.00</span></div>
                  <div className="flex justify-between text-white font-medium pt-2 border-t border-white/5"><span>Total</span><span>$156.97</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderFulfill({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="orders" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Fulfill Order #1425" currentStore={currentStore} showStoreSelector={false} />
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-lg mx-auto space-y-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <h3 className="text-white text-sm font-medium mb-3">Shipping Method</h3>
              {["Standard (3-5 days)","Express (1-2 days)"].map((m,i) => (
                <label key={i} className="flex items-center gap-3 p-3 rounded-lg bg-[#0d0d12] cursor-pointer mb-2">
                  <input type="radio" name="shipping" defaultChecked={i===0} className="rounded-full bg-white/5 border-white/10" />
                  <span className="text-white text-xs">{m}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => onNavigate("order-detail")} className="flex-1 p-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">Cancel</button>
              <button onClick={() => onNavigate("orders")} className="flex-1 p-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity">Mark Fulfilled</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderRefund({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="orders" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Process Refund #1425" currentStore={currentStore} showStoreSelector={false} />
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-lg mx-auto space-y-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <h3 className="text-white text-sm font-medium mb-3">Refund Amount</h3>
              <input type="text" defaultValue="156.97" className="w-full p-3 rounded-xl bg-[#0d0d12] border border-white/10 text-white text-lg outline-none focus:border-violet-500/50" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => onNavigate("order-detail")} className="flex-1 p-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">Cancel</button>
              <button onClick={() => onNavigate("orders")} className="flex-1 p-3 rounded-xl bg-red-500/20 text-red-400 font-semibold border border-red-500/30 hover:bg-red-500/30 transition-colors">Process Refund</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReturnsScreen({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="orders" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Returns" subtitle="3 open" currentStore={currentStore} />
        <div className="flex-1 p-4 overflow-auto">
          <div className="space-y-2">
            {[{id:"R-1025",o:"#1421",r:"Wrong size",s:"pending"}].map(r => (
              <div key={r.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">{r.id}</p>
                  <p className="text-slate-400 text-xs">Order {r.o} • {r.r}</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400">{r.s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentScreen({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="content" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Content Library" subtitle="156 items" currentStore={currentStore} actions={<button onClick={() => onNavigate("content-create")} className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 text-white text-xs font-medium">+ Create</button>} />
        <div className="flex-1 p-4 overflow-auto">
          <div className="flex gap-2 mb-4">
            {["All","Blog","Social","Ads"].map((f,i) => (
              <button key={f} onClick={() => i===1?onNavigate("content-blog"):i===2?onNavigate("content-social"):null} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${i===0?"bg-violet-500/20 text-violet-300 border border-violet-500/30":"bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10"}`}>{f}</button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[{t:"10 Summer Gadgets",ty:"blog",s:"published"}, {t:"New Arrivals Promo",ty:"social",s:"scheduled"}].map((c,i) => (
              <button key={i} onClick={() => onNavigate("content-editor")} className="p-3 rounded-xl bg-white/5 border border-white/5 text-left hover:border-white/10 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500 capitalize">{c.ty}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${c.s==="published"?"bg-green-500/15 text-green-400":"bg-blue-500/15 text-blue-400"}`}>{c.s}</span>
                </div>
                <p className="text-white text-sm font-medium">{c.t}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentBlog({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="content" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Blog Posts" currentStore={currentStore} />
        <div className="flex-1 p-4 overflow-auto">
          <button onClick={() => onNavigate("content")} className="mb-4 px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">← Back to Content</button>
          <div className="space-y-2">
            {["10 Must-Have Gadgets","How to Choose Earbuds"].map((p,i) => (
              <button key={i} onClick={() => onNavigate("content-editor")} className="w-full p-4 rounded-xl bg-white/5 border border-white/5 text-left hover:border-white/10 transition-colors">
                <p className="text-white text-sm font-medium">{p}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentSocial({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="content" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Social Content" currentStore={currentStore} />
        <div className="flex-1 p-4 overflow-auto">
          <button onClick={() => onNavigate("content")} className="mb-4 px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">← Back</button>
          <p className="text-slate-400 text-sm">Social posts...</p>
        </div>
      </div>
    </div>
  );
}

function ContentCreate({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="content" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Create Content" currentStore={currentStore} showStoreSelector={false} />
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-2xl mx-auto grid grid-cols-2 gap-4">
            {[{t:"Blog Post",i:"✍️",a:"content-editor"}, {t:"Social",i:"📱",a:"content-editor"}].map((o,i) => (
              <button key={i} onClick={() => onNavigate(o.a)} className="p-6 rounded-xl bg-white/5 border border-white/5 text-center hover:border-violet-500/30 transition-all">
                <span className="text-2xl">{o.i}</span>
                <p className="text-white text-sm font-medium mt-2">{o.t}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentEditor({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="content" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Editor" currentStore={currentStore} showStoreSelector={false} actions={
          <>
            <button onClick={() => onNavigate("content-preview")} className="px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">Preview</button>
            <button onClick={() => onNavigate("content")} className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 text-white text-xs font-medium">Publish</button>
          </>
        } />
        <div className="flex-1 p-4 overflow-auto">
          <input type="text" defaultValue="10 Must-Have Summer Gadgets" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-lg font-semibold outline-none focus:border-violet-500/50 mb-4" />
          <textarea defaultValue="Summer is here..." rows={8} className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50 resize-none" />
        </div>
      </div>
    </div>
  );
}

function ContentPreview({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="content" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Preview" currentStore={currentStore} showStoreSelector={false} actions={<button onClick={() => onNavigate("content-editor")} className="px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10">← Back</button>} />
        <div className="flex-1 p-4 overflow-auto bg-white">
          <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-2xl font-bold text-gray-900">10 Must-Have Summer Gadgets</h1>
            <p className="text-gray-600 mt-4">Summer is here...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdsScreen({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="ads" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Campaigns" subtitle="8 campaigns" currentStore={currentStore} actions={<button onClick={() => onNavigate("ads-create")} className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 text-white text-xs font-medium">+ New</button>} />
        <div className="flex-1 p-4 overflow-auto">
          <div className="flex gap-2 mb-4">
            {["All","Active","Paused"].map((f,i) => (
              <button key={f} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${i===0?"bg-violet-500/20 text-violet-300 border border-violet-500/30":"bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10"}`}>{f}</button>
            ))}
          </div>
          <div className="space-y-3">
            {[{n:"Summer Sale 2026",pl:"Meta",sp:1240,r:3.2,s:"active"}, {n:"Product Launch",pl:"TikTok",sp:890,r:2.8,s:"active"}].map(c => (
              <button key={c.n} onClick={() => onNavigate("ads-detail")} className="w-full p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors text-left">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-white text-sm font-semibold">{c.n}</h4>
                    <p className="text-slate-500 text-xs">{c.pl}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm font-bold">${c.sp.toLocaleString()}</p>
                    <p className="text-green-400 text-xs">ROAS {c.r}x</p>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${c.s==="active"?"bg-green-500/15 text-green-400":"bg-yellow-500/15 text-yellow-400"}`}>{c.s}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdsCreate({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="ads" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Create Campaign" currentStore={currentStore} showStoreSelector={false} />
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-2xl mx-auto space-y-4">
            <div>
              <label className="text-slate-400 text-xs block mb-2">Campaign Name</label>
              <input type="text" placeholder="Summer Sale 2026" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50" />
            </div>
            <div className="flex gap-3 pt-4">
              <button onClick={() => onNavigate("ads")} className="flex-1 p-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">Cancel</button>
              <button onClick={() => onNavigate("ads-audience")} className="flex-1 p-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity">Continue</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdsDetail({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="ads" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Summer Sale 2026" subtitle="Meta Campaign" currentStore={currentStore} actions={
          <>
            <button onClick={() => onNavigate("ads-edit")} className="px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">Edit</button>
            <button onClick={() => onNavigate("ads")} className="px-3 py-1.5 rounded-lg bg-yellow-500/20 text-yellow-400 text-xs border border-yellow-500/30">Pause</button>
          </>
        } />
        <div className="flex-1 p-4 overflow-auto">
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[{l:"Spend",v:"$1,240"}, {l:"ROAS",v:"3.2x"}, {l:"Impressions",v:"14.8K"}, {l:"Clicks",v:"2,480"}].map((s,i) => (
              <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5">
                <p className="text-slate-500 text-[10px] uppercase">{s.l}</p>
                <p className="text-white text-lg font-bold">{s.v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdsEdit({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="ads" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Edit Campaign" currentStore={currentStore} showStoreSelector={false} />
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-lg mx-auto space-y-4">
            <input type="text" defaultValue="Summer Sale 2026" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50" />
            <div className="flex gap-3">
              <button onClick={() => onNavigate("ads-detail")} className="flex-1 p-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">Cancel</button>
              <button onClick={() => onNavigate("ads-detail")} className="flex-1 p-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdsAudience({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="ads" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Audience Builder" currentStore={currentStore} showStoreSelector={false} />
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-lg mx-auto space-y-4">
            <p className="text-slate-400 text-sm">Configure your target audience...</p>
            <div className="flex gap-3">
              <button onClick={() => onNavigate("ads-create")} className="flex-1 p-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">Back</button>
              <button onClick={() => onNavigate("ads-creative")} className="flex-1 p-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity">Continue</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdsCreative({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="ads" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Creative Studio" currentStore={currentStore} showStoreSelector={false} />
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="flex gap-3">
              <button onClick={() => onNavigate("ads-audience")} className="flex-1 p-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">Back</button>
              <button onClick={() => onNavigate("ads")} className="flex-1 p-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity">Launch</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdsAnalytics({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="ads" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Ad Analytics" currentStore={currentStore} />
        <div className="flex-1 p-4 overflow-auto">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-slate-500 text-xs">Total Spend</p>
              <p className="text-white text-2xl font-bold">$5,230</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-slate-500 text-xs">Avg ROAS</p>
              <p className="text-white text-2xl font-bold">3.4x</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-slate-500 text-xs">Conversions</p>
              <p className="text-white text-2xl font-bold">234</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsScreen({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="analytics" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Analytics" currentStore={currentStore} actions={<button onClick={() => onNavigate("analytics-export")} className="px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">Export</button>} />
        <div className="flex-1 p-4 overflow-auto space-y-4">
          <div className="grid grid-cols-4 gap-3">
            {[{l:"Revenue",v:"$12.5K",c:"+18.5%",nav:"analytics-sales"}, {l:"Orders",v:"326",c:"+12.4%",nav:"orders"}, {l:"ROAS",v:"3.8x",c:"+22.7%",nav:"ads"}, {l:"Conv. Rate",v:"4.2%",c:"+0.8%",nav:"analytics-products"}].map((s,i) => (
              <button key={i} onClick={() => onNavigate(s.nav)} className="p-4 rounded-xl bg-white/5 border border-white/5 text-left hover:border-white/10 transition-all">
                <p className="text-slate-500 text-[10px] uppercase">{s.l}</p>
                <p className="text-white text-xl font-bold">{s.v}</p>
                <span className="text-green-400 text-xs">{s.c}</span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-white text-sm font-medium mb-3">Revenue Trend</p>
              <div className="h-32 flex items-end gap-1">
                {[45,62,48,85,70,92,78,88,95,82,90,100].map((h,i) => (
                  <div key={i} className="flex-1 bg-gradient-to-t from-violet-500/80 to-pink-500/80 rounded-t" style={{height:`${h}%`}} />
                ))}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-white text-sm font-medium mb-3">Traffic Sources</p>
              <div className="space-y-2">
                {[{s:"Organic",p:45}, {s:"Meta Ads",p:30}, {s:"Direct",p:15}, {s:"TikTok",p:10}].map(item => (
                  <div key={item.s} className="flex items-center gap-2">
                    <span className="text-slate-400 text-xs w-20">{item.s}</span>
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full"><div className="h-full bg-violet-500 rounded-full" style={{width:`${item.p}%`}}/></div>
                    <span className="text-white text-xs w-8 text-right">{item.p}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsSales({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="analytics" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Sales Reports" currentStore={currentStore} showStoreSelector={false} />
        <div className="flex-1 p-4 overflow-auto">
          <button onClick={() => onNavigate("analytics")} className="mb-4 px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">← Back</button>
          <p className="text-slate-400 text-sm">Sales reports...</p>
        </div>
      </div>
    </div>
  );
}

function AnalyticsExport({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="analytics" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Export Data" currentStore={currentStore} showStoreSelector={false} />
        <div className="flex-1 p-4 overflow-auto">
          <button onClick={() => onNavigate("analytics")} className="mb-4 px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">← Back</button>
          <button onClick={() => onNavigate("analytics")} className="w-full p-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold">Download</button>
        </div>
      </div>
    </div>
  );
}

function AIAgentScreen({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="ai-agent" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header 
          title="AI Agent" 
          subtitle="Online"
          currentStore={currentStore}
          actions={
            <>
              <button onClick={() => onNavigate("ai-history")} className="px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">History</button>
              <button onClick={() => onNavigate("ai-tasks")} className="px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">Tasks</button>
            </>
          }
        />
        <div className="flex-1 overflow-auto p-4 space-y-4">
          <div className="flex gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex-shrink-0" />
            <div className="max-w-[70%] p-3 rounded-xl bg-white/5 border border-white/5">
              <p className="text-white text-sm">Hi! I'm your AI store assistant. What would you like me to help with today?</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {["Import products","Write blog post","Create ad","Sync inventory"].map(s => (
              <button key={s} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs hover:bg-white/10 transition-colors">{s}</button>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <input type="text" placeholder="Ask me anything..." className="flex-1 p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50" />
            <button className="w-10 h-10 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AIHistory({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="ai-agent" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Chat History" currentStore={currentStore} showStoreSelector={false} />
        <div className="flex-1 p-4 overflow-auto">
          <button onClick={() => onNavigate("ai-agent")} className="mb-4 px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">← Back</button>
          <div className="space-y-2">
            {["Today","Yesterday"].map((d,i) => (
              <button key={d} onClick={() => onNavigate("ai-agent")} className="w-full p-3 rounded-xl bg-white/5 border border-white/5 text-left hover:border-white/10 transition-colors">
                <p className="text-white text-sm">Chat session</p>
                <p className="text-slate-500 text-xs">{d}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AITasks({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="ai-agent" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="AI Tasks" currentStore={currentStore} showStoreSelector={false} />
        <div className="flex-1 p-4 overflow-auto">
          <button onClick={() => onNavigate("ai-agent")} className="mb-4 px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">← Back</button>
          <div className="space-y-2">
            {[{t:"Import products",p:65}, {t:"Generate content",p:100}].map(task => (
              <div key={task.t} className="p-3 rounded-xl bg-white/5 border border-white/5">
                <p className="text-white text-sm">{task.t}</p>
                <div className="h-1.5 bg-white/10 rounded-full mt-2"><div className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full" style={{width:`${task.p}%`}}/></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AITemplates({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="ai-agent" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="AI Templates" currentStore={currentStore} showStoreSelector={false} />
        <div className="flex-1 p-4 overflow-auto">
          <button onClick={() => onNavigate("ai-agent")} className="mb-4 px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">← Back</button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {name:"Product Description", desc:"Generate SEO-optimized product descriptions"},
              {name:"Ad Copy", desc:"Create compelling ad copy for Meta Ads"},
              {name:"Email Sequence", desc:"Abandoned cart and welcome sequences"},
              {name:"Blog Post", desc:"Generate blog content for your niche"},
            ].map(template => (
              <div key={template.name} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                <p className="text-white text-sm font-medium">{template.name}</p>
                <p className="text-slate-500 text-xs mt-1">{template.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AutomationScreen({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="automation" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header 
          title="Automation" 
          subtitle="8 active rules"
          currentStore={currentStore}
          actions={
            <>
              <button onClick={() => onNavigate("workflows")} className="px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">Workflows</button>
              <button onClick={() => onNavigate("automation-create")} className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 text-white text-xs font-medium">+ New</button>
            </>
          }
        />
        <div className="flex-1 p-4 overflow-auto">
          <div className="space-y-3">
            {[{n:"Auto Product Import",t:"Daily at 9AM",s:"active"}, {n:"Price Sync",t:"Every 2 hours",s:"active"}].map(rule => (
              <button key={rule.n} onClick={() => onNavigate("automation-edit")} className="w-full p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors text-left">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white text-sm font-medium">{rule.n}</p>
                    <p className="text-slate-500 text-xs">{rule.t}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${rule.s==="active"?"bg-green-500/15 text-green-400":"bg-yellow-500/15 text-yellow-400"}`}>{rule.s}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AutomationCreate({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="automation" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Create Rule" currentStore={currentStore} showStoreSelector={false} />
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-lg mx-auto space-y-4">
            <input type="text" placeholder="Rule name" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50" />
            <div className="flex gap-3">
              <button onClick={() => onNavigate("automation")} className="flex-1 p-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">Cancel</button>
              <button onClick={() => onNavigate("automation")} className="flex-1 p-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity">Create</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AutomationEdit({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="automation" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Edit Rule" currentStore={currentStore} showStoreSelector={false} />
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-lg mx-auto space-y-4">
            <input type="text" defaultValue="Auto Product Import" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50" />
            <div className="flex gap-3">
              <button onClick={() => onNavigate("automation")} className="flex-1 p-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">Cancel</button>
              <button onClick={() => onNavigate("automation")} className="flex-1 p-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AutomationLogs({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="automation" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Automation Logs" currentStore={currentStore} showStoreSelector={false} />
        <div className="flex-1 p-4 overflow-auto">
          <div className="space-y-2">
            {[
              {t:"Auto Product Import triggered", time:"2 min ago", status:"success"},
              {t:"Price Sync completed", time:"1 hour ago", status:"success"},
              {t:"Inventory check failed", time:"3 hours ago", status:"error"},
            ].map((log, i) => (
              <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-white text-sm">{log.t}</p>
                  <p className="text-slate-500 text-xs">{log.time}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${log.status==="success"?"bg-green-500/15 text-green-400":"bg-red-500/15 text-red-400"}`}>{log.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkflowsScreen({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="automation" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Workflows" currentStore={currentStore} showStoreSelector={false} />
        <div className="flex-1 p-4 overflow-auto">
          <p className="text-slate-400 text-sm">Workflows...</p>
        </div>
      </div>
    </div>
  );
}

function IntegrationsScreen({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="integrations" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header 
          title="Integrations" 
          subtitle="6 connected"
          currentStore={currentStore}
          actions={<button onClick={() => onNavigate("api-keys")} className="px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">API Keys</button>}
        />
        <div className="flex-1 p-4 overflow-auto">
          <div className="space-y-3">
            {[{n:"Shopify",s:"connected",i:"🛍️",a:"integration-shopify"}, {n:"AutoDS",s:"connected",i:"📦",a:"integration-autods"}, {n:"Meta Ads",s:"disconnected",i:"📢",a:"integration-meta"}].map(int => (
              <button key={int.n} onClick={() => onNavigate(int.a)} className="w-full p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between hover:border-white/10 transition-colors text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl">{int.i}</div>
                  <div>
                    <p className="text-white text-sm font-medium">{int.n}</p>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${int.s==="connected"?"bg-green-500/15 text-green-400":"bg-slate-500/15 text-slate-400"}`}>{int.s}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function IntegrationShopify({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="integrations" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Shopify" currentStore={currentStore} showStoreSelector={false} />
        <div className="flex-1 p-4 overflow-auto">
          <button onClick={() => onNavigate("integrations")} className="mb-4 px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">← Back</button>
          <div className="max-w-lg mx-auto p-4 rounded-xl bg-white/5 border border-white/5">
            <p className="text-green-400 text-xs mb-2">Connected</p>
            <p className="text-white text-sm">my-store.myshopify.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function IntegrationAutoDS({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="integrations" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="AutoDS" currentStore={currentStore} showStoreSelector={false} />
        <div className="flex-1 p-4 overflow-auto">
          <button onClick={() => onNavigate("integrations")} className="mb-4 px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">← Back</button>
          <p className="text-slate-400 text-sm">AutoDS settings...</p>
        </div>
      </div>
    </div>
  );
}

function IntegrationMeta({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="integrations" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Meta Ads" currentStore={currentStore} showStoreSelector={false} />
        <div className="flex-1 p-4 overflow-auto">
          <button onClick={() => onNavigate("integrations")} className="mb-4 px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">← Back</button>
          <button onClick={() => onNavigate("integrations")} className="px-4 py-2 rounded-xl bg-blue-500/20 text-blue-400 text-sm border border-blue-500/30 hover:bg-blue-500/30 transition-colors">Connect Account</button>
        </div>
      </div>
    </div>
  );
}

function APIKeysScreen({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="integrations" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="API Keys" currentStore={currentStore} showStoreSelector={false} />
        <div className="flex-1 p-4 overflow-auto">
          <button onClick={() => onNavigate("integrations")} className="mb-4 px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">← Back</button>
          <div className="space-y-3">
            {["Production","Development"].map(k => (
              <div key={k} className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-white text-sm font-medium">{k} Key</p>
                <code className="text-slate-500 text-xs">shppa_xxxxxxxx</code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsScreen({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="settings" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Settings" currentStore={currentStore} />
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-lg mx-auto space-y-2">
            {[{i:"👤",l:"Profile",a:"settings-profile"}, {i:"👥",l:"Team",a:"settings-team"}, {i:"💳",l:"Billing",a:"settings-billing"}, {i:"🔔",l:"Notifications",a:"settings-notifications"}, {i:"🔒",l:"Security",a:"settings-security"}].map(item => (
              <button key={item.l} onClick={() => onNavigate(item.a)} className="w-full p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between hover:border-white/10 transition-colors text-left">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.i}</span>
                  <p className="text-white text-sm font-medium">{item.l}</p>
                </div>
                <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsProfile({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="settings" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Profile" currentStore={currentStore} showStoreSelector={false} />
        <div className="flex-1 p-4 overflow-auto">
          <button onClick={() => onNavigate("settings")} className="mb-4 px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">← Back</button>
          <div className="max-w-lg mx-auto space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">JS</div>
              <button className="px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">Change</button>
            </div>
            <input type="text" defaultValue="John Smith" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50" />
            <div className="flex gap-3">
              <button onClick={() => onNavigate("settings")} className="flex-1 p-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">Cancel</button>
              <button onClick={() => onNavigate("settings")} className="flex-1 p-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsTeam({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="settings" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Team" currentStore={currentStore} showStoreSelector={false} />
        <div className="flex-1 p-4 overflow-auto">
          <button onClick={() => onNavigate("settings")} className="mb-4 px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">← Back</button>
          <div className="space-y-2">
            {["John Smith (Owner)","Sarah Johnson (Admin)"].map((m,i) => (
              <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <span className="text-white text-sm">{m}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsBilling({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="settings" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Billing" currentStore={currentStore} showStoreSelector={false} />
        <div className="flex-1 p-4 overflow-auto">
          <button onClick={() => onNavigate("settings")} className="mb-4 px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">← Back</button>
          <div className="max-w-lg mx-auto space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/15 to-pink-500/10 border border-violet-500/20">
              <p className="text-violet-300 text-xs mb-1">Current Plan</p>
              <p className="text-white text-lg font-bold">Pro Plan</p>
              <p className="text-slate-400 text-xs">$99/month</p>
            </div>
            <button onClick={() => onNavigate("settings-plan")} className="w-full p-3 rounded-xl bg-white/5 border border-white/5 text-left flex items-center justify-between hover:border-white/10 transition-colors">
              <span className="text-white text-sm">Change Plan</span>
              <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsPlan({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="settings" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Plan" currentStore={currentStore} showStoreSelector={false} />
        <div className="flex-1 p-4 overflow-auto">
          <button onClick={() => onNavigate("settings-billing")} className="mb-4 px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">← Back</button>
          <div className="grid grid-cols-3 gap-4">
            {["Starter $29","Pro $99","Enterprise $299"].map((plan,i) => (
              <div key={plan} className={`p-4 rounded-xl border ${i===1?"bg-violet-500/10 border-violet-500/30":"bg-white/5 border-white/5"}`}>
                <p className="text-white text-sm font-bold">{plan.split(" ")[0]}</p>
                <p className="text-violet-400 text-lg font-bold">{plan.split(" ")[1]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsNotifications({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="settings" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Notifications" currentStore={currentStore} showStoreSelector={false} />
        <div className="flex-1 p-4 overflow-auto">
          <button onClick={() => onNavigate("settings")} className="mb-4 px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">← Back</button>
          <div className="max-w-lg mx-auto space-y-4">
            {["Order notifications","Low stock alerts","Weekly reports"].map(n => (
              <div key={n} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-white text-sm">{n}</span>
                <div className="w-10 h-5 rounded-full bg-violet-500 relative"><div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white" /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsSecurity({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="settings" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Security" currentStore={currentStore} showStoreSelector={false} />
        <div className="flex-1 p-4 overflow-auto">
          <button onClick={() => onNavigate("settings")} className="mb-4 px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">← Back</button>
          <div className="max-w-lg mx-auto p-4 rounded-xl bg-white/5 border border-white/5">
            <p className="text-white text-sm font-medium mb-3">Change Password</p>
            <input type="password" placeholder="Current password" className="w-full p-3 rounded-xl bg-[#0d0d12] border border-white/10 text-white text-sm mb-2" />
            <input type="password" placeholder="New password" className="w-full p-3 rounded-xl bg-[#0d0d12] border border-white/10 text-white text-sm mb-3" />
            <button className="w-full p-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-medium">Update</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentAds({ onNavigate, currentStore }: any) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="content" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Ad Creatives" currentStore={currentStore} />
        <div className="flex-1 p-4 overflow-auto">
          <button onClick={() => onNavigate("content")} className="mb-4 px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">← Back</button>
          <div className="grid grid-cols-3 gap-3">
            {["Creative 1","Creative 2"].map((c,i) => (
              <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="aspect-video bg-gradient-to-br from-violet-500/20 to-pink-500/20 rounded-lg mb-2" />
                <p className="text-white text-xs">{c}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
