import React from 'react'
import { motion } from 'framer-motion'
import {
  Navigation,
  Loader2,
  MapPin,
  Search,
  Check,
  Compass,
  Sparkles,
  Plane,
  Bus,
  Train,
  Users,
  Calendar,
  ArrowRight,
} from 'lucide-react'
import { BUS_OPTIONS, TRAIN_OPTIONS, FLIGHT_OPTIONS } from '../constants/transitOptions'

export const StepRouteTransit = ({
  departure,
  setDeparture,
  depSearchQuery,
  setDepSearchQuery,
  depSuggestions,
  depLoading,
  depDropdownOpen,
  setDepDropdownOpen,
  depRef,
  handleDetectCurrentLocation,
  locatingUser,
  locatingError,
  destination,
  setDestination,
  destSearchQuery,
  setDestSearchQuery,
  destDropdownOpen,
  setDestDropdownOpen,
  destRef,
  filteredCitySpots,
  distanceKm,
  isBusEligible,
  transitCategory,
  setTransitCategory,
  selectedTransitSubOption,
  setSelectedTransitSubOption,
  adults,
  setAdults,
  approxDuration,
  setApproxDuration,
  onSubmit,
}) => {
  return (
    <motion.div
      key="step-1"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25 }}
      className="flex-1 flex flex-col justify-between"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {/* 1. ORIGIN & REAL-TIME LOCATION BUTTON */}
        <div className="relative" ref={depRef}>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-[#6FCF45]" />
              <span>1. Starting City / Origin</span>
            </label>

            {/* Live Location Permission Fetch Button */}
            <button
              type="button"
              onClick={handleDetectCurrentLocation}
              disabled={locatingUser}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#6FCF45]/15 hover:bg-[#6FCF45]/30 text-[#6FCF45] border border-[#6FCF45]/40 text-[10.5px] font-bold transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
            >
              {locatingUser ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Detecting GPS...</span>
                </>
              ) : (
                <>
                  <MapPin className="w-3 h-3 text-[#6FCF45]" />
                  <span>Detect Current Location</span>
                </>
              )}
            </button>
          </div>

          {locatingError && (
            <p className="text-[11px] text-amber-400 mb-1">{locatingError}</p>
          )}

          <div className="relative">
            <input
              type="text"
              value={depSearchQuery}
              onChange={(e) => {
                setDepSearchQuery(e.target.value)
                setDepDropdownOpen(true)
              }}
              onFocus={() => setDepDropdownOpen(true)}
              placeholder="Type starting city (e.g. New Delhi, Mumbai, Lucknow, London)..."
              className="w-full bg-[#071A16] border border-white/20 focus:border-[#6FCF45] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none transition-all shadow-inner pl-10"
            />
            <Search className="w-4 h-4 text-[#6FCF45] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            {depLoading && (
              <Loader2 className="w-4 h-4 text-[#6FCF45] animate-spin absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {depDropdownOpen && depSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#071A16] border border-[#6FCF45]/40 rounded-xl shadow-2xl z-50 max-h-48 overflow-y-auto divide-y divide-white/5">
              {depSuggestions.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setDeparture({
                      city: item.name,
                      state: item.state || '',
                      country: item.country || '',
                      display: item.display,
                      lat: item.lat || 28.6139,
                      lng: item.lon || 77.209,
                    })
                    setDepSearchQuery(item.display)
                    setDepDropdownOpen(false)
                  }}
                  className="w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-[#12382E] transition-colors text-white"
                >
                  <div>
                    <div className="font-semibold text-white">{item.display}</div>
                    {item.country && <div className="text-[10px] text-[#A8B5AF]">{item.country}</div>}
                  </div>
                  <Check className={`w-3.5 h-3.5 text-[#6FCF45] shrink-0 ${departure.display === item.display ? 'opacity-100' : 'opacity-0'}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2. TARGET DESTINATION WITH 5-5 FAMOUS SPOTS DROPDOWN */}
        <div className="relative" ref={destRef}>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#6FCF45]" />
              <span>2. Target City &amp; 5 Famous Spots</span>
            </label>
            <span className="text-[10.5px] text-[#6FCF45] font-semibold">
              Select city or exact spot
            </span>
          </div>

          <div className="relative">
            <input
              type="text"
              value={destSearchQuery}
              onChange={(e) => {
                setDestSearchQuery(e.target.value)
                setDestDropdownOpen(true)
              }}
              onFocus={() => setDestDropdownOpen(true)}
              placeholder="Search destination or spot (e.g. Kashmir, Gulmarg, Jaipur, Hawa Mahal)..."
              className="w-full bg-[#071A16] border border-white/20 focus:border-[#6FCF45] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none transition-all shadow-inner pl-10"
            />
            <Compass className="w-4 h-4 text-[#6FCF45] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Selected Spot Notification Pill */}
          {destination.selectedSpot && (
            <div className="mt-1.5 flex items-center justify-between px-3 py-1 rounded-lg bg-[#6FCF45]/15 border border-[#6FCF45]/30 text-xs">
              <span className="text-white/80">Selected Hotspot:</span>
              <span className="font-bold text-[#6FCF45] flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>{destination.selectedSpot}</span>
              </span>
            </div>
          )}

          {/* Famous Spots Dropdown Container */}
          {destDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#071A16] border border-[#6FCF45]/50 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto divide-y divide-white/10 p-2">
              {filteredCitySpots.length === 0 ? (
                <div className="p-3 text-xs text-[#A8B5AF] text-center">
                  No direct match. You can still type custom destination above!
                </div>
              ) : (
                filteredCitySpots.map((item, idx) => (
                  <div key={idx} className="p-2.5 hover:bg-[#0B241E] rounded-lg transition-colors">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setDestination({
                            city: item.city,
                            state: item.state,
                            country: item.country,
                            display: `${item.city}, ${item.country}`,
                            lat: item.lat,
                            lng: item.lng,
                            selectedSpot: item.spots[0],
                          })
                          setDestSearchQuery(`${item.city}, ${item.country}`)
                          setDestDropdownOpen(false)
                        }}
                        className="font-bold text-white text-xs sm:text-sm hover:text-[#6FCF45] flex items-center gap-1.5 cursor-pointer text-left"
                      >
                        <MapPin className="w-3.5 h-3.5 text-[#6FCF45] shrink-0" />
                        <span>{item.city}</span>
                        <span className="text-[10px] text-[#A8B5AF] font-normal">({item.state || item.country})</span>
                      </button>
                      <span className="text-[10px] text-[#6FCF45] font-semibold">
                        from ₹{item.approxStartingPrice.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* 5 Famous Tourist Spots Tags */}
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {item.spots.map((spot, sIdx) => (
                        <button
                          key={sIdx}
                          type="button"
                          onClick={() => {
                            setDestination({
                              city: item.city,
                              state: item.state,
                              country: item.country,
                              display: `${item.city}, ${item.country}`,
                              lat: item.lat,
                              lng: item.lng,
                              selectedSpot: spot,
                            })
                            setDestSearchQuery(`${item.city} - ${spot}`)
                            setDestDropdownOpen(false)
                          }}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 hover:bg-[#6FCF45] hover:text-[#071A16] text-[#A8B5AF] border border-white/10 transition-all font-medium cursor-pointer inline-flex items-center gap-1"
                        >
                          <Sparkles className="w-2.5 h-2.5 text-[#6FCF45]" />
                          <span>{spot}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* 3. DYNAMIC TRANSIT MODE (Bus for 200-300km, Train & Flight for >300km) */}
        <div className="bg-[#071A16]/80 border border-white/15 rounded-xl p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Plane className="w-3.5 h-3.5 text-[#6FCF45]" />
              <span>3. Travel Mode by Distance ({distanceKm} km)</span>
            </label>
            <span className="text-[10px] text-[#A8B5AF]">Auto-calculated route</span>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setTransitCategory('bus')
                setSelectedTransitSubOption('volvo_ac_sleeper')
              }}
              className={`py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${transitCategory === 'bus'
                ? 'bg-[#6FCF45] text-[#071A16] shadow-sm'
                : 'bg-[#0B241E] text-white/80 border border-white/10 hover:border-[#6FCF45]/50'
                }`}
            >
              <Bus className="w-3.5 h-3.5" />
              <span>Luxury Bus</span>
              {isBusEligible && <span className="text-[9px] px-1 rounded bg-black/20">Optimal</span>}
            </button>

            <button
              type="button"
              onClick={() => {
                setTransitCategory('train')
                setSelectedTransitSubOption('train_3ac')
              }}
              className={`py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${transitCategory === 'train'
                ? 'bg-[#6FCF45] text-[#071A16] shadow-sm'
                : 'bg-[#0B241E] text-white/80 border border-white/10 hover:border-[#6FCF45]/50'
                }`}
            >
              <Train className="w-3.5 h-3.5" />
              <span>Train Express</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setTransitCategory('flight')
                setSelectedTransitSubOption('flight_economy')
              }}
              className={`py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${transitCategory === 'flight'
                ? 'bg-[#6FCF45] text-[#071A16] shadow-sm'
                : 'bg-[#0B241E] text-white/80 border border-white/10 hover:border-[#6FCF45]/50'
                }`}
            >
              <Plane className="w-3.5 h-3.5" />
              <span>Aeroplane</span>
            </button>
          </div>

          {/* Sub-Category Selection */}
          <div className="pt-1">
            {transitCategory === 'bus' && (
              <div className="space-y-1.5">
                <span className="text-[11px] text-[#6FCF45] font-semibold block">
                  Select Bus Model (Ideal for 200 km – 300 km transit):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {BUS_OPTIONS.map((bus) => (
                    <button
                      key={bus.id}
                      type="button"
                      onClick={() => setSelectedTransitSubOption(bus.id)}
                      className={`p-2.5 rounded-lg text-left text-xs transition-all border ${selectedTransitSubOption === bus.id
                        ? 'bg-[#12382E] border-[#6FCF45] text-white ring-1 ring-[#6FCF45]'
                        : 'bg-[#071A16] border-white/10 text-white/80 hover:border-white/30'
                        }`}
                    >
                      <div className="font-bold text-white flex justify-between">
                        <span>{bus.name}</span>
                        <span className="text-[#6FCF45]">₹{bus.farePerPerson}</span>
                      </div>
                      <div className="text-[10px] text-[#A8B5AF] mt-0.5">{bus.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {transitCategory === 'train' && (
              <div className="space-y-1.5">
                <span className="text-[11px] text-[#6FCF45] font-semibold block">
                  Select Train Berth Class (&gt; 300 km travel):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                  {TRAIN_OPTIONS.map((trn) => (
                    <button
                      key={trn.id}
                      type="button"
                      onClick={() => setSelectedTransitSubOption(trn.id)}
                      className={`p-2 rounded-lg text-left text-xs transition-all border ${selectedTransitSubOption === trn.id
                        ? 'bg-[#12382E] border-[#6FCF45] text-white ring-1 ring-[#6FCF45]'
                        : 'bg-[#071A16] border-white/10 text-white/80 hover:border-white/30'
                        }`}
                    >
                      <div className="font-bold text-white text-[11px] truncate">{trn.name}</div>
                      <div className="text-[10px] text-[#6FCF45] font-bold mt-0.5">₹{trn.farePerPerson}/pax</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {transitCategory === 'flight' && (
              <div className="space-y-1.5">
                <span className="text-[11px] text-[#6FCF45] font-semibold block">
                  Select Aeroplane Travel Tier:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {FLIGHT_OPTIONS.map((flt) => (
                    <button
                      key={flt.id}
                      type="button"
                      onClick={() => setSelectedTransitSubOption(flt.id)}
                      className={`p-2.5 rounded-lg text-left text-xs transition-all border ${selectedTransitSubOption === flt.id
                        ? 'bg-[#12382E] border-[#6FCF45] text-white ring-1 ring-[#6FCF45]'
                        : 'bg-[#071A16] border-white/10 text-white/80 hover:border-white/30'
                        }`}
                    >
                      <div className="font-bold text-white flex justify-between">
                        <span>{flt.name}</span>
                        <span className="text-[#6FCF45]">₹{flt.farePerPerson}</span>
                      </div>
                      <div className="text-[10px] text-[#A8B5AF] mt-0.5">{flt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4. PARTY SIZE & DURATION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white mb-1 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#6FCF45]" />
              <span>Party Size (Explorers)</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { count: 1, label: 'Solo (1 Guest)' },
                { count: 2, label: 'Couple (2 Guests)' },
                { count: 4, label: 'Family (4 Guests)' },
                { count: 6, label: 'Group (6 Guests)' },
              ].map((item) => (
                <button
                  key={item.count}
                  type="button"
                  onClick={() => setAdults(item.count)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all truncate cursor-pointer ${adults === item.count
                    ? 'bg-[#6FCF45] text-[#071A16] shadow-sm ring-1 ring-[#6FCF45]'
                    : 'bg-[#071A16] border border-white/15 text-[#A8B5AF] hover:text-white hover:border-[#6FCF45]/50'
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#6FCF45]" />
              <span>Approx Duration</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {['3–5 Days', '6–8 Days', '9–14 Days', '2+ Weeks'].map((dur) => (
                <button
                  key={dur}
                  type="button"
                  onClick={() => setApproxDuration(dur)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${approxDuration === dur
                    ? 'bg-[#6FCF45] text-[#071A16] shadow-sm ring-1 ring-[#6FCF45]'
                    : 'bg-[#071A16] border border-white/15 text-[#A8B5AF] hover:text-white hover:border-[#6FCF45]/50'
                    }`}
                >
                  {dur}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 1 Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full bg-[#6FCF45] hover:bg-[#8BE35A] text-[#071A16] py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-[0.18em] transition-all duration-200 shadow-lg shadow-[#6FCF45]/20 flex items-center justify-center gap-2 group active:scale-[0.99] cursor-pointer"
          >
            <span>CONTINUE TO TRAVELER DETAILS (STEP 2)</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5] text-[#071A16] group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>
      </form>
    </motion.div>
  )
}

export default StepRouteTransit

