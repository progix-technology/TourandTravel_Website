import React from 'react'
import { motion } from 'framer-motion'
import {
  ChevronLeft,
  QrCode,
  CreditCard,
  Landmark,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'

export const StepPaymentConfirmation = ({
  grandTotal,
  adults,
  approxBasePerPerson,
  transitCategory,
  transitFarePerPerson,
  gstTax,
  paymentMethod,
  setPaymentMethod,
  paymentNotice,
  setPaymentNotice,
  submitting,
  onBack,
  onConfirmZeroDeposit,
  onLaunchRazorpay,
}) => {
  return (
    <motion.div
      key="step-3"
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
            <span>Back to Traveler Details</span>
          </button>
          <span className="text-xs text-white/80 font-semibold">
            Final Amount: <strong className="text-[#6FCF45]">₹{grandTotal.toLocaleString('en-IN')}</strong>
          </span>
        </div>

        <div className="bg-[#0B241E]/95 border-2 border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl text-left space-y-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
              Choose Payment Option
            </h3>
            <p className="text-xs text-[#A8B5AF]">
              All transactions are encrypted with 256-bit bank grade security. Instant confirmation voucher dispatched.
            </p>
          </div>

          {/* Breakdown Box */}
          <div className="bg-[#071A16] border border-white/10 rounded-xl p-3.5 sm:p-4 space-y-2 text-xs">
            <div className="flex justify-between text-[#A8B5AF]">
              <span>Package Base ({adults} Guest{adults > 1 ? 's' : ''}):</span>
              <span className="font-semibold text-white">₹{(approxBasePerPerson * adults).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-[#A8B5AF]">
              <span>Transit Fare ({transitCategory.toUpperCase()} - {adults} Guest{adults > 1 ? 's' : ''}):</span>
              <span className="font-semibold text-white">₹{(transitFarePerPerson * adults).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-[#A8B5AF]">
              <span>GST &amp; Travel Insurance (5%):</span>
              <span className="font-semibold text-white">₹{gstTax.toLocaleString('en-IN')}</span>
            </div>
            <div className="border-t border-white/10 pt-2 flex justify-between items-center text-sm font-bold">
              <span className="text-white">Total Payable:</span>
              <span className="text-[#6FCF45] text-lg font-black">₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* 3 Payment Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => {
                setPaymentMethod('upi')
                setPaymentNotice('')
              }}
              className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${paymentMethod === 'upi'
                ? 'bg-[#0B241E] border-[#6FCF45] ring-2 ring-[#6FCF45]/30'
                : 'bg-[#071A16] border-white/10 hover:border-white/30 text-white/70'
                }`}
            >
              <QrCode className={`w-5 h-5 ${paymentMethod === 'upi' ? 'text-[#6FCF45]' : 'text-white/60'}`} />
              <div>
                <div className="font-bold text-xs text-white">Razorpay UPI</div>
                <div className="text-[10px] text-[#A8B5AF]">GPay, PhonePe, QR</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setPaymentMethod('card')
                setPaymentNotice('')
              }}
              className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${paymentMethod === 'card'
                ? 'bg-[#0B241E] border-[#6FCF45] ring-2 ring-[#6FCF45]/30'
                : 'bg-[#071A16] border-white/10 hover:border-white/30 text-white/70'
                }`}
            >
              <CreditCard className={`w-5 h-5 ${paymentMethod === 'card' ? 'text-[#6FCF45]' : 'text-white/60'}`} />
              <div>
                <div className="font-bold text-xs text-white">Cards / NetBanking</div>
                <div className="text-[10px] text-[#A8B5AF]">Razorpay Secure Gateway</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setPaymentMethod('zero_deposit')
                setPaymentNotice('')
              }}
              className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${paymentMethod === 'zero_deposit'
                ? 'bg-[#0B241E] border-[#6FCF45] ring-2 ring-[#6FCF45]/30'
                : 'bg-[#071A16] border-white/10 hover:border-white/30 text-white/70'
                }`}
            >
              <Landmark className={`w-5 h-5 ${paymentMethod === 'zero_deposit' ? 'text-[#6FCF45]' : 'text-white/60'}`} />
              <div>
                <div className="font-bold text-xs text-white">Zero-Deposit</div>
                <div className="text-[10px] text-[#A8B5AF]">Pay at Hotel / Arrival</div>
              </div>
            </button>
          </div>

          {/* Description Box */}
          <div className="p-3.5 rounded-xl bg-[#071A16] border border-white/10 text-xs">
            {paymentMethod === 'upi' && (
              <div className="space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5 text-xs">
                  <QrCode className="w-4 h-4 text-[#6FCF45]" />
                  <span>Razorpay UPI &amp; Instant QR Code</span>
                </div>
                <p className="text-[11.5px] text-[#A8B5AF] leading-relaxed">
                  Clicking &quot;Pay via Razorpay&quot; will launch the official Razorpay Checkout popup supporting Google Pay, PhonePe, Paytm, BHIM, and instant dynamic QR scanner.
                </p>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5 text-xs">
                  <CreditCard className="w-4 h-4 text-[#6FCF45]" />
                  <span>Cards &amp; NetBanking (Razorpay)</span>
                </div>
                <p className="text-[11.5px] text-[#A8B5AF] leading-relaxed">
                  Clicking &quot;Pay via Razorpay&quot; will launch the official Razorpay Checkout popup supporting Debit/Credit Cards (Visa, MasterCard, RuPay), EMI, and 50+ NetBanking options.
                </p>
              </div>
            )}

            {paymentMethod === 'zero_deposit' && (
              <div className="space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5 text-xs">
                  <Landmark className="w-4 h-4 text-[#6FCF45]" />
                  <span>Zero-Deposit VIP Hold (Pay on Arrival)</span>
                </div>
                <p className="text-[11.5px] text-[#A8B5AF] leading-relaxed">
                  Reserve your seats and hotel slots now with 0 advance payment. Pay the full amount in cash or card directly when checking in or boarding.
                </p>
              </div>
            )}
          </div>

          {/* Notice Banner */}
          {paymentNotice && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-amber-300">Gateway Notice</p>
                <p className="text-[11.5px] text-amber-200/90 leading-relaxed">{paymentNotice}</p>
              </div>
            </div>
          )}

          {/* Action CTA */}
          {paymentMethod === 'zero_deposit' ? (
            <button
              type="button"
              disabled={submitting}
              onClick={onConfirmZeroDeposit}
              className="w-full py-4 rounded-xl bg-[#6FCF45] hover:bg-[#85e65b] text-[#071A16] text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg shadow-[#6FCF45]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Landmark className="w-4 h-4 stroke-[2.5]" />
              <span>CONFIRM WITH VIP ZERO-DEPOSIT HOLD (PAY ON ARRIVAL / CASH)</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={onLaunchRazorpay}
              className="w-full py-4 rounded-xl bg-[#6FCF45] hover:bg-[#85e65b] text-[#071A16] text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg shadow-[#6FCF45]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>PAY ₹{grandTotal.toLocaleString('en-IN')} VIA RAZORPAY</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}

          {/* Footer Guarantee */}
          <div className="flex items-center justify-between text-[10px] text-white/50 pt-2 border-t border-white/10">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#6FCF45]" />
              <span>256-Bit SSL Encryption • Bank Grade Security</span>
            </div>
            <span className="font-mono text-white/60">Razorpay Official Rails</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default StepPaymentConfirmation

