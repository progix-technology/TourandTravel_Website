import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Star, Clock, Heart, Users, ArrowRight } from 'lucide-react'
import { useWishlist } from '../context/WishlistContext'
import { useBooking } from '../context/BookingContext'
import { useAuth } from '../context/AuthContext'
import Button from './Button'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'

export const TourCard = ({ tour, className = '' }) => {
  const { isInWishlist, toggleWishlist } = useWishlist()
  const { startBooking } = useBooking()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const inWishlist = isInWishlist(tour.id || tour.slug)

  const handleInstantBook = (e) => {
    e.preventDefault()
    e.stopPropagation()
    startBooking(tour, { travelers: 2 })
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/booking/${tour.slug || tour.id}` } } })
      return
    }
    navigate(`/booking/${tour.slug || tour.id}`)
  }

  return (
    <div
      className={`group bg-[#FAF8F2] border border-[#E5E0D5] rounded-[6px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full w-full ${className}`}
    >
      {/* Top Image Container */}
      <div className="relative h-[220px] w-full overflow-hidden bg-[#071A16] shrink-0">
        <LazyLoadImage
          src={tour.image}
          alt={tour.title}
          effect="blur"
          wrapperClassName="w-full h-full"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Category Tag */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-[3px] bg-[#071A16]/80 backdrop-blur-md border border-white/10 text-[10px] font-bold tracking-widest text-[#6FCF45] uppercase">
          {tour.category || tour.destination}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleWishlist(tour.id || tour.slug, navigate)
          }}
          aria-label="Save to wishlist"
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
            inWishlist
              ? 'bg-[#6FCF45] text-[#071A16]'
              : 'bg-[#071A16]/60 backdrop-blur-md text-white hover:bg-white hover:text-[#071A16]'
          }`}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Rating Badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] bg-white/90 backdrop-blur-md text-[#13251F] text-xs font-bold shadow-sm">
          <Star className="w-3.5 h-3.5 fill-[#EAB308] text-[#EAB308]" />
          <span>{tour.rating}</span>
          <span className="text-[10px] text-[#5C6E67] font-normal">
            ({tour.reviewsCount || 48})
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="flex-1 flex flex-col">
          {/* Duration & Group Metadata */}
          <div className="flex items-center gap-4 text-xs text-[#5C6E67] mb-2 font-medium min-h-[18px]">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#4F8F45]" />
              {tour.duration}
            </span>
            {tour.groupSize && (
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#4F8F45]" />
                {tour.groupSize}
              </span>
            )}
          </div>

          <Link to={`/tours/${tour.slug || tour.id}`} className="block">
            <h3 className="text-xl font-bold text-[#13251F] tracking-tight hover:text-[#4F8F45] transition-colors leading-snug line-clamp-2 min-h-[56px] flex items-start">
              {tour.title}
            </h3>
          </Link>
          <p className="text-xs text-[#5C6E67] mt-1.5 line-clamp-2 min-h-[36px] leading-relaxed">
            {tour.subtitle || tour.overview}
          </p>
        </div>

        {/* Price & Action Buttons */}
        <div className="mt-auto pt-4 border-t border-[#E5E0D5]/70 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#5C6E67] block leading-tight">
              Starting from
            </span>
            <div className="text-lg font-extrabold text-[#13251F] leading-tight mt-0.5">
              ₹{tour.startingPrice?.toLocaleString('en-IN')}
            </div>
            <span className="text-[10.5px] font-normal text-[#5C6E67] leading-tight block whitespace-nowrap">
              / person
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/tours/${tour.slug || tour.id}`}
              className="text-[11px] font-bold uppercase tracking-wider text-[#13251F] hover:text-[#4F8F45] px-2.5 py-2 transition-colors flex items-center gap-1"
            >
              <span>View</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
            <Button
              onClick={handleInstantBook}
              variant="primary"
              size="sm"
              className="text-[10px] px-3.5 h-[36px]"
            >
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TourCard
