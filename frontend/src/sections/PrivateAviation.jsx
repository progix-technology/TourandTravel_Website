import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import userAirplaneImg from '../assets/images/user_airplane.png'
import thirdSlideBg from '../assets/images/3rdslidebg.png'

export const PrivateAviation = () => {
  const containerRef = useRef(null)
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 768 : false
  )

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Scroll runway - EXACTLY preserved
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Spring physics - EXACTLY preserved
  const springConfig = { damping: 18, stiffness: 140, mass: 0.5 }
  const smoothFlight = useSpring(scrollYProgress, springConfig)

  // Airplane flight traverse - Smoothly traverses across the middle of the slide
  const planeX = useTransform(smoothFlight, [0.08, 0.5, 0.92], ['-130vw', '0vw', '130vw'])
  const planeOpacity = useTransform(smoothFlight, [0, 0.08, 0.92, 0.98], [0, 1, 1, 0])

  // Precision Matched Coordinates for each 3D Landmark Illustrated on the Map
  const destinations = [
    {
      name: 'NEW YORK',
      country: 'USA',
      icon: '🗽',
      top: '23%',
      left: '20%',
      showOnMobile: false,
    },
    {
      name: 'MACHU PICCHU',
      country: 'PERU',
      icon: '🛕',
      top: '60%',
      left: '24%',
      showOnMobile: false,
    },
    {
      name: 'PARIS',
      country: 'FRANCE',
      icon: '🗼',
      // Directly on Eiffel Tower 3D structure
      top: '20%',
      left: '44%',
      mobileTop: '25%',
      mobileLeft: '22%',
      showOnMobile: true,
    },
    {
      name: 'SWITZERLAND',
      country: 'EUROPE',
      icon: '🏔️',
      // Scenic Alpine & Mediterranean Haven
      top: '36%',
      left: '44%',
      mobileTop: '43%',
      mobileLeft: '26%',
      showOnMobile: true,
    },
    {
      name: 'CAPE TOWN',
      country: 'SOUTH AFRICA',
      icon: '🌊',
      // Directly on the Southern African Mountains & Lake
      top: '72%',
      left: '48%',
      mobileTop: '77%',
      mobileLeft: '27%',
      showOnMobile: true,
    },
    {
      name: 'DUBAI',
      country: 'UAE',
      icon: '🏙️',
      // Directly on Burj Khalifa & Futuristic Skyline Island
      top: '28%',
      left: '58%',
      mobileTop: '35%',
      mobileLeft: '72%',
      showOnMobile: true,
    },
    {
      name: 'KASHMIR',
      country: 'INDIA',
      icon: '🏔️',
      top: '14%',
      left: '69%',
      showOnMobile: false,
    },
    {
      name: 'MALDIVES',
      country: 'INDIAN OCEAN',
      icon: '🏝️',
      // Directly on the Bottom-Right Turquoise Lagoon Overwater Villas
      top: '60%',
      left: '64%',
      mobileTop: '72%',
      mobileLeft: '88%',
      showOnMobile: true,
    },
    {
      name: 'BALI',
      country: 'INDONESIA',
      icon: '⛩️',
      // Directly on Central Palm Oasis Island
      top: '50%',
      left: '74%',
      mobileTop: '57%',
      mobileLeft: '32%',
      showOnMobile: true,
    },
    {
      name: 'TOKYO',
      country: 'JAPAN',
      icon: '🌸',
      top: '27%',
      left: '83%',
      showOnMobile: false,
    },
    {
      name: 'SYDNEY',
      country: 'AUSTRALIA',
      icon: '⛵',
      top: '74%',
      left: '86%',
      showOnMobile: false,
    },
  ]

  return (
    <section
      ref={containerRef}
      id="travel-journey"
      className="relative h-[180vh] bg-[#FAF8F2] w-full select-none"
    >
      {/* Sticky Full-Width Viewport Slide */}
      <div className="sticky top-0 h-screen overflow-hidden w-full max-w-none">
        {/* 1. Travel World-Map Relief Background */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <img
            src={thirdSlideBg}
            alt="World Travel Map Relief"
            className="w-full h-full object-cover object-center opacity-95"
          />
          {/* Subtle warm atmospheric vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F2]/85 via-transparent to-[#FAF8F2]/65 pointer-events-none" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-[#FAF8F2]/40 pointer-events-none" />
        </div>

        {/* 2. Elegant Gold Dotted Route Lines Connecting Illustrated Landmarks */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-75" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="goldRouteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C69242" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#4F8F45" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#C69242" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          {/* New York to Paris */}
          <path
            d="M 20 23 Q 32 12 44 15"
            fill="none"
            stroke="url(#goldRouteGrad)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            vectorEffect="non-scaling-stroke"
          />
          {/* New York to Machu Picchu */}
          <path
            d="M 20 23 Q 18 42 24 60"
            fill="none"
            stroke="url(#goldRouteGrad)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            vectorEffect="non-scaling-stroke"
          />
          {/* Paris to Santorini */}
          <path
            d="M 44 15 Q 43 25 44 36"
            fill="none"
            stroke="url(#goldRouteGrad)"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            vectorEffect="non-scaling-stroke"
          />
          {/* Santorini to Cape Town */}
          <path
            d="M 44 36 Q 42 54 48 72"
            fill="none"
            stroke="url(#goldRouteGrad)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            vectorEffect="non-scaling-stroke"
          />
          {/* Paris to Dubai */}
          <path
            d="M 44 15 Q 51 21 58 28"
            fill="none"
            stroke="url(#goldRouteGrad)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            vectorEffect="non-scaling-stroke"
          />
          {/* Dubai to Kashmir */}
          <path
            d="M 58 28 Q 63 21 69 14"
            fill="none"
            stroke="url(#goldRouteGrad)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            vectorEffect="non-scaling-stroke"
          />
          {/* Kashmir to Bali */}
          <path
            d="M 69 14 Q 72 32 74 50"
            fill="none"
            stroke="url(#goldRouteGrad)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            vectorEffect="non-scaling-stroke"
          />
          {/* Bali to Maldives */}
          <path
            d="M 74 50 Q 69 58 64 60"
            fill="none"
            stroke="url(#goldRouteGrad)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            vectorEffect="non-scaling-stroke"
          />
          {/* Bali to Tokyo */}
          <path
            d="M 74 50 Q 80 38 83 27"
            fill="none"
            stroke="url(#goldRouteGrad)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            vectorEffect="non-scaling-stroke"
          />
          {/* Bali to Sydney */}
          <path
            d="M 74 50 Q 80 62 86 74"
            fill="none"
            stroke="url(#goldRouteGrad)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            vectorEffect="non-scaling-stroke"
          />
        </svg>


        {/* 4. Precision Destination Badges Attached Directly on Each 3D Landmark */}
        <div className="absolute inset-0 max-w-[1440px] mx-auto w-full h-full pointer-events-none select-none z-20">
          {destinations.map((dest) => (
            <div
              key={dest.name}
              style={{
                top: !isDesktop && dest.mobileTop ? dest.mobileTop : dest.top,
                left: !isDesktop && dest.mobileLeft ? dest.mobileLeft : dest.left,
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 ${
                dest.showOnMobile ? 'flex' : 'hidden md:flex'
              } flex-col items-center group pointer-events-auto cursor-default transition-transform duration-300 hover:scale-110`}
            >
              {/* Minimal Cartography Annotation Badge */}
              <div className="flex flex-col items-center text-center bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-[3px] border border-[#C69242]/30 shadow-[0_3px_10px_rgba(0,0,0,0.08)]">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-[9.5px] sm:text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#13251F] font-heading whitespace-nowrap">
                    {dest.name}
                  </span>
                  <span className="text-[10px] leading-none">{dest.icon}</span>
                </div>
                <span className="text-[7.5px] sm:text-[8px] font-semibold tracking-[0.2em] text-[#8B6B38] uppercase mt-0.5 font-sans leading-none whitespace-nowrap">
                  {dest.country}
                </span>
              </div>

              {/* Subtle Gold Location Pin Marker Underneath Badge */}
              <div className="flex flex-col items-center mt-0.5">
                <div className="w-[1px] h-1.5 bg-[#C69242]/70" />
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C69242] opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C69242] border border-white shadow-sm" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 5. Center Flying Airplane Crossing Directly Across the Middle of the Slide */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none z-30">
          <motion.div
            style={{
              x: planeX,
              opacity: planeOpacity,
            }}
            className="relative w-full max-w-[850px] sm:max-w-[1100px] lg:max-w-[1350px] xl:max-w-[1500px] flex items-center justify-center select-none translate-y-0"
          >
            {/* Aerodynamic Soft Shadow */}
            <div className="absolute w-[88%] h-14 bg-black/15 rounded-full blur-2xl top-[86%] left-1/2 -translate-x-1/2 scale-y-50 pointer-events-none" />

            {/* Exact Airplane Image */}
            <img
              src={userAirplaneImg}
              alt="Luxury Private Jet Aircraft"
              className="w-full h-auto object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.12)] pointer-events-none scale-105 sm:scale-110"
            />
          </motion.div>
        </div>

        {/* 6. Lower Editorial Content Block (Firmly pinned at the bottom of the slide) */}
        <div className="absolute bottom-2.5 sm:bottom-5 lg:bottom-7 left-4 sm:left-10 lg:left-14 right-4 sm:right-10 lg:right-14 z-20 grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-6 items-end pointer-events-auto">
          {/* Main Editorial Heading & CTA */}
          <div className="md:col-span-8 flex flex-col items-start text-left max-w-xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold tracking-tight text-[#13251F] leading-[1.08] font-heading">
              ONE JOURNEY. <br />
              <span className="text-[#13251F]">COUNTLESS </span>
              <span className="text-[#C69242] font-bold">STORIES.</span>
            </h2>

            <p className="mt-1.5 sm:mt-2.5 text-xs sm:text-sm text-[#4A5D54] leading-relaxed max-w-lg font-normal">
              From iconic destinations to hidden escapes, discover journeys made for unforgettable memories.
            </p>

            {/* Premium CTA Button */}
            <div className="mt-3 sm:mt-4">
              <Link
                to="/destinations"
                className="group inline-flex items-center gap-2.5 bg-[#071A16] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 hover:bg-[#0F352C] hover:shadow-lg active:scale-95 cursor-pointer"
              >
                <span>Explore Destinations</span>
                <ArrowRight className="w-4 h-4 text-[#C69242] transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Bottom-Left Editorial Tagline */}
            <div className="mt-2.5 sm:mt-4 flex items-baseline gap-2 text-xs font-medium text-[#1E2B25]/80 uppercase tracking-widest font-heading">
              <span>EVERY PLACE</span>
              <span className="text-[#C69242] font-semibold italic capitalize tracking-normal font-sans text-sm">
                Tells a Story
              </span>
            </div>
          </div>

          {/* Right-Side Subtle Micro Statistics (Desktop only) */}
          <div className="hidden md:flex md:col-span-4 justify-end">
            <div className="flex items-center gap-6 lg:gap-8 bg-white/80 backdrop-blur-md px-5 py-3 rounded-[3px] border border-[#1E2B25]/10 shadow-sm">
              <div className="flex flex-col text-left">
                <span className="text-base lg:text-lg font-bold text-[#13251F] font-mono leading-none">
                  100+
                </span>
                <span className="text-[8px] lg:text-[9px] font-semibold tracking-[0.2em] text-[#5C6E67] uppercase mt-1">
                  DESTINATIONS
                </span>
              </div>

              <div className="w-[1px] h-6 bg-[#1E2B25]/15" />

              <div className="flex flex-col text-left">
                <span className="text-base lg:text-lg font-bold text-[#13251F] font-mono leading-none">
                  50+
                </span>
                <span className="text-[8px] lg:text-[9px] font-semibold tracking-[0.2em] text-[#5C6E67] uppercase mt-1">
                  CURATED TRIPS
                </span>
              </div>

              <div className="w-[1px] h-6 bg-[#1E2B25]/15" />

              <div className="flex flex-col text-left">
                <span className="text-base lg:text-lg font-bold text-[#C69242] font-mono leading-none">
                  ∞
                </span>
                <span className="text-[8px] lg:text-[9px] font-semibold tracking-[0.2em] text-[#5C6E67] uppercase mt-1">
                  MEMORIES
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PrivateAviation
