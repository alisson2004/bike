'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ChevronLeft, 
  MapPin, 
  Truck, 
  CreditCard, 
  Check,
  Lock,
  ShoppingBag
} from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCartStore, useAuthStore } from '@/lib/store'
import { formatPrice, shippingZones } from '@/lib/data'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const steps = [
  { id: 1, name: 'Address', icon: MapPin },
  { id: 2, name: 'Shipping', icon: Truck },
  { id: 3, name: 'Payment', icon: CreditCard },
]

const australianStates = [
  { value: 'NSW', label: 'New South Wales' },
  { value: 'VIC', label: 'Victoria' },
  { value: 'QLD', label: 'Queensland' },
  { value: 'SA', label: 'South Australia' },
  { value: 'WA', label: 'Western Australia' },
  { value: 'TAS', label: 'Tasmania' },
  { value: 'NT', label: 'Northern Territory' },
  { value: 'ACT', label: 'Australian Capital Territory' },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getSubtotal, getGst, clearCart, qualifiesForFreeShipping } = useCartStore()
  const { user } = useAuthStore()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Form state
  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postcode: '',
  })
  
  const [selectedShipping, setSelectedShipping] = useState('')

  const subtotal = getSubtotal()
  const gst = getGst()
  const freeShipping = qualifiesForFreeShipping()

  // E-bikes are pickup only; parts can ship via Australia Post
  const cartHasBikes = items.some(
    (item) => item.product.categoryId && item.product.categoryId !== 'cat-parts'
  )

  const baseRates = address.state
    ? shippingZones.find((z) => z.states.includes(address.state))?.rates ?? []
    : []

  const STORE_PICKUP_ID = 'store-pickup'
  // When cart has any bike, only option is store pickup (no shipping for bikes)
  const shippingRates = cartHasBikes
    ? [
        {
          id: STORE_PICKUP_ID,
          zoneId: '',
          name: 'Store pickup',
          carrier: 'Collect at our store',
          price: 0,
          estimatedDays: '—',
        },
      ]
    : baseRates

  const selectedRate = shippingRates.find((r) => r.id === selectedShipping)
  const shippingCost =
    selectedRate?.id === STORE_PICKUP_ID
      ? 0
      : selectedRate
        ? freeShipping && selectedRate.isFreeOver && subtotal >= (selectedRate.isFreeOver ?? 0)
          ? 0
          : selectedRate.price ?? 0
        : 0

  const total = subtotal + gst + shippingCost

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-volt-black">
        <Header />
        <main className="pt-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center bg-volt-panel rounded-lg border border-border p-12">
              <ShoppingBag className="h-16 w-16 mx-auto text-volt-muted mb-4" />
              <h1 className="text-2xl font-semibold text-volt-white mb-2">Your cart is empty</h1>
              <p className="text-volt-muted mb-6">Add items to your cart before checkout.</p>
              <Button className="bg-volt text-volt-black hover:bg-volt/90" asChild>
                <Link href="/products">Shop bikes & parts</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const validateStep = (step: number) => {
    if (step === 1) {
      if (!address.firstName || !address.lastName || !address.email || !address.phone ||
          !address.line1 || !address.city || !address.state || !address.postcode) {
        toast.error('Please fill in all required fields')
        return false
      }
      if (!/^\d{4}$/.test(address.postcode)) {
        toast.error('Please enter a valid 4-digit postcode')
        return false
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) {
        toast.error('Please enter a valid email address')
        return false
      }
    }
    if (step === 2) {
      if (!selectedShipping) {
        toast.error('Please select a shipping method')
        return false
      }
    }
    return true
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    setIsProcessing(true)
    try {
      // Use NEXT_PUBLIC_APP_URL in production (e.g. Railway) so redirects go to the deployed URL, not localhost
      const baseUrl =
        typeof window !== 'undefined'
          ? (process.env.NEXT_PUBLIC_APP_URL || window.location.origin)
          : (process.env.NEXT_PUBLIC_APP_URL || '')
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lineItems: items.map((item) => ({
            name: item.product.name,
            quantity: item.quantity,
            amountCents: Math.round(item.priceSnap * 100),
            image: item.product.images[0]?.url,
          })),
          successUrl: `${baseUrl}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${baseUrl}/checkout?canceled=1`,
          customerEmail: address.email || undefined,
          userId: user?.id ?? undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Checkout failed')
      if (data.url) {
        window.location.href = data.url
        return
      }
      throw new Error('No checkout URL')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao iniciar pagamento.')
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-volt-black">
      <Header />

      <main className="pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Link */}
          <Link 
            href="/cart"
            className="inline-flex items-center text-volt-muted hover:text-volt-white transition-colors mb-6"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Cart
          </Link>

          {/* Progress Steps */}
          <div className="mb-8">
            <nav aria-label="Progress">
              <ol className="flex items-center justify-center">
                {steps.map((step, index) => (
                  <li key={step.id} className={cn('relative', index !== steps.length - 1 && 'pr-8 sm:pr-20')}>
                    {index !== steps.length - 1 && (
                      <div 
                        className={cn(
                          'absolute top-4 right-0 w-full h-0.5',
                          currentStep > step.id ? 'bg-volt' : 'bg-border'
                        )} 
                        aria-hidden="true" 
                      />
                    )}
                    <button
                      onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                      disabled={step.id > currentStep}
                      className={cn(
                        'relative flex flex-col items-center group',
                        step.id <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed'
                      )}
                    >
                      <span className={cn(
                        'w-8 h-8 flex items-center justify-center rounded-full border-2 transition-colors',
                        currentStep === step.id && 'border-volt bg-volt text-volt-black',
                        currentStep > step.id && 'border-volt bg-volt text-volt-black',
                        currentStep < step.id && 'border-border bg-volt-panel text-volt-muted'
                      )}>
                        {currentStep > step.id ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <step.icon className="h-4 w-4" />
                        )}
                      </span>
                      <span className={cn(
                        'mt-2 text-xs font-medium',
                        currentStep >= step.id ? 'text-volt-white' : 'text-volt-muted'
                      )}>
                        {step.name}
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              {/* Step 1: Address */}
              {currentStep === 1 && (
                <div className="bg-volt-panel rounded-lg border border-border p-6">
                  <h2 className="font-display text-xl text-volt-white mb-6">ADDRESS</h2>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-volt-white">First Name *</Label>
                      <Input
                        id="firstName"
                        value={address.firstName}
                        onChange={(e) => setAddress({ ...address, firstName: e.target.value })}
                        className="bg-volt-deep border-border text-volt-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-volt-white">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={address.lastName}
                        onChange={(e) => setAddress({ ...address, lastName: e.target.value })}
                        className="bg-volt-deep border-border text-volt-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-volt-white">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={address.email}
                        onChange={(e) => setAddress({ ...address, email: e.target.value })}
                        className="bg-volt-deep border-border text-volt-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-volt-white">Phone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={address.phone}
                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                        className="bg-volt-deep border-border text-volt-white"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <Label htmlFor="line1" className="text-volt-white">Address Line 1 *</Label>
                      <Input
                        id="line1"
                        value={address.line1}
                        onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                        placeholder="Street address"
                        className="bg-volt-deep border-border text-volt-white placeholder:text-volt-muted"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <Label htmlFor="line2" className="text-volt-white">Address Line 2</Label>
                      <Input
                        id="line2"
                        value={address.line2}
                        onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                        placeholder="Apartment, suite, unit, etc. (optional)"
                        className="bg-volt-deep border-border text-volt-white placeholder:text-volt-muted"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-volt-white">City *</Label>
                      <Input
                        id="city"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        className="bg-volt-deep border-border text-volt-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-volt-white">State *</Label>
                      <Select 
                        value={address.state} 
                        onValueChange={(value) => {
                          setAddress({ ...address, state: value })
                          setSelectedShipping('')
                        }}
                      >
                        <SelectTrigger className="bg-volt-deep border-border text-volt-white">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent className="bg-volt-panel border-border">
                          {australianStates.map((state) => (
                            <SelectItem key={state.value} value={state.value}>
                              {state.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postcode" className="text-volt-white">Postcode *</Label>
                      <Input
                        id="postcode"
                        value={address.postcode}
                        onChange={(e) => setAddress({ ...address, postcode: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                        placeholder="0000"
                        maxLength={4}
                        className="bg-volt-deep border-border text-volt-white placeholder:text-volt-muted"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button 
                      onClick={nextStep}
                      className="bg-volt text-volt-black hover:bg-volt/90 font-semibold"
                    >
                      Continue to delivery
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Shipping */}
              {currentStep === 2 && (
                <div className="bg-volt-panel rounded-lg border border-border p-6">
                  <h2 className="font-display text-xl text-volt-white mb-2">DELIVERY</h2>
                  <p className="text-sm text-volt-muted mb-6">
                    {cartHasBikes
                      ? 'E-bikes are pickup only at our store. We\'ll confirm collection with you.'
                      : 'Parts & accessories ship via Australia Post.'}
                  </p>
                  <div className="mb-4 p-4 bg-volt-deep rounded-lg">
                    <p className="text-sm text-volt-muted">Delivering to:</p>
                    <p className="text-volt-white">
                      {address.firstName} {address.lastName}
                    </p>
                    <p className="text-volt-muted text-sm">
                      {address.line1}, {address.city}, {address.state} {address.postcode}
                    </p>
                  </div>

                  <RadioGroup 
                    value={selectedShipping} 
                    onValueChange={setSelectedShipping}
                    className="space-y-3"
                  >
                    {shippingRates.map((rate) => {
                      const isStorePickup = rate.id === STORE_PICKUP_ID
                      const isFree =
                        !isStorePickup &&
                        freeShipping &&
                        rate.isFreeOver != null &&
                        subtotal >= rate.isFreeOver
                      return (
                        <label
                          key={rate.id}
                          className={cn(
                            'flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors',
                            selectedShipping === rate.id
                              ? 'border-volt bg-volt/10'
                              : 'border-border hover:border-volt/50'
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value={rate.id} id={rate.id} className="border-volt text-volt" />
                            <div>
                              <p className="font-medium text-volt-white">{rate.name}</p>
                              <p className="text-sm text-volt-muted">
                                {rate.carrier}
                                {rate.estimatedDays && rate.estimatedDays !== '—'
                                  ? ` - ${rate.estimatedDays}`
                                  : ''}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            {isStorePickup || isFree ? (
                              <>
                                <p className="font-semibold text-volt">FREE</p>
                                {isFree && !isStorePickup && (rate.price ?? 0) > 0 && (
                                  <p className="text-xs text-volt-muted line-through">
                                    {formatPrice(rate.price ?? 0)}
                                  </p>
                                )}
                              </>
                            ) : (
                              <p className="font-mono font-semibold text-volt-white">
                                {formatPrice(rate.price ?? 0)}
                              </p>
                            )}
                          </div>
                        </label>
                      )
                    })}
                  </RadioGroup>

                  <div className="mt-6 flex justify-between">
                    <Button 
                      variant="outline"
                      onClick={prevStep}
                      className="border-border text-volt-white hover:bg-volt-deep"
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={nextStep}
                      className="bg-volt text-volt-black hover:bg-volt/90 font-semibold"
                    >
                      Continue to payment
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment (Stripe Checkout) */}
              {currentStep === 3 && (
                <div className="bg-volt-panel rounded-lg border border-border p-6">
                  <h2 className="font-display text-xl text-volt-white mb-6">PAYMENT</h2>
                  
                  <p className="text-volt-muted mb-6">
                    You will be redirected to Stripe to pay securely. We do not store card details.
                  </p>

                  <div className="mt-6 p-4 bg-volt-deep rounded-lg flex items-center gap-3">
                    <Lock className="h-5 w-5 text-volt" />
                    <p className="text-sm text-volt-muted">
                      Secure checkout via Stripe (test mode). Use card 4242 4242 4242 4242.
                    </p>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <Button 
                      variant="outline"
                      onClick={prevStep}
                      className="border-border text-volt-white hover:bg-volt-deep"
                      disabled={isProcessing}
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={handleSubmit}
                      disabled={isProcessing}
                      className="bg-volt text-volt-black hover:bg-volt/90 font-semibold min-w-[160px]"
                    >
                      {isProcessing ? 'Redirecting...' : `Pay ${formatPrice(total)} with Stripe`}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-volt-panel rounded-lg border border-border p-6 sticky top-24">
                <h2 className="font-display text-xl text-volt-white mb-6">ORDER SUMMARY</h2>

                {/* Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-16 h-16 bg-volt-deep rounded-md overflow-hidden flex-shrink-0">
                        {item.product.images[0] && (
                          <Image
                            src={item.product.images[0].url}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        )}
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-volt text-volt-black text-xs font-bold rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-volt-white line-clamp-2">{item.product.name}</p>
                        <p className="text-sm font-mono text-volt-muted">{formatPrice(item.priceSnap * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4 bg-border" />

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-volt-muted">Subtotal</span>
                    <span className="text-volt-white font-mono">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-volt-muted">GST (10%)</span>
                    <span className="text-volt-white font-mono">{formatPrice(gst)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-volt-muted">Delivery</span>
                    <span className={shippingCost === 0 && selectedRate ? 'text-volt font-medium' : 'text-volt-white font-mono'}>
                      {!selectedRate ? '--' : shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                    </span>
                  </div>
                </div>

                <Separator className="my-4 bg-border" />

                <div className="flex justify-between">
                  <span className="font-semibold text-volt-white">Total</span>
                  <span className="font-mono text-xl font-bold text-volt-white">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
