import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { TOURS, DESTINATIONS } from '../utils/mockData'
import tourService from '../services/tourService'
import destinationService from '../services/destinationService'

export const SitemapPage = () => {
  const [tours, setTours] = useState(TOURS)
  const [destinations, setDestinations] = useState(DESTINATIONS)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [liveTours, liveDests] = await Promise.all([
          tourService.getAll(),
          destinationService.getAll(),
        ])
        if (Array.isArray(liveTours) && liveTours.length > 0) setTours(liveTours)
        if (Array.isArray(liveDests) && liveDests.length > 0) setDestinations(liveDests)
      } catch (e) {
        console.warn('Sitemap live fetch error, using fallback:', e)
      }
    }
    loadData()
  }, [])

  const sitemapData = [
    {
      category: 'Main Pages',
      links: [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about' },
        { name: 'Tour Packages', path: '/tours' },
        { name: 'Destinations', path: '/destinations' },
        { name: 'The 4 Pillars of Excellence', path: '/pillars' },
        { name: 'Custom Trip Planner', path: '/custom-trip' },
        { name: 'Travel Gallery', path: '/gallery' },
        { name: 'Wishlist', path: '/wishlist' },
        { name: 'Contact Concierge', path: '/contact' },
      ],
    },
    {
      category: 'The 4 Pillars',
      links: [
        { name: 'Pillars Overview', path: '/pillars' },
        { name: 'Tailored Craftsmanship', path: '/pillars/tailored-craftsmanship' },
        { name: '24/7 Dedicated Concierge', path: '/pillars/concierge-support' },
        { name: 'Vetted 5-Star Sanctuaries', path: '/pillars/vetted-sanctuaries' },
        { name: 'Sustainable Luxury & Stewardship', path: '/pillars/sustainable-luxury' },
      ],
    },
    {
      category: 'Tour Packages',
      links: tours.map((t) => ({
        name: t.title,
        path: `/tours/${t.slug || t.id}`,
      })),
    },
    {
      category: 'Destinations',
      links: destinations.map((d) => ({
        name: `${d.title || d.name}, ${d.country}`,
        path: `/destinations/${d.slug || d.id}`,
      })),
    },
    {
      category: 'Account & Portal',
      links: [
        { name: 'Login / Sign In', path: '/login' },
        { name: 'Create Account', path: '/register' },
        { name: 'Explorer Profile', path: '/account' },
        { name: 'My Bookings', path: '/account/bookings' },
        { name: 'Saved Wishlist', path: '/wishlist' },
      ],
    },
    {
      category: 'Policies & Legal',
      links: [
        { name: 'Terms of Expedition', path: '/policy?tab=terms' },
        { name: 'Privacy Policy', path: '/policy?tab=privacy' },
        { name: 'Eco-Conscious Travel', path: '/policy?tab=eco' },
        { name: 'Cancellation Policy', path: '/policy?tab=cancellation' },
      ],
    },
  ]

  return (
    <div className="bg-[#FAF8F2] text-[#13251F] min-h-screen select-none text-left">
      {/* ========================================================================= */}
      {/* 1. TOP DARK HERO BANNER (Provides dark backdrop for transparent Navbar)   */}
      {/* ========================================================================= */}
      <div className="relative w-full bg-[#071A16] text-white pt-32 sm:pt-36 pb-10 sm:pb-12 px-4 sm:px-6 lg:px-8 border-b border-white/10 shadow-lg overflow-hidden">
        {/* Subtle dark ambient accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#12382E]/40 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#0B241E]/50 rounded-full blur-3xl pointer-events-none z-0" />

        <div className="max-w-[1140px] mx-auto relative z-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#A8B5AF] uppercase tracking-wider mb-2">
            <Link to="/" className="hover:text-[#6FCF45] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#6FCF45]">Sitemap</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
            Sitemap
          </h1>
          <p className="text-sm text-[#A8B5AF] mt-1.5 font-normal">
            A simple, complete directory of all pages and links on Tour &amp; Travels.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SITEMAP DIRECTORY CONTENT (Exact same structure & style)               */}
      {/* ========================================================================= */}
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {sitemapData.map((group, idx) => (
            <div key={idx}>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#2E4A35] pb-2 border-b border-[#E5E0D5] mb-4">
                {group.category}
              </h2>
              <ul className="space-y-2 text-sm text-[#5C6E67]">
                {group.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link
                      to={link.path}
                      className="hover:text-[#2E4A35] hover:underline transition-colors block py-0.5"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SitemapPage
