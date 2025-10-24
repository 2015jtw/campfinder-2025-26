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
import { ProfileDropdown } from './ProfileDropdown'
import { SearchBar } from './util/SearchBar'
import { patterns, effects, interactive } from '@/lib/design-tokens'

export default async function Header() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header
      className={`sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70`}
    >
      <div className="mx-auto flex items-center justify-between w-full max-w-none px-6 sm:px-8 lg:px-12 xl:px-16 py-4 gap-8">
        {/* Left Side: Logo and Navigation */}
        <div className="flex items-center gap-10 lg:gap-12">
          <Link
            href="/"
            className={`text-xl lg:text-2xl font-bold text-slate-900 dark:text-slate-100 hover:text-slate-700 dark:hover:text-slate-300 whitespace-nowrap ${effects.transition.colors}`}
          >
            Logo
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden min-[1200px]:flex" viewport={false}>
            <NavigationMenuList className="gap-10 lg:gap-12">
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/campgrounds"
                  className={`text-base lg:text-lg font-medium text-slate-700 dark:text-slate-200 rounded-md px-2 py-1 ${interactive.hover.link} ${interactive.focus.ring} whitespace-nowrap`}
                >
                  Campgrounds
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/campgrounds/new"
                  className={`text-base lg:text-lg font-medium text-slate-700 dark:text-slate-200 rounded-md px-2 py-1 ${interactive.hover.link} ${interactive.focus.ring} whitespace-nowrap`}
                >
                  Create
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden min-[1300px]:flex flex-1 justify-center mx-8">
          <SearchBar />
        </div>

        {/* Right Side: Auth and Mobile Menu */}
        <div className="flex items-center gap-8">
          {/* Desktop Auth */}
          <div className="hidden min-[1200px]:flex items-center gap-10 lg:gap-12">
            {user ? (
              <ProfileDropdown />
            ) : (
              <Link href="/login">
                <Button
                  className="cursor-pointer text-base font-medium px-6"
                  variant="outline"
                  size="default"
                >
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="min-[1200px]:hidden">
            <MobileMenu user={user} />
          </div>
        </div>
      </div>
    </header>
  )
}
