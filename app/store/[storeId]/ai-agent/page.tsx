'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Play,
  Settings,
  Store,
  Link,
  Key,
  CheckCircle2,
  XCircle,
  Server,
  Activity,
  Zap,
  ChevronRight,
  RefreshCw,
  Power,
  Globe,
  Shield
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface StoreConfig {
  shopifyUrl: string;
  shopifyToken: string;
  cjApiKey: string;
  metaToken: string;
  isConfigured: boolean;
}

interface GatewayStatus {
  id: string;
  status: 'connected' | 'connecting' | 'disconnected';
  ip: string;
  uptime: string;
  cpu: number;
  memory: number;
  lastPing: string;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'idle' | 'running' | 'completed';
  icon: React.ReactNode;
}

export default function AIAgentPage() {
  const params = useParams();
  const storeId = params.storeId as string;
  const [activeTab, setActiveTab] = useState<'chat' | 'config'>('chat');
  const [showConfig, setShowConfig] = useState(false);
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I'm your AI Agent. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Store config state
  const [storeConfig, setStoreConfig] = useState<StoreConfig>({
    shopifyUrl: '',
    shopifyToken: '',
    cjApiKey: '',
    metaToken: '',
    isConfigured: false,
  });

  // Gateway state
  const [gateway, setGateway] = useState<GatewayStatus>({
    id: 'worker-503a5a2c',
    status: 'connected',
    ip: '167.233.240.82',
    uptime: '2h 15m',
    cpu: 12,
    memory: 45,
    lastPing: 'Just now',
  });

  // Workflows
  const workflows: Workflow[] = [
    { id: 'research', name: 'Product Research', description: 'AI finds trending products', status: 'idle', icon: <Zap className="w-4 h-4" /> },
    { id: 'sync', name: 'Catalog Sync', description: 'Sync with Shopify', status: 'completed', icon: <RefreshCw className="w-4 h-4" /> },
    { id: 'price', name: 'Price Optimize', description: 'AI pricing adjustments', status: 'idle', icon: <Activity className="w-4 h-4" /> },
    { id: 'ads', name: 'Meta Ads Sync', description: 'Sync ad campaigns', status: 'idle', icon: <Globe className="w-4 h-4" /> },
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I understand! Let me help you with that. What specific task would you like me to run?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const runWorkflow = (workflowId: string) => {
    console.log('Running workflow:', workflowId);
  };

  const saveStoreConfig = () => {
    setStoreConfig(prev => ({ ...prev, isConfigured: true }));
    setShowConfig(false);
  };

  return (
    <div className="p-6 h-[calc(100vh-64px)] bg-gray-950">
      <div className="max-w-7xl mx-auto h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">AI Agent Gateway</h1>
            <p className="text-gray-400 text-sm">Manage your store automation and AI workflows</p>
          </div>
          <div className="flex items-center gap-3">
            {!storeConfig.isConfigured && (
              <button
                onClick={() => setShowConfig(true)}
                className="px-4 py-2 bg-amber-500/20 text-amber-400 rounded-lg flex items-center gap-2 hover:bg-amber-500/30 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Configure Store
              </button>
            )}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-green-400 text-sm font-medium">Gateway Online</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 h-[calc(100%-80px)]">
          
          {/* LEFT: Compact Chat (3 cols) */}
          <div className="col-span-3 flex flex-col gap-4">
            {/* Chat Card */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 flex flex-col flex-1 min-h-0">
              <div className="p-3 border-b border-gray-800 flex items-center gap-2">
                <Bot className="w-4 h-4 text-violet-400" />
                <span className="text-sm font-medium text-white">AI Chat</span>
                <span className="text-xs text-gray-500 ml-auto">{messages.length} msgs</span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.slice(-6).map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user' ? 'bg-violet-500' : 'bg-violet-500/20'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="w-3 h-3 text-white" />
                      ) : (
                        <Bot className="w-3 h-3 text-violet-400" />
                      )}
                    </div>
                    <div className={`max-w-[85%] p-2 rounded text-xs ${
                      message.role === 'user' ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-300'
                    }`}>
                      {message.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded bg-violet-500/20 flex items-center justify-center">
                      <Bot className="w-3 h-3 text-violet-400" />
                    </div>
                    <div className="bg-gray-800 p-2 rounded">
                      <Loader2 className="w-3 h-3 animate-spin text-gray-400" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-3 border-t border-gray-800">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask AI..."
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="px-3 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-3">
              <h3 className="text-xs font-medium text-gray-400 uppercase mb-2">Quick Actions</h3>
              <div className="space-y-1">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Find Products
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-blue-400" />
                  Sync Catalog
                </button>
              </div>
            </div>
          </div>

          {/* CENTER: Prominent Gateway (6 cols) */}
          <div className="col-span-6 flex flex-col gap-4">
            {/* Main Gateway Card */}
            <div className="bg-gradient-to-br from-violet-900/50 to-purple-900/50 rounded-xl border border-violet-500/30 p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/25">
                    <Server className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">OpenClaw Gateway</h2>
                    <p className="text-violet-200 text-sm">Worker ID: {gateway.id}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                      <span className="text-green-400 text-sm">Connected & Ready</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{gateway.cpu}%</div>
                  <div className="text-xs text-violet-200">CPU Usage</div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-black/20 rounded-lg p-3">
                  <div className="text-xs text-violet-200 mb-1">IP Address</div>
                  <div className="text-sm font-mono text-white">{gateway.ip}</div>
                </div>
                <div className="bg-black/20 rounded-lg p-3">
                  <div className="text-xs text-violet-200 mb-1">Uptime</div>
                  <div className="text-sm text-white">{gateway.uptime}</div>
                </div>
                <div className="bg-black/20 rounded-lg p-3">
                  <div className="text-xs text-violet-200 mb-1">Memory</div>
                  <div className="text-sm text-white">{gateway.memory}%</div>
                </div>
                <div className="bg-black/20 rounded-lg p-3">
                  <div className="text-xs text-violet-200 mb-1">Last Ping</div>
                  <div className="text-sm text-white">{gateway.lastPing}</div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                  <RefreshCw className="w-4 h-4" />
                  Restart Gateway
                </button>
                <button className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                  <Activity className="w-4 h-4" />
                  View Logs
                </button>
              </div>
            </div>

            {/* Connection Status */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
              <h3 className="text-sm font-medium text-gray-300 mb-3">Connection Status</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-300">WebSocket connected to Render</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-300">VPS tunnel established</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-300">OpenClaw Gateway responding</span>
                </div>
                <div className="flex items-center gap-3">
                  {storeConfig.isConfigured ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-gray-300">Store credentials configured</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-amber-500" />
                      <span className="text-sm text-amber-400">Store credentials needed</span>
                      <button 
                        onClick={() => setShowConfig(true)}
                        className="text-xs text-violet-400 hover:text-violet-300 ml-auto"
                      >
                        Configure →
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Activity Log */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 flex-1">
              <h3 className="text-sm font-medium text-gray-300 mb-3">Gateway Activity</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3 text-gray-400">
                  <span className="text-xs text-gray-600">12:45 PM</span>
                  <span className="text-green-400">●</span>
                  <span>Gateway connected successfully</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <span className="text-xs text-gray-600">12:30 PM</span>
                  <span className="text-blue-400">●</span>
                  <span>Catalog sync completed - 42 products</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <span className="text-xs text-gray-600">11:15 AM</span>
                  <span className="text-purple-400">●</span>
                  <span>AI product research initiated</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Workflow Panel (3 cols) - Compact */}
          <div className="col-span-3 flex flex-col gap-4">
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-300">Workflows</h3>
                <span className="text-xs text-gray-500">{workflows.filter(w => w.status === 'idle').length} ready</span>
              </div>
              <div className="space-y-2">
                {workflows.map((workflow) => (
                  <div
                    key={workflow.id}
                    className="group p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        workflow.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        workflow.status === 'running' ? 'bg-amber-500/20 text-amber-400 animate-pulse' :
                        'bg-gray-700 text-gray-400'
                      }`}>
                        {workflow.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-white truncate">{workflow.name}</h4>
                        <p className="text-xs text-gray-500 truncate">{workflow.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => runWorkflow(workflow.id)}
                      disabled={workflow.status === 'running'}
                      className="w-full mt-2 py-1.5 bg-gray-700 hover:bg-violet-600 disabled:opacity-50 text-white text-xs rounded transition-colors flex items-center justify-center gap-1"
                    >
                      {workflow.status === 'running' ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Running...
                        </>
                      ) : workflow.status === 'completed' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          Run Again
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3" />
                          Run
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Store Info Card */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Store className="w-4 h-4 text-gray-400" />
                <h3 className="text-sm font-medium text-gray-300">Store Status</h3>
              </div>
              {storeConfig.isConfigured ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-gray-300">Shopify Connected</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-gray-300">CJ Dropshipping</span>
                  </div>
                  <button 
                    onClick={() => setShowConfig(true)}
                    className="w-full mt-2 py-2 text-xs text-gray-400 hover:text-white border border-gray-700 rounded-lg hover:border-gray-600 transition-colors"
                  >
                    Edit Configuration
                  </button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500 mb-3">Store not configured</p>
                  <button
                    onClick={() => setShowConfig(true)}
                    className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm rounded-lg transition-colors"
                  >
                    Configure Store
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Store Configuration Modal */}
      {showConfig && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Configure Store</h2>
              <button 
                onClick={() => setShowConfig(false)}
                className="text-gray-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <span className="flex items-center gap-2">
                    <Store className="w-4 h-4" />
                    Shopify Store URL
                  </span>
                </label>
                <input
                  type="text"
                  value={storeConfig.shopifyUrl}
                  onChange={(e) => setStoreConfig(prev => ({ ...prev, shopifyUrl: e.target.value }))}
                  placeholder="yourstore.myshopify.com"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <span className="flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    Shopify Access Token
                  </span>
                </label>
                <input
                  type="password"
                  value={storeConfig.shopifyToken}
                  onChange={(e) => setStoreConfig(prev => ({ ...prev, shopifyToken: e.target.value }))}
                  placeholder="shpat_xxxxxxxxxxxx"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <span className="flex items-center gap-2">
                    <Link className="w-4 h-4" />
                    CJ Dropshipping API Key
                  </span>
                </label>
                <input
                  type="password"
                  value={storeConfig.cjApiKey}
                  onChange={(e) => setStoreConfig(prev => ({ ...prev, cjApiKey: e.target.value }))}
                  placeholder="CJ API Key"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Meta Ads Access Token
                  </span>
                </label>
                <input
                  type="password"
                  value={storeConfig.metaToken}
                  onChange={(e) => setStoreConfig(prev => ({ ...prev, metaToken: e.target.value }))}
                  placeholder="Meta Access Token"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => setShowConfig(false)}
                  className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveStoreConfig}
                  className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Save Configuration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
