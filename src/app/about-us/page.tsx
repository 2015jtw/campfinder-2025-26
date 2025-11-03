import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | CampFinder',
  description:
    'Learn about CampFinder - your trusted companion for discovering the perfect camping experience.',
}

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/steven-kamenar-MMJx78V7xS8-unsplash.jpg')",
          }}
        >
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>

        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400/30 rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Badge */}
            <div className="flex justify-center mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/90 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-sm font-medium backdrop-blur-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
                Discover Your Next Adventure
              </span>
            </div>

            {/* Heading with gradient text effect on white background */}
            <div className="text-center space-y-6 mb-12">
              <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-2xl leading-tight">
                About CampFinder
              </h1>
              <p className="text-xl md:text-2xl text-white/95 drop-shadow-lg leading-relaxed max-w-3xl mx-auto font-light">
                Your ultimate companion for discovering the perfect camping experience
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Our Mission</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                At CampFinder, we believe that everyone deserves to experience the beauty and
                tranquility of the great outdoors. Our mission is to make it easier than ever to
                discover, explore, and book the perfect campground for your next adventure.
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                We&apos;re building a community of outdoor enthusiasts who share their experiences,
                insights, and recommendations to help others find their ideal camping destination.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 pt-8">
              <div className="space-y-3">
                <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-blue-600 dark:text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                  Easy Discovery
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Search and filter through hundreds of campgrounds to find the perfect match for
                  your preferences and needs.
                </p>
              </div>

              <div className="space-y-3">
                <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-green-600 dark:text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                  Community Driven
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Read authentic reviews and see real photos from fellow campers who have visited
                  these locations.
                </p>
              </div>

              <div className="space-y-3">
                <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-purple-600 dark:text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                  Trusted Information
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Get detailed, accurate information about facilities, amenities, and policies for
                  each campground.
                </p>
              </div>
            </div>

            {/* Story Section */}
            <div className="space-y-4 pt-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Our Story</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                CampFinder was born from a simple frustration: finding the right campground
                shouldn&apos;t be so hard. We spent countless hours scrolling through outdated
                websites, reading conflicting reviews, and piecing together information from
                multiple sources.
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                We knew there had to be a better way. So we built CampFinder - a modern, intuitive
                platform that brings all the information you need into one place. With detailed
                search filters, interactive maps, authentic reviews, and stunning photos, CampFinder
                makes it easy to find your next outdoor adventure.
              </p>
            </div>

            {/* Values Section */}
            <div className="space-y-4 pt-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Our Values</h2>
              <div className="space-y-6">
                <div className="border-l-4 border-blue-600 pl-4">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
                    Authenticity
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    We believe in genuine experiences and honest reviews from real campers.
                  </p>
                </div>
                <div className="border-l-4 border-green-600 pl-4">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
                    Community
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    We foster a supportive community of outdoor enthusiasts who help each other
                    discover amazing places.
                  </p>
                </div>
                <div className="border-l-4 border-purple-600 pl-4">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
                    Sustainability
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    We encourage responsible camping practices and respect for nature.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-8 text-center space-y-4 mt-12">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                Ready to Start Your Adventure?
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Join thousands of campers who have discovered their perfect outdoor getaway with
                CampFinder.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link
                  href="/campgrounds"
                  className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                >
                  Browse Campgrounds
                  <svg
                    className="w-5 h-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
                <Link
                  href="/login"
                  className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                >
                  Sign Up Today
                  <svg
                    className="w-5 h-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
