import Link from 'next/link'
import { Package, Bike, Mail, MapPin } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'

const STORE_MAPS_URL = 'https://www.google.com/maps/place/27%C2%B027\'36.6%22S+153%C2%B002\'11.6%22E/@-27.4601596,153.0339748,1012m/data=!3m2!1e3!4b1!4m4!3m3!8m2!3d-27.4601596!4d153.0365497!18m1!1e1?entry=ttu'

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
            Parts ship Australia-wide. E-bikes are pickup only at our store.
          </p>

          <div className="space-y-10">
            {/* Store location – prominent */}
            <section className="bg-volt-panel rounded-xl border-2 border-volt/30 p-6 lg:p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-volt/20 rounded-lg flex-shrink-0">
                  <MapPin className="h-6 w-6 text-volt" />
                </div>
                <div className="flex-1">
                  <h2 className="font-display text-xl text-volt-white mb-2">
                    Our store
                  </h2>
                  <p className="text-volt-muted mb-4">
                    Visit us to try e-bikes, collect your order, or browse parts in person.
                  </p>
                  <Button className="bg-volt text-volt-black hover:bg-volt/90" asChild>
                    <a href={STORE_MAPS_URL} target="_blank" rel="noopener noreferrer">
                      Get directions
                    </a>
                  </Button>
                </div>
              </div>
            </section>

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
                    Small items ship via <strong className="text-volt-white">Australia Post</strong> Australia-wide. Standard and express at checkout; free shipping may apply on larger orders.
                  </p>
                  <p className="text-sm text-volt-muted">
                    Typically 3–7 business days. We&apos;ll send tracking once dispatched.
                  </p>
                </div>
              </div>
            </section>

            {/* E-bikes – pickup only */}
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
                    E-bikes are <strong className="text-volt-white">pickup only</strong> at our store. We don&apos;t ship bikes; you order online and collect in person.
                  </p>
                  <p className="text-sm text-volt-muted">
                    Get directions above to plan your visit.
                  </p>
                </div>
              </div>
            </section>

            <section className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className="bg-volt text-volt-black hover:bg-volt/90" asChild>
                <a href={STORE_MAPS_URL} target="_blank" rel="noopener noreferrer">
                  <MapPin className="mr-2 h-4 w-4" />
                  Get directions
                </a>
              </Button>
              <Button variant="outline" className="border-border text-volt-white hover:bg-volt-panel" asChild>
                <Link href="/contact">
                  <Mail className="mr-2 h-4 w-4" />
                  Contact us
                </Link>
              </Button>
              <Button variant="outline" className="border-border text-volt-white hover:bg-volt-panel" asChild>
                <Link href="/products">Shop parts & bikes</Link>
              </Button>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
