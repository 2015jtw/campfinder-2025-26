'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
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
  const [isMouseOverMenu, setIsMouseOverMenu] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Prevent body scroll only when mouse is over the mobile menu
  useEffect(() => {
    if (isMobileMenuOpen && isMouseOverMenu) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen, isMouseOverMenu])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
    setIsMouseOverMenu(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
    closeMobileMenu()
  }

  const handleMouseEnterMenu = () => {
    setIsMouseOverMenu(true)
  }

  const handleMouseLeaveMenu = () => {
    setIsMouseOverMenu(false)
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

      {/* Mobile Menu Backdrop Overlay */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 top-full bg-black/40 backdrop-blur-sm z-[9998] min-[1200px]:hidden"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />

          {/* Mobile Menu Dropdown */}
          <div
            className="fixed top-full left-0 right-0 min-[1200px]:hidden border-t-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 shadow-2xl z-[9999] max-h-[calc(100vh-4rem)] overflow-y-auto"
            onMouseEnter={handleMouseEnterMenu}
            onMouseLeave={handleMouseLeaveMenu}
          >
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
                <Link
                  href="/about-us"
                  className="flex items-center px-4 py-3 text-base font-medium text-slate-700 rounded-lg transition-colors hover:text-emerald-600 hover:bg-emerald-50 dark:text-slate-200 dark:hover:text-emerald-400 dark:hover:bg-slate-800"
                  onClick={closeMobileMenu}
                >
                  About
                </Link>
                <Link
                  href="/contact-us"
                  className="flex items-center px-4 py-3 text-base font-medium text-slate-700 rounded-lg transition-colors hover:text-emerald-600 hover:bg-emerald-50 dark:text-slate-200 dark:hover:text-emerald-400 dark:hover:bg-slate-800"
                  onClick={closeMobileMenu}
                >
                  Contact
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
                    <Button
                      variant="outline"
                      size="default"
                      className="w-full text-base font-medium cursor-pointer"
                    >
                      Login
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
