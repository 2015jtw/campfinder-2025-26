import { login, signup } from '@/app/login/actions'

export default function EmailPasswordForm() {
  return (
    <div className="space-y-6">
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Welcome Back</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Enter your email and password to continue.
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

        <div className="space-y-1.5">
          <label
            className="block text-sm font-medium text-slate-700 dark:text-slate-200"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            className="inline-flex cursor-pointer flex-1 items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
            formAction={login}
          >
            Log in
          </button>
          <button
            className="inline-flex cursor-pointer flex-1 items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:text-slate-50"
            formAction={signup}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  )
}
