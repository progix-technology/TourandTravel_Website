import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Globe2, Map, Compass, Plane } from 'lucide-react'

// Import user's 8 curated travel images
import kashmirImg from '../assets/images/travel_image/kashmir.jpg'
import maldivesImg from '../assets/images/travel_image/maldives.jpg'
import dubaiImg from '../assets/images/travel_image/dubai.jpg'
import parisImg from '../assets/images/travel_image/paris.jpg'
import baliImg from '../assets/images/travel_image/bali.jpg'
import switzerlandImg from '../assets/images/travel_image/Switzerland.jpg'
import tokyoImg from '../assets/images/travel_image/tokyo.jpg'
import rajasthanImg from '../assets/images/travel_image/rajsthan.jpg'
import svgplaneImg from '../assets/images/svgplane.png'

// Custom Razor-Sharp Minimalist Line Icons matching the exact screenshot
const KashmirIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-white/90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
    <path d="M4 25L13 9L19 19L22 14L28 25H4Z" />
    <path d="M10 25L13 18L16 25" />
    <path d="M13 9L15 13L11 15" />
  </svg>
)

const MaldivesIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-white/90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
    <path d="M16 24V14" />
    <path d="M16 14C14 10 9 10 7 12C9 13 13 14 16 14Z" />
    <path d="M16 14C18 10 23 10 25 12C23 13 19 14 16 14Z" />
    <path d="M16 14C15 8 18 6 20 6" />
    <path d="M6 25C8 24 10 24 12 25C14 26 18 26 20 25C22 24 24 24 26 25" />
    <path d="M8 28C10 27 12 27 14 28C16 29 20 29 22 28C24 27 26 27 28 28" />
  </svg>
)

const DubaiIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-white/90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
    <path d="M16 3V28" />
    <path d="M12 28L14 10L16 7L18 10L20 28H12Z" />
    <path d="M9 28L12 16L14 14" />
    <path d="M23 28L20 16L18 14" />
    <path d="M12 22H20" />
    <path d="M13 16H19" />
  </svg>
)

const ParisIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-white/90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
    <path d="M16 4V8" />
    <path d="M13 28L15 9H17L19 28" />
    <path d="M11 28C11 24 13 22 16 22C19 22 21 24 21 28" />
    <path d="M13.5 16H18.5" />
    <path d="M12 22H20" />
    <path d="M9 28H23" />
  </svg>
)

const BaliIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-white/90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
    <path d="M16 4L19 8H13L16 4Z" />
    <path d="M11 12H21L19 14H13L11 12Z" />
    <path d="M9 18H23L21 20H11L9 18Z" />
    <path d="M7 24H25L23 27H9L7 24Z" />
    <path d="M13 27V29H19V27" />
  </svg>
)

const SwitzerlandIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-white/90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
    <path d="M5 26L13 10L19 20L21 16L27 26H5Z" />
    <path d="M13 10L15 14L11 16" />
    <path d="M21 16L23 19L20 20" />
  </svg>
)

const TokyoIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-white/90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
    <path d="M5 8C10 7 22 7 27 8" />
    <path d="M7 11H25" />
    <path d="M10 11V27" />
    <path d="M22 11V27" />
    <path d="M15 11V15H17V11" />
  </svg>
)

const RajasthanIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-white/90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
    <path d="M16 6C15 8 13 9 13 12H19C19 9 17 8 16 6Z" />
    <path d="M8 12C7.5 13.5 6 14 6 16H10C10 14 8.5 13.5 8 12Z" />
    <path d="M24 12C23.5 13.5 22 14 22 16H26C26 14 24.5 13.5 24 12Z" />
    <path d="M5 16H27V26H5V16Z" />
    <path d="M14 26V20C14 19 18 19 18 20V26" />
    <path d="M8 20H10V22H8V20Z" />
    <path d="M22 20H24V22H22V20Z" />
  </svg>
)

