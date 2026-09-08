import React, { useState, useEffect } from 'react'
import SectionHeading from '../components/SectionHeading'
import DestinationCard from '../components/DestinationCard'
import { DESTINATIONS } from '../utils/mockData'
import destinationService from '../services/destinationService'

export const Destinations = () => {
  const [destList, setDestList] = useState(DESTINATIONS)

  useEffect(() => {
    const loadDestinations = async () => {
      try {
        const data = await destinationService.getAll()
        if (data && data.length > 0) {
          setDestList(data)
        }
      } catch (err) {
        console.warn('Fallback destinations:', err)
      }
    }
    loadDestinations()
  }, [])

  // Asymmetrical grid arrangement from dynamic list with fallbacks
  const kashmir = destList.find((d) => (d.slug || d.id) === 'kashmir') || destList[0]
  const maldives = destList.find((d) => (d.slug || d.id) === 'maldives') || destList[1] || destList[0]
  const bali = destList.find((d) => (d.slug || d.id) === 'bali') || destList[2] || destList[0]
  const rajasthan = destList.find((d) => (d.slug || d.id) === 'rajasthan') || destList[3] || destList[0]
  const dubai = destList.find((d) => (d.slug || d.id) === 'dubai') || destList[4] || destList[0]
  const paris = destList.find((d) => (d.slug || d.id) === 'paris') || destList[5] || destList[0]

  return (
    <section id="destinations" className="relative bg-[#FAF8F2] text-[#13251F] pt-8 sm:pt-14 lg:pt-56 pb-14 sm:pb-20 lg:pb-28 z-10">
      <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Section Heading with VIEW ALL → link (without DESTINATIONS eyebrow) */}
        <SectionHeading
          title="Where Will You Go Next?"
          subtitle="From the snow-crowned valleys of the Himalayas to secluded coral lagoons, discover handpicked sanctuaries."
          linkText="VIEW ALL"
          linkTo="/destinations"
          theme="light"
        />

        {/* Asymmetrical Travel Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6 items-start">
          {/* Column 1 (Left: Kashmir Tall + Bali Medium) */}
          <div className="md:col-span-6 lg:col-span-5 flex flex-col gap-5 lg:gap-6">
            {/* Kashmir - Tall */}
            <DestinationCard destination={kashmir} aspect="tall" />
            {/* Bali - Medium */}
            <DestinationCard destination={bali} aspect="medium" />
          </div>

          {/* Column 2 (Right: Maldives Wide + Rajasthan Wide + Dubai Tall / Paris Small Split) */}
          <div className="md:col-span-6 lg:col-span-7 flex flex-col gap-5 lg:gap-6">
            {/* Maldives - Wide */}
            <DestinationCard destination={maldives} aspect="wide" />

            {/* Split row: Dubai Tall + Paris Small */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 lg:gap-6">
              <div className="sm:col-span-7">
                <DestinationCard destination={dubai} aspect="tall" />
              </div>
              <div className="sm:col-span-5 flex flex-col gap-5 lg:gap-6">
                <DestinationCard destination={paris} aspect="small" />
                <DestinationCard destination={rajasthan} aspect="small" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Destinations
