import { Zap } from 'lucide-react'

const announcements = [
  'FREE SHIPPING ON ORDERS OVER $500',
  '5-YEAR WARRANTY ON ALL E-BIKES',
  'MOBILE SERVICING AVAILABLE',
  'B2B WHOLESALE PRICING',
  'SECURE CHECKOUT',
  '30-DAY RETURNS',
  'AUSTRALIA-WIDE DELIVERY',
  'FINANCE OPTIONS AVAILABLE',
]

export function MarqueeStrip() {
  return (
    <div className="bg-volt overflow-hidden py-3">
      <div className="marquee-content flex items-center">
        {[...announcements, ...announcements].map((text, i) => (
          <div key={i} className="flex items-center px-8 whitespace-nowrap">
            <Zap className="h-4 w-4 text-volt-black mr-2 flex-shrink-0" />
            <span className="text-sm font-semibold text-volt-black tracking-wide">
              {text}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
