import { Store, Activity, TrendingUp, AlertCircle } from 'lucide-react';

interface DashboardStatsProps {
  stores: any[];
}

export function DashboardStats({ stores }: DashboardStatsProps) {
  const activeWorkers = stores.filter(s => s.worker_id && s.status === 'active').length;
  const pendingStores = stores.filter(s => s.status === 'pending').length;

  const stats = [
    {
      label: 'Total Stores',
      value: stores.length,
      icon: Store,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      label: 'Active Workers',
      value: activeWorkers,
      icon: Activity,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      label: 'Products Managed',
      value: '0',
      icon: TrendingUp,
      color: 'text-violet-600 dark:text-violet-400',
      bgColor: 'bg-violet-100 dark:bg-violet-900/30',
    },
    {
      label: 'Pending Setup',
      value: pendingStores,
      icon: AlertCircle,
      color: pendingStores > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-600 dark:text-gray-400',
      bgColor: pendingStores > 0 ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-gray-100 dark:bg-gray-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}