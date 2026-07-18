'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { Plus, Search, Package } from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  inventory: number
  status: string
  images: string[]
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    setProducts(data || [])
    setLoading(false)
  }

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Products</h1>
          <p className="text-slate-400 mt-1">Manage your dropshipping products</p>
        </div>
        <Button className="bg-gradient-to-r from-violet-600 to-pink-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-white/5 border-white/10 text-white"
        />
      </div>

      {loading ? (
        <div className="text-slate-400 text-center py-12">Loading products...</div>
      ) : filteredProducts.length === 0 ? (
        <Card className="bg-[#111118] border-white/10">
          <CardContent className="py-12 text-center">
            <Package className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No products yet. Add your first product to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="bg-[#111118] border-white/10 overflow-hidden group hover:border-violet-500/30 transition-colors">
      <div className="aspect-video bg-slate-800 relative">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-600">
            <Package className="w-8 h-8" />
          </div>
        )}
        <Badge
          className={`absolute top-2 right-2 ${
            product.status === 'active'
              ? 'bg-green-500/20 text-green-400'
              : 'bg-yellow-500/20 text-yellow-400'
          }`}
        >
          {product.status}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="text-white font-medium truncate">{product.name}</h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-violet-400 font-semibold">${product.price}</span>
          <span className="text-sm text-slate-400">{product.inventory} in stock</span>
        </div>
      </CardContent>
    </Card>
  )
}
