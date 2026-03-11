'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Package, User, ChevronLeft } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/lib/store'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/data'

type OrderRow = {
  id: string
  order_number: string
  status: string
  total_cents: number
  created_at: string
  order_items?: { product_name: string; quantity: number }[]
}

const orderStatusColors: Record<string, string> = {
  PENDING: 'bg-volt-muted/20 text-volt-muted',
  CONFIRMED: 'bg-volt/20 text-volt',
  PROCESSING: 'bg-volt-teal/20 text-volt-teal',
  SHIPPED: 'bg-volt-teal/20 text-volt-teal',
  DELIVERED: 'bg-volt/20 text-volt',
  CANCELLED: 'bg-volt-orange/20 text-volt-orange',
}

export default function AccountOrdersPage() {
  const { user } = useAuthStore()
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.id) {
      setOrders([])
      setLoading(false)
      setFetchError(null)
      return
    }
    setFetchError(null)
    const supabase = createClient()
    supabase
      .from('orders')
      .select('id, order_number, status, total_cents, created_at, order_items(product_name, quantity)')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        setLoading(false)
        if (error) {
          const msg =
            (error as { message?: string }).message ??
            (error as { code?: string }).code ??
            (typeof error === 'object' && error !== null && 'error' in error
              ? String((error as { error?: unknown }).error)
              : 'Unknown error')
          console.error('Orders fetch error:', msg, JSON.stringify(error, null, 2))
          setFetchError(msg)
          return
        }
        setOrders((data as OrderRow[]) ?? [])
      })
  }, [user?.id])

  if (!user) {
    return (
      <div className="min-h-screen bg-volt-black">
        <Header />
        <main className="pt-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center bg-volt-panel rounded-lg border border-border p-12">
              <User className="h-16 w-16 mx-auto text-volt-muted mb-4" />
              <h1 className="text-2xl font-semibold text-volt-white mb-2">Sign in to view orders</h1>
              <p className="text-volt-muted mb-6">Access your order history and account.</p>
              <div className="flex gap-4 justify-center">
                <Button className="bg-volt text-volt-black hover:bg-volt/90" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button variant="outline" className="border-border text-volt-white hover:bg-volt-panel" asChild>
                  <Link href="/register">Create Account</Link>
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-volt-black">
      <Header />
      <main className="pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <Link
            href="/account"
            className="inline-flex items-center text-volt-muted hover:text-volt-white transition-colors mb-6"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            My account
          </Link>

          <h1 className="font-display text-3xl sm:text-4xl text-volt-white tracking-wide mb-2">
            ORDER HISTORY
          </h1>
          <p className="text-volt-muted mb-8">View and track your orders.</p>

          <div className="bg-volt-panel rounded-lg border border-border overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-volt-muted">Loading orders…</div>
            ) : fetchError ? (
              <div className="p-12 text-center">
                <Package className="h-14 w-14 mx-auto text-volt-muted mb-4" />
                <p className="text-volt-white font-medium mb-1">Could not load orders</p>
                <p className="text-volt-muted text-sm mb-2">{fetchError}</p>
                <p className="text-volt-muted text-xs max-w-md mx-auto">
                  If you just set up the app, run the SQL in <code className="bg-volt-deep px-1 rounded">supabase/migrations/20250309000000_orders.sql</code> in the Supabase dashboard (SQL Editor).
                </p>
              </div>
            ) : orders.length === 0 ? (
              <div className="p-12 text-center">
                <Package className="h-14 w-14 mx-auto text-volt-muted mb-4" />
                <p className="text-volt-white font-medium mb-1">No orders yet</p>
                <p className="text-volt-muted text-sm mb-6">
                  Orders you place while signed in will appear here.
                </p>
                <Button className="bg-volt text-volt-black hover:bg-volt/90" asChild>
                  <Link href="/products">Shop e-bikes</Link>
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {orders.map((order) => (
                  <div key={order.id} className="p-4 sm:p-6 hover:bg-volt-deep transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="font-mono font-semibold text-volt-white text-lg">
                            {order.order_number}
                          </p>
                          <Badge className={orderStatusColors[order.status] ?? 'bg-volt-muted/20 text-volt-muted'}>
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-volt-muted mt-1">
                          {order.order_items?.map((i) => `${i.quantity}x ${i.product_name}`).join(', ') ?? '—'}
                        </p>
                        <p className="text-xs text-volt-muted mt-1">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="font-mono font-semibold text-volt-white text-lg">
                          {formatPrice(order.total_cents / 100)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
