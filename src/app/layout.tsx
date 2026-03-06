import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import AuthProvider from '@/components/auth/AuthProvider'
import { ThemeProvider } from '@/components/theme-provider'
import { createClient } from '@/lib/supabase/server'
import { Toaster } from '@/components/ui/sonner'
import 'mapbox-gl/dist/mapbox-gl.css'
import Footer from '@/components/Footer'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://campfinder.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: '%s | CampFinder',
    default: 'CampFinder – Discover Your Perfect Campsite',
  },
  description:
    'Find and book the best campgrounds across the US. Browse reviews, photos, prices, and locations for thousands of campsites.',
  keywords: [
    'campgrounds',
    'camping',
    'campsites',
    'outdoor adventures',
    'camping spots',
    'tent camping',
    'RV parks',
    'nature',
  ],
  authors: [{ name: 'CampFinder' }],
  creator: 'CampFinder',
  openGraph: {
    type: 'website',
    siteName: 'CampFinder',
    title: 'CampFinder – Discover Your Perfect Campsite',
    description:
      'Find and book the best campgrounds across the US. Browse reviews, photos, prices, and locations for thousands of campsites.',
    url: siteUrl,
    images: [
      {
        url: '/campfinder-logo.svg',
        width: 1200,
        height: 630,
        alt: 'CampFinder – Discover Your Perfect Campsite',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CampFinder – Discover Your Perfect Campsite',
    description:
      'Find and book the best campgrounds across the US. Browse reviews, photos, prices, and locations for thousands of campsites.',
    images: ['/campfinder-logo.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider initialUser={user}>
            <Header />
            {children}
            <Toaster />
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
