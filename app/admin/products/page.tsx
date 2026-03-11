'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Package
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { products, categories, formatPrice } from '@/lib/data'
import type { ProductStatus } from '@/lib/types'

const statusStyles: Record<ProductStatus, { label: string; className: string }> = {
  IN_STOCK: { label: 'In Stock', className: 'bg-volt-teal/20 text-volt-teal' },
  OUT_OF_STOCK: { label: 'Out of Stock', className: 'bg-volt-orange/20 text-volt-orange' },
  PRE_ORDER: { label: 'Pre-Order', className: 'bg-volt-orange/20 text-volt-orange' },
  COMING_SOON: { label: 'Coming Soon', className: 'bg-volt/20 text-volt' },
  ARCHIVED: { label: 'Archived', className: 'bg-volt-muted/20 text-volt-muted' },
}

export default function AdminProductsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
                         product.sku.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || product.categoryId === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  return (
    <div className="min-h-screen bg-volt-black">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-volt-black/90 backdrop-blur-md border-b border-border">
        <div className="px-4 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-volt-muted hover:text-volt-white" asChild>
              <Link href="/admin">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="font-display text-2xl text-volt-white tracking-wide">PRODUCTS</h1>
              <p className="text-sm text-volt-muted">{products.length} total products</p>
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 lg:p-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-volt-muted" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-volt-panel border-border text-volt-white placeholder:text-volt-muted"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px] bg-volt-panel border-border text-volt-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-volt-panel border-border">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="IN_STOCK">In Stock</SelectItem>
                <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                <SelectItem value="PRE_ORDER">Pre-Order</SelectItem>
                <SelectItem value="COMING_SOON">Coming Soon</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px] bg-volt-panel border-border text-volt-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-volt-panel border-border">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="bg-volt text-volt-black hover:bg-volt/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-volt-panel rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-volt-deep">
                  <th className="text-left py-3 px-4 text-sm font-medium text-volt-muted">Product</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-volt-muted">SKU</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-volt-muted">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-volt-muted">Stock</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-volt-muted">Retail</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-volt-muted">Wholesale</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const status = statusStyles[product.status]
                  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0]
                  const category = categories.find(c => c.id === product.categoryId)
                  const isLowStock = product.trackInventory && product.stock > 0 && product.stock <= product.lowStockAlert

                  return (
                    <tr key={product.id} className="border-b border-border last:border-0 hover:bg-volt-deep/50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 bg-volt-deep rounded-md overflow-hidden flex-shrink-0">
                            {primaryImage ? (
                              <Image
                                src={primaryImage.url}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <Package className="h-6 w-6 m-3 text-volt-muted" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-volt-white line-clamp-1">{product.name}</p>
                            <p className="text-xs text-volt-muted">{category?.name || 'Uncategorized'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-mono text-sm text-volt-muted">{product.sku}</span>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={status.className}>{status.label}</Badge>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`text-sm ${isLowStock ? 'text-volt-orange' : 'text-volt-white'}`}>
                          {product.stock}
                        </span>
                        {isLowStock && (
                          <span className="text-xs text-volt-orange ml-2">(Low)</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="font-mono text-sm text-volt-white">{formatPrice(product.priceRetail)}</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="font-mono text-sm text-volt-muted">
                          {product.priceWholesale ? formatPrice(product.priceWholesale) : '-'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-volt-muted hover:text-volt-white">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-volt-panel border-border">
                            <DropdownMenuItem className="text-volt-white hover:bg-volt-deep cursor-pointer" asChild>
                              <Link href={`/products/${product.slug}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-volt-white hover:bg-volt-deep cursor-pointer">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-border" />
                            <DropdownMenuItem className="text-volt-orange hover:bg-volt-deep cursor-pointer">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-volt-muted mb-4" />
              <p className="text-volt-muted">No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
