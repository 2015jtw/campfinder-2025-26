import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import CampgroundDetailCard from '@/components/campground/CampgroundDetailCard'
import MapSection from '@/components/campground/MapSection'
import ReviewsSection from '@/components/campground/ReviewsSection'

interface CampgroundDetailPageProps {
  params: Promise<{ slug: string }>
}

async function getCampground(slug: string) {
  const campground = await prisma.campground.findUnique({
    where: { slug: slug },
    include: {
      owner: {
        select: {
          id: true,
          displayName: true,
          avatarUrl: true,
        },
      },
      images: {
        orderBy: { sortOrder: 'asc' },
      },
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              displayName: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  return campground
}

export default async function CampgroundDetailPage({ params }: CampgroundDetailPageProps) {
  const { slug } = await params
  const campground = await getCampground(slug)

  if (!campground) {
    notFound()
  }

  // Get current user for owner actions
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isOwner = user?.id === campground.userId

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Campground Card */}
          <div className="lg:col-span-2">
            <CampgroundDetailCard
              campground={{
                ...campground,
                price: Number(campground.price),
              }}
              isOwner={isOwner}
            />
          </div>

          {/* Right Column - Map and Reviews */}
          <div className="space-y-8">
            {/* Map Section */}
            <MapSection
              latitude={campground.latitude}
              longitude={campground.longitude}
              location={campground.location}
            />

            {/* Reviews Section */}
            <ReviewsSection
              campgroundId={campground.id}
              reviews={campground.reviews}
              isAuthenticated={!!user}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
