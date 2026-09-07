import React, { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'

// Helper: Convert lat/lon to 3D Cartesian coordinates
function latLonToVector3(lat, lon, radius = 2) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)
  return new THREE.Vector3(x, y, z)
}

// Major Luxury Travel Destination Hubs with telemetry tags
const DESTINATION_HUBS = [
  { id: 'kashmir', name: 'Kashmir', code: 'SXR', stat: '50+ stays', lat: 34.08, lon: 74.79 },
  { id: 'dubai', name: 'Dubai', code: 'DXB', stat: '447k trips', lat: 25.2, lon: 55.27 },
  { id: 'maldives', name: 'Maldives', code: 'MLE', stat: '218k trips', lat: 3.2, lon: 73.22 },
  { id: 'paris', name: 'Paris', code: 'CDG', stat: '375k trips', lat: 48.85, lon: 2.35 },
  { id: 'bali', name: 'Bali', code: 'DPS', stat: '190k trips', lat: -8.4, lon: 115.18 },
  { id: 'tokyo', name: 'Tokyo', code: 'HND', stat: '310k trips', lat: 35.67, lon: 139.65 },
  { id: 'newyork', name: 'New York', code: 'JFK', stat: '520k trips', lat: 40.71, lon: -74.0 },
]

// Flight Routes connecting hubs
const ROUTES = [
  { from: DESTINATION_HUBS[3], to: DESTINATION_HUBS[1] }, // Paris -> Dubai
  { from: DESTINATION_HUBS[1], to: DESTINATION_HUBS[0] }, // Dubai -> Kashmir
  { from: DESTINATION_HUBS[0], to: DESTINATION_HUBS[2] }, // Kashmir -> Maldives
  { from: DESTINATION_HUBS[2], to: DESTINATION_HUBS[4] }, // Maldives -> Bali
  { from: DESTINATION_HUBS[4], to: DESTINATION_HUBS[5] }, // Bali -> Tokyo
  { from: DESTINATION_HUBS[3], to: DESTINATION_HUBS[6] }, // Paris -> New York
]

// Accurate continent land boundary filter
function isLandmass(lat, lon) {
  // North America
  if (lat >= 15 && lat <= 72 && lon >= -168 && lon <= -52) {
    if (lat > 50 && lon > -130 && lon < -60) return true
    if (lat >= 25 && lat <= 50 && lon >= -125 && lon <= -70) return true
    if (lat >= 15 && lat < 28 && lon >= -115 && lon <= -85) return true
  }
  // South America
  if (lat >= -55 && lat <= 12 && lon >= -82 && lon <= -34) {
    if (lon > -75 + (lat + 55) * 0.4 && lon < -35) return true
    return true
  }
  // Europe
  if (lat >= 36 && lat <= 70 && lon >= -10 && lon <= 45) {
    return true
  }
  // Africa
  if (lat >= -35 && lat <= 37 && lon >= -18 && lon <= 52) {
    if (lat > 20 && lon < -15) return false
    return true
  }
  // Asia
  if (lat >= 5 && lat <= 75 && lon >= 45 && lon <= 150) {
    return true
  }
  // Australia & New Zealand
  if (lat >= -45 && lat <= -10 && lon >= 112 && lon <= 178) {
    if (lon >= 113 && lon <= 154 && lat <= -11 && lat >= -39) return true
    if (lon >= 165 && lon <= 178 && lat <= -34 && lat >= -47) return true
  }
  // Japan & Indonesia
  if (lat >= 30 && lat <= 45 && lon >= 129 && lon <= 146) return true
  if (lat >= -10 && lat <= 6 && lon >= 95 && lon <= 141) return true

  return false
}

// 1. High-Density Dotted Continents
function ContinentDots({ radius = 2 }) {
  const { geometry } = useMemo(() => {
    const coords = []
    const colorArray = []
    const latStep = 2.0
    const lonStep = 2.0

    const whiteColor = new THREE.Color('#FFFFFF')
    const greenColor = new THREE.Color('#6FCF45')

    for (let lat = -80; lat <= 80; lat += latStep) {
      const numLon = Math.max(12, Math.floor(360 * Math.cos((lat * Math.PI) / 180) / lonStep))
      for (let i = 0; i < numLon; i++) {
        const lon = -180 + (i * 360) / numLon
        if (isLandmass(lat, lon)) {
          const v = latLonToVector3(lat, lon, radius * 1.002)
          coords.push(v.x, v.y, v.z)

          const col = Math.random() > 0.88 ? greenColor : whiteColor
          colorArray.push(col.r, col.g, col.b)
        }
      }
    }

    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.Float32BufferAttribute(coords, 3))
    geom.setAttribute('color', new THREE.Float32BufferAttribute(colorArray, 3))
    return { geometry: geom }
  }, [radius])

  return (
    <points geometry={geometry}>
      <pointsMaterial
        size={0.032}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
      />
    </points>
  )
}

// 2. High-Arced Flight Curves with Moving Light Beacons
function CurvedFlightArc({ from, to, radius = 2, speed = 0.5, offset = 0 }) {
  const pulseRef = useRef()

  const { curve, points } = useMemo(() => {
    const v1 = latLonToVector3(from.lat, from.lon, radius)
    const v2 = latLonToVector3(to.lat, to.lon, radius)
    const distance = v1.distanceTo(v2)

    // Midpoint elevated above surface
    const mid = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5)
    mid.normalize()
    mid.multiplyScalar(radius + distance * 0.35)

    const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2)
    return { curve, points: curve.getPoints(50) }
  }, [from, to, radius])

  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points])

  useFrame(({ clock }) => {
    const t = ((clock.getElapsedTime() * speed * 0.25 + offset) % 1)
    const pos = curve.getPointAt(t)
    if (pulseRef.current) {
      pulseRef.current.position.copy(pos)
    }
  })

  return (
    <group>
      {/* Flight line */}
      {/* @ts-ignore */}
      <line geometry={geometry}>
        <lineBasicMaterial color="#6FCF45" transparent opacity={0.65} linewidth={1.5} />
      </line>

      {/* Moving Light Beacon */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.025, 10, 10]} />
        <meshBasicMaterial color="#8BE35A" />
      </mesh>
    </group>
  )
}

