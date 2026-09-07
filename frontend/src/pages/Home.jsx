import React from 'react'
import Hero from '../sections/Hero'
import Destinations from '../sections/Destinations'
import PrivateAviation from '../sections/PrivateAviation'
import DestinationShowcase from '../sections/DestinationShowcase'
import Experiences from '../sections/Experiences'
import TourPackages from '../sections/TourPackages'
import VacationPlanner from '../sections/VacationPlanner'
import CustomTrip from '../sections/CustomTrip'
import TravelGallery from '../sections/TravelGallery'
import FinalCTA from '../sections/FinalCTA'
import { useSettings } from '../context/SettingsContext'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export const Home = () => {
  const { settings } = useSettings()

  return (
    <main className="w-full">
      {/* 1. Hero Section with Interactive 3D Globe */}
      <Hero />

      {/* Dynamic Promotional Announcement Banner (Below Hero Slide) */}
      {settings?.showAnnouncement && settings?.announcementText && (
        <div className="w-full bg-gradient-to-r from-[#040F0D] via-[#0B241E] to-[#040F0D] border-y border-[#6FCF45]/30 py-1 sm:py-1.5 px-4 shadow-[0_0_20px_rgba(111,207,69,0.06)] relative z-20 overflow-hidden">
          <div className="max-w-[1240px] mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 text-center leading-none">
            <span className="flex h-1.5 w-1.5 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6FCF45] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#6FCF45]"></span>
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-[#E0EBE6] tracking-wide">
              {settings.announcementText}
            </span>
            <Link
              to="/tours"
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#6FCF45]/15 hover:bg-[#6FCF45] text-[#6FCF45] hover:text-[#071A16] border border-[#6FCF45]/40 hover:border-[#6FCF45] text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all duration-300 shadow-sm shrink-0 ml-1 hover:scale-105 active:scale-95"
            >
              <span>Explore Offers</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </Link>
          </div>
        </div>
      )}

      {/* 2. Destinations Section */}
      <Destinations />

      {/* 3. Travel Map 3D Airplane Slide */}
      <PrivateAviation />

      {/* 4. Multi-Panel Destination Showcase (8 Vertical Travel Panels requested by User) */}
      <DestinationShowcase />

      {/* 5. Signature Tour Packages Section */}
      <TourPackages />

      {/* 6. Experiences Section (Travel Beyond The Ordinary) */}
      <Experiences />

      {/* 7. Vacation Planner & Voices from the Road (Combined Section) */}
      <VacationPlanner />

      {/* 8. Custom Trip Section */}
      <CustomTrip />

      {/* 10. Travel Gallery Section */}
      <TravelGallery />

      {/* 11. Final CTA */}
      <FinalCTA />
    </main>
  )
}

export default Home