export const DestinationShowcase = () => {
  const [activePanel, setActivePanel] = useState(null)

  const destinations = [
    {
      id: 'kashmir',
      name: 'Kashmir',
      country: 'India',
      image: kashmirImg,
      Icon: KashmirIcon,
      tagline: 'Snow-crowned Himalayan peaks & Dal Lake houseboats',
      duration: '7 Days • 6 Nights',
      price: '₹24,999',
      link: '/tours/kashmir-escape',
    },
    {
      id: 'maldives',
      name: 'Maldives',
      country: 'Maldives',
      image: maldivesImg,
      Icon: MaldivesIcon,
      tagline: 'Crystal turquoise lagoons & secluded overwater villas',
      duration: '6 Days • 5 Nights',
      price: '₹84,999',
      link: '/tours/maldives-retreat',
    },
    {
      id: 'dubai',
      name: 'Dubai',
      country: 'UAE',
      image: dubaiImg,
      Icon: DubaiIcon,
      tagline: 'Futuristic skylines, golden dunes & luxury lifestyle',
      duration: '6 Days • 5 Nights',
      price: '₹48,999',
      link: '/tours/dubai-explorer',
    },
    {
      id: 'paris',
      name: 'Paris',
      country: 'France',
      image: parisImg,
      Icon: ParisIcon,
      tagline: 'Iconic Eiffel sunsets, timeless art & haute couture',
      duration: '6 Days • 5 Nights',
      price: '₹1,24,999',
      link: '/tours/paris',
    },
    {
      id: 'bali',
      name: 'Bali',
      country: 'Indonesia',
      image: baliImg,
      Icon: BaliIcon,
      tagline: 'Sacred water temples, tropical jungles & sunset beaches',
      duration: '7 Days • 6 Nights',
      price: '₹38,999',
      link: '/tours/bali',
    },
    {
      id: 'switzerland',
      name: 'Switzerland',
      country: 'Switzerland',
      image: switzerlandImg,
      Icon: SwitzerlandIcon,
      tagline: 'Matterhorn alpine peaks & scenic red mountain trains',
      duration: '8 Days • 7 Nights',
      price: '₹1,49,999',
      link: '/tours/switzerland',
    },
    {
      id: 'tokyo',
      name: 'Tokyo',
      country: 'Japan',
      image: tokyoImg,
      Icon: TokyoIcon,
      tagline: 'Illuminated Tokyo Tower, ancient shrines & cherry blossoms',
      duration: '9 Days • 8 Nights',
      price: '₹1,34,999',
      link: '/tours/tokyo',
    },
    {
      id: 'rajasthan',
      name: 'Rajasthan',
      country: 'India',
      image: rajasthanImg,
      Icon: RajasthanIcon,
      tagline: 'Royal golden forts, palatial heritage & desert safaris',
      duration: '8 Days • 7 Nights',
      price: '₹18,999',
      link: '/tours/rajasthan-heritage',
    },
  ]

  return (
    <section
      id="destination-gallery"
      className="relative bg-[#071A16] text-white pt-6 sm:pt-8 lg:pt-9 pb-8 sm:pb-10 lg:pb-12 px-3 sm:px-6 lg:px-8 overflow-hidden flex flex-col justify-start select-none"
    >
      {/* Background Ambient Glows & Brand Logo Watermark */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#6FCF45]/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#C69242]/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Luxury Brand Logo Watermark in Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none -z-10 overflow-hidden">
        <div className="relative flex flex-col items-center opacity-[0.03] transform scale-100 sm:scale-120 lg:scale-135">
          <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-[20px] border-2 border-white/40 flex items-center justify-center mb-3">
            <svg
              viewBox="0 0 24 24"
              className="w-20 h-20 sm:w-28 sm:h-28 fill-none stroke-white stroke-[1.5]"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M8.5 14.5l3-5 4 4 2.5-3.5" />
            </svg>
          </div>
          <span className="font-heading text-2xl sm:text-3xl tracking-[0.3em] font-bold text-white uppercase whitespace-nowrap">
            TOURS &amp; TRAVELS
          </span>
        </div>
      </div>

      {/* 1. Header Section with Balanced Spacing */}
      <div className="relative z-20 w-full max-w-[1720px] mx-auto mb-3 sm:mb-4 lg:mb-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-2.5 sm:gap-3">
          {/* Center Heading with flight loop emerging directly from 'd' in World */}
          <div className="flex-1 flex flex-col items-center text-center relative">
            <div className="relative inline-flex items-center">
              <h2 className="relative z-10 text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-bold tracking-tight text-white font-heading leading-tight drop-shadow-[0_4px_14px_rgba(0,0,0,0.9)] flex items-center">
                Explore{' '}
                <span className="text-[#6FCF45] ml-2 sm:ml-2.5 relative inline-flex items-center">
                  The World
                  {/* Flight Trail emerging directly from the very end of 'd' */}
                  <span className="relative inline-block -ml-1 sm:-ml-1.5 lg:-ml-2 -translate-y-1.5 sm:-translate-y-2 lg:-translate-y-2.5">
                    <img
                      src={svgplaneImg}
                      alt="Flight Trail"
                      className="w-16 sm:w-22 md:w-26 lg:w-30 max-w-none h-auto object-contain pointer-events-none select-none drop-shadow-[0_0_15px_rgba(111,207,69,0.85)]"
                    />
                  </span>
                </span>
              </h2>
            </div>

            <p className="relative z-10 mt-0.5 text-[11px] sm:text-xs text-[#A8B5AF] font-normal tracking-wide">
              Extraordinary places. Unforgettable experiences.
            </p>
          </div>

          {/* Right Statistics Counters: Direct Clean Icons */}
          <div className="flex items-center gap-5 sm:gap-7 lg:gap-8 lg:absolute lg:right-0 mt-1 lg:mt-0">
            {/* Stat 1: Destinations */}
            <div className="flex flex-col items-center text-center group cursor-default">
              <Globe2 className="w-5 h-5 text-[#6FCF45] mb-0.5 drop-shadow-[0_0_8px_rgba(111,207,69,0.5)] transition-transform duration-300 group-hover:scale-110" />
              <span className="text-sm sm:text-base font-bold text-white font-mono leading-none">
                120+
              </span>
              <span className="text-[8.5px] text-[#A8B5AF] font-medium tracking-wider uppercase mt-0.5">
                Destinations
              </span>
            </div>

            {/* Stat 2: Countries */}
            <div className="flex flex-col items-center text-center group cursor-default">
              <Map className="w-5 h-5 text-[#6FCF45] mb-0.5 drop-shadow-[0_0_8px_rgba(111,207,69,0.5)] transition-transform duration-300 group-hover:scale-110" />
              <span className="text-sm sm:text-base font-bold text-white font-mono leading-none">
                35+
              </span>
              <span className="text-[8.5px] text-[#A8B5AF] font-medium tracking-wider uppercase mt-0.5">
                Countries
              </span>
            </div>

            {/* Stat 3: Experiences */}
            <div className="flex flex-col items-center text-center group cursor-default">
              <Compass className="w-5 h-5 text-[#6FCF45] mb-0.5 drop-shadow-[0_0_8px_rgba(111,207,69,0.5)] transition-transform duration-300 group-hover:scale-110" />
              <span className="text-sm sm:text-base font-bold text-white font-mono leading-none">
                500+
              </span>
              <span className="text-[8.5px] text-[#A8B5AF] font-medium tracking-wider uppercase mt-0.5">
                Experiences
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 8-Panel Showcase: 2-column grid on mobile (all 8 visible), 4-column on tablet, Grand expanding accordion on desktop */}
      <div className="relative z-10 w-full max-w-[1720px] mx-auto mt-1 sm:mt-2">
        <div className="w-full grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-row gap-2.5 sm:gap-3 items-stretch py-2 lg:h-[680px] xl:h-[720px] px-0.5 sm:px-1">
          {destinations.map((dest, idx) => {
            const isExpanded = activePanel === idx
            const DestinationIcon = dest.Icon

            return (
              <motion.div
                key={dest.id}
                onMouseEnter={() => setActivePanel(idx)}
                onMouseLeave={() => setActivePanel(null)}
                onClick={() => setActivePanel(activePanel === idx ? null : idx)}
                layout
                transition={{
                  type: 'spring',
                  stiffness: 280,
                  damping: 30,
                }}
                className={`relative rounded-[16px] sm:rounded-[22px] lg:rounded-[24px] overflow-hidden cursor-pointer select-none transition-all duration-500 shadow-xl border border-white/10 group h-[200px] sm:h-[260px] lg:h-full w-full lg:w-auto ${
                  isExpanded
                    ? 'lg:flex-[2.8] ring-2 ring-[#6FCF45]/50'
                    : activePanel !== null
                    ? 'lg:flex-[0.85] opacity-80 hover:opacity-95'
                    : 'lg:flex-1 opacity-95 hover:opacity-100'
                }`}
              >
                {/* Background Destination Photo */}
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <img
                    src={dest.image}
                    alt={`${dest.name}, ${dest.country}`}
                    loading="lazy"
                    decoding="async"
                    className={`w-full h-full object-cover object-center transition-transform duration-700 ease-out ${
                      isExpanded ? 'scale-105' : 'scale-100 group-hover:scale-105'
                    }`}
                  />

                  {/* Gradient Overlays for High Contrast Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/75" />
                  <div className="absolute inset-0 bg-[#071A16]/20 mix-blend-multiply" />
                </div>

                {/* Top Label: Destination Name & Country */}
                <div className="absolute top-0 inset-x-0 p-2.5 sm:p-3.5 lg:p-4 z-20 flex flex-col items-center text-center">
                  <h3 className="text-base sm:text-lg lg:text-[22px] font-bold tracking-tight text-white font-heading leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] whitespace-nowrap truncate max-w-full">
                    {dest.name}
                  </h3>
                  <span className="text-[10px] sm:text-[11px] lg:text-xs font-semibold tracking-wider text-[#6FCF45] font-sans mt-0.5 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] whitespace-nowrap truncate max-w-full">
                    {dest.country}
                  </span>
                </div>

                {/* Bottom Center: Minimalist Landmark Line Art Icon */}
                <div className={`absolute bottom-3 sm:bottom-4 lg:bottom-4.5 inset-x-0 z-20 flex flex-col items-center justify-center pointer-events-none transition-transform duration-300 group-hover:scale-110 ${
                  isExpanded ? 'opacity-0' : 'opacity-100'
                }`}>
                  <DestinationIcon />
                </div>

                {/* Bottom Overlay: Revealed on Expanded State */}
                <div
                  className={`absolute bottom-0 inset-x-0 p-2.5 sm:p-4 lg:p-5 z-30 flex flex-col justify-end bg-gradient-to-t from-black/95 via-black/85 to-transparent transition-all duration-300 ${
                    isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                  }`}
                >
                  <p className="text-[9.5px] sm:text-[11px] lg:text-xs text-white/90 font-normal leading-tight sm:leading-relaxed line-clamp-2 drop-shadow-md mb-1.5 sm:mb-2.5">
                    {dest.tagline}
                  </p>

                  <div className="flex items-center justify-between pt-1.5 sm:pt-2.5 border-t border-white/20">
                    <div>
                      <span className="text-[7.5px] sm:text-[9px] uppercase tracking-wider text-white/70 block">
                        {dest.duration}
                      </span>
                      <span className="text-[10.5px] sm:text-xs lg:text-sm font-bold text-[#6FCF45] font-mono">
                        From {dest.price}
                      </span>
                    </div>

                    <Link
                      to={dest.link}
                      className="inline-flex items-center gap-0.5 sm:gap-1 bg-white text-[#071A16] px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-semibold uppercase tracking-wider hover:bg-[#6FCF45] transition-colors shadow-lg"
                    >
                      <span>Explore</span>
                      <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default DestinationShowcase
