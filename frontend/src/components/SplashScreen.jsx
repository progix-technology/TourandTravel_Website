import React, { useState, useEffect } from 'react'

export const SplashScreen = ({ minDisplayTime = 1800, onComplete }) => {
  const [isVisible, setIsVisible] = useState(true)
  const [isFadingOut, setIsFadingOut] = useState(false)

  useEffect(() => {
    // Check if user has already seen splash screen in this session to avoid annoyance,
    // or let it run on fresh page loads
    const timer = setTimeout(() => {
      setIsFadingOut(true)
      setTimeout(() => {
        setIsVisible(false)
        onComplete && onComplete()
      }, 600) // fade transition duration
    }, minDisplayTime)

    return () => clearTimeout(timer)
  }, [minDisplayTime, onComplete])

  if (!isVisible) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#071A16] select-none transition-all duration-700 ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Ambient luxury radial glow */}
      <div className="absolute w-[450px] h-[450px] bg-[#6FCF45]/15 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute w-[300px] h-[300px] bg-[#12382E]/50 rounded-full blur-[80px] pointer-events-none" />

      {/* Kinetic Badge Wrapper */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="kinetic-badge group">
          <div className="badge-bg" />

          {/* Rotating Circular SVG Text */}
          <div className="badge-text">
            <svg viewBox="0 0 100 100" width="150" height="150" className="overflow-visible">
              <defs>
                <path
                  id="splashCirclePath"
                  d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                />
              </defs>
              <text
                fontSize="9.5"
                fontWeight="700"
                letterSpacing="2.5"
                className="fill-[#6FCF45] tracking-[2.5px] uppercase"
              >
                <textPath href="#splashCirclePath" startOffset="0%">
                  TOURS &amp; TRAVELERS • LUXURY SANCTUARIES •
                </textPath>
              </text>
            </svg>
          </div>

          {/* Center Dynamic Compass / Arrow Icon */}
          <div className="badge-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              width="32"
              height="32"
              className="text-[#6FCF45] group-hover:text-white transition-colors duration-300"
            >
              <path
                d="M6 18L18 6M18 6H8M18 6V16"
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Company Name & Tagline under Badge */}
        <div className="mt-8 text-center space-y-1.5 animate-fadeIn">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-[0.25em] uppercase font-heading">
            TOURS &amp; <span className="text-[#6FCF45]">TRAVELLERS</span>
          </h1>
          <p className="text-[11px] sm:text-xs text-[#A8B5AF] tracking-[0.35em] uppercase font-medium">
            Curated Bespoke Luxury Expeditions
          </p>

          {/* Elegant Loading Line Indicator */}
          <div className="w-28 h-[2px] bg-white/10 rounded-full mx-auto mt-4 overflow-hidden relative">
            <div className="h-full bg-gradient-to-r from-transparent via-[#6FCF45] to-transparent w-full animate-marquee-scroll" />
          </div>
        </div>
      </div>

      {/* Embedded Styles for Kinetic Badge Animation */}
      <style>{`
        .kinetic-badge {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 150px;
          height: 150px;
          text-decoration: none;
          color: #6FCF45;
          border-radius: 50%;
          cursor: pointer;
        }

        .badge-bg {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0.85);
          width: 90px;
          height: 90px;
          background: radial-gradient(circle, #0F2922 0%, #071A16 100%);
          border: 1.5px solid rgba(111, 207, 69, 0.4);
          border-radius: 50%;
          box-shadow: 0 0 30px rgba(111, 207, 69, 0.25);
          transition: transform 0.6s cubic-bezier(0.85, 0, 0.15, 1);
          z-index: 1;
        }

        .kinetic-badge:hover .badge-bg {
          transform: translate(-50%, -50%) scale(1.1);
          border-color: #6FCF45;
          box-shadow: 0 0 45px rgba(111, 207, 69, 0.45);
        }

        .badge-text {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          animation: spinSlow 9s linear infinite;
          transition: color 0.4s ease;
        }

        .kinetic-badge:hover .badge-text {
          animation: spinSlow 3.5s linear infinite;
        }

        .badge-icon {
          position: relative;
          z-index: 3;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.6s cubic-bezier(0.85, 0, 0.15, 1);
        }

        .kinetic-badge:hover .badge-icon {
          transform: rotate(45deg) scale(1.2);
        }

        @keyframes spinSlow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}

export default SplashScreen

