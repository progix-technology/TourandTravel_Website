import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search,
  MapPin,
  Globe,
  Compass,
  SlidersHorizontal,
  X,
  Heart,
  Plus,
  Check,
  Star,
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Layers,
  Map as MapIcon,
  List as ListIcon,
} from 'lucide-react'
import ExploreMap from '../components/ExploreMap'
import MyTripDrawer from '../components/MyTripDrawer'
import { useWishlist } from '../context/WishlistContext'
import {
  EXPLORE_LOCATIONS,
  COUNTRIES_LIST,
  CATEGORIES_LIST,
} from '../data/exploreDestinations'

const STORAGE_KEY = 'tt_my_trip_destinations'

// Audience tag helper for cards matching screenshot ("FAMILIES", "COUPLES", "INDIVIDUALS")
const getAudienceTags = (loc) => {
  const cats = Array.isArray(loc.category) ? loc.category : [loc.category || 'Luxury']
  const tags = []

  if (cats.includes('Family') || cats.includes('Heritage') || cats.includes('Theme Parks')) {
    tags.push('FAMILIES')
  }
  if (cats.includes('Honeymoon') || cats.includes('Luxury') || cats.includes('Beaches')) {
    tags.push('COUPLES')
  }
  if (cats.includes('Adventure') || cats.includes('Mountains') || cats.includes('Metropolis')) {
    tags.push('INDIVIDUALS')
  }
  if (tags.length === 0) {
    tags.push(cats[0]?.toUpperCase() || 'EXPLORE')
  }
  return tags.slice(0, 2)
}

