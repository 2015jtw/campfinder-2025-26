import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import UserReviewsClient from './UserReviewsClient'

interface UserReviewsPageProps {
  params: Promise<{ slug: string }>
}

async function getUserReviews(userId: string) {
  const reviews = await prisma.review.findMany({
    where: { userId },
    include: {
      campground: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
      user: {
        select: {
          id: true,
          displayName: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return reviews
}

export default async function UserReviewsPage({ params }: UserReviewsPageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    notFound()
  }

  const reviews = await getUserReviews(user.id)

  return <UserReviewsClient reviews={reviews} currentUserId={user.id} />
}
