'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Building2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  ArrowUpRight,
  ChevronRight,
  Home,
  LogOut,
  MoreHorizontal,
  Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/lib/store'
import { products, formatPrice } from '@/lib/data'
import { toast } from 'sonner'

// Mock data
const mockStats = {
  revenue: { current: 48750, previous: 42300, change: 15.2 },
  orders: { current: 24, previous: 18, change: 33.3 },
  customers: { current: 156, previous: 142, change: 9.8 },
  pendingB2B: 3,
}

const mockRecentOrders = [
  { id: '1', number: 'VR-A1B2C3', customer: 'Sarah Chen', total: 3299, status: 'CONFIRMED', date: '2 hours ago' },
  { id: '2', number: 'VR-D4E5F6', customer: 'ACME Cycles', total: 16495, status: 'PROCESSING', date: '5 hours ago', isB2B: true },
  { id: '3', number: 'VR-G7H8I9', customer: 'Michael Thompson', total: 2499, status: 'SHIPPED', date: '1 day ago' },
  { id: '4', number: 'VR-J0K1L2', customer: 'Emily Watson', total: 1899, status: 'DELIVERED', date: '2 days ago' },
  { id: '5', number: 'VR-M3N4O5', customer: 'Quick Deliveries', total: 11495, status: 'PENDING', date: '3 days ago', isB2B: true },
]

const orderStatusColors: Record<string, string> = {
  PENDING: 'bg-volt-muted/20 text-volt-muted',
  CONFIRMED: 'bg-volt/20 text-volt',
  PROCESSING: 'bg-volt-teal/20 text-volt-teal',
  SHIPPED: 'bg-volt-teal/20 text-volt-teal',
  DELIVERED: 'bg-volt/20 text-volt',
  CANCELLED: 'bg-volt-orange/20 text-volt-orange',
}

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'B2B Applications', href: '/admin/b2b', icon: Building2 },
]

