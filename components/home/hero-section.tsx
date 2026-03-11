'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Users, Shield, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'

const stats = [
  { icon: Users, value: '500+', label: 'Happy Riders' },
  { icon: Shield, value: 'Insured', label: 'Included' },
  { icon: Truck, value: 'Pickup', label: 'or delivery by request' },
]

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image – lighter overlay, radial so centre (bike) stays visible */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/c808f014-fe32-4edb-83bc-b2a20c105303-c4CtXdKyx94bjWlV9U8RI6hxbmuM2p.jpg"
          alt="VoltRide electric bike"
          fill
          className="object-cover opacity-55"
          priority
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_0%,rgba(11,11,14,0.4)_50%,var(--volt-black)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-volt-black/70 via-volt-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-volt-black/80 via-transparent to-volt-black/30" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 grid-pattern opacity-30 z-[1]" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32 lg:py-40 w-full flex flex-col items-center text-center">
        <div className="max-w-2xl w-full">
          {/* Badge – no border, dot with LED pulse, premium letter-spacing */}
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="h-2 w-2 rounded-full bg-volt hero-badge-dot" />
            <span className="text-sm text-volt font-medium tracking-widest uppercase">E-bikes, parts & mobile service</span>
          </div>

          {/* Heading – no mini bike for cleaner focus on CTA and background product */}
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-volt-white leading-none tracking-wide">
            RIDE THE
            <br />
            <span className="text-volt text-glow">FUTURE</span>
          </h1>

          {/* Subheading – lighter for readability */}
          <p className="mt-6 text-lg sm:text-xl max-w-lg leading-relaxed mx-auto text-[#E0E0E0]">
            Buy high-performance e-bikes and parts. Parts ship via Australia Post; bikes pickup or delivery by arrangement. Mobile servicing available.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mt-8 justify-center">
            <Button
              size="lg"
              className="bg-volt text-volt-black hover:bg-volt/90 font-semibold text-base px-8"
              asChild
            >
              <Link href="/products">
                Shop e-bikes
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white/25 text-volt-white hover:bg-volt-panel hover:border-white/40 font-semibold text-base px-8"
              asChild
            >
              <Link href="/service">Service</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-border justify-center">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="p-2 bg-volt/10 rounded-lg">
                  <stat.icon className="h-5 w-5 text-volt" />
                </div>
                <div>
                  <p className="font-display text-2xl text-volt-white">{stat.value}</p>
                  <p className="text-sm text-[#E0E0E0]/90">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="text-xs text-[#E0E0E0] uppercase tracking-widest">Scroll</span>
        <div className="w-0.5 h-8 bg-gradient-to-b from-volt to-transparent" />
      </div>
    </section>
  )
}
