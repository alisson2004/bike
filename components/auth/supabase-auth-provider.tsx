'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store'

function mapSupabaseUserToStore(user: { id: string; email?: string; user_metadata?: Record<string, unknown> }) {
  const meta = (user.user_metadata || {}) as Record<string, string>
  const role = (meta.role as 'CUSTOMER' | 'WHOLESALE' | 'ADMIN') || 'CUSTOMER'
  return {
    id: user.id,
    email: user.email ?? '',
    firstName: meta.first_name ?? meta.firstName ?? '',
    lastName: meta.last_name ?? meta.lastName ?? '',
    role,
    ...(meta.discount_rate != null && meta.business_name
      ? { b2bAccount: { discountRate: Number(meta.discount_rate), businessName: meta.business_name } }
      : {}),
  }
}

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, clearUser, setLoading } = useAuthStore()

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setLoading(false)
      return
    }
    const supabase = createClient()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoading(true)
      if (session?.user) {
        setUser(mapSupabaseUserToStore(session.user))
      } else {
        clearUser()
      }
      setLoading(false)
    })

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(mapSupabaseUserToStore(session.user))
      } else {
        clearUser()
      }
      setLoading(false)
    }).catch(() => setLoading(false))

    return () => subscription.unsubscribe()
  }, [setUser, clearUser, setLoading])

  return <>{children}</>
}
