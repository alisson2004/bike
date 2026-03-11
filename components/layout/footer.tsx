import Link from 'next/link'
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube } from 'lucide-react'

const footerLinks = {
  shop: [
    { name: 'All Bikes', href: '/products' },
    { name: 'Mountain', href: '/products?category=mountain-ebikes' },
    { name: 'City', href: '/products?category=city-commuters' },
    { name: 'Cargo', href: '/products?category=cargo-ebikes' },
    { name: 'Folding', href: '/products?category=folding-ebikes' },
  ],
  support: [
    { name: 'Contact', href: '/contact' },
    { name: 'Pickup & delivery', href: '/shipping' },
    { name: 'Policies', href: '/returns' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Service', href: '/service' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Business / Fleet', href: '/b2b' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-volt-deep border-t border-border">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-1 mb-4">
              <span className="font-display text-2xl tracking-wider text-volt-white">
                VOLT
              </span>
              <span className="h-2 w-2 rounded-full bg-volt" />
              <span className="font-display text-2xl tracking-wider text-volt-white">
                RIDE
              </span>
            </Link>
            <p className="text-volt-muted text-sm mb-6 max-w-xs">
              Electric bike sales, parts and mobile servicing across Australia. Ride with VoltRide.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm">
              <a 
                href="mailto:hello@voltride.com.au" 
                className="flex items-center gap-2 text-volt-muted hover:text-volt transition-colors"
              >
                <Mail className="h-4 w-4" />
                hello@voltride.com.au
              </a>
              <a 
                href="tel:1300VOLTRIDE" 
                className="flex items-center gap-2 text-volt-muted hover:text-volt transition-colors"
              >
                <Phone className="h-4 w-4" />
                1300 VOLTRIDE
              </a>
              <div className="flex items-center gap-2 text-volt-muted">
                <MapPin className="h-4 w-4" />
                Sydney, Australia
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 mt-6">
              <a 
                href="https://instagram.com/voltride" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-volt-muted hover:text-volt transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a 
                href="https://facebook.com/voltride" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-volt-muted hover:text-volt transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a 
                href="https://youtube.com/voltride" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-volt-muted hover:text-volt transition-colors"
              >
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-semibold text-volt-white mb-4">Rent</h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm text-volt-muted hover:text-volt-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-volt-white mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm text-volt-muted hover:text-volt-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-volt-white mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm text-volt-muted hover:text-volt-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-volt-white mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm text-volt-muted hover:text-volt-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-volt-muted">
              &copy; {new Date().getFullYear()} VoltRide Australia. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-sm text-volt-muted">
                ABN: 12 345 678 901
              </span>
              <span className="text-volt-muted">|</span>
              <span className="text-sm text-volt-muted">
                Made with ⚡ in Sydney
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
