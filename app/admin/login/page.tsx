'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/admin'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        toast.error(data.error || 'Login failed')
        setLoading(false)
        return
      }
      router.push(next)
    } catch {
      toast.error('Login failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-volt-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-volt-panel border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-volt/10 flex items-center justify-center">
            <Lock className="h-5 w-5 text-volt" />
          </div>
          <div>
            <h1 className="font-display text-2xl text-volt-white tracking-wide">ADMIN</h1>
            <p className="text-sm text-volt-muted">Sign in to manage products</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-volt-white" htmlFor="username">
              Username
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-volt-deep border-border text-volt-white"
              autoComplete="username"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-volt-white" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-volt-deep border-border text-volt-white"
              autoComplete="current-password"
              required
            />
          </div>

          <Button className="w-full bg-volt text-volt-black hover:bg-volt/90" disabled={loading} type="submit">
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-volt-muted">
          <Link className="hover:text-volt-white" href="/">
            Back to store
          </Link>
        </div>
      </div>
    </div>
  )
}

