'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { SlidersHorizontal, Grid3X3, LayoutList, X } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CartSidebar } from '@/components/layout/cart-sidebar'
import { ProductCard } from '@/components/product/product-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Checkbox } from '@/components/ui/checkbox'
import { categories } from '@/lib/data'
import { cn } from '@/lib/utils'
import type { ProductStatus } from '@/lib/types'
import { useRuntimeProducts } from '@/lib/runtime-products'

const statusOptions: { value: ProductStatus; label: string }[] = [
  { value: 'IN_STOCK', label: 'Available' },
  { value: 'PRE_ORDER', label: 'Pre-book' },
  { value: 'COMING_SOON', label: 'Coming soon' },
]

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'name-asc', label: 'Name: A-Z' },
  { value: 'newest', label: 'Newest' },
]

export function ProductsPageContent() {
  const { products: runtimeProducts } = useRuntimeProducts()
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')

  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam)
  const [selectedStatuses, setSelectedStatuses] = useState<ProductStatus[]>([])
  const [sortBy, setSortBy] = useState('featured')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const filteredProducts = useMemo(() => {
    let result = [...runtimeProducts].filter(p => p.status !== 'ARCHIVED')
    if (selectedCategory) {
      const category = categories.find(c => c.slug === selectedCategory)
      if (category) result = result.filter(p => p.categoryId === category.id)
    }
    if (selectedStatuses.length > 0) {
      result = result.filter(p => selectedStatuses.includes(p.status))
    }
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.priceRetail - b.priceRetail)
        break
      case 'price-desc':
        result.sort((a, b) => b.priceRetail - a.priceRetail)
        break
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'featured':
      default:
        result.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1
          if (!a.isFeatured && b.isFeatured) return 1
          return a.sortOrder - b.sortOrder
        })
    }
    return result
  }, [runtimeProducts, selectedCategory, selectedStatuses, sortBy])

  const toggleStatus = (status: ProductStatus) => {
    setSelectedStatuses(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    )
  }

  const clearFilters = () => {
    setSelectedCategory(null)
    setSelectedStatuses([])
    setSortBy('featured')
  }

  const hasActiveFilters = selectedCategory || selectedStatuses.length > 0
  const activeCategory = categories.find(c => c.slug === selectedCategory)

  const FilterContent = () => {
    const partsParentId = 'cat-parts'
    const isPartsView =
      !!activeCategory && (activeCategory.id === partsParentId || activeCategory.parentId === partsParentId)
    const visibleCategories = isPartsView
      ? categories
          .filter(c => c.parentId === partsParentId)
          .sort((a, b) => a.sortOrder - b.sortOrder)
      : categories
          .filter(c => c.id !== partsParentId && c.parentId !== partsParentId)
          .sort((a, b) => a.sortOrder - b.sortOrder)

    return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-volt-white mb-3">Categories</h4>
        <div className="space-y-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              'w-full text-left px-3 py-2 rounded-md text-sm transition-colors',
              !selectedCategory ? 'bg-volt text-volt-black font-medium' : 'text-volt-muted hover:text-volt-white hover:bg-volt-panel'
            )}
          >
            All
          </button>
          {visibleCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={cn(
                'w-full text-left px-3 py-2 rounded-md text-sm transition-colors',
                selectedCategory === cat.slug ? 'bg-volt text-volt-black font-medium' : 'text-volt-muted hover:text-volt-white hover:bg-volt-panel'
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-volt-white mb-3">Availability</h4>
        <div className="space-y-2">
          {statusOptions.map((option) => (
            <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
              <Checkbox
                checked={selectedStatuses.includes(option.value)}
                onCheckedChange={() => toggleStatus(option.value)}
                className="border-border data-[state=checked]:bg-volt data-[state=checked]:border-volt"
              />
              <span className="text-sm text-volt-muted group-hover:text-volt-white transition-colors">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>
      {hasActiveFilters && (
        <Button
          variant="outline"
          className="w-full border-border text-volt-white hover:bg-volt-panel"
          onClick={clearFilters}
        >
          Clear filters
        </Button>
      )}
    </div>
  )
  }

  return (
    <div className="min-h-screen bg-volt-black">
      <Header />
      <CartSidebar />
      <main className="pt-16">
        <div className="bg-volt-deep border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-volt-white tracking-wide">
              {activeCategory ? activeCategory.name.toUpperCase() : 'ALL E-BIKES'}
            </h1>
            {activeCategory?.description && (
              <p className="mt-2 text-volt-muted max-w-2xl">{activeCategory.description}</p>
            )}
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden border-border text-volt-white hover:bg-volt-panel">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                    {hasActiveFilters && (
                      <Badge className="ml-2 bg-volt text-volt-black">
                        {(selectedCategory ? 1 : 0) + selectedStatuses.length}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-volt-deep border-r border-border">
                  <SheetHeader>
                    <SheetTitle className="text-volt-white">Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>
              {hasActiveFilters && (
                <div className="hidden sm:flex items-center gap-2">
                  {activeCategory && (
                    <Badge
                      variant="outline"
                      className="border-volt/50 text-volt cursor-pointer hover:bg-volt hover:text-volt-black"
                      onClick={() => setSelectedCategory(null)}
                    >
                      {activeCategory.name}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  )}
                  {selectedStatuses.map(status => (
                    <Badge
                      key={status}
                      variant="outline"
                      className="border-volt/50 text-volt cursor-pointer hover:bg-volt hover:text-volt-black"
                      onClick={() => toggleStatus(status)}
                    >
                      {statusOptions.find(s => s.value === status)?.label}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-sm text-volt-muted">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'bike' : 'bikes'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] bg-volt-panel border-border text-volt-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-volt-panel border-border">
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="hidden sm:flex items-center border border-border rounded-md">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn('p-2 transition-colors', viewMode === 'grid' ? 'bg-volt text-volt-black' : 'text-volt-muted hover:text-volt-white')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn('p-2 transition-colors', viewMode === 'list' ? 'bg-volt text-volt-black' : 'text-volt-muted hover:text-volt-white')}
                >
                  <LayoutList className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex gap-8">
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <FilterContent />
              </div>
            </aside>
            <div className="flex-1">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-volt-muted text-lg">No bikes found.</p>
                  <Button variant="outline" className="mt-4 border-border text-volt-white hover:bg-volt-panel" onClick={clearFilters}>
                    Clear filters
                  </Button>
                </div>
              ) : (
                <div className={cn(
                  'grid gap-6',
                  viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'
                )}>
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export function ProductsPageFallback() {
  return (
    <div className="min-h-screen bg-volt-black">
      <Header />
      <main className="pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="text-volt-muted">Loading…</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
