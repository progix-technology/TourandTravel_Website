import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, MessageSquare, RotateCcw } from 'lucide-react'

export const TripSuccessScreen = ({
  submitSuccess,
  contactData,
  cleanPhone,
  onReset,
}) => {
  return (
    <motion.div
      key="step-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="text-center py-3 flex-1 flex flex-col justify-between"
    >
      <div className="space-y-3">
        <div className="w-14 h-14 rounded-full bg-[#6FCF45]/20 border-2 border-[#6FCF45] flex items-center justify-center mx-auto text-[#6FCF45] shadow-lg shadow-[#6FCF45]/30">
          <CheckCircle2 className="w-7 h-7" />
        </div>

        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#6FCF45] font-heading">
            EXPEDITION CONFIRMED • REF #{submitSuccess.referenceId}
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white font-heading mt-1">
            Your Travel Voucher is Generated!
          </h3>
          <p className="text-xs text-[#A8B5AF] mt-1 max-w-sm mx-auto">
            Confirmation voucher with transit tickets dispatched to <strong>{contactData.email}</strong> and your WhatsApp number.
          </p>
        </div>

        {/* Route & Booking Summary Card */}
        <div className="bg-[#071A16] rounded-xl p-3.5 border border-white/10 text-left text-xs space-y-1.5 my-2">
          <div className="flex justify-between text-white/70">
            <span>Route:</span>
            <span className="font-bold text-white">{submitSuccess.departure} → {submitSuccess.destination}</span>
          </div>
          {submitSuccess.spot && (
            <div className="flex justify-between text-white/70">
              <span>Key Spot:</span>
              <span className="font-bold text-[#6FCF45]">✦ {submitSuccess.spot}</span>
            </div>
          )}
          <div className="flex justify-between text-white/70">
            <span>Party &amp; Transit:</span>
            <span className="font-bold text-white">{submitSuccess.adults} Guests • {submitSuccess.transit}</span>
          </div>
          <div className="flex justify-between text-white/70">
            <span>Payment Status:</span>
            <span className="font-bold text-[#6FCF45]">{submitSuccess.paymentStatus}</span>
          </div>
          <div className="border-t border-white/10 pt-1 flex justify-between font-bold text-sm">
            <span className="text-white">Amount:</span>
            <span className="text-[#6FCF45]">₹{submitSuccess.totalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* WhatsApp Action & Reset */}
      <div className="space-y-2 pt-2">
        <a
          href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
            `Hello Tours & Travels Concierge! I have confirmed Booking #${submitSuccess.referenceId} for ${submitSuccess.destination} (${submitSuccess.transit}, ${submitSuccess.adults} Guests). Please share my day-by-day itinerary voucher!`
          )}`}
          target="_blank"
          rel="noreferrer"
          className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/30 transition-all cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 fill-current" />
          <span>Instant WhatsApp Concierge Connect</span>
        </a>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center gap-1.5 text-xs text-[#A8B5AF] hover:text-white transition-colors cursor-pointer py-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Book Another Destination</span>
        </button>
      </div>
    </motion.div>
  )
}

export default TripSuccessScreen

