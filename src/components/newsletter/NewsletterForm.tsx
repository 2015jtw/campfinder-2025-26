'use client'

import { useState, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type Variant = 'default' | 'homepage'

interface Props {
  source?: string
  variant?: Variant
}

type Status = 'idle' | 'loading' | 'ok' | 'error'

export default function NewsletterForm({ source = 'footer', variant = 'default' }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [msg, setMsg] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  const isHomepage = variant === 'homepage'

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setMsg('')

    const fd = new FormData(e.currentTarget)
    const email = String(fd.get('email') ?? '').trim()

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, source }),
      })

      if (res.ok) {
        setStatus('ok')
        setMsg('Check your inbox to confirm your subscription.')
        formRef.current?.reset()
      } else if (res.status === 429) {
        setStatus('error')
        setMsg('Too many attempts. Please wait a few minutes.')
      } else {
        const data = await res.json().catch(() => ({}))
        setStatus('error')
        setMsg((data as { error?: string }).error ?? 'Something went wrong.')
      }
    } catch {
      setStatus('error')
      setMsg('Something went wrong. Please try again.')
    }
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="w-full max-w-md">
      <div className="flex items-center gap-2">
        <Input
          name="email"
          type="email"
          required
          placeholder="your@email.com"
          aria-label="Email address"
          disabled={status === 'loading'}
          className={
            isHomepage
              ? 'border-white/40 bg-white/10 text-white placeholder:text-emerald-200 focus-visible:ring-white'
              : ''
          }
        />
        <Button
          type="submit"
          disabled={status === 'loading'}
          variant={isHomepage ? 'secondary' : 'default'}
          className={isHomepage ? 'shrink-0 bg-white text-emerald-700 hover:bg-emerald-50' : 'shrink-0'}
        >
          {status === 'loading' ? 'Sending...' : 'Sign up'}
        </Button>
      </div>
      {msg && (
        <p
          className={`mt-2 text-sm ${
            status === 'ok'
              ? isHomepage
                ? 'text-emerald-100'
                : 'text-emerald-600'
              : isHomepage
                ? 'text-red-200'
                : 'text-red-500'
          }`}
        >
          {msg}
        </p>
      )}
    </form>
  )
}
