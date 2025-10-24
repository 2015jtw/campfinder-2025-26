// app/profile/layout.tsx
import type { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { findProfileForLayout } from '@/lib/db'

// shadcn sidebar primitives
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'

export const runtime = 'nodejs' // avoid Edge HTTP restrictions
export const dynamic = 'force-dynamic' // don't cache redirects
export const revalidate = 0

export default async function ProfileLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  // Single, authoritative gate for the whole profile area:
  if (error || !data.user) redirect('/login')

  // Get user profile for sidebar header
  const profile = (await findProfileForLayout(data.user.id)) as {
    displayName: string | null
    avatarUrl: string | null
  } | null

  return (
    <SidebarProvider>
      {/* Sidebar is offset below the global sticky header (h-16 = 4rem) */}
      <Sidebar className="fixed left-0 top-[107px] z-40 h-[calc(100vh-4rem)] border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <SidebarHeader className="px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              {profile?.avatarUrl ? (
                <Image src={profile.avatarUrl} alt="Avatar" fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-400 dark:text-slate-500">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                {profile?.displayName ?? data.user?.email ?? 'Your account'}
              </p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">Profile</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/profile/account-settings">Account Settings</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/profile/campgrounds">My Campgrounds</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/profile/reviews">My Reviews</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="px-4 py-4">
          <Link
            href="/create"
            className="inline-flex items-center rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3 py-1.5 text-sm transition-colors"
          >
            Create New Campground
          </Link>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="pt-16">
        <div className="sticky top-16 z-30 mb-2 flex items-center bg-white/70 dark:bg-slate-900/70 px-2 py-1 backdrop-blur md:hidden">
          <SidebarTrigger />
          <span className="ml-2 text-sm text-slate-600 dark:text-slate-300">Menu</span>
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 pb-10">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
