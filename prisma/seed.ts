import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient({ log: ['error', 'warn'] })

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

  // Use one of your actual user IDs from auth.users table
  // Replace with one of your actual user IDs from Supabase dashboard
  const userId = '72b55e8c-f565-42d4-8521-5e5cdb52cd68' // First user from your auth.users table
  console.log(`Using user ID: ${userId}`)

  for (let i = 1; i <= 50; i++) {
    const location = sample(locations)
    const title = `${location} Campground ${i}`

    const camp = await prisma.campground.create({
      data: {
        title,
        slug: title.toLowerCase().replace(/\s+/g, '-').replace(/,/g, ''),
        description:
          'Scenic campground with easy access to trails, stellar views, and family-friendly facilities.',
        price: rand(30, 160), // dollars
        location,
        userId,
        images: {
          create: Array.from({ length: 3 }).map((_, idx) => ({
            url: `https://picsum.photos/seed/cg${i}-${idx}/800/600`,
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
  .then(() => console.log('Seeded 50 campgrounds.'))
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
