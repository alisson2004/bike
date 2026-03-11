'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Package, Mail, ArrowRight } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/store'

export function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const clearCart = useCartStore((s) => s.clearCart)
  const sessionId = searchParams.get('session_id')
  const orderParam = searchParams.get('order')
  const [syncedOrderNumber, setSyncedOrderNumber] = useState<string | null>(null)
  const orderNumber =
    orderParam ||
    syncedOrderNumber ||
    (sessionId ? `cs_${sessionId.slice(-12)}` : 'VR-XXXXXX')

  useEffect(() => {
    if (sessionId) clearCart()
  }, [sessionId, clearCart])

  useEffect(() => {
    if (!sessionId) return
    let cancelled = false
    fetch('/api/orders/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.orderNumber) setSyncedOrderNumber(data.orderNumber)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [sessionId])

  return (
    <div className="min-h-screen bg-volt-black">
      <Header />
      <main className="pt-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-volt/20 flex items-center justify-center mb-6">
              <CheckCircle2 className="h-12 w-12 text-volt" />
            </div>
            <h1 className="font-display text-3xl sm:text-4xl text-volt-white tracking-wide mb-4">
              ORDER CONFIRMED!
            </h1>
            <p className="text-volt-muted mb-8 max-w-md mx-auto">
              Thank you! Your order has been received and is being processed.
            </p>
            <div className="bg-volt-panel rounded-lg border border-border p-6 mb-8">
              <p className="text-sm text-volt-muted mb-2">Order number</p>
              <p className="font-mono text-2xl font-bold text-volt">{orderNumber}</p>
            </div>
            <div className="bg-volt-panel rounded-lg border border-border p-6 mb-8">
              <h2 className="font-display text-lg text-volt-white mb-4">WHAT HAPPENS NEXT?</h2>
              <div className="space-y-4 text-left">
                <div className="flex gap-4">
                  <div className="p-2 bg-volt/10 rounded-lg h-fit">
                    <Mail className="h-5 w-5 text-volt" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-volt-white">Confirmation email</h3>
                    <p className="text-sm text-volt-muted">
                      You&apos;ll receive an email with your order details shortly.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="p-2 bg-volt/10 rounded-lg h-fit">
                    <Package className="h-5 w-5 text-volt" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-volt-white">Pickup or delivery</h3>
                    <p className="text-sm text-volt-muted">
                      Parts ship via Australia Post. For e-bikes we&apos;ll contact you to arrange pickup or delivery.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-volt text-volt-black hover:bg-volt/90 font-semibold" asChild>
                <Link href="/products">View more bikes <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button variant="outline" className="border-border text-volt-white hover:bg-volt-panel" asChild>
                <Link href="/account/orders">My orders</Link>
              </Button>
            </div>
            <p className="mt-8 text-sm text-volt-muted">
              Questions about your order?{' '}
              <Link href="/contact" className="text-volt hover:text-volt/80">Contact support</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export function OrderConfirmationFallback() {
  return (
    <div className="min-h-screen bg-volt-black">
      <Header />
      <main className="pt-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-volt/20 flex items-center justify-center mb-6">
            <CheckCircle2 className="h-12 w-12 text-volt animate-pulse" />
          </div>
          <p className="text-volt-muted">Loading…</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
