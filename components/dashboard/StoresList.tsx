'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Store, Plus, ExternalLink, ArrowRight, Loader2 } from 'lucide-react';
import { AddStoreModal } from './AddStoreModal';

interface Store {
  id: string;
  name: string;
  url: string;
  status: string;
  worker_id: string | null;
}

interface StoresListProps {
  stores: Store[];
  onStoreAdded: () => void;
  fullWidth?: boolean;
}

export function StoresList({ stores, onStoreAdded, fullWidth }: StoresListProps) {
  const [showAddModal, setShowAddModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'pending':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
      case 'error':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400';
    }
  };

  return (
    <>
      <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 ${fullWidth ? '' : ''}`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Stores</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Manage your Shopify stores and AI workers
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Store
          </button>
        </div>

        {stores.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <Store className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No stores yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Add your first Shopify store to get started</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
            >
              Add Your First Store
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {stores.map((store) => (
              <div
                key={store.id}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center">
                      <Store className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{store.name}</h3>
                      <a
                        href={store.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 flex items-center gap-1"
                      >
                        {store.url}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(store.status)}`}>
                      {store.status}
                    </span>
                    <Link
                      href={`/store/${store.id}`}
                      className="flex items-center gap-1 px-3 py-1.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-lg hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-colors text-sm font-medium"
                    >
                      Manage
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
                
                {store.worker_id && (
                  <div className="mt-4 ml-16 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    AI Worker active
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <AddStoreModal onClose={() => setShowAddModal(false)} onStoreAdded={onStoreAdded} />
      )}


    </>
  );
}