import Link from 'next/link'

export default function AuthCodeError() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12 dark:bg-slate-950">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-200 bg-white/70 p-8 shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
        <header className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            Authentication Error
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            There was an error with your authentication. Please try again.
          </p>
        </header>

        <div className="space-y-4">
          <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Authentication Failed
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p>We couldn't complete your authentication. This might be due to:</p>
                  <ul className="mt-2 list-disc list-inside space-y-1">
                    <li>You denied permission to the application</li>
                    <li>The authentication request expired</li>
                    <li>There was a network error</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:text-slate-50"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
