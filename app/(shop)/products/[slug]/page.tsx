'use client'

import { useState } from 'react'
import { useParams, notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { 
  ChevronLeft, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Minus, 
  Plus,
  Star,
  Truck,
  Shield,
  Zap,
  CheckCircle2
} from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CartSidebar } from '@/components/layout/cart-sidebar'
import { ProductCard } from '@/components/product/product-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { useCartStore, useAuthStore } from '@/lib/store'
import { getProductBySlug, formatPrice, products, getProductReviews } from '@/lib/data'
import { toast } from 'sonner'
import type { ProductStatus } from '@/lib/types'

const statusStyles: Record<ProductStatus, { label: string; className: string }> = {
  IN_STOCK: { label: 'In Stock', className: 'bg-volt-teal/20 text-volt-teal border-volt-teal/30' },
  OUT_OF_STOCK: { label: 'Out of Stock', className: 'bg-volt-orange/20 text-volt-orange border-volt-orange/30' },
  PRE_ORDER: { label: 'Pre-Order', className: 'bg-volt-orange/20 text-volt-orange border-volt-orange/30' },
  COMING_SOON: { label: 'Coming Soon', className: 'bg-volt/20 text-volt border-volt/30' },
  ARCHIVED: { label: 'Archived', className: 'bg-volt-muted/20 text-volt-muted border-volt-muted/30' },
}

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const product = getProductBySlug(slug)

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  
  const { addItem, openCart } = useCartStore()
  const { user } = useAuthStore()
  
  if (!product) {
    notFound()
  }

  const status = statusStyles[product.status]
  const reviews = getProductReviews(product.id)
  const avgRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : 0

  // B2B pricing logic
  const isWholesale = user?.role === 'WHOLESALE'
  const displayPrice = isWholesale && product.priceWholesale 
    ? product.priceWholesale 
    : product.priceRetail

  const canAddToCart = product.status === 'IN_STOCK'
  const isPreOrder = product.status === 'PRE_ORDER'
  const isComingSoon = product.status === 'COMING_SOON'

  // Related products
  const relatedProducts = products
    .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 3)

  const handleAddToCart = () => {
    if (!canAddToCart && !isPreOrder) return
    addItem(product, quantity, displayPrice)
    openCart()
    toast.success(isPreOrder ? 'Added to pre-order' : 'Added to cart', {
      description: `${product.name} has been added to your cart.`,
      icon: '⚡',
    })
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.name,
        text: product.shortDesc,
        url: window.location.href,
      })
    } catch {
      // Fallback to clipboard
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-volt-black">
      <Header />
      <CartSidebar />

      <main className="pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link href="/products" className="text-volt-muted hover:text-volt-white transition-colors">
              Products
            </Link>
            <span className="text-volt-muted">/</span>
            {product.category && (
              <>
                <Link 
                  href={`/products?category=${product.category.slug}`}
                  className="text-volt-muted hover:text-volt-white transition-colors"
                >
                  {product.category.name}
                </Link>
                <span className="text-volt-muted">/</span>
              </>
            )}
            <span className="text-volt-white">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-[4/3] bg-volt-panel rounded-lg overflow-hidden">
                {product.images[selectedImage] ? (
                  <Image
                    src={product.images[selectedImage].url}
                    alt={product.images[selectedImage].altText || product.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-volt-muted">
                    No image available
                  </div>
                )}
                
                {/* Status Badge */}
                <Badge 
                  variant="outline" 
                  className={`absolute top-4 left-4 ${status.className}`}
                >
                  {status.label}
                </Badge>

                {/* Wholesale Badge */}
                {isWholesale && product.priceWholesale && (
                  <Badge className="absolute top-4 right-4 bg-volt text-volt-black">
                    Wholesale Price
                  </Badge>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(index)}
                      className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-colors ${
                        selectedImage === index 
                          ? 'border-volt' 
                          : 'border-transparent hover:border-volt/50'
                      }`}
                    >
                      <Image
                        src={image.url}
                        alt={image.altText || `${product.name} view ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                {product.category && (
                  <p className="text-sm text-volt uppercase tracking-wider mb-2">
                    {product.category.name}
                  </p>
                )}
                <h1 className="font-display text-3xl sm:text-4xl text-volt-white tracking-wide">
                  {product.name.toUpperCase()}
                </h1>
                <p className="text-sm text-volt-muted mt-1">SKU: {product.sku}</p>
              </div>

              {/* Rating */}
              {reviews.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i}
                        className={`h-4 w-4 ${i < Math.round(avgRating) ? 'fill-volt text-volt' : 'text-volt-muted'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-volt-muted">
                    {avgRating.toFixed(1)} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="space-y-1">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-3xl font-bold text-volt-white">
                    {formatPrice(displayPrice)}
                  </span>
                  {(product.compareAt || (isWholesale && product.priceRetail > displayPrice)) && (
                    <span className="font-mono text-lg text-volt-muted line-through">
                      {formatPrice(isWholesale ? product.priceRetail : (product.compareAt || 0))}
                    </span>
                  )}
                </div>
                {isWholesale && (
                  <p className="text-sm text-volt">
                    You save {formatPrice(product.priceRetail - displayPrice)} with B2B pricing
                  </p>
                )}
                <p className="text-xs text-volt-muted">Inc. GST. Shipping calculated at checkout.</p>
              </div>

              {/* Short Description */}
              {product.shortDesc && (
                <p className="text-volt-muted leading-relaxed">{product.shortDesc}</p>
              )}

              {/* Key Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {product.specs.slice(0, 6).map((spec) => (
                  <div 
                    key={spec.id}
                    className="bg-volt-panel rounded-lg p-3 border border-border"
                  >
                    <p className="text-xs text-volt-muted">{spec.label}</p>
                    <p className="font-semibold text-volt-white">
                      {spec.value}{spec.unit && <span className="text-sm font-normal text-volt-muted ml-1">{spec.unit}</span>}
                    </p>
                  </div>
                ))}
              </div>

              {/* Quantity & Add to Cart */}
              <div className="space-y-4">
                {/* Quantity */}
                {(canAddToCart || isPreOrder) && (
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-volt-muted">Quantity:</span>
                    <div className="flex items-center border border-border rounded-md">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 text-volt-muted hover:text-volt-white transition-colors disabled:opacity-50"
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-12 text-center text-volt-white">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2 text-volt-muted hover:text-volt-white transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    {product.stock > 0 && product.stock <= product.lowStockAlert && (
                      <span className="text-sm text-volt-orange">
                        Only {product.stock} left!
                      </span>
                    )}
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3">
                  {canAddToCart && (
                    <Button
                      size="lg"
                      className="flex-1 bg-volt text-volt-black hover:bg-volt/90 font-semibold"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Add to Cart
                    </Button>
                  )}
                  
                  {isPreOrder && (
                    <Button
                      size="lg"
                      className="flex-1 bg-volt-orange text-volt-white hover:bg-volt-orange/90 font-semibold"
                      onClick={handleAddToCart}
                    >
                      <Zap className="h-5 w-5 mr-2" />
                      Pre-Order Now
                    </Button>
                  )}

                  {isComingSoon && (
                    <Button
                      size="lg"
                      disabled
                      className="flex-1 bg-volt-panel text-volt-muted cursor-not-allowed font-semibold"
                    >
                      Coming Soon
                    </Button>
                  )}

                  {product.status === 'OUT_OF_STOCK' && (
                    <Button
                      size="lg"
                      disabled
                      className="flex-1 bg-volt-panel text-volt-muted cursor-not-allowed font-semibold"
                    >
                      Out of Stock
                    </Button>
                  )}

                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-border text-volt-white hover:bg-volt-panel"
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                  
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-border text-volt-white hover:bg-volt-panel"
                    onClick={handleShare}
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div className="flex flex-col items-center text-center gap-1">
                  <Truck className="h-5 w-5 text-volt" />
                  <span className="text-xs text-volt-muted">Free Shipping 500+</span>
                </div>
                <div className="flex flex-col items-center text-center gap-1">
                  <Shield className="h-5 w-5 text-volt" />
                  <span className="text-xs text-volt-muted">5-Year Warranty</span>
                </div>
                <div className="flex flex-col items-center text-center gap-1">
                  <CheckCircle2 className="h-5 w-5 text-volt" />
                  <span className="text-xs text-volt-muted">30-Day Returns</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="description" className="mt-12">
            <TabsList className="bg-volt-panel border border-border">
              <TabsTrigger 
                value="description"
                className="data-[state=active]:bg-volt data-[state=active]:text-volt-black"
              >
                Description
              </TabsTrigger>
              <TabsTrigger 
                value="specs"
                className="data-[state=active]:bg-volt data-[state=active]:text-volt-black"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger 
                value="reviews"
                className="data-[state=active]:bg-volt data-[state=active]:text-volt-black"
              >
                Reviews ({reviews.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <div className="bg-volt-panel rounded-lg border border-border p-6">
                <div className="prose prose-invert max-w-none">
                  {product.description.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="text-volt-muted leading-relaxed mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="specs" className="mt-6">
              <div className="bg-volt-panel rounded-lg border border-border overflow-hidden">
                <table className="w-full">
                  <tbody>
                    {product.specs.map((spec, i) => (
                      <tr 
                        key={spec.id}
                        className={i % 2 === 0 ? 'bg-volt-deep' : ''}
                      >
                        <td className="px-6 py-3 text-sm font-medium text-volt-muted w-1/3">
                          {spec.label}
                        </td>
                        <td className="px-6 py-3 text-sm text-volt-white">
                          {spec.value}{spec.unit && ` ${spec.unit}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <div className="bg-volt-panel rounded-lg border border-border p-8 text-center">
                    <p className="text-volt-muted">No reviews yet. Be the first to review this product!</p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <div 
                      key={review.id}
                      className="bg-volt-panel rounded-lg border border-border p-6"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? 'fill-volt text-volt' : 'text-volt-muted'}`}
                              />
                            ))}
                          </div>
                          {review.title && (
                            <h4 className="font-semibold text-volt-white mt-2">{review.title}</h4>
                          )}
                        </div>
                        <span className="text-xs text-volt-muted">
                          {new Date(review.createdAt).toLocaleDateString('en-AU')}
                        </span>
                      </div>
                      <p className="text-volt-muted text-sm mt-3">{review.body}</p>
                      <div className="flex items-center gap-2 mt-4">
                        <span className="text-sm text-volt-white">
                          {review.user?.firstName} {review.user?.lastName?.[0]}.
                        </span>
                        {review.isVerified && (
                          <Badge variant="outline" className="border-volt-teal/50 text-volt-teal text-xs">
                            Verified Buyer
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display text-2xl text-volt-white">RELATED PRODUCTS</h2>
                <Link 
                  href={`/products?category=${product.category?.slug}`}
                  className="text-sm text-volt hover:text-volt/80 transition-colors"
                >
                  View All
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
