import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Trash2, ArrowRight, Compass, Sparkles, ChevronUp, ChevronDown, CheckCircle2 } from 'lucide-react'

export const MyTripDrawer = ({
  selectedPlaces = [],
  onRemovePlace,
  onClearAll,
}) => {
  const [isOpen, setIsOpen] = useState(true)
  const navigate = useNavigate()

  if (!selectedPlaces || selectedPlaces.length === 0) {
    return null
  }

  // Calculate estimated combined starting price
  const estimatedTotal = selectedPlaces.reduce((sum, place) => {
    return sum + (place.startingPrice || 24999)
  }, 0)

  const handleBuildItinerary = () => {
    // Pass selected destination names / objects to custom trip page via state or query
    const destNames = selectedPlaces.map((p) => p.name).join(', ')
    navigate(`/custom-trip?destinations=${encodeURIComponent(destNames)}`, {
      state: { preSelectedPlaces: selectedPlaces },
    })
  }

  return (
    <aside
      aria-label="My Trip Planner Drawer"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 max-w-[calc(100vw-2rem)] sm:max-w-[380px] w-full transition-all duration-300 ease-in-out"
    >
      {/* Main Glass Panel */}
      <div className="bg-[#071A16]/95 backdrop-blur-2xl border border-[#6FCF45]/40 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_20px_rgba(111,207,69,0.15)] overflow-hidden">
        {/* Header Ribbon */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-3.5 bg-gradient-to-r from-[#0B241E] via-[#0E332A] to-[#0B241E] border-b border-[#6FCF45]/20 flex items-center justify-between cursor-pointer select-none group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#6FCF45]/20 border border-[#6FCF45]/40 flex items-center justify-center text-[#6FCF45]">
              <Compass className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs sm:text-sm font-bold tracking-wider text-white uppercase font-heading">
                  MY TRIP
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#6FCF45] text-[#071A16] text-[10px] font-extrabold leading-none">
                  {selectedPlaces.length} {selectedPlaces.length === 1 ? 'Place' : 'Places'}
                </span>
              </div>
              <p className="text-[10px] text-[#A8B5AF]">
                {isOpen ? 'Curating your luxury voyage' : 'Click to expand planned stops'}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="text-white/70 group-hover:text-[#6FCF45] transition-colors p-1"
            aria-label={isOpen ? 'Collapse Trip Drawer' : 'Expand Trip Drawer'}
          >
            {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
        </div>

        {/* Collapsible Content */}
        {isOpen && (
          <div className="p-4 space-y-3.5 max-h-[360px] overflow-y-auto no-scrollbar">
            {/* List of Selected Places */}
            <div className="space-y-2">
              {selectedPlaces.map((place, idx) => (
                <div
                  key={place.id || idx}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#6FCF45]/30 transition-all group/item"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-white/10">
                      <img
                        src={place.image}
                        alt={place.name}
                        className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-semibold text-white truncate group-hover/item:text-[#6FCF45] transition-colors">
                        {place.name}
                      </h3>
                      <p className="text-[10px] text-[#A8B5AF] flex items-center gap-1 truncate">
                        <MapPin className="w-2.5 h-2.5 text-[#6FCF45] shrink-0" />
                        <span>{place.country}</span>
                        {place.startingPrice && (
                          <span className="text-[#8BE35A] font-medium ml-1">
                            • ₹{place.startingPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemovePlace(place.id)
                    }}
                    title="Remove from trip"
                    className="text-[#A8B5AF] hover:text-red-400 p-1.5 rounded-lg hover:bg-red-400/10 transition-all shrink-0 cursor-pointer"
                    aria-label={`Remove ${place.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Price Estimation Bar */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#A8B5AF] block">
                  Estimated Starting From
                </span>
                <span className="text-sm sm:text-base font-bold text-[#6FCF45] font-mono">
                  ₹{estimatedTotal.toLocaleString('en-IN')}
                </span>
              </div>

              {selectedPlaces.length > 1 && onClearAll && (
                <button
                  type="button"
                  onClick={onClearAll}
                  className="text-[10px] text-white/50 hover:text-white transition-colors underline cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* CTA: Build My Itinerary */}
            <button
              type="button"
              onClick={handleBuildItinerary}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#6FCF45] to-[#8BE35A] text-[#071A16] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(111,207,69,0.4)] active:scale-[0.98] transition-all cursor-pointer font-heading"
            >
              <span>Build My Itinerary</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}

export default MyTripDrawer
