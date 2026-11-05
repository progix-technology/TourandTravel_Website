import React from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, User, ArrowRight } from 'lucide-react'

export const StepTravelerDetails = ({
  adults,
  travelersList,
  setTravelersList,
  contactData,
  setContactData,
  onBack,
  onSubmit,
}) => {
  return (
    <motion.div
      key="step-2"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.25 }}
      className="flex-1 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#6FCF45] hover:text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Step 1</span>
          </button>
          <span className="text-xs text-white/80 font-semibold">
            Party Size: <strong className="text-[#6FCF45]">{adults} Travelers</strong>
          </span>
        </div>

        <div className="mb-3 text-left">
          <h3 className="text-base sm:text-lg font-extrabold text-white font-heading">
            Fill In Details for {adults === 1 ? 'Solo Traveler' : `${adults} Travelers`}
          </h3>
          <p className="text-xs text-[#A8B5AF]">
            Individual names are registered with verified transit vouchers and hotel reservations.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-3.5 text-left">
          {/* Dynamic Traveler Cards */}
          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
            {travelersList.map((trv, idx) => (
              <div
                key={trv.id}
                className="bg-[#071A16] border border-white/15 rounded-xl p-3 space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#6FCF45] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>{trv.label}</span>
                  </span>
                  <span className="text-[10px] text-white/40 font-mono">#{idx + 1}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <div className="sm:col-span-6">
                    <input
                      type="text"
                      required
                      value={trv.fullName}
                      onChange={(e) => {
                        const val = e.target.value
                        setTravelersList((prev) =>
                          prev.map((t) => (t.id === trv.id ? { ...t, fullName: val } : t))
                        )
                      }}
                      placeholder="Full Name (as per Govt ID)"
                      className="w-full bg-[#0B241E] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#6FCF45]"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <input
                      type="number"
                      required
                      min="1"
                      max="100"
                      value={trv.age}
                      onChange={(e) => {
                        const val = e.target.value
                        setTravelersList((prev) =>
                          prev.map((t) => (t.id === trv.id ? { ...t, age: val } : t))
                        )
                      }}
                      placeholder="Age"
                      className="w-full bg-[#0B241E] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#6FCF45]"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <select
                      value={trv.gender}
                      onChange={(e) => {
                        const val = e.target.value
                        setTravelersList((prev) =>
                          prev.map((t) => (t.id === trv.id ? { ...t, gender: val } : t))
                        )
                      }}
                      className="w-full bg-[#0B241E] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#6FCF45]"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Primary Contact Details */}
          <div className="bg-[#071A16] border border-white/15 rounded-xl p-3 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white block">
              Primary Contact for Tickets &amp; Vouchers
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <input
                  type="tel"
                  required
                  value={contactData.phone}
                  onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                  placeholder="WhatsApp / Phone (+91 89532 08952)"
                  className="w-full bg-[#0B241E] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#6FCF45]"
                />
              </div>
              <div>
                <input
                  type="email"
                  required
                  value={contactData.email}
                  onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                  placeholder="Email (for Booking Confirmation)"
                  className="w-full bg-[#0B241E] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#6FCF45]"
                />
              </div>
            </div>
          </div>

          {/* Travel Date & Special Requests */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              value={contactData.travelDate}
              onChange={(e) => setContactData({ ...contactData, travelDate: e.target.value })}
              placeholder="Travel Date / Month (e.g. 15 Nov or Flexible)"
              className="w-full bg-[#071A16] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#6FCF45]"
            />
            <input
              type="text"
              value={contactData.specialRequests}
              onChange={(e) => setContactData({ ...contactData, specialRequests: e.target.value })}
              placeholder="Special Preferences (e.g. Pure Veg, Window Seat)"
              className="w-full bg-[#071A16] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#6FCF45]"
            />
          </div>

          {/* Step 2 Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#6FCF45] hover:bg-[#8BE35A] text-[#071A16] py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-200 shadow-lg shadow-[#6FCF45]/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>PROCEED TO SECURE PAYMENT (STEP 3)</span>
              <ArrowRight className="w-4 h-4 stroke-[3] text-[#071A16]" />
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  )
}

export default StepTravelerDetails

