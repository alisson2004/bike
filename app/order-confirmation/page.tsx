import { Suspense } from 'react'
import { OrderConfirmationContent, OrderConfirmationFallback } from './OrderConfirmationClient'

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<OrderConfirmationFallback />}>
      <OrderConfirmationContent />
    </Suspense>
  )
}
