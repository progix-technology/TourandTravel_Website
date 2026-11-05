import React from 'react'
import { Sparkle, Compass, Sparkles, ShieldCheck, CheckCircle } from 'lucide-react'

export const TripCostSidebar = ({
  distanceKm,
  departure,
  destination,
  adults,
  transitCategory,
  grandTotal,
}) => {
  return (
    <div className="lg:col-span-4 space-y-3.5 sticky top-28">
      <div>
        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#6FCF45] font-heading flex items-center gap-1.5">
          <Sparkle className="w-3.5 h-3.5 fill-[#6FCF45]" />
          DIRECT BOOKING &amp; ITINERARY ARCHITECT
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight font-heading leading-tight">
          Plan Your Journey <br />
          <span className="text-[#6FCF45]">In 3 Seamless Steps.</span>
        </h2>
        <p className="mt-1.5 text-xs text-[#A8B5AF] leading-relaxed">
          Live location detection, famous hotspots curated, party-size customized details, and instantaneous VIP booking.
        </p>
      </div>

      {/* Live Journey Summary Preview Card */}
      <div className="bg-[#0B241E]/95 border-2 border-[#6FCF45]/70 rounded-[16px] p-4 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2.5">
          <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#6FCF45] flex items-center gap-1.5 font-heading">
            <Compass className="w-3.5 h-3.5" />
            Live Route &amp; Transit
          </span>
          <span className="text-xs text-[#6FCF45] font-extrabold">
            {distanceKm} km approx
          </span>
        </div>

        {/* Connected Visual Route */}
        <div className="space-y-1.5 text-xs">
          <div className="flex items-start gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#6FCF45] ring-2 ring-[#6FCF45]/30 shrink-0 mt-1" />
            <div>
              <span className="text-[#A8B5AF] text-[10px] uppercase font-bold block">Origin:</span>
              <span className="font-bold text-white text-xs">{departure.city || 'Starting Point'}</span>
            </div>
          </div>

          <div className="flex items-start gap-2 pl-0.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#EAB308] ring-2 ring-[#EAB308]/30 shrink-0 mt-1" />
            <div>
              <span className="text-[#A8B5AF] text-[10px] uppercase font-bold block">Destination &amp; Highlight:</span>
              <span className="font-bold text-white text-xs">{destination.city}</span>
              {destination.selectedSpot && (
                <span className="text-[10.5px] text-[#6FCF45] flex items-center gap-1 font-medium mt-0.5">
                  <Sparkles className="w-3 h-3 shrink-0" />
                  <span>{destination.selectedSpot}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Transit & Travelers Badges */}
        <div className="mt-3 pt-2.5 border-t border-white/10 grid grid-cols-3 gap-1.5 text-center text-[10px]">
          <div className="bg-[#071A16] rounded-md p-1.5 border border-white/5">
            <div className="text-[#A8B5AF]">Party</div>
            <div className="font-bold text-white mt-0.5">{adults} Guests</div>
          </div>
          <div className="bg-[#071A16] rounded-md p-1.5 border border-white/5">
            <div className="text-[#A8B5AF]">Mode</div>
            <div className="font-bold text-[#6FCF45] mt-0.5 capitalize">{transitCategory}</div>
          </div>
          <div className="bg-[#071A16] rounded-md p-1.5 border border-white/5">
            <div className="text-[#A8B5AF]">Est. Total</div>
            <div className="font-bold text-white mt-0.5">₹{grandTotal.toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>

      {/* Quick Guarantees */}
      <div className="space-y-2 pt-1 hidden sm:block">
        <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-[#A8B5AF]">
          <ShieldCheck className="w-4 h-4 text-[#6FCF45] shrink-0" />
          <span>Zero-Deposit Hold Available on Step 3</span>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-[#A8B5AF]">
          <CheckCircle className="w-4 h-4 text-[#6FCF45] shrink-0" />
          <span>24/7 Dedicated Concierge &amp; WhatsApp Support</span>
        </div>
      </div>
    </div>
  )
}

export default TripCostSidebar

