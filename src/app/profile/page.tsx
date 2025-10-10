import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import EditProfileForm from '@/components/profile/EditProfileForm'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Read the profile (should exist due to trigger/backfill)
  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { id: true, displayName: true, avatarUrl: true },
  })

  const [campgrounds, reviews] = await Promise.all([
    prisma.campground.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        title: true,
        location: true,
        createdAt: true,
        images: { take: 1, select: { url: true } },
      },
    }),
    prisma.review.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        campground: { select: { id: true, title: true } },
      },
    }),
  ])

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50">
        <SidebarTrigger className="fixed top-4 left-4 z-50 md:hidden" />

        <Sidebar className="border-r bg-white shadow-sm">
          <SidebarHeader className="border-b bg-gradient-to-r from-blue-600 to-blue-700 p-6">
            <div className="flex items-center gap-4">
              <div className="relative h-12 w-12 overflow-hidden rounded-full bg-white/20 ring-2 ring-white/30">
                {profile.avatarUrl ? (
                  <Image src={profile.avatarUrl} alt="Avatar" fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-white">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
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
                <p className="truncate text-lg font-semibold text-white">
                  {profile.displayName ?? 'Your username'}
                </p>
                <p className="text-sm text-blue-100">Profile Settings</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
                    >
                      <a href="#account" className="flex items-center gap-3">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Account Settings
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
                    >
                      <a href="#campgrounds" className="flex items-center gap-3">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                        My Campgrounds
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
                    >
                      <a href="#reviews" className="flex items-center gap-3">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                        My Reviews
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t p-4">
            <Link
              href="/create"
              className="flex w-full items-center gap-3 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create New Campground
            </Link>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <main className="flex-1 space-y-8 p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                <p className="mt-2 text-gray-600">Manage your account settings and preferences</p>
              </div>
            </div>

            <section id="account" className="rounded-xl bg-white p-8 shadow-sm border">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Account Information</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Update your profile information and avatar
                </p>
              </div>
              <EditProfileForm
                userId={profile.id}
                initialDisplayName={profile.displayName}
                initialAvatarUrl={profile.avatarUrl}
              />
            </section>

            <section id="campgrounds" className="rounded-xl bg-white p-8 shadow-sm border">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Your Campgrounds</h2>
                  <p className="mt-1 text-sm text-gray-600">Manage your campground listings</p>
                </div>
                <Link
                  href="/create"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  New Campground
                </Link>
              </div>
              {campgrounds.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No campgrounds yet</h3>
                  <p className="mt-2 text-gray-600">
                    Get started by creating your first campground listing.
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/create"
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Create Your First Campground
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {campgrounds.map((cg) => (
                    <Link key={cg.id} href={`/campgrounds/${cg.id}`} className="group">
                      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                        {cg.images[0]?.url ? (
                          <div className="relative h-48 w-full bg-gray-100">
                            <Image
                              src={cg.images[0].url}
                              alt={cg.title}
                              fill
                              className="object-cover transition-transform group-hover:scale-105"
                            />
                          </div>
                        ) : (
                          <div className="flex h-48 w-full items-center justify-center bg-gray-100">
                            <svg
                              className="h-12 w-12 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {cg.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-600">{cg.location}</p>
                          <p className="mt-2 text-xs text-gray-500">
                            Created {new Date(cg.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            <section id="reviews" className="rounded-xl bg-white p-8 shadow-sm border">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Your Reviews</h2>
                <p className="mt-1 text-sm text-gray-600">Reviews you've written for campgrounds</p>
              </div>
              {reviews.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No reviews yet</h3>
                  <p className="mt-2 text-gray-600">
                    Start exploring campgrounds and share your experiences.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((rv) => (
                    <div key={rv.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`h-4 w-4 ${i < rv.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-sm font-medium text-gray-900">{rv.rating}/5</span>
                          </div>
                          <Link
                            href={`/campgrounds/${rv.campground.id}`}
                            className="mt-1 block text-sm font-medium text-blue-600 hover:text-blue-700"
                          >
                            {rv.campground.title}
                          </Link>
                          {rv.comment && <p className="mt-2 text-sm text-gray-700">{rv.comment}</p>}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(rv.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
