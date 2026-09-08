import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useNavigate } from 'react-router-dom'
import {
  Star,
  MapPin,
  Plus,
  Check,
  ArrowRight,
  Sparkles,
  Heart,
  X,
  Compass,
  Navigation,
} from 'lucide-react'
import { findMatchingTour } from '../utils/tourHelpers'

// Environment-configurable Map Provider with Zero-Watermark Light Tourism Cartography
const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY || ''
const CARTO_KEY = import.meta.env.VITE_CARTO_KEY || ''
const CUSTOM_STYLE_URL = import.meta.env.VITE_MAP_STYLE_URL || ''

// High-resolution clean light tourism cartography tiles (Ivory land, soft light blue ocean, crisp labels)
const getTileConfig = () => {
  if (CUSTOM_STYLE_URL) {
    return {
      url: CUSTOM_STYLE_URL,
      subdomains: ['a', 'b', 'c', 'd'],
      maxZoom: 19,
      className: 'luxury-light-tourism-tiles',
      attribution: '&copy; Custom Tiles',
    }
  }

  if (CARTO_KEY) {
    return {
      url: `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?api_key=${CARTO_KEY}`,
      subdomains: ['a', 'b', 'c', 'd'],
      maxZoom: 19,
      className: 'luxury-light-tourism-tiles',
      attribution: '&copy; CARTO &copy; OpenStreetMap contributors',
    }
  }

  if (MAPTILER_KEY) {
    return {
      url: `https://api.maptiler.com/maps/voyager/256/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`,
      subdomains: ['a', 'b', 'c', 'd'],
      maxZoom: 19,
      className: 'luxury-light-tourism-tiles',
      attribution: '&copy; MapTiler &copy; OpenStreetMap',
    }
  }

  // 100% Free, Zero-Watermark, Crystal Clear Light-Blue Ocean Cartography (OpenStreetMap Standard Clean)
  return {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    subdomains: ['a', 'b', 'c'],
    maxZoom: 19,
    className: 'luxury-light-tourism-tiles',
    attribution: '&copy; OpenStreetMap contributors',
  }
}

// Broad Continental / Regional groups for balanced World-Zoom clustering (prevents 20-20-20 clutter)
const getRegionKey = (loc) => {
  const { lat = 0, lng = 0 } = loc.coordinates || {}
  const country = loc.country || ''

  if (country === 'India') {
    return lat >= 22 ? 'North India' : 'South India'
  }
  if (country === 'United Kingdom' || country === 'France' || country === 'Germany' || country === 'Switzerland' || country === 'Italy' || country === 'Spain' || country === 'Greece') {
    return lng < 6 ? 'Western Europe' : 'Southern & Central Europe'
  }
  if (country === 'UAE' || country === 'Saudi Arabia' || country === 'Turkey' || country === 'Egypt') {
    return 'Middle East & Arabia'
  }
  if (country === 'Thailand' || country === 'Indonesia' || country === 'Vietnam' || country === 'Singapore' || country === 'Malaysia' || country === 'Maldives') {
    return 'Southeast Asia & Indian Ocean'
  }
  if (country === 'Japan' || country === 'South Korea' || country === 'China') {
    return 'East Asia'
  }
  if (country === 'Australia' || country === 'New Zealand') {
    return 'Oceania & Pacific'
  }
  if (country === 'United States' || country === 'Canada') {
    return 'North America'
  }
  if (country === 'Brazil' || country === 'Peru' || country === 'Mexico') {
    return 'Latin America'
  }
  if (country === 'South Africa' || country === 'Morocco' || country === 'Kenya') {
    return 'Africa'
  }
  return country || 'Global'
}

// Format cluster numbers with elegant '+' thresholds (e.g. 206 -> 200+, 159 -> 150+, 39 -> 30+, 17 -> 15+, 7 -> 5+)
const formatClusterBadge = (count) => {
  if (count >= 100) {
    const rounded = Math.floor(count / 50) * 50
    return `${rounded}+`
  }
  if (count >= 20) {
    const rounded = Math.floor(count / 10) * 10
    return `${rounded}+`
  }
  if (count >= 10) {
    const rounded = Math.floor(count / 5) * 5
    return `${rounded}+`
  }
  if (count >= 5) {
    return '5+'
  }
  return `${count}`
}

