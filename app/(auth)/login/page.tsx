'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useAuthStore } from '@/lib/store'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useAuthStore()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        toast.error('Email ou senha inválidos', {
          description: error.message,
        })
        setIsLoading(false)
        return
      }

      if (data.user) {
        const meta = (data.user.user_metadata || {}) as Record<string, string>
        const role = (meta.role as 'CUSTOMER' | 'WHOLESALE' | 'ADMIN') || 'CUSTOMER'
        setUser({
          id: data.user.id,
          email: data.user.email ?? '',
          firstName: meta.first_name ?? meta.firstName ?? '',
          lastName: meta.last_name ?? meta.lastName ?? '',
          role,
          ...(meta.discount_rate != null && meta.business_name
            ? { b2bAccount: { discountRate: Number(meta.discount_rate), businessName: meta.business_name } }
            : {}),
        })
        toast.success('Bem-vindo de volta!', { icon: '⚡' })
        router.push(role === 'ADMIN' ? '/admin' : '/account')
      }
    } catch {
      toast.error('Erro ao entrar. Tente novamente.')
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
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl text-volt-white tracking-wide">WELCOME BACK</h1>
            <p className="text-volt-muted mt-2">Sign in to your VoltRide account</p>
          </div>

          <div className="bg-volt-panel rounded-lg border border-border p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-volt-white">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-volt hover:text-volt/80">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="bg-volt-deep border-border text-volt-white placeholder:text-volt-muted pr-10"
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
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={formData.remember}
                  onCheckedChange={(checked) => setFormData({ ...formData, remember: checked as boolean })}
                  className="border-border data-[state=checked]:bg-volt data-[state=checked]:border-volt"
                />
                <Label htmlFor="remember" className="text-sm text-volt-muted cursor-pointer">
                  Remember me for 30 days
                </Label>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-volt text-volt-black hover:bg-volt/90 font-semibold"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-volt-muted">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-volt hover:text-volt/80 font-medium">
                Create one
              </Link>
            </div>
          </div>

          {/* Supabase Auth - use contas criadas no seu projeto */}
          <div className="mt-6 bg-volt-deep rounded-lg border border-border p-4">
            <p className="text-xs text-volt-muted mb-3 flex items-center gap-2">
              <Zap className="h-3 w-3 text-volt" />
              Auth via Supabase
            </p>
            <p className="text-xs text-volt-muted">
              Crie usuários no painel do Supabase (Authentication → Users) ou pela tela de registro.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
