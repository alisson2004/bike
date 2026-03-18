'use client'

import { useEffect } from 'react'
import { MapPin, Navigation, ArrowRight, Package, Bike } from 'lucide-react'
import { Button } from '@/components/ui/button'

const STORE_MAPS_URL = 'https://www.google.com/maps/place/27%C2%B027\'36.6%22S+153%C2%B002\'11.6%22E/@-27.4601596,153.0339748,1012m/data=!3m2!1e3!4b1!4m4!3m3!8m2!3d-27.4601596!4d153.0365497!18m1!1e1?entry=ttu'
const STORE_EMBED_URL = 'https://www.google.com/maps?q=-27.4601596,153.0365497&z=16&output=embed'

export function LocationSection() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#visit') {
      document.getElementById('visit')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  return (
    <section id="visit" className="relative py-20 lg:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-volt-deep" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(200,241,53,0.08)_0%,transparent_50%)]" />
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="h-2 w-2 rounded-full bg-volt hero-badge-dot" />
            <span className="text-sm text-volt font-medium tracking-widest uppercase">Visit us</span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-volt-white tracking-wide mb-4">
            COME & PICK UP
          </h2>
          <p className="text-lg sm:text-xl text-[#E0E0E0] max-w-2xl mx-auto mb-10">
            Try e-bikes in person, grab your parts, or collect your order. We&apos;re here for you.
          </p>

          {/* Embedded interactive map */}
          <div className="rounded-2xl border-2 border-volt/40 bg-volt-black/90 backdrop-blur-sm overflow-hidden shadow-[0_0_40px_rgba(200,241,53,0.12)] mb-8">
            <div className="relative aspect-[16/9] min-h-[280px] sm:min-h-[320px] w-full">
              <iframe
                src={STORE_EMBED_URL}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="VoltRide store location"
                className="absolute inset-0 w-full h-full"
              />
              {/* Corner link to open in Google Maps */}
              <a
                href={STORE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-volt text-volt-black font-semibold text-sm shadow-lg hover:bg-volt/90 transition-colors"
              >
                <Navigation className="h-4 w-4" />
                Open in Google Maps
              </a>
            </div>
            <div className="px-6 py-4 border-t border-border flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-volt-muted">
              <span>Zoom and pan the map — or open for directions</span>
              <span className="text-volt font-medium">Our store</span>
            </div>
          </div>

          <Button
            size="lg"
            className="bg-volt text-volt-black hover:bg-volt/90 font-semibold text-base px-8"
            asChild
          >
            <a href={STORE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Get directions
              <ArrowRight className="h-5 w-5" />
            </a>
          </Button>

          <div className="mt-10 flex flex-wrap justify-center gap-8 sm:gap-12 text-sm">
            <div className="flex items-center gap-3 text-[#E0E0E0]">
              <div className="p-2 rounded-lg bg-volt/10">
                <Bike className="h-5 w-5 text-volt" />
              </div>
              <span>E-bikes · pickup only</span>
            </div>
            <div className="flex items-center gap-3 text-[#E0E0E0]">
              <div className="p-2 rounded-lg bg-volt/10">
                <Package className="h-5 w-5 text-volt" />
              </div>
              <span>Parts · ship or pickup</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
