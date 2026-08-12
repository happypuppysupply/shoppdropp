'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Bot, 
  Settings, 
  ArrowLeft,
  Store,
  ShoppingBag,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

interface Store {
  id: string;
  name: string;
  url: string;
  status: string;
}

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const storeId = params.storeId as string;
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStore();
  }, [storeId]);

  const fetchStore = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/stores/${storeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setStore(data);
      } else if (response.status === 404) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Failed to fetch store:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActiveTab = () => {
    if (pathname.includes('/ai-agent')) return 'ai-agent';
    if (pathname.includes('/settings')) return 'settings';
    return 'overview';
  };

  const activeTab = getActiveTab();

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, href: `/store/${storeId}` },
    { id: 'ai-agent', label: 'AI Agent', icon: Bot, href: `/store/${storeId}/ai-agent` },
    { id: 'settings', label: 'Settings', icon: Settings, href: `/store/${storeId}/settings` },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500" />
      </div>
    );
  }

  if (!store) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-800">
        {/* Logo */}
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-violet-500 to-pink-500 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">SHOPPDROPP</span>
          </div>
        </div>

        {/* Back to Stores */}
        <div className="px-4 pb-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Stores</span>
          </Link>
        </div>

        {/* Store Info */}
        <div className="px-4 py-3 mb-4">
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-800/50 rounded-lg">
            <div className="w-10 h-10 bg-violet-500/20 rounded-lg flex items-center justify-center">
              <Store className="w-5 h-5 text-violet-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{store.name}</p>
              <p className="text-xs text-gray-500 truncate">{store.url.replace('https://', '')}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-1 ${
                  isActive 
                    ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <div className="px-4 py-2 mb-2">
            <p className="text-sm text-gray-500 truncate">{user?.email}</p>
            <p className="text-xs text-violet-400 capitalize">{user?.plan || 'payg'} Plan</p>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}
