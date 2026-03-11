'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useAuthStore } from '@/lib/store'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

const passwordRequirements = [
  { id: 'length', label: 'At least 8 characters', regex: /.{8,}/ },
  { id: 'upper', label: 'One uppercase letter', regex: /[A-Z]/ },
  { id: 'lower', label: 'One lowercase letter', regex: /[a-z]/ },
  { id: 'number', label: 'One number', regex: /\d/ },
  { id: 'special', label: 'One special character', regex: /[!@#$%^&*(),.?":{}|<>]/ },
]

export default function RegisterPage() {
  const router = useRouter()
  const { setUser } = useAuthStore()
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    newsletter: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const checkRequirement = (regex: RegExp) => regex.test(formData.password)
  const allRequirementsMet = passwordRequirements.every(req => checkRequirement(req.regex))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!allRequirementsMet) {
      toast.error('Password does not meet requirements')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (!formData.acceptTerms) {
      toast.error('Please accept the terms and conditions')
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            role: 'CUSTOMER',
          },
        },
      })

      if (error) {
        toast.error('Erro ao criar conta', { description: error.message })
        setIsLoading(false)
        return
      }

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email ?? formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: 'CUSTOMER',
        })
        toast.success('Conta criada com sucesso!', {
          description: 'Bem-vindo ao VoltRide.',
          icon: '⚡',
        })
        router.push('/account')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido'
      const isNetworkError = message === 'Failed to fetch' || message.includes('NetworkError') || message.includes('Load failed')
      toast.error('Erro ao criar conta', {
        description: isNetworkError
          ? 'Verifique a conexão e se NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY estão corretos no .env.local (e reinicie o servidor).'
          : message,
      })
      if (process.env.NODE_ENV === 'development') {
        console.error('Register error:', err)
      }
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-volt-black flex flex-col">
      {/* Header */}
      <header className="p-4 lg:p-6">
        <Link href="/" className="flex items-center gap-1 w-fit">
          <span className="font-display text-2xl tracking-wider text-volt-white">VOLT</span>
          <span className="h-2 w-2 rounded-full bg-volt" />
          <span className="font-display text-2xl tracking-wider text-volt-white">RIDE</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl text-volt-white tracking-wide">CREATE ACCOUNT</h1>
            <p className="text-volt-muted mt-2">Join VoltRide and ride the future</p>
          </div>

          <div className="bg-volt-panel rounded-lg border border-border p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-volt-white">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="bg-volt-deep border-border text-volt-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-volt-white">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="bg-volt-deep border-border text-volt-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-volt-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  className="bg-volt-deep border-border text-volt-white placeholder:text-volt-muted"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-volt-white">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="bg-volt-deep border-border text-volt-white pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-volt-muted hover:text-volt-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                
                {/* Password Requirements */}
                {formData.password && (
                  <div className="mt-2 space-y-1">
                    {passwordRequirements.map((req) => (
                      <div 
                        key={req.id}
                        className={`flex items-center gap-2 text-xs ${
                          checkRequirement(req.regex) ? 'text-volt-teal' : 'text-volt-muted'
                        }`}
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        {req.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-volt-white">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="bg-volt-deep border-border text-volt-white"
                  required
                />
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-volt-orange">Passwords do not match</p>
                )}
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="terms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => setFormData({ ...formData, acceptTerms: checked as boolean })}
                    className="border-border data-[state=checked]:bg-volt data-[state=checked]:border-volt mt-0.5"
                  />
                  <Label htmlFor="terms" className="text-sm text-volt-muted cursor-pointer leading-relaxed">
                    I agree to the{' '}
                    <Link href="/terms" className="text-volt hover:text-volt/80">Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-volt hover:text-volt/80">Privacy Policy</Link>
                  </Label>
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="newsletter"
                    checked={formData.newsletter}
                    onCheckedChange={(checked) => setFormData({ ...formData, newsletter: checked as boolean })}
                    className="border-border data-[state=checked]:bg-volt data-[state=checked]:border-volt mt-0.5"
                  />
                  <Label htmlFor="newsletter" className="text-sm text-volt-muted cursor-pointer">
                    Subscribe to our newsletter for exclusive offers
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-volt text-volt-black hover:bg-volt/90 font-semibold"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-volt-muted">
              Already have an account?{' '}
              <Link href="/login" className="text-volt hover:text-volt/80 font-medium">
                Sign in
              </Link>
            </div>
          </div>

          {/* Business CTA */}
          <div className="mt-6 text-center">
            <p className="text-sm text-volt-muted">
              Business / fleet account?{' '}
              <Link href="/b2b" className="text-volt hover:text-volt/80 font-medium">
                Request a quote
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
