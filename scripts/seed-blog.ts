import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
dotenv.config()

// Use transaction mode pooler (port 6543) — better for scripts than session mode (5432)
const dbUrl = (process.env.DATABASE_URL ?? '').replace(':5432/', ':6543/')
const prisma = new PrismaClient({
  log: ['error', 'warn'],
  datasources: { db: { url: dbUrl } },
})

// Same author used by the main campground seed
const AUTHOR_ID = 'dea42f55-24b3-40c6-a933-7335f4d716e2'

function slug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function readingTime(content: string) {
  return Math.max(1, Math.round(content.trim().split(/\s+/).length / 200))
}

const categories = [
  { name: 'Tips & Gear', slug: 'tips-and-gear', description: 'Camping gear reviews and pro tips' },
  { name: 'Destinations', slug: 'destinations', description: 'Campground and park spotlight guides' },
  { name: 'Planning', slug: 'planning', description: 'Trip planning advice and checklists' },
  { name: 'Safety', slug: 'safety', description: 'Stay safe in the outdoors' },
  { name: 'Family Camping', slug: 'family-camping', description: 'Tips for camping with kids' },
]

const posts = [
  {
    title: '10 Essential Items Every Camper Should Pack',
    excerpt: 'Whether you\'re a first-timer or a seasoned outdoorsperson, these ten items belong in every pack.',
    featuredImage: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&q=80',
    categorySlug: 'tips-and-gear',
    content: `# 10 Essential Items Every Camper Should Pack

Getting outdoors is one of the most rewarding things you can do — but showing up underprepared can turn an adventure into a miserable experience. Here are the ten items that should be in every pack, no matter how long or short the trip.

## 1. Navigation

A paper map and a compass. Your phone battery dies. GPS signals fail in deep canyons. Old-school navigation never does.

## 2. Sun Protection

SPF 30+ sunscreen, UV-blocking sunglasses, and a wide-brimmed hat. Altitude amplifies UV exposure faster than most people expect.

## 3. Insulation

An extra layer — even in summer. Temperatures drop hard after sunset in the mountains and desert alike. A packable down jacket weighs almost nothing and saves trips.

## 4. Illumination

A headlamp with fresh batteries. Hands-free is non-negotiable when you're setting up camp in the dark or navigating to the bathroom at 2am.

## 5. First-Aid Kit

At minimum: adhesive bandages, blister treatment, pain reliever, antihistamine, antiseptic wipes, and any personal medications. Customize for your group's needs.

## 6. Fire Starter

Waterproof matches, a lighter, and a fire-starter cube. Keep them in a sealed bag. Wet matches are useless matches.

## 7. Repair Tools and a Knife

A multi-tool or folding knife covers food prep, gear repair, and a hundred improvised solutions. Duct tape around a water bottle handles the rest.

## 8. Nutrition

More food than you think you need. Pack an extra day's worth of high-calorie snacks — trail mix, energy bars, jerky — for emergencies or extended trips.

## 9. Hydration

A water filter or purification tablets, plus at least two liters of capacity. Streams look clean. They aren't always.

## 10. Emergency Shelter

A lightweight emergency bivy or space blanket. Small, cheap, and potentially life-saving if weather turns or you're stuck overnight unexpectedly.

---

Pack these ten, and you're ready for most of what the backcountry can throw at you. Everything else is comfort.`,
  },
  {
    title: 'Camping in Yosemite: What You Need to Know Before You Go',
    excerpt: 'Yosemite is one of the most iconic camping destinations in the US — and one of the hardest to book. Here\'s how to do it right.',
    featuredImage: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1200&q=80',
    categorySlug: 'destinations',
    content: `# Camping in Yosemite: What You Need to Know Before You Go

Yosemite National Park draws nearly four million visitors a year, and for good reason. El Capitan, Half Dome, Bridalveil Fall — the valley delivers on every expectation. But showing up without a plan means driving back out with nowhere to sleep.

## Booking

Reservations open five months in advance on recreation.gov, and popular sites like Camp 4 and Upper Pines fill within minutes. Set an alarm. Book early. There is no workaround.

A small number of walk-up sites are held back for same-day reservations — arrive at the campground by 7am if you're trying your luck.

## Best Campgrounds

**Upper Pines** — The largest campground in the valley, close to trailheads and the Village. Gets loud in peak season.

**Camp 4** — Walk-up only, historic, loved by climbers. Communal sites mean you'll share with strangers. Bring earplugs.

**Tuolumne Meadows** — At 8,600 feet elevation, this one opens later (usually late June) and offers a completely different experience from the valley — quieter, cooler, and surrounded by granite domes.

**Wawona** — South entrance, near the Mariposa Grove of giant sequoias. Less crowded, great base for southern park exploration.

## Best Times to Visit

- **May–June**: Waterfalls are at peak flow from snowmelt. Crowds build but aren't at their worst yet.
- **September–October**: Crowds thin, temperatures are comfortable, fall color starts appearing.
- **July–August**: Peak season. Expect full campgrounds, shuttle queues, and parking chaos.

## Bear Boxes

Every campground in Yosemite requires food to be stored in bear boxes or a hard-sided vehicle at all times — not in tents, not in soft coolers. Bears have learned to recognize coolers by shape. The fine for improper food storage is real.

## What to Bring

- Layers. The valley can be 90°F at noon and 45°F by midnight.
- Reservations printed or downloaded offline.
- Cash for the entrance fee if your America the Beautiful pass isn't loaded.
- Patience. It's Yosemite.

---

Plan ahead, book the moment the window opens, and you'll understand why people keep coming back.`,
  },
  {
    title: 'How to Choose the Right Campsite: A Practical Guide',
    excerpt: 'Not all campsites are created equal. Here\'s what to look for when picking your spot — whether you\'re booking online or choosing in person.',
    featuredImage: 'https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?w=1200&q=80',
    categorySlug: 'planning',
    content: `# How to Choose the Right Campsite: A Practical Guide

Booking a campsite is easy. Booking the *right* campsite takes a little more thought. Here's what separates a great site from one you'll wish you'd skipped.

## Look at the Campground Map First

Most reservation sites (recreation.gov, ReserveAmerica) include a map of individual sites. Spend five minutes on it before clicking "reserve." Look for:

- **Distance from bathrooms**: Close enough to not be a hike at night. Far enough to avoid foot traffic and smell.
- **Privacy**: Corner sites and end-of-loop sites typically have more space and fewer neighbors.
- **Shade**: Check which direction the site faces. West-facing sites bake in afternoon sun.

## Read the Reviews

Site-specific reviews are gold. People mention things the listing doesn't: uneven ground, a noisy generator spot nearby, the dumpster that's two sites over, or the fact that site 14 has a perfect fire pit view.

## Know Your Tent Footprint

A "large" campsite on paper might be mostly slope. If you're car camping, make sure the site accommodates your vehicle plus your tent with some separation. If you're tent-only, flat ground matters more than almost anything.

## Water and Electrical Hookups

If you need them, filter specifically for them. Full hookup sites (water, electric, sewer) book fastest. Partial hookup (water + electric only) is usually sufficient for most people. Dry camping sites are cheaper and more remote.

## Noise Considerations

- Avoid sites next to playgrounds if you want quiet evenings.
- Avoid sites adjacent to main access roads — headlights and engine noise at midnight are no fun.
- If you're a light sleeper, look for sites set back from communal gathering areas.

## Arriving at a Walk-Up Site

If you're choosing in person rather than booking ahead:

1. Drive the entire loop before committing — you'll often spot a better option around the corner.
2. Check for level ground by walking the tent area.
3. Look up. Overhanging dead branches (widow makers) above a tent site are a real hazard.
4. Check drainage. Low spots collect water when it rains.

---

Five minutes of site research before booking saves hours of frustration once you're there.`,
  },
  {
    title: 'Campfire Safety: Rules Every Camper Needs to Know',
    excerpt: 'Campfires are central to the camping experience. They\'re also one of the leading causes of wildfires. Here\'s how to do it responsibly.',
    featuredImage: 'https://images.unsplash.com/photo-1510672981848-a1c4f1cb5ccf?w=1200&q=80',
    categorySlug: 'safety',
    content: `# Campfire Safety: Rules Every Camper Needs to Know

A campfire done right is one of camping's great pleasures. Done wrong, it can raze thousands of acres. Most campfire disasters are preventable with a few basic practices.

## Check Before You Build

Always check local fire restrictions before lighting anything. Many parks and forests implement fire bans during dry conditions — these aren't suggestions. Look up current conditions on the park's website, or ask at the ranger station when you arrive.

## Use Established Fire Rings

If a fire ring exists, use it. Don't build new pits. Fire rings contain heat, reduce ground damage, and signal to other campers that fires are permitted in that spot.

If you're in a dispersed camping area without an existing ring, use a fire pan or go without a fire entirely.

## Build It Small

A campfire doesn't need to be massive. A small, manageable fire is warmer, safer, and easier to extinguish. Larger fires require more fuel, generate more embers, and are harder to control if wind picks up.

## Never Leave It Unattended

This is the rule that gets broken most often and causes the most damage. Wind direction changes. Embers drift. One gust can carry a spark 30 feet into dry grass. If you leave the site — even briefly — drown the fire first.

## Extinguish Completely

"Dead out" means cold to the touch, not just not visibly burning.

1. Pour water on the fire — enough to drown all embers.
2. Stir the ash with a stick to expose hot spots.
3. Pour more water. Stir again.
4. Place your hand near (not on) the ash. If you feel heat, repeat.

Burying a fire does not extinguish it. Embers can smolder underground for hours and reignite.

## What to Burn

Use only dry, local firewood. Many parks prohibit importing wood from outside the area to prevent spreading invasive insects (emerald ash borer, bark beetles). Buy firewood at the campground or nearby.

Never burn: trash, plastic, treated wood, cardboard, or aerosol cans.

## Firewood Collection

In national parks and many state parks, collecting deadfall is prohibited. In national forests and BLM land, limited collection of dead and down wood is typically allowed — but check local rules.

---

A fire that's respected is a fire that stays where you put it.`,
  },
  {
    title: 'Family Camping: How to Make It Fun for Everyone',
    excerpt: 'Camping with kids doesn\'t have to be stressful. With the right setup and realistic expectations, it\'s one of the best things you can do as a family.',
    featuredImage: 'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=1200&q=80',
    categorySlug: 'family-camping',
    content: `# Family Camping: How to Make It Fun for Everyone

The first family camping trip can feel overwhelming. Kids need more stuff, sleep differently outdoors, and have shorter patience for things going wrong. But get a few basics right and you'll be planning the next trip before you've unpacked from the first one.

## Start Close to Home

Your first trip shouldn't be a remote backcountry expedition. Pick a developed campground within two hours of home with bathrooms, running water, and ideally a playground. Lower the stakes and build positive memories before adding complexity.

## Involve the Kids in Planning

Kids who help choose the destination, pack their own bag, and pick the campfire snacks feel ownership over the trip. That ownership translates directly to enthusiasm — and less complaining.

## Pack for Sleep First

Adults can sleep in cold, firm, or uncomfortable conditions. Kids typically can't — and a bad night's sleep makes everything the next day harder. Invest in:

- **Sleeping bags rated to the actual nighttime temperature**, not the average.
- **Sleeping pads** with enough insulation. The ground pulls heat fast.
- **Familiar sleep objects** — a stuffed animal or a small blanket from home makes an unfamiliar environment feel safe.

## Keep Meals Simple

Camp cooking is not the time to attempt complex recipes. Go with:

- Hot dogs and foil packet meals over the fire
- Pre-made sandwiches for lunch
- Oatmeal or instant pancakes for breakfast
- Trail mix and fruit for snacking

The simpler the food, the more time you spend doing things instead of cooking.

## Plan Activities, Then Let Them Roam

Have one or two structured activities per day — a short hike, a fishing spot, a scavenger hunt. Then let kids have unstructured outdoor time. Mud, sticks, rocks, bugs — the unplanned stuff is usually what they remember.

## Set Realistic Expectations

Things will go sideways. It might rain. Someone will forget something. A kid will melt down. Build flexibility into the plan and frame problems as part of the adventure. Kids take emotional cues from parents — if you roll with it, they usually will too.

## Gear Worth Having for Families

- A canopy or tarp for shade/rain coverage over the picnic table
- Glow sticks or clip-on lights so kids can be seen after dark
- A small first-aid kit with kid-specific supplies (children's pain reliever, blister pads)
- Wet wipes — an unlimited supply

---

The goal isn't a perfect trip. It's a trip they ask to do again.`,
  },
]

