import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, MapPin } from 'lucide-react'

export const DestinationCard = ({ destination, aspect = 'medium', className = '' }) => {
  // Asymmetric height mapping
  const heightClasses = {
    tall: 'h-[440px] md:h-[500px]',
    wide: 'h-[280px] md:h-[320px]',
    medium: 'h-[340px] md:h-[380px]',
    small: 'h-[240px] md:h-[260px]',
  }

  const selectedHeight = heightClasses[aspect || destination.aspect] || heightClasses.medium

  return (
    <Link
      to={`/destinations/${destination.slug || destination.id}`}
      className={`group relative block w-full overflow-hidden rounded-[6px] ${selectedHeight} ${className} cursor-pointer shadow-md`}
    >
      {/* Background Image with Hover Scale */}
      <img
        src={destination.image}
        alt={destination.name}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        loading="lazy"
        decoding="async"
      />

      {/* Layered Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#071A16]/90 via-[#071A16]/30 to-transparent transition-opacity duration-300 group-hover:from-[#071A16]/95" />

      {/* Top Floating Badge */}
      <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-[3px] bg-[#071A16]/75 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-white tracking-wider">
        <MapPin className="w-3 h-3 text-[#6FCF45]" />
        <span>{destination.country}</span>
      </div>

      <div className="absolute top-4 right-4 w-8 h-8 rounded-[4px] bg-[#071A16]/70 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/80 group-hover:bg-[#6FCF45] group-hover:text-[#071A16] group-hover:border-[#6FCF45] transition-all duration-300">
        <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>

      {/* Bottom Content with Upward Slide on Hover */}
      <div className="absolute bottom-0 inset-x-0 p-5 md:p-6 transition-transform duration-300 ease-out group-hover:-translate-y-1">
        <span className="text-[10px] font-bold tracking-[0.25em] text-[#6FCF45] uppercase mb-1 block">
          {destination.toursCount ? `${destination.toursCount} CURATED EXPEDITIONS` : 'FEATURED DESTINATION'}
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
          {destination.name}
        </h3>
        <p className="text-xs text-[#A8B5AF] line-clamp-1 mt-1 font-normal opacity-90 group-hover:opacity-100 transition-opacity">
          {destination.tagline || destination.description}
        </p>

        {destination.startingPrice && (
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-[#A8B5AF]">From</span>
            <span className="font-bold text-white tracking-wide">
              ₹{destination.startingPrice.toLocaleString('en-IN')}{' '}
              <span className="text-[10px] text-[#A8B5AF] font-normal">/ person</span>
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}

export default DestinationCard
