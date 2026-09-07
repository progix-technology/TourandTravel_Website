import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { X, MapPin, Camera, ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react'
import SectionHeading from '../components/SectionHeading'
import GalleryItem from '../components/GalleryItem'
import ImageLoader from '../components/ui/image-loading'
import { GALLERY_ITEMS } from '../utils/mockData'
import mediaService from '../services/mediaService'

export const TravelGallery = () => {
  const [items, setItems] = useState(GALLERY_ITEMS)
  const [activeItem, setActiveItem] = useState(null)

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const liveItems = await mediaService.getHomeGallery()
        if (liveItems && liveItems.length > 0) {
          setItems(liveItems)
        }
      } catch (err) {
        console.warn('Failed to load travel gallery items:', err)
      }
    }
    fetchGallery()
  }, [])

  // Limit home page display to 8 curated photos for clean visual layout
  const displayedItems = items.slice(0, 8)

  return (
    <section id="gallery" className="bg-[#FAF8F2] text-[#13251F] py-14 sm:py-16 lg:py-20 border-t border-[#E5E0D5] select-none">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Section Heading */}
        <div className="mb-8 sm:mb-10 text-left">
          <div className="inline-flex items-center gap-2.5 mb-2.5 text-[11px] uppercase tracking-[0.22em] font-semibold text-[#4F8F45]">
            <span className="w-5 h-[1.5px] bg-[#6FCF45]" />
            <span>MOMENTS &amp; MEMORIES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-[1.18] text-[#13251F] font-heading">
            Travel Gallery
          </h2>
          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#5C6E67] max-w-2xl">
            Glimpses captured by our travelers and expedition curators across pristine corners of the planet.
          </p>
        </div>

        {/* Curated Masonry Grid (8 Photos) */}
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3.5 sm:gap-4.5">
          {displayedItems.map((item) => (
            <GalleryItem
              key={item.id || item._id}
              item={item}
              onClick={() => setActiveItem(item)}
            />
          ))}
        </div>

        {/* Bottom Explore Link Bar */}
        <div className="mt-10 pt-6 border-t border-[#E5E0D5] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5C6E67]">
          <span>
            Showing <strong className="text-[#13251F]">8 of {items.length}</strong> expedition snapshots.
          </span>
          <Link
            to="/gallery"
            className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#071A16] hover:text-[#4F8F45] transition-colors"
          >
            <span>View all archive photos</span>
            <ArrowUpRight className="w-4 h-4 text-[#4F8F45]" />
          </Link>
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div 
          onClick={() => setActiveItem(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-[#071A16] border-2 border-[#6FCF45] rounded-[22px] overflow-hidden shadow-2xl animate-scaleUp"
          >
            <button
              onClick={() => setActiveItem(null)}
              aria-label="Close modal"
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-[#6FCF45] hover:text-[#071A16] transition-colors shadow-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full max-h-[70vh] overflow-hidden bg-[#071A16] flex items-center justify-center p-2 sm:p-4">
              <img
                key={activeItem.id}
                src={activeItem.image}
                alt={activeItem.title}
                className="max-h-[55vh] sm:max-h-[62vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
                loading="eager"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80'
                }}
              />
            </div>

            <div className="p-5 flex items-center justify-between bg-[#071A16] border-t-2 border-[#6FCF45]/30">
              <div>
                <h4 className="text-base sm:text-lg font-bold text-white font-heading">{activeItem.title}</h4>
                <div className="flex items-center gap-1.5 text-xs text-[#6FCF45] mt-1 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-[#6FCF45]" />
                  <span>{activeItem.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#A8B5AF]">
                <Camera className="w-4 h-4 text-[#6FCF45]" />
                <span>Expedition Archive</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default TravelGallery
