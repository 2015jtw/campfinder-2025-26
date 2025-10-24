import Link from 'next/link'
import { MapPin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link
              href="/"
              className="text-2xl font-bold text-slate-900 dark:text-slate-100 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            >
              Logo
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Discover and share the best camping experiences around the world.
            </p>
          </div>

          {/* Explore Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Explore
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/campgrounds"
                  className="text-sm text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
                >
                  All Campgrounds
                </Link>
              </li>
              <li>
                <Link
                  href="/campgrounds/new"
                  className="text-sm text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
                >
                  Add Campground
                </Link>
              </li>
            </ul>
          </div>

          {/* Account Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Account
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/profile/account-settings"
                  className="text-sm text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
                >
                  Account Settings
                </Link>
              </li>
              <li>
                <Link
                  href="/profile/campgrounds"
                  className="text-sm text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
                >
                  My Campgrounds
                </Link>
              </li>
              <li>
                <Link
                  href="/profile/reviews"
                  className="text-sm text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
                >
                  My Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              © {currentYear} CampgroundHub. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <MapPin className="h-4 w-4" />
              <span>Made for outdoor enthusiasts</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
