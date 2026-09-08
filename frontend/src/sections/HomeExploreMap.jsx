import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Compass, MapPin, Star, ArrowRight, Sparkles, Globe } from 'lucide-react'
import Button from '../components/Button'

// Top 8 Curated Global Hotspots for homepage interactive preview
const FEATURED_HOTSPOTS = [
  {
    id: 'ind-taj-mahal',
    name: 'Taj Mahal, Agra',
    country: 'India',
    flag: '🇮🇳',
    category: 'Heritage',
    rating: 4.9,
    price: '₹14,999',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80',
    top: '46%',
    left: '68%',
  },
  {
    id: 'uae-burj-khalifa',
    name: 'Burj Khalifa, Dubai',
    country: 'UAE',
    flag: '🇦🇪',
    category: 'Luxury',
    rating: 4.9,
    price: '₹28,999',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80',
    top: '43%',
    left: '62%',
  },
  {
    id: 'id-bali',
    name: 'Bali',
    country: 'Indonesia',
    flag: '🇮🇩',
    category: 'Beaches',
    rating: 4.9,
    price: '₹27,999',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
    top: '60%',
    left: '79%',
  },
  {
    id: 'jp-tokyo',
    name: 'Tokyo',
    country: 'Japan',
    flag: '🇯🇵',
    category: 'Metropolis',
    rating: 4.9,
    price: '₹49,999',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
    top: '36%',
    left: '84%',
  },
  {
    id: 'fr-paris',
    name: 'Paris',
    country: 'France',
    flag: '🇫🇷',
    category: 'Romance',
    rating: 4.9,
    price: '₹59,999',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
    top: '30%',
    left: '49%',
  },
  {
    id: 'ch-zermatt',
    name: 'Zermatt / Matterhorn',
    country: 'Switzerland',
    flag: '🇨🇭',
    category: 'Alpine',
    rating: 5.0,
    price: '₹69,999',
    image: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=600&q=80',
    top: '32%',
    left: '51%',
  },
  {
    id: 'gr-santorini',
    name: 'Santorini',
    country: 'Greece',
    flag: '🇬🇷',
    category: 'Caldera',
    rating: 5.0,
    price: '₹67,999',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80',
    top: '38%',
    left: '55%',
  },
  {
    id: 'us-nyc',
    name: 'New York City',
    country: 'United States',
    flag: '🇺🇸',
    category: 'Skyline',
    rating: 4.9,
    price: '₹69,999',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80',
    top: '34%',
    left: '26%',
  },
]

