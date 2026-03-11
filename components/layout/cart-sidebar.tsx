'use client'

import Image from 'next/image'
import Link from 'next/link'
import { X, Plus, Minus, Trash2, ShoppingBag, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/data'

export function CartSidebar() {
  const { 
    items, 
    isOpen, 
    closeCart, 
    removeItem, 
    updateQuantity,
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
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="w-full sm:max-w-[34rem] bg-volt-deep border-l border-border flex flex-col">
        <SheetHeader className="pb-4 border-b border-border">
          <SheetTitle className="flex items-center gap-2 text-volt-white">
            <ShoppingBag className="h-5 w-5" />
            Cart
            <span className="text-volt-muted font-normal">
              ({items.length} {items.length === 1 ? 'item' : 'items'})
            </span>
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-12">
            <div className="w-20 h-20 rounded-full bg-volt-panel flex items-center justify-center">
              <ShoppingBag className="h-10 w-10 text-volt-muted" />
            </div>
            <p className="text-volt-muted text-center">Your cart is empty</p>
            <Button 
              onClick={closeCart}
              className="bg-volt text-volt-black hover:bg-volt/90"
              asChild
            >
              <Link href="/products">
                Shop bikes & parts
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Free shipping progress */}
            {!freeShipping && (
              <div className="py-4 px-4 -mx-6 bg-volt-panel/50">
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-volt" />
                  <span className="text-volt-white">
                    Add <span className="font-semibold text-volt">{formatPrice(amountToFreeShipping)}</span> more for free shipping
                  </span>
                </div>
                <div className="mt-2 h-1.5 bg-volt-panel rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-volt transition-all duration-500"
                    style={{ width: `${Math.min((subtotal / 500) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-4 -mx-6 px-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div 
                    key={item.id}
                    className="flex gap-4 p-3 bg-volt-panel rounded-lg border border-border"
                  >
                    {/* Product Image */}
                    <div className="relative w-20 h-20 bg-volt-deep rounded-md overflow-hidden flex-shrink-0">
                      {item.product.images[0] && (
                        <Image
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link 
                        href={`/products/${item.product.slug}`}
                        className="text-sm font-medium text-volt-white hover:text-volt transition-colors line-clamp-2"
                        onClick={closeCart}
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-volt-muted mt-0.5">
                        SKU: {item.product.sku}
                      </p>
                      <p className="text-sm font-mono text-volt mt-1">
                        {formatPrice(item.priceSnap)}
                      </p>
                    </div>

                    {/* Quantity & Remove */}
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="p-1 text-volt-muted hover:text-volt-orange transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <div className="flex items-center gap-1 bg-volt-deep rounded-md">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1.5 text-volt-muted hover:text-volt-white transition-colors disabled:opacity-50"
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-sm text-volt-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1.5 text-volt-muted hover:text-volt-white transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Summary */}
            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-volt-muted">Subtotal</span>
                <span className="text-volt-white font-mono">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-volt-muted">GST (10%)</span>
                <span className="text-volt-white font-mono">{formatPrice(gst)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-volt-muted">Delivery</span>
                <span className={freeShipping ? 'text-volt font-medium' : 'text-volt-white font-mono'}>
                  {freeShipping ? 'FREE' : formatPrice(29)}
                </span>
              </div>
              <Separator className="bg-border" />
              <div className="flex justify-between">
                <span className="font-semibold text-volt-white">Total</span>
                <span className="font-semibold text-volt-white font-mono text-lg">
                  {formatPrice(total)}
                </span>
              </div>

              <div className="space-y-2 pt-2">
                <Button 
                  className="w-full bg-volt text-volt-black hover:bg-volt/90 font-semibold"
                  size="lg"
                  asChild
                >
                  <Link href="/checkout" onClick={closeCart}>
                    Proceed to checkout
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-border text-volt-white hover:bg-volt-panel"
                  onClick={closeCart}
                >
                  Continue shopping
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
