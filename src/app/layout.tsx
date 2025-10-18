import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import AuthProvider from '@/components/auth/AuthProvider'
import { createClient } from '@/lib/supabase/server'
import { Toaster } from '@/components/ui/sonner'
import 'mapbox-gl/dist/mapbox-gl.css'


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Campfinder 2025',
  description: 'Find the best campsites for your next adventure',
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Get initial user for global auth state
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider initialUser={user}>
          <Header />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