async function main() {
  await prisma.$connect()

  // Verify author exists
  const author = await prisma.profile.findUnique({ where: { id: AUTHOR_ID } })
  if (!author) {
    console.error(`Author profile not found (${AUTHOR_ID}). Run the main seed first.`)
    process.exit(1)
  }

  console.log(`Seeding blog posts for author: ${author.displayName ?? AUTHOR_ID}`)

  // Upsert categories
  const categoryMap: Record<string, number> = {}
  for (const cat of categories) {
    const result = await prisma.blogCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
    categoryMap[cat.slug] = result.id
    console.log(`Category: ${cat.name} (id: ${result.id})`)
  }

  // Create posts
  for (const post of posts) {
    const postSlug = slug(post.title)
    const existing = await prisma.blogPost.findUnique({ where: { slug: postSlug } })
    if (existing) {
      console.log(`Skipping (already exists): ${post.title}`)
      continue
    }

    const created = await prisma.blogPost.create({
      data: {
        title: post.title,
        slug: postSlug,
        excerpt: post.excerpt,
        content: post.content,
        featuredImage: post.featuredImage,
        status: 'published',
        publishedAt: new Date(),
        readingTime: readingTime(post.content),
        authorId: AUTHOR_ID,
        categories: {
          create: [{ categoryId: categoryMap[post.categorySlug] }],
        },
      },
    })

    console.log(`Created: ${created.title} (slug: ${created.slug})`)
  }

  console.log('Done.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
