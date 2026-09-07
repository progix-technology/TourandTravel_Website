import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Star, Clock, Heart, Users, ArrowRight, ShieldCheck, Headphones, Gem, CalendarCheck } from 'lucide-react'
import { useWishlist } from '../context/WishlistContext'
import { useBooking } from '../context/BookingContext'
import { useAuth } from '../context/AuthContext'
import tourService from '../services/tourService'

// High-res curated images from tour_packages folder
import kashmirImg from '../assets/images/tour_packages/kashmir.jpg'
import maldivesImg from '../assets/images/tour_packages/maldives.jpg'
import dubaiImg from '../assets/images/tour_packages/dubai.jpg'
import rajasthanImg from '../assets/images/tour_packages/rajsthan.jpg'

export const TourPackages = () => {
  const { isInWishlist, toggleWishlist } = useWishlist()
  const { startBooking } = useBooking()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const defaultFeatured = [
    {
      id: 'kashmir-escape',
      slug: 'kashmir-escape',
      title: 'Kashmir Escape',
      subtitle: 'Alpine Tranquility & Shikara Dreams',
      category: 'ADVENTURE & NATURE',
      image: kashmirImg,
      rating: 4.9,
      reviewsCount: 142,
      duration: '7 Days / 6 Nights',
      groupSize: 'Max 10 Explorers',
      startingPrice: 24999,
    },
    {
      id: 'maldives-retreat',
      slug: 'maldives-retreat',
      title: 'Maldives Retreat',
      subtitle: 'Ultra-Luxury Overwater Solitude',
      category: 'LUXURY & BEACH',
      image: maldivesImg,
      rating: 5.0,
      reviewsCount: 215,
      duration: '5 Days / 4 Nights',
      groupSize: 'Couples / Private',
      startingPrice: 84999,
    },
    {
      id: 'dubai-explorer',
      slug: 'dubai-explorer',
      title: 'Dubai Explorer',
      subtitle: 'Modern Marvels & Arabian Dune Glamour',
      category: 'URBAN & ADVENTURE',
      image: dubaiImg,
      rating: 4.8,
      reviewsCount: 178,
      duration: '6 Days / 5 Nights',
      groupSize: 'Max 12 Explorers',
      startingPrice: 48999,
    },
    {
      id: 'rajasthan-heritage',
      slug: 'rajasthan-heritage',
      title: 'Rajasthan Heritage',
      subtitle: 'Grand Palaces, Fortresses & Thar Stargazing',
      category: 'CULTURE & HERITAGE',
      image: rajasthanImg,
      rating: 4.9,
      reviewsCount: 164,
      duration: '8 Days / 7 Nights',
      groupSize: 'Max 8 Explorers',
      startingPrice: 18999,
    },
  ]

  const [toursList, setToursList] = useState(defaultFeatured.slice(0, 4))

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const allTours = await tourService.getAll()
        if (allTours && allTours.length > 0) {
          const featured = allTours.filter((t) => t.isFeatured)
          setToursList(featured.length > 0 ? featured.slice(0, 4) : allTours.slice(0, 4))
        }
      } catch (err) {
        console.warn('Using default featured tours fallback:', err)
      }
    }
    loadFeatured()

    const handleUpdated = () => {
      loadFeatured()
    }
    window.addEventListener('tt_tours_updated', handleUpdated)
    return () => {
      window.removeEventListener('tt_tours_updated', handleUpdated)
    }
  }, [])

  const featuredTours = toursList.slice(0, 4)

  const handleInstantBook = (tour, e) => {
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
    <section id="tours" className="bg-[#FAF8F2] text-[#13251F] py-16 sm:py-20 lg:py-24 select-none">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* 1. Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 sm:mb-12">
          <div className="flex flex-col items-start text-left max-w-2xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="w-5 h-[2px] bg-[#4F8F45]" />
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#4F8F45] font-heading">
                SIGNATURE EXPEDITIONS
              </span>
            </div>

            {/* Main Title */}
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-[#13251F] font-heading leading-tight">
              Signature Tour Packages
            </h2>

            {/* Subtitle */}
            <p className="mt-2 text-xs sm:text-sm text-[#5C6E67] font-normal leading-relaxed">
              Carefully engineered multi-day journeys featuring boutique stays, private curators, and VIP local access.
            </p>
          </div>

          {/* Top-Right Link */}
          <Link
            to="/tours"
            className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#13251F] hover:text-[#4F8F45] transition-colors font-heading shrink-0 pb-1"
          >
            <span>EXPLORE ALL PACKAGES</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 2. 4 Signature Tour Cards Grid (2x2 on Mobile, 1 Row of 4 on Desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {featuredTours.map((tour, idx) => {
            const inWishlist = isInWishlist(tour.id || tour.slug)

            return (
              <div
                key={tour._id || tour.id || tour.slug || `tour-${idx}`}
                className="group bg-white rounded-[14px] sm:rounded-[22px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col justify-between border border-[#13251F]/5"
              >
                {/* Top Image Container */}
                <div className="relative h-[135px] sm:h-[250px] w-full overflow-hidden bg-[#071A16]">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />

                  {/* Top-Left Category Tag */}
                  <div className="absolute top-2 left-2 sm:top-3.5 sm:left-3.5 px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-[3px] sm:rounded-[4px] bg-[#2E4A35] text-[7.5px] sm:text-[9.5px] font-bold tracking-wider text-white uppercase shadow-sm truncate max-w-[70%] sm:max-w-none">
                    {tour.category}
                  </div>

                  {/* Top-Right Wishlist Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      toggleWishlist(tour.id || tour.slug, navigate)
                    }}
                    aria-label="Save to wishlist"
                    className={`absolute top-2 right-2 sm:top-3.5 sm:right-3.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
                      inWishlist
                        ? 'bg-[#6FCF45] text-[#071A16]'
                        : 'bg-white/90 text-[#13251F] hover:bg-white hover:scale-105'
                    }`}
                  >
                    <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${inWishlist ? 'fill-current' : ''}`} />
                  </button>

                  {/* Bottom-Left Rating Pill */}
                  <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3.5 flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2.5 py-0.5 rounded-full bg-white text-[#13251F] text-[9px] sm:text-[11px] font-bold shadow-md">
                    <Star className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-[#EAB308] text-[#EAB308]" />
                    <span>{tour.rating.toFixed(1)}</span>
                    <span className="text-[8px] sm:text-[10px] text-[#5C6E67] font-normal">
                      ({tour.reviewsCount})
                    </span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-2.5 sm:p-5 flex-1 flex flex-col justify-between">
                  <div className="flex-1 flex flex-col">
                    {/* Metadata Line */}
                    <div className="flex items-center gap-1 sm:gap-2 text-[9px] sm:text-[11px] text-[#5C6E67] mb-1 sm:mb-2 font-medium min-h-0 sm:min-h-[18px]">
                      <span className="flex items-center gap-0.5 sm:gap-1 truncate">
                        <Clock className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#5C6E67] shrink-0" />
                        <span className="truncate">{tour.duration}</span>
                      </span>
                    </div>

                    {/* Title */}
                    <Link to={`/tours/${tour.slug || tour.id}`} className="block">
                      <h3 className="text-xs sm:text-xl font-bold text-[#13251F] tracking-tight hover:text-[#4F8F45] transition-colors leading-tight font-heading line-clamp-2 min-h-[30px] sm:min-h-[52px] flex items-start">
                        {tour.title}
                      </h3>
                    </Link>

                    {/* Subtitle */}
                    <p className="text-[10px] sm:text-xs text-[#7A8B84] mt-1 line-clamp-1 sm:line-clamp-2 min-h-0 sm:min-h-[36px] leading-relaxed font-normal">
                      {tour.subtitle}
                    </p>
                  </div>

                  {/* Footer: Price + Book Now Button */}
                  <div className="mt-2 sm:mt-auto pt-2 sm:pt-4 border-t border-[#13251F]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
                    {/* Price */}
                    <div className="flex flex-col">
                      <span className="text-[7.5px] sm:text-[9px] uppercase font-bold tracking-wider text-[#7A8B84] block leading-tight">
                        STARTING FROM
                      </span>
                      <div className="text-xs sm:text-lg font-bold text-[#13251F] font-heading leading-tight mt-0.5">
                        ₹{tour.startingPrice.toLocaleString('en-IN')}
                      </div>
                      <span className="text-[8px] sm:text-[10.5px] font-normal text-[#7A8B84] leading-tight block whitespace-nowrap">
                        / person
                      </span>
                    </div>

                    {/* Action Links */}
                    <div className="flex items-center gap-1.5 sm:gap-2.5">
                      <Link
                        to={`/tours/${tour.slug || tour.id}`}
                        className="hidden sm:flex text-[10px] font-bold uppercase tracking-wider text-[#13251F] hover:text-[#4F8F45] transition-colors items-center gap-0.5"
                      >
                        <span>VIEW DETAILS</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>

                      <button
                        onClick={(e) => handleInstantBook(tour, e)}
                        className="w-full sm:w-auto bg-[#2E4A35] text-white px-2 sm:px-3.5 py-1.5 rounded-[5px] sm:rounded-[6px] text-[9px] sm:text-[10.5px] font-bold uppercase tracking-wider hover:bg-[#233A29] transition-colors shadow-sm active:scale-95 text-center"
                      >
                        BOOK NOW
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default TourPackages
