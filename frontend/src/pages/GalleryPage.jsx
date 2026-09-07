import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Camera,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Compass,
  ArrowRight,
  Sparkles,
  Eye,
  SlidersHorizontal,
  Globe,
  Layers,
  Mountain,
  Palmtree,
  Sun,
  Landmark,
  Building2,
} from 'lucide-react'
import Button from '../components/Button'
import ImageLoader from '../components/ui/image-loading'
import { GALLERY_PHOTOS } from '../utils/galleryData'
import mediaService from '../services/mediaService'

const INDIA_KEYWORDS = [
  'india',
  'kashmir',
  'ladakh',
  'spiti',
  'himachal',
  'manali',
  'rohtang',
  'sonamarg',
  'pahalgam',
  'agra',
  'uttar pradesh',
  'varanasi',
  'rajasthan',
  'jaipur',
  'udaipur',
  'jaisalmer',
  'jodhpur',
  'amritsar',
  'punjab',
  'delhi',
  'karnataka',
  'hampi',
  'kerala',
  'munnar',
  'alleppey',
  'varkala',
  'meghalaya',
  'dawki',
  'cherrapunji',
  'andaman',
  'havelock',
  'maharashtra',
  'goa',
  'sahyadri',
  'mahabaleshwar',
]

const isIndiaPhoto = (photo) => {
  if (!photo) return false
  if (photo.country && photo.country.trim().toLowerCase() === 'india') return true
  const text = `${photo.location || ''} ${photo.title || ''}`.toLowerCase()
  return INDIA_KEYWORDS.some((kw) => text.includes(kw))
}

const matchCategory = (photo, filterCategory) => {
  if (!photo) return false
  const current = (filterCategory || 'ALL').toUpperCase().trim()
  if (current === 'ALL') return true
  if (current === 'INDIA') return isIndiaPhoto(photo)
  if (current === 'INTERNATIONAL') return !isIndiaPhoto(photo)

  const catStr = (photo.category || '').toUpperCase().trim()
  const text = `${photo.category || ''} ${photo.title || ''} ${photo.location || ''}`.toLowerCase()

  switch (current) {
    case 'MOUNTAINS & ALPINE':
      if (catStr === 'MOUNTAINS & ALPINE' || catStr.includes('MOUNTAIN') || catStr.includes('ALPINE')) return true
      return /(mountain|alpine|peak|glacier|snow|pass|meadow|ridge|valley|himalaya|matterhorn|lauterbrunnen|grindelwald|dolomite|braies|fuji|batur|table mountain|banff|moraine|troms|aurora|yosemite|el capitan)/i.test(text)

    case 'ISLANDS & COASTAL':
      if (catStr === 'ISLANDS & COASTAL' || catStr.includes('ISLAND') || catStr.includes('COASTAL') || catStr.includes('BEACH')) return true
      return /(island|coastal|coast|beach|ocean|sea|lagoon|reef|cliffside|maldives|bali|nusa penida|positano|amalfi|como|halong|maya bay|phi phi|santorini|oia|navagio|zakynthos|apostles|ocean road|seychelles|mauritius|le morne|alleppey|varkala|dawki|havelock|radhanagar)/i.test(text)

    case 'DESERT & DUNES':
      if (catStr === 'DESERT & DUNES' || catStr.includes('DESERT') || catStr.includes('DUNE')) return true
      return /(desert|dune|dunes|sand|safari|nubra|hunder|thar|jaisalmer|arabian desert|abu dhabi|wadi rum|cappadocia|masai mara|savannah|grand canyon|salar de uyuni|salt flat)/i.test(text)

    case 'HERITAGE & PALACES':
      if (catStr === 'HERITAGE & PALACES' || catStr.includes('HERITAGE') || catStr.includes('PALACE') || catStr.includes('FORT') || catStr.includes('TEMPLE')) return true
      return /(heritage|palace|fort|temple|monument|ghat|taj mahal|hawa mahal|pichola|mehrangarh|varanasi|dashashwamedh|amer fort|golden temple|harmandir|qutub minar|hampi|uluwatu|sheikh zayed|mosque|petra|al-khazneh|pyramid|giza|colosseum|fushimi inari|torii|hagia sophia|machu picchu|dubrovnik)/i.test(text)

    case 'URBAN & SKYLINES':
      if (catStr === 'URBAN & SKYLINES' || catStr.includes('URBAN') || catStr.includes('SKYLINE') || catStr.includes('CITY')) return true
      return /(urban|skyline|city|downtown|neon|burj khalifa|dubai|eiffel tower|louvre|paris|venice|grand canal|shibuya|tokyo|marina bay|singapore|sydney opera|harbour bridge)/i.test(text)

    default:
      return catStr === current || catStr.includes(current)
  }
}

