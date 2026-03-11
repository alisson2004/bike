import { cn } from '@/lib/utils'

interface MarqueeProps {
  children: React.ReactNode
  className?: string
  speed?: 'slow' | 'normal' | 'fast'
}

export function Marquee({ children, className, speed = 'normal' }: MarqueeProps) {
  const speeds = {
    slow: '40s',
    normal: '30s',
    fast: '20s',
  }

  return (
    <div className={cn('overflow-hidden whitespace-nowrap', className)}>
      <div 
        className="inline-flex animate-[marquee_var(--duration)_linear_infinite]"
        style={{ '--duration': speeds[speed] } as React.CSSProperties}
      >
        {children}
        {children}
      </div>
    </div>
  )
}
