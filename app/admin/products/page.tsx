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
import { Textarea } from '@/components/ui/textarea'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { categories, formatPrice } from '@/lib/data'
import type { Product, ProductStatus } from '@/lib/types'
import { useRuntimeProducts } from '@/lib/runtime-products'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'

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

  const { products: runtimeProducts, upsertRuntimeProduct, deleteRuntimeProduct } = useRuntimeProducts()
  const [editorOpen, setEditorOpen] = useState(false)
  const [editorMode, setEditorMode] = useState<'add' | 'edit'>('add')
  const [editingId, setEditingId] = useState<string | null>(null)

  const [draft, setDraft] = useState({
    sku: '',
    name: '',
    slug: '',
    description: '',
    shortDesc: '',
    categoryId: categories[0]?.id ?? '',
    status: 'IN_STOCK' as ProductStatus,
    priceRetail: '0',
    priceWholesale: '',
    compareAt: '',
    stock: '0',
    lowStockAlert: '5',
    imageUrl: '/placeholder.jpg',
  })

  const filteredProducts = runtimeProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
                         product.sku.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || product.categoryId === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const slugify = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

  const handleSave = () => {
    const now = new Date()
    const id = editorMode === 'edit' && editingId ? editingId : `admin-${Date.now()}`

    const finalSlug = draft.slug?.trim() || slugify(draft.name) || `item-${Date.now()}`
    const imageUrl = draft.imageUrl?.trim() || '/placeholder.jpg'

    const priceRetail = Number(draft.priceRetail)
    const stock = Number(draft.stock)
    const lowStockAlert = Number(draft.lowStockAlert)

    const existing = editorMode === 'edit' ? runtimeProducts.find(p => p.id === id) : undefined

    const nextProduct = {
      ...(existing ?? {}),
      id,
      sku: draft.sku.trim(),
      name: draft.name.trim(),
      slug: finalSlug,
      description: draft.description.trim(),
      shortDesc: draft.shortDesc.trim() || undefined,
      status: draft.status,
      categoryId: draft.categoryId || undefined,
      priceRetail: Number.isFinite(priceRetail) ? priceRetail : 0,
      priceWholesale: draft.priceWholesale.trim() ? Number(draft.priceWholesale) : undefined,
      compareAt: draft.compareAt.trim() ? Number(draft.compareAt) : undefined,
      stock: Number.isFinite(stock) ? stock : 0,
      lowStockAlert: Number.isFinite(lowStockAlert) ? lowStockAlert : 5,
      trackInventory: true,
      images: [
        {
          id: existing?.images.find(i => i.isPrimary)?.id ?? `img-${Date.now()}`,
          url: imageUrl,
          altText: draft.name.trim(),
          sortOrder: 1,
          isPrimary: true,
        },
      ],
      specs: existing?.specs ?? [],
      isFeatured: existing?.isFeatured ?? false,
      sortOrder: existing?.sortOrder ?? 999,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      weightKg: existing?.weightKg,
    }

    if (!nextProduct.name) {
      toast.error('Title is required')
      return
    }
    if (!nextProduct.sku) {
      toast.error('SKU is required')
      return
    }
    upsertRuntimeProduct(nextProduct as Product)
    setEditorOpen(false)
    setEditingId(null)
    toast.success(editorMode === 'add' ? 'Product added' : 'Product updated')
  }

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
              <p className="text-sm text-volt-muted">{runtimeProducts.length} total products</p>
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
            <Button
              className="bg-volt text-volt-black hover:bg-volt/90"
              onClick={() => {
                setEditorMode('add')
                setEditingId(null)
                setDraft({
                  sku: '',
                  name: '',
                  slug: '',
                  description: '',
                  shortDesc: '',
                  categoryId: categories[0]?.id ?? '',
                  status: 'IN_STOCK',
                  priceRetail: '0',
                  priceWholesale: '',
                  compareAt: '',
                  stock: '0',
                  lowStockAlert: '5',
                  imageUrl: '/placeholder.jpg',
                })
                setEditorOpen(true)
              }}
            >
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
                            <DropdownMenuItem
                              className="text-volt-white hover:bg-volt-deep cursor-pointer"
                              onClick={() => {
                                const primaryImage =
                                  product.images.find(img => img.isPrimary) || product.images[0]
                                setEditorMode('edit')
                                setEditingId(product.id)
                                setDraft({
                                  sku: product.sku ?? '',
                                  name: product.name ?? '',
                                  slug: product.slug ?? '',
                                  description: product.description ?? '',
                                  shortDesc: product.shortDesc ?? '',
                                  categoryId: product.categoryId ?? categories[0]?.id ?? '',
                                  status: product.status,
                                  priceRetail: String(product.priceRetail ?? 0),
                                  priceWholesale: product.priceWholesale != null ? String(product.priceWholesale) : '',
                                  compareAt: product.compareAt != null ? String(product.compareAt) : '',
                                  stock: String(product.stock ?? 0),
                                  lowStockAlert: String(product.lowStockAlert ?? 5),
                                  imageUrl: primaryImage?.url ?? '/placeholder.jpg',
                                })
                                setEditorOpen(true)
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-border" />
                            <DropdownMenuItem className="text-volt-orange hover:bg-volt-deep cursor-pointer" onClick={() => deleteRuntimeProduct(product.id)}>
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

        <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
          <DialogContent className="bg-volt-deep border-border">
            <DialogHeader>
              <DialogTitle>{editorMode === 'add' ? 'Add product' : 'Edit product'}</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <p className="text-sm text-volt-muted">Title</p>
                <Input
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  placeholder="e.g. Frame Upgrade Kit"
                  className="bg-volt-panel border-border text-volt-white"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm text-volt-muted">SKU</p>
                <Input
                  value={draft.sku}
                  onChange={(e) => setDraft({ ...draft, sku: e.target.value })}
                  placeholder="e.g. VINXS-FRAME-001"
                  className="bg-volt-panel border-border text-volt-white"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm text-volt-muted">Slug</p>
                <Input
                  value={draft.slug}
                  onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                  placeholder="frame-upgrade-kit"
                  className="bg-volt-panel border-border text-volt-white"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <p className="text-sm text-volt-muted">Short description</p>
                <Input
                  value={draft.shortDesc}
                  onChange={(e) => setDraft({ ...draft, shortDesc: e.target.value })}
                  placeholder="Shown in product cards"
                  className="bg-volt-panel border-border text-volt-white"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <p className="text-sm text-volt-muted">Description</p>
                <Textarea
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                  placeholder="Full description"
                  className="bg-volt-panel border-border text-volt-white min-h-[110px]"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm text-volt-muted">Category</p>
                <Select value={draft.categoryId} onValueChange={(v) => setDraft({ ...draft, categoryId: v })}>
                  <SelectTrigger className="w-full bg-volt-panel border-border text-volt-white">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-volt-panel border-border">
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-volt-muted">Status</p>
                <Select value={draft.status} onValueChange={(v) => setDraft({ ...draft, status: v as ProductStatus })}>
                  <SelectTrigger className="w-full bg-volt-panel border-border text-volt-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-volt-panel border-border">
                    <SelectItem value="IN_STOCK">In Stock</SelectItem>
                    <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                    <SelectItem value="PRE_ORDER">Pre-Order</SelectItem>
                    <SelectItem value="COMING_SOON">Coming Soon</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-volt-muted">Retail price (AUD)</p>
                <Input
                  type="number"
                  value={draft.priceRetail}
                  onChange={(e) => setDraft({ ...draft, priceRetail: e.target.value })}
                  className="bg-volt-panel border-border text-volt-white"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm text-volt-muted">Wholesale price (optional)</p>
                <Input
                  type="number"
                  value={draft.priceWholesale}
                  onChange={(e) => setDraft({ ...draft, priceWholesale: e.target.value })}
                  placeholder="Leave blank if not wholesale"
                  className="bg-volt-panel border-border text-volt-white"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm text-volt-muted">Compare at (optional)</p>
                <Input
                  type="number"
                  value={draft.compareAt}
                  onChange={(e) => setDraft({ ...draft, compareAt: e.target.value })}
                  className="bg-volt-panel border-border text-volt-white"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm text-volt-muted">Stock</p>
                <Input
                  type="number"
                  value={draft.stock}
                  onChange={(e) => setDraft({ ...draft, stock: e.target.value })}
                  className="bg-volt-panel border-border text-volt-white"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm text-volt-muted">Low stock alert</p>
                <Input
                  type="number"
                  value={draft.lowStockAlert}
                  onChange={(e) => setDraft({ ...draft, lowStockAlert: e.target.value })}
                  className="bg-volt-panel border-border text-volt-white"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <p className="text-sm text-volt-muted">Foto (URL)</p>
                <Input
                  value={draft.imageUrl}
                  onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })}
                  placeholder="/equipamentos/....png"
                  className="bg-volt-panel border-border text-volt-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <Button
                variant="outline"
                className="border-border text-volt-white hover:bg-volt-panel"
                onClick={() => setEditorOpen(false)}
              >
                Cancel
              </Button>
              <Button className="bg-volt text-volt-black hover:bg-volt/90" onClick={handleSave}>
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
