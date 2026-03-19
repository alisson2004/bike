import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Wrench } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function RentPage() {
  return (
    <div className="min-h-screen bg-volt-black">
      <Header />
      <main className="pt-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-volt/10 mb-8">
            <Wrench className="h-10 w-10 text-volt" />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-volt-white tracking-wide mb-4">RENT</h1>
          <p className="text-lg text-[#E0E0E0] mb-10 max-w-xl mx-auto">
            Bike rentals are coming soon. For maintenance and support, please visit our service page.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-volt text-volt-black hover:bg-volt/90 font-semibold" asChild>
              <Link href="/service">Go to Service</Link>
            </Button>
            <Button variant="outline" className="border-border text-volt-white hover:bg-volt-panel font-semibold" asChild>
              <Link href="/contact">Contact</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

