import React, { useState, useEffect, useRef } from 'react'
import logoImg from '../assets/images/logo.png'
import userAirplaneImg from '../assets/images/user_airplane.png'
import thirdSlideBg from '../assets/images/3rdslidebg.png'
import kashmirPkg from '../assets/images/tour_packages/kashmir.jpg'
import maldivesPkg from '../assets/images/tour_packages/maldives.jpg'
import dubaiPkg from '../assets/images/tour_packages/dubai.jpg'
import rajasthanPkg from '../assets/images/tour_packages/rajsthan.jpg'

// Critical homepage imagery that MUST be decoded before splash fades out
const CRITICAL_HOMEPAGE_IMAGES = [
  // 1. Primary Hero Background (2000px Unsplash Alpine Landscape)
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=90',
  // 2. Brand Identity
  logoImg,
  // 3. Immediate Destinations Grid (Above & Near Fold)
  'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=85', // Kashmir
  'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1400&q=85', // Maldives
  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=85', // Bali
  'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1400&q=85', // Rajasthan
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85', // Dubai
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=85', // Paris
  // 4. Secondary Aviation / Map Canvas Assets
  userAirplaneImg,
  thirdSlideBg,
  // 5. Featured Tour Package local assets
  kashmirPkg,
  maldivesPkg,
  dubaiPkg,
  rajasthanPkg,
]

/**
 * Preload and GPU-decode an image URL.
 * Resolves safely even if the image errors, so the app never hangs.
 */
function preloadAndDecodeImage(src) {
  return new Promise((resolve) => {
    if (!src || typeof window === 'undefined') return resolve()
    const img = new Image()
    let isSettled = false

    const handleSuccess = () => {
      if (isSettled) return
      isSettled = true
      // Decode directly into GPU memory to eliminate any painting freeze
      if (typeof img.decode === 'function') {
        img.decode().then(resolve).catch(resolve)
      } else {
        resolve()
      }
    }

    const handleError = () => {
      if (isSettled) return
      isSettled = true
      resolve() // Don't block app on missing or 404 images
    }

    img.src = src

    if (img.complete) {
      handleSuccess()
    } else {
      img.onload = handleSuccess
      img.onerror = handleError
    }
  })
}

export const SplashScreen = ({ minDisplayTime = 1600, maxSafetyTimeout = 4000, onComplete }) => {
  const [isVisible, setIsVisible] = useState(true)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [progress, setProgress] = useState(10)
  const isMountedRef = useRef(true)

  // Prevent background scrolling while splash is active
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isVisible])

  useEffect(() => {
    isMountedRef.current = true

    // Minimum display timer for branding presence
    const minTimerPromise = new Promise((resolve) => setTimeout(resolve, minDisplayTime))

    // Preload critical images with progress tracking
    const totalImages = CRITICAL_HOMEPAGE_IMAGES.length
    let loadedCount = 0

    const imagesPromise = Promise.all(
      CRITICAL_HOMEPAGE_IMAGES.map((url) =>
        preloadAndDecodeImage(url).then(() => {
          if (!isMountedRef.current) return
          loadedCount += 1
          const calculated = Math.min(95, Math.round(10 + (loadedCount / totalImages) * 85))
          setProgress((prev) => Math.max(prev, calculated))
        })
      )
    )

    // Safety timeout prevents slow/flaky networks from hanging permanently
    const safetyTimeoutPromise = new Promise((resolve) => setTimeout(resolve, maxSafetyTimeout))

    // Wait until both minimum time has elapsed AND images are decoded (or safety timeout kicks in)
    const completionPromise = Promise.race([
      Promise.all([minTimerPromise, imagesPromise]),
      safetyTimeoutPromise,
    ])

    completionPromise.then(() => {
      if (!isMountedRef.current) return
      setProgress(100)

      // Brief gentle pause at 100% before silky fade-out
      setTimeout(() => {
        if (!isMountedRef.current) return
        setIsFadingOut(true)

        setTimeout(() => {
          if (!isMountedRef.current) return
          setIsVisible(false)
          if (onComplete) onComplete()
        }, 650) // Transition duration
      }, 150)
    })

    return () => {
      isMountedRef.current = false
    }
  }, [minDisplayTime, maxSafetyTimeout, onComplete])

  if (!isVisible) return null

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#071A16] select-none transition-all duration-700 ease-out ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      aria-label="Loading Tours & Travellers Experience"
    >
      {/* Ambient luxury radial glow */}
      <div className="absolute w-[450px] h-[450px] bg-[#6FCF45]/15 rounded-full blur-[110px] pointer-events-none animate-pulse" />
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
                fontSize="8"
                fontWeight="700"
                letterSpacing="1.8"
                className="fill-[#6FCF45] uppercase"
              >
                <textPath href="#splashCirclePath" startOffset="0%">
                  TOURS &amp; TRAVELERS • LUXURY SANCTUARIES •
                </textPath>
              </text>
            </svg>
          </div>

          {/* Center Brand Logo */}
          <div className="badge-icon">
            <img
              src={logoImg}
              alt="Tours &amp; Travellers Logo"
              className="w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow-[0_0_16px_rgba(111,207,69,0.55)] transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        </div>

        {/* Company Name & Tagline under Badge */}
        <div className="mt-8 text-center space-y-2 animate-fadeIn px-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-[0.25em] uppercase font-heading">
            TOURS &amp; <span className="text-[#6FCF45]">TRAVELLERS</span>
          </h1>
          <p className="text-[11px] sm:text-xs text-[#A8B5AF] tracking-[0.35em] uppercase font-medium">
            Curated Bespoke Luxury Expeditions
          </p>

          {/* Dynamic Progress Bar & Percentage */}
          <div className="w-36 sm:w-44 mx-auto pt-3 flex flex-col items-center gap-2">
            <div className="w-full h-[2.5px] bg-white/10 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-[#6FCF45]/70 via-[#6FCF45] to-[#8BE35A] transition-all duration-300 ease-out rounded-full shadow-[0_0_12px_rgba(111,207,69,0.8)]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between w-full text-[9px] font-mono tracking-widest text-[#A8B5AF]/80 uppercase">
              <span>PREPARING</span>
              <span className="text-[#6FCF45] font-semibold">{progress}%</span>
            </div>
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
          transform: scale(1.15);
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
