'use client'

import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'

type Status = 'loading' | 'guest' | 'authed'

type AuthState = {
  user: User | null
  status: Status
  setUser: (u: User | null) => void
  setStatus: (s: Status) => void
  reset: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'loading',
  setUser: (user) => set({ user, status: user ? 'authed' : 'guest' }),
  setStatus: (status) => set({ status }),
  reset: () => set({ user: null, status: 'guest' }),
}))
