'use server'

import { createClient } from '@/lib/supabase/server'

export async function saveProfile(input: { displayName?: string; avatarUrl?: string }) {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Not authenticated')

  // RLS policy: user can update where id = auth.uid()
  const { error: upErr } = await supabase
    .from('profiles')
    .update({
      display_name: input.displayName ?? null,
      avatar_url: input.avatarUrl ?? null,
      updated_at: new Date().toISOString(), // belt & suspenders
    })
    .eq('id', user.id)

  if (upErr) throw upErr
  return { ok: true }
}
