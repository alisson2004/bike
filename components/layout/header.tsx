'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

function useMounted() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}
import { Menu, X, ShoppingCart, User, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCartStore, useAuthStore } from '@/lib/store'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Rent', href: '/products' },
  { 
    name: 'Categories', 
    href: '#',
    children: [
      { name: 'Mountain', href: '/products?category=mountain-ebikes' },
      { name: 'City', href: '/products?category=city-commuters' },
      { name: 'Cargo', href: '/products?category=cargo-ebikes' },
      { name: 'Folding', href: '/products?category=folding-ebikes' },
      { name: 'Accessories', href: '/products?category=parts-accessories' },
    ]
  },
  { name: 'About', href: '/about' },
  { name: 'Business', href: '/b2b' },
  { name: 'Contact', href: '/contact' },
]

export function Header() {
  const router = useRouter()
  const mounted = useMounted()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { openCart, getItemCount } = useCartStore()
  const { user, clearUser } = useAuthStore()
  const itemCount = getItemCount()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled 
          ? 'bg-volt-black/90 backdrop-blur-md border-b border-border' 
          : 'bg-transparent'
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1">
            <span className="font-display text-2xl tracking-wider text-volt-white">
              VOLT
            </span>
            <span className="h-2 w-2 rounded-full bg-volt" />
            <span className="font-display text-2xl tracking-wider text-volt-white">
              RIDE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-8">
            {navigation.map((item) => (
              item.children ? (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger className="flex items-center gap-1 text-sm text-[#E0E0E0] hover:text-volt-white transition-colors">
                    {item.name}
                    <ChevronDown className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="bg-volt-panel border-border">
                    {item.children.map((child) => (
                      <DropdownMenuItem key={child.name} asChild>
                        <Link 
                          href={child.href}
                          className="text-volt-white hover:text-volt cursor-pointer"
                        >
                          {child.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm text-[#E0E0E0] hover:text-volt-white transition-colors relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-volt transition-all group-hover:w-full" />
                </Link>
              )
            ))}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-4">
            {/* Account */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-[#E0E0E0] hover:text-volt-white">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-volt-panel border-border w-48">
                {user ? (
                  <>
                    <div className="px-2 py-1.5 text-sm text-volt-muted">
                      Hi, {user.firstName}
                      {user.role === 'WHOLESALE' && (
                        <Badge variant="outline" className="ml-2 border-volt text-volt text-xs">
                          Business
                        </Badge>
                      )}
                    </div>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem asChild>
                      <Link href="/account" className="cursor-pointer text-volt-white">
                        My Account
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account/orders" className="cursor-pointer text-volt-white">
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                    {user.role === 'ADMIN' && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer text-volt">
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem
                      className="cursor-pointer text-volt-orange"
                      onClick={async () => {
                        const supabase = createClient()
                        await supabase.auth.signOut()
                        clearUser()
                        router.push('/')
                      }}
                    >
                      Sign Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login" className="cursor-pointer text-volt-white">
                        Sign In
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/register" className="cursor-pointer text-volt-white">
                        Create Account
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem asChild>
                      <Link href="/b2b" className="cursor-pointer text-volt">
                        Business / Fleet
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart - badge only after mount to avoid hydration mismatch with persisted cart */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-[#E0E0E0] hover:text-volt-white relative"
              onClick={openCart}
            >
              <ShoppingCart className="h-5 w-5" />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-volt text-volt-black text-xs font-bold flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
              <span className="sr-only">Cart{mounted && itemCount > 0 ? ` (${itemCount} items)` : ''}</span>
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-[#E0E0E0] hover:text-volt-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-volt-deep/95 backdrop-blur-md">
            <div className="space-y-1 py-4">
              {navigation.map((item) => (
                item.children ? (
                  <div key={item.name} className="space-y-1">
                    <div className="px-4 py-2 text-sm font-medium text-volt-white">
                      {item.name}
                    </div>
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className="block px-8 py-2 text-sm text-[#E0E0E0] hover:text-volt-white hover:bg-volt-panel transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-2 text-sm font-medium text-[#E0E0E0] hover:text-volt-white hover:bg-volt-panel transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
