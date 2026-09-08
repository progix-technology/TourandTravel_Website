import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Search,
  Menu,
  X,
  Heart,
  User,
  Phone,
  Plane,
  ChevronLeft,
  Map,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'
import { useSettings } from '../context/SettingsContext'
import logoImg from '../assets/images/logo.png'

// Crisp vector social icons matching Footer & UI aesthetic
const FacebookIcon = () => (
  <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const YoutubeIcon = () => (
  <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" />
  </svg>
)

const InstagramIcon = () => (
  <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
)

const WhatsAppOutlineIcon = ({ className = "w-6 h-6 sm:w-7 sm:h-7" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.274-.101-.473-.15-.673.149-.199.299-.772.966-.946 1.165-.175.2-.349.224-.65.074-.3-.15-1.267-.465-2.413-1.485-.893-.795-1.496-1.777-1.67-2.076-.175-.3-.018-.462.132-.61.135-.134.3-.349.45-.523.15-.175.2-.299.3-.499.1-.2.05-.374-.025-.523s-.673-1.62-.923-2.217c-.243-.583-.49-.503-.673-.513-.174-.01-.373-.01-.573-.01-.2 0-.524.075-.798.374s-1.047 1.022-1.047 2.492 1.072 2.89 1.222 3.09c.15.199 2.11 3.22 5.11 4.515.714.309 1.272.493 1.707.63.718.228 1.371.196 1.888.118.577-.087 1.767-.722 2.016-1.42.249-.697.249-1.295.174-1.419-.074-.125-.274-.199-.574-.349z" />
    <path d="M12 2a10 10 0 0 0-8.58 15.14L2 22l4.99-1.31A10 10 0 1 0 12 2z" />
  </svg>
)

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { user, isAuthenticated } = useAuth()
  const { wishlist } = useWishlist()
  const { settings } = useSettings()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
    setSearchModalOpen(false)
  }, [location.pathname])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/tours?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchModalOpen(false)
      setSearchQuery('')
    }
  }

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'DESTINATIONS', path: '/destinations' },
    { name: 'PACKAGES', path: '/tours' },
    { name: 'ABOUT US', path: '/about' },
    { name: 'GALLERY', path: '/gallery' },
    { name: 'CONTACT US', path: '/contact' },
  ]

  const cleanPhone = (settings.whatsappNumber || settings.inquiryPhone || '918953208952').replace(/[^0-9]/g, '')
  const displayPhone = settings.inquiryPhone || '+91 89532 08952'
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
          isAuthPage
            ? 'bg-transparent border-none shadow-none pointer-events-auto'
            : isScrolled
            ? '-translate-y-full opacity-0 pointer-events-none'
            : 'translate-y-0 opacity-100 bg-transparent'
        }`}
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {/* ========================================================================= */}
        {/* TIER 1: TOP BRAND & UTILITY BAR                                           */}
        {/* ========================================================================= */}
        <div className="w-full py-3 sm:py-3.5 border-b border-white/10">
          <div className="w-full px-4 sm:px-8 lg:px-12 flex items-center justify-between">
            
            {/* 1. LEFT: WhatsApp Outline Icon Button (Matching Right Icons Style) */}
            <div className="hidden sm:flex flex-1 items-center justify-start">
              <a
                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent('Hello Tours & Travels Concierge! I would like to inquire about a custom luxury journey.')}`}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp Concierge"
                title="Chat on WhatsApp"
                className="text-white/90 hover:text-[#6FCF45] transition-all p-1 focus:outline-none cursor-pointer hover:scale-110 active:scale-95 flex items-center justify-center"
              >
                <WhatsAppOutlineIcon className="w-6 h-6 sm:w-7 sm:h-7" />
              </a>
            </div>

            {/* 2. CENTER / LEFT (on mobile): Full Horizontal Brand Logo */}
            <div className="flex-shrink-0 flex items-center justify-start sm:justify-center">
              <Link to="/" className="flex items-center gap-2.5 sm:gap-3.5 group focus:outline-none">
                <img
                  src={logoImg}
                  alt="Tours &amp; Travels Logo"
                  className="h-7 sm:h-9 md:h-10 w-auto object-contain drop-shadow-[0_2px_10px_rgba(111,207,69,0.4)] transition-transform duration-300 group-hover:scale-105"
                />
                <span className="font-extrabold text-sm sm:text-xl md:text-2xl tracking-[0.2em] text-white uppercase leading-none font-heading drop-shadow-lg">
                  TOURS <span className="text-[#6FCF45]">&amp;</span> TRAVELS
                </span>
              </Link>
            </div>

            {/* 3. RIGHT: Desktop Icons + Mobile Hamburger Toggle */}
            <div className="flex-1 flex items-center justify-end">
              {/* Desktop Icons (Hidden on Mobile) */}
              <div className="hidden md:flex items-center gap-2.5 sm:gap-3">
                {/* 1. Search Icon Button (Circular) */}
                <button
                  type="button"
                  onClick={() => setSearchModalOpen(true)}
                  aria-label="Search Packages"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/25 hover:border-[#6FCF45] bg-white/5 hover:bg-[#6FCF45]/15 text-white/90 hover:text-[#6FCF45] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm focus:outline-none cursor-pointer"
                  title="Search Journeys &amp; Expeditions"
                >
                  <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />
                </button>

                {/* 2. Explore World Map Button (Circular) */}
                <Link
                  to="/explore"
                  aria-label="Explore Interactive World Map"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/25 hover:border-[#6FCF45] bg-white/5 hover:bg-[#6FCF45]/15 text-white/90 hover:text-[#6FCF45] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm focus:outline-none cursor-pointer"
                  title="Explore 400+ World Destinations on Interactive Map"
                >
                  <Map className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />
                </Link>

                {/* 3. Wishlist Icon with Dynamic Badge (Circular) */}
                <Link
                  to="/wishlist"
                  aria-label="View Saved Wishlist"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/25 hover:border-[#6FCF45] bg-white/5 hover:bg-[#6FCF45]/15 text-white/90 hover:text-[#6FCF45] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm focus:outline-none cursor-pointer relative"
                  title="Saved Wishlist Expeditions"
                >
                  <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />
                  {wishlist && wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#6FCF45] text-[#071A16] text-[10px] font-extrabold flex items-center justify-center shadow-md animate-pulse">
                      {wishlist.length}
                    </span>
                  )}
                </Link>

                {/* 4. User Account / Profile (Circular) */}
                <Link
                  to={isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/account') : '/login'}
                  aria-label={isAuthenticated ? (user?.role === 'admin' ? 'Admin Portal' : 'Client Account Portal') : 'Guest Sign In'}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/25 hover:border-[#6FCF45] bg-white/5 hover:bg-[#6FCF45]/15 text-white/90 hover:text-[#6FCF45] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm focus:outline-none cursor-pointer relative"
                  title={isAuthenticated ? `Logged in as ${user?.name || 'Explorer'} (${user?.role === 'admin' ? 'Super Admin' : 'Member'})` : 'Guest Sign In'}
                >
                  <User className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />
                </Link>
              </div>

              {/* Mobile Hamburger Toggle (Visible ONLY on Mobile) */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-white/90 hover:text-[#6FCF45] transition-colors p-1.5 rounded-lg hover:bg-white/5 focus:outline-none ml-1 cursor-pointer"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6 stroke-[2.5]" /> : <Menu className="w-6 h-6 stroke-[2.5]" />}
              </button>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* TIER 2: MAIN NAVIGATION BAR (Desktop Only - Hidden on Mobile)             */}
        {/* ========================================================================= */}
        <div className="hidden md:block py-3 sm:py-3.5">
          <div className="w-full px-4 sm:px-8 lg:px-12 flex items-center justify-between">
            
            {/* 1. LEFT: Social Icons */}
            <div className="hidden md:flex items-center gap-2.5">
              <a
                href={settings.facebookUrl || '#'}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:text-[#071A16] hover:bg-[#6FCF45] hover:border-[#6FCF45] transition-all duration-200"
              >
                <FacebookIcon />
              </a>
              <a
                href={settings.youtubeUrl || '#'}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:text-[#071A16] hover:bg-[#6FCF45] hover:border-[#6FCF45] transition-all duration-200"
              >
                <YoutubeIcon />
              </a>
              <a
                href={settings.instagramUrl || '#'}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:text-[#071A16] hover:bg-[#6FCF45] hover:border-[#6FCF45] transition-all duration-200"
              >
                <InstagramIcon />
              </a>
            </div>

            {/* 2. CENTER: Main Navigation Links */}
            <nav className="hidden md:flex items-center justify-center gap-6 lg:gap-9 px-4">
              {navLinks.map((link) => {
                const isActive =
                  link.path === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(link.path)

                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`text-[13px] lg:text-[14.5px] xl:text-[15.5px] tracking-[0.18em] uppercase whitespace-nowrap transition-all duration-200 ${
                      isActive
                        ? 'text-[#6FCF45] font-semibold border-b-2 border-[#6FCF45] pb-1'
                        : 'text-white/80 font-normal hover:text-[#6FCF45]'
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              })}
            </nav>

            {/* 3. RIGHT: BOOK NOW CTA Button */}
            <div className="flex items-center justify-end gap-3">
              <Link
                to="/custom-trip"
                className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-[13px] tracking-widest uppercase transition-all duration-300 border border-white/70 hover:border-white bg-transparent hover:bg-white/10 text-white backdrop-blur-sm shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <span>BOOK NOW</span>
              </Link>
            </div>

          </div>
        </div>

      </header>

      {/* ========================================================================= */}
      {/* FULL-SCREEN SEARCH OVERLAY MODAL                                          */}
      {/* ========================================================================= */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#071A16]/95 backdrop-blur-xl flex items-center justify-center px-4 animate-fadeIn select-none">
          <div className="w-full max-w-2xl bg-[#0F2922] border border-[#6FCF45]/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative">
            <button
              onClick={() => setSearchModalOpen(false)}
              className="absolute top-5 right-5 text-white/60 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close Search"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-xl sm:text-2xl font-bold text-white font-heading mb-6 flex items-center gap-2">
              <Search className="w-6 h-6 text-[#6FCF45]" />
              <span>Search Luxury Expeditions</span>
            </h3>

            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by destination (e.g. Kashmir, Maldives, Bali, Switzerland)..."
                className="w-full bg-[#071A16] border-2 border-[#6FCF45] rounded-full py-4 pl-6 pr-32 text-white placeholder-white/40 focus:outline-none focus:ring-4 focus:ring-[#6FCF45]/20 text-sm sm:text-base font-medium"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-6 rounded-full bg-[#6FCF45] text-[#071A16] font-bold text-xs uppercase tracking-wider hover:bg-[#85e65b] transition-colors"
              >
                Search
              </button>
            </form>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="text-xs text-white/50">Popular:</span>
              {['Kashmir', 'Maldives', 'Bali', 'Switzerland', 'Dubai', 'Rajasthan'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    navigate(`/tours?search=${encodeURIComponent(tag)}`)
                    setSearchModalOpen(false)
                  }}
                  className="text-xs px-3 py-1 rounded-full bg-white/5 hover:bg-[#6FCF45]/20 text-white/80 hover:text-[#6FCF45] border border-white/10 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MOBILE SLIDE-OVER NAVIGATION DRAWER (Compact & Integrated)                */}
      {/* ========================================================================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Backdrop Overlay (No Blur) */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 animate-fadeIn cursor-pointer"
          />

          {/* Compact Slide-over Drawer Panel */}
          <div className="fixed top-0 right-0 bottom-0 w-[310px] sm:w-[340px] max-w-[90vw] bg-[#071A16] border-l border-white/10 p-5 overflow-y-auto z-10 animate-slideLeft flex flex-col justify-start select-none shadow-2xl">
            {/* Top Bar: '<' Back Button */}
            <div className="flex items-center justify-start pb-3.5 border-b border-white/10">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#6FCF45] text-white hover:text-[#071A16] flex items-center justify-center transition-all cursor-pointer"
                aria-label="Back / Close Menu"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Quick Actions Grid: Search, Explore Map, Wishlist, User Profile (4 Compact Cards) */}
            <div className="grid grid-cols-4 gap-1.5 py-3.5 border-b border-white/10">
              {/* 1. Search */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  setSearchModalOpen(true)
                }}
                className="flex flex-col items-center justify-center gap-1 py-2.5 px-1 rounded-xl bg-white/5 border border-white/10 text-white hover:text-[#6FCF45] hover:border-[#6FCF45]/50 transition-all cursor-pointer active:scale-95"
              >
                <Search className="w-4 h-4 text-[#6FCF45]" />
                <span className="text-[9px] font-bold uppercase tracking-wider">Search</span>
              </button>

              {/* 2. Explore Map */}
              <Link
                to="/explore"
                onClick={() => setMobileMenuOpen(false)}
                className="flex flex-col items-center justify-center gap-1 py-2.5 px-1 rounded-xl bg-white/5 border border-white/10 text-white hover:text-[#6FCF45] hover:border-[#6FCF45]/50 transition-all cursor-pointer active:scale-95"
              >
                <Map className="w-4 h-4 text-[#6FCF45]" />
                <span className="text-[9px] font-bold uppercase tracking-wider">Map</span>
              </Link>

              {/* 3. Wishlist */}
              <Link
                to="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex flex-col items-center justify-center gap-1 py-2.5 px-1 rounded-xl bg-white/5 border border-white/10 text-white hover:text-[#6FCF45] hover:border-[#6FCF45]/50 transition-all relative cursor-pointer active:scale-95"
              >
                <div className="relative">
                  <Heart className="w-4 h-4 text-[#6FCF45]" />
                  {wishlist && wishlist.length > 0 && (
                    <span className="absolute -top-1.5 -right-2 w-3.5 h-3.5 rounded-full bg-[#6FCF45] text-[#071A16] text-[9px] font-extrabold flex items-center justify-center shadow-md">
                      {wishlist.length}
                    </span>
                  )}
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider">Wishlist</span>
              </Link>

              {/* 4. User Profile */}
              <Link
                to={isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/account') : '/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="flex flex-col items-center justify-center gap-1 py-2.5 px-1 rounded-xl bg-white/5 border border-white/10 text-white hover:text-[#6FCF45] hover:border-[#6FCF45]/50 transition-all cursor-pointer active:scale-95"
              >
                <User className="w-4 h-4 text-[#6FCF45]" />
                <span className="text-[9px] font-bold uppercase tracking-wider truncate max-w-[55px]">
                  {isAuthenticated ? (user?.name?.split(' ')[0] || 'Profile') : 'Sign In'}
                </span>
              </Link>
            </div>

            {/* Nav Links */}
            <nav className="flex flex-col space-y-0.5 py-2.5">
              {navLinks.map((link) => {
                const isActive =
                  link.path === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(link.path)

                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-xs font-bold tracking-[0.16em] uppercase py-2 px-3 rounded-lg transition-all ${
                      isActive
                        ? 'text-[#6FCF45] bg-white/10 border-l-4 border-[#6FCF45]'
                        : 'text-white/80 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              })}
            </nav>

            {/* Bottom CTAs: Directly underneath Nav Links */}
            <div className="pt-3.5 border-t border-white/10 space-y-2 mt-1">
              <Link
                to="/custom-trip"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-transparent hover:bg-white/10 text-white border border-white/70 hover:border-white py-2.5 rounded-full font-bold text-xs uppercase tracking-widest text-center block transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                BOOK NOW
              </Link>

              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2.5 rounded-full font-semibold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-[#6FCF45]" />
                <span>Call Now: {displayPhone}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar
