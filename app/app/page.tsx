'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { vps } from '@/lib/vps-api'
import {
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Store,
} from 'lucide-react'

interface DashboardStats {
  revenue: number
  orders: number
  products: number
  conversion: number
}

interface Activity {
  id: string
  type: 'order' | 'product' | 'ad' | 'system'
  message: string
  time: string
  status: 'success' | 'pending' | 'error'
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    revenue: 0,
    orders: 0,
    products: 0,
    conversion: 0,
  })
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [vpsConnected, setVpsConnected] = useState(false)

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    try {
      // Check VPS connection
      try {
        await vps.health()
        setVpsConnected(true)
      } catch {
        setVpsConnected(false)
      }

      // Load stats from Supabase
      const { data: orders } = await supabase.from('orders').select('total').eq('status', 'completed')
      const { data: products } = await supabase.from('products').select('id')
      const { data: allOrders } = await supabase.from('orders').select('id')

      const revenue = orders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0

      setStats({
        revenue,
        orders: allOrders?.length || 0,
        products: products?.length || 0,
        conversion: revenue > 0 ? Math.round((orders?.length || 0) / (allOrders?.length || 1) * 100) : 0,
      })

      // Load recent activity
      const { data: activityData } = await supabase
        .from('activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      setActivities(
        activityData?.map((a) => ({
          id: a.id,
          type: a.type,
          message: a.message,
          time: new Date(a.created_at).toLocaleTimeString(),
          status: a.status,
        })) || []
      )
    } catch (error) {
      console.error('Dashboard load error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">Overview of your dropshipping business</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${vpsConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-slate-400">
            VPS {vpsConnected ? 'Connected' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Revenue"
          value={`$${stats.revenue.toLocaleString()}`}
          change="+12%"
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Orders"
          value={stats.orders.toString()}
          change="+8%"
          icon={ShoppingCart}
          color="blue"
        />
        <StatCard
          title="Products"
          value={stats.products.toString()}
          change="Active"
          icon={Package}
          color="violet"
        />
        <StatCard
          title="Conversion"
          value={`${stats.conversion}%`}
          change="+2.1%"
          icon={TrendingUp}
          color="orange"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-2 bg-[#111118] border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <QuickAction icon={Package} label="Add Product" href="/app/products/new" />
            <QuickAction icon={Megaphone} label="Create Ad" href="/app/ads/new" />
            <QuickAction icon={Zap} label="Run Agent" href="/app/ai-agent" />
            <QuickAction icon={Store} label="New Store" href="/app/stores/new" />
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="bg-[#111118] border-white/10">
          <CardHeader>
            <CardTitle className="text-white">System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <StatusItem name="Supabase" status="connected" />
            <StatusItem name="VPS API" status={vpsConnected ? 'connected' : 'disconnected'} />
            <StatusItem name="Shopify" status="pending" />
            <StatusItem name="Meta Ads" status="pending" />
            <StatusItem name="AutoDS" status="pending" />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-[#111118] border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-slate-400 text-center py-8">Loading...</div>
          ) : activities.length === 0 ? (
            <div className="text-slate-400 text-center py-8">
              No activity yet. Start by adding a product or creating a project.
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/5"
                >
                  {activity.status === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  ) : activity.status === 'error' ? (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  ) : (
                    <Clock className="w-5 h-5 text-yellow-400" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-white">{activity.message}</p>
                    <p className="text-xs text-slate-500">{activity.time}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs capitalize border-white/10 text-slate-400"
                  >
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  color,
}: {
  title: string
  value: string
  change: string
  icon: any
  color: string
}) {
  const colors: Record<string, string> = {
    green: 'from-green-500/20 to-green-600/10 border-green-500/30 text-green-400',
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400',
    violet: 'from-violet-500/20 to-violet-600/10 border-violet-500/30 text-violet-400',
    orange: 'from-orange-500/20 to-orange-600/10 border-orange-500/30 text-orange-400',
  }

  return (
    <Card className={`bg-gradient-to-br ${colors[color]} border`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <Icon className="w-5 h-5 opacity-70" />
          <span className="text-xs">{change}</span>
        </div>
        <p className="text-2xl font-bold text-white mt-2">{value}</p>
        <p className="text-xs opacity-70">{title}</p>
      </CardContent>
    </Card>
  )
}

function QuickAction({ icon: Icon, label, href }: { icon: any; label: string; href: string }) {
  return (
    <a
      href={href}
      className="flex flex-col items-center gap-2 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
    >
      <Icon className="w-6 h-6 text-violet-400 group-hover:text-violet-300" />
      <span className="text-sm text-slate-300 group-hover:text-white">{label}</span>
    </a>
  )
}

function StatusItem({ name, status }: { name: string; status: 'connected' | 'disconnected' | 'pending' }) {
  const colors = {
    connected: 'bg-green-500',
    disconnected: 'bg-red-500',
    pending: 'bg-yellow-500',
  }

  return (
    <div className="flex items-center justify-between p-2 rounded bg-white/5">
      <span className="text-sm text-white">{name}</span>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${colors[status]}`} />
        <span className="text-xs text-slate-400 capitalize">{status}</span>
      </div>
    </div>
  )
}

// Icons for QuickAction
function Megaphone(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m3 11 18-5v12L3 14v-3z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  )
}

function Zap(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}