// 3. Destination Pin Markers with Sleek Floating Labels matching Reference Screenshot
function DestinationPin({ hub, radius = 2 }) {
  const [hovered, setHovered] = useState(false)
  const pos = useMemo(() => latLonToVector3(hub.lat, hub.lon, radius * 1.01), [hub, radius])
  const normal = useMemo(() => pos.clone().normalize(), [pos])

  const quaternion = useMemo(() => {
    const q = new THREE.Quaternion()
    q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal)
    return q
  }, [normal])

  return (
    <group position={pos}>
      {/* Sleek Minimalist Pin/Cone pointing at location */}
      <group quaternion={quaternion}>
        <mesh position={[0, 0.07, 0]}>
          <coneGeometry args={[0.038, 0.14, 4]} />
          <meshStandardMaterial color="#6FCF45" roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.02, 0.045, 16]} />
          <meshBasicMaterial color="#8BE35A" side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Sleek Floating Badge Label */}
      <Html
        position={[0, 0.16, 0]}
        center
        distanceFactor={6.2}
        className="pointer-events-none select-none transition-all duration-300"
      >
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="pointer-events-auto cursor-pointer group flex flex-col items-center"
        >
          {/* Main White/Dark Pill Badge */}
          <div className="bg-[#071A16]/95 border border-white/20 backdrop-blur-md rounded-[4px] px-2 py-0.5 shadow-[0_4px_16px_rgba(0,0,0,0.6)] flex items-center gap-1.5 transition-all duration-200 group-hover:border-[#6FCF45] group-hover:scale-105">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6FCF45]" />
            <span className="font-mono text-[9px] font-extrabold text-white tracking-wider">
              {hub.code}
            </span>
          </div>

          {/* Secondary Telemetry Badge */}
          <div className="mt-0.5 bg-white text-[#071A16] font-mono font-extrabold text-[8px] px-1.5 py-0.2 rounded-[2px] shadow-sm tracking-tight opacity-90 group-hover:opacity-100">
            {hub.name}
          </div>

          {/* Connecting Leader Line */}
          <div className="w-[1px] h-2 bg-white/40" />
        </div>
      </Html>
    </group>
  )
}

// 4. Globe Base Sphere with Atmospheric Soft Glow
function GlobeSphere({ radius = 2 }) {
  return (
    <group>
      {/* Translucent Glass Base Sphere */}
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          color="#0B241E"
          roughness={0.2}
          metalness={0.1}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* Inner Depth Sphere */}
      <mesh>
        <sphereGeometry args={[radius * 0.985, 32, 32]} />
        <meshBasicMaterial color="#071A16" />
      </mesh>

      {/* Outer Clean Rim Atmosphere Shell */}
      <mesh>
        <sphereGeometry args={[radius * 1.04, 48, 48]} />
        <meshBasicMaterial
          color="#FFFFFF"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Emerald Atmospheric Halo */}
      <mesh>
        <sphereGeometry args={[radius * 1.07, 48, 48]} />
        <meshBasicMaterial
          color="#6FCF45"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}

// Main Rotating Globe Scene
function GlobeScene({ autoRotate = true }) {
  const globeGroupRef = useRef()

  useFrame((_, delta) => {
    if (globeGroupRef.current && autoRotate) {
      globeGroupRef.current.rotation.y += delta * 0.14
    }
  })

  return (
    <group ref={globeGroupRef} rotation={[0.2, 0.5, 0]}>
      {/* 1. Base Globe Sphere */}
      <GlobeSphere radius={2} />

      {/* 2. Geographically Accurate Continent Dots */}
      <ContinentDots radius={2} />

      {/* 3. Curved Flight Routes */}
      {ROUTES.map((route, i) => (
        <CurvedFlightArc
          key={i}
          from={route.from}
          to={route.to}
          radius={2}
          speed={0.5}
          offset={i * 0.2}
        />
      ))}

      {/* 4. Destination Hub Pins with Sleek Labels */}
      {DESTINATION_HUBS.map((hub) => (
        <DestinationPin key={hub.id} hub={hub} radius={2} />
      ))}
    </group>
  )
}

export const Globe3D = ({ className = '' }) => {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <div className="w-72 h-72 rounded-full bg-[#0B241E] border border-[#6FCF45]/30 flex items-center justify-center">
          <div className="w-60 h-60 rounded-full border border-dashed border-[#6FCF45]/50 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div
      className={`relative w-full h-[450px] sm:h-[520px] md:h-[560px] lg:h-[600px] select-none cursor-grab active:cursor-grabbing overflow-visible bg-transparent ${className}`}
    >
      <Canvas
        camera={{ position: [0, 0.3, 4.8], fov: 45 }}
        onError={() => setHasError(true)}
        gl={{ antialias: true, alpha: true }}
        className="!bg-transparent"
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={1.4} />
        <directionalLight position={[5, 5, 4]} intensity={2.2} color="#FFFFFF" />
        <directionalLight position={[-4, -3, -3]} intensity={0.8} color="#6FCF45" />
        <pointLight position={[0, 4, 0]} intensity={1.0} color="#8BE35A" />

        <GlobeScene autoRotate={true} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.6}
          minPolarAngle={Math.PI / 3.5}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  )
}

export default Globe3D
