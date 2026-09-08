import React, { useEffect, useRef, useCallback, useState } from 'react'
import createGlobe from 'cobe'

// 3D Holographic Wireframe Sphere Loader (Option 2)
function HolographicSphereLoader({ isLoaded }) {
  const [coordsIndex, setCoordsIndex] = useState(0)
  const coordsList = [
    'LAT 34.08° N • LON 74.79° E [KASHMIR]',
    'LAT 25.20° N • LON 55.27° E [DUBAI]',
    'LAT 03.20° N • LON 73.22° E [MALDIVES]',
    'LAT 48.85° N • LON 02.35° E [PARIS]',
    'LAT 35.67° N • LON 139.65° E [TOKYO]',
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCoordsIndex((prev) => (prev + 1) % coordsList.length)
    }, 450)
    return () => clearInterval(interval)
  }, [coordsList.length])

  return (
    <div
      className={`absolute inset-0 z-20 flex flex-col items-center justify-center rounded-full transition-opacity duration-700 select-none ${
        isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Soft Emerald Halo */}
      <div className="absolute w-[80%] h-[80%] rounded-full bg-[#6FCF45]/10 blur-2xl pointer-events-none animate-pulse" />

      {/* 3D Holographic Wireframe Rings Container */}
      <div className="relative w-[78%] h-[78%] rounded-full flex items-center justify-center overflow-hidden border border-[#6FCF45]/30 shadow-[0_0_30px_rgba(111,207,69,0.15)] backdrop-blur-sm bg-[#071A16]/50">
        {/* Outer Rotating Latitude/Longitude Rings */}
        <div className="absolute inset-2 rounded-full border border-dashed border-[#6FCF45]/40 animate-[spin_8s_linear_infinite]" />
        <div className="absolute inset-6 rounded-full border border-dotted border-white/25 animate-[spin_12s_linear_infinite_reverse]" />

        {/* Holographic 3D Equatorial & Meridian Rings */}
        <div className="absolute w-full h-[38%] rounded-full border border-[#6FCF45]/50 transform rotate-12 scale-95 animate-pulse" />
        <div className="absolute h-full w-[38%] rounded-full border border-[#6FCF45]/40 transform -rotate-12 scale-95" />
        <div className="absolute w-full h-[68%] rounded-full border border-white/20 transform -rotate-45" />

        {/* Vertical Scanning Laser Radar Beam */}
        <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#6FCF45] to-transparent shadow-[0_0_14px_#6FCF45] animate-laser-sweep" />

        {/* Center Glowing Hub Beacon */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-4 h-4 rounded-full bg-[#6FCF45] shadow-[0_0_20px_#6FCF45,0_0_40px_#6FCF45] animate-ping" />
          <div className="absolute w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_#FFFFFF]" />
        </div>
      </div>

      {/* Lower HUD Telemetry Coordinates Badge */}
      <div className="absolute bottom-6 flex flex-col items-center gap-1 z-30 pointer-events-none select-none">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] bg-[#071A16]/90 border border-[#6FCF45]/40 backdrop-blur-md shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6FCF45] animate-ping" />
          <span className="font-mono text-[8.5px] sm:text-[9.5px] font-bold text-[#6FCF45] tracking-wider uppercase">
            CALIBRATING GLOBE
          </span>
        </div>
        <span className="font-mono text-[7.5px] sm:text-[8.5px] text-[#A8B5AF] tracking-widest uppercase transition-all duration-300">
          {coordsList[coordsIndex]}
        </span>
      </div>
    </div>
  )
}

export function Globe({
  markers = [],
  arcs = [],
  className = '',
  markerColor = [0.43, 0.81, 0.27], // #6FCF45 green accent
  baseColor = [0.85, 0.92, 0.88],   // Crisp illuminated land dots
  arcColor = [0.54, 0.89, 0.35],    // #8BE35A bright green
  glowColor = [0.08, 0.25, 0.18],   // Subtle soft emerald rim
  dark = 1,
  mapBrightness = 6,
  markerSize = 0.035,
  markerElevation = 0.015,
  arcWidth = 0.7,
  arcHeight = 0.3,
  speed = 0.003,
  theta = 0.2,
  diffuse = 1.3,
  mapSamples = 16000,
  opacity = 0.85,
}) {
  const [isLoaded, setIsLoaded] = useState(false)
  const canvasRef = useRef(null)
  const pointerInteracting = useRef(null)
  const lastPointer = useRef(null)
  const dragOffset = useRef({ phi: 0, theta: 0 })
  const velocity = useRef({ phi: 0, theta: 0 })
  const phiOffsetRef = useRef(0)
  const thetaOffsetRef = useRef(0)
  const isPausedRef = useRef(false)

  const handlePointerDown = useCallback((e) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY }
    lastPointer.current = { x: e.clientX, y: e.clientY, t: Date.now() }
    velocity.current = { phi: 0, theta: 0 }
    if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing'
    isPausedRef.current = true
  }, [])

  const handlePointerMove = useCallback((e) => {
    if (pointerInteracting.current !== null) {
      const deltaX = e.clientX - pointerInteracting.current.x
      const deltaY = e.clientY - pointerInteracting.current.y
      dragOffset.current = { phi: deltaX / 140, theta: deltaY / 350 }
      
      const now = Date.now()
      if (lastPointer.current) {
        const dt = Math.max(now - lastPointer.current.t, 8)
        const vx = (e.clientX - lastPointer.current.x) / dt
        const vy = (e.clientY - lastPointer.current.y) / dt
        velocity.current = {
          phi: Math.max(-0.25, Math.min(0.25, vx * 0.045)),
          theta: Math.max(-0.15, Math.min(0.15, vy * 0.025)),
        }
      }
      lastPointer.current = { x: e.clientX, y: e.clientY, t: now }
    }
  }, [])

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi
      thetaOffsetRef.current += dragOffset.current.theta
      dragOffset.current = { phi: 0, theta: 0 }
      lastPointer.current = null
    }
    pointerInteracting.current = null
    if (canvasRef.current) canvasRef.current.style.cursor = 'grab'
    isPausedRef.current = false
  }, [])

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerup', handlePointerUp, { passive: true })
    window.addEventListener('pointercancel', handlePointerUp, { passive: true })
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
    }
  }, [handlePointerMove, handlePointerUp])

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    let globe = null
    let animationId = null
    let phi = 0
    let ro = null

    function init() {
      try {
        const width = canvas.offsetWidth
        if (width === 0 || globe) return

        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        globe = createGlobe(canvas, {
          devicePixelRatio: dpr,
          width: width * 2,
          height: width * 2,
          phi: 0,
          theta,
          dark,
          diffuse,
          mapSamples,
          mapBrightness,
          baseColor,
          markerColor,
          glowColor,
          markerElevation,
          markers: markers.map((m) => ({
            location: m.location,
            size: markerSize,
            id: m.id,
          })),
          arcs: arcs.map((a) => ({
            from: a.from,
            to: a.to,
            id: a.id,
          })),
          arcColor,
          arcWidth,
          arcHeight,
          opacity,
        })

        function animate() {
          if (!isPausedRef.current) {
            phi += speed
            if (
              Math.abs(velocity.current.phi) > 0.0001 ||
              Math.abs(velocity.current.theta) > 0.0001
            ) {
              phiOffsetRef.current += velocity.current.phi
              thetaOffsetRef.current += velocity.current.theta
              velocity.current.phi *= 0.95
              velocity.current.theta *= 0.95
            }
            const thetaMin = -0.4,
              thetaMax = 0.4
            if (thetaOffsetRef.current < thetaMin) {
              thetaOffsetRef.current += (thetaMin - thetaOffsetRef.current) * 0.1
            } else if (thetaOffsetRef.current > thetaMax) {
              thetaOffsetRef.current += (thetaMax - thetaOffsetRef.current) * 0.1
            }
          }

          if (globe) {
            globe.update({
              phi: phi + phiOffsetRef.current + dragOffset.current.phi,
              theta: theta + thetaOffsetRef.current + dragOffset.current.theta,
            })
          }
          animationId = requestAnimationFrame(animate)
        }

        animate()

        setTimeout(() => {
          if (canvas) canvas.style.opacity = '1'
          setIsLoaded(true)
        }, 150)
      } catch (err) {
        console.warn('Globe WebGL init error:', err)
      }
    }

    if (canvas.offsetWidth > 0) {
      init()
    } else {
      ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          ro?.disconnect()
          ro = null
          init()
        }
      })
      ro.observe(canvas)
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
      if (ro) ro.disconnect()
      if (globe) {
        try {
          globe.destroy()
        } catch (e) {
          // ignore
        }
      }
    }
  }, [
    markers,
    arcs,
    markerColor,
    baseColor,
    arcColor,
    glowColor,
    dark,
    mapBrightness,
    markerSize,
    markerElevation,
    arcWidth,
    arcHeight,
    speed,
    theta,
    diffuse,
    mapSamples,
    opacity,
  ])

  return (
    <div className={`relative aspect-square select-none ${className}`}>
      {/* Option 2: 3D Holographic Wireframe Sphere Loader */}
      <HolographicSphereLoader isLoaded={isLoaded} />

      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width: '100%',
          height: '100%',
          cursor: 'grab',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.6s ease',
          borderRadius: '50%',
          touchAction: 'none',
        }}
      />
      {markers.map((m) => (
        <div
          key={m.id}
          style={{
            position: 'absolute',
            positionAnchor: `--cobe-${m.id}`,
            bottom: 'anchor(top)',
            left: 'anchor(center)',
            translate: '-50% 0',
            marginBottom: 8,
            padding: '3px 8px',
            background: 'rgba(7, 26, 22, 0.85)',
            border: '1px solid rgba(111, 207, 69, 0.4)',
            backdropFilter: 'blur(8px)',
            color: '#fff',
            fontFamily: 'monospace',
            fontSize: '0.65rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            borderRadius: '3px',
            opacity: `var(--cobe-visible-${m.id}, 0)`,
            filter: `blur(calc((1 - var(--cobe-visible-${m.id}, 0)) * 8px))`,
            transition: 'opacity 0.8s, filter 0.8s',
          }}
        >
          <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', backgroundColor: '#6FCF45', marginRight: 5 }} />
          {m.label}
          <span
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translate3d(-50%, -1px, 0)',
              border: '5px solid transparent',
              borderTopColor: 'rgba(7, 26, 22, 0.85)',
            }}
          />
        </div>
      ))}
    </div>
  )
}

export default Globe

