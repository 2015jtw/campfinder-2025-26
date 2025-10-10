// app/profile/layout.tsx
import type { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'

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

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ProfileLayout({ children }: { children: ReactNode }) {
  // Optional: show user avatar/name in the sidebar header
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If you also store avatar/display name in profiles, you could fetch & show it here.

  return (
    <SidebarProvider>
      {/* Sidebar is offset below the global sticky header (h-16 = 4rem) */}
      <Sidebar className="fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] border-r">
        <SidebarHeader className="px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-slate-200">
              {/* If you have a profile avatar URL, render it here */}
              {/* <Image src={avatarUrl} alt="Avatar" fill className="object-cover" /> */}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user?.email ?? 'Your account'}</p>
              <p className="truncate text-xs text-slate-500">Profile</p>
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
                    <a href="#account">Account Settings</a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#campgrounds">My Campgrounds</a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#reviews">My Reviews</a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="px-4 py-4">
          <Link
            href="/create"
            className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm"
          >
            Create New Campground
          </Link>
        </SidebarFooter>
      </Sidebar>

      {/* Content inset:
         - pt-16 creates space for the global sticky header
         - SidebarInset applies the left padding using the sidebar CSS var */}
      <SidebarInset className="pt-16">
        {/* Optional mobile trigger row (visible under the header on small screens) */}
        <div className="sticky top-16 z-40 mb-2 flex items-center bg-white/70 px-2 py-1 backdrop-blur md:hidden">
          <SidebarTrigger />
          <span className="ml-2 text-sm text-slate-600">Menu</span>
        </div>

        {/* Center the page content (ProfileForm, lists, etc.) */}
        <div className="mx-auto w-full max-w-2xl px-4 pb-10">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
