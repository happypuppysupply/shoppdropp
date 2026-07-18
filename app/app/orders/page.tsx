'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart } from 'lucide-react'

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Orders</h1>
        <p className="text-slate-400 mt-1">Track and manage customer orders</p>
      </div>

      <Card className="bg-[#111118] border-white/10">
        <CardContent className="py-12 text-center">
          <ShoppingCart className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No orders yet. Orders will appear here when customers make purchases.</p>
        </CardContent>
      </Card>
    </div>
  )
}
