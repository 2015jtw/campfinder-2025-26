'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/auth-store'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function AuthProvider({
  initialUser,
  children,
}: {
  initialUser: User | null
  children: React.ReactNode
}) {
  const { setUser, setStatus } = useAuthStore()

  useEffect(() => {
    setUser(initialUser)
    if (initialUser) setStatus('authed')
    else setStatus('guest')

    const supabase = createClient()

    // Keep store in sync with real auth state
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setStatus(session?.user ? 'authed' : 'guest')
    })

    return () => sub.subscription.unsubscribe()
  }, [initialUser, setUser, setStatus])

  return <>{children}</>
}
