import Link from 'next/link'
import { FileQuestion } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { CartSidebar } from '@/components/layout/cart-sidebar'

export function PlaceholderPage() {
  return (
    <div className="min-h-screen bg-volt-black">
      <Header />
      <CartSidebar />
      <main className="pt-16 min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-volt-panel rounded-lg border border-border p-8 lg:p-12">
          <div className="w-16 h-16 mx-auto rounded-full bg-volt/10 flex items-center justify-center mb-6">
            <FileQuestion className="h-8 w-8 text-volt" />
          </div>
          <p className="text-sm font-medium text-volt uppercase tracking-wider mb-2">
            Homologation site
          </p>
          <h1 className="font-display text-2xl sm:text-3xl text-volt-white tracking-wide mb-3">
            This page does not exist yet
          </h1>
          <p className="text-volt-muted text-sm mb-8">
            This is a staging / homologation environment. The content for this page has not been implemented yet.
          </p>
          <Button className="bg-volt text-volt-black hover:bg-volt/90 font-semibold" asChild>
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