export const ExplorePage = () => {
  const [activeMode, setActiveMode] = useState('WORLD') // 'INDIA' | 'WORLD'
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeCountry, setActiveCountry] = useState('All Countries')
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [hoveredLocation, setHoveredLocation] = useState(null)
  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileView, setMobileView] = useState('split') // 'list' | 'map' | 'split'
  const [mapTheme, setMapTheme] = useState('LIGHT_VOYAGER')

  const { wishlist, toggleWishlist, isInWishlist } = useWishlist()
  const navigate = useNavigate()

  // Load planned trip destinations from localStorage
  const [myTripPlaces, setMyTripPlaces] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(myTripPlaces))
    } catch {
      // ignore
    }
  }, [myTripPlaces])

  const handleAddToTrip = (place) => {
    if (!place) return
    setMyTripPlaces((prev) => {
      if (prev.some((p) => p.id === place.id)) {
        return prev.filter((p) => p.id !== place.id)
      }
      return [...prev, place]
    })
  }

  const handleRemoveFromTrip = (placeId) => {
    setMyTripPlaces((prev) => prev.filter((p) => p.id !== placeId))
  }

  const handleClearTrip = () => {
    setMyTripPlaces([])
  }

  const isPlaceSelected = useCallback(
    (placeId) => {
      return myTripPlaces.some((p) => p.id === placeId)
    },
    [myTripPlaces]
  )

  // Filter locations based on state
  const filteredLocations = useMemo(() => {
    let list = [...EXPLORE_LOCATIONS]

    // Mode filter
    if (activeMode === 'INDIA') {
      list = list.filter((l) => l.countryCode === 'IN' || l.country === 'India')
    } else if (activeCountry && activeCountry !== 'All Countries') {
      list = list.filter((l) => l.country === activeCountry)
    }

    // Category filter
    if (activeCategory && activeCategory !== 'All') {
      list = list.filter((l) => {
        if (activeCategory === 'Destinations') return l.type === 'destination'
        if (activeCategory === 'Cities') return l.type === 'city'
        return Array.isArray(l.category) && l.category.includes(activeCategory)
      })
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.country.toLowerCase().includes(q) ||
          (Array.isArray(l.category) && l.category.some((c) => c.toLowerCase().includes(q))) ||
          (l.description && l.description.toLowerCase().includes(q))
      )
    }

    return list
  }, [activeMode, activeCountry, activeCategory, searchQuery])

  // Count active filters for badge count matching screenshot
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (activeMode === 'INDIA') count += 1
    if (activeCountry !== 'All Countries') count += 1
    if (activeCategory !== 'All') count += 1
    if (searchQuery.trim()) count += 1
    return count
  }, [activeMode, activeCountry, activeCategory, searchQuery])

  const handleModeChange = (mode) => {
    setActiveMode(mode)
    setSelectedLocation(null)
    if (mode === 'INDIA') {
      setActiveCountry('All Countries')
    }
  }

  const handleClearFilters = () => {
    setActiveCategory('All')
    setActiveCountry('All Countries')
    setSearchQuery('')
    setActiveMode('WORLD')
  }

  return (
    <div className="fixed inset-0 top-0 left-0 w-screen h-screen bg-[#F4F7F5] z-50 flex overflow-hidden font-sans select-none">
      {/* ========================================================================= */}
      {/* 1. LEFT SIDEBAR PANEL (Matching Reference Screenshot)                     */}
      {/* ========================================================================= */}
      <aside
        className={`h-full bg-white border-r border-slate-200 flex flex-col z-20 shadow-2xl transition-all duration-300 relative ${
          sidebarOpen
            ? 'w-full md:w-[380px] lg:w-[430px] xl:w-[460px]'
            : 'w-0 -translate-x-full md:w-0 opacity-0 pointer-events-none overflow-hidden border-none'
        } ${mobileView === 'map' ? 'hidden md:flex' : 'flex'}`}
      >
        {/* Sleek Floating Circular Collapse Button (<) */}
        {sidebarOpen && (
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="hidden md:flex absolute top-1/2 -right-5 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-white hover:bg-[#071A16] text-[#071A16] hover:text-[#6FCF45] border border-slate-300 shadow-[0_4px_18px_rgba(0,0,0,0.18)] items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
            title="Collapse Sidebar"
            aria-label="Collapse Sidebar"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Top Header: Search Bar + Filter Pill Button */}
        <div className="p-3.5 sm:p-4 border-b border-slate-100 bg-white sticky top-0 z-10 space-y-3">
          <div className="flex items-center gap-2.5">
            {/* Search Input Pill */}
            <div className="flex-1 relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search destinations, cities or attractions..."
                className="w-full bg-[#F3F6F4] text-[#071A16] placeholder-slate-400 text-xs sm:text-[13px] font-medium rounded-full pl-9 pr-8 py-2.5 border border-transparent focus:border-[#6FCF45] focus:bg-white focus:outline-none transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label="Clear Search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Toggle Button with Badge Count (e.g. 5) */}
            <button
              type="button"
              onClick={() => setFilterModalOpen(!filterModalOpen)}
              className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center relative text-[#071A16] hover:text-[#6FCF45] hover:border-[#6FCF45] transition-all cursor-pointer shrink-0 shadow-sm"
              title="Filters & Countries"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#071A16] text-[#6FCF45] text-[10px] font-extrabold flex items-center justify-center border border-[#6FCF45]">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* India vs World Segmented Control */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#F3F6F4] border border-slate-200">
            <button
              type="button"
              onClick={() => handleModeChange('WORLD')}
              className={`flex-1 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer font-heading ${
                activeMode === 'WORLD'
                  ? 'bg-[#071A16] text-[#FAF8F2] shadow-sm'
                  : 'text-slate-600 hover:text-[#071A16]'
              }`}
            >
              🌍 World ({EXPLORE_LOCATIONS.length})
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('INDIA')}
              className={`flex-1 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer font-heading ${
                activeMode === 'INDIA'
                  ? 'bg-[#071A16] text-[#6FCF45] shadow-sm'
                  : 'text-slate-600 hover:text-[#071A16]'
              }`}
            >
              🇮🇳 India ({EXPLORE_LOCATIONS.filter((l) => l.countryCode === 'IN').length})
            </button>
          </div>

          {/* Horizontal Category Chips (All, Families, Couples, Individuals, etc.) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {CATEGORIES_LIST.map((cat) => {
              const isSelected = activeCategory === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-[#071A16] text-[#6FCF45] shadow-sm'
                      : 'bg-[#F3F6F4] hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>

        {/* Results Info & Active Filters Bar */}
        <div className="px-4 py-2 bg-[#FAFBFB] border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold text-slate-700">
            Showing {filteredLocations.length} results
          </span>
          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-[#071A16] hover:text-[#6FCF45] font-bold text-[11px] uppercase tracking-wider underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Scrollable Cards Feed (Matching Screenshot Cards Layout) */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3 no-scrollbar bg-slate-50/50">
          {filteredLocations.length === 0 ? (
            <div className="p-8 text-center space-y-3">
              <Compass className="w-8 h-8 text-slate-300 mx-auto animate-bounce" />
              <p className="text-sm font-bold text-slate-700 font-heading">
                No matching destinations found
              </p>
              <p className="text-xs text-slate-400">
                Try clearing search terms or selecting another category.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-4 py-2 rounded-full bg-[#071A16] text-[#6FCF45] text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            filteredLocations.map((loc) => {
              const isSelected = selectedLocation?.id === loc.id
              const isTrip = isPlaceSelected(loc.id)
              const audienceTags = getAudienceTags(loc)
              const inWishlist = isInWishlist(loc.id)

              return (
                <div
                  key={loc.id}
                  onClick={() => setSelectedLocation(loc)}
                  onMouseEnter={() => setHoveredLocation(loc)}
                  onMouseLeave={() => setHoveredLocation(null)}
                  className={`group/card p-3 rounded-2xl bg-white border transition-all duration-200 cursor-pointer flex gap-3 relative select-none ${
                    isSelected
                      ? 'border-[#6FCF45] shadow-[0_4px_20px_rgba(111,207,69,0.25)] ring-2 ring-[#6FCF45]/30'
                      : 'border-slate-100 hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  {/* Left: Square Thumbnail Image */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-slate-100 relative">
                    <img
                      src={loc.image}
                      alt={loc.name}
                      className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded-full bg-black/60 text-white text-[9px] font-bold backdrop-blur-sm flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 fill-[#6FCF45] text-[#6FCF45]" />
                      <span>{loc.rating || 4.9}</span>
                    </div>
                  </div>

                  {/* Right: Content & Metadata */}
                  <div className="flex-1 flex flex-col justify-between min-w-0 pr-6">
                    <div>
                      {/* Tags Row */}
                      <div className="flex items-center gap-1 mb-1">
                        {audienceTags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 uppercase tracking-wider"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Title */}
                      <h3 className="text-xs sm:text-[13px] font-extrabold text-[#071A16] font-heading leading-tight truncate group-hover/card:text-[#0B241E]">
                        {loc.name.split(',')[0]}
                      </h3>

                      {/* Location Subtext */}
                      <div className="flex items-center gap-1 text-[10.5px] text-slate-500 mt-1 truncate">
                        <MapPin className="w-3 h-3 text-[#6FCF45] shrink-0" />
                        <span className="truncate">{loc.name}</span>
                      </div>
                    </div>

                    {/* Price & Add to Trip Row */}
                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100 text-xs">
                      <div>
                        <span className="text-[9.5px] text-slate-400 uppercase tracking-wider block">
                          Starting
                        </span>
                        <span className="font-extrabold text-[#071A16] text-xs sm:text-[13px] font-mono">
                          ₹{(loc.startingPrice || 24999).toLocaleString('en-IN')}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAddToTrip(loc)
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer ${
                          isTrip
                            ? 'bg-[#071A16] text-[#6FCF45]'
                            : 'bg-slate-100 hover:bg-[#6FCF45] text-slate-700 hover:text-[#071A16]'
                        }`}
                      >
                        {isTrip ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Saved</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3" />
                            <span>Trip</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Top Right Wishlist Heart Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleWishlist(loc.id)
                    }}
                    className="absolute top-3 right-3 p-1 text-slate-300 hover:text-red-500 transition-colors cursor-pointer"
                    aria-label="Wishlist"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        inWishlist ? 'fill-red-500 text-red-500' : 'text-slate-300'
                      }`}
                    />
                  </button>
                </div>
              )
            })
          )}
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. RIGHT PANEL: FULL INTERACTIVE MAP                                      */}
      {/* ========================================================================= */}
      <main
        className={`flex-1 h-full relative overflow-hidden bg-slate-100 ${
          mobileView === 'list' ? 'hidden md:block' : 'block'
        }`}
      >
        {/* Floating Expand Sidebar Button (>) on Left Edge when Collapsed */}
        {!sidebarOpen && (
          <>
            {/* Sleek Floating Circular Expand Button (>) */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="hidden md:flex absolute top-1/2 left-4 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white hover:bg-[#071A16] text-[#071A16] hover:text-[#6FCF45] border border-slate-300 shadow-[0_4px_18px_rgba(0,0,0,0.18)] items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
              title="Expand Sidebar"
              aria-label="Expand Sidebar"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Top-Left Pill Button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="hidden md:flex absolute top-4 left-4 z-30 px-3.5 py-2 rounded-full bg-white hover:bg-[#071A16] text-[#071A16] hover:text-[#6FCF45] border border-slate-200 shadow-[0_2px_12px_rgba(0,0,0,0.12)] items-center gap-1.5 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer font-bold text-xs uppercase tracking-wider"
              title="Show Destinations Sidebar"
              aria-label="Show Destinations Sidebar"
            >
              <ChevronRight className="w-3.5 h-3.5 text-[#6FCF45]" />
              <span>Destinations ({filteredLocations.length})</span>
            </button>
          </>
        )}

        {/* Top Right Close / Exit Button (Matching Screenshot Top-Right '✕') */}
        <Link
          to="/"
          aria-label="Close Discovery and return home"
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-white text-[#071A16] hover:bg-[#071A16] hover:text-white shadow-[0_4px_16px_rgba(0,0,0,0.18)] border border-black/10 flex items-center justify-center text-sm font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Exit to Home"
        >
          ✕
        </Link>

        {/* Core Interactive Map Canvas */}
        <ExploreMap
          locations={filteredLocations}
          activeMode={activeMode}
          selectedLocation={selectedLocation}
          hoveredLocation={hoveredLocation}
          onSelectLocation={setSelectedLocation}
          onAddToTrip={handleAddToTrip}
          isPlaceSelected={isPlaceSelected}
          onToggleWishlist={toggleWishlist}
          isInWishlist={isInWishlist}
          mapTheme={mapTheme}
          onThemeChange={setMapTheme}
        />
      </main>

      {/* ========================================================================= */}
      {/* 3. FILTER & COUNTRY DRAWER MODAL                                          */}
      {/* ========================================================================= */}
      {filterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl space-y-5 border border-slate-200 animate-slideUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-[#6FCF45]" />
                <h2 className="text-base font-bold text-[#071A16] font-heading">
                  Filter Expeditions
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setFilterModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Mode Select */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Region Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleModeChange('WORLD')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider border cursor-pointer ${
                    activeMode === 'WORLD'
                      ? 'bg-[#071A16] text-[#6FCF45] border-[#071A16]'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  🌍 World (20 Countries)
                </button>
                <button
                  type="button"
                  onClick={() => handleModeChange('INDIA')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider border cursor-pointer ${
                    activeMode === 'INDIA'
                      ? 'bg-[#071A16] text-[#6FCF45] border-[#071A16]'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  🇮🇳 India ({EXPLORE_LOCATIONS.filter((l) => l.countryCode === 'IN').length} Hotspots)
                </button>
              </div>
            </div>

            {/* Country Selector */}
            {activeMode === 'WORLD' && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Select Specific Country
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-48 overflow-y-auto p-1 bg-slate-50 rounded-2xl border border-slate-200 no-scrollbar">
                  {COUNTRIES_LIST.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => {
                        setActiveCountry(c.name)
                        setSelectedLocation(null)
                      }}
                      className={`px-2.5 py-1.5 rounded-xl text-left text-xs font-medium truncate transition-colors cursor-pointer ${
                        activeCountry === c.name
                          ? 'bg-[#071A16] text-[#6FCF45] font-bold'
                          : 'text-slate-700 hover:bg-white'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleClearFilters}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 uppercase tracking-wider cursor-pointer"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={() => setFilterModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#071A16] text-[#6FCF45] text-xs font-bold uppercase tracking-wider hover:bg-[#0B241E] cursor-pointer shadow-md"
              >
                Apply Filters ({filteredLocations.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MOBILE BOTTOM TOGGLE (List View ⇋ Map View)                            */}
      {/* ========================================================================= */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button
          type="button"
          onClick={() => setMobileView(mobileView === 'list' ? 'map' : 'list')}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#071A16] text-[#6FCF45] font-bold text-xs uppercase tracking-wider shadow-2xl border border-[#6FCF45]/40 cursor-pointer active:scale-95"
        >
          {mobileView === 'list' ? (
            <>
              <MapIcon className="w-4 h-4" />
              <span>Show Map View</span>
            </>
          ) : (
            <>
              <ListIcon className="w-4 h-4" />
              <span>Show List View ({filteredLocations.length})</span>
            </>
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 5. MY TRIP FLOATING DRAWER                                                */}
      {/* ========================================================================= */}
      <MyTripDrawer
        selectedPlaces={myTripPlaces}
        onRemovePlace={handleRemoveFromTrip}
        onClearAll={handleClearTrip}
      />
    </div>
  )
}

export default ExplorePage
