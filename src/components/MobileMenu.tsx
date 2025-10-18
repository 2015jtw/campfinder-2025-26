'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { SignOutButton } from './auth/SignOutButton'
import { SearchBar } from './util/SearchBar'
import type { User } from '@supabase/supabase-js'

interface MobileMenuProps {
  user: User | null
}

export function MobileMenu({ user }: MobileMenuProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
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
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Search Bar */}
            <div className="pb-4 w-full">
              <SearchBar onResultClick={closeMobileMenu} />
            </div>

            {/* Mobile Navigation Links */}
            <div className="space-y-2 border-t border-slate-200 dark:border-slate-700 pt-4">
              <Link
                href="/campgrounds"
                className="block px-4 py-3 text-base font-medium text-slate-700 rounded-lg transition hover:text-emerald-600 hover:bg-emerald-50 dark:text-slate-200 dark:hover:text-emerald-400 dark:hover:bg-slate-800"
                onClick={closeMobileMenu}
              >
                Campgrounds
              </Link>
              <Link
                href="/campgrounds/new"
                className="block px-4 py-3 text-base font-medium text-slate-700 rounded-lg transition hover:text-emerald-600 hover:bg-emerald-50 dark:text-slate-200 dark:hover:text-emerald-400 dark:hover:bg-slate-800"
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
                    className="block px-4 py-3 text-base font-medium text-slate-700 rounded-lg transition hover:text-emerald-600 hover:bg-emerald-50 dark:text-slate-200 dark:hover:text-emerald-400 dark:hover:bg-slate-800"
                    onClick={closeMobileMenu}
                  >
                    Profile
                  </Link>
                  <div onClick={closeMobileMenu}>
                    <SignOutButton />
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
