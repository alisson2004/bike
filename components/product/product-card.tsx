'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/data'
import type { Product, ProductStatus } from '@/lib/types'
import { toast } from 'sonner'

interface ProductCardProps {
  product: Product
  showWholesalePrice?: boolean
  wholesalePrice?: number
}

const statusStyles: Record<ProductStatus, { label: string; className: string }> = {
  IN_STOCK: { label: 'Available', className: 'bg-volt-teal/20 text-volt-teal border-volt-teal/30' },
  OUT_OF_STOCK: { label: 'Unavailable', className: 'bg-volt-orange/20 text-volt-orange border-volt-orange/30' },
  PRE_ORDER: { label: 'Pre-book', className: 'bg-volt-orange/20 text-volt-orange border-volt-orange/30' },
  COMING_SOON: { label: 'Coming soon', className: 'bg-volt/20 text-volt border-volt/30' },
  ARCHIVED: { label: 'Archived', className: 'bg-volt-muted/20 text-volt-muted border-volt-muted/30' },
}

export function ProductCard({ product, showWholesalePrice, wholesalePrice }: ProductCardProps) {
  const { addItem, openCart } = useCartStore()
  const status = statusStyles[product.status]
  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0]
  const displayPrice = showWholesalePrice && wholesalePrice ? wholesalePrice : product.priceRetail
  const canAddToCart = product.status === 'IN_STOCK'

  const handleAddToCart = () => {
    if (!canAddToCart) return
    addItem(product, 1, displayPrice)
    openCart()
    toast.success('Added to cart', {
      description: `${product.name} has been added to your cart.`,
      icon: '⚡',
    })
  }

  return (
    <div className="group relative bg-volt-panel border border-border rounded-lg overflow-hidden card-glow">
      {/* Product Image */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-[4/3] overflow-hidden">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.altText || product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-volt-deep flex items-center justify-center">
            <span className="text-volt-muted">No image</span>
          </div>
        )}
        
        {/* Overlay on hover - same link as image, no nested <a> */}
        <div className="absolute inset-0 bg-volt-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 pointer-events-none">
          <span className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium rounded-md bg-volt-white text-volt-black px-3 py-2 gap-1">
            <Eye className="h-4 w-4" />
            View
          </span>
        </div>

        {/* Status Badge */}
        <Badge 
          variant="outline" 
          className={`absolute top-3 left-3 ${status.className}`}
        >
          {status.label}
        </Badge>

        {/* Wholesale Badge */}
        {showWholesalePrice && (
          <Badge className="absolute top-3 right-3 bg-volt text-volt-black">
            Business rate
          </Badge>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        {product.category && (
          <p className="text-xs text-volt-muted uppercase tracking-wider mb-1">
            {product.category.name}
          </p>
        )}

        {/* Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-volt-white group-hover:text-volt transition-colors line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        {/* Key Specs */}
        <div className="flex flex-wrap gap-2 mt-2">
          {product.specs.slice(0, 2).map(spec => (
            <span 
              key={spec.id}
              className="text-xs text-volt-muted bg-volt-deep px-2 py-0.5 rounded"
            >
              {spec.value}{spec.unit} {spec.label}
            </span>
          ))}
        </div>

        {/* Price & Book */}
        <div className="flex items-end justify-between mt-4">
          <div>
            {/* Current Price */}
            <p className="font-mono text-lg font-semibold text-volt-white">
              {formatPrice(displayPrice)}
            </p>
            
            {/* Compare at / Original price */}
            {(product.compareAt || (showWholesalePrice && product.priceRetail > displayPrice)) && (
              <p className="font-mono text-sm text-volt-muted line-through">
                {formatPrice(showWholesalePrice ? product.priceRetail : (product.compareAt || 0))}
              </p>
            )}
          </div>

          <Button
            size="icon"
            onClick={handleAddToCart}
            disabled={!canAddToCart}
            className={
              canAddToCart 
                ? 'bg-volt text-volt-black hover:bg-volt/90' 
                : 'bg-volt-panel text-volt-muted cursor-not-allowed'
            }
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="sr-only">Book</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