export default function AdminDashboardPage() {
  const router = useRouter()
  const { user, clearUser } = useAuthStore()
  const [activeNav, setActiveNav] = useState('Dashboard')

  // Check admin access
  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-volt-black flex items-center justify-center">
        <div className="text-center bg-volt-panel rounded-lg border border-border p-12 max-w-md">
          <AlertTriangle className="h-16 w-16 mx-auto text-volt-orange mb-4" />
          <h1 className="text-2xl font-semibold text-volt-white mb-2">Access Denied</h1>
          <p className="text-volt-muted mb-6">You need admin privileges to access this page.</p>
          <Button className="bg-volt text-volt-black hover:bg-volt/90" asChild>
            <Link href="/login">Sign In as Admin</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleLogout = () => {
    clearUser()
    toast.success('Signed out successfully')
    router.push('/')
  }

  // Low stock products
  const lowStockProducts = products.filter(p => 
    p.trackInventory && p.stock > 0 && p.stock <= p.lowStockAlert
  )

  return (
    <div className="min-h-screen bg-volt-black">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-volt-deep border-r border-border hidden lg:block">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-border">
            <Link href="/admin" className="flex items-center gap-1">
              <span className="font-display text-xl tracking-wider text-volt-white">VOLT</span>
              <span className="h-2 w-2 rounded-full bg-volt" />
              <span className="font-display text-xl tracking-wider text-volt-white">RIDE</span>
              <Badge className="ml-2 bg-volt/20 text-volt text-xs">Admin</Badge>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setActiveNav(item.name)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                      activeNav === item.name
                        ? 'bg-volt text-volt-black font-medium'
                        : 'text-volt-muted hover:text-volt-white hover:bg-volt-panel'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                    {item.name === 'B2B Applications' && mockStats.pendingB2B > 0 && (
                      <Badge className="ml-auto bg-volt-orange text-volt-white text-xs">
                        {mockStats.pendingB2B}
                      </Badge>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-border">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2 text-sm text-volt-muted hover:text-volt-white transition-colors"
            >
              <Home className="h-4 w-4" />
              Back to Store
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 text-sm text-volt-muted hover:text-volt-orange transition-colors w-full"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-volt-black/90 backdrop-blur-md border-b border-border">
          <div className="px-4 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-2xl text-volt-white tracking-wide">DASHBOARD</h1>
                <p className="text-sm text-volt-muted">Welcome back, {user.firstName}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-sm text-volt-muted hidden sm:block">
                  {new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-4 lg:p-8">
          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Revenue */}
            <Card className="bg-volt-panel border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-volt-muted">Revenue This Month</CardTitle>
                <DollarSign className="h-4 w-4 text-volt" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-volt-white font-mono">
                  {formatPrice(mockStats.revenue.current)}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {mockStats.revenue.change >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-volt-teal" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-volt-orange" />
                  )}
                  <span className={`text-sm ${mockStats.revenue.change >= 0 ? 'text-volt-teal' : 'text-volt-orange'}`}>
                    {mockStats.revenue.change}%
                  </span>
                  <span className="text-sm text-volt-muted">vs last month</span>
                </div>
              </CardContent>
            </Card>

            {/* Orders */}
            <Card className="bg-volt-panel border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-volt-muted">Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-volt" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-volt-white">{mockStats.orders.current}</div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-volt-teal" />
                  <span className="text-sm text-volt-teal">{mockStats.orders.change}%</span>
                  <span className="text-sm text-volt-muted">vs last month</span>
                </div>
              </CardContent>
            </Card>

            {/* Customers */}
            <Card className="bg-volt-panel border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-volt-muted">Customers</CardTitle>
                <Users className="h-4 w-4 text-volt" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-volt-white">{mockStats.customers.current}</div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-volt-teal" />
                  <span className="text-sm text-volt-teal">{mockStats.customers.change}%</span>
                  <span className="text-sm text-volt-muted">new this month</span>
                </div>
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card className="bg-volt-panel border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-volt-muted">Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-volt-orange" />
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-volt-muted">Pending B2B</span>
                    <Badge className="bg-volt-orange/20 text-volt-orange">{mockStats.pendingB2B}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-volt-muted">Low Stock</span>
                    <Badge className="bg-volt/20 text-volt">{lowStockProducts.length}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Orders */}
            <div className="lg:col-span-2">
              <Card className="bg-volt-panel border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="font-display text-lg text-volt-white">RECENT ORDERS</CardTitle>
                  <Button variant="outline" size="sm" className="border-border text-volt-white hover:bg-volt-deep" asChild>
                    <Link href="/admin/orders">
                      View All
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-2 text-sm font-medium text-volt-muted">Order</th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-volt-muted">Customer</th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-volt-muted">Status</th>
                          <th className="text-right py-3 px-2 text-sm font-medium text-volt-muted">Total</th>
                          <th className="w-10"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockRecentOrders.map((order) => (
                          <tr key={order.id} className="border-b border-border last:border-0">
                            <td className="py-3 px-2">
                              <div>
                                <span className="font-mono text-sm text-volt-white">{order.number}</span>
                                <p className="text-xs text-volt-muted">{order.date}</p>
                              </div>
                            </td>
                            <td className="py-3 px-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-volt-white">{order.customer}</span>
                                {order.isB2B && (
                                  <Badge variant="outline" className="border-volt/50 text-volt text-xs">B2B</Badge>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-2">
                              <Badge className={orderStatusColors[order.status]}>{order.status}</Badge>
                            </td>
                            <td className="py-3 px-2 text-right">
                              <span className="font-mono text-sm text-volt-white">{formatPrice(order.total)}</span>
                            </td>
                            <td className="py-3 px-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-volt-muted hover:text-volt-white">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-volt-panel border-border">
                                  <DropdownMenuItem className="text-volt-white hover:bg-volt-deep cursor-pointer">
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions & Low Stock */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="bg-volt-panel border-border">
                <CardHeader>
                  <CardTitle className="font-display text-lg text-volt-white">QUICK ACTIONS</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full justify-start bg-volt text-volt-black hover:bg-volt/90" asChild>
                    <Link href="/admin/products/new">
                      <Package className="h-4 w-4 mr-2" />
                      Add New Product
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-border text-volt-white hover:bg-volt-deep" asChild>
                    <Link href="/admin/b2b">
                      <Building2 className="h-4 w-4 mr-2" />
                      Review B2B Applications
                      {mockStats.pendingB2B > 0 && (
                        <Badge className="ml-auto bg-volt-orange text-volt-white">{mockStats.pendingB2B}</Badge>
                      )}
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-border text-volt-white hover:bg-volt-deep" asChild>
                    <Link href="/admin/orders">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Manage Orders
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Low Stock Alert */}
              {lowStockProducts.length > 0 && (
                <Card className="bg-volt-panel border-border border-volt-orange/30">
                  <CardHeader>
                    <CardTitle className="font-display text-lg text-volt-white flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-volt-orange" />
                      LOW STOCK ALERT
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {lowStockProducts.map((product) => (
                      <div key={product.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-volt-white">{product.name}</p>
                          <p className="text-xs text-volt-muted">SKU: {product.sku}</p>
                        </div>
                        <Badge className="bg-volt-orange/20 text-volt-orange">
                          {product.stock} left
                        </Badge>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full border-border text-volt-white hover:bg-volt-deep mt-2" asChild>
                      <Link href="/admin/products">
                        Manage Inventory
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
