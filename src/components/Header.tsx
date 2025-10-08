'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  initialUser: User | null
}

export default function Header({ initialUser }: HeaderProps) {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(initialUser)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    fetchUser()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

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
                href="/create"
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
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="text-slate-700 cursor-pointer hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-300"
              >
                Log out
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden cursor-pointer"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 backdrop-blur dark:bg-slate-950/95">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Navigation Links */}
            <div className="space-y-2">
              <Link
                href="/campgrounds"
                className="block px-3 py-2 text-sm font-medium text-slate-700 rounded-md transition hover:text-blue-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:text-blue-300 dark:hover:bg-slate-800"
                onClick={closeMobileMenu}
              >
                Campgrounds
              </Link>
              <Link
                href="/create"
                className="block px-3 py-2 text-sm font-medium text-slate-700 rounded-md transition hover:text-blue-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:text-blue-300 dark:hover:bg-slate-800"
                onClick={closeMobileMenu}
              >
                Create
              </Link>
            </div>

            {/* Mobile Auth Section */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              {user ? (
                <div className="space-y-2">
                  <Link
                    href="/profile"
                    className="block px-3 py-2 text-sm font-medium text-slate-700 rounded-md transition hover:text-blue-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:text-blue-300 dark:hover:bg-slate-800"
                    onClick={closeMobileMenu}
                  >
                    Profile
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleSignOut()
                      closeMobileMenu()
                    }}
                    className="w-full justify-start text-slate-700 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-300"
                  >
                    Log out
                  </Button>
                </div>
              ) : (
                <Link href="/login" onClick={closeMobileMenu} className="cursor-pointer">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
