import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'
import { MobileMenu } from './MobileMenu'
import { SignOutButton } from './SignOutButton'

export default async function Header() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-semibold text-slate-900 transition hover:text-slate-600 dark:text-slate-100 dark:hover:text-slate-300"
        >
          Logo
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex flex-1 justify-center" viewport={false}>
          <NavigationMenuList className="gap-6 text-sm font-medium text-slate-700 dark:text-slate-200">
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/campgrounds"
                className="rounded-md px-1 py-0.5 transition hover:text-blue-600 focus:text-blue-600 focus-visible:outline-none"
              >
                Campgrounds
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/campgrounds/new"
                className="rounded-md px-1 py-0.5 transition hover:text-blue-600 focus:text-blue-600 focus-visible:outline-none"
              >
                Create
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4 text-sm font-medium text-slate-700 dark:text-slate-200">
              <Link
                href="/profile"
                className="transition hover:text-blue-600 focus:text-blue-600 focus-visible:outline-none"
              >
                Profile
              </Link>
              <SignOutButton />
            </div>
          ) : (
            <Link href="/login">
              <Button className="cursor-pointer" variant="outline" size="sm">
                Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu */}
        <MobileMenu user={user} />
      </div>
    </header>
  )
}
