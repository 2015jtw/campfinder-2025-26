'use client'

import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function SignOutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <Button
      variant="outline"
      size="default"
      onClick={handleSignOut}
      className="text-base font-medium text-slate-700 cursor-pointer hover:text-emerald-600 hover:border-emerald-600 dark:text-slate-200 dark:hover:text-emerald-400 dark:hover:border-emerald-400 transition-colors px-6 whitespace-nowrap"
    >
      Log out
    </Button>
  )
}
