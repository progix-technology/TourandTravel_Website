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
  const [beaconCoords, setBeaconCoords] = useState({ x: 300, y: 300 })
  const [beamData, setBeamData] = useState({
    polygonPoints: '300,300 100,200 150,500',
    targetX: 200,
    targetY: 350,
    angleDeg: 195,
    distance: 400,
  })
  const isUserInteracting = useRef(false)
  const lastInteractionTime = useRef(0)
  const idleTime = useRef(0)
  const frameCount = useRef(0)

  // Update Beacon coordinates on resize, scroll, image load
  const updateBeaconPos = () => {
    if (sectionRef.current && beaconRef.current) {
      const secRect = sectionRef.current.getBoundingClientRect()
      const becRect = beaconRef.current.getBoundingClientRect()
      const bx = becRect.left - secRect.left + becRect.width / 2
      const by = becRect.top - secRect.top + becRect.height / 2
      if (bx > 0 && by > 0) {
        setBeaconCoords({ x: bx, y: by })
      }
    }
  }

  useEffect(() => {
    updateBeaconPos()
    const timer = setTimeout(updateBeaconPos, 300)
    window.addEventListener('resize', updateBeaconPos)
    window.addEventListener('scroll', updateBeaconPos)

    // Global unified pointer/touch tracker that captures every cursor hover & drag movement
    const updateTargetFromClient = (clientX, clientY) => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()

      // When cursor is within the vertical section area in the viewport
      if (clientY >= rect.top - 60 && clientY <= rect.bottom + 60) {
        const x = Math.max(0, Math.min(rect.width, clientX - rect.left))
        const y = Math.max(0, Math.min(rect.height, clientY - rect.top))
        targetPos.current.x = x
        targetPos.current.y = y
        isUserInteracting.current = true
        lastInteractionTime.current = Date.now()
      } else {
        isUserInteracting.current = false
      }
    }

    const onPointerMove = (e) => {
      updateTargetFromClient(e.clientX, e.clientY)
    }

    const onMouseMove = (e) => {
      updateTargetFromClient(e.clientX, e.clientY)
    }

    const onTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        updateTargetFromClient(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    const onTouchStart = (e) => {
      updateBeaconPos()
      if (e.touches && e.touches[0]) {
        updateTargetFromClient(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('pointerdown', onPointerMove, { passive: true })

    // Smooth animation loop (Lerp mouse tracking + Continuous oceanic sweep)
    let animationFrameId
    const renderLoop = () => {
      frameCount.current += 1
      if (frameCount.current % 45 === 0) {
        updateBeaconPos()
      }

      const timeSinceTouch = Date.now() - lastInteractionTime.current
      const activeUser = isUserInteracting.current && timeSinceTouch < 3500

      if (!activeUser) {
        // Slow, elegant oceanic scanning sweep ONLY when user is NOT moving cursor
        idleTime.current += 0.005
        if (sectionRef.current) {
          const secWidth = sectionRef.current.offsetWidth || window.innerWidth || 380
          const secHeight = sectionRef.current.offsetHeight || 600
          targetPos.current.x = secWidth * 0.32 + Math.sin(idleTime.current * 0.7) * (secWidth * 0.28)
          targetPos.current.y = secHeight * 0.42 + Math.cos(idleTime.current * 0.9) * (secHeight * 0.25)
        }
      }

      // Responsive lerp: fast follow (0.4) on active cursor/touch, gentle slow glide (0.04) on idle sweep
      const lerpSpeed = activeUser ? 0.4 : 0.04
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * lerpSpeed
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * lerpSpeed

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
      const spreadWidth = Math.max(90, dist * 0.26)

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
      clearTimeout(timer)
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', updateBeaconPos)
      window.removeEventListener('scroll', updateBeaconPos)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('pointerdown', onPointerMove)
    }
  }, [beaconCoords.x, beaconCoords.y])

  return (
    <section
      id="experiences"
      ref={sectionRef}
      className="bg-[#071A16] text-white min-h-[580px] sm:min-h-[680px] lg:min-h-[760px] py-12 sm:py-20 md:py-24 lg:py-28 relative overflow-hidden border-t border-white/10 flex flex-col justify-center select-none"
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
      <div className="absolute -bottom-8 -right-8 sm:-right-4 lg:right-0 xl:right-4 w-[280px] xs:w-[340px] sm:w-[440px] md:w-[540px] lg:w-[640px] xl:w-[720px] 2xl:w-[800px] pointer-events-none z-0 opacity-60 sm:opacity-70 lg:opacity-85 transition-all select-none">
        <img
          src={lighthouseImg}
          alt="Lighthouse Beacon"
          onLoad={updateBeaconPos}
          className="w-full h-auto object-contain object-bottom drop-shadow-[0_20px_60px_rgba(0,0,0,0.95)]"
        />

        {/* ========================================================================= */}
        {/* ULTRA-BOLD RADIANT BEACON LIGHT SOURCE & OPTICAL LENS FLARES              */}
        {/* Exact Anchor Pivot centered: right-[13.5%] on mobile, right-[18.6%] on sm+*/}
        {/* ========================================================================= */}
        <div
          ref={beaconRef}
          className="absolute top-[17.2%] right-[13.5%] sm:right-[18.6%] w-8 h-8 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center"
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
        <div className="absolute top-[17.2%] right-[13.5%] sm:right-[18.6%] -translate-x-1/2 -translate-y-1/2 w-44 h-44 bg-amber-400/50 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute top-[17.2%] right-[13.5%] sm:right-[18.6%] -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-yellow-200/60 rounded-full blur-xl pointer-events-none" />
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
