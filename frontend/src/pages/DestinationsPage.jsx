import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  MapPin,
  Sparkles,
  Star,
  Compass,
  ArrowUpRight,
  Sun,
  Calendar,
  Layers,
  ArrowRight,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  Globe,
  Mountain,
  Palmtree,
  Landmark,
} from 'lucide-react'
import { motion } from 'framer-motion'
import api from '../services/api'
import destinationService from '../services/destinationService'
import { DESTINATIONS } from '../utils/mockData'
import Button from '../components/Button'
import destinationBg from '../assets/images/destination_bg.jpg'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'

export const DestinationsPage = () => {
  const [destinations, setDestinations] = useState(DESTINATIONS)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState(null)
  const [selectedRegion, setSelectedRegion] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('featured')
  const [visibleCount, setVisibleCount] = useState(8)

  React.useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await destinationService.getAll()
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((d) => ({
            id: d._id || d.id,
            slug: d.slug || d.id || '',
            name: d.title || d.name || '',
            country: d.country || '',
            region: d.region || 'All',
            tagline: d.category || d.tagline || '',
            description: d.description || '',
            image: d.image || '',
            toursCount: d.reviewsCount || d.toursCount || 0,
            startingPrice: d.startingPrice || 0,
            rating: d.rating || 0,
            bestSeason: d.bestTimeToVisit || d.bestTime || d.bestSeason || '',
          }))
          setDestinations(mapped)
        }
      } catch (error) {
        console.warn('Fallback destinations on DestinationsPage:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDestinations()
  }, [])

  const regions = [
    { label: 'All Destinations', value: 'All', icon: Layers },
    { label: 'India & Subcontinent', value: 'India', icon: Compass },
    { label: 'Asia & Himalayas', value: 'Asia', icon: Mountain },
    { label: 'Europe & Alpine', value: 'Europe', icon: Landmark },
    { label: 'Tropical Islands', value: 'Islands', icon: Palmtree },
    { label: 'Middle East & Africa', value: 'Middle East', icon: Sun },
    { label: 'Americas & Oceania', value: 'Americas', icon: Globe },
  ]

  // Reset pagination to 8 whenever filters change
  const handleRegionChange = (reg) => {
    setSelectedRegion(reg)
    setVisibleCount(8)
  }

  const handleSearchChange = (val) => {
    setSearchQuery(val)
    setVisibleCount(8)
  }

  const handleSortChange = (val) => {
    setSortBy(val)
    setVisibleCount(8)
  }

  const filteredDestinations = useMemo(() => {
    return destinations.filter((d) => {
      const matchesRegion =
        selectedRegion === 'All' ||
        (selectedRegion === 'India' && (d.country === 'India' || d.country === 'Nepal' || d.country === 'Sri Lanka')) ||
        (selectedRegion === 'Asia' && (d.region === 'Asia' || d.country === 'India' || d.country === 'Nepal')) ||
        (selectedRegion === 'Islands' && (d.region === 'Islands' || d.country === 'Sri Lanka' || d.id === 'andaman' || d.id === 'goa')) ||
        (selectedRegion === 'Middle East' && (d.region === 'Middle East' || d.region === 'Africa')) ||
        (selectedRegion === 'Americas' && (d.region === 'Americas' || d.country === 'USA' || d.country === 'Australia' || d.country === 'Peru' || d.country === 'New Zealand')) ||
        d.region === selectedRegion
      const sq = searchQuery?.toLowerCase() || ''
      const matchesSearch =
          (d.name?.toLowerCase()?.includes(sq) || false) ||
          (d.country?.toLowerCase()?.includes(sq) || false) ||
          (d.tagline?.toLowerCase()?.includes(sq) || false) ||
          (d.description?.toLowerCase()?.includes(sq) || false)
      return matchesRegion && matchesSearch
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.startingPrice - b.startingPrice
      if (sortBy === 'price-high') return b.startingPrice - a.startingPrice
      if (sortBy === 'tours') return b.toursCount - a.toursCount
      return b.rating - a.rating // default featured by rating
    })
  }, [destinations, selectedRegion, searchQuery, sortBy])

  const displayedDestinations = useMemo(() => {
    return filteredDestinations.slice(0, visibleCount)
  }, [filteredDestinations, visibleCount])

  return (
    <div className="bg-[#FAF8F2] text-[#13251F] min-h-screen select-none">
      {/* 1. Full-Width Cinematic Hero Header (Standard Uniform Height & Left-Aligned) */}
      <div className="relative w-full bg-[#071A16] text-white pt-28 sm:pt-36 pb-12 sm:pb-16 min-h-[560px] sm:min-h-[590px] lg:min-h-[610px] flex flex-col justify-center px-4 sm:px-6 lg:px-12 overflow-hidden shadow-2xl border-b border-white/10 mb-10 sm:mb-12">
        {/* Background Destination Banner Image Asset (100% Edge-to-Edge) */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={destinationBg}
            alt="Global Expeditions Banner"
            className="w-full h-full object-cover object-center scale-105"
          />
          {/* Lighter, More Transparent Layered Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#071A16]/90 via-black/35 to-[#071A16]/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071A16]/75 via-[#071A16]/35 to-transparent" />
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
              <span>GLOBAL EXPEDITIONS &amp; SANCTUARIES</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading leading-[1.1] text-left drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              Curated World <br />
              <span className="text-[#6FCF45]">Destinations.</span>
            </h1>

            <p className="mt-3.5 text-xs sm:text-sm md:text-base text-white/90 max-w-2xl leading-relaxed font-normal text-left drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              From snow-crowned Himalayan valleys and secluded Maldivian atolls to private Parisian salons and ancient Kyoto zen temples—explore handcrafted sanctuaries across the earth.
            </p>
          </div>

          {/* Search Bar & Region Filter Strip */}
          <div className="mt-8 pt-6 border-t border-white/15 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <Search className="w-4 h-4 text-[#A8B5AF] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search by destination name, country or region..."
                className="w-full bg-[#0B241E]/90 border border-white/20 rounded-[8px] pl-11 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-[#A8B5AF]/70 focus:outline-none focus:border-[#6FCF45] shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#A8B5AF] hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sleek Integrated Sort Dropdown Pill */}
            <div className="relative self-start md:self-auto shrink-0 group">
              <div className="relative flex items-center">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#6FCF45] absolute left-3.5 pointer-events-none z-10" />
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="appearance-none bg-[#0B241E]/95 hover:bg-[#12382E] border border-white/20 hover:border-[#6FCF45]/60 rounded-full pl-9 pr-9 py-2.5 text-xs font-semibold text-white tracking-wide cursor-pointer focus:outline-none focus:border-[#6FCF45] focus:ring-1 focus:ring-[#6FCF45] transition-all duration-200 shadow-md backdrop-blur-md"
                >
                  <option value="featured" className="bg-[#071A16] text-white">Top Rated &amp; Featured</option>
                  <option value="price-low" className="bg-[#071A16] text-white">Price: Low to High</option>
                  <option value="price-high" className="bg-[#071A16] text-white">Price: High to Low</option>
                  <option value="tours" className="bg-[#071A16] text-white">Most Expeditions</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#6FCF45] absolute right-3.5 pointer-events-none transition-transform group-hover:translate-y-0.5 duration-200" />
              </div>
            </div>
          </div>

          {/* Region Tabs with Lucide Library Icons */}
          <div className="mt-5 flex flex-wrap items-center gap-2 pt-2">
            {regions.map((reg) => {
              const Icon = reg.icon
              const isActive = selectedRegion === reg.value

              return (
                <button
                  key={reg.value}
                  onClick={() => handleRegionChange(reg.value)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-200 border ${
                    isActive
                      ? 'bg-[#6FCF45] text-[#071A16] border-[#6FCF45] shadow-md shadow-[#6FCF45]/20 font-bold'
                      : 'bg-[#0B241E]/80 text-[#A8B5AF] border-white/15 hover:border-white/40 hover:text-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#071A16]' : 'text-[#6FCF45]'}`} />
                  <span>{reg.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
      {/* 2. Main Body Container with generous bottom spacing */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pb-28 sm:pb-36">
        {/* Results Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#5C6E67] font-heading">
              Showing <strong className="text-[#13251F]">{displayedDestinations.length}</strong> of{' '}
              <strong className="text-[#13251F]">{filteredDestinations.length}</strong> Destinations
            </span>
            {selectedRegion !== 'All' && (
              <span className="text-xs px-2.5 py-0.5 rounded bg-[#EBF5EA] text-[#2E4A35] font-bold">
                {selectedRegion}
              </span>
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 pt-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-white rounded-[18px] overflow-hidden border border-[#E5E0D5] h-[380px] animate-pulse shadow-[0_3px_15px_rgba(0,0,0,0.04)]">
                <div className="h-[200px] sm:h-[210px] w-full bg-[#E5E0D5]/60"></div>
                <div className="p-4 sm:p-5 flex flex-col justify-between h-[170px]">
                  <div>
                    <div className="h-3 bg-[#E5E0D5]/70 rounded w-full mb-2.5"></div>
                    <div className="h-3 bg-[#E5E0D5]/70 rounded w-2/3"></div>
                  </div>
                  <div className="space-y-3 mt-4">
                    <div className="h-2.5 bg-[#E5E0D5]/70 rounded w-1/2"></div>
                    <div className="h-2.5 bg-[#E5E0D5]/70 rounded w-3/4"></div>
                  </div>
                  <div className="flex justify-between mt-auto">
                    <div className="h-5 bg-[#E5E0D5]/70 rounded w-16"></div>
                    <div className="h-7 bg-[#E5E0D5]/70 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : errorMsg ? (
          <div className="text-center py-20 bg-red-50 text-red-600 rounded-[20px] max-w-lg mx-auto p-8">
            <h4 className="text-lg font-bold">Error Loading Destinations</h4>
            <p className="text-xs mt-2">{errorMsg}</p>
          </div>
        ) : (
          <>
            {/* 3. Luxury Destination Cards Grid (4 Columns Per Row) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {displayedDestinations.map((dest, idx) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -50px 0px" }}
              transition={{ duration: 0.4, delay: idx * 0.05, ease: 'easeOut' }}
              className="group bg-white rounded-[18px] overflow-hidden border border-[#E5E0D5] shadow-[0_3px_15px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.09)] transition-all duration-400 flex flex-col justify-between"
            >
              {/* Card Image Banner */}
              <div className="relative h-[200px] sm:h-[210px] w-full overflow-hidden bg-[#071A16]">
                <LazyLoadImage
                  src={dest.image}
                  alt={`${dest.name}, ${dest.country}`}
                  effect="blur"
                  wrapperClassName="w-full h-full"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                {/* Rating Badge */}
                <div className="absolute top-3.5 right-3.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/15">
                  <Star className="w-3 h-3 fill-[#6FCF45] text-[#6FCF45]" />
                  <span className="text-xs font-bold text-white leading-none">{dest.rating}</span>
                </div>

                {/* Region Tag */}
                <div className="absolute top-3.5 left-3.5 bg-[#071A16]/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8B5AF]">
                    {dest.region}
                  </span>
                </div>

                {/* Destination Name on Image */}
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-lg font-bold text-white font-heading leading-tight drop-shadow-md">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-[#A8B5AF] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#6FCF45]" />
                    {dest.country}
                  </p>
                </div>
              </div>

              {/* Card Details Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <p className="text-xs text-[#5C6E67] line-clamp-2 leading-relaxed mb-4">
                  {dest.tagline}
                </p>

                {/* Meta Highlights */}
                <div className="pt-3 border-t border-[#13251F]/5 space-y-2 mb-4">
                  <div className="flex items-center justify-between text-[11px] text-[#5C6E67]">
                    <span className="flex items-center gap-1">
                      <Sun className="w-3 h-3 text-[#4F8F45]" /> Best Season
                    </span>
                    <strong className="text-[#13251F] font-semibold">{dest.bestSeason}</strong>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#5C6E67]">
                    <span className="flex items-center gap-1">
                      <Compass className="w-3 h-3 text-[#4F8F45]" /> Curated Tours
                    </span>
                    <strong className="text-[#13251F] font-semibold">{dest.toursCount} Packages</strong>
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div className="flex items-center justify-between pt-3 border-t border-[#13251F]/5 mt-auto">
                  <div>
                    <span className="text-[10px] text-[#7A8B84] block uppercase font-medium tracking-wider">
                      From
                    </span>
                    <span className="text-base sm:text-lg font-extrabold text-[#13251F] font-heading">
                      ₹{dest.startingPrice?.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <Link
                    to={`/destinations/${dest.slug}`}
                    className="inline-flex items-center gap-1 bg-[#2E4A35] text-white hover:bg-[#1E3324] px-3.5 py-1.5 rounded-[6px] text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm active:scale-95"
                  >
                    <span>EXPLORE</span>
                    <ArrowRight className="w-3 h-3 text-[#6FCF45]" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More Pagination Trigger */}
        {visibleCount < filteredDestinations.length && (
          <div className="mt-12 sm:mt-16 flex flex-col items-center justify-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 8)}
              className="inline-flex items-center gap-2.5 bg-[#071A16] text-[#FAF8F2] hover:bg-[#13251F] border border-white/15 px-7 py-3 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg hover:shadow-xl hover:border-[#6FCF45]/50 transition-all duration-300 group active:scale-95"
            >
              <span>SEE MORE DESTINATIONS</span>
              <span className="w-5 h-5 rounded-full bg-[#6FCF45]/20 flex items-center justify-center text-[#6FCF45] text-xs font-bold group-hover:translate-y-0.5 transition-transform duration-300">
                ↓
              </span>
            </button>
            <span className="text-[11px] text-[#7A8B84] mt-3 font-medium">
              Showing {displayedDestinations.length} of {filteredDestinations.length} destinations
            </span>
          </div>
        )}

        {/* Empty Search State */}
        {filteredDestinations.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[20px] border border-[#E5E0D5] shadow-sm max-w-lg mx-auto p-8">
            <Compass className="w-12 h-12 text-[#4F8F45] mx-auto mb-3 opacity-60" />
            <h4 className="text-lg font-bold text-[#13251F] font-heading">No Destinations Found</h4>
            <p className="text-xs text-[#5C6E67] mt-1.5 leading-relaxed">
              We couldn't find any destinations matching "{searchQuery}". Try selecting another region or clear search filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedRegion('All')
              }}
              className="mt-5 px-4 py-2 bg-[#2E4A35] text-white rounded-[6px] text-xs font-bold uppercase tracking-wider"
            >
              Reset All Filters
            </button>
          </div>
        )}
        </>
        )}

        {/* 4. Bottom Custom Destination Architect Strip (Spacious & Distinct) */}
        <div className="mt-20 sm:mt-24 bg-[#071A16] text-white rounded-[24px] p-8 sm:p-12 lg:p-14 relative overflow-hidden shadow-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#6FCF45] font-bold mb-2">
              <Sparkles className="w-4 h-4" />
              <span>CUSTOM GLOBAL ARCHITECTURE</span>
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-heading tracking-tight leading-tight">
              Seeking a destination not listed here?
            </h3>
            <p className="text-xs sm:text-sm text-[#A8B5AF] mt-2.5 leading-relaxed">
              Our regional curators hold private access across 80+ nations. From Antarctic fly-overs to private Polynesian islands, we design custom itineraries anywhere on earth.
            </p>
          </div>

          <Button
            to="/custom-trip"
            variant="primary"
            size="lg"
            icon={true}
            className="shrink-0 text-xs sm:text-sm px-8 h-[48px] shadow-lg shadow-[#6FCF45]/20"
          >
            BUILD CUSTOM TRIP
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DestinationsPage
