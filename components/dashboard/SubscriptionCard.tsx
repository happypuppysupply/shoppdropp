'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Check, Crown, Building2, Zap } from 'lucide-react';

interface SubscriptionCardProps {
  plan: string;
  fullWidth?: boolean;
}

export function SubscriptionCard({ plan, fullWidth }: SubscriptionCardProps) {
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      id: 'payg',
      name: 'Pay As You Go',
      price: '$0',
      period: '/month',
      description: 'Perfect for getting started',
      icon: Zap,
      features: [
        '1 store',
        '200 products',
        'CX21 VPS included',
        'Basic AI features',
        'Email support',
      ],
      cta: 'Current Plan',
      current: plan === 'payg',
    },
    {
      id: 'growth',
      name: 'Growth',
      price: '$29',
      period: '/month',
      description: 'For growing businesses',
      icon: Crown,
      features: [
        '4 stores',
        '2,000 products per store',
        'CPX31 VPS included',
        'Advanced AI features',
        'Priority support',
        'Meta Ads automation',
      ],
      cta: plan === 'growth' ? 'Current Plan' : 'Start 14-Day Free Trial',
      current: plan === 'growth',
    },
    {
      id: 'agency',
      name: 'Agency',
      price: '$199',
      period: '/month',
      description: 'For agencies & power users',
      icon: Building2,
      features: [
        '100 stores',
        'Unlimited products',
        'CCX33 VPS per store',
        'Full AI automation',
        'White-label options',
        'Dedicated support',
      ],
      cta: plan === 'agency' ? 'Current Plan' : 'Start 14-Day Free Trial',
      current: plan === 'agency',
    },
  ];

  const handleUpgrade = async (planId: string) => {
    if (planId === 'payg') return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stripe/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan: planId }),
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      }
    } catch (error) {
      console.error('Failed to create checkout:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 ${fullWidth ? '' : ''}`}>
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Subscription
        </h2>
      </div>

      <div className={`p-6 ${fullWidth ? 'grid grid-cols-1 md:grid-cols-3 gap-6' : 'space-y-4'}`}>
        {plans.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.id}
              className={`p-6 rounded-xl border-2 transition-all ${
                p.current
                  ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-700'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${
                  p.current ? 'bg-violet-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{p.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{p.description}</p>
                </div>
              </div>

              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">{p.price}</span>
                <span className="text-gray-500 dark:text-gray-400">{p.period}</span>
              </div>

              <ul className="space-y-2 mb-6">
                {p.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Check className="w-4 h-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleUpgrade(p.id)}
                disabled={loading || p.current}
                className={`w-full py-2 rounded-lg font-medium transition-colors ${
                  p.current
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-default'
                    : 'bg-violet-600 hover:bg-violet-700 text-white'
                }`}
              >
                {loading && !p.current ? 'Loading...' : p.cta}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}