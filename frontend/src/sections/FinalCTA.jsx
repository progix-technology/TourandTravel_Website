import React from 'react'
import Button from '../components/Button'
import mountainBg from '../assets/images/mountain.jpg'

export const FinalCTA = () => {
  return (
    <section className="relative min-h-[380px] md:min-h-[420px] flex items-center justify-center overflow-hidden border-t border-white/10 select-none">
      {/* Cinematic Mountain Background Image Asset */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={mountainBg}
          alt="Majestic Mountain Horizon"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-center scale-105"
        />
        {/* Lighter Layered Gradient Overlays to reveal mountain peaks clearly */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#071A16]/85 via-black/35 to-[#071A16]/65" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071A16]/60 via-transparent to-[#071A16]/60" />
        <div className="absolute inset-0 bg-[#071A16]/15" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center flex flex-col items-center">
        <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#6FCF45] mb-3 font-heading drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          YOUR NEXT HORIZON AWAITS
        </span>

        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] max-w-2xl font-heading drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
          Ready To Go Somewhere <br />
          <span className="text-[#6FCF45]">Extraordinary?</span>
        </h2>

        <p className="mt-4 text-xs sm:text-sm text-[#A8B5AF] max-w-md leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] font-normal">
          Speak directly with our regional travel designers or explore curated upcoming signature itineraries.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button to="/tours" variant="primary" size="lg" icon={true} className="text-xs sm:text-sm px-7 h-[46px]">
            EXPLORE TOURS
          </Button>
          <Button to="/custom-trip" variant="secondary" size="lg" className="text-xs sm:text-sm px-7 h-[46px]">
            TALK TO AN EXPERT
          </Button>
        </div>
      </div>
    </section>
  )
}

export default FinalCTA
