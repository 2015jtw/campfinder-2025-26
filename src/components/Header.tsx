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
import { interactive } from '@/lib/design-tokens'

export default async function Header() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header
      className={`sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70`}
    >
      <div className="mx-auto grid grid-cols-[auto_minmax(0,1fr)_auto] items-center w-full max-w-none px-6 sm:px-8 2xl:px-12 py-4 gap-4">
        {/* Left Side: Logo and Navigation */}
        <div className="flex items-center gap-6 2xl:gap-10">
          <Link href="/" className="flex-shrink-0">
            <img src="/campfinder-logo.svg" alt="CampFinder" className="h-10 lg:h-12 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden min-[1100px]:flex" viewport={false}>
            <NavigationMenuList className="gap-4 2xl:gap-8">
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
        <div className="hidden min-[1100px]:flex justify-center px-4">
          <SearchBar />
        </div>

        {/* Right Side: Auth and Mobile Menu */}
        <div className="flex items-center gap-4 justify-end">
          {/* Desktop Auth */}
          <div className="hidden min-[1100px]:flex items-center gap-4 2xl:gap-8">
            <Link
              href="/about-us"
              className={`text-base lg:text-lg font-medium text-slate-700 dark:text-slate-200 rounded-md px-2 py-1 ${interactive.hover.link} ${interactive.focus.ring} whitespace-nowrap`}
            >
              About
            </Link>
            <Link
              href="/contact-us"
              className={`text-base lg:text-lg font-medium text-slate-700 dark:text-slate-200 rounded-md px-2 py-1 ${interactive.hover.link} ${interactive.focus.ring} whitespace-nowrap`}
            >
              Contact
            </Link>
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
          <div className="min-[1100px]:hidden">
            <MobileMenu user={user} />
          </div>
        </div>
      </div>
    </header>
  )
}
