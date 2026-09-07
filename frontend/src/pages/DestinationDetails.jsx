import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Sun, Calendar, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { destinationService } from '../services/destinationService'
import { tourService } from '../services/tourService'
import TourCard from '../components/TourCard'
import Button from '../components/Button'
import Loader from '../components/Loader'

export const DestinationDetails = () => {
  const { slug } = useParams()
  const [destination, setDestination] = useState(() => {
    return destinationService.getBySlug(slug)
  })
  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const dest = await destinationService.getBySlug(slug)
      setDestination(dest)
      const destSlug = dest?.slug || slug
      const destName = dest?.name || ''
      const allTours = await tourService.getAll({
        destination: destSlug,
        destinationName: destName,
      })
      setTours(allTours)
      setLoading(false)
    }
    fetchData()
  }, [slug])

  if (loading && !destination) return <div className="pt-32"><Loader label="Unveiling Destination..." /></div>
  if (!destination) {
    return (
      <div className="pt-36 pb-24 text-center">
        <h2 className="text-2xl font-bold text-white">Destination Not Found</h2>
        <Button to="/destinations" variant="primary" className="mt-4">
          Back to Destinations
        </Button>
      </div>
    )
  }

  return (
    <div className="pb-24 bg-[#071A16] text-white min-h-screen">
      {/* Destination Hero Banner (Full-Bleed Edge-to-Edge to the Top) */}
      <div className="relative h-[560px] sm:h-[620px] lg:h-[660px] w-full overflow-hidden flex flex-col justify-end">
        <img
          src={destination.image}
          alt={destination.name}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071A16] via-[#071A16]/50 to-transparent" />
        <div className="absolute inset-0 bg-[#071A16]/20" />

        <div className="relative z-10 max-w-[1240px] w-full mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#6FCF45]/20 border border-[#6FCF45]/40 text-[#6FCF45] text-xs font-bold uppercase tracking-widest mb-3">
            <MapPin className="w-3.5 h-3.5" />
            <span>{destination.country}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white">
            {destination.name}
          </h1>
          <p className="mt-2 text-base sm:text-lg text-[#FAF8F2]/90 font-medium max-w-xl">
            {destination.tagline}
          </p>
        </div>
      </div>

      {/* Overview & Quick Facts */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Description */}
          <div className="lg:col-span-8 bg-[#0B241E] border border-white/10 rounded-[8px] p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-4">About {destination.name}</h2>
            <p className="text-sm sm:text-base text-[#A8B5AF] leading-relaxed">
              {destination.description}
            </p>

            <div className="mt-8 border-t border-white/10 pt-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#6FCF45] mb-4">
                CURATED HIGHLIGHTS &amp; EXPERIENCES
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {destination.highlights?.map((h, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-white/90">
                    <CheckCircle2 className="w-4 h-4 text-[#6FCF45] shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Facts Card */}
          <div className="lg:col-span-4 bg-[#12382E] border border-white/15 rounded-[8px] p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#6FCF45] mb-4">
                EXPEDITION ESSENTIALS
              </h3>
              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3 pb-3 border-b border-white/10">
                  <Sun className="w-4 h-4 text-[#6FCF45] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#A8B5AF] block">Climate &amp; Weather</span>
                    <span className="font-semibold text-white">{destination.weather}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 pb-3 border-b border-white/10">
                  <Calendar className="w-4 h-4 text-[#6FCF45] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#A8B5AF] block">Best Travel Window</span>
                    <span className="font-semibold text-white">{destination.bestTime}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-[#6FCF45] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#A8B5AF] block">Starting Tariff</span>
                    <span className="font-bold text-white text-base">
                      ${destination.startingPrice} <span className="text-xs text-[#A8B5AF] font-normal">/ person</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Button to="/custom-trip" variant="primary" size="md" className="w-full mt-6">
              Plan Custom Trip to {destination.name}
            </Button>
          </div>
        </div>

        {/* Featured Tours in this Destination */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Signature Tours in <span className="text-[#6FCF45]">{destination.name}</span>
            </h2>
            <Link to="/tours" className="text-xs font-bold uppercase tracking-widest text-[#6FCF45] hover:text-white flex items-center gap-1">
              <span>All Tours ({tours.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {tours.length === 0 ? (
            <div className="bg-[#0B241E] border border-white/10 rounded-[12px] p-8 sm:p-12 text-center max-w-xl mx-auto">
              <Sparkles className="w-10 h-10 text-[#6FCF45] mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-2 font-heading">
                Exclusive Bespoke Expeditions for {destination.name}
              </h3>
              <p className="text-xs sm:text-sm text-[#A8B5AF] leading-relaxed mb-6">
                Our Private Curators craft bespoke private itineraries for {destination.name} tailored to your schedule and preferences.
              </p>
              <Button to="/custom-trip" variant="primary" size="md">
                Plan Custom Trip to {destination.name}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {tours.map((t) => (
                <TourCard key={t.id || t.slug} tour={t} className="h-full" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DestinationDetails