export const ExploreMap = ({
  locations = [],
  activeMode = 'WORLD', // 'INDIA' | 'WORLD'
  selectedLocation = null,
  hoveredLocation = null,
  onSelectLocation,
  onAddToTrip,
  isPlaceSelected,
  onToggleWishlist,
  isInWishlist,
}) => {
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)
  const markersLayerRef = useRef(null)
  const [mapReady, setMapReady] = useState(false)
  const [currentZoom, setCurrentZoom] = useState(activeMode === 'INDIA' ? 4.8 : 2.5)
  const navigate = useNavigate()

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    const initialCenter = activeMode === 'INDIA' ? [20.5937, 78.9629] : [20, 15]
    const initialZoom = activeMode === 'INDIA' ? 4.8 : 2.5

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: false,
      attributionControl: false,
      minZoom: 2,
      maxZoom: 18,
      worldCopyJump: true,
    })

    const tileConfig = getTileConfig()

    // Add Light Tourism Basemap Layer
    L.tileLayer(tileConfig.url, {
      subdomains: tileConfig.subdomains,
      maxZoom: tileConfig.maxZoom,
      className: tileConfig.className,
      attribution: tileConfig.attribution,
    }).addTo(map)

    // Markers Layer Group
    const markersLayer = L.layerGroup().addTo(map)
    markersLayerRef.current = markersLayer

    // Track Zoom level and viewport changes for progressive dynamic spatial scattering
    map.on('zoomend moveend', () => {
      setCurrentZoom(map.getZoom())
    })

    mapRef.current = map
    setMapReady(true)

    setTimeout(() => {
      map.invalidateSize()
    }, 150)

    // ResizeObserver
    let resizeObserver = null
    if (window.ResizeObserver && mapContainerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize()
        }
      })
      resizeObserver.observe(mapContainerRef.current)
    }

    return () => {
      if (resizeObserver) resizeObserver.disconnect()
      map.remove()
      mapRef.current = null
    }
  }, [])

  // Handle India / World Mode Transition
  useEffect(() => {
    if (!mapRef.current || !mapReady) return

    if (activeMode === 'INDIA') {
      mapRef.current.flyTo([21.0, 78.9629], 4.5, {
        duration: 1.3,
        easeLinearity: 0.25,
      })
    } else {
      mapRef.current.flyTo([20, 15], 2.4, {
        duration: 1.3,
        easeLinearity: 0.25,
      })
    }
  }, [activeMode, mapReady])

  // Handle Programmatic FlyTo on Selected Location
  useEffect(() => {
    if (!mapRef.current || !mapReady || !selectedLocation) return

    const { lat, lng } = selectedLocation.coordinates || {}
    if (lat !== undefined && lng !== undefined) {
      mapRef.current.flyTo([lat, lng], Math.max(mapRef.current.getZoom(), 9.5), {
        duration: 1.2,
        easeLinearity: 0.25,
      })
    }
  }, [selectedLocation, mapReady])

  // Custom Zoom Handlers
  const handleZoomIn = () => {
    if (mapRef.current) mapRef.current.zoomIn()
  }

  const handleZoomOut = () => {
    if (mapRef.current) mapRef.current.zoomOut()
  }

  const handleResetView = () => {
    if (!mapRef.current) return
    if (activeMode === 'INDIA') {
      mapRef.current.flyTo([21.0, 78.9629], 4.5, { duration: 1.0 })
    } else {
      mapRef.current.flyTo([20, 15], 2.4, { duration: 1.0 })
    }
  }

  // Progressive Dynamic Spatial Clustering & Marker Rendering
  useEffect(() => {
    if (!mapRef.current || !mapReady || !markersLayerRef.current) return

    markersLayerRef.current.clearLayers()
    const map = mapRef.current
    const zoom = map.getZoom()

    // Dynamic spatial clustering radius:
    // - At low world zoom: aggregate into broad regional cluster circles (e.g. 20 in India)
    // - As zoom increases: clusters progressively scatter into city/regional numbers
    // - At deep zoom: scatter down into individual hotspots
    let pixelRadius = 140
    if (zoom < 3.2) {
      pixelRadius = 160
    } else if (zoom < 4.8) {
      pixelRadius = 110
    } else if (zoom < 6.5) {
      pixelRadius = 70
    } else if (zoom < 8.2) {
      pixelRadius = 45
    } else {
      pixelRadius = 25
    }

    // Spatial clustering: Group locations within pixel distance
    const clusters = []
    locations.forEach((loc) => {
      const { lat, lng } = loc.coordinates || {}
      if (lat === undefined || lng === undefined) return

      const point = map.latLngToLayerPoint([lat, lng])
      let merged = false

      for (let c of clusters) {
        const dist = Math.hypot(c.centerPoint.x - point.x, c.centerPoint.y - point.y)
        if (dist <= pixelRadius) {
          c.items.push(loc)
          c.latSum += lat
          c.lngSum += lng
          c.centerLat = c.latSum / c.items.length
          c.centerLng = c.lngSum / c.items.length
          c.centerPoint = map.latLngToLayerPoint([c.centerLat, c.centerLng])
          merged = true
          break
        }
      }

      if (!merged) {
        clusters.push({
          items: [loc],
          latSum: lat,
          lngSum: lng,
          centerLat: lat,
          centerLng: lng,
          centerPoint: point,
        })
      }
    })

    // Show destination name pin only when deeply zoomed in (zoom >= 7.5) or explicitly active/hovered
    const showDestinationNameDetails = zoom >= 7.5

    // Render Clusters and Individual Destination Pins
    clusters.forEach((cluster) => {
      const isMulti = cluster.items.length > 1
      const count = cluster.items.length
      const singleLoc = cluster.items[0]
      const isSelected = !isMulti && selectedLocation?.id === singleLoc.id
      const isHovered = !isMulti && hoveredLocation?.id === singleLoc.id

      // Show cluster count circle if multi-item OR if single item at low zoom (unless selected/hovered)
      if (isMulti || (!showDestinationNameDetails && !isSelected && !isHovered)) {
        const centerLat = cluster.centerLat
        const centerLng = cluster.centerLng
        const displayBadge = isMulti ? formatClusterBadge(count) : '1'

        const clusterHtml = `
          <div class="flex items-center justify-center cursor-pointer select-none transition-transform duration-200 hover:scale-115 no-underline" style="width: 38px; height: 38px;">
            <div style="min-width: 34px; height: 34px; padding: 0 5px; border-radius: 9999px; display: flex; align-items: center; justify-content: center; background: #ffffff; box-shadow: 0 2px 10px rgba(0,0,0,0.18); border: 1.5px solid rgba(7, 79, 69, 0.15); text-decoration: none;">
              <span style="font-family: inherit; font-size: 11px; font-weight: 800; color: #074F45; text-decoration: none; line-height: 1; text-align: center; user-select: none; letter-spacing: -0.3px;">${displayBadge}</span>
            </div>
          </div>
        `

        const clusterIcon = L.divIcon({
          className: 'custom-cluster-badge bg-transparent border-none',
          html: clusterHtml,
          iconSize: [38, 38],
          iconAnchor: [19, 19],
        })

        const marker = L.marker([centerLat, centerLng], { icon: clusterIcon })
        marker.on('click', () => {
          // If multi, zoom in to scatter; if single, zoom in to reveal destination name
          const targetZoom = isMulti ? Math.min(16, map.getZoom() + 2.4) : Math.max(8.5, map.getZoom() + 2.0)
          map.flyTo([centerLat, centerLng], targetZoom, {
            duration: 1.0,
            easeLinearity: 0.25,
          })
          if (!isMulti && onSelectLocation) {
            onSelectLocation(singleLoc)
          }
        })

        markersLayerRef.current.addLayer(marker)
      }
      // Deep Zoom OR Active / Hovered Destination -> Render Destination Pin with Name and Photo
      else {
        const loc = singleLoc
        const { lat, lng } = loc.coordinates || {}
        if (lat === undefined || lng === undefined) return

        const isTrip = isPlaceSelected ? isPlaceSelected(loc.id) : false

        const markerHtml = `
          <div class="group/pin relative flex items-center cursor-pointer select-none -translate-x-3 -translate-y-1/2 transition-transform duration-200 ${
            isSelected
              ? 'scale-115 z-50'
              : isHovered
              ? 'scale-110 z-40'
              : 'z-20 hover:scale-105'
          } no-underline">
            <!-- Destination Marker Capsule -->
            <div class="flex items-center bg-white rounded-full p-0.5 shadow-[0_2px_10px_rgba(0,0,0,0.18)] border ${
              isSelected
                ? 'border-[#6FCF45] ring-2 ring-[#6FCF45]'
                : isTrip
                ? 'border-[#074F45] ring-1 ring-[#074F45]/30'
                : 'border-slate-200 hover:border-[#6FCF45]'
            } transition-all duration-200 no-underline">
              
              <!-- Circular Thumbnail Photo -->
              <div class="w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden shrink-0 border border-slate-100 bg-slate-100">
                <img src="${loc.image}" alt="${loc.name}" class="w-full h-full object-cover" />
              </div>

              <!-- Speech Bubble Title in Dark Emerald Typography -->
              <div class="pl-1.5 pr-2.5 py-0.5 max-w-[110px] sm:max-w-[140px] no-underline">
                <span class="text-[10px] sm:text-[10.5px] font-bold text-[#074F45] font-sans block truncate leading-tight no-underline select-none">
                  ${loc.name.split(',')[0]}
                </span>
                <span class="text-[8px] text-slate-500 font-medium block truncate leading-none mt-0.5 no-underline select-none">
                  ${loc.city ? `${loc.city}, ` : ''}${loc.country}
                </span>
              </div>
            </div>

            <!-- Pointer Caret -->
            <div class="w-0 h-0 border-y-4 border-y-transparent border-r-4 ${
              isSelected ? 'border-r-[#6FCF45]' : 'border-r-white'
            } absolute right-full top-1/2 -translate-y-1/2 pointer-events-none"></div>
          </div>
        `

        const pinIcon = L.divIcon({
          className: 'custom-destination-pin bg-transparent border-none',
          html: markerHtml,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        })

        const marker = L.marker([lat, lng], { icon: pinIcon })
        marker.on('click', (e) => {
          L.DomEvent.stopPropagation(e)
          if (onSelectLocation) onSelectLocation(loc)
        })

        markersLayerRef.current.addLayer(marker)
      }
    })
  }, [locations, mapReady, currentZoom, selectedLocation, hoveredLocation, isPlaceSelected, activeMode, onSelectLocation])

  return (
    <div className="relative w-full h-full bg-[#CBEBF7] overflow-hidden select-none">
      {/* Leaflet Canvas Container */}
      <div
        ref={mapContainerRef}
        className="w-full h-full absolute inset-0 z-0 bg-[#CBEBF7]"
        style={{ minHeight: '100%' }}
      />

      {/* Top Left Telemetry Counter Badge ("400 GLOBAL HOTSPOTS") */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 text-[#071A16] border border-slate-200/90 shadow-sm backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-[#6FCF45] animate-ping" />
        <span className="text-[11px] font-bold tracking-wider font-heading uppercase text-[#071A16]">
          {locations.length} {activeMode === 'INDIA' ? 'India Hotspots' : 'Global Hotspots'}
        </span>
      </div>

      {/* Bottom Right Floating Zoom Pill (+ / −) in Refined White/Cream Luxury Style */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col items-center bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_4px_16px_rgba(7,26,22,0.12)] border border-slate-200/90 overflow-hidden">
        <button
          type="button"
          onClick={handleZoomIn}
          aria-label="Zoom In"
          className="w-9 h-9 flex items-center justify-center text-base font-bold text-[#071A16] hover:bg-slate-50 hover:text-[#6FCF45] active:bg-slate-100 transition-colors border-b border-slate-100 cursor-pointer"
          title="Zoom In"
        >
          +
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          aria-label="Zoom Out"
          className="w-9 h-9 flex items-center justify-center text-base font-bold text-[#071A16] hover:bg-slate-50 hover:text-[#6FCF45] active:bg-slate-100 transition-colors cursor-pointer"
          title="Zoom Out"
        >
          &minus;
        </button>
      </div>

      {/* Reset View Compass Button */}
      <div className="absolute bottom-6 right-18 z-20 hidden sm:flex items-center gap-2">
        <button
          type="button"
          onClick={handleResetView}
          className="p-2.5 rounded-2xl bg-white/95 backdrop-blur-md text-[#071A16] hover:text-[#6FCF45] shadow-[0_4px_16px_rgba(7,26,22,0.12)] border border-slate-200/90 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Reset Camera View"
        >
          <Navigation className="w-4 h-4" />
        </button>
      </div>

      {/* Redesigned Luxury White/Cream Destination Popup Card */}
      {selectedLocation && (
        <div
          role="region"
          aria-label="Destination Information Card"
          className="absolute bottom-6 left-6 right-6 sm:right-auto sm:max-w-[380px] z-30 animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <div className="bg-white/98 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-[0_16px_50px_rgba(7,26,22,0.18)] text-[#071A16] relative group">
            {/* Media Header */}
            <div className="relative h-44 rounded-2xl overflow-hidden mb-3.5 border border-slate-100 bg-slate-100">
              <img
                src={selectedLocation.image}
                alt={selectedLocation.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Rating Badge */}
              <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-[#071A16]/90 border border-white/20 backdrop-blur-md flex items-center gap-1.5 text-xs font-bold text-[#6FCF45]">
                <Star className="w-3.5 h-3.5 fill-[#6FCF45]" />
                <span>{selectedLocation.rating || 4.9}</span>
              </div>

              {/* Top-Right Action Controls: Wishlist Heart + Clean Close Button */}
              <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-20">
                {onToggleWishlist && (
                  <button
                    type="button"
                    onClick={() => onToggleWishlist(selectedLocation.id)}
                    className="w-8 h-8 rounded-full bg-white/90 hover:bg-white border border-slate-200/80 backdrop-blur-md flex items-center justify-center text-slate-600 hover:text-red-500 transition-all duration-200 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                    aria-label="Add to Wishlist"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isInWishlist && isInWishlist(selectedLocation.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-slate-600'
                      }`}
                    />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onSelectLocation(null)}
                  className="w-8 h-8 rounded-full bg-white/90 hover:bg-[#071A16] text-[#071A16] hover:text-white border border-slate-200/80 backdrop-blur-md flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                  aria-label="Close details"
                  title="Close card"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Country Badge */}
              <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 text-xs text-white font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#6FCF45]" />
                <span className="font-semibold">{selectedLocation.country}</span>
                {selectedLocation.type && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/25 text-white uppercase tracking-wider font-bold">
                    {selectedLocation.type}
                  </span>
                )}
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-1 mb-3">
              <h3 className="text-base sm:text-lg font-bold text-[#071A16] tracking-tight leading-tight font-heading">
                {selectedLocation.name}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">
                {selectedLocation.description}
              </p>
            </div>

            {/* Travel Specs Grid (Price, Tours, Hotels) */}
            {/* Travel Specs Grid (Price, Tours, Hotels) */}
            {(() => {
              const matchedTour = findMatchingTour(selectedLocation)
              const cleanLocName = selectedLocation.name.split(',')[0].trim()

              return (
                <>
                  <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-2xl bg-slate-50 border border-slate-100 mb-3.5 text-center">
                    <div>
                      <span className="text-[9.5px] text-slate-400 uppercase tracking-wider block">Tours</span>
                      <span className="text-xs font-bold text-[#071A16] font-mono">
                        {matchedTour ? (matchedTour.duration?.split('/')[0] || `${selectedLocation.toursCount || 8}+`) : 'Custom'}
                      </span>
                    </div>
                    <div className="border-x border-slate-200">
                      <span className="text-[9.5px] text-slate-400 uppercase tracking-wider block">Hotels</span>
                      <span className="text-xs font-bold text-[#071A16] font-mono">
                        {selectedLocation.hotelsCount || 40}+
                      </span>
                    </div>
                    <div>
                      <span className="text-[9.5px] text-slate-400 uppercase tracking-wider block">Starting</span>
                      <span className="text-xs font-extrabold text-[#071A16] font-mono">
                        ₹{(matchedTour?.startingPrice || selectedLocation.startingPrice || 24999).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons: View Tours (if available) / Custom Package (if unavailable) & Add to Trip */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (onAddToTrip) onAddToTrip(selectedLocation)
                      }}
                      className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer font-heading ${
                        isPlaceSelected && isPlaceSelected(selectedLocation.id)
                          ? 'bg-[#071A16] text-[#6FCF45]'
                          : 'bg-slate-100 hover:bg-[#6FCF45] text-[#071A16] active:scale-95'
                      }`}
                    >
                      {isPlaceSelected && isPlaceSelected(selectedLocation.id) ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added to Tour</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Add to Tour</span>
                        </>
                      )}
                    </button>

                    {matchedTour ? (
                      <button
                        type="button"
                        onClick={() => {
                          const query = matchedTour.destination || cleanLocName
                          navigate(`/tours?search=${encodeURIComponent(query)}`)
                        }}
                        className="py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#071A16] hover:bg-[#0B241E] text-[#6FCF45] flex items-center justify-center gap-1.5 transition-all cursor-pointer font-heading active:scale-95 shadow-sm"
                        title={`View ${matchedTour.title || cleanLocName} Tour Package`}
                      >
                        <span>View Tours</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          navigate(
                            `/custom-trip?destination=${encodeURIComponent(cleanLocName)}&country=${encodeURIComponent(
                              selectedLocation.country || ''
                            )}`
                          )
                        }}
                        className="py-2.5 px-3.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#071A16] hover:bg-[#0B241E] text-[#6FCF45] flex items-center justify-center gap-1.5 transition-all cursor-pointer font-heading active:scale-95 shadow-sm"
                        title={`No standard package for ${cleanLocName}. Design a custom tour!`}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#6FCF45]" />
                        <span>Custom Package</span>
                      </button>
                    )}
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}

export default ExploreMap
