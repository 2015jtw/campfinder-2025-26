'use client'

import Link from 'next/link'
import { User, Settings, MapPin, Star, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ModeToggle } from '@/components/util/ModeToggle'
import { createClient } from '@/lib/supabase/client'
import { patterns, effects, interactive } from '@/lib/design-tokens'

export function ProfileDropdown() {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`cursor-pointer ${patterns.button.ghost} text-base lg:text-lg font-medium text-slate-700 dark:text-slate-200 ${interactive.hover.link} ${interactive.focus.ring} whitespace-nowrap`}
        >
          <User className="h-4 w-4 mr-2" />
          Profile
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/profile/account-settings" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Account Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/profile/campgrounds" className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            My Campgrounds
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/profile/reviews" className="flex items-center">
            <Star className="h-4 w-4 mr-2" />
            My Reviews
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <div className="px-2 py-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Theme</span>
            <ModeToggle />
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
