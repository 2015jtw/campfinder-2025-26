import EmailPasswordForm from '@/components/auth/EmailPasswordForm'
import GoogleOAuthForm from '@/components/auth/GoogleOAuthForm'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12 dark:bg-slate-950">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-200 bg-white/70 p-8 shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
        <form>
          <EmailPasswordForm />
        </form>

        <GoogleOAuthForm />
      </div>
    </div>
  )
}
