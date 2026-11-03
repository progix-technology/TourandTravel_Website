import React from 'react'

export const RouteFallback = () => {
  return (
    <div className="min-h-[70vh] w-full flex flex-col items-center justify-center bg-[#071A16] text-white select-none relative overflow-hidden">
      {/* Top Thin Ambient Luxury Loading Line */}
      <div className="fixed top-0 left-0 right-0 h-[2.5px] bg-[#071A16] z-[9999] overflow-hidden">
        <div className="h-full bg-gradient-to-r from-transparent via-[#6FCF45] to-transparent w-full animate-marquee-scroll shadow-[0_0_12px_#6FCF45]" />
      </div>

      {/* Subtle Central Radial Glow */}
      <div className="absolute w-[360px] h-[360px] bg-[#6FCF45]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Elegant Spinner & Brand Indicator */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="relative w-12 h-12 flex items-center justify-center">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 rounded-full border-2 border-[#6FCF45]/20 border-t-[#6FCF45] animate-spin" />
          {/* Inner pulse circle */}
          <div className="w-2.5 h-2.5 rounded-full bg-[#6FCF45] shadow-[0_0_12px_rgba(111,207,69,0.9)] animate-ping" />
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#6FCF45] font-heading">
            Tours &amp; Travellers
          </span>
          <span className="text-[10px] text-[#A8B5AF]/70 tracking-[0.2em] uppercase font-medium">
            Curating Sanctuary...
          </span>
        </div>
      </div>
    </div>
  )
}

export default RouteFallback

