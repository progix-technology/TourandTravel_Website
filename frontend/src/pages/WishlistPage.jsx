import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Heart,
  Compass,
  Trash2,
  ArrowRight,
  Search,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import { TOURS } from '../utils/mockData'
import TourCard from '../components/TourCard'

export const WishlistPage = () => {
  const { wishlist, clearWishlist } = useWishlist()
  const { isAuthenticated } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('popular')

  // Get all saved tours
  const allSavedTours = useMemo(() => {
    return TOURS.filter((t) => wishlist.includes(t.id) || wishlist.includes(t.slug))
  }, [wishlist])

  // Filter & sort saved tours
  const filteredTours = useMemo(() => {
    return allSavedTours
      .filter((t) => {
        const q = searchQuery.toLowerCase().trim()
        if (!q) return true
        return (
          t.title?.toLowerCase().includes(q) ||
          t.subtitle?.toLowerCase().includes(q) ||
          t.destination?.toLowerCase().includes(q) ||
          t.category?.toLowerCase().includes(q) ||
          t.overview?.toLowerCase().includes(q)
        )
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.startingPrice - b.startingPrice
        if (sortBy === 'price-high') return b.startingPrice - a.startingPrice
        if (sortBy === 'duration') return b.days - a.days
        return b.rating - a.rating
      })
  }, [allSavedTours, searchQuery, sortBy])

  return (
    <div className="bg-[#FAF8F2] text-[#13251F] min-h-screen select-none">
      {/* 1. Full-Width Cinematic Hero Header (Exact Same Standard Layout as Tours, Destinations & About) */}
      <div className="relative w-full bg-[#071A16] text-white pt-28 sm:pt-36 pb-12 sm:pb-16 min-h-[560px] sm:min-h-[590px] lg:min-h-[610px] flex flex-col justify-center px-4 sm:px-6 lg:px-12 overflow-hidden shadow-2xl border-b border-white/10 mb-10 sm:mb-12">
        {/* Background Banner Image Asset (100% Edge-to-Edge) */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2000&q=85"
            alt="Saved Expeditions Wishlist Banner"
            className="w-full h-full object-cover object-center scale-105"
          />
          {/* Transparent Layered Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#071A16]/90 via-black/35 to-[#071A16]/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071A16]/85 via-[#071A16]/45 to-transparent" />
          <div className="absolute inset-0 bg-black/15" />
        </div>

        {/* Ambient emerald radial glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#6FCF45]/15 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-0 left-10 w-[500px] h-[500px] bg-[#12382E]/40 rounded-full blur-3xl pointer-events-none z-0" />

        {/* Left-Aligned Constrained Content Container */}
        <div className="max-w-[1440px] w-full mx-auto relative z-10 text-left">
          <div className="max-w-3xl text-left">
            <div className="inline-flex items-center gap-2.5 mb-3 text-xs uppercase tracking-[0.25em] font-bold text-[#6FCF45] font-heading drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
              <span className="w-6 h-[2px] bg-[#6FCF45]" />
              <span>SAVED EXPEDITIONS PORTFOLIO</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading leading-[1.1] text-left drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              My Saved <br />
              <span className="text-[#6FCF45]">Wishlist.</span>
            </h1>

            <p className="mt-3.5 text-xs sm:text-sm md:text-base text-white/90 max-w-2xl leading-relaxed font-normal text-left drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Your curated private collection of signature expeditions, luxury retreats, and bespoke itineraries saved for your upcoming journeys.
            </p>
          </div>

          {/* Search Bar & Action Strip */}
          <div className="mt-8 pt-6 border-t border-white/15 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative w-full md:max-w-md">
              <Search className="w-4 h-4 text-[#A8B5AF] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search saved packages by title or destination..."
                className="w-full bg-[#0B241E]/90 border border-white/20 rounded-[8px] pl-11 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-[#A8B5AF]/70 focus:outline-none focus:border-[#6FCF45] shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#A8B5AF] hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Sleek Integrated Sort Dropdown Pill */}
              <div className="relative self-start md:self-auto shrink-0 group">
                <div className="relative flex items-center">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#6FCF45] absolute left-3.5 pointer-events-none z-10" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-[#0B241E]/95 hover:bg-[#12382E] border border-white/20 hover:border-[#6FCF45]/60 rounded-full pl-9 pr-9 py-2.5 text-xs font-semibold text-white tracking-wide cursor-pointer focus:outline-none focus:border-[#6FCF45] focus:ring-1 focus:ring-[#6FCF45] transition-all duration-200 shadow-md backdrop-blur-md"
                  >
                    <option value="popular" className="bg-[#071A16] text-white">Top Rated &amp; Featured</option>
                    <option value="price-low" className="bg-[#071A16] text-white">Price: Low to High</option>
                    <option value="price-high" className="bg-[#071A16] text-white">Price: High to Low</option>
                    <option value="duration" className="bg-[#071A16] text-white">Longest Duration</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-[#6FCF45] absolute right-3.5 pointer-events-none transition-transform group-hover:translate-y-0.5 duration-200" />
                </div>
              </div>

              <Link
                to="/tours"
                className="bg-[#6FCF45] hover:bg-[#5eb937] text-[#071A16] px-6 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all duration-200 shadow-lg shadow-[#6FCF45]/20 active:scale-95 flex items-center gap-2 shrink-0"
              >
                <span>Browse All Tours</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pb-28 sm:pb-36">
        {/* Results Count Bar */}
        {allSavedTours.length > 0 && (
          <div className="flex items-center justify-between mb-6 text-xs text-[#5C6E67] font-semibold uppercase tracking-wider">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6FCF45]/15 border border-[#6FCF45]/30 text-xs font-extrabold uppercase tracking-wider text-[#2E4A35] font-heading">
              <Heart className="w-3.5 h-3.5 fill-[#6FCF45] text-[#6FCF45]" />
              <span>
                Showing {filteredTours.length} of {allSavedTours.length} Saved {allSavedTours.length === 1 ? 'Expedition' : 'Expeditions'}
              </span>
            </div>

            {clearWishlist && allSavedTours.length > 0 && (
              <button
                onClick={clearWishlist}
                className="inline-flex items-center gap-1.5 text-[#A8B5AF] hover:text-red-500 text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Wishlist</span>
              </button>
            )}
          </div>
        )}

        {allSavedTours.length === 0 ? (
          <div className="bg-white border-2 border-[#6FCF45] rounded-[24px] p-12 sm:p-16 text-center max-w-xl mx-auto shadow-[0_10px_35px_rgba(111,207,69,0.08)] relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#6FCF45] via-[#4F8F45] to-[#6FCF45]" />
            <div className="w-16 h-16 rounded-2xl bg-[#6FCF45]/15 border-2 border-[#6FCF45]/40 flex items-center justify-center text-[#2E4A35] mx-auto mb-4">
              <Heart className="w-8 h-8 text-[#4F8F45]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#13251F] font-heading">
              Your Wishlist is Currently Empty
            </h2>
            <p className="text-xs sm:text-sm text-[#5C6E67] mt-2 max-w-sm mx-auto leading-relaxed">
              Explore our curated portfolio of signature journeys and tap the heart icon to save your favorite expeditions.
            </p>
            <div className="mt-6 flex justify-center">
              <Link
                to="/tours"
                className="bg-[#071A16] hover:bg-[#2E4A35] text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-lg flex items-center gap-2"
              >
                <span>Discover Signature Tours</span>
                <Compass className="w-4 h-4 text-[#6FCF45]" />
              </Link>
            </div>
          </div>
        ) : filteredTours.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#13251F]/5 p-8">
            <p className="text-base text-[#5C6E67] font-medium">No saved packages match your search query.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 px-5 py-2 bg-[#2E4A35] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#233A29]"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {filteredTours.map((tour, idx) => (
              <motion.div
                key={tour.id}
                className="h-full flex flex-col"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -50px 0px" }}
                transition={{ duration: 0.4, delay: idx * 0.05, ease: 'easeOut' }}
              >
                <TourCard tour={tour} className="h-full" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default WishlistPage
