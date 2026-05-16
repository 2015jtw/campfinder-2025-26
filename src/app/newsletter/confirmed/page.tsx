import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Subscription Confirmed – CampFinder',
}

export default function NewsletterConfirmed() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-24 text-center">
      <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
        <svg
          className="h-8 w-8 text-emerald-600 dark:text-emerald-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="mb-3 text-3xl font-bold text-slate-900 dark:text-slate-100">
        You&apos;re subscribed!
      </h1>
      <p className="mb-8 text-slate-600 dark:text-slate-400">
        Thanks for confirming your email. You&apos;ll hear from us when new campgrounds and tips land.
      </p>
      <Link
        href="/campgrounds"
        className="inline-flex items-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
      >
        Explore campgrounds
      </Link>
    </main>
  )
}
