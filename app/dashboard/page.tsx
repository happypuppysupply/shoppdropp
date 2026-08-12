'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { StoresList } from '@/components/dashboard/StoresList';
import { SubscriptionCard } from '@/components/dashboard/SubscriptionCard';
import { Loader2 } from 'lucide-react';

interface Store {
  id: string;
  name: string;
  url: string;
  status: string;
  worker_id: string | null;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stores`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setStores(data);
      }
    } catch (error) {
      console.error('Failed to fetch stores:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your AI-powered Shopify stores
            </p>
          </header>

          {activeTab === 'overview' && (
            <>
              <DashboardStats stores={stores} />
              
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <StoresList stores={stores} onStoreAdded={fetchStores} />
                </div>
                <div>
                  <SubscriptionCard plan={user?.plan || 'payg'} />
                </div>
              </div>
            </>
          )}

          {activeTab === 'stores' && (
            <StoresList stores={stores} onStoreAdded={fetchStores} fullWidth />
          )}

          {activeTab === 'billing' && (
            <SubscriptionCard plan={user?.plan || 'payg'} fullWidth />
          )}
        </div>
      </main>
    </div>
  );
}