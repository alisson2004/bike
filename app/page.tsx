import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CartSidebar } from '@/components/layout/cart-sidebar'
import { HeroSection } from '@/components/home/hero-section'
import { LocationSection } from '@/components/home/location-section'
import { MarqueeStrip } from '@/components/home/marquee-strip'
import { CategoriesSection } from '@/components/home/categories-section'
import { FeaturedProductsSection } from '@/components/home/featured-products-section'
import { FeaturesBand } from '@/components/home/features-band'
import { ServicesSection } from '@/components/home/services-section'
import { ReviewsSection } from '@/components/home/reviews-section'
import { B2BSection } from '@/components/home/b2b-section'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-volt-black">
      <Header />
      <CartSidebar />
      
      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Location / Visit us – prominent */}
        <LocationSection />
        
        {/* Marquee Strip */}
        <MarqueeStrip />
        
        {/* Categories */}
        <CategoriesSection />
        
        {/* Featured Products */}
        <FeaturedProductsSection />
        
        {/* Features Band */}
        <FeaturesBand />
        
        {/* Services */}
        <ServicesSection />
        
        {/* Reviews */}
        <ReviewsSection />
        
        {/* B2B Section */}
        <B2BSection />
      </main>
      
      <Footer />
    </div>
  )
}
