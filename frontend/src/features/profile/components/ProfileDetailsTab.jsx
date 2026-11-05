import React from 'react'
import { CheckCircle2, User, Crown, MapPin, Shield, Compass } from 'lucide-react'

export const ProfileDetailsTab = ({
  user,
  memberRole,
  profileName,
  setProfileName,
  profileEmail,
  profilePhone,
  setProfilePhone,
  profileDob,
  setProfileDob,
  profileGender,
  setProfileGender,
  profileCountry,
  setProfileCountry,
  profileAddress,
  setProfileAddress,
  profileCity,
  setProfileCity,
  profileState,
  setProfileState,
  profilePincode,
  setProfilePincode,
  profilePassport,
  setProfilePassport,
  profilePassportExpiry,
  setProfilePassportExpiry,
  profileEmergencyName,
  setProfileEmergencyName,
  profileEmergencyPhone,
  setProfileEmergencyPhone,
  profileCurrency,
  setProfileCurrency,
  profileTravelStyle,
  setProfileTravelStyle,
  profileDietPreference,
  setProfileDietPreference,
  profileBucketList,
  setProfileBucketList,
  saveSuccess,
  onSubmit,
}) => {
  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto text-left">
      <div className="pb-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-heading">User Profile &amp; Travel Preferences</h1>
          <p className="text-xs text-[#94A3B8]">Manage your personal identification, passport details, emergency contacts and travel styles.</p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#6FCF45]/15 border border-[#6FCF45]/30 text-[#6FCF45] text-xs font-bold shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Profile 95% Complete</span>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-[#6FCF45]/15 border border-[#6FCF45]/30 text-[#6FCF45] text-xs font-bold flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Your profile and travel preferences have been updated successfully!</span>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Profile Header Card */}
        <div className="bg-[#081C16] border border-white/5 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center gap-5">
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#13382C] border-2 border-[#6FCF45] flex items-center justify-center text-[#6FCF45] shadow-lg shrink-0">
            <User className="w-9 h-9 sm:w-10 sm:h-10" />
          </div>
          <div className="text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider mb-1.5">
              <Crown className="w-3 h-3" />
              <span>{memberRole}</span>
            </div>
            <h2 className="text-lg font-bold text-white font-heading">
              {profileName || user?.name || 'Explorer'}
            </h2>
            <p className="text-xs text-[#94A3B8]">
              {profileEmail || user?.email || ''}
            </p>
          </div>
        </div>

        {/* Section 1: Personal Information */}
        <div className="bg-[#081C16] border border-white/5 rounded-3xl p-5 sm:p-7 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/5">
            <User className="w-4 h-4 text-[#6FCF45]" />
            <h3 className="text-sm font-bold text-white font-heading">1. Personal Information</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="e.g. Explorer Name"
                className="w-full bg-[#0B241E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45] transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={profileEmail}
                  disabled
                  className="w-full bg-[#0B241E]/50 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-[#94A3B8] cursor-not-allowed"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#6FCF45] font-bold bg-[#6FCF45]/15 px-2 py-0.5 rounded-md border border-[#6FCF45]/30">
                  Verified ✓
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1">
                Phone / WhatsApp Number
              </label>
              <input
                type="tel"
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-[#0B241E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={profileDob}
                onChange={(e) => setProfileDob(e.target.value)}
                className="w-full bg-[#0B241E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1">
                Gender
              </label>
              <select
                value={profileGender}
                onChange={(e) => setProfileGender(e.target.value)}
                className="w-full bg-[#0B241E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45] transition-colors"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1">
                Nationality / Country
              </label>
              <input
                type="text"
                value={profileCountry}
                onChange={(e) => setProfileCountry(e.target.value)}
                placeholder="e.g. India"
                className="w-full bg-[#0B241E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Address */}
        <div className="bg-[#081C16] border border-white/5 rounded-3xl p-5 sm:p-7 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/5">
            <MapPin className="w-4 h-4 text-[#6FCF45]" />
            <h3 className="text-sm font-bold text-white font-heading">2. Address &amp; Residence Details</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1">
                Street Address / Flat / Landmark
              </label>
              <input
                type="text"
                value={profileAddress}
                onChange={(e) => setProfileAddress(e.target.value)}
                placeholder="e.g. 402, High Street Residency, Bandra West"
                className="w-full bg-[#0B241E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1">
                City
              </label>
              <input
                type="text"
                value={profileCity}
                onChange={(e) => setProfileCity(e.target.value)}
                placeholder="e.g. Mumbai"
                className="w-full bg-[#0B241E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1">
                State / Province
              </label>
              <input
                type="text"
                value={profileState}
                onChange={(e) => setProfileState(e.target.value)}
                placeholder="e.g. Maharashtra"
                className="w-full bg-[#0B241E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1">
                PIN / Postal Code
              </label>
              <input
                type="text"
                value={profilePincode}
                onChange={(e) => setProfilePincode(e.target.value)}
                placeholder="e.g. 400050"
                className="w-full bg-[#0B241E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Passport & Emergency */}
        <div className="bg-[#081C16] border border-white/5 rounded-3xl p-5 sm:p-7 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/5">
            <Shield className="w-4 h-4 text-[#6FCF45]" />
            <h3 className="text-sm font-bold text-white font-heading">3. Travel Documents &amp; Emergency Contact</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1">
                Passport Number (Optional for International)
              </label>
              <input
                type="text"
                value={profilePassport}
                onChange={(e) => setProfilePassport(e.target.value.toUpperCase())}
                placeholder="e.g. Z5894102"
                className="w-full bg-[#0B241E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white uppercase focus:outline-none focus:border-[#6FCF45] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1">
                Passport Expiry Date
              </label>
              <input
                type="date"
                value={profilePassportExpiry}
                onChange={(e) => setProfilePassportExpiry(e.target.value)}
                className="w-full bg-[#0B241E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1">
                Emergency Contact Name
              </label>
              <input
                type="text"
                value={profileEmergencyName}
                onChange={(e) => setProfileEmergencyName(e.target.value)}
                placeholder="e.g. Family Member / Spouse"
                className="w-full bg-[#0B241E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1">
                Emergency Contact Number
              </label>
              <input
                type="tel"
                value={profileEmergencyPhone}
                onChange={(e) => setProfileEmergencyPhone(e.target.value)}
                placeholder="+91 98111 22334"
                className="w-full bg-[#0B241E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45] transition-colors"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1">
                Preferred Currency
              </label>
              <select
                value={profileCurrency}
                onChange={(e) => setProfileCurrency(e.target.value)}
                className="w-full bg-[#0B241E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45] transition-colors"
              >
                <option value="INR (₹)">INR (₹) - Indian Rupee</option>
                <option value="USD ($)">USD ($) - US Dollar</option>
                <option value="EUR (€)">EUR (€) - Euro</option>
                <option value="AED (د.إ)">AED (د.إ) - UAE Dirham</option>
                <option value="GBP (£)">GBP (£) - British Pound</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Travel Style */}
        <div className="bg-[#081C16] border border-white/5 rounded-3xl p-5 sm:p-7 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/5">
            <Compass className="w-4 h-4 text-[#6FCF45]" />
            <h3 className="text-sm font-bold text-white font-heading">4. Travel &amp; Lifestyle Preferences</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1">
                Preferred Travel Style
              </label>
              <select
                value={profileTravelStyle}
                onChange={(e) => setProfileTravelStyle(e.target.value)}
                className="w-full bg-[#0B241E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45] transition-colors"
              >
                <option value="Luxury & Leisure">Luxury &amp; Leisure</option>
                <option value="Adventure & High Altitude Trekking">Adventure &amp; High Altitude Trekking</option>
                <option value="Romantic & Honeymoon">Romantic &amp; Honeymoon</option>
                <option value="Family Vacations & Roadtrips">Family Vacations &amp; Roadtrips</option>
                <option value="Spiritual & Cultural Heritage">Spiritual &amp; Cultural Heritage</option>
                <option value="Wildlife & Safari Expeditions">Wildlife &amp; Safari Expeditions</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1">
                Meal / Dietary Preference
              </label>
              <select
                value={profileDietPreference}
                onChange={(e) => setProfileDietPreference(e.target.value)}
                className="w-full bg-[#0B241E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45] transition-colors"
              >
                <option value="Vegetarian">Pure Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Jain Food">Jain Food</option>
                <option value="Vegan">Vegan</option>
                <option value="Halal">Halal</option>
                <option value="No Preference">No Dietary Preference</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1">
                Dream Bucket List Destinations
              </label>
              <input
                type="text"
                value={profileBucketList}
                onChange={(e) => setProfileBucketList(e.target.value)}
                placeholder="e.g. Switzerland, Bali, Norway Northern Lights, Kedarnath"
                className="w-full bg-[#0B241E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45] transition-colors"
              />
              <span className="text-[10px] text-[#94A3B8]/70 mt-1 block">
                Our concierge will prioritize special deals matching your bucket list!
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="bg-[#6FCF45] hover:bg-[#5eb937] text-[#071A16] px-8 py-3 rounded-2xl font-bold text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer shadow-lg active:scale-95 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            <span>Save All Changes</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProfileDetailsTab

