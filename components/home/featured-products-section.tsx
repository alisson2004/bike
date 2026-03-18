'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/product/product-card'
import { products, categories } from '@/lib/data'
import { cn } from '@/lib/utils'

const filters = [
  { id: 'all', label: 'All' },
  ...categories.slice(0, 4).map(cat => ({ id: cat.slug, label: cat.name.split(' ')[0] }))
]

export function FeaturedProductsSection() {
  const [activeFilter, setActiveFilter] = useState('all')
  const pathname = usePathname()
  const isHome = pathname === '/'
  
  const featuredProducts = products.filter(p => p.isFeatured)
  const filteredProducts = activeFilter === 'all' 
    ? featuredProducts 
    : featuredProducts.filter(p => {
        const cat = categories.find(c => c.id === p.categoryId)
        return cat?.slug === activeFilter
      })

  return (
    <section className="py-16 lg:py-24 bg-volt-deep">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-volt-white tracking-wide">
            FEATURED BIKES
          </h2>
          <p className="mt-2 text-volt-muted max-w-xl mx-auto">
            Our most popular e-bikes. Pickup at our store —{' '}
            <Link
              href="/#visit"
              className="text-volt hover:text-volt/80"
              onClick={(e) => {
                if (isHome) {
                  e.preventDefault()
                  document.getElementById('visit')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              }}
            >
              get directions
            </Link>
            .
          </p>
          <Button variant="outline" className="border-border text-volt-white hover:bg-volt-panel mt-4" asChild>
            <Link href="/products">
              View all bikes
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-full transition-all',
                activeFilter === filter.id
                  ? 'bg-volt text-volt-black'
                  : 'bg-volt-panel text-volt-muted hover:text-volt-white border border-border'
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Products list – Flexbox so last row (e.g. 2 cards) stays centered with same gap */}
        <div className="flex flex-wrap justify-center gap-6">
          {filteredProducts.slice(0, 6).map((product) => (
            <div
              key={product.id}
              className="w-full sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)] flex-shrink-0"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-volt-muted">No bikes in this category.</p>
          </div>
        )}
      </div>
    </section>
  )
}
