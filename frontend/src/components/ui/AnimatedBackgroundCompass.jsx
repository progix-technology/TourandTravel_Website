import React from 'react'

export const AnimatedBackgroundCompass = ({
  size = 320,
  className = '',
  opacity = 0.25,
}) => {
  return (
    <div
      className={`relative select-none pointer-events-none ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {/* SVG Compass */}
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full"
        style={{ opacity }}
      >
        <defs>
          {/* Gradients */}
          <radialGradient id="compassBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0B241E" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#040F0D" stopOpacity="0.2" />
          </radialGradient>

          <linearGradient id="needleNorth" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4F8F45" />
            <stop offset="100%" stopColor="#2A5C28" />
          </linearGradient>

          <linearGradient id="needleNorthDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1C421B" />
            <stop offset="100%" stopColor="#0B200E" />
          </linearGradient>

          <linearGradient id="needleSouth" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>

          <linearGradient id="needleSouthDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          <filter id="emeraldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. OUTER HOUSING & DEGREE RINGS (Slow Subtle Counter-Rotation) */}
        <g className="animate-[spin_90s_linear_infinite_reverse] origin-[200px_200px]">
          {/* Base Outer Circular Track */}
          <circle
            cx="200"
            cy="200"
            r="190"
            fill="none"
            stroke="rgba(111, 207, 69, 0.25)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <circle
            cx="200"
            cy="200"
            r="180"
            fill="url(#compassBg)"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="2"
          />
          <circle
            cx="200"
            cy="200"
            r="165"
            fill="none"
            stroke="rgba(111, 207, 69, 0.4)"
            strokeWidth="1"
          />

          {/* 360-Degree Azimuth Tick Marks */}
          {[...Array(72)].map((_, i) => {
            const deg = i * 5
            const isMajor = deg % 30 === 0
            const isMedium = deg % 15 === 0 && !isMajor
            const tickLength = isMajor ? 12 : isMedium ? 8 : 4
            const r1 = 178
            const r2 = r1 - tickLength
            const rad = (deg * Math.PI) / 180
            const x1 = 200 + r1 * Math.sin(rad)
            const y1 = 200 - r1 * Math.cos(rad)
            const x2 = 200 + r2 * Math.sin(rad)
            const y2 = 200 - r2 * Math.cos(rad)

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isMajor ? '#6FCF45' : isMedium ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)'}
                strokeWidth={isMajor ? 2 : isMedium ? 1.2 : 0.8}
              />
            )
          })}

          {/* Degree Numbers */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
            const rad = (deg * Math.PI) / 180
            const r = 152
            const x = 200 + r * Math.sin(rad)
            const y = 200 - r * Math.cos(rad) + 4

            return (
              <text
                key={deg}
                x={x}
                y={y}
                textAnchor="middle"
                fontSize="8.5"
                fontFamily="monospace"
                fontWeight="bold"
                fill="rgba(168, 181, 175, 0.7)"
              >
                {deg}°
              </text>
            )
          })}
        </g>

        {/* 2. INNER CARDINAL ROSE (Slow Subtle Clockwise Drift) */}
        <g className="animate-[spin_120s_linear_infinite] origin-[200px_200px]">
          {/* Inner Geometrical Ring */}
          <circle
            cx="200"
            cy="200"
            r="135"
            fill="none"
            stroke="rgba(111, 207, 69, 0.2)"
            strokeWidth="1"
            strokeDasharray="2 6"
          />
          <circle
            cx="200"
            cy="200"
            r="100"
            fill="none"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="1"
          />

          {/* 8-Point Star Rose Facets */}
          {/* Diagonal Points (NE, NW, SE, SW) */}
          <polygon points="200,200 185,185 200,90 200,200" fill="rgba(111, 207, 69, 0.18)" />
          <polygon points="200,200 215,185 200,90 200,200" fill="rgba(111, 207, 69, 0.08)" />

          <polygon points="200,200 185,215 200,310 200,200" fill="rgba(255, 255, 255, 0.08)" />
          <polygon points="200,200 215,215 200,310 200,200" fill="rgba(255, 255, 255, 0.15)" />

          <polygon points="200,200 185,185 90,200 200,200" fill="rgba(255, 255, 255, 0.12)" />
          <polygon points="200,200 185,215 90,200 200,200" fill="rgba(255, 255, 255, 0.06)" />

          <polygon points="200,200 215,185 310,200 200,200" fill="rgba(255, 255, 255, 0.12)" />
          <polygon points="200,200 215,215 310,200 200,200" fill="rgba(255, 255, 255, 0.06)" />

          {/* Cardinal Letters (N, S, E, W) */}
          <text
            x="200"
            y="72"
            textAnchor="middle"
            fontSize="18"
            fontWeight="900"
            fontFamily="'Poppins', sans-serif"
            fill="#6FCF45"
            filter="url(#emeraldGlow)"
          >
            N
          </text>
          <text
            x="200"
            y="342"
            textAnchor="middle"
            fontSize="15"
            fontWeight="bold"
            fontFamily="'Poppins', sans-serif"
            fill="rgba(255,255,255,0.75)"
          >
            S
          </text>
          <text
            x="336"
            y="206"
            textAnchor="middle"
            fontSize="15"
            fontWeight="bold"
            fontFamily="'Poppins', sans-serif"
            fill="rgba(255,255,255,0.75)"
          >
            E
          </text>
          <text
            x="64"
            y="206"
            textAnchor="middle"
            fontSize="15"
            fontWeight="bold"
            fontFamily="'Poppins', sans-serif"
            fill="rgba(255,255,255,0.75)"
          >
            W
          </text>
        </g>

        {/* 3. MAGNETIC NEEDLE (Fluid Natural Compass Needle Spin & Seeking Animation) */}
        <g className="animate-[compassSeek_8s_cubic-bezier(0.4,0,0.2,1)_infinite] origin-[200px_200px]">
          {/* North Pointer (Glowing Vibrant Emerald Green) */}
          <polygon
            points="200,200 188,200 200,45"
            fill="url(#needleNorth)"
            filter="url(#emeraldGlow)"
          />
          <polygon
            points="200,200 212,200 200,45"
            fill="url(#needleNorthDark)"
          />

          {/* South Pointer (Sleek Platinum Chrome) */}
          <polygon
            points="200,200 188,200 200,355"
            fill="url(#needleSouth)"
          />
          <polygon
            points="200,200 212,200 200,355"
            fill="url(#needleSouthDark)"
          />

          {/* Needle Center Pivot & Gemstone */}
          <circle
            cx="200"
            cy="200"
            r="16"
            fill="#071A16"
            stroke="#6FCF45"
            strokeWidth="3"
            filter="url(#emeraldGlow)"
          />
          <circle
            cx="200"
            cy="200"
            r="8"
            fill="url(#needleNorth)"
          />
          <circle
            cx="200"
            cy="200"
            r="3.5"
            fill="#FFFFFF"
          />
        </g>
      </svg>
    </div>
  )
}

export default AnimatedBackgroundCompass
