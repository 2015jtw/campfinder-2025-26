#!/usr/bin/env node

// Load environment variables
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function geocodeAllCampgrounds() {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  if (!token) throw new Error('Missing NEXT_PUBLIC_MAPBOX_TOKEN')

  console.log('🗺️  Starting campground geocoding...')

  // Only geocode those missing coordinates
  const campgrounds = await prisma.campground.findMany({
    where: { OR: [{ latitude: null }, { longitude: null }] },
    select: { id: true, title: true, location: true },
  })

  console.log(`📍 Found ${campgrounds.length} campgrounds needing geocoding`)

  let updated = 0
  const failed = []

  for (const c of campgrounds) {
    if (!c.location) {
      console.log(`⚠️  Skipping campground ${c.id} (${c.title}) - no location`)
      continue
    }

    console.log(`🔍 Geocoding: ${c.title} (${c.location})`)

    // Geocoding per Mapbox Search JS guide
    const query = encodeURIComponent(c.location)
    const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${query}&access_token=${token}&limit=1`

    try {
      const res = await fetch(url)
      if (!res.ok) {
        const reason = `HTTP ${res.status}`
        failed.push({ id: c.id, title: c.title, reason })
        console.log(`❌ Failed: ${c.title} - ${reason}`)
        continue
      }

      const json = await res.json()
      const feature = json?.features?.[0]
      if (!feature?.geometry?.coordinates) {
        const reason = 'No coordinates found'
        failed.push({ id: c.id, title: c.title, reason })
        console.log(`❌ Failed: ${c.title} - ${reason}`)
        continue
      }

      const [longitude, latitude] = feature.geometry.coordinates

      await prisma.campground.update({
        where: { id: c.id },
        data: { latitude, longitude },
      })

      updated++
      console.log(`✅ Updated: ${c.title} -> ${latitude}, ${longitude}`)
    } catch (e) {
      const reason = e?.message || 'Request failed'
      failed.push({ id: c.id, title: c.title, reason })
      console.log(`❌ Failed: ${c.title} - ${reason}`)
    }

    // Respect API rate limits
    await new Promise((r) => setTimeout(r, 150))
  }

  console.log('\n📊 Geocoding Summary:')
  console.log(`   Total campgrounds: ${campgrounds.length}`)
  console.log(`   Successfully updated: ${updated}`)
  console.log(`   Failed: ${failed.length}`)

  if (failed.length > 0) {
    console.log('\n❌ Failed campgrounds:')
    failed.forEach((f) => console.log(`   ${f.id}: ${f.title} - ${f.reason}`))
  }

  return { total: campgrounds.length, updated, failed }
}

// Run the script
geocodeAllCampgrounds()
  .then(() => {
    console.log('🎉 Geocoding complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Error:', error.message)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })
