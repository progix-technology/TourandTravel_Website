import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Briefcase,
  Calendar,
  Users,
  MapPin,
  Star,
  Heart,
  User,
  Crown,
  ChevronRight,
  Award,
  Zap,
  Compass,
  FileText,
  Gift,
} from 'lucide-react'
import ImageWithSkeleton from '../../../components/ui/ImageWithSkeleton'
import bannerBg from '../../../assets/images/destination_bg.jpg'
import destinationBg1 from '../../../assets/images/destination_bg1.jpg'
import mountainShapeImg from '../../../assets/images/mountain_shape.png'

export const ProfileDashboardTab = ({
  user,
  currentPoints,
  totalTripsCount,
  totalWishlistCount,
  activeJourney,
  recommendedDestinations,
  setActiveTab,
  setSelectedBookingModal,
  toggleWishlist,
  isInWishlist,
}) => {
  const navigate = useNavigate()

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. TOP HERO TRAVEL BANNER */}
      <div className="relative rounded-2xl overflow-hidden min-h-[220px] sm:min-h-[260px] flex items-center p-6 sm:p-10 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-2px_6px_rgba(0,0,0,0.6)] border border-white/10 bg-gradient-to-br from-[#1F242D] via-[#161922] to-[#0E1117]">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#6FCF45]/60 to-transparent z-20" />
        
        <div className="absolute top-0 right-0 w-14 h-14 overflow-hidden pointer-events-none z-20">
          <div className="absolute transform rotate-45 bg-gradient-to-br from-[#6FCF45]/25 to-transparent w-10 h-10 -top-5 -right-5 border-b border-white/10" />
        </div>

        <img
          src={bannerBg}
          alt="Explore the World"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105 opacity-40"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E1117]/95 via-[#0E1117]/85 to-transparent z-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E1117]/80 via-transparent to-transparent z-0" />

        <div className="relative z-10 max-w-xl">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#6FCF45] font-heading block mb-2 drop-shadow-[0_0_8px_rgba(111,207,69,0.4)]">
            EXPLORE THE WORLD
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-heading leading-tight mb-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
            New Journeys<br />Await You
          </h1>
          <p className="text-xs sm:text-sm text-[#CBD5E1] mb-5 leading-relaxed max-w-md">
            Discover breathtaking destinations and create memories for a lifetime.
          </p>
          <Link
            to="/custom-trip"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#6FCF45] to-[#8AE863] text-[#071A16] px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-[0_4px_14px_rgba(111,207,69,0.35)] active:scale-95 cursor-pointer"
          >
            <span>Plan Your Next Trip</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </Link>
        </div>

        <div className="hidden lg:block absolute right-12 bottom-8 z-10 text-right">
          <p
            className="text-white/85 text-2xl sm:text-3xl font-light italic leading-tight drop-shadow-md"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            “Collect Moments<br />Not Things”
          </p>
        </div>
      </div>

      {/* 2. MAIN 2-COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left 8 Cols */}
        <div className="lg:col-span-8 flex flex-col justify-between gap-6">
          {/* Upcoming Journeys */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1F242D] via-[#161922] to-[#0E1117] border border-white/10 p-5 sm:p-6 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-2px_6px_rgba(0,0,0,0.6)]">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#6FCF45]/60 to-transparent" />
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#6FCF45]/15 border border-[#6FCF45]/30 text-[#6FCF45]">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-white tracking-tight font-heading">
                  My Upcoming Journeys
                </h2>
              </div>
              <button
                onClick={() => setActiveTab('bookings')}
                className="text-xs text-[#6FCF45] hover:underline flex items-center gap-1 font-bold cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="bg-[#0E1117]/80 border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-inner">
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <div className="w-full sm:w-28 h-24 sm:h-20 rounded-xl overflow-hidden border border-white/15 shrink-0 shadow-md">
                  <ImageWithSkeleton
                    src={activeJourney.image}
                    alt={activeJourney.title}
                    className="w-full h-full"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      {activeJourney.title}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md bg-[#6FCF45]/15 text-[#6FCF45] text-[10px] font-bold border border-[#6FCF45]/30 uppercase">
                      {activeJourney.status}
                    </span>
                  </div>
                  <div className="space-y-0.5 text-xs text-[#A8B5AF]">
                    <div className="flex items-center justify-center sm:justify-start gap-1.5">
                      <Calendar className="w-3 h-3 text-[#6FCF45]/70" />
                      <span>{activeJourney.dates}</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-1.5">
                      <Users className="w-3 h-3 text-[#6FCF45]/70" />
                      <span>{activeJourney.travelers}</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-1.5">
                      <MapPin className="w-3 h-3 text-[#6FCF45]/70" />
                      <span>{activeJourney.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto shrink-0">
                <button
                  onClick={() => setSelectedBookingModal(activeJourney)}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold tracking-wide transition-all text-center cursor-pointer shadow-sm"
                >
                  View Details
                </button>
                <button
                  onClick={() => setSelectedBookingModal(activeJourney)}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-[#6FCF45] to-[#8AE863] text-[#071A16] text-xs font-bold tracking-wide transition-all text-center cursor-pointer shadow-[0_4px_12px_rgba(111,207,69,0.3)]"
                >
                  Download Itinerary
                </button>
              </div>
            </div>
          </div>

          {/* Recommended for You */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1F242D] via-[#161922] to-[#0E1117] border border-white/10 p-5 sm:p-6 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-2px_6px_rgba(0,0,0,0.6)]">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-amber-400/15 border border-amber-400/30 text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <h2 className="text-sm font-bold text-white tracking-tight font-heading">
                  Recommended for You
                </h2>
              </div>
              <Link
                to="/tours"
                className="text-xs text-[#6FCF45] hover:underline flex items-center gap-1 font-bold"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {recommendedDestinations.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(item.link)}
                  className="group bg-[#0E1117]/80 border border-white/10 rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.5)] hover:border-[#6FCF45]/50 transition-all cursor-pointer flex flex-col"
                >
                  <div className="relative h-32 sm:h-36 w-full overflow-hidden">
                    <ImageWithSkeleton
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full"
                      imgClassName="group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E1117] via-transparent to-transparent opacity-80" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleWishlist({ id: item.id, title: item.title, image: item.image, price: item.price })
                      }}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-rose-400 transition-colors cursor-pointer border border-white/10 shadow-md"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isInWishlist(item.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>
                  <div className="p-3 text-left flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-white group-hover:text-[#6FCF45] transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-1 text-[10px] text-[#A8B5AF] mt-1">
                        <MapPin className="w-3 h-3 text-[#6FCF45]" />
                        <span>{item.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Exclusive Travel Deals Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1F242D] via-[#161922] to-[#0E1117] border border-white/10 p-5 sm:p-6 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-2px_6px_rgba(0,0,0,0.6)] flex flex-col sm:flex-row items-center justify-between gap-4 flex-1 min-h-[105px]">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#6FCF45]/60 to-transparent" />
            <img
              src={destinationBg1}
              alt="Travel Deals"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-20"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0E1117] via-[#0E1117]/90 to-transparent" />
            
            <div className="relative z-10">
              <h2 className="text-base sm:text-lg font-bold text-white mb-1 font-heading">
                Exclusive Travel Deals Just for You!
              </h2>
              <p className="text-xs text-[#A8B5AF]">
                Get personalized VIP offers, early access and special luxury discounts.
              </p>
            </div>

            <Link
              to="/tours"
              className="relative z-10 bg-gradient-to-r from-[#6FCF45] to-[#8AE863] text-[#071A16] px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 active:scale-95 shadow-[0_4px_12px_rgba(111,207,69,0.3)] flex items-center gap-1.5 cursor-pointer"
            >
              <span>View Offers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right 4 Cols */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-6">
          {/* User Profile Summary Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1F242D] via-[#161922] to-[#0E1117] border border-white/10 p-5 sm:p-6 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-2px_6px_rgba(0,0,0,0.6)] text-left">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
            
            <div className="flex items-center gap-3.5 pb-4 border-b border-white/5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1E3A2B] to-[#0A1611] border border-[#6FCF45]/40 flex items-center justify-center text-[#6FCF45] shrink-0 shadow-[0_6px_14px_rgba(0,0,0,0.5)]">
                <User className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[10px] font-bold uppercase tracking-wider mb-1 shadow-sm">
                  <Crown className="w-2.5 h-2.5" />
                  <span>VOYAGER MEMBER</span>
                </div>
                <h3 className="text-sm font-bold text-white truncate">
                  {user?.name || 'Explorer'}
                </h3>
                <p className="text-[11px] text-[#A8B5AF] truncate">
                  {user?.email || ''}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#A8B5AF] shrink-0" />
            </div>

            <div className="grid grid-cols-3 gap-2.5 my-4">
              <div className="bg-gradient-to-br from-[#13171F] to-[#0A0D12] border border-white/10 rounded-xl p-2.5 text-center shadow-inner">
                <div className="w-6 h-6 rounded-lg bg-[#6FCF45]/15 border border-[#6FCF45]/30 text-[#6FCF45] flex items-center justify-center mx-auto mb-1">
                  <Award className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs font-bold text-white font-mono">{currentPoints}</div>
                <span className="text-[9px] text-[#A8B5AF] block leading-tight font-medium">Points</span>
              </div>

              <div className="bg-gradient-to-br from-[#13171F] to-[#0A0D12] border border-white/10 rounded-xl p-2.5 text-center shadow-inner">
                <div className="w-6 h-6 rounded-lg bg-[#6FCF45]/15 border border-[#6FCF45]/30 text-[#6FCF45] flex items-center justify-center mx-auto mb-1">
                  <Briefcase className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs font-bold text-white font-mono">{totalTripsCount}</div>
                <span className="text-[9px] text-[#A8B5AF] block leading-tight font-medium">Trips</span>
              </div>

              <div className="bg-gradient-to-br from-[#13171F] to-[#0A0D12] border border-white/10 rounded-xl p-2.5 text-center shadow-inner">
                <div className="w-6 h-6 rounded-lg bg-[#6FCF45]/15 border border-[#6FCF45]/30 text-[#6FCF45] flex items-center justify-center mx-auto mb-1">
                  <Heart className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs font-bold text-white font-mono">{totalWishlistCount}</div>
                <span className="text-[9px] text-[#A8B5AF] block leading-tight font-medium">Wishlist</span>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex items-center justify-between text-[11px] mb-1.5">
                <span className="font-bold text-white">Next Level: Explorer Elite</span>
                <span className="text-[#6FCF45] font-mono font-bold">{currentPoints} / 1000 PTS</span>
              </div>
              <div className="w-full bg-[#080A0D] h-2.5 rounded-full overflow-hidden border border-white/10 p-0.5 shadow-inner">
                <div
                  className="bg-gradient-to-r from-[#6FCF45] to-[#8AE863] h-full rounded-full transition-all duration-500 shadow-[0_0_8px_#6FCF45]"
                  style={{ width: `${Math.min(100, (currentPoints / 1000) * 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-[#A8B5AF] mt-2">
                Earn {Math.max(0, 1000 - currentPoints)} more points to unlock VIP rewards!
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1F242D] via-[#161922] to-[#0E1117] border border-white/10 p-5 sm:p-6 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-2px_6px_rgba(0,0,0,0.6)] text-left">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
            
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-1.5 rounded-lg bg-amber-400/15 border border-amber-400/30 text-amber-400">
                <Zap className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-white tracking-tight font-heading">
                Quick Actions
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/custom-trip"
                className="flex flex-col items-start p-3 rounded-xl bg-gradient-to-b from-[#222731] via-[#171B22] to-[#0E1117] border-t border-x border-white/15 border-b-[4px] border-b-black/80 hover:border-b-[5px] active:border-b-[1px] active:translate-y-1 transition-all duration-150 group shadow-[0_6px_14px_rgba(0,0,0,0.5)] cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-[#13171F] border border-white/10 flex items-center justify-center mb-2 shadow-inner">
                  <Compass className="w-4 h-4 text-[#6FCF45]" />
                </div>
                <span className="text-xs font-bold text-white group-hover:text-[#6FCF45] transition-colors leading-tight">
                  Plan a New Trip
                </span>
              </Link>

              <button
                onClick={() => setActiveTab('customQuotes')}
                className="flex flex-col items-start p-3 rounded-xl bg-gradient-to-b from-[#222731] via-[#171B22] to-[#0E1117] border-t border-x border-white/15 border-b-[4px] border-b-black/80 hover:border-b-[5px] active:border-b-[1px] active:translate-y-1 transition-all duration-150 group shadow-[0_6px_14px_rgba(0,0,0,0.5)] cursor-pointer text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-[#13171F] border border-white/10 flex items-center justify-center mb-2 shadow-inner">
                  <FileText className="w-4 h-4 text-[#6FCF45]" />
                </div>
                <span className="text-xs font-bold text-white group-hover:text-[#6FCF45] transition-colors leading-tight">
                  Custom Quote
                </span>
              </button>

              <Link
                to="/tours"
                className="flex flex-col items-start p-3 rounded-xl bg-gradient-to-b from-[#222731] via-[#171B22] to-[#0E1117] border-t border-x border-white/15 border-b-[4px] border-b-black/80 hover:border-b-[5px] active:border-b-[1px] active:translate-y-1 transition-all duration-150 group shadow-[0_6px_14px_rgba(0,0,0,0.5)] cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-[#13171F] border border-white/10 flex items-center justify-center mb-2 shadow-inner">
                  <Gift className="w-4 h-4 text-[#6FCF45]" />
                </div>
                <span className="text-xs font-bold text-white group-hover:text-[#6FCF45] transition-colors leading-tight">
                  Browse Packages
                </span>
              </Link>

              <Link
                to="/destinations"
                className="flex flex-col items-start p-3 rounded-xl bg-gradient-to-b from-[#222731] via-[#171B22] to-[#0E1117] border-t border-x border-white/15 border-b-[4px] border-b-black/80 hover:border-b-[5px] active:border-b-[1px] active:translate-y-1 transition-all duration-150 group shadow-[0_6px_14px_rgba(0,0,0,0.5)] cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-[#13171F] border border-white/10 flex items-center justify-center mb-2 shadow-inner">
                  <MapPin className="w-4 h-4 text-[#6FCF45]" />
                </div>
                <span className="text-xs font-bold text-white group-hover:text-[#6FCF45] transition-colors leading-tight">
                  Destinations
                </span>
              </Link>
            </div>
          </div>

          {/* Inspirational Quote Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1F242D] via-[#161922] to-[#0E1117] border border-white/10 p-5 sm:p-6 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-2px_6px_rgba(0,0,0,0.6)] text-left flex-1 flex flex-col justify-center min-h-[105px]">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#6FCF45]/60 to-transparent" />
            
            <span className="text-3xl text-[#6FCF45] font-serif block leading-none mb-1">
              “
            </span>
            <p className="text-xs text-white/90 italic leading-relaxed mb-3">
              The world is a book, and those who do not travel read only one page.
            </p>
            <span className="text-[11px] text-[#A8B5AF] font-bold block">
              — Saint Augustine
            </span>

            <img
              src={mountainShapeImg}
              alt=""
              className="w-36 h-24 sm:w-44 sm:h-28 object-contain opacity-10 absolute -bottom-3 -right-3 pointer-events-none select-none"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileDashboardTab

