'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Building2, Percent, CreditCard, Users, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

const benefits = [
  {
    icon: Percent,
    title: 'Special rates',
    description: 'Volume pricing for corporate and fleet purchases',
  },
  {
    icon: CreditCard,
    title: 'Invoicing',
    description: 'Payment terms for businesses',
  },
  {
    icon: Users,
    title: 'Dedicated support',
    description: 'Priority support for businesses',
  },
  {
    icon: Building2,
    title: 'Fleets',
    description: 'Multiple bikes, tailored contracts',
  },
]

export function B2BSection() {
  const [formData, setFormData] = useState({
    businessName: '',
    abn: '',
    contactName: '',
    email: '',
    annualVolume: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Request submitted!', {
      description: 'Our team will get back to you within 2 business days.',
      icon: '⚡',
    })
    setFormData({ businessName: '', abn: '', contactName: '', email: '', annualVolume: '' })
  }

  return (
    <section className="py-16 lg:py-24 bg-volt-black relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-volt/5 via-transparent to-volt-teal/5" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-volt/10 border border-volt/30 rounded-full mb-6">
              <Building2 className="h-4 w-4 text-volt" />
              <span className="text-sm text-volt font-medium">Business & fleet</span>
            </div>
            
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-volt-white tracking-wide">
              BUSINESS
              <br />
              <span className="text-volt">FLEET SALES</span>
            </h2>
            
            <p className="mt-4 text-volt-muted max-w-lg">
              Fleets for delivery, events or team mobility. Special rates, dedicated support and flexible contracts.
            </p>

            {/* Benefits */}
            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex items-start gap-3">
                  <div className="p-2 bg-volt/10 rounded-lg flex-shrink-0">
                    <benefit.icon className="h-5 w-5 text-volt" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-volt-white text-sm">{benefit.title}</h3>
                    <p className="text-xs text-volt-muted mt-0.5">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-4 mt-8">
              <Button 
                variant="outline" 
                className="border-volt text-volt hover:bg-volt hover:text-volt-black"
                asChild
              >
                <Link href="/b2b">
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Application Form */}
          <div className="bg-volt-panel rounded-lg border border-border p-6 lg:p-8">
            <h3 className="font-display text-xl text-volt-white mb-2">REQUEST A QUOTE</h3>
            <p className="text-sm text-volt-muted mb-6">
              Fill out the form and our team will get in touch.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Business name"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                required
                className="bg-volt-deep border-border text-volt-white placeholder:text-volt-muted"
              />
              <Input
                placeholder="ABN (11 digits)"
                value={formData.abn}
                onChange={(e) => setFormData({ ...formData, abn: e.target.value.replace(/\D/g, '') })}
                pattern="\d{11}"
                maxLength={11}
                required
                className="bg-volt-deep border-border text-volt-white placeholder:text-volt-muted"
              />
              <div className="grid sm:grid-cols-2 gap-4">
              <Input
                placeholder="Contact name"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  required
                  className="bg-volt-deep border-border text-volt-white placeholder:text-volt-muted"
                />
                <Input
                  type="email"
                  placeholder="Business email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-volt-deep border-border text-volt-white placeholder:text-volt-muted"
                />
              </div>
              <Select 
                value={formData.annualVolume} 
                onValueChange={(value) => setFormData({ ...formData, annualVolume: value })}
                required
              >
                <SelectTrigger className="bg-volt-deep border-border text-volt-white">
                  <SelectValue placeholder="Expected number of bikes" />
                </SelectTrigger>
                <SelectContent className="bg-volt-panel border-border">
                  <SelectItem value="1-10">1-10 bikes</SelectItem>
                  <SelectItem value="11-25">11-25 bikes</SelectItem>
                  <SelectItem value="26-50">26-50 bikes</SelectItem>
                  <SelectItem value="50+">50+ bikes</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                type="submit" 
                className="w-full bg-volt text-volt-black hover:bg-volt/90 font-semibold"
                size="lg"
              >
                Submit request
              </Button>

              <div className="flex items-start gap-2 text-xs text-volt-muted">
                <CheckCircle2 className="h-4 w-4 text-volt-teal flex-shrink-0 mt-0.5" />
                <span>Requests are typically reviewed within 2 business days.</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
