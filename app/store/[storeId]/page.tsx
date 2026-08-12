'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  Store, 
  Check, 
  AlertCircle, 
  ExternalLink,
  Key,
  Github,
  Cloud,
  Sparkles,
  Loader2,
  X
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'connected' | 'not_connected' | 'required';
  color: string;
}

interface Credentials {
  type: string;
  hasCredentials: boolean;
}

interface Store {
  id: string;
  name: string;
  url: string;
  status: string;
}

export default function StoreOverviewPage() {
  const params = useParams();
  const storeId = params.storeId as string;
  const [store, setStore] = useState<Store | null>(null);
  const [credentials, setCredentials] = useState<Credentials[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Form states
  const [shopifyKey, setShopifyKey] = useState('');
  const [shopifySecret, setShopifySecret] = useState('');
  const [metaToken, setMetaToken] = useState('');
  const [metaAdAccount, setMetaAdAccount] = useState('');
  const [autodsKey, setAutodsKey] = useState('');
  const [aiProviderKey, setAiProviderKey] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [vercelToken, setVercelToken] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchStoreAndCredentials();
  }, [storeId]);

  const fetchStoreAndCredentials = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch store details
      const storeResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/stores/${storeId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (storeResponse.ok) {
        const storeData = await storeResponse.json();
        setStore(storeData);
      }

      // Fetch credentials
      const credsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/stores/${storeId}/credentials`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (credsResponse.ok) {
        const credsData = await credsResponse.json();
        setCredentials(credsData);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasCreds = (type: string) => credentials.some(c => c.type === type);

  const integrations: Integration[] = [
    {
      id: 'shopify',
      name: 'Shopify',
      description: 'Connect your Shopify store to sync products and orders',
      icon: <Store className="w-6 h-6" />,
      status: hasCreds('shopify') ? 'connected' : 'required',
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 'meta_ads',
      name: 'Meta Ads',
      description: 'Connect Meta Ads for campaign management and analytics',
      icon: <Sparkles className="w-6 h-6" />,
      status: hasCreds('meta_ads') ? 'connected' : 'not_connected',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'autods',
      name: 'AutoDS',
      description: 'Connect AutoDS for dropshipping automation',
      icon: <Cloud className="w-6 h-6" />,
      status: hasCreds('autods') ? 'connected' : 'not_connected',
      color: 'from-purple-500 to-violet-500',
    },
    {
      id: 'ai_provider',
      name: 'AI Provider',
      description: 'Connect your AI provider API (OpenAI, Anthropic, etc.)',
      icon: <Sparkles className="w-6 h-6" />,
      status: hasCreds('ai_provider') ? 'connected' : 'required',
      color: 'from-pink-500 to-rose-500',
    },
    {
      id: 'github',
      name: 'GitHub',
      description: 'Connect GitHub for code deployment tracking',
      icon: <Github className="w-6 h-6" />,
      status: hasCreds('github') ? 'connected' : 'connected',
      color: 'from-gray-700 to-gray-900',
    },
    {
      id: 'vercel',
      name: 'Vercel',
      description: 'Connect Vercel for deployment management',
      icon: <Cloud className="w-6 h-6" />,
      status: hasCreds('vercel') ? 'connected' : 'connected',
      color: 'from-black to-gray-800',
    },
  ];

  const connectedCount = integrations.filter(i => i.status === 'connected').length;
  const requiredCount = integrations.filter(i => i.status === 'required').length;
  const progress = (connectedCount / integrations.length) * 100;

  const saveCredentials = async (type: string, creds: any) => {
    setSaving(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/stores/${storeId}/credentials`,
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
      setActiveModal(null);
      fetchStoreAndCredentials();
    } catch (error) {
      setMessage('Failed to save credentials');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Overview</h1>
          <p className="text-gray-400">
            Manage integrations for {store?.name}
          </p>
        </header>

        {/* Progress Bar */}
        <div className="mb-8 bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Integration Progress</h2>
              <p className="text-sm text-gray-400">
                {connectedCount} of {integrations.length} integrations connected
                {requiredCount > 0 && ` (${requiredCount} required)`}
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-violet-400">{Math.round(progress)}%</span>
            </div>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Integration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.map((integration) => (
            <div
              key={integration.id}
              className="bg-gray-900 rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${integration.color} text-white`}>
                  {integration.icon}
                </div>
                <div className="flex items-center gap-2">
                  {integration.status === 'required' && (
                    <span className="px-2 py-1 text-xs font-medium bg-amber-500/20 text-amber-400 rounded-full">
                      Required
                    </span>
                  )}
                  {integration.status === 'connected' && (
                    <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full">
                      <Check className="w-3 h-3" />
                      Connected
                    </span>
                  )}
                  {integration.status === 'not_connected' && (
                    <span className="px-2 py-1 text-xs font-medium bg-gray-700 text-gray-400 rounded-full">
                      Not Connected
                    </span>
                  )}
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-1">{integration.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{integration.description}</p>
              
              {integration.status === 'not_connected' || integration.status === 'required' ? (
                <button
                  onClick={() => setActiveModal(integration.id)}
                  className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  Connect
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveModal(integration.id)}
                    className="flex-1 py-2 px-4 bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 rounded-lg transition-colors"
                  >
                    Manage
                  </button>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Integration Modals */}
      {activeModal === 'shopify' && (
        <IntegrationModal
          title="Connect Shopify"
          description="Enter your Shopify API credentials"
          onClose={() => setActiveModal(null)}
        >
          <div className="space-y-4">
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5" />
                <div className="text-sm text-amber-300">
                  <p className="font-medium">Private App Required</p>
                  <p className="mt-1">
                    Create a private app in your Shopify admin with these permissions:
                    read_products, write_products, read_orders, read_inventory
                  </p>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Admin API Access Token
              </label>
              <input
                type="password"
                value={shopifyKey}
                onChange={(e) => setShopifyKey(e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="shpat_..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                API Secret Key
              </label>
              <input
                type="password"
                value={shopifySecret}
                onChange={(e) => setShopifySecret(e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="..."
              />
            </div>
            <button
              onClick={() => saveCredentials('shopify', { apiKey: shopifyKey, apiSecret: shopifySecret })}
              disabled={saving || !shopifyKey}
              className="w-full py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              {saving ? 'Saving...' : 'Save Credentials'}
            </button>
          </div>
        </IntegrationModal>
      )}

      {activeModal === 'meta_ads' && (
        <IntegrationModal
          title="Connect Meta Ads"
          description="Enter your Meta Ads API credentials"
          onClose={() => setActiveModal(null)}
        >
          <div className="space-y-4">
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                <div className="text-sm text-blue-300">
                  <p className="font-medium">Meta Business Account</p>
                  <p className="mt-1">
                    Generate an access token from Meta Business Settings with ads_management permission.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Access Token
              </label>
              <input
                type="password"
                value={metaToken}
                onChange={(e) => setMetaToken(e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="EAA..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Ad Account ID
              </label>
              <input
                type="text"
                value={metaAdAccount}
                onChange={(e) => setMetaAdAccount(e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="act_123456789"
              />
            </div>
            <button
              onClick={() => saveCredentials('meta_ads', { accessToken: metaToken, adAccountId: metaAdAccount })}
              disabled={saving || !metaToken}
              className="w-full py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              {saving ? 'Saving...' : 'Save Credentials'}
            </button>
          </div>
        </IntegrationModal>
      )}

      {activeModal === 'autods' && (
        <IntegrationModal
          title="Connect AutoDS"
          description="Enter your AutoDS API key"
          onClose={() => setActiveModal(null)}
        >
          <div className="space-y-4">
            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-purple-400 mt-0.5" />
                <div className="text-sm text-purple-300">
                  <p className="font-medium">AutoDS API Access</p>
                  <p className="mt-1">
                    Get your API key from AutoDS Settings &gt; API &gt; Generate API Key.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                API Key
              </label>
              <input
                type="password"
                value={autodsKey}
                onChange={(e) => setAutodsKey(e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="..."
              />
            </div>
            <button
              onClick={() => saveCredentials('autods', { apiKey: autodsKey })}
              disabled={saving || !autodsKey}
              className="w-full py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              {saving ? 'Saving...' : 'Save Credentials'}
            </button>
          </div>
        </IntegrationModal>
      )}

      {activeModal === 'ai_provider' && (
        <IntegrationModal
          title="Connect AI Provider"
          description="Enter your AI provider API key"
          onClose={() => setActiveModal(null)}
        >
          <div className="space-y-4">
            <div className="p-4 bg-pink-500/10 border border-pink-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-pink-400 mt-0.5" />
                <div className="text-sm text-pink-300">
                  <p className="font-medium">OpenAI or Anthropic</p>
                  <p className="mt-1">
                    We support OpenAI (GPT-4) and Anthropic (Claude) APIs.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                API Key
              </label>
              <input
                type="password"
                value={aiProviderKey}
                onChange={(e) => setAiProviderKey(e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="sk-..."
              />
            </div>
            <button
              onClick={() => saveCredentials('ai_provider', { apiKey: aiProviderKey })}
              disabled={saving || !aiProviderKey}
              className="w-full py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              {saving ? 'Saving...' : 'Save Credentials'}
            </button>
          </div>
        </IntegrationModal>
      )}

      {message && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg text-sm ${
          message.includes('success') 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}

// Integration Modal Component
function IntegrationModal({ 
  title, 
  description, 
  children, 
  onClose 
}: { 
  title: string; 
  description: string; 
  children: React.ReactNode; 
  onClose: () => void; 
}) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md bg-gray-900 rounded-xl border border-gray-800 p-6 max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            <p className="text-sm text-gray-400">{description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