export const GalleryPage = () => {
  const [photos, setPhotos] = useState(GALLERY_PHOTOS)
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [visibleCount, setVisibleCount] = useState(28)
  const [activeItemIndex, setActiveItemIndex] = useState(null)
  const [likedItems, setLikedItems] = useState({})

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const livePhotos = await mediaService.getAll()
        if (livePhotos && livePhotos.length > 0) {
          setPhotos(livePhotos)
        }
      } catch (err) {
        console.warn('Failed to load live gallery photos:', err)
      } finally {
        setLoading(false)
      }
    }
    loadPhotos()
  }, [])

  const categories = [
    { label: 'ALL', value: 'ALL', icon: Layers },
    { label: 'MOUNTAINS & ALPINE', value: 'MOUNTAINS & ALPINE', icon: Mountain },
    { label: 'ISLANDS & COASTAL', value: 'ISLANDS & COASTAL', icon: Palmtree },
    { label: 'DESERT & DUNES', value: 'DESERT & DUNES', icon: Sun },
    { label: 'HERITAGE & PALACES', value: 'HERITAGE & PALACES', icon: Landmark },
    { label: 'URBAN & SKYLINES', value: 'URBAN & SKYLINES', icon: Building2 },
    { label: 'INDIA', value: 'INDIA', icon: Compass },
    { label: 'INTERNATIONAL', value: 'INTERNATIONAL', icon: Globe },
  ]

  // Robust Filter photos based on Category selection
  const filteredPhotos = photos.filter((photo) => matchCategory(photo, activeCategory))

  const displayedPhotos = filteredPhotos.slice(0, visibleCount)

  const toggleLike = (id, e) => {
    e.stopPropagation()
    setLikedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handlePrev = (e) => {
    e.stopPropagation()
    if (activeItemIndex !== null) {
      setActiveItemIndex((prev) => (prev === 0 ? filteredPhotos.length - 1 : prev - 1))
    }
  }

  const handleNext = (e) => {
    e.stopPropagation()
    if (activeItemIndex !== null) {
      setActiveItemIndex((prev) => (prev === filteredPhotos.length - 1 ? 0 : prev + 1))
    }
  }

  const activePhoto = activeItemIndex !== null ? filteredPhotos[activeItemIndex] : null

  return (
    <div className="bg-[#FAF8F2] text-[#13251F] min-h-screen select-none">
      {/* ========================================================================= */}
      {/* 1. FULL-WIDTH CINEMATIC HERO BANNER (Standard Layout across all pages)   */}
      {/* ========================================================================= */}
      <div className="relative w-full bg-[#071A16] text-white pt-28 sm:pt-36 pb-12 sm:pb-16 min-h-[560px] sm:min-h-[590px] lg:min-h-[610px] flex flex-col justify-center px-4 sm:px-6 lg:px-12 overflow-hidden shadow-2xl border-b border-white/10 mb-10 sm:mb-12">
        {/* Background Banner Image Asset (100% Edge-to-Edge) */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=85"
            alt="Travel Gallery Banner"
            className="w-full h-full object-cover object-center scale-105"
            loading="eager"
          />
          {/* Layered Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#071A16]/90 via-black/35 to-[#071A16]/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071A16]/85 via-[#071A16]/45 to-transparent" />
          <div className="absolute inset-0 bg-black/15" />
        </div>

        {/* Ambient Emerald Radial Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#6FCF45]/15 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-0 left-10 w-[500px] h-[500px] bg-[#12382E]/40 rounded-full blur-3xl pointer-events-none z-0" />

        {/* Left-Aligned Constrained Content Container */}
        <div className="max-w-[1440px] w-full mx-auto relative z-10 text-left">
          <div className="max-w-3xl text-left">
            <div className="inline-flex items-center gap-2.5 mb-3 text-xs uppercase tracking-[0.25em] font-bold text-[#6FCF45] font-heading drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
              <span className="w-6 h-[2px] bg-[#6FCF45]" />
              <span>EXPEDITION ARCHIVE &amp; MOMENTS</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading leading-[1.1] text-left drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              Visual Journey Across <br />
              <span className="text-[#6FCF45]">India &amp; The World.</span>
            </h1>

            <p className="mt-3.5 text-xs sm:text-sm md:text-base text-white/90 max-w-2xl leading-relaxed font-normal text-left drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Explore authentic raw moments, sacred sanctuaries, and pristine landscapes captured by our travelers and expedition photographers across 100+ global locations.
            </p>
          </div>

          {/* Floating Stats Row */}
          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center gap-6 sm:gap-10 text-left">
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#6FCF45] font-heading">
                {photos.length}+
              </span>
              <span className="text-[11px] uppercase tracking-wider text-white/80 block mt-0.5 font-medium">Curated HD Captures</span>
            </div>
            <div className="w-px h-8 bg-white/15 hidden sm:block" />
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#6FCF45] font-heading">
                {photos.filter((p) => isIndiaPhoto(p)).length}+
              </span>
              <span className="text-[11px] uppercase tracking-wider text-white/80 block mt-0.5 font-medium">Incredible India Spots</span>
            </div>
            <div className="w-px h-8 bg-white/15 hidden sm:block" />
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#6FCF45] font-heading">
                {photos.filter((p) => !isIndiaPhoto(p)).length}+
              </span>
              <span className="text-[11px] uppercase tracking-wider text-white/80 block mt-0.5 font-medium">Global Sanctuaries</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN PAGE TOP CATEGORY FILTERS & STATS BAR                            */}
      {/* ========================================================================= */}
      <section className="pt-2 pb-6 px-4 sm:px-6 lg:px-10 max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E5E0D5]">
          {/* Category Filter Pills (Main Page Top) */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon
              const isSelected = activeCategory === cat.value
              const count = photos.filter((p) => matchCategory(p, cat.value)).length

              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat.value)
                    setVisibleCount(28)
                    setActiveItemIndex(null)
                  }}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-200 border cursor-pointer ${
                    isSelected
                      ? 'bg-[#071A16] text-[#6FCF45] border-[#071A16] shadow-md scale-105'
                      : 'bg-white text-[#5C6E67] border-[#E5E0D5] hover:border-[#13251F]/40 hover:text-[#13251F] hover:bg-[#F7F5EE] shadow-sm'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                  <span
                    className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full font-mono font-semibold ${
                      isSelected
                        ? 'bg-[#6FCF45]/20 text-[#6FCF45]'
                        : 'bg-[#EDE8DC] text-[#71827A]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Quick Count Indicator */}
          <div className="text-xs text-[#71827A] font-medium whitespace-nowrap self-start md:self-center">
            Showing <span className="font-bold text-[#13251F]">{displayedPhotos.length}</span> of{' '}
            <span className="font-bold text-[#13251F]">{filteredPhotos.length}</span> photos
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. MASONRY PINTEREST-STYLE PHOTO GRID (105+ IMAGES)                      */}
      {/* ========================================================================= */}
      <section className="py-4 sm:py-8 px-4 sm:px-6 lg:px-10 max-w-[1440px] mx-auto">
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
          {displayedPhotos.map((photo, index) => {
            const isLiked = likedItems[photo.id]
            const aspectClass =
              photo.aspect === 'tall'
                ? 'aspect-[3/4]'
                : photo.aspect === 'wide'
                ? 'aspect-[16/10]'
                : 'aspect-[1/1]'

            return (
              <div
                key={photo.id || photo._id || index}
                onClick={() => setActiveItemIndex(index)}
                className={`group relative break-inside-avoid rounded-[16px] overflow-hidden bg-[#071A16] border border-[#13251F]/10 shadow-xl cursor-pointer transition-all duration-300 hover:border-[#6FCF45]/50 hover:shadow-2xl hover:shadow-[#6FCF45]/15 hover:-translate-y-1 w-full ${aspectClass}`}
              >
                {/* Clean, Fast-Loading Responsive Image */}
                <img
                  src={photo.image || photo.url}
                  alt={photo.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80'
                  }}
                />

                {/* Dark Vignette Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 sm:p-5 pointer-events-none" />

                {/* Top Badge Overlay */}
                <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold text-[#6FCF45] border border-white/15 uppercase tracking-wider">
                      {photo.category}
                    </span>
                    {isIndiaPhoto(photo) && (
                      <span className="px-2 py-0.5 rounded-full bg-orange-500/20 backdrop-blur-md text-[10px] font-bold text-orange-300 border border-orange-500/30">
                        India
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => toggleLike(photo.id, e)}
                    className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:text-red-400 transition-colors pointer-events-auto"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isLiked ? 'fill-red-500 text-red-500' : 'text-white'
                      }`}
                    />
                  </button>
                </div>

                {/* Bottom Info Overlay */}
                <div className="absolute bottom-3.5 inset-x-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
                  <h3 className="text-sm sm:text-base font-bold text-white font-heading leading-tight drop-shadow-md">
                    {photo.title}
                  </h3>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/15 text-xs text-[#A8B5AF]">
                    <div className="flex items-center gap-1.5 text-[#6FCF45] font-semibold text-[11px]">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate max-w-[170px]">{photo.location}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-white/80">
                      <Eye className="w-3 h-3" />
                      <span>Expand</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Load More Button for Smooth 0-Lag Pagination */}
        {visibleCount < filteredPhotos.length && (
          <div className="mt-12 sm:mt-16 text-center">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 24)}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#071A16] hover:bg-[#12382E] text-white hover:text-[#6FCF45] border border-[#6FCF45]/40 hover:border-[#6FCF45] font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-xl cursor-pointer hover:scale-105 active:scale-95"
            >
              <span>LOAD MORE</span>
              <ArrowRight className="w-4 h-4 text-[#6FCF45]" />
            </button>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 4. FULLSCREEN INTERACTIVE LIGHTBOX MODAL                                 */}
      {/* ========================================================================= */}
      {activePhoto && (
        <div
          onClick={() => setActiveItemIndex(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full bg-[#0B241E] border border-white/20 rounded-[20px] overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-scaleUp"
          >
            {/* Top Bar with Close */}
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/10 bg-[#071A16]">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#12382E] border border-[#6FCF45]/30 flex items-center justify-center text-[#6FCF45]">
                  <Camera className="w-4 h-4" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm sm:text-base font-bold text-white font-heading">{activePhoto.title}</h4>
                    {isIndiaPhoto(activePhoto) && (
                      <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-[10px] font-bold text-orange-300 border border-orange-500/30">
                        India
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#6FCF45] font-medium mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{activePhoto.location}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => toggleLike(activePhoto.id, e)}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/15 text-white hover:text-red-400 flex items-center justify-center transition-colors"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      likedItems[activePhoto.id] ? 'fill-red-500 text-red-500' : 'text-white'
                    }`}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveItemIndex(null)}
                  className="w-9 h-9 rounded-full bg-white/10 border border-white/20 text-white hover:bg-[#6FCF45] hover:text-[#071A16] flex items-center justify-center transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main Center Image with Prev/Next Controls */}
            <div className="relative flex-1 bg-[#05110E] flex items-center justify-center min-h-[300px] sm:min-h-[420px] p-3 sm:p-6 overflow-hidden">
              <div className="w-full max-h-[64vh] flex items-center justify-center">
                <img
                  key={activePhoto.id}
                  src={activePhoto.image}
                  alt={activePhoto.title}
                  className="max-h-[60vh] sm:max-h-[64vh] w-auto max-w-full object-contain rounded-lg shadow-2xl drop-shadow-2xl transition-all duration-300"
                  loading="eager"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80'
                  }}
                />
              </div>

              {/* Prev Button */}
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/20 text-white hover:bg-[#6FCF45] hover:text-[#071A16] flex items-center justify-center transition-all shadow-xl z-20 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Next Button */}
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/20 text-white hover:bg-[#6FCF45] hover:text-[#071A16] flex items-center justify-center transition-all shadow-xl z-20 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom Metadata & Action Row */}
            <div className="p-4 sm:p-5 bg-[#071A16] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs w-full sm:w-auto">
                <div>
                  <span className="text-[10px] uppercase text-[#A8B5AF] block">Photographer</span>
                  <span className="font-semibold text-white">{activePhoto.photographer}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#A8B5AF] block">Gear &amp; Optics</span>
                  <span className="font-semibold text-white truncate">{activePhoto.camera}</span>
                </div>
                <div className="hidden sm:block">
                  <span className="text-[10px] uppercase text-[#A8B5AF] block">Category</span>
                  <span className="font-semibold text-[#6FCF45]">{activePhoto.category}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link
                  to={`/tours?search=${encodeURIComponent(activePhoto.location.split(',')[0].trim())}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#6FCF45] text-[#071A16] font-bold text-xs uppercase tracking-wider hover:bg-[#8AE863] transition-colors"
                >
                  <span>Explore Tours In This Region</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. BOTTOM CTA BANNER                                                     */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-[#13251F]/10 bg-[#071A16] text-white text-center">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#6FCF45]">
            HAVE EXTRAORDINARY SHOTS?
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading">
            Submit Your Expedition Memories
          </h2>
          <p className="text-xs sm:text-sm text-[#A8B5AF] max-w-xl mx-auto leading-relaxed">
            Share your photos from Tours &amp; Travels journeys across India &amp; abroad. Featured submissions receive exclusive private dining vouchers on their next itinerary.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              to="/custom-trip"
              variant="primary"
              size="md"
              className="text-xs px-7 h-[44px]"
            >
              Plan Your Next Shoot Trip
            </Button>
            <Button
              to="/contact"
              variant="secondary"
              size="md"
              className="text-xs px-7 h-[44px]"
            >
              Submit Photo Archive
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default GalleryPage
