import { Tent } from 'lucide-react'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden h-screen">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=2070&auto=format&fit=crop)',
        }}
      >
        {/* Multi-layer overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/30 to-teal-900/30" />
      </div>

      {/* Animated particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/40 rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white/30 rounded-full animate-pulse delay-75" />
        <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-white/50 rounded-full animate-pulse delay-150" />
      </div>

      <div className="relative container mx-auto px-4 h-full flex items-center justify-center">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Icon badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <Tent className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">Your Adventure Starts Here</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight drop-shadow-2xl">
            Discover Your Perfect
            <span className="block mt-3 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Camping Experience
            </span>
          </h1>

          {/* Call-to-Action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link
              href="/campgrounds/new"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-emerald-500/20"
            >
              Create a Campground
            </Link>
            <Link
              href="/campgrounds"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl backdrop-blur-md border border-white/20 hover:border-white/30 transform hover:-translate-y-1 transition-all duration-300"
            >
              Explore Campgrounds
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent" />
    </section>
  )
}
