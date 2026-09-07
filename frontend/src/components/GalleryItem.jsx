import React from 'react'
import { MapPin, Maximize2 } from 'lucide-react'
import ImageLoader from './ui/image-loading'

export const GalleryItem = ({ item, onClick }) => {
  const height = item.heightClass || 'h-[220px] sm:h-[240px]'

  return (
    <div
      onClick={onClick}
      className={`group relative w-full ${height} mb-3.5 sm:mb-4 break-inside-avoid overflow-hidden rounded-[16px] cursor-pointer shadow-sm hover:shadow-2xl bg-[#0B241E] border-2 border-[#6FCF45]/30 hover:border-[#6FCF45] transition-all duration-300 select-none`}
    >
      {/* Generative Blinking Skeleton Image Loader */}
      <ImageLoader
        src={item.image}
        alt={item.title}
        className="w-full h-full"
        imgClassName="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
      />

      {/* Subtle Gradient for Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-75 group-hover:opacity-90 transition-opacity pointer-events-none z-10" />

      {/* Floating Expand Icon */}
      <div className="absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#13251F] opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md">
        <Maximize2 className="w-3.5 h-3.5" />
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-0 inset-x-0 p-3 sm:p-3.5 z-20 transition-transform duration-300 group-hover:-translate-y-0.5 pointer-events-none">
        <h4 className="text-xs sm:text-[13px] font-bold text-white leading-snug font-heading line-clamp-1 drop-shadow-md">
          {item.title}
        </h4>
        <div className="flex items-center gap-1 text-[10px] sm:text-[10.5px] text-[#6FCF45] mt-0.5 font-medium">
          <MapPin className="w-3 h-3 shrink-0 text-[#6FCF45]" />
          <span className="line-clamp-1">{item.location}</span>
        </div>
      </div>
    </div>
  )
}

export default GalleryItem
