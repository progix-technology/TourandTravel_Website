import React, { useState, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Sparkles,
  ArrowRight,
  Clock,
  Users,
  Star,
  Globe,
  Mountain,
  Palmtree,
  Landmark,
  Compass,
  Layers,
  ChevronDown,
} from 'lucide-react'
import { motion } from 'framer-motion'
import TourCard from '../components/TourCard'
import { TOURS } from '../utils/mockData'
import tourService from '../services/tourService'
import Button from '../components/Button'
import signatureBannerBg from '../assets/images/signature_packages_banner.jpg'

export const ToursPage = () => {
  const [searchParams] = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [sortBy, setSortBy] = useState('popular')
  const [visibleCount, setVisibleCount] = useState(8)
  const [toursList, setToursList] = useState(TOURS)
  const [loading, setLoading] = useState(true)

  React.useEffect(() => {
    const loadTours = async () => {
      try {
        const data = await tourService.getAll()
        if (data && data.length > 0) {
          setToursList(data)
        }
      } catch (err) {
        console.warn('Using fallback tours:', err)
      } finally {
        setLoading(false)
      }
    }
    loadTours()

    const handleUpdated = () => {
      loadTours()
    }
    window.addEventListener('tt_tours_updated', handleUpdated)
    return () => {
      window.removeEventListener('tt_tours_updated', handleUpdated)
    }
  }, [])

  const categories = useMemo(
    () => [
      { label: `All Packages (${toursList.length})`, value: 'All', icon: Layers },
      { label: 'India & Himalayas', value: 'india', icon: Compass },
      { label: 'Global Luxury', value: 'global', icon: Globe },
      { label: 'Tropical & Beach', value: 'beach', icon: Palmtree },
      { label: 'Culture & Heritage', value: 'culture', icon: Landmark },
      { label: 'Alpine & Nature', value: 'nature', icon: Mountain },
    ],
    [toursList.length]
  )

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat)
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

  const filteredTours = useMemo(() => {
    return toursList
      .filter((t) => {
        const q = searchQuery.toLowerCase().trim()
        let matchesSearch = !q
        if (q) {
          matchesSearch =
            t.title?.toLowerCase().includes(q) ||
            t.subtitle?.toLowerCase().includes(q) ||
            t.destination?.toLowerCase().includes(q) ||
            t.destinationSlug?.toLowerCase().includes(q) ||
            t.category?.toLowerCase().includes(q) ||
            t.overview?.toLowerCase().includes(q) ||
            (Array.isArray(t.highlights) && t.highlights.some((h) => h.toLowerCase().includes(q))) ||
            (Array.isArray(t.itinerary) &&
              t.itinerary.some(
                (item) =>
                  item.title?.toLowerCase().includes(q) || item.desc?.toLowerCase().includes(q)
              ))

          // Intelligent destination aliases
          if (!matchesSearch) {
            if (
              (q.includes('taj') || q.includes('agra')) &&
              (t.destinationSlug?.includes('agra') || t.title?.toLowerCase().includes('taj'))
            ) {
              matchesSearch = true
            }
            if (
              (q.includes('udaipur') || q.includes('jaipur') || q.includes('jaisalmer') || q.includes('jodhpur')) &&
              (t.destinationSlug?.includes('rajasthan') || t.title?.toLowerCase().includes('rajasthan'))
            ) {
              matchesSearch = true
            }
            if (
              (q.includes('alleppey') || q.includes('munnar') || q.includes('backwater')) &&
              (t.destinationSlug?.includes('kerala') || t.title?.toLowerCase().includes('kerala'))
            ) {
              matchesSearch = true
            }
            if (
              (q.includes('manali') || q.includes('shimla') || q.includes('spiti') || q.includes('rohtang')) &&
              (t.destinationSlug?.includes('himachal') || t.title?.toLowerCase().includes('himachal'))
            ) {
              matchesSearch = true
            }
          }
        }

        let matchesCat = true
        if (selectedCategory === 'india') {
          matchesCat =
            ['kashmir', 'rajasthan', 'kerala', 'goa', 'ladakh', 'nepal', 'agra'].includes(
              t.destinationSlug
            ) ||
            t.destination?.toLowerCase().includes('india') ||
            t.destination?.toLowerCase().includes('kerala') ||
            t.destination?.toLowerCase().includes('nepal')
        } else if (selectedCategory === 'global') {
          matchesCat = [
            'switzerland',
            'paris',
            'tokyo',
            'iceland',
            'amalfi-coast',
            'dubai',
            'rome',
            'london',
          ].includes(t.destinationSlug)
        } else if (selectedCategory === 'beach') {
          matchesCat = ['maldives', 'goa', 'bali', 'santorini', 'amalfi-coast', 'andaman'].includes(
            t.destinationSlug
          )
        } else if (selectedCategory === 'culture') {
          matchesCat = ['rajasthan', 'paris', 'tokyo', 'nepal', 'varanasi', 'rome'].includes(
            t.destinationSlug
          )
        } else if (selectedCategory === 'nature') {
          matchesCat = [
            'kashmir',
            'switzerland',
            'bali',
            'ladakh',
            'iceland',
            'meghalaya',
            'himachal',
          ].includes(t.destinationSlug)
        }

        return matchesSearch && matchesCat
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.startingPrice - b.startingPrice
        if (sortBy === 'price-high') return b.startingPrice - a.startingPrice
        if (sortBy === 'duration') return b.days - a.days
        return b.rating - a.rating // default popular / top rated
      })
  }, [toursList, selectedCategory, searchQuery, sortBy])

  const displayedTours = useMemo(() => {
    return filteredTours.slice(0, visibleCount)
  }, [filteredTours, visibleCount])

  return (
    <div className="bg-[#FAF8F2] text-[#13251F] min-h-screen select-none">
      {/* 1. Full-Width Cinematic Hero Header */}
      <div className="relative w-full bg-[#071A16] text-white pt-24 sm:pt-36 pb-8 sm:pb-16 min-h-[400px] sm:min-h-[560px] lg:min-h-[610px] flex flex-col justify-center px-4 sm:px-6 lg:px-12 overflow-hidden shadow-2xl border-b border-white/10 mb-8 sm:mb-12">
        {/* Background Signature Packages Banner Image Asset (100% Edge-to-Edge) */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={signatureBannerBg}
            alt="Signature Expeditions Banner"
            className="w-full h-full object-cover object-center scale-105"
          />
          {/* Transparent Layered Gradient Overlays for high-contrast left-aligned readability */}
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
            <div className="inline-flex items-center gap-2 mb-2 sm:mb-3 text-[10px] sm:text-xs uppercase tracking-[0.25em] font-bold text-[#6FCF45] font-heading drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
              <span className="w-4 sm:w-6 h-[2px] bg-[#6FCF45]" />
              <span>EXPEDITIONS CATALOG</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading leading-[1.1] text-left drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              Signature Tour <br />
              <span className="text-[#6FCF45]">Packages.</span>
            </h1>

            <p className="mt-2.5 sm:mt-3.5 text-xs sm:text-sm md:text-base text-white/90 max-w-2xl leading-relaxed font-normal text-left drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Immersive, slow-paced luxury journeys crafted with private curators, 5-star heritage chalets, and VIP access across extraordinary world lands.
            </p>
          </div>

          {/* Search Bar & Sort Dropdown */}
          <div className="mt-4 sm:mt-8 pt-4 sm:pt-6 border-t border-white/15 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#A8B5AF] absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search packages by title, country or itinerary..."
                className="w-full bg-[#0B241E]/90 border border-white/20 rounded-[8px] pl-9 sm:pl-11 pr-4 py-2 sm:py-2.5 text-xs sm:text-sm text-white placeholder:text-[#A8B5AF]/70 focus:outline-none focus:border-[#6FCF45] shadow-inner"
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
                <SlidersHorizontal className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#6FCF45] absolute left-3 sm:left-3.5 pointer-events-none z-10" />
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="appearance-none bg-[#0B241E]/95 hover:bg-[#12382E] border border-white/20 hover:border-[#6FCF45]/60 rounded-full pl-8 sm:pl-9 pr-8 sm:pr-9 py-1.5 sm:py-2.5 text-[11px] sm:text-xs font-semibold text-white tracking-wide cursor-pointer focus:outline-none focus:border-[#6FCF45] focus:ring-1 focus:ring-[#6FCF45] transition-all duration-200 shadow-md backdrop-blur-md"
                >
                  <option value="popular" className="bg-[#071A16] text-white">Top Rated &amp; Featured</option>
                  <option value="price-low" className="bg-[#071A16] text-white">Price: Low to High</option>
                  <option value="price-high" className="bg-[#071A16] text-white">Price: High to Low</option>
                  <option value="duration" className="bg-[#071A16] text-white">Longest Duration</option>
                </select>
                <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#6FCF45] absolute right-3 sm:right-3.5 pointer-events-none transition-transform group-hover:translate-y-0.5 duration-200" />
              </div>
            </div>
          </div>

          {/* Category Filter Pills Inside Banner */}
          <div className="mt-3 sm:mt-5 flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1 sm:pt-2">
            {categories.map((cat) => {
              const Icon = cat.icon
              const isActive = selectedCategory === cat.value

              return (
                <button
                  key={cat.value}
                  onClick={() => handleCategoryChange(cat.value)}
                  className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-[9.5px] sm:text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-200 border cursor-pointer active:scale-95 ${
                    isActive
                      ? 'bg-[#6FCF45] text-[#071A16] border-[#6FCF45] shadow-md shadow-[#6FCF45]/20 font-bold'
                      : 'bg-[#0B241E]/80 text-[#A8B5AF] border-white/15 hover:border-white/40 hover:text-white'
                  }`}
                >
                  <Icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 ${isActive ? 'text-[#071A16]' : 'text-[#6FCF45]'}`} />
                  <span>{cat.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pb-28 sm:pb-36">
        {/* Results Count Bar */}
        <div className="flex items-center justify-between mb-6 text-xs text-[#5C6E67] font-semibold uppercase tracking-wider">
          <span>
            Showing {displayedTours.length} of {filteredTours.length} Signature Tour Packages
          </span>
        </div>

        {/* 4. 4-Column Luxury Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-[#FAF8F2] border border-[#E5E0D5] rounded-[6px] overflow-hidden shadow-sm h-[420px] animate-pulse">
                <div className="h-[220px] w-full bg-[#E5E0D5]/60"></div>
                <div className="p-5 flex-1 flex flex-col justify-between h-[200px]">
                  <div>
                    <div className="h-3 bg-[#E5E0D5]/70 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-[#E5E0D5]/70 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-[#E5E0D5]/70 rounded w-1/2"></div>
                  </div>
                  <div className="flex justify-between mt-auto pt-4 border-t border-[#E5E0D5]/70">
                    <div>
                      <div className="h-2 bg-[#E5E0D5]/70 rounded w-12 mb-2"></div>
                      <div className="h-5 bg-[#E5E0D5]/70 rounded w-20"></div>
                    </div>
                    <div className="h-8 bg-[#E5E0D5]/70 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredTours.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#13251F]/10 p-8 sm:p-12 shadow-sm max-w-2xl mx-auto my-8">
            <div className="w-14 h-14 rounded-2xl bg-[#071A16] text-[#6FCF45] flex items-center justify-center mx-auto mb-4 shadow-md">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#071A16] font-heading mb-2">
              {searchQuery
                ? `No standard packages found for "${searchQuery}"`
                : 'No tour packages match your current filters'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed mb-6">
              Our luxury travel concierges craft 100% personalized, bespoke private itineraries for any destination worldwide.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {searchQuery && (
                <Link
                  to={`/custom-trip?destination=${encodeURIComponent(searchQuery)}`}
                  className="px-6 py-2.5 bg-[#071A16] hover:bg-[#0B241E] text-[#6FCF45] text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Plan Custom Tour for {searchQuery}</span>
                </Link>
              )}
              <button
                type="button"
                onClick={() => {
                  handleCategoryChange('All')
                  handleSearchChange('')
                }}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-full transition-all"
              >
                Reset Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {displayedTours.map((tour, idx) => (
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

        {/* 5. See More / See All Packages Button */}
        {visibleCount < filteredTours.length && !loading && (
          <div className="mt-12 sm:mt-16 flex flex-col items-center justify-center">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setVisibleCount((prev) => prev + 8)}
                className="inline-flex items-center gap-2.5 bg-[#13251F] text-[#FAF8F2] hover:bg-[#2E4A35] px-7 py-3 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg hover:shadow-xl transition-all duration-300 group active:scale-95"
              >
                <span>SEE MORE PACKAGES</span>
                <span className="w-5 h-5 rounded-full bg-[#6FCF45]/20 flex items-center justify-center text-[#6FCF45] text-xs font-bold group-hover:translate-y-0.5 transition-transform duration-300">
                  ↓
                </span>
              </button>

              <button
                onClick={() => setVisibleCount(filteredTours.length)}
                className="inline-flex items-center gap-2 bg-white text-[#13251F] hover:bg-[#FAF8F2] border border-[#13251F]/15 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm hover:shadow-md transition-all duration-300 active:scale-95"
              >
                <span>SEE ALL ({filteredTours.length})</span>
              </button>
            </div>

            <span className="text-[11px] text-[#7A8B84] mt-3 font-medium">
              Showing {displayedTours.length} of {filteredTours.length} signature packages
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ToursPage
