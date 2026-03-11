'use client'

import { useRef, useEffect, useState } from 'react'
import { Star, Quote, BadgeCheck } from 'lucide-react'
import { reviews } from '@/lib/data'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from '@/components/ui/carousel'

const trustStats = [
  { value: '4.9', label: 'Average Rating' },
  { value: '500+', label: 'Happy Riders' },
  { value: '98%', label: 'Would Recommend' },
]

export function ReviewsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setVisible(true)
      },
      { threshold: 0.2, rootMargin: '0px 0px -40px 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Simple autoplay for the reviews carousel
  useEffect(() => {
    if (!carouselApi) return
    const id = setInterval(() => {
      carouselApi.scrollNext()
    }, 7000)
    return () => clearInterval(id)
  }, [carouselApi])

  return (
    <section className="py-16 lg:py-24 bg-volt-deep">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-volt-white tracking-wide">
            WHAT RIDERS SAY
          </h2>
          <p className="mt-4 text-volt-muted max-w-2xl mx-auto">
            Don&apos;t just take our word for it. Here&apos;s what our customers have to say about their VoltRide experience.
          </p>
        </div>

        {/* Reviews Carousel – auto-rolling comments */}
        <Carousel
          className="w-full"
          opts={{ loop: true, align: 'start' }}
          setApi={setCarouselApi}
        >
          <CarouselContent className="py-2">
            {reviews.map((review) => (
              <CarouselItem
                key={review.id}
                className="md:basis-1/2 lg:basis-1/3"
              >
                <div className="bg-volt-panel rounded-lg border border-border p-6 relative card-glow h-full flex flex-col">
                  {/* Quote Icon */}
                  <Quote className="absolute top-4 right-4 h-8 w-8 text-volt/20" />

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? 'fill-volt text-volt' : 'text-volt-muted'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Title */}
                  {review.title && (
                    <h3 className="font-semibold text-volt-white mb-2">
                      {review.title}
                    </h3>
                  )}

                  {/* Body */}
                  <p className="text-volt-muted text-sm leading-relaxed flex-1">
                    {review.body}
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border">
                    <div className="w-10 h-10 rounded-full bg-volt/20 flex items-center justify-center">
                      <span className="text-volt font-semibold">
                        {review.user?.firstName?.[0]}
                        {review.user?.lastName?.[0]}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-volt-white">
                          {review.user?.firstName} {review.user?.lastName?.[0]}.
                        </span>
                        {review.isVerified && (
                          <BadgeCheck className="h-4 w-4 text-volt-teal" />
                        )}
                      </div>
                      <span className="text-xs text-volt-muted">Verified Buyer</span>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-end gap-2 mt-4">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </Carousel>

        {/* Trust Indicators – crescendo animation when in view */}
        <div
          ref={ref}
          className="flex flex-wrap justify-center items-center gap-8 mt-12 pt-8 border-t border-border"
        >
          {trustStats
            .map((stat, i) => (
              <div
                key={stat.label}
                className={`text-center transition-all duration-700 ease-out ${
                  visible
                    ? 'opacity-100 scale-100 translate-y-0'
                    : 'opacity-0 scale-75 translate-y-4'
                }`}
                style={visible ? { transitionDelay: `${i * 120}ms` } : undefined}
              >
                <p
                  className={`font-display text-3xl ${
                    i === 0 ? 'text-volt' : 'text-volt-white'
                  }`}
                >
                  {stat.value}
                </p>
                <p className="text-sm text-volt-muted">{stat.label}</p>
              </div>
            ))
            .flatMap((node, i) =>
              i === 0
                ? [node]
                : [
                    <div
                      key={`sep-${i}`}
                      className="h-8 w-px bg-border hidden sm:block"
                    />,
                    node,
                  ],
            )}
        </div>
      </div>
    </section>
  )
}

