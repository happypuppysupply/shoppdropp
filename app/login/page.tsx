'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { getSupabaseClient } from '@/lib/supabase/client';
import { ShoppingBag, Loader2, Chrome, Github } from 'lucide-react';

// Check if Supabase is configured at runtime
const isSupabaseConfigured = typeof window !== 'undefined' && 
  process.env.NEXT_PUBLIC_SUPABASE_URL && 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('payg');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const { login, register } = useAuth();

  useEffect(() => {
    setMounted(true);
    
    // Check for existing Supabase session
    const checkSession = async () => {
      if (!isSupabaseConfigured) return;
      
      try {
        const supabase = getSupabaseClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          localStorage.setItem('token', session.access_token);
          localStorage.setItem('user', JSON.stringify({
            id: session.user.id,
            email: session.user.email,
            plan: 'payg',
            status: 'active'
          }));
          window.location.href = '/dashboard';
        }
      } catch (e) {
        console.error('Supabase session check failed:', e);
      }
    };
    
    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegistering) {
        await register(email, selectedPlan);
      } else {
        await login(email);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = useCallback(async (provider: 'google' | 'github') => {
    if (!isSupabaseConfigured) {
      setError('OAuth not configured');
      return;
    }
    
    setError('');
    setOauthLoading(provider);

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }
      // Redirect happens automatically
    } catch (err: any) {
      setError(err.message || `${provider} login failed`);
      setOauthLoading(null);
    }
  }, []);

  // Don't render OAuth buttons until mounted (to avoid hydration mismatch)
  const showOAuth = mounted && isSupabaseConfigured;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-900 via-purple-900 to-pink-900">
      <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
        <div className="flex items-center justify-center mb-8">
          <div className="p-3 bg-gradient-to-br from-violet-500 to-pink-500 rounded-xl">
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-center text-white mb-2">
          {isRegistering ? 'Create Account' : 'Welcome Back'}
        </h1>
        <p className="text-center text-white/70 mb-8">
          {isRegistering ? 'Start automating your Shopify store' : 'Sign in to your dashboard'}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        {/* OAuth Buttons */}
        {showOAuth && (
          <>
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleOAuthLogin('google')}
                disabled={!!oauthLoading}
                className="w-full py-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {oauthLoading === 'google' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Chrome className="w-5 h-5" />
                )}
                Continue with Google
              </button>
              
              <button
                onClick={() => handleOAuthLogin('github')}
                disabled={!!oauthLoading}
                className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-3 border border-gray-700"
              >
                {oauthLoading === 'github' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Github className="w-5 h-5" />
                )}
                Continue with GitHub
              </button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-violet-900/0 text-white/60">Or continue with email</span>
              </div>
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="you@example.com"
              required
            />
          </div>

          {isRegistering && (
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Select Plan</label>
              <div className="space-y-2">
                <label className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedPlan === 'payg' ? 'border-violet-500 bg-violet-500/20' : 'border-white/20 bg-white/5'
                }`}>
                  <input
                    type="radio"
                    value="payg"
                    checked={selectedPlan === 'payg'}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-white">Pay As You Go</div>
                    <div className="text-sm text-white/60">$0/mo · 1 store · 200 products</div>
                  </div>
                </label>
                
                <label className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedPlan === 'growth' ? 'border-violet-500 bg-violet-500/20' : 'border-white/20 bg-white/5'
                }`}>
                  <input
                    type="radio"
                    value="growth"
                    checked={selectedPlan === 'growth'}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-white">Growth</div>
                    <div className="text-sm text-white/60">$29/mo · 4 stores · 2K products</div>
                  </div>
                </label>
                
                <label className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedPlan === 'agency' ? 'border-violet-500 bg-violet-500/20' : 'border-white/20 bg-white/5'
                }`}>
                  <input
                    type="radio"
                    value="agency"
                    checked={selectedPlan === 'agency'}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-white">Agency</div>
                    <div className="text-sm text-white/60">$199/mo · 100 stores · Unlimited</div>
                  </div>
                </label>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-semibold rounded-lg transition-all disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              isRegistering ? 'Create Account' : 'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-white/70 hover:text-white text-sm"
          >
            {isRegistering ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}
