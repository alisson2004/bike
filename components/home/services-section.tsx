'use client'

import { useState } from 'react'
import { Wrench, MapPin, Clock, CheckCircle2, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

const services = [
  {
    title: 'Tune-Up Service',
    price: '$99',
    description: 'Complete inspection, brake adjustment, gear tuning, and safety check',
    features: ['Brake Adjustment', 'Gear Tuning', '25-Point Inspection', 'Battery Health Check'],
  },
  {
    title: 'Full Service',
    price: '$199',
    description: 'Deep clean, full tune-up, component replacement if needed',
    features: ['Everything in Tune-Up', 'Deep Clean', 'Chain Replacement', 'Firmware Update'],
  },
  {
    title: 'Battery Service',
    price: '$149',
    description: 'Battery diagnostics, cell testing, and optimization',
    features: ['Cell Testing', 'Capacity Check', 'BMS Diagnostics', 'Performance Report'],
  },
]

export function ServicesSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    postcode: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Service request submitted!', {
      description: 'We\'ll contact you within 24 hours to confirm your mobile service.',
      icon: '⚡',
    })
    setFormData({ name: '', email: '', phone: '', service: '', postcode: '', message: '' })
  }

  return (
    <section className="py-16 lg:py-24 bg-volt-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-volt-teal/10 border border-volt-teal/30 rounded-full mb-4">
            <Wrench className="h-4 w-4 text-volt-teal" />
            <span className="text-sm text-volt-teal font-medium">Mobile Servicing</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-volt-white tracking-wide">
            SERVICE AT YOUR DOOR
          </h2>
          <p className="mt-4 text-volt-muted max-w-2xl mx-auto">
            Our certified technicians come to you. Book a mobile service and we&apos;ll keep your e-bike running at peak performance.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Services List */}
          <div className="space-y-4">
            {services.map((service) => (
              <div 
                key={service.title}
                className="p-6 bg-volt-panel rounded-lg border border-border card-glow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg text-volt-white">{service.title}</h3>
                    <p className="text-sm text-volt-muted mt-1">{service.description}</p>
                  </div>
                  <span className="font-mono text-xl font-bold text-volt">{service.price}</span>
                </div>
                <ul className="grid grid-cols-2 gap-2 mt-4">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-volt-muted">
                      <CheckCircle2 className="h-4 w-4 text-volt-teal flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Service Info */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm text-volt-muted">
                <MapPin className="h-4 w-4 text-volt" />
                Australia-wide coverage
              </div>
              <div className="flex items-center gap-2 text-sm text-volt-muted">
                <Clock className="h-4 w-4 text-volt" />
                Same-week appointments
              </div>
              <div className="flex items-center gap-2 text-sm text-volt-muted">
                <Calendar className="h-4 w-4 text-volt" />
                Flexible scheduling
              </div>
            </div>
          </div>

          {/* Service Request Form */}
          <div className="bg-volt-panel rounded-lg border border-border p-6 lg:p-8">
            <h3 className="font-display text-xl text-volt-white mb-6">BOOK A SERVICE</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-volt-deep border-border text-volt-white placeholder:text-volt-muted"
                />
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-volt-deep border-border text-volt-white placeholder:text-volt-muted"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="bg-volt-deep border-border text-volt-white placeholder:text-volt-muted"
                />
                <Input
                  placeholder="Postcode"
                  value={formData.postcode}
                  onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                  pattern="\d{4}"
                  maxLength={4}
                  required
                  className="bg-volt-deep border-border text-volt-white placeholder:text-volt-muted"
                />
              </div>
              <Select 
                value={formData.service} 
                onValueChange={(value) => setFormData({ ...formData, service: value })}
                required
              >
                <SelectTrigger className="bg-volt-deep border-border text-volt-white">
                  <SelectValue placeholder="Select Service Type" />
                </SelectTrigger>
                <SelectContent className="bg-volt-panel border-border">
                  <SelectItem value="tune-up">Tune-Up Service - $99</SelectItem>
                  <SelectItem value="full">Full Service - $199</SelectItem>
                  <SelectItem value="battery">Battery Service - $149</SelectItem>
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Additional notes (optional)"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={3}
                className="bg-volt-deep border-border text-volt-white placeholder:text-volt-muted resize-none"
              />
              <Button 
                type="submit" 
                className="w-full bg-volt text-volt-black hover:bg-volt/90 font-semibold"
                size="lg"
              >
                Request Service
              </Button>
              <p className="text-xs text-volt-muted text-center">
                We&apos;ll contact you within 24 hours to confirm your appointment.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
