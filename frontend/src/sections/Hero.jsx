import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Star } from 'lucide-react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import Button from '../components/Button'
import { Globe } from '../components/ui/cobe-globe'

// Curated Luxury Travel Hubs Across Northern & Southern Hemispheres
const travelMarkers = [
  { id: 'kashmir', location: [34.0837, 74.7973], label: 'Kashmir' },
  { id: 'dubai', location: [25.2048, 55.2708], label: 'Dubai' },
  { id: 'maldives', location: [3.2028, 73.2207], label: 'Maldives' },
  { id: 'paris', location: [48.8566, 2.3522], label: 'Paris' },
  { id: 'bali', location: [-8.4095, 115.1889], label: 'Bali' },
  { id: 'tokyo', location: [35.6762, 139.6503], label: 'Tokyo' },
  { id: 'london', location: [51.5074, -0.1278], label: 'London' },
  { id: 'newyork', location: [40.7128, -74.006], label: 'New York' },
  { id: 'capetown', location: [-33.9249, 18.4241], label: 'Cape Town' },
  { id: 'sydney', location: [-33.8688, 151.2093], label: 'Sydney' },
  { id: 'saopaulo', location: [-23.5505, -46.6333], label: 'São Paulo' },
]

// Signature Flight Routes connecting Top, Center & Bottom of the Globe
const travelArcs = [
  // Northern & Center Routes
  { id: 'paris-dubai', from: [48.8566, 2.3522], to: [25.2048, 55.2708] },
  { id: 'dubai-kashmir', from: [25.2048, 55.2708], to: [34.0837, 74.7973] },
  { id: 'kashmir-maldives', from: [34.0837, 74.7973], to: [3.2028, 73.2207] },
  
  // Southern & Intercontinental Lower Routes
  { id: 'dubai-capetown', from: [25.2048, 55.2708], to: [-33.9249, 18.4241] },
  { id: 'maldives-capetown', from: [3.2028, 73.2207], to: [-33.9249, 18.4241] },
  { id: 'capetown-saopaulo', from: [-33.9249, 18.4241], to: [-23.5505, -46.6333] },
  { id: 'maldives-bali', from: [3.2028, 73.2207], to: [-8.4095, 115.1889] },
  { id: 'bali-sydney', from: [-8.4095, 115.1889], to: [-33.8688, 151.2093] },
  { id: 'sydney-tokyo', from: [-33.8688, 151.2093], to: [35.6762, 139.6503] },
  { id: 'saopaulo-nyc', from: [-23.5505, -46.6333], to: [40.7128, -74.006] },
  { id: 'london-nyc', from: [51.5074, -0.1278], to: [40.7128, -74.006] },
]

export const Hero = () => {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : false
  )

  useEffect(() => {
    const checkWidth = () => setIsDesktop(window.innerWidth >= 1024)
    checkWidth()
    window.addEventListener('resize', checkWidth)
    return () => window.removeEventListener('resize', checkWidth)
  }, [])

  // Silky smooth scroll tracking with responsive damping (no stutter, no overshoot)
  const { scrollY } = useScroll()
  const springConfig = { damping: 28, stiffness: 180, mass: 0.2, restDelta: 0.001 }
  const smoothScrollY = useSpring(scrollY, springConfig)

  // 1. Desktop: Moves smoothly to next slide position
  // 2. Mobile: Stays firmly in place in the hero section without moving downwards
  const globeX = useTransform(scrollY, [0, 380, 2000], ['0%', '-21.8vw', '-21.8vw'])
  const globeY = useTransform(scrollY, [0, 380, 2000], ['0vh', '75vh', '75vh'])
  const globeScale = useTransform(scrollY, [0, 380, 2000], [1.12, 0.60, 0.60])
  const globeOpacity = useTransform(scrollY, [0, 380, 1400, 1800], [1, 1, 1, 0])

  return (
    <section className="relative h-screen min-h-[680px] max-h-[1080px] flex flex-col justify-between overflow-visible pt-28 sm:pt-32 lg:pt-36 pb-8 sm:pb-12 z-40">
      {/* Background Image: Full-width cinematic landscape (Clipped to hero only) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=90"
          alt="Cinematic Alpine Landscape"
          className="w-full h-full object-cover object-center scale-105"
        />

        {/* Layered Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#071A16]/95 via-[#071A16]/75 to-[#071A16]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071A16] via-transparent to-[#071A16]/60" />
      </div>

      {/* Main Hero Viewport Grid */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 flex-1 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
          {/* Left Column: Editorial Typography */}
          <div className="lg:col-span-7 flex flex-col items-start text-left relative z-20 pt-1 sm:pt-2">
            {/* Hero Main Heading (Responsive on Small & Large Screens) */}
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[92px] xl:text-[102px] font-bold tracking-tight leading-[0.98] text-white">
              Discover <br />
              <span className="text-[#6FCF45] font-bold">the World.</span>
            </h1>

            {/* Supporting Heading */}
            <p className="mt-4 text-xl sm:text-2xl md:text-3xl font-light text-white/95 tracking-wide font-heading">
              Your Journey Starts Here.
            </p>

            {/* Paragraph */}
            <p className="mt-3.5 text-xs sm:text-sm text-[#A8B5AF] max-w-[480px] leading-relaxed font-normal">
              Curated journeys, unforgettable destinations and seamless travel experiences crafted for the modern explorer.
            </p>

            {/* Hero Action Buttons */}
            <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-4 sm:gap-5 w-full sm:w-auto">
              <Button
                to="/tours"
                variant="primary"
                size="lg"
                icon={true}
                className="w-full sm:w-auto text-xs sm:text-sm px-8 h-[48px]"
              >
                EXPLORE TOURS
              </Button>

              <Button
                to="/custom-trip"
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto text-xs sm:text-sm px-8 h-[48px]"
              >
                PLAN MY TRIP
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="mt-5 sm:mt-6 flex items-center gap-6 text-xs text-[#A8B5AF] font-light">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#6FCF45]" />
                <span>100% Tailored Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-[#6FCF45] fill-[#6FCF45]" />
                <span>4.9/5 Explorer Rating</span>
              </div>
            </div>
          </div>

          {/* Right-Center Column: 3D Globe - Finely balanced 0.70x scale */}
          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end relative pointer-events-auto -mt-6 sm:-mt-10 lg:-mt-14 z-50">
            {/* Animated Wrapper with Initial Pop & Clamped Scroll-Stop Transition */}
            <motion.div
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 90,
                damping: 12,
                mass: 0.7,
                delay: 0.1,
              }}
              style={
                isDesktop
                  ? {
                      x: globeX,
                      y: globeY,
                      scale: globeScale,
                      opacity: globeOpacity,
                      willChange: 'transform, opacity',
                    }
                  : {
                      x: 0,
                      y: 0,
                      scale: 1,
                      opacity: 1,
                    }
              }
              className="w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[450px] xl:max-w-[480px] relative z-50 origin-center will-change-transform"
            >
              {/* Subtle soft ambient aura */}
              <div className="absolute w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] bg-[#6FCF45]/12 rounded-full blur-[80px] pointer-events-none -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

              <Globe
                markers={travelMarkers}
                arcs={travelArcs}
                markerColor={[0.43, 0.81, 0.27]} // #6FCF45 bright green pins
                baseColor={[0.9, 0.96, 0.92]}    // ALWAYS luminous bright white dots!
                arcColor={[0.54, 0.89, 0.35]}     // #8BE35A glowing green arcs
                glowColor={[0.08, 0.22, 0.16]}    // Soft transparent emerald rim
                dark={1}
                mapBrightness={6}
                markerSize={0.035}
                markerElevation={0.015}
                arcWidth={0.65}
                arcHeight={0.3}
                speed={0.003}
                opacity={0.88}
                className="w-full h-full"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Hero Statistics: Visible on Tablet/Desktop, Hidden on Mobile */}
      <div className="hidden sm:flex relative z-20 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 justify-end mb-2 sm:mb-4">
        <div className="glass-panel rounded-[4px] px-5 py-3 sm:px-7 sm:py-3.5 border border-white/15 backdrop-blur-xl shadow-2xl inline-flex flex-wrap sm:flex-nowrap items-center justify-between gap-5 sm:gap-8">
          {/* Stat 1 */}
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#6FCF45] font-mono leading-none">
              50+
            </span>
            <span className="text-[9px] sm:text-[10px] font-medium tracking-[0.2em] text-white/80 uppercase mt-1">
              DESTINATIONS
            </span>
          </div>

          <div className="hidden sm:block w-[1px] h-7 bg-white/15" />

          {/* Stat 2 */}
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#6FCF45] font-mono leading-none">
              5000+
            </span>
            <span className="text-[9px] sm:text-[10px] font-medium tracking-[0.2em] text-white/80 uppercase mt-1">
              TRAVELLERS
            </span>
          </div>

          <div className="hidden sm:block w-[1px] h-7 bg-white/15" />

          {/* Stat 3 */}
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#6FCF45] font-mono leading-none">
              24/7
            </span>
            <span className="text-[9px] sm:text-[10px] font-medium tracking-[0.2em] text-white/80 uppercase mt-1">
              SUPPORT
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
