'use client';

import { useState, useEffect } from 'react';
import { X, Store, Key, Check, AlertCircle } from 'lucide-react';

interface StoreDetailsModalProps {
  store: {
    id: string;
    name: string;
    url: string;
    status: string;
  };
  onClose: () => void;
}

interface Credentials {
  type: string;
  hasCredentials: boolean;
}

export function StoreDetailsModal({ store, onClose }: StoreDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'shopify' | 'meta' | 'autods'>('shopify');
  const [credentials, setCredentials] = useState<Credentials[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Form states
  const [shopifyKey, setShopifyKey] = useState('');
  const [shopifySecret, setShopifySecret] = useState('');
  const [metaToken, setMetaToken] = useState('');
  const [metaAdAccount, setMetaAdAccount] = useState('');
  const [autodsKey, setAutodsKey] = useState('');

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/stores/${store.id}/credentials`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCredentials(data);
      }
    } catch (error) {
      console.error('Failed to fetch credentials:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCredentials = async (type: string, creds: any) => {
    setSaving(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/stores/${store.id}/credentials`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ type, credentials: creds }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save credentials');
      }

      setMessage('Credentials saved successfully!');
      fetchCredentials();
    } catch (error) {
      setMessage('Failed to save credentials');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'shopify', label: 'Shopify', icon: Store },
    { id: 'meta', label: 'Meta Ads', icon: Key },
    { id: 'autods', label: 'AutoDS', icon: Key },
  ];

  const hasCreds = (type: string) => credentials.some(c => c.type === type);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{store.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Configure API credentials</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            message.includes('success') 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
          }`}>
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isConfigured = hasCreds(tab.id === 'meta' ? 'meta_ads' : tab.id);
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {isConfigured && (
                  <Check className="w-3 h-3 text-green-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* Shopify Tab */}
        {activeTab === 'shopify' && (
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div className="text-sm text-amber-800 dark:text-amber-300">
                  <p className="font-medium">Private App Required</p>
                  <p className="mt-1">
                    Create a private app in your Shopify admin with these permissions:
                    read_products, write_products, read_orders, read_inventory
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Admin API Access Token
              </label>
              <input
                type="password"
                value={shopifyKey}
                onChange={(e) => setShopifyKey(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="shpat_..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                API Secret Key
              </label>
              <input
                type="password"
                value={shopifySecret}
                onChange={(e) => setShopifySecret(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="..."
              />
            </div>

            <button
              onClick={() => saveCredentials('shopify', { apiKey: shopifyKey, apiSecret: shopifySecret })}
              disabled={saving || !shopifyKey}
              className="w-full py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              {saving ? 'Saving...' : 'Save Shopify Credentials'}
            </button>
          </div>
        )}

        {/* Meta Ads Tab */}
        {activeTab === 'meta' && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="text-sm text-blue-800 dark:text-blue-300">
                  <p className="font-medium">Meta Business Account</p>
                  <p className="mt-1">
                    Generate an access token from Meta Business Settings with ads_management permission.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Access Token
              </label>
              <input
                type="password"
                value={metaToken}
                onChange={(e) => setMetaToken(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="EAA..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ad Account ID
              </label>
              <input
                type="text"
                value={metaAdAccount}
                onChange={(e) => setMetaAdAccount(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="act_123456789"
              />
            </div>

            <button
              onClick={() => saveCredentials('meta_ads', { accessToken: metaToken, adAccountId: metaAdAccount })}
              disabled={saving || !metaToken}
              className="w-full py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              {saving ? 'Saving...' : 'Save Meta Ads Credentials'}
            </button>
          </div>
        )}

        {/* AutoDS Tab */}
        {activeTab === 'autods' && (
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                <div className="text-sm text-purple-800 dark:text-purple-300">
                  <p className="font-medium">AutoDS API Access</p>
                  <p className="mt-1">
                    Get your API key from AutoDS Settings &gt; API &gt; Generate API Key.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                API Key
              </label>
              <input
                type="password"
                value={autodsKey}
                onChange={(e) => setAutodsKey(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="..."
              />
            </div>

            <button
              onClick={() => saveCredentials('autods', { apiKey: autodsKey })}
              disabled={saving || !autodsKey}
              className="w-full py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              {saving ? 'Saving...' : 'Save AutoDS Credentials'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}