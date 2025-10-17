import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import UpdateCampgroundForm from '@/components/campground/UpdateCampgroundForm'

interface EditCampgroundPageProps {
  params: Promise<{ slug: string }>
}

export default async function EditCampgroundPage({ params }: EditCampgroundPageProps) {
  // Ensure user is authenticated
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get slug from params
  const { slug } = await params

  // Fetch campground with images using slug
  const campground = await prisma.campground.findUnique({
    where: { slug: slug },
    select: {
      id: true,
      title: true,
      description: true,
      location: true,
      price: true,
      latitude: true,
      longitude: true,
      userId: true,
      images: {
        select: {
          url: true,
          sortOrder: true
        },
        orderBy: { sortOrder: 'asc' }
      }
    }
  })

  if (!campground) {
    notFound()
  }

  // Verify ownership - only the owner can edit
  if (campground.userId !== user.id) {
    redirect('/campgrounds')
  }

  // Transform the data to match the form's expected type
  const campgroundData = {
    id: campground.id,
    title: campground.title,
    description: campground.description,
    location: campground.location,
    price: Number(campground.price), // Convert Decimal to number
    images: campground.images.map(img => img.url),
    latitude: campground.latitude ? Number(campground.latitude) : null,
    longitude: campground.longitude ? Number(campground.longitude) : null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Campground</h1>
          <p className="text-gray-600 mt-2">
            Update your campground information
          </p>
        </div>
        
        <UpdateCampgroundForm campground={campgroundData} />
      </div>
    </div>
  )
}