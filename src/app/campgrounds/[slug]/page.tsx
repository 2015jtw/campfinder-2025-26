import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import CampgroundDetailCard from '@/components/campground/CampgroundDetailCard'
import MapSection from '@/components/maps/CampgroundDetailMap'
import ReviewsSection from '@/components/reviews/ReviewsSection'
import CampgroundDetailMap from '@/components/maps/CampgroundDetailMap'

interface CampgroundDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CampgroundDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const campground = await prisma.campground.findUnique({
    where: { slug },
    select: {
      title: true,
      description: true,
      location: true,
      images: { select: { url: true }, take: 1, orderBy: { sortOrder: 'asc' } },
    },
  })

  if (!campground) {
    return { title: 'Campground Not Found', robots: { index: false } }
  }

  const title = campground.title
  const description = campground.description
    ? campground.description.slice(0, 155)
    : `Explore ${campground.title} in ${campground.location}. View photos, reviews, and pricing on CampFinder.`
  const imageUrl = campground.images[0]?.url

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/campgrounds/${slug}`,
      type: 'article',
      ...(imageUrl ? { images: [{ url: imageUrl, alt: title }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  }
}

async function getCampground(slug: string) {
  const campground = await prisma.campground.findUnique({
    where: { slug: slug },
    select: {
      id: true,
      title: true,
      description: true,
      location: true,
      latitude: true,
      longitude: true,
      price: true,
      slug: true,
      createdAt: true,
      userId: true,
      owner: {
        select: {
          id: true,
          displayName: true,
          avatarUrl: true,
        },
      },
      images: {
        select: {
          id: true,
          url: true,
          sortOrder: true,
        },
        orderBy: { sortOrder: 'asc' },
      },
      reviews: {
        select: {
          id: true,
          rating: true,
          title: true,
          comment: true,
          createdAt: true,
          userId: true,
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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
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
            <CampgroundDetailMap
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
