"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface ImageLoaderProps {
  src: string
  alt?: string
  className?: string
  onLoad?: () => void
}

export default function ImageLoader({
  src,
  alt = "",
  className = "",
  onLoad
}: ImageLoaderProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div className={`relative overflow-hidden bg-[#071A16] flex items-center justify-center ${className}`}>
      <style>{`
        .dot-spinner {
          --uib-size: 2.8rem;
          --uib-speed: .9s;
          --uib-color: #ffffff;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          height: var(--uib-size);
          width: var(--uib-size);
        }

        .dot-spinner__dot {
          position: absolute;
          top: 0;
          left: 0;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          height: 100%;
          width: 100%;
        }

        .dot-spinner__dot::before {
          content: '';
          height: 20%;
          width: 20%;
          border-radius: 50%;
          background-color: var(--uib-color);
          transform: scale(0);
          opacity: 0.5;
          animation: pulse0112 calc(var(--uib-speed) * 1.111) ease-in-out infinite;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
        }

        .dot-spinner__dot:nth-child(2) {
          transform: rotate(45deg);
        }

        .dot-spinner__dot:nth-child(2)::before {
          animation-delay: calc(var(--uib-speed) * -0.875);
        }

        .dot-spinner__dot:nth-child(3) {
          transform: rotate(90deg);
        }

        .dot-spinner__dot:nth-child(3)::before {
          animation-delay: calc(var(--uib-speed) * -0.75);
        }

        .dot-spinner__dot:nth-child(4) {
          transform: rotate(135deg);
        }

        .dot-spinner__dot:nth-child(4)::before {
          animation-delay: calc(var(--uib-speed) * -0.625);
        }

        .dot-spinner__dot:nth-child(5) {
          transform: rotate(180deg);
        }

        .dot-spinner__dot:nth-child(5)::before {
          animation-delay: calc(var(--uib-speed) * -0.5);
        }

        .dot-spinner__dot:nth-child(6) {
          transform: rotate(225deg);
        }

        .dot-spinner__dot:nth-child(6)::before {
          animation-delay: calc(var(--uib-speed) * -0.375);
        }

        .dot-spinner__dot:nth-child(7) {
          transform: rotate(270deg);
        }

        .dot-spinner__dot:nth-child(7)::before {
          animation-delay: calc(var(--uib-speed) * -0.25);
        }

        .dot-spinner__dot:nth-child(8) {
          transform: rotate(315deg);
        }

        .dot-spinner__dot:nth-child(8)::before {
          animation-delay: calc(var(--uib-speed) * -0.125);
        }

        @keyframes pulse0112 {
          0%,
          100% {
            transform: scale(0);
            opacity: 0.5;
          }
          50% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>

      {/* Spinner while loading */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-10 bg-[#071A16] flex items-center justify-center"
          >
            <div className="dot-spinner">
              <div className="dot-spinner__dot"></div>
              <div className="dot-spinner__dot"></div>
              <div className="dot-spinner__dot"></div>
              <div className="dot-spinner__dot"></div>
              <div className="dot-spinner__dot"></div>
              <div className="dot-spinner__dot"></div>
              <div className="dot-spinner__dot"></div>
              <div className="dot-spinner__dot"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actual Image */}
      <motion.img
        src={src}
        alt={alt}
        onLoad={() => {
          setIsLoaded(true)
          if (onLoad) onLoad()
        }}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 1.05 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  )
}
