import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Clock, MapPin, ArrowRight } from 'lucide-react'
import ImageWithSkeleton from '../../../components/ui/ImageWithSkeleton'
import swissImg from '../../../assets/images/travel_image/Switzerland.jpg'
import { TOURS } from '../../../utils/mockData'

export const ProfileWishlistTab = ({
  wishlist,
  toggleWishlist,
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-heading">Saved Wishlist</h1>
          <p className="text-xs text-[#94A3B8]">Your dream destinations &amp; expeditions saved for later.</p>
        </div>
      </div>

      {wishlist && wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {wishlist.map((item, idx) => {
            const tourId = typeof item === 'object' ? (item.id || item.slug || item._id) : item
            const tour = (typeof item === 'object' && item.title)
              ? item
              : TOURS.find((t) => t.id === tourId || t.slug === tourId) || {
                  id: tourId,
                  title: tourId ? tourId.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Luxury Expedition',
                  destination: 'Global Sanctuary',
                  duration: '6 Days / 5 Nights',
                  startingPrice: 45000,
                  image: swissImg,
                }

            return (
              <div
                key={tour.id || tourId || idx}
                className="bg-[#081C16] border border-white/10 hover:border-white/20 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between group transition-all text-left"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <ImageWithSkeleton
                    src={tour.image || swissImg}
                    alt={tour.title}
                    className="w-full h-full"
                    imgClassName="group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#081C16] via-black/25 to-transparent" />
                  <button
                    onClick={() => toggleWishlist(tourId)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-rose-400 hover:scale-110 transition-transform cursor-pointer shadow-md"
                    title="Remove from wishlist"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                  {tour.duration && (
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-[10.5px] font-bold text-white flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#6FCF45]" />
                      <span>{tour.duration}</span>
                    </div>
                  )}
                </div>
                <div className="p-4.5 flex-1 flex flex-col justify-between">
                  <div>
                    {tour.destination && (
                      <span className="text-[10px] uppercase tracking-wider text-[#A8B5AF] font-bold flex items-center gap-1 mb-1">
                        <MapPin className="w-3 h-3 text-[#6FCF45]" />
                        {tour.destination}
                      </span>
                    )}
                    <h3 className="text-sm font-bold text-white mb-2 line-clamp-2 leading-snug font-heading">
                      {tour.title}
                    </h3>
                  </div>
                  <div className="pt-3 border-t border-white/10 mt-2">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-[9.5px] uppercase tracking-wider text-[#A8B5AF] block font-semibold">Starting From</span>
                        <span className="text-sm font-extrabold text-[#6FCF45] font-mono">
                          ₹{Number(tour.startingPrice || tour.price || 45000).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <Link
                        to={`/tours/${tour.id || tour.slug || tourId}`}
                        className="text-xs font-bold text-[#A8B5AF] hover:text-[#6FCF45] transition-colors"
                      >
                        View Details &rarr;
                      </Link>
                    </div>
                    <Link
                      to={`/booking/${tour.id || tour.slug || tourId}`}
                      className="w-full bg-[#6FCF45] hover:bg-[#5eb937] text-[#071A16] py-2.5 rounded-xl text-xs font-bold text-center block uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-[#081C16] border border-white/5 rounded-3xl p-12 text-center">
          <Heart className="w-12 h-12 text-[#94A3B8] mx-auto mb-3 opacity-50" />
          <h3 className="text-base font-bold text-white mb-1">Your Wishlist is Empty</h3>
          <p className="text-xs text-[#94A3B8] mb-4">Click the heart icon on any tour package to save it to your wishlist.</p>
          <Link
            to="/tours"
            className="inline-flex items-center gap-2 bg-[#6FCF45] text-[#071A16] px-5 py-2.5 rounded-xl font-bold text-xs uppercase"
          >
            <span>Explore Packages</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  )
}

export default ProfileWishlistTab

