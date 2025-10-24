'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Settings, MapPin, Star, LogOut, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { SearchBar } from './util/SearchBar'
import { ModeToggle } from './util/ModeToggle'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface MobileMenuProps {
  user: SupabaseUser | null
}

export function MobileMenu({ user }: MobileMenuProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
    closeMobileMenu()
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="default"
        className="min-[1200px]:hidden cursor-pointer"
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

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 min-[1200px]:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 backdrop-blur dark:bg-slate-950/95 z-50">
          <div className="px-6 py-6 space-y-6">
            {/* Mobile Search Bar */}
            <div className="w-full">
              <SearchBar onResultClick={closeMobileMenu} />
            </div>

            {/* Mobile Navigation Links */}
            <nav className="space-y-1 border-t border-slate-200 dark:border-slate-700 pt-6">
              <Link
                href="/campgrounds"
                className="flex items-center px-4 py-3 text-base font-medium text-slate-700 rounded-lg transition-colors hover:text-emerald-600 hover:bg-emerald-50 dark:text-slate-200 dark:hover:text-emerald-400 dark:hover:bg-slate-800"
                onClick={closeMobileMenu}
              >
                Campgrounds
              </Link>
              <Link
                href="/campgrounds/new"
                className="flex items-center px-4 py-3 text-base font-medium text-slate-700 rounded-lg transition-colors hover:text-emerald-600 hover:bg-emerald-50 dark:text-slate-200 dark:hover:text-emerald-400 dark:hover:bg-slate-800"
                onClick={closeMobileMenu}
              >
                Create
              </Link>
            </nav>

            {/* Mobile Theme Toggle */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-base font-medium text-slate-700 dark:text-slate-200">
                  Theme
                </span>
                <ModeToggle />
              </div>
            </div>

            {/* Mobile Auth Section */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
              {user ? (
                <div className="space-y-1">
                  <div className="px-4 py-2 mb-3">
                    <div className="flex items-center text-sm font-semibold text-slate-900 dark:text-slate-100">
                      <User className="h-4 w-4 mr-2" />
                      My Account
                    </div>
                  </div>

                  <Link
                    href="/profile/account-settings"
                    className="flex items-center px-4 py-3 text-base text-slate-700 rounded-lg transition-colors hover:text-emerald-600 hover:bg-emerald-50 dark:text-slate-200 dark:hover:text-emerald-400 dark:hover:bg-slate-800"
                    onClick={closeMobileMenu}
                  >
                    <Settings className="h-5 w-5 mr-3" />
                    Account Settings
                  </Link>

                  <Link
                    href="/profile/campgrounds"
                    className="flex items-center px-4 py-3 text-base text-slate-700 rounded-lg transition-colors hover:text-emerald-600 hover:bg-emerald-50 dark:text-slate-200 dark:hover:text-emerald-400 dark:hover:bg-slate-800"
                    onClick={closeMobileMenu}
                  >
                    <MapPin className="h-5 w-5 mr-3" />
                    My Campgrounds
                  </Link>

                  <Link
                    href="/profile/reviews"
                    className="flex items-center px-4 py-3 text-base text-slate-700 rounded-lg transition-colors hover:text-emerald-600 hover:bg-emerald-50 dark:text-slate-200 dark:hover:text-emerald-400 dark:hover:bg-slate-800"
                    onClick={closeMobileMenu}
                  >
                    <Star className="h-5 w-5 mr-3" />
                    My Reviews
                  </Link>

                  <div className="pt-2">
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-3 text-base font-medium text-red-600 rounded-lg transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      Log out
                    </button>
                  </div>
                </div>
              ) : (
                <Link href="/login" onClick={closeMobileMenu}>
                  <Button variant="outline" size="default" className="w-full text-base font-medium">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
