import { Truck, Shield, CreditCard, Wrench } from 'lucide-react'

const features = [
  {
    icon: Truck,
    title: 'Delivery & pickup',
    description: 'Parts via Australia Post; bikes pickup or by arrangement',
  },
  {
    icon: Shield,
    title: '5-year warranty',
    description: 'Coverage on all VoltRide bikes',
  },
  {
    icon: CreditCard,
    title: 'Secure payment',
    description: 'Checkout via Stripe',
  },
  {
    icon: Wrench,
    title: 'Service',
    description: 'Bikes checked and ready',
  },
]

export function FeaturesBand() {
  return (
    <section className="py-12 bg-volt-black border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature) => (
            <div 
              key={feature.title}
              className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left"
            >
              <div className="p-3 bg-volt/10 rounded-lg flex-shrink-0">
                <feature.icon className="h-6 w-6 text-volt" />
              </div>
              <div>
                <h3 className="font-semibold text-volt-white">{feature.title}</h3>
                <p className="text-sm text-volt-muted mt-0.5">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
