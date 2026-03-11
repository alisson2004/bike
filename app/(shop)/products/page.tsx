import { Suspense } from 'react'
import { ProductsPageContent, ProductsPageFallback } from './ProductsPageClient'

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageFallback />}>
      <ProductsPageContent />
    </Suspense>
  )
}
