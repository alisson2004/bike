import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { categories } from '@/lib/data'

export function CategoriesSection() {
  return (
    <section className="py-16 lg:py-24 bg-volt-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-volt-white tracking-wide">
            SHOP BY CATEGORY
          </h2>
          <p className="mt-2 text-volt-muted max-w-xl mx-auto">
            Find the right bike or part. Mountain, city, cargo, folding and accessories.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center text-volt hover:text-volt/80 transition-colors font-medium mt-4"
          >
            View all
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories
            .filter(category => category.id !== 'cat-parts' && !category.parentId)
            .map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group relative aspect-[3/4] rounded-lg overflow-hidden card-glow"
            >
              {/* Image */}
              {category.imageUrl ? (
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
              ) : (
                <div className="absolute inset-0 bg-volt-panel" />
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-volt-black via-volt-black/50 to-transparent" />

              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3 className="font-display text-lg sm:text-xl text-volt-white group-hover:text-volt transition-colors">
                  {category.name.toUpperCase()}
                </h3>
                <p className="text-xs text-volt-muted mt-1 line-clamp-2 hidden sm:block">
                  {category.description}
                </p>
              </div>

              {/* Hover Border */}
              <div className="absolute inset-0 border border-transparent group-hover:border-volt/50 rounded-lg transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
