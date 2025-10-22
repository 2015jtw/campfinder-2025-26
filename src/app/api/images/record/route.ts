import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { campgroundId, path, alt } = await req.json()

    // Validate required fields
    if (!campgroundId || !path) {
      return NextResponse.json({ error: 'campgroundId and path are required' }, { status: 400 })
    }

    // Validate campgroundId is a valid number
    const campgroundIdNum = parseInt(campgroundId)
    if (isNaN(campgroundIdNum) || campgroundIdNum <= 0) {
      return NextResponse.json(
        { error: 'Invalid campgroundId - must be a positive number' },
        { status: 400 }
      )
    }

    // Check if user is authenticated
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Verify campground exists and user owns it
    const campground = await prisma.campground.findUnique({
      where: { id: campgroundIdNum },
      select: { userId: true },
    })

    if (!campground) {
      return NextResponse.json({ error: 'Campground not found' }, { status: 404 })
    }

    if (campground.userId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden - you can only upload images to your own campgrounds' },
        { status: 403 }
      )
    }

    const imageRecord = {
      campgroundId: campgroundIdNum,
      path,
      alt: alt ?? null,
      url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/campground-images/${path}`,
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Image recorded successfully',
        image: imageRecord,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Record image error:', error)

    // Handle specific error types
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Image already exists for this campground' },
        { status: 409 }
      )
    }

    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Campground not found' }, { status: 404 })
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
