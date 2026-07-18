'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ShoppDroppLogo } from '@/components/Logo'
import {
  LayoutDashboard,
  Store,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  Bot,
  Megaphone,
  FileText,
  Zap,
  Menu,
  LogOut,
  ChevronRight,
} from 'lucide-react'

const navItems = [
  { href: '/app', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/app/projects', icon: Zap, label: 'Projects' },
  { href: '/app/products', icon: Package, label: 'Products' },
  { href: '/app/orders', icon: ShoppingCart, label: 'Orders' },
  { href: '/app/stores', icon: Store, label: 'Stores' },
  { href: '/app/ads', icon: Megaphone, label: 'Ads' },
  { href: '/app/content', icon: FileText, label: 'Content' },
  { href: '/app/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/app/ai-agent', icon: Bot, label: 'AI Agent' },
  { href: '/app/settings', icon: Settings, label: 'Settings' },
]

function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  return (
    <div className={`flex flex-col h-full bg-[#0a0a0f] border-r border-white/5 ${className}`}>
      {/* Logo */}
      <div className="p-4 flex items-center gap-3">
        <ShoppDroppLogo className="w-8 h-8" />
        <span className="text-white font-bold text-lg">
          SHOPP<span className="text-pink-400">DROPP</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
              {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-white/5">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-white/5 transition-colors">
              <Avatar className="w-8 h-8 bg-violet-500/20">
                <AvatarFallback className="bg-violet-500/20 text-violet-300 text-xs">
                  {user?.email?.[0].toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm text-white truncate">{user?.email?.split('@')[0] || 'User'}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email || ''}</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#111118] border-white/10">
            <DropdownMenuItem onClick={() => window.location.href='/app/settings'}>
              <Settings className="w-4 h-4 mr-2" />
              <span className="text-slate-300">Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              onClick={signOut}
              className="text-red-400 focus:text-red-300 focus:bg-red-500/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen bg-[#050508]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50 bg-[#111118]/80 backdrop-blur"
          >
            <Menu className="w-5 h-5 text-white" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-[#0a0a0f] border-white/10">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
