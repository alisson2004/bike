'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Zap } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CartSidebar } from '@/components/layout/cart-sidebar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/data'

export default function CartPage() {
  const { 
    items, 
    removeItem, 
    updateQuantity,
    clearCart,
    getSubtotal,
    getGst,
    getTotal,
    qualifiesForFreeShipping 
  } = useCartStore()

  const subtotal = getSubtotal()
  const gst = getGst()
  const total = getTotal()
  const freeShipping = qualifiesForFreeShipping()
  const amountToFreeShipping = 500 - subtotal

  return (
    <div className="min-h-screen bg-volt-black">
      <Header />
      <CartSidebar />

      <main className="pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-display text-3xl sm:text-4xl text-volt-white tracking-wide">
              YOUR CART
            </h1>
            {items.length > 0 && (
              <Button
                variant="outline"
                className="border-border text-volt-muted hover:text-volt-orange hover:border-volt-orange"
                onClick={clearCart}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear cart
              </Button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="text-center py-16 bg-volt-panel rounded-lg border border-border">
              <div className="w-20 h-20 mx-auto rounded-full bg-volt/10 flex items-center justify-center mb-6">
                <ShoppingBag className="h-10 w-10 text-volt-muted" />
              </div>
              <h2 className="text-xl font-semibold text-volt-white mb-2">Your cart is empty</h2>
              <p className="text-volt-muted mb-6">You haven&apos;t added any items yet.</p>
              <Button 
                className="bg-volt text-volt-black hover:bg-volt/90 font-semibold"
                asChild
              >
                <Link href="/products">
                  Shop bikes & parts
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {/* Free Shipping Progress */}
                {!freeShipping && (
                  <div className="p-4 bg-volt-panel rounded-lg border border-border">
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <Zap className="h-4 w-4 text-volt" />
                      <span className="text-volt-white">
                        Add <span className="font-semibold text-volt">{formatPrice(amountToFreeShipping)}</span> more for free delivery!
                      </span>
                    </div>
                    <div className="h-2 bg-volt-deep rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-volt transition-all duration-500"
                        style={{ width: `${Math.min((subtotal / 500) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {freeShipping && (
                  <div className="p-4 bg-volt/10 rounded-lg border border-volt/30 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-volt" />
                    <span className="text-volt font-medium">You qualify for free delivery!</span>
                  </div>
                )}

                {/* Items List */}
                {items.map((item) => (
                  <div 
                    key={item.id}
                    className="flex gap-4 sm:gap-6 p-4 sm:p-6 bg-volt-panel rounded-lg border border-border"
                  >
                    {/* Image */}
                    <Link 
                      href={`/products/${item.product.slug}`}
                      className="relative w-24 h-24 sm:w-32 sm:h-32 bg-volt-deep rounded-lg overflow-hidden flex-shrink-0"
                    >
                      {item.product.images[0] && (
                        <Image
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          fill
                          className="object-cover hover:scale-105 transition-transform"
                        />
                      )}
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link 
                        href={`/products/${item.product.slug}`}
                        className="font-semibold text-volt-white hover:text-volt transition-colors line-clamp-2"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-volt-muted mt-1">SKU: {item.product.sku}</p>
                      
                      {/* Mobile Price */}
                      <p className="sm:hidden font-mono text-lg font-semibold text-volt mt-2">
                        {formatPrice(item.priceSnap * item.quantity)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center border border-border rounded-md">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="p-2 text-volt-muted hover:text-volt-white transition-colors disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-10 text-center text-volt-white">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="p-2 text-volt-muted hover:text-volt-white transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-volt-muted hover:text-volt-orange transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                          <span className="sr-only">Remove</span>
                        </button>
                      </div>
                    </div>

                    {/* Desktop Price */}
                    <div className="hidden sm:block text-right">
                      <p className="font-mono text-lg font-semibold text-volt-white">
                        {formatPrice(item.priceSnap * item.quantity)}
                      </p>
                      <p className="text-sm text-volt-muted">
                        {formatPrice(item.priceSnap)} each
                      </p>
                    </div>
                  </div>
                ))}

                {/* Continue Shopping */}
                <div className="pt-4">
                  <Link 
                    href="/products"
                    className="inline-flex items-center text-volt hover:text-volt/80 transition-colors"
                  >
                    <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                    Continue shopping
                  </Link>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-volt-panel rounded-lg border border-border p-6 sticky top-24">
                  <h2 className="font-display text-xl text-volt-white mb-6">ORDER SUMMARY</h2>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-volt-muted">Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                      <span className="text-volt-white font-mono">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-volt-muted">GST (10%)</span>
                      <span className="text-volt-white font-mono">{formatPrice(gst)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-volt-muted">Delivery</span>
                      <span className={freeShipping ? 'text-volt font-medium' : 'text-volt-white font-mono'}>
                        {freeShipping ? 'FREE' : 'At checkout'}
                      </span>
                    </div>
                  </div>

                  <Separator className="my-4 bg-border" />

                  <div className="flex justify-between mb-6">
                    <span className="font-semibold text-volt-white">Estimated Total</span>
                    <span className="font-mono text-xl font-bold text-volt-white">
                      {formatPrice(total)}
                    </span>
                  </div>

                  <Button 
                    className="w-full bg-volt text-volt-black hover:bg-volt/90 font-semibold"
                    size="lg"
                    asChild
                  >
                    <Link href="/checkout">
                      Proceed to checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>

                  <p className="text-xs text-volt-muted text-center mt-4">
                    Secure checkout via Stripe
                  </p>

                  {/* Trust Badges */}
                  <div className="flex justify-center gap-4 mt-6 pt-4 border-t border-border">
                    <div className="text-center">
                      <p className="text-xs text-volt-muted">Secure</p>
                      <p className="text-xs text-volt-white">Payment</p>
                    </div>
                    <div className="h-8 w-px bg-border" />
                    <div className="text-center">
                      <p className="text-xs text-volt-muted">5 Year</p>
                      <p className="text-xs text-volt-white">Warranty</p>
                    </div>
                    <div className="h-8 w-px bg-border" />
                    <div className="text-center">
                      <p className="text-xs text-volt-muted">30 Day</p>
                      <p className="text-xs text-volt-white">Returns</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
