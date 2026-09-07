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
    { name: 'ABOUT US', path: '/about' },
    { name: 'DESTINATIONS', path: '/destinations' },
    { name: 'PACKAGES', path: '/tours' },
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
            
            {/* 1. LEFT: WhatsApp Quick Call Pill (Desktop Only) */}
            <div className="hidden sm:flex flex-1 items-center justify-start">
              <a
                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent('Hello Tours & Travels Concierge! I would like to inquire about a custom luxury journey.')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#0B241E]/80 hover:bg-[#071A16] border border-[#6FCF45]/30 hover:border-[#6FCF45] transition-all duration-300 shadow-sm group cursor-pointer"
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-xs group-hover:scale-110 transition-transform">
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 0C5.395 0 .013 5.384.013 12.019c0 2.119.553 4.186 1.606 6.009L0 24l6.167-1.618a11.96 11.96 0 0 0 5.864 1.528h.005c6.634 0 12.016-5.383 12.016-12.018C24.052 5.384 18.666 0 12.031 0zm0 22.003h-.004a9.97 9.97 0 0 1-5.086-1.39l-.365-.216-3.778.991 1.008-3.684-.237-.377a9.93 9.93 0 0 1-1.527-5.308c0-5.503 4.478-9.981 9.993-9.981 2.666 0 5.172 1.039 7.058 2.925a9.92 9.92 0 0 1 2.925 7.058c0 5.504-4.479 9.982-9.989 9.982zm5.474-7.481c-.3-.15-1.774-.876-2.049-.976-.275-.1-.475-.15-.675.15-.2.3-.775.976-.95 1.176-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.413-1.488-.892-.796-1.494-1.78-1.669-2.08-.175-.3-.019-.462.131-.611.135-.134.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525s-.675-1.626-.925-2.226c-.244-.585-.492-.505-.675-.515-.175-.01-.375-.01-.575-.01s-.525.075-.8.375c-.275.3-1.05 1.026-1.05 2.502s1.075 2.902 1.225 3.102c.15.2 2.116 3.23 5.127 4.53 3.011 1.3 3.011.867 3.561.817.55-.05 1.774-.725 2.024-1.426.25-.7.25-1.301.175-1.426-.075-.125-.275-.2-.575-.35z" />
                  </svg>
                </div>
                <span className="text-xs sm:text-[13px] md:text-[14px] font-black text-white tracking-wider font-sans">
                  {displayPhone}
                </span>
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
              <div className="hidden md:flex items-center gap-4 sm:gap-6">
                {/* Search Icon Button */}
                <button
                  type="button"
                  onClick={() => setSearchModalOpen(true)}
                  aria-label="Search Packages"
                  className="text-white/90 hover:text-[#6FCF45] transition-all p-1 focus:outline-none cursor-pointer hover:scale-110 active:scale-95"
                  title="Search Journeys &amp; Expeditions"
                >
                  <Search className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
                </button>

                {/* Wishlist Icon with Dynamic Badge */}
                <Link
                  to="/wishlist"
                  aria-label="View Saved Wishlist"
                  className="text-white/90 hover:text-[#6FCF45] transition-all p-1 relative focus:outline-none cursor-pointer hover:scale-110 active:scale-95"
                  title="Saved Wishlist Expeditions"
                >
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
                  {wishlist && wishlist.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#6FCF45] text-[#071A16] text-[10px] font-extrabold flex items-center justify-center shadow-md animate-pulse">
                      {wishlist.length}
                    </span>
                  )}
                </Link>

                {/* User Account / Profile */}
                <Link
                  to={isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/account') : '/login'}
                  aria-label={isAuthenticated ? (user?.role === 'admin' ? 'Admin Portal' : 'Client Account Portal') : 'Guest Sign In'}
                  className="flex items-center gap-2 text-white/90 hover:text-[#6FCF45] transition-all p-1 focus:outline-none cursor-pointer hover:scale-110 active:scale-95"
                  title={isAuthenticated ? `Logged in as ${user?.name || 'Explorer'} (${user?.role === 'admin' ? 'Super Admin' : 'Member'})` : 'Guest Sign In'}
                >
                  <User className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
                  {isAuthenticated && (
                    <span className="hidden xl:inline text-xs font-extrabold uppercase tracking-wider text-[#6FCF45] max-w-[95px] truncate">
                      {user?.name?.split(' ')[0] || 'VIP'}
                    </span>
                  )}
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

            {/* Quick Actions Grid: Search, Wishlist, User Profile (3 Compact Cards) */}
            <div className="grid grid-cols-3 gap-2 py-3.5 border-b border-white/10">
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
                <span className="text-[9.5px] font-bold uppercase tracking-wider">Search</span>
              </button>

              {/* 2. Wishlist */}
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
                <span className="text-[9.5px] font-bold uppercase tracking-wider">Wishlist</span>
              </Link>

              {/* 3. User Profile */}
              <Link
                to={isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/account') : '/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="flex flex-col items-center justify-center gap-1 py-2.5 px-1 rounded-xl bg-white/5 border border-white/10 text-white hover:text-[#6FCF45] hover:border-[#6FCF45]/50 transition-all cursor-pointer active:scale-95"
              >
                <User className="w-4 h-4 text-[#6FCF45]" />
                <span className="text-[9.5px] font-bold uppercase tracking-wider truncate max-w-[70px]">
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
