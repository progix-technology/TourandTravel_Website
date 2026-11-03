import React, { Suspense } from 'react'
import Hero from '../sections/Hero'
import Destinations from '../sections/Destinations'
import lazyWithRetry from '../utils/lazyWithRetry'
import { useSettings } from '../context/SettingsContext'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

// Lazy loaded below-the-fold heavy sections
const PrivateAviation = lazyWithRetry(() => import('../sections/PrivateAviation'))
const DestinationShowcase = lazyWithRetry(() => import('../sections/DestinationShowcase'))
const TourPackages = lazyWithRetry(() => import('../sections/TourPackages'))
const Experiences = lazyWithRetry(() => import('../sections/Experiences'))
const VacationPlanner = lazyWithRetry(() => import('../sections/VacationPlanner'))
const CustomTrip = lazyWithRetry(() => import('../sections/CustomTrip'))
const TravelGallery = lazyWithRetry(() => import('../sections/TravelGallery'))
const FinalCTA = lazyWithRetry(() => import('../sections/FinalCTA'))

const SectionSkeleton = () => (
  <div className="w-full min-h-[280px] flex items-center justify-center bg-[#071A16]/40 select-none py-16">
    <div className="flex flex-col items-center gap-3">
      <div className="w-6 h-6 rounded-full border-2 border-[#6FCF45]/30 border-t-[#6FCF45] animate-spin" />
      <span className="text-[10px] tracking-[0.25em] text-[#A8B5AF]/60 uppercase font-medium">Loading Experience...</span>
    </div>
  </div>
)

export const Home = () => {
  const { settings } = useSettings()

  return (
    <main className="w-full">
      {/* 1. Hero Section with Interactive 3D Globe */}
      <Hero />

      {/* Dynamic Promotional Announcement Banner (Below Hero Slide) */}
      {settings?.showAnnouncement && settings?.announcementText && (
        <div className="w-full bg-gradient-to-r from-[#040F0D] via-[#0B241E] to-[#040F0D] border-y border-[#6FCF45]/30 py-1.5 sm:py-2 px-2 shadow-[0_0_20px_rgba(111,207,69,0.06)] relative z-20 overflow-hidden">
          {/* Desktop View: Centered Clean Bar */}
          <div className="hidden md:flex max-w-[1240px] mx-auto items-center justify-center gap-2.5 text-center leading-none">
            <span className="flex h-1.5 w-1.5 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6FCF45] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#6FCF45]"></span>
            </span>
            <span className="text-xs font-semibold text-[#E0EBE6] tracking-wide">
              {settings.announcementText}
            </span>
            <Link
              to="/tours"
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#6FCF45]/15 hover:bg-[#6FCF45] text-[#6FCF45] hover:text-[#071A16] border border-[#6FCF45]/40 hover:border-[#6FCF45] text-[10px] font-bold uppercase tracking-wider transition-all duration-300 shadow-sm shrink-0 ml-1 hover:scale-105 active:scale-95"
            >
              <span>Explore Offers</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </Link>
          </div>

          {/* Mobile View: Smooth Continuous Marquee Ticker */}
          <div className="md:hidden flex overflow-hidden select-none whitespace-nowrap">
            <div className="animate-marquee-scroll flex items-center">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-2.5 mx-5 shrink-0">
                  <span className="flex h-1.5 w-1.5 relative shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6FCF45] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#6FCF45]"></span>
                  </span>
                  <span className="text-[11px] font-semibold text-[#E0EBE6] tracking-wide whitespace-nowrap">
                    {settings.announcementText}
                  </span>
                  <Link
                    to="/tours"
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#6FCF45]/20 text-[#6FCF45] border border-[#6FCF45]/40 text-[9px] font-bold uppercase tracking-wider shrink-0"
                  >
                    <span>Explore Offers</span>
                    <ArrowRight className="w-2 h-2" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Destinations Section (Immediate) */}
      <Destinations />

      {/* Below-The-Fold Sections (Lazy Loaded on Scroll) */}
      <Suspense fallback={<SectionSkeleton />}>
        {/* 3. Travel Map 3D Airplane Slide */}
        <PrivateAviation />

        {/* 4. Multi-Panel Destination Showcase */}
        <DestinationShowcase />

        {/* 5. Signature Tour Packages Section */}
        <TourPackages />

        {/* 6. Experiences Section */}
        <Experiences />

        {/* 7. Vacation Planner & Voices from the Road */}
        <VacationPlanner />

        {/* 8. Custom Trip Section */}
        <CustomTrip />

        {/* 9. Travel Gallery Section */}
        <TravelGallery />

        {/* 10. Final CTA */}
        <FinalCTA />
      </Suspense>
    </main>
  )
}

export default Home
