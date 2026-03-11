import Link from 'next/link'
import { Package, Bike, Mail } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-volt-black">
      <Header />
      <main className="pt-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <h1 className="font-display text-3xl sm:text-4xl text-volt-white tracking-wide mb-2">
            PICKUP & DELIVERY
          </h1>
          <p className="text-volt-muted mb-10">
            How we get your order to you across Australia.
          </p>

          <div className="space-y-10">
            {/* Parts & accessories */}
            <section className="bg-volt-panel rounded-lg border border-border p-6 lg:p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-volt/10 rounded-lg flex-shrink-0">
                  <Package className="h-6 w-6 text-volt" />
                </div>
                <div>
                  <h2 className="font-display text-xl text-volt-white mb-2">
                    Parts & accessories
                  </h2>
                  <p className="text-volt-muted mb-3">
                    Small items (parts, accessories, components) are sent via <strong className="text-volt-white">Australia Post</strong> to all Australian states and territories. Standard and express options are available at checkout; free shipping may apply on larger orders.
                  </p>
                  <p className="text-sm text-volt-muted">
                    Delivery times vary by location (typically 3–7 business days standard). We&apos;ll send tracking once your order is dispatched.
                  </p>
                </div>
              </div>
            </section>

            {/* E-bikes */}
            <section className="bg-volt-panel rounded-lg border border-border p-6 lg:p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-volt/10 rounded-lg flex-shrink-0">
                  <Bike className="h-6 w-6 text-volt" />
                </div>
                <div>
                  <h2 className="font-display text-xl text-volt-white mb-2">
                    E-bikes
                  </h2>
                  <p className="text-volt-muted mb-3">
                    E-bikes are available by <strong className="text-volt-white">pickup</strong> or <strong className="text-volt-white">delivery by arrangement</strong>. We don&apos;t ship bikes via standard courier; after you order, we&apos;ll contact you to confirm either collection from our location or a delivery option (e.g. dedicated transport) and timing.
                  </p>
                  <p className="text-sm text-volt-muted">
                    This keeps bikes safe and lets us align with your schedule. Questions? Get in touch before ordering.
                  </p>
                </div>
              </div>
            </section>

            <section className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className="bg-volt text-volt-black hover:bg-volt/90" asChild>
                <Link href="/contact">
                  <Mail className="mr-2 h-4 w-4" />
                  Contact us
                </Link>
              </Button>
              <Button variant="outline" className="border-border text-volt-white hover:bg-volt-panel" asChild>
                <Link href="/products">Shop e-bikes & parts</Link>
              </Button>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
