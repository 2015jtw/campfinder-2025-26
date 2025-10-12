'use server'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const avatarUrlSchema = z.string().url()

export async function saveAvatarUrl(url: string) {
  const avatarUrl = avatarUrlSchema.parse(url)
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Not authenticated')
  }

  // Update the profile with the new avatar URL
  await prisma.profile.update({
    where: { id: user.id },
    data: { avatarUrl },
  })

  // Revalidate the profile layout to update the sidebar
  revalidatePath('/profile', 'layout')

  return { ok: true }
}

export async function saveProfile(data: { displayName?: string }) {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Not authenticated')
  }

  // Update the profile with the provided data
  await prisma.profile.update({
    where: { id: user.id },
    data: {
      displayName: data.displayName,
    },
  })

  // Revalidate the profile layout to update the sidebar
  revalidatePath('/profile', 'layout')

  return { ok: true }
}
