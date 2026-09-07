import React from 'react'
import { Link } from 'react-router-dom'
import {
  Compass,
  ShieldCheck,
  HeartHandshake,
  Sparkles,
  Globe,
  Award,
  Users,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Clock,
  Gem,
  Trees,
  User,
} from 'lucide-react'
import { motion } from 'framer-motion'
import Button from '../components/Button'
import GradientCard from '../components/ui/GradientCard'

import imgTailored from '../assets/images/3d_Images/tailored_cartmanship.png'
import imgConcierge from '../assets/images/3d_Images/Concierge.png'
import imgSanctuaries from '../assets/images/3d_Images/Sanctuaries.png'
import imgSustainable from '../assets/images/3d_Images/sustainable_luxry.png'
import tripImg from '../assets/images/trip.png'

export const AboutPage = () => {
  const stats = [
    { label: 'Years of Luxury Mastery', value: '12+' },
    { label: 'Curated World Sanctuaries', value: '38+' },
    { label: 'Happy Global Explorers', value: '50,000+' },
    { label: 'Guest Satisfaction Index', value: '99.8%' },
  ]

  const pillars = [
    {
      badgeText: '100% Bespoke Craft',
      badgeColor: '#F59E0B',
      title: 'Tailored Craftsmanship',
      description: 'No two journeys are identical. Every itinerary is meticulously customized around your personal rhythm, passions, and culinary preferences.',
      ctaText: 'Explore Pillar',
      ctaHref: '/pillars?pillar=tailored-craftsmanship',
      imageUrl: imgTailored,
      gradient: 'orange',
    },
    {
      badgeText: '24/7 VIP Support',
      badgeColor: '#10B981',
      title: '24/7 Dedicated Concierge',
      description: 'From private airport fast-tracks to spontaneous helicopter transfers, your dedicated concierge is with you around the clock.',
      ctaText: 'Explore Pillar',
      ctaHref: '/pillars?pillar=concierge-support',
      imageUrl: imgConcierge,
      gradient: 'emerald',
    },
    {
      badgeText: 'Vetted Sanctuaries',
      badgeColor: '#8B5CF6',
      title: 'Vetted 5-Star Sanctuaries',
      description: 'We personally inspect every overwater villa, mountain chalet, and royal heritage palace to ensure unmatched comfort and privacy.',
      ctaText: 'Explore Pillar',
      ctaHref: '/pillars?pillar=vetted-sanctuaries',
      imageUrl: imgSanctuaries,
      gradient: 'purple',
    },
    {
      badgeText: 'Eco Stewardship',
      badgeColor: '#0D9488',
      title: 'Sustainable Luxury & Stewardship',
      description: 'We partner with local conservationists, eliminate single-use plastics, and channel a portion of every booking toward environmental heritage.',
      ctaText: 'Explore Pillar',
      ctaHref: '/pillars?pillar=sustainable-luxury',
      imageUrl: imgSustainable,
      gradient: 'teal',
    },
  ]

  const team = [
    {
      name: 'Vivang Mishra',
      role: 'Founder & Principal Expedition Architect',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      bio: 'Over a decade designing high-touch journeys for discerning travelers across 40+ countries.',
    },
    {
      name: 'Elena Rostova',
      role: 'Head of European & Alpine Curations',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
      bio: 'Former luxury sommelier and private chalet manager in Zermatt and the French Riviera.',
    },
    {
      name: 'Rajesh Nair',
      role: 'Subcontinent & Himalayan Specialist',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      bio: 'Deep-rooted heritage curator with exclusive access to royal palaces and sacred Himalayan trails.',
    },
  ]

  return (
    <div className="bg-[#FAF8F2] text-[#13251F] min-h-screen select-none">
      {/* 1. Full-Width Cinematic Hero Banner (Exact Same Height & Layout as Tours Page) */}
      <div className="relative w-full bg-[#071A16] text-white pt-28 sm:pt-36 pb-12 sm:pb-16 min-h-[560px] sm:min-h-[590px] lg:min-h-[610px] flex flex-col justify-center px-4 sm:px-6 lg:px-12 overflow-hidden shadow-2xl border-b border-white/10 mb-10 sm:mb-12">
        {/* Background Luxury Heritage Banner Image Asset (100% Edge-to-Edge) */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=85"
            alt="About Tour and Travels Banner"
            className="w-full h-full object-cover object-center scale-105"
          />
          {/* Transparent Layered Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#071A16]/90 via-black/35 to-[#071A16]/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071A16]/85 via-[#071A16]/45 to-transparent" />
          <div className="absolute inset-0 bg-black/15" />
        </div>

        {/* Ambient emerald radial glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#6FCF45]/15 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-0 left-10 w-[500px] h-[500px] bg-[#12382E]/40 rounded-full blur-3xl pointer-events-none z-0" />

        {/* Left-Aligned Constrained Content Container */}
        <div className="max-w-[1440px] w-full mx-auto relative z-10 text-left">
          <div className="max-w-3xl text-left">
            <div className="inline-flex items-center gap-2.5 mb-3 text-xs uppercase tracking-[0.25em] font-bold text-[#6FCF45] font-heading drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
              <span className="w-6 h-[2px] bg-[#6FCF45]" />
              <span>OUR HERITAGE &amp; ETHOS</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading leading-[1.1] text-left drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              Redefining the Art of <br />
              <span className="text-[#6FCF45]">Extraordinary Travel.</span>
            </h1>

            <p className="mt-3.5 text-xs sm:text-sm md:text-base text-white/90 max-w-2xl leading-relaxed font-normal text-left drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Tour &amp; Travels was born out of a passionate quest: to replace cookie-cutter tourism with soul-stirring, slow-paced luxury journeys that leave indelible marks on your soul.
            </p>
          </div>

          {/* Action Strip (Matches Search Bar border position in ToursPage) */}
          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center gap-4">
            <Link
              to="/destinations"
              className="bg-[#6FCF45] hover:bg-[#5eb937] text-[#071A16] px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-lg shadow-[#6FCF45]/20 active:scale-95"
            >
              Explore Destinations
            </Link>
            <Link
              to="/contact"
              className="bg-[#0B241E]/80 hover:bg-[#12382E] text-white border border-white/20 px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 backdrop-blur-md active:scale-95"
            >
              Contact Concierge
            </Link>
          </div>

          {/* Core Heritage Pillars Row */}
          <div className="mt-5 flex flex-wrap items-center gap-2 pt-2">
            {[
              { label: '100% Tailored Itineraries', icon: Gem },
              { label: '24/7 Dedicated Concierge', icon: Clock },
              { label: 'Vetted 5-Star Sanctuaries', icon: ShieldCheck },
              { label: 'Sustainable Luxury', icon: Trees },
              { label: '99.8% Guest Satisfaction', icon: Award },
            ].map((pill, idx) => {
              const Icon = pill.icon
              return (
                <div
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full bg-[#0B241E]/80 text-[#A8B5AF] border border-white/15 backdrop-blur-md"
                >
                  <Icon className="w-3.5 h-3.5 text-[#6FCF45]" />
                  <span>{pill.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area with Crisp Green Outline Boxes */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pb-28 sm:pb-36">

        {/* 2. Key Numbers & Stats Grid with Green Outlines */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-20">
          {stats.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.15, type: 'spring', bounce: 0.4 }}
              className="bg-white rounded-[20px] p-6 sm:p-8 text-center border-2 border-[#6FCF45] shadow-[0_4px_20px_rgba(111,207,69,0.08)] hover:shadow-[0_15px_35px_rgba(111,207,69,0.2)] hover:border-[#58B832] flex flex-col items-center justify-center group transition-all duration-300"
            >
              <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2E4A35] font-heading group-hover:text-[#6FCF45] transition-colors">
                {item.value}
              </span>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#5C6E67] mt-2 font-heading">
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* 3. The Story & Philosophy Section with Green Outlines */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-24">
          <div className="lg:col-span-6 relative">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative rounded-[24px] overflow-hidden shadow-2xl border-2 border-[#6FCF45]"
            >
              <img
                src="https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1200&q=85"
                alt="Our Travel Philosophy"
                className="w-full h-[400px] sm:h-[480px] object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071A16]/85 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#6FCF45]/20 border border-[#6FCF45]/50 text-[#6FCF45] text-[11px] font-extrabold uppercase tracking-widest mb-2 backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Unrivaled Access</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-heading">Private Islands to High Himalayan Valleys</h3>
              </div>
            </motion.div>
            {/* Offset Floating Badge with Green Outline */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.5 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.4, type: 'spring', bounce: 0.5 }}
              className="absolute -bottom-6 -right-4 sm:-right-6 bg-[#071A16] text-white p-5 rounded-2xl shadow-2xl border-2 border-[#6FCF45] hidden sm:flex items-center gap-3"
            >
              <div className="w-12 h-12 rounded-xl bg-[#6FCF45] flex items-center justify-center text-[#071A16] shadow-md shadow-[#6FCF45]/30">
                <Award className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <div className="text-sm font-bold font-heading text-white">Certified Luxury</div>
                <div className="text-[11px] text-[#A8B5AF]">Verified Expeditions Partner</div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-6 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-[#6FCF45]/15 border border-[#6FCF45]/30">
              <span className="w-2 h-2 rounded-full bg-[#6FCF45] shadow-[0_0_6px_#6FCF45]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#2E4A35] font-heading">
                WHO WE ARE
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#13251F] font-heading tracking-tight leading-tight mt-1">
              We don’t just book vacations. <br />
              <span className="text-[#2E4A35]">We architect lifelong memories.</span>
            </h2>

            <p className="mt-4 text-sm sm:text-base text-[#5C6E67] leading-relaxed">
              Founded by passionate global wanderers and hospitality veterans, Tour &amp; Travels is built on deep local connections. Whether arranging a private dinner inside a 10th-century Rajasthani fortress or chartering an ice-class catamaran through Icelandic fjords, our focus remains on authenticity, privacy, and impeccable service.
            </p>

            <div className="mt-6 space-y-3">
              {[
                'Handcrafted itineraries with zero cookie-cutter templates',
                'Private chauffeur SUVs & vetted local expert guides',
                'Complimentary room upgrades & VIP welcome amenities',
                'Complete financial protection & transparent fair pricing',
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-[#13251F]">
                  <CheckCircle2 className="w-4 h-4 text-[#4F8F45] shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Four Core Pillars with 3D Luxury Gradient Cards */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 mb-2 px-3.5 py-1 rounded-full bg-[#6FCF45]/15 border border-[#6FCF45]/30">
              <span className="w-2 h-2 rounded-full bg-[#6FCF45] shadow-[0_0_6px_#6FCF45]" />
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#2E4A35] font-heading">
                OUR COMMITMENT
              </span>
              <span className="w-2 h-2 rounded-full bg-[#6FCF45] shadow-[0_0_6px_#6FCF45]" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#13251F] font-heading tracking-tight mt-1">
              The 4 Pillars of <span className="text-[#2E4A35]">Tour &amp; Travels</span>
            </h2>
            <Link
              to="/pillars"
              className="inline-flex items-center gap-1.5 mt-2.5 text-xs font-extrabold text-[#2E4A35] hover:text-[#13251F] uppercase tracking-wider group transition-colors font-heading"
            >
              <span>Explore Interactive 4 Pillars Hub</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {pillars.map((card, idx) => (
              <GradientCard
                key={idx}
                badgeText={card.badgeText}
                badgeColor={card.badgeColor}
                title={card.title}
                description={card.description}
                ctaText={card.ctaText}
                ctaHref={card.ctaHref}
                imageUrl={card.imageUrl}
                gradient={card.gradient}
              />
            ))}
          </div>
        </div>

        {/* 5. Expedition Curators / Leadership Team with Green Outlines */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 mb-2 px-3.5 py-1 rounded-full bg-[#6FCF45]/15 border border-[#6FCF45]/30">
              <span className="w-2 h-2 rounded-full bg-[#6FCF45] shadow-[0_0_6px_#6FCF45]" />
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#2E4A35] font-heading">
                MEET THE MINDS
              </span>
              <span className="w-2 h-2 rounded-full bg-[#6FCF45] shadow-[0_0_6px_#6FCF45]" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#13251F] font-heading tracking-tight mt-1">
              Our Master Curators
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <div
                key={idx}
                className="bg-white rounded-[22px] overflow-hidden border-2 border-[#6FCF45] shadow-[0_4px_20px_rgba(111,207,69,0.08)] hover:shadow-[0_15px_35px_rgba(111,207,69,0.2)] hover:border-[#58B832] transition-all duration-300 flex flex-col group"
              >
                <div className="h-64 w-full overflow-hidden bg-[#E5E0D5]/40 border-b-2 border-[#6FCF45]/30 flex items-center justify-center animate-pulse">
                  <User className="w-24 h-24 text-[#5C6E67]/30" />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#13251F] group-hover:text-[#2E4A35] font-heading transition-colors">
                      {member.name}
                    </h3>
                    <span className="inline-block text-xs font-extrabold uppercase tracking-wider text-[#2E4A35] bg-[#6FCF45]/15 border border-[#6FCF45]/40 px-2.5 py-0.5 rounded-full mt-1.5">
                      {member.role}
                    </span>
                    <p className="text-xs text-[#5C6E67] mt-3 leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Ready to Begin CTA: Slim Height Container with Full-Size 3D trip.png */}
        <div className="bg-[#071A16] text-white rounded-[22px] py-4 sm:py-5 lg:py-5 px-6 sm:px-8 lg:px-10 relative overflow-hidden shadow-2xl border-2 border-[#6FCF45]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#6FCF45]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-[#12382E]/50 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-8 items-center">
            
            {/* Left Column: Full-Size 3D Trip Graphic Image with Slim Margin */}
            <div className="md:col-span-5 lg:col-span-5 flex items-center justify-center -my-2 sm:-my-4 lg:-my-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
                className="relative group/trip"
              >
                <div className="absolute inset-0 bg-[#6FCF45]/20 rounded-full blur-2xl opacity-70 group-hover/trip:opacity-100 transition-opacity duration-700" />
                <motion.img
                  src={tripImg}
                  alt="Design Your Next Trip"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    ease: 'linear',
                    repeat: Infinity,
                    repeatType: 'loop',
                  }}
                  className="w-full max-w-[220px] sm:max-w-[280px] md:max-w-[310px] lg:max-w-[340px] h-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)] relative z-10 hover:scale-105 transition-transform duration-500 origin-center select-none pointer-events-none"
                />
              </motion.div>
            </div>

            {/* Right Column: Heading, Details & Action Buttons */}
            <div className="md:col-span-7 lg:col-span-7 text-left flex flex-col justify-center space-y-2.5 sm:space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#6FCF45]/15 border border-[#6FCF45]/30 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6FCF45] shadow-[0_0_6px_#6FCF45]" />
                <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#6FCF45] font-heading">
                  START YOUR JOURNEY
                </span>
              </div>

              <h2 className="text-lg sm:text-xl lg:text-2xl font-extrabold font-heading tracking-tight text-white leading-tight">
                Ready to Design Your Next <span className="text-[#6FCF45]">Expedition?</span>
              </h2>

              <p className="text-xs sm:text-[13px] text-[#A8B5AF] leading-relaxed max-w-xl">
                Speak directly with our principal curators and let us craft a tailored luxury journey crafted exclusively around your rhythm, desires, and travel aspirations.
              </p>

              <div className="pt-0.5 flex flex-wrap items-center gap-3">
                <Link
                  to="/contact"
                  className="bg-[#6FCF45] text-[#071A16] px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#5eb937] transition-all shadow-lg shadow-[#6FCF45]/30 cursor-pointer active:scale-95 flex items-center gap-1.5"
                >
                  <span>Connect with Concierge</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </Link>

                <Link
                  to="/tours"
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95"
                >
                  Browse Tour Packages
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
