'use client'

import { sendMagicLink } from '@/app/login/actions'
import { useState } from 'react'

export default function EmailPasswordForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [email, setEmail] = useState('')

  async function handleSubmit(formData: FormData) {
    const userEmail = formData.get('email') as string
    setEmail(userEmail)
    await sendMagicLink(formData)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="space-y-6">
        <header className="space-y-2 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <svg
              className="h-6 w-6 text-green-600 dark:text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            Check Your Email
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            We&apos;ve sent a magic link to{' '}
            <span className="font-medium text-slate-700 dark:text-slate-300">{email}</span>. Click
            the link in the email to sign in.
          </p>
        </header>
        <button
          onClick={() => setIsSubmitted(false)}
          className="w-full inline-flex cursor-pointer items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:text-slate-50"
        >
          Use a different email
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          Welcome to CampFinder
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Enter your email to receive a magic link to sign in or create an account.
        </p>
      </header>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label
            className="block text-sm font-medium text-slate-700 dark:text-slate-200"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>

        <button
          className="w-full inline-flex cursor-pointer items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
          formAction={handleSubmit}
        >
          Send Magic Link
        </button>
      </div>
    </div>
  )
}
