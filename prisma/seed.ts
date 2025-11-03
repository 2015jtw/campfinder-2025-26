import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient({ log: ['error', 'warn'] })

// Safety check - require explicit confirmation to run seed
const ALLOW_SEED = process.env.ALLOW_SEED === 'true'
if (!ALLOW_SEED) {
  console.error('❌ Set ALLOW_SEED=true in your .env file to run this script')
  console.error('⚠️  WARNING: This will delete ALL existing campground data!')
  process.exit(1)
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
function sample<T>(arr: T[]) {
  return arr[rand(0, arr.length - 1)]
}

type LocationData = {
  name: string
  latitude: number
  longitude: number
}

const locations: LocationData[] = [
  { name: 'Yosemite Valley, CA', latitude: 37.7455, longitude: -119.5937 },
  { name: 'Moab, UT', latitude: 38.5733, longitude: -109.5498 },
  { name: 'Banff, AB, Canada', latitude: 51.1784, longitude: -115.5708 },
  { name: 'Whistler, BC, Canada', latitude: 50.1163, longitude: -122.9574 },
  { name: 'Sedona, AZ', latitude: 34.8697, longitude: -111.761 },
  { name: 'Zion National Park, UT', latitude: 37.2982, longitude: -113.0263 },
  { name: 'Grand Canyon, AZ', latitude: 36.0544, longitude: -112.1401 },
  { name: 'Yellowstone, WY', latitude: 44.428, longitude: -110.5885 },
  { name: 'Glacier National Park, MT', latitude: 48.7596, longitude: -113.787 },
  { name: 'Rocky Mountain National Park, CO', latitude: 40.3428, longitude: -105.6836 },
  { name: 'Acadia National Park, ME', latitude: 44.3386, longitude: -68.2733 },
  { name: 'Big Sur, CA', latitude: 36.2704, longitude: -121.8081 },
  { name: 'Lake Tahoe, CA', latitude: 39.0968, longitude: -120.0324 },
  { name: 'Great Smoky Mountains, TN', latitude: 35.6131, longitude: -83.4895 },
  { name: 'Olympic National Park, WA', latitude: 47.8021, longitude: -123.6044 },
  { name: 'Joshua Tree, CA', latitude: 33.8734, longitude: -115.901 },
  { name: 'Bryce Canyon, UT', latitude: 37.593, longitude: -112.1871 },
  { name: 'Arches National Park, UT', latitude: 38.7331, longitude: -109.5925 },
  { name: 'Death Valley, CA', latitude: 36.5323, longitude: -116.9325 },
  { name: 'Sequoia National Park, CA', latitude: 36.4864, longitude: -118.5658 },
  { name: 'Mount Rainier, WA', latitude: 46.8523, longitude: -121.7603 },
  { name: 'Grand Teton National Park, WY', latitude: 43.7904, longitude: -110.6818 },
  { name: 'Crater Lake, OR', latitude: 42.8684, longitude: -122.1685 },
  { name: 'Shenandoah, VA', latitude: 38.2928, longitude: -78.6795 },
  { name: 'White Mountains, NH', latitude: 44.2706, longitude: -71.3033 },
  { name: 'Apostle Islands, WI', latitude: 46.9627, longitude: -90.6604 },
  { name: 'Door County, WI', latitude: 45.1358, longitude: -87.2738 },
  { name: 'Pictured Rocks, MI', latitude: 46.5653, longitude: -86.3695 },
  { name: 'Boundary Waters, MN', latitude: 48.0, longitude: -91.0 },
  { name: 'Badlands National Park, SD', latitude: 43.8554, longitude: -102.3397 },
  { name: 'Black Hills, SD', latitude: 43.8791, longitude: -103.4591 },
  { name: 'Canyonlands, UT', latitude: 38.2135, longitude: -109.8782 },
  { name: 'Capitol Reef, UT', latitude: 38.367, longitude: -111.2615 },
  { name: 'Mesa Verde, CO', latitude: 37.2309, longitude: -108.4618 },
  { name: 'Great Sand Dunes, CO', latitude: 37.7916, longitude: -105.5943 },
  { name: 'Big Bend National Park, TX', latitude: 29.1275, longitude: -103.2428 },
  { name: 'Guadalupe Mountains, TX', latitude: 31.8912, longitude: -104.8606 },
  { name: 'Hot Springs, AR', latitude: 34.5212, longitude: -93.0424 },
  { name: 'Mammoth Cave, KY', latitude: 37.1862, longitude: -86.1 },
  { name: 'Congaree National Park, SC', latitude: 33.7948, longitude: -80.7821 },
  { name: 'Everglades, FL', latitude: 25.2866, longitude: -80.8987 },
  { name: 'Dry Tortugas, FL', latitude: 24.6285, longitude: -82.8732 },
  { name: 'Assateague Island, MD', latitude: 38.0543, longitude: -75.1532 },
  { name: 'Cape Cod, MA', latitude: 41.6688, longitude: -70.2962 },
  { name: 'Green Mountains, VT', latitude: 44.5588, longitude: -72.8478 },
  { name: 'Adirondacks, NY', latitude: 43.7247, longitude: -74.5588 },
  { name: 'Catskills, NY', latitude: 42.1827, longitude: -74.3993 },
  { name: 'Thousand Islands, NY', latitude: 44.3395, longitude: -76.0132 },
  { name: 'Algonquin Park, ON, Canada', latitude: 45.5347, longitude: -78.3566 },
  { name: 'Jasper National Park, AB, Canada', latitude: 52.8734, longitude: -117.9543 },
]

async function main() {
  await prisma.$connect()

  console.log('🚨 WARNING: This will delete all existing campground data!')
  console.log('🚨 Proceeding in 3 seconds... (Ctrl+C to cancel)')

  // Give user time to cancel if they ran this by mistake
  await new Promise((resolve) => setTimeout(resolve, 3000))

  const userId = 'dea42f55-24b3-40c6-a933-7335f4d716e2'
  console.log(`Using user ID: ${userId}`)

  // Check if profile exists, create one if it doesn't
  let profile = await prisma.profile.findUnique({
    where: { id: userId },
  })

  if (!profile) {
    console.log('Profile not found, creating one...')
    profile = await prisma.profile.create({
      data: {
        id: userId,
        displayName: 'Seed User',
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
      },
    })
    console.log('Profile created successfully')
  } else {
    console.log('Profile found, proceeding with seed......')
  }

  // Clear existing data first
  console.log('Clearing existing data.....')
  await prisma.review.deleteMany({})
  await prisma.image.deleteMany({})
  await prisma.campground.deleteMany({})

  // Shuffle locations to randomize the order while ensuring uniqueness
  const shuffledLocations = [...locations].sort(() => Math.random() - 0.5)

  for (let i = 1; i <= 50; i++) {
    const locationData = shuffledLocations[i - 1]
    const title = `${locationData.name} Campground ${i}`
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove all special chars except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim()

    console.log(`Creating campground ${i}: ${title} -> ${slug}`)

    const camp = await prisma.campground.create({
      data: {
        title,
        slug,
        description:
          'Scenic campground with easy access to trails, stellar views, and family-friendly facilities.',
        price: rand(30, 160), // dollars
        location: locationData.name,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        userId,
        images: {
          create: Array.from({ length: 3 }).map((_, idx) => ({
            url: `https://picsum.photos/seed/cg${i}-${idx}/800/600?q=80&auto=format&fit=crop`,
            sortOrder: idx,
          })),
        },
      },
    })

    const reviews = rand(2, 6)
    for (let r = 0; r < reviews; r++) {
      await prisma.review.create({
        data: {
          campgroundId: camp.id,
          userId,
          rating: sample([3, 4, 5]),
          title: 'Great stay',
          comment: 'Quiet nights, clean facilities, will return.',
        },
      })
    }
  }
}

main()
  .then(() =>
    console.log('✅ Successfully seeded 50 campgrounds with unique locations and coordinates!')
  )
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
