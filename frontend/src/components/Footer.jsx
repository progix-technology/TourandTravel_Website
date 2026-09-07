import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Compass,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Check,
} from 'lucide-react'
import logoImg from '../assets/images/logo.png'
import Button from './Button'
import { useSettings } from '../context/SettingsContext'

// SVG Social Icons
const InstagramIcon = () => (
  <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
)

const TwitterIcon = () => (
  <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

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

const LinkedinIcon = () => (
  <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

export const Footer = () => {
  const { settings } = useSettings()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 4000)
    }
  }

  return (
    <footer className="bg-[#040F0D] text-white border-t border-white/10 pt-16 md:pt-20 pb-12">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-14 border-b border-white/10">
          {/* Brand & Newsletter (Span 2 cols on lg) */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div>
              <Link to="/" className="inline-flex items-center gap-3 group">
                <img
                  src={logoImg}
                  alt="Tours &amp; Travels Logo"
                  className="w-10 h-10 object-contain drop-shadow-[0_2px_10px_rgba(111,207,69,0.35)] transition-transform duration-300 group-hover:scale-105"
                />
                <div className="flex flex-col">
                  <span className="font-extrabold text-base tracking-[0.18em] text-white uppercase leading-none">
                    TOURS <span className="text-[#6FCF45]">&amp;</span> TRAVELS
                  </span>
                  <span className="text-[9px] tracking-[0.25em] text-[#A8B5AF] uppercase font-medium mt-1">
                    Customized Journeys Worldwide
                  </span>
                </div>
              </Link>

              <p className="mt-5 text-xs sm:text-sm text-[#A8B5AF] max-w-sm leading-relaxed">
                Curating extraordinary luxury expeditions, rare retreats, and tailored itineraries for discerning modern explorers across the globe.
              </p>
            </div>

            {/* 24/7 VIP Concierge & Quick Dispatch */}
            <div className="mt-7">
              <div className="inline-flex items-center gap-2 mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#6FCF45]">
                <span className="w-2 h-2 rounded-full bg-[#6FCF45] shadow-[0_0_6px_#6FCF45]" />
                <span>24/7 PRIVATE CONCIERGE</span>
              </div>
              
              <p className="text-xs text-[#A8B5AF] mb-4 max-w-sm leading-relaxed">
                Connect directly with our master curators for instant tailored itineraries, private villa locks, and VIP flight transfers.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={`https://wa.me/${(settings.whatsappNumber || settings.inquiryPhone || '918953208952').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello Tours & Travels Concierge! I would like to inquire about a custom luxury journey.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[4px] bg-[#6FCF45] hover:bg-[#5eb937] text-[#071A16] font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#6FCF45]/20 active:scale-95 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>WhatsApp Concierge</span>
                </a>

                <Link
                  to="/custom-trip"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[4px] bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer"
                >
                  <span>Plan Itinerary</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#6FCF45]" />
                </Link>
              </div>
            </div>
          </div>

          {/* EXPLORE Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#6FCF45] mb-4">
              EXPLORE
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A8B5AF]">
              <li>
                <Link to="/destinations" className="hover:text-white transition-colors">
                  Destinations
                </Link>
              </li>
              <li>
                <Link to="/tours" className="hover:text-white transition-colors">
                  Signature Tours
                </Link>
              </li>
              <li>
                <Link to="/custom-trip" className="hover:text-white transition-colors">
                  Custom Trip Builder
                </Link>
              </li>
              <li>
                <Link to="/tours" className="hover:text-white transition-colors">
                  Curated Experiences
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-white transition-colors">
                  Travel Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* COMPANY Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#6FCF45] mb-4">
              COMPANY
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A8B5AF]">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Tour &amp; Travels
                </Link>
              </li>
              <li>
                <Link to="/pillars" className="hover:text-white transition-colors">
                  The 4 Pillars
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Concierge
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Our Curators &amp; Ethos
                </Link>
              </li>
              <li>
                <Link to="/policy?tab=terms" className="hover:text-white transition-colors">
                  Terms &amp; Governance
                </Link>
              </li>
              <li>
                <Link to="/destinations" className="hover:text-white transition-colors">
                  Global Sanctuaries
                </Link>
              </li>
              <li>
                <Link to="/sitemap" className="hover:text-white transition-colors">
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#6FCF45] mb-4">
              CONTACT &amp; OFFICE
            </h4>
            <ul className="space-y-3 text-xs text-[#A8B5AF]">
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#6FCF45] shrink-0 mt-0.5" />
                <a
                  href={`mailto:${settings.supportEmail}`}
                  className="hover:text-white transition-colors break-all"
                >
                  {settings.supportEmail}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#6FCF45] shrink-0" />
                <a href={`tel:${settings.inquiryPhone.replace(/\s+/g, '')}`} className="hover:text-white transition-colors">
                  {settings.inquiryPhone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#6FCF45] shrink-0 mt-0.5" />
                <Link to="/contact" className="hover:text-white transition-colors">
                  {settings.officeAddress} (View Map →)
                </Link>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="mt-6 flex items-center gap-3">
              {[
                { icon: InstagramIcon, href: settings.instagramUrl || 'https://instagram.com', label: 'Instagram' },
                { icon: TwitterIcon, href: settings.twitterUrl || 'https://twitter.com', label: 'Twitter' },
                { icon: FacebookIcon, href: settings.facebookUrl || 'https://facebook.com', label: 'Facebook' },
                { icon: YoutubeIcon, href: settings.youtubeUrl || 'https://youtube.com', label: 'YouTube' },
                { icon: LinkedinIcon, href: settings.linkedinUrl || 'https://linkedin.com', label: 'LinkedIn' },
              ].map((s, idx) => {
                const Icon = s.icon
                return (
                  <a
                    key={idx}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="w-8 h-8 rounded-[3px] bg-white/5 border border-white/10 flex items-center justify-center text-[#A8B5AF] hover:text-[#071A16] hover:bg-[#6FCF45] hover:border-[#6FCF45] transition-all duration-200"
                  >
                    <Icon />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A8B5AF]/70">
          <p>© {new Date().getFullYear()} TOURS &amp; TRAVELS. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/policy?tab=terms" className="hover:text-[#6FCF45] transition-colors">
              Terms of Expedition
            </Link>
            <Link to="/policy?tab=privacy" className="hover:text-[#6FCF45] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/policy?tab=eco" className="hover:text-[#6FCF45] transition-colors">
              Eco-Conscious Travel
            </Link>
            <Link to="/sitemap" className="hover:text-[#6FCF45] transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
