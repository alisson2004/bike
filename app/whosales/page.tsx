import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Package } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function WhosalesPage() {
  return (
    <div className="min-h-screen bg-volt-black">
      <Header />
      <main className="pt-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-volt/10 mb-8">
            <Package className="h-10 w-10 text-volt" />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-volt-white tracking-wide mb-4">Whosales</h1>
          <p className="text-lg text-[#E0E0E0] mb-10 max-w-xl mx-auto">
            Wholesale is available for businesses and fleet customers. Use the link below to apply.
          </p>
          <Button className="bg-volt text-volt-black hover:bg-volt/90 font-semibold" asChild>
            <Link href="/b2b">Go to Wholesale / Fleet</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}