export const HomeExploreMap = () => {
  const [activeHotspot, setActiveHotspot] = useState(FEATURED_HOTSPOTS[2]) // Default to Bali

  return (
    <section className="relative py-16 sm:py-24 bg-[#071A16] text-white overflow-hidden border-t border-white/10">
      {/* Background Subtle Gradient & Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#6FCF45]/8 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6FCF45]/15 border border-[#6FCF45]/40 text-[#6FCF45] text-[11px] font-extrabold uppercase tracking-[0.2em] mb-3">
              <Globe className="w-3.5 h-3.5" />
              <span>GLOBAL TRAVEL ATLAS</span>
            </div>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-heading">
              EXPLORE THE WORLD <br />
              <span className="text-[#6FCF45]">YOUR WAY.</span>
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-[#A8B5AF] max-w-xl">
              Immerse yourself in our interactive 400-location world discovery map. Search iconic landmarks, curate custom multi-country routes, and build your dream voyage.
            </p>
          </div>

          <Link
            to="/explore"
            className="self-start md:self-end px-6 sm:px-8 py-3 rounded-full bg-gradient-to-r from-[#6FCF45] to-[#8BE35A] hover:shadow-[0_0_25px_rgba(111,207,69,0.4)] text-[#071A16] font-extrabold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 active:scale-95 flex items-center gap-2 font-heading shrink-0 cursor-pointer"
          >
            <span>Explore Interactive Map</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Interactive World Map Matrix Card */}
        <div className="relative rounded-3xl bg-[#040F0D] border border-white/15 p-4 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden">
          {/* Subtle World Map Vector Background Overlay */}
          <div className="relative w-full aspect-[16/9] min-h-[380px] sm:min-h-[480px] rounded-2xl overflow-hidden bg-[#071A16]/60 border border-white/10 flex items-center justify-center">
            {/* World Grid Map Graphic */}
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=80"
              alt="World Map Silhouette"
              className="w-full h-full object-cover opacity-20 filter saturate-0 contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#040F0D]/90 via-transparent to-[#040F0D]/90" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#040F0D]/70 via-transparent to-[#040F0D]/95" />

            {/* Glowing Connecting Flight Arcs (SVG) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
              <path
                d="M 260 160 Q 450 60 510 150 T 680 220"
                fill="none"
                stroke="#6FCF45"
                strokeWidth="1.5"
                strokeDasharray="4 6"
                className="animate-pulse"
              />
              <path
                d="M 510 150 Q 620 180 790 280"
                fill="none"
                stroke="#8BE35A"
                strokeWidth="1.5"
                strokeDasharray="4 6"
              />
            </svg>

            {/* Interactive Pins Placed on World Map */}
            {FEATURED_HOTSPOTS.map((spot) => {
              const isActive = activeHotspot.id === spot.id
              return (
                <button
                  key={spot.id}
                  type="button"
                  onClick={() => setActiveHotspot(spot)}
                  style={{ top: spot.top, left: spot.left }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group/pin cursor-pointer focus:outline-none"
                  aria-label={`View ${spot.name}`}
                >
                  <div className="relative flex items-center justify-center">
                    {/* Pulsing Radar Ring */}
                    <span
                      className={`absolute w-7 h-7 rounded-full transition-all duration-300 ${
                        isActive
                          ? 'bg-[#6FCF45]/50 animate-ping'
                          : 'bg-[#6FCF45]/20 group-hover/pin:scale-150'
                      }`}
                    />

                    {/* Pin Center */}
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold transition-all duration-300 ${
                        isActive
                          ? 'bg-[#6FCF45] text-[#071A16] shadow-[0_0_15px_#6FCF45] scale-110'
                          : 'bg-[#071A16]/90 text-white border border-[#6FCF45]/40 hover:border-[#6FCF45]'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6FCF45] shrink-0" />
                      <span className="hidden sm:inline font-mono">{spot.flag} {spot.name.split(',')[0]}</span>
                    </div>
                  </div>
                </button>
              )
            })}

            {/* Active Destination Hover Card (Floating Bottom Left Overlay) */}
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm z-30 bg-[#071A16]/95 backdrop-blur-xl border border-[#6FCF45]/40 rounded-2xl p-3 sm:p-4 shadow-2xl flex items-center gap-3.5 animate-in fade-in slide-in-from-bottom-3 duration-200">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-white/10">
                <img
                  src={activeHotspot.image}
                  alt={activeHotspot.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-[#6FCF45] text-xs font-bold mb-0.5">
                  <Star className="w-3.5 h-3.5 fill-[#6FCF45]" />
                  <span>{activeHotspot.rating}</span>
                  <span className="text-white/40">•</span>
                  <span className="text-[#A8B5AF] text-[10px] font-normal">{activeHotspot.category}</span>
                </div>
                <h3 className="text-sm font-bold text-white truncate font-heading">{activeHotspot.name}</h3>
                <p className="text-xs text-[#8BE35A] font-semibold mt-0.5">
                  Starts at {activeHotspot.price}
                </p>
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#6FCF45] hover:underline mt-1"
                >
                  <span>Explore on Full Map</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Category Chips Strip */}
          <div className="mt-4 sm:mt-6 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {['20 Countries', '400 Curated Spots', 'Live Geo Markers', 'Instant Trip Builder'].map((badge) => (
                <span
                  key={badge}
                  className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-[#A8B5AF] font-medium whitespace-nowrap"
                >
                  ✓ {badge}
                </span>
              ))}
            </div>

            <Link
              to="/explore"
              className="text-xs font-bold text-[#6FCF45] hover:text-[#8BE35A] flex items-center gap-1 uppercase tracking-wider transition-colors ml-auto"
            >
              <span>Launch Fullscreen Atlas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeExploreMap
