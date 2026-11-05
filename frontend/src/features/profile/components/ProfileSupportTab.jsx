import React from 'react'
import { Phone, Star } from 'lucide-react'

export const ProfileSupportTab = ({
  activeTab,
  conciergeWhatsApp,
}) => {
  if (activeTab === 'reviews') {
    return (
      <div className="space-y-6 animate-fadeIn max-w-2xl">
        <div className="pb-4 border-b border-white/5">
          <h1 className="text-xl sm:text-2xl font-bold text-white font-heading">My Reviews &amp; Ratings</h1>
          <p className="text-xs text-[#94A3B8]">Share your thoughts on completed journeys to earn reward points.</p>
        </div>

        <div className="bg-[#081C16] border border-white/5 rounded-3xl p-6">
          <div className="p-4 rounded-2xl bg-[#0B241E] border border-white/5 mb-3">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-xs font-bold text-white">Swiss Alps Explorer</h4>
              <div className="flex text-amber-300">
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
            </div>
            <p className="text-[11px] text-[#94A3B8]">“An extraordinary experience from start to finish! The concierge was always available.”</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn max-w-2xl">
      <div className="pb-4 border-b border-white/5">
        <h1 className="text-xl sm:text-2xl font-bold text-white font-heading">Concierge &amp; Support</h1>
        <p className="text-xs text-[#94A3B8]">Direct 24/7 access to our VIP travel specialists.</p>
      </div>

      <div className="bg-[#081C16] border border-white/5 rounded-3xl p-6 space-y-4">
        <div className="bg-[#0B241E] border border-white/5 rounded-2xl p-5 text-center">
          <Phone className="w-8 h-8 text-[#6FCF45] mx-auto mb-2" />
          <h3 className="text-sm font-bold text-white mb-1">Direct WhatsApp Concierge</h3>
          <p className="text-xs text-[#94A3B8] mb-4">Chat instantly with your dedicated travel executive for any inquiry or change.</p>
          <a
            href={conciergeWhatsApp}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-[#6FCF45] hover:bg-[#5eb937] text-[#071A16] px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer shadow-sm"
          >
            <span>Start WhatsApp Chat</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default ProfileSupportTab

