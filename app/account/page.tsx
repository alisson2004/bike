'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  User, 
  Package, 
  MapPin, 
  Building2, 
  LogOut,
  ChevronRight,
  Edit2,
  BadgeCheck,
} from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CartSidebar } from '@/components/layout/cart-sidebar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuthStore } from '@/lib/store'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/data'
import { toast } from 'sonner'

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

export default function AccountPage() {
  const router = useRouter()
  const { user, clearUser } = useAuthStore()
  const [activeTab, setActiveTab] = useState('overview')
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [ordersError, setOrdersError] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.id) {
      setOrders([])
      setOrdersLoading(false)
      setOrdersError(null)
      return
    }
    setOrdersError(null)
    const supabase = createClient()
    supabase
      .from('orders')
      .select('id, order_number, status, total_cents, created_at, order_items(product_name, quantity)')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        setOrdersLoading(false)
        if (error) {
          const msg =
            (error as { message?: string }).message ??
            (error as { code?: string }).code ??
            (typeof error === 'object' && error !== null && 'error' in error
              ? String((error as { error?: unknown }).error)
              : 'Unknown error')
          console.error('Orders fetch error:', msg, JSON.stringify(error, null, 2))
          setOrdersError(msg)
          return
        }
        setOrders((data as OrderRow[]) ?? [])
      })
  }, [user?.id])

  // Redirect if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-volt-black">
        <Header />
        <main className="pt-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center bg-volt-panel rounded-lg border border-border p-12">
              <User className="h-16 w-16 mx-auto text-volt-muted mb-4" />
              <h1 className="text-2xl font-semibold text-volt-white mb-2">Sign in to continue</h1>
              <p className="text-volt-muted mb-6">Access your account dashboard, orders, and settings.</p>
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

  const handleLogout = () => {
    clearUser()
    toast.success('Signed out successfully')
    router.push('/')
  }

  const isWholesale = user.role === 'WHOLESALE'
  const isAdmin = user.role === 'ADMIN'

  return (
    <div className="min-h-screen bg-volt-black">
      <Header />
      <CartSidebar />

      <main className="pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl text-volt-white tracking-wide">
                MY ACCOUNT
              </h1>
              <p className="text-volt-muted mt-1">
                Welcome back, {user.firstName}!
              </p>
            </div>
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Button 
                  variant="outline" 
                  className="border-volt text-volt hover:bg-volt hover:text-volt-black"
                  asChild
                >
                  <Link href="/admin">
                    Admin Dashboard
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
              <Button 
                variant="outline" 
                className="border-border text-volt-muted hover:text-volt-orange hover:border-volt-orange"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Account Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-volt-panel border border-border mb-8 flex-wrap h-auto">
              <TabsTrigger 
                value="overview"
                className="data-[state=active]:bg-volt data-[state=active]:text-volt-black"
              >
                <User className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="orders"
                className="data-[state=active]:bg-volt data-[state=active]:text-volt-black"
              >
                <Package className="h-4 w-4 mr-2" />
                Orders
              </TabsTrigger>
              <TabsTrigger 
                value="addresses"
                className="data-[state=active]:bg-volt data-[state=active]:text-volt-black"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Addresses
              </TabsTrigger>
              <TabsTrigger 
                value="b2b"
                className="data-[state=active]:bg-volt data-[state=active]:text-volt-black"
              >
                <Building2 className="h-4 w-4 mr-2" />
                B2B Status
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="bg-volt-panel rounded-lg border border-border p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold text-volt-white">Profile</h3>
                    <button className="text-volt hover:text-volt/80">
                      <Edit2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-volt-white">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-volt-muted">{user.email}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge 
                        variant="outline" 
                        className={
                          isWholesale 
                            ? 'border-volt text-volt' 
                            : isAdmin 
                              ? 'border-volt-orange text-volt-orange'
                              : 'border-volt-teal text-volt-teal'
                        }
                      >
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Recent Orders Card */}
                <div className="bg-volt-panel rounded-lg border border-border p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold text-volt-white">Recent Orders</h3>
                    <button 
                      onClick={() => setActiveTab('orders')}
                      className="text-sm text-volt hover:text-volt/80"
                    >
                      View All
                    </button>
                  </div>
                  {ordersLoading ? (
                    <p className="text-sm text-volt-muted py-2">Loading…</p>
                  ) : ordersError ? (
                    <p className="text-sm text-volt-muted py-2">Could not load orders.</p>
                  ) : orders.length === 0 ? (
                    <p className="text-sm text-volt-muted py-2">No orders yet.</p>
                  ) : (
                    orders.slice(0, 2).map((order) => (
                      <div 
                        key={order.id}
                        className="flex items-center justify-between py-2 border-b border-border last:border-0"
                      >
                        <div>
                          <p className="text-sm text-volt-white">{order.order_number}</p>
                          <p className="text-xs text-volt-muted">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={orderStatusColors[order.status] ?? 'bg-volt-muted/20 text-volt-muted'}>
                          {order.status}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>

                {/* B2B Status Card */}
                <div className="bg-volt-panel rounded-lg border border-border p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold text-volt-white">B2B Status</h3>
                  </div>
                  {isWholesale && user.b2bAccount ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-volt">
                        <BadgeCheck className="h-5 w-5" />
                        <span className="font-medium">Active Wholesale Account</span>
                      </div>
                      <p className="text-sm text-volt-muted">
                        Business: {user.b2bAccount.businessName}
                      </p>
                      <p className="text-sm text-volt-muted">
                        Discount: {(user.b2bAccount.discountRate * 100).toFixed(0)}% off retail
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-volt-muted">
                        Unlock wholesale pricing with a B2B account.
                      </p>
                      <Button 
                        className="w-full bg-volt/20 text-volt hover:bg-volt hover:text-volt-black"
                        onClick={() => setActiveTab('b2b')}
                      >
                        Apply for B2B Access
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <div className="bg-volt-panel rounded-lg border border-border overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold text-volt-white">Order History</h3>
                </div>
                {ordersLoading ? (
                  <div className="p-8 text-center text-volt-muted">Loading orders…</div>
                ) : orders.length === 0 ? (
                  <div className="p-8 text-center">
                    <Package className="h-12 w-12 mx-auto text-volt-muted mb-3" />
                    <p className="text-volt-muted">No orders yet.</p>
                    <Button className="mt-4 bg-volt text-volt-black hover:bg-volt/90" asChild>
                      <Link href="/products">Shop e-bikes</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {orders.map((order) => (
                      <div key={order.id} className="p-4 hover:bg-volt-deep transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3">
                              <p className="font-mono font-semibold text-volt-white">
                                {order.order_number}
                              </p>
                              <Badge className={orderStatusColors[order.status] ?? 'bg-volt-muted/20 text-volt-muted'}>
                                {order.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-volt-muted mt-1">
                              {order.order_items?.map(i => `${i.quantity}x ${i.product_name}`).join(', ') ?? '—'}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-mono font-semibold text-volt-white">
                                {formatPrice(order.total_cents / 100)}
                              </p>
                              <p className="text-xs text-volt-muted">
                                {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses">
              <div className="bg-volt-panel rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-volt-white">Saved Addresses</h3>
                  <Button className="bg-volt text-volt-black hover:bg-volt/90">
                    Add Address
                  </Button>
                </div>
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 mx-auto text-volt-muted mb-4" />
                  <p className="text-volt-muted">No saved addresses yet.</p>
                  <p className="text-sm text-volt-muted mt-1">
                    Add an address for faster checkout.
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* B2B Tab */}
            <TabsContent value="b2b">
              <div className="bg-volt-panel rounded-lg border border-border p-6">
                {isWholesale && user.b2bAccount ? (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-volt/20 rounded-full">
                        <BadgeCheck className="h-8 w-8 text-volt" />
                      </div>
                      <div>
                        <h3 className="font-display text-xl text-volt-white">WHOLESALE ACCOUNT ACTIVE</h3>
                        <p className="text-volt-muted">You have access to B2B pricing</p>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="bg-volt-deep rounded-lg p-4">
                        <p className="text-sm text-volt-muted">Business Name</p>
                        <p className="text-volt-white font-medium">{user.b2bAccount.businessName}</p>
                      </div>
                      <div className="bg-volt-deep rounded-lg p-4">
                        <p className="text-sm text-volt-muted">Discount Rate</p>
                        <p className="text-volt font-mono text-xl">{(user.b2bAccount.discountRate * 100).toFixed(0)}%</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Building2 className="h-16 w-16 mx-auto text-volt-muted mb-4" />
                    <h3 className="font-display text-xl text-volt-white mb-2">BECOME A B2B PARTNER</h3>
                    <p className="text-volt-muted max-w-md mx-auto mb-6">
                      Unlock wholesale pricing, dedicated support, and flexible payment terms for your business.
                    </p>
                    <Button 
                      className="bg-volt text-volt-black hover:bg-volt/90"
                      asChild
                    >
                      <Link href="/b2b">Apply for B2B Access</Link>
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
