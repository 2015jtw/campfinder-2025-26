import { prisma } from '@/lib/prisma'
import { withRetry } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')

    if (!query || query.trim().length === 0) {
      return NextResponse.json([])
    }

    // Perform full-text search using Prisma
    const results = await withRetry(() =>
      prisma.campground.findMany({
        where: {
          OR: [
            {
              title: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              location: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: query,
                mode: 'insensitive',
              },
            },
          ],
        },
        select: {
          id: true,
          slug: true,
          title: true,
          location: true,
          price: true,
        },
        take: 10, // Limit results to 10
      })
    )

    // Format results for frontend
    const formattedResults = results.map((campground: any) => ({
      id: campground.id,
      slug: campground.slug,
      title: campground.title,
      location: campground.location,
      price: campground.price ? Number(campground.price) : null,
    }))

    return NextResponse.json(formattedResults)
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}