import React, { useState, useEffect, useRef } from 'react'
import SectionHeading from '../components/SectionHeading'
import ExperienceItem from '../components/ExperienceItem'
import { EXPERIENCES } from '../utils/mockData'
import lighthouseImg from '../assets/images/lighthouse.png'

export const Experiences = () => {
  const sectionRef = useRef(null)
  const beaconRef = useRef(null)

  // Target and smoothly interpolated coordinates
  const targetPos = useRef({ x: 300, y: 350 })
  const currentPos = useRef({ x: 300, y: 350 })
  const [beaconCoords, setBeaconCoords] = useState({ x: 900, y: 300 })
  const [beamData, setBeamData] = useState({
    polygonPoints: '900,300 200,200 250,500',
    targetX: 300,
    targetY: 350,
    angleDeg: 195,
    distance: 600,
  })
  const isHovered = useRef(false)
  const idleTime = useRef(0)

  // Update Beacon coordinates on resize & scroll
  const updateBeaconPos = () => {
    if (sectionRef.current && beaconRef.current) {
      const secRect = sectionRef.current.getBoundingClientRect()
      const becRect = beaconRef.current.getBoundingClientRect()
      const bx = becRect.left - secRect.left + becRect.width / 2
      const by = becRect.top - secRect.top + becRect.height / 2
      setBeaconCoords({ x: bx, y: by })
    }
  }

  useEffect(() => {
    updateBeaconPos()
    window.addEventListener('resize', updateBeaconPos)
    window.addEventListener('scroll', updateBeaconPos)

    // Smooth animation loop (Lerp mouse tracking + Idle oceanic sweep)
    let animationFrameId
    const renderLoop = () => {
      if (!isHovered.current) {
        // Idle oceanic scanning mode
        idleTime.current += 0.015
        if (sectionRef.current) {
          const secWidth = sectionRef.current.offsetWidth || 1200
          const secHeight = sectionRef.current.offsetHeight || 700
          targetPos.current.x = secWidth * 0.28 + Math.sin(idleTime.current) * (secWidth * 0.22)
          targetPos.current.y = secHeight * 0.45 + Math.cos(idleTime.current * 1.4) * (secHeight * 0.25)
        }
      }

      // Smooth Linear Interpolation (Physics spring follow)
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * 0.085
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * 0.085

      const bx = beaconCoords.x
      const by = beaconCoords.y
      const tx = currentPos.current.x
      const ty = currentPos.current.y

      const dx = tx - bx
      const dy = ty - by
      const dist = Math.hypot(dx, dy)
      const angle = Math.atan2(dy, dx)
      const angleDeg = (angle * 180) / Math.PI

      // Calculate the projected cone geometry
      const extendDist = dist + 130
      const spreadWidth = Math.max(110, dist * 0.25)

      const cx = bx + Math.cos(angle) * extendDist
      const cy = by + Math.sin(angle) * extendDist

      const perpAngle = angle + Math.PI / 2
      const p1x = cx + Math.cos(perpAngle) * spreadWidth
      const p1y = cy + Math.sin(perpAngle) * spreadWidth
      const p2x = cx - Math.cos(perpAngle) * spreadWidth
      const p2y = cy - Math.sin(perpAngle) * spreadWidth

      setBeamData({
        polygonPoints: `${bx},${by} ${p1x},${p1y} ${p2x},${p2y}`,
        targetX: tx,
        targetY: ty,
        angleDeg,
        distance: dist,
      })

      animationFrameId = requestAnimationFrame(renderLoop)
    }

    animationFrameId = requestAnimationFrame(renderLoop)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', updateBeaconPos)
      window.removeEventListener('scroll', updateBeaconPos)
    }
  }, [beaconCoords.x, beaconCoords.y])

  // Mouse Move Handler
  const handleMouseMove = (e) => {
    if (!sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    targetPos.current.x = e.clientX - rect.left
    targetPos.current.y = e.clientY - rect.top
    isHovered.current = true
  }

  // Touch Move Handler for Mobile devices
  const handleTouchMove = (e) => {
    if (!sectionRef.current || !e.touches[0]) return
    const rect = sectionRef.current.getBoundingClientRect()
    targetPos.current.x = e.touches[0].clientX - rect.left
    targetPos.current.y = e.touches[0].clientY - rect.top
    isHovered.current = true
  }

  const handleTouchStart = (e) => {
    if (!sectionRef.current || !e.touches[0]) return
    updateBeaconPos()
    const rect = sectionRef.current.getBoundingClientRect()
    targetPos.current.x = e.touches[0].clientX - rect.left
    targetPos.current.y = e.touches[0].clientY - rect.top
    isHovered.current = true
  }

  const handleMouseLeave = () => {
    isHovered.current = false
  }

  return (
    <section
      id="experiences"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchStart}
      onMouseEnter={() => {
        isHovered.current = true
        updateBeaconPos()
      }}
      onMouseLeave={handleMouseLeave}
      className="bg-[#071A16] text-white min-h-[680px] lg:min-h-[760px] py-16 sm:py-20 md:py-24 lg:py-28 relative overflow-hidden border-t border-white/10 flex flex-col justify-center select-none"
    >
      {/* ========================================================================= */}
      {/* ULTRA-BOLD HIGH-LUMINANCE LIGHTHOUSE SEARCHLIGHT CONE & SPOTLIGHT         */}
      {/* ========================================================================= */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
        aria-hidden="true"
      >
        <defs>
          {/* Ultra-Bold Volumetric Light Ray Gradient */}
          <linearGradient
            id="lighthouseBeamGrad"
            x1={`${beaconCoords.x}`}
            y1={`${beaconCoords.y}`}
            x2={`${beamData.targetX}`}
            y2={`${beamData.targetY}`}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="12%" stopColor="#FFFDE7" stopOpacity="0.9" />
            <stop offset="32%" stopColor="#FFE082" stopOpacity="0.65" />
            <stop offset="62%" stopColor="#FFCA28" stopOpacity="0.35" />
            <stop offset="85%" stopColor="#FFA000" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#FF8F00" stopOpacity="0" />
          </linearGradient>

          {/* Concentrated Intense Inner Light Ray Gradient */}
          <linearGradient
            id="innerBeamCore"
            x1={`${beaconCoords.x}`}
            y1={`${beaconCoords.y}`}
            x2={`${beamData.targetX}`}
            y2={`${beamData.targetY}`}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="25%" stopColor="#FFF9C4" stopOpacity="0.75" />
            <stop offset="60%" stopColor="#FFE082" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FFCA28" stopOpacity="0" />
          </linearGradient>

          {/* Origin Burst Glow */}
          <radialGradient
            id="beaconOriginBurst"
            cx="50%"
            cy="50%"
            r="50%"
          >
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="35%" stopColor="#FFF9C4" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#FFE082" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#FFB300" stopOpacity="0" />
          </radialGradient>

          {/* Glowing Radial Spotlight Halo for the Cursor Target */}
          <radialGradient
            id="cursorSpotlightHalo"
            cx="50%"
            cy="50%"
            r="50%"
          >
            <stop offset="0%" stopColor="#FFF9C4" stopOpacity="0.5" />
            <stop offset="35%" stopColor="#FFE082" stopOpacity="0.28" />
            <stop offset="70%" stopColor="#FFD54F" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#FFB300" stopOpacity="0" />
          </radialGradient>

          {/* Volumetric Atmosphere Blur Filter */}
          <filter id="volumetricGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Main High-Power Searchlight Cone */}
        <polygon
          points={beamData.polygonPoints}
          fill="url(#lighthouseBeamGrad)"
          filter="url(#volumetricGlow)"
          style={{ mixBlendMode: 'screen' }}
        />

        {/* 2. Concentrated Inner Core Beam */}
        <polygon
          points={beamData.polygonPoints}
          fill="url(#innerBeamCore)"
          opacity="0.7"
          style={{ mixBlendMode: 'screen' }}
        />

        {/* 3. Incandescent Origin Flare on the Beacon */}
        <circle
          cx={beaconCoords.x}
          cy={beaconCoords.y}
          r="26"
          fill="url(#beaconOriginBurst)"
          style={{ mixBlendMode: 'screen' }}
        />

        {/* 4. Focused Ground / UI Spotlight Ellipse at Cursor Position */}
        <ellipse
          cx={beamData.targetX}
          cy={beamData.targetY}
          rx={Math.max(120, beamData.distance * 0.22)}
          ry={Math.max(70, beamData.distance * 0.13)}
          fill="url(#cursorSpotlightHalo)"
          style={{
            transform: `rotate(${beamData.angleDeg}deg)`,
            transformOrigin: `${beamData.targetX}px ${beamData.targetY}px`,
            mixBlendMode: 'screen',
          }}
        />
      </svg>

      {/* Subtle Background Halos */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#12382E]/40 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#6FCF45]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Majestic Lighthouse Background Element on Bottom-Right */}
      <div className="absolute -bottom-8 -right-8 sm:-right-4 lg:right-0 xl:right-4 w-[360px] sm:w-[440px] md:w-[540px] lg:w-[640px] xl:w-[720px] 2xl:w-[800px] pointer-events-none z-0 opacity-60 sm:opacity-70 lg:opacity-85 transition-all select-none">
        <img
          src={lighthouseImg}
          alt="Lighthouse Beacon"
          className="w-full h-auto object-contain object-bottom drop-shadow-[0_20px_60px_rgba(0,0,0,0.95)]"
        />

        {/* ========================================================================= */}
        {/* ULTRA-BOLD RADIANT BEACON LIGHT SOURCE & OPTICAL LENS FLARES              */}
        {/* Exact Anchor Pivot centered at top: 17.2%, right: 18.6%                   */}
        {/* ========================================================================= */}
        <div
          ref={beaconRef}
          className="absolute top-[17.2%] right-[18.6%] w-8 h-8 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center"
        >
          {/* Bold Multi-Spoke Optical Star Flare Rays */}
          <div className="absolute w-36 h-[2.5px] bg-gradient-to-r from-transparent via-white to-transparent animate-pulse" />
          <div className="absolute h-36 w-[2.5px] bg-gradient-to-b from-transparent via-white to-transparent animate-pulse" />
          <div className="absolute w-24 h-[1.8px] rotate-45 bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
          <div className="absolute w-24 h-[1.8px] -rotate-45 bg-gradient-to-r from-transparent via-amber-200 to-transparent" />

          {/* Ultra-Bright White-Hot Filament Lamp */}
          <div className="w-4.5 h-4.5 bg-white rounded-full shadow-[0_0_15px_#FFFFFF,0_0_35px_#FFF9C4,0_0_75px_#FFE082,0_0_120px_#FFB300,0_0_180px_#FF8F00] animate-pulse z-10" />

          {/* Inner Golden Halo */}
          <div className="absolute w-14 h-14 bg-yellow-100/75 rounded-full blur-md animate-pulse" />
        </div>

        {/* Expansive Ambient Warm Golden Glass Chamber Flare - Anchored Exactly */}
        <div className="absolute top-[17.2%] right-[18.6%] -translate-x-1/2 -translate-y-1/2 w-44 h-44 bg-amber-400/50 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute top-[17.2%] right-[18.6%] -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-yellow-200/60 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* Main Foreground Content */}
      <div className="relative z-20 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <SectionHeading
          title="Travel Beyond The Ordinary"
          subtitle="Explore distinct travel modalities engineered around deep discovery, unmatched serenity, and exclusive VIP access."
          linkText="VIEW ALL EXPERIENCES"
          linkTo="/tours"
          theme="dark"
          className="mb-6 sm:mb-8 lg:mb-10"
        />

        {/* List of Typography-driven Experience Items */}
        <div className="divide-y divide-white/10 mt-3 sm:mt-5 max-w-[900px] lg:max-w-[960px]">
          {EXPERIENCES.map((exp, idx) => (
            <ExperienceItem key={exp.number} experience={exp} index={idx} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Experiences
