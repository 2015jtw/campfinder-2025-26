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

const locations = [
  'Yosemite Valley, CA',
  'Moab, UT',
  'Banff, AB, Canada',
  'Whistler, BC, Canada',
  'Sedona, AZ',
  'Zion National Park, UT',
  'Grand Canyon, AZ',
  'Yellowstone, WY',
  'Glacier National Park, MT',
  'Rocky Mountain National Park, CO',
]

async function main() {
  await prisma.$connect()

  console.log('🚨 WARNING: This will delete all existing campground data!')
  console.log('🚨 Proceeding in 3 seconds... (Ctrl+C to cancel)')

  // Give user time to cancel if they ran this by mistake
  await new Promise((resolve) => setTimeout(resolve, 3000))

  const userId = '72b55e8c-f565-42d4-8521-5e5cdb52cd68'
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
    console.log('Profile found, proceeding with seed...')
  }

  // Clear existing data first
  console.log('Clearing existing data...')
  await prisma.review.deleteMany({})
  await prisma.image.deleteMany({})
  await prisma.campground.deleteMany({})

  for (let i = 1; i <= 50; i++) {
    const location = sample(locations)
    const title = `${location} Campground ${i}`
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
        location,
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
  .then(() => console.log('Successfully seeded 50 campgrounds with clean slugs!'))
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
