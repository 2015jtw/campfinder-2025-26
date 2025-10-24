import { createClient } from '@/lib/supabase/server'
import { findProfile } from '@/lib/db'
import EditProfileForm from '@/components/profile/EditProfileForm'
import { patterns, colors, effects, interactive, darkMode } from '@/lib/design-tokens'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AccountSettingsPage() {
  // Auth is handled by the layout, but we still need to get the user for this specific page
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Read the profile (should exist due to trigger/backfill)
  const profile = (await findProfile(user!.id)) as {
    id: string
    displayName: string | null
    avatarUrl: string | null
  } | null

  if (!profile) {
    return <div>Profile not found</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={darkMode.text.primary + ' text-3xl font-bold'}>Account Settings</h1>
          <p className={darkMode.text.secondary + ' mt-2'}>
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <section className={patterns.card + ' p-8'}>
        <div className="mb-6">
          <h2 className={darkMode.text.primary + ' text-xl font-semibold'}>Account Information</h2>
          <p className={darkMode.text.secondary + ' mt-1 text-sm'}>
            Update your profile information and avatar
          </p>
        </div>
        <EditProfileForm
          userId={profile.id}
          initialDisplayName={profile.displayName}
          initialAvatarUrl={profile.avatarUrl}
        />
      </section>
    </div>
  )
}
