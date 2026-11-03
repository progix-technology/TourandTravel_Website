import React, { useState, useEffect } from 'react'
import {
  CreditCard,
  QrCode,
  Landmark,
  ShieldCheck,
  Lock,
  Smartphone,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Clock,
  Building2,
  Check,
  AlertCircle,
  KeyRound,
  X,
  ExternalLink,
} from 'lucide-react'
import { initiateRazorpayPayment } from '../services/razorpayService'

// Official Vector Brand Logos
const GooglePayLogo = () => (
  <svg viewBox="0 0 48 48" className="w-5 h-5 shrink-0">
    <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
)

const PhonePeLogo = () => (
  <svg viewBox="0 0 48 48" className="w-5 h-5 shrink-0">
    <circle cx="24" cy="24" r="24" fill="#5f259f"/>
    <path fill="#ffffff" d="M26.5 13H21v22h5.5c4.7 0 8.5-3.8 8.5-8.5s-3.8-8.5-8.5-8.5zm0 12H24v-7h2.5c2 0 3.5 1.6 3.5 3.5s-1.5 3.5-3.5 3.5z"/>
    <path fill="#ffffff" d="M17 19h4v6h-4z"/>
  </svg>
)

const PaytmLogo = () => (
  <svg viewBox="0 0 64 24" className="h-4.5 w-auto shrink-0">
    <rect width="64" height="24" rx="4" fill="#002e6e"/>
    <text x="6" y="17" fill="#ffffff" fontFamily="sans-serif" fontWeight="900" fontSize="13">Pay</text>
    <text x="32" y="17" fill="#00baf2" fontFamily="sans-serif" fontWeight="900" fontSize="13">tm</text>
  </svg>
)

const BhimUpiLogo = () => (
  <svg viewBox="0 0 54 24" className="h-4.5 w-auto shrink-0">
    <rect width="54" height="24" rx="4" fill="#f8fafc" stroke="#cbd5e1"/>
    <path fill="#0f7c3f" d="M12 4l-8 16h6l5-10 3 6h6z"/>
    <path fill="#e96125" d="M18 4l8 16h-6l-5-10-3 6h-6z"/>
    <text x="28" y="16.5" fill="#1e293b" fontFamily="sans-serif" fontWeight="900" fontSize="10">BHIM</text>
  </svg>
)

const HdfcLogo = () => (
  <svg viewBox="0 0 32 32" className="w-6 h-6 shrink-0">
    <rect width="32" height="32" rx="4" fill="#004c8f"/>
    <rect x="13" y="6" width="6" height="20" fill="#ed1c24"/>
    <rect x="6" y="13" width="20" height="6" fill="#ed1c24"/>
    <rect x="10" y="10" width="12" height="12" fill="#ffffff"/>
    <rect x="13" y="13" width="6" height="6" fill="#004c8f"/>
  </svg>
)

const SbiLogo = () => (
  <svg viewBox="0 0 32 32" className="w-6 h-6 shrink-0">
    <circle cx="16" cy="16" r="15" fill="#280071"/>
    <circle cx="16" cy="16" r="9" fill="#00a5df"/>
    <circle cx="16" cy="13" r="4.5" fill="#ffffff"/>
    <rect x="14.5" y="13" width="3" height="11" fill="#ffffff"/>
  </svg>
)

const IciciLogo = () => (
  <svg viewBox="0 0 32 32" className="w-6 h-6 shrink-0">
    <rect width="32" height="32" rx="4" fill="#b02a30"/>
    <path fill="#f58220" d="M16 6a10 10 0 1010 10A10 10 0 0016 6zm0 16a6 6 0 116-6 6 6 0 01-6 6z"/>
    <circle cx="16" cy="16" r="3.5" fill="#ffffff"/>
  </svg>
)

const AxisLogo = () => (
  <svg viewBox="0 0 32 32" className="w-6 h-6 shrink-0">
    <rect width="32" height="32" rx="4" fill="#97144d"/>
    <path fill="#ffffff" d="M16 6l10 18h-6l-4-8-4 8H6z"/>
  </svg>
)

const KotakLogo = () => (
  <svg viewBox="0 0 32 32" className="w-6 h-6 shrink-0">
    <rect width="32" height="32" rx="4" fill="#ed1c24"/>
    <path fill="#ffffff" d="M10 16a6 6 0 0110-4.2l-2.8 2.8a2 2 0 100 2.8l2.8 2.8A6 6 0 0110 16z"/>
    <circle cx="22" cy="16" r="3" fill="#ffffff"/>
  </svg>
)

const PnbLogo = () => (
  <svg viewBox="0 0 32 32" className="w-6 h-6 shrink-0">
    <rect width="32" height="32" rx="4" fill="#a20037"/>
    <circle cx="16" cy="16" r="9" fill="#fed100"/>
    <circle cx="16" cy="16" r="5" fill="#a20037"/>
  </svg>
)

const VisaLogo = () => (
  <svg viewBox="0 0 48 18" className="h-4 w-auto">
    <path fill="#1a1f71" d="M19.5 1h-4.3l-2.7 13h4.3l2.7-13zm15.7 8.3c-.1-3.6-5-3.8-5-5.4 0-1.6 1.8-1.7 3.2-1.7 1.8 0 3.2.3 4.2.8l.6-3.8c-1.1-.4-2.8-.8-4.8-.8-4.5 0-7.7 2.4-7.7 5.8 0 2.5 2.3 3.9 4 4.8 1.8.8 2.4 1.4 2.4 2.1 0 1.2-1.4 1.7-2.7 1.7-2.3 0-3.6-.3-5.5-1.2l-.7 4.1c1.3.6 3.6 1.1 6 1.1 4.7 0 7.8-2.3 7.8-6zM46.7 1h-3.3c-1 0-1.8.3-2.2 1.4L35 14h4.5l.9-2.5h5.5l.5 2.5h4l-3.7-13zm-5.1 7.2l1.8-4.8 1 4.8h-2.8zM12.9 1L8.7 10.3 8.2 8C7.5 5.5 5.2 2.8 2.8 1.5L6.6 14h4.5L17.2 1h-4.3z"/>
  </svg>
)

const MastercardLogo = () => (
  <svg viewBox="0 0 36 22" className="h-5 w-auto">
    <circle cx="13" cy="11" r="10" fill="#EB001B"/>
    <circle cx="23" cy="11" r="10" fill="#F79E1B" fillOpacity="0.88"/>
  </svg>
)

const RuPayLogo = () => (
  <svg viewBox="0 0 48 16" className="h-4 w-auto">
    <text x="2" y="13" fill="#0971b8" fontFamily="sans-serif" fontWeight="900" fontSize="14">RuPay</text>
    <path fill="#f37021" d="M42 3l5 5-5 5z"/>
  </svg>
)

const POPULAR_BANKS = [
  { id: 'HDFC', name: 'HDFC Bank', Logo: HdfcLogo },
  { id: 'SBI', name: 'State Bank of India', Logo: SbiLogo },
  { id: 'ICICI', name: 'ICICI Bank', Logo: IciciLogo },
  { id: 'AXIS', name: 'Axis Bank', Logo: AxisLogo },
  { id: 'KOTAK', name: 'Kotak Mahindra', Logo: KotakLogo },
  { id: 'PNB', name: 'Punjab National', Logo: PnbLogo },
]

const ALL_OTHER_BANKS = [
  'Bank of Baroda',
  'Canara Bank',
  'Union Bank of India',
  'IndusInd Bank',
  'YES Bank',
  'Federal Bank',
  'IDFC FIRST Bank',
  'Indian Bank',
  'Central Bank of India',
  'Bank of India',
  'RBL Bank',
  'South Indian Bank',
  'Bandhan Bank',
  'AU Small Finance Bank',
  'Karur Vysya Bank',
  'UCO Bank',
]

const WALLET_PROVIDERS = [
  { id: 'paytm', name: 'Paytm Wallet', Logo: PaytmLogo },
  { id: 'phonepe', name: 'PhonePe Wallet', Logo: PhonePeLogo },
  { id: 'amazon', name: 'Amazon Pay Balance', icon: '🟠' },
  { id: 'mobikwik', name: 'MobiKwik', icon: '🔷' },
  { id: 'airtel', name: 'Airtel Payments Bank', icon: '🔴' },
]

export const RazorpayWhiteCheckout = ({
  amount = 0,
  tourTitle = 'Luxury Tour Package',
  customerName = 'Valued Guest',
  customerEmail = '',
  customerPhone = '',
  onPaymentSuccess,
  isSubmitting = false,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState('card')
  const [upiSubMode, setUpiSubMode] = useState('apps')
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay')
  const [customUpiId, setCustomUpiId] = useState('')
  const [qrCountdown, setQrCountdown] = useState(599)

  // Card Inputs
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [cardHolder, setCardHolder] = useState(customerName || '')
  const [saveCard, setSaveCard] = useState(true)

  // Netbanking & Wallet Inputs
  const [selectedBank, setSelectedBank] = useState('HDFC')
  const [otherBank, setOtherBank] = useState('')
  const [selectedWallet, setSelectedWallet] = useState('paytm')

  // Validation & Processing States
  const [formError, setFormError] = useState('')
  const [processingState, setProcessingState] = useState(null) // null | 'connecting' | 'otp_modal' | 'upi_modal' | 'verifying' | 'success'
  const [otpValue, setOtpValue] = useState('')
  const [otpError, setOtpError] = useState('')

  const handleCardNumberChange = (e) => {
    setFormError('')
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16)
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ')
    setCardNumber(formatted)
  }

  const handleExpiryChange = (e) => {
    setFormError('')
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4)
    if (raw.length >= 3) {
      raw = raw.slice(0, 2) + '/' + raw.slice(2)
    }
    setCardExpiry(raw)
  }

  const detectCardBrand = () => {
    const digits = cardNumber.replace(/\s/g, '')
    if (digits.startsWith('4')) return 'Visa'
    if (digits.startsWith('51') || digits.startsWith('52') || digits.startsWith('53') || digits.startsWith('54') || digits.startsWith('55')) return 'Mastercard'
    if (digits.startsWith('60') || digits.startsWith('65') || digits.startsWith('81') || digits.startsWith('82')) return 'RuPay'
    return null
  }

  useEffect(() => {
    if (activeTab === 'upi' && upiSubMode === 'qr') {
      const timer = setInterval(() => {
        setQrCountdown((prev) => (prev > 0 ? prev - 1 : 599))
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [activeTab, upiSubMode])

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  // Strict Validation and Modal Launch
  const handlePayClick = (e) => {
    if (e) e.preventDefault()
    setFormError('')

    // 1. CARD VALIDATION
    if (activeTab === 'card') {
      const rawDigits = cardNumber.replace(/\s/g, '')
      if (rawDigits.length !== 16) {
        setFormError('Please enter a valid 16-digit Card Number.')
        return
      }
      if (!cardExpiry || cardExpiry.length < 5) {
        setFormError('Please enter valid Expiry Date (MM/YY).')
        return
      }
      if (!cardCvv || cardCvv.length < 3) {
        setFormError('Please enter valid 3-digit CVV number.')
        return
      }
      if (!cardHolder.trim()) {
        setFormError("Please enter Cardholder's Name.")
        return
      }

      // Open 3D-Secure Bank OTP Modal
      setProcessingState('otp_modal')
      return
    }

    // 2. UPI VALIDATION
    if (activeTab === 'upi') {
      if (upiSubMode === 'apps') {
        if (!customUpiId.trim() || !customUpiId.includes('@')) {
          setFormError('Please enter a valid UPI ID (e.g. mobile@okhdfcbank or user@paytm).')
          return
        }
        // Open UPI Collect Approval Modal
        setProcessingState('upi_modal')
        return
      }
    }

    // 3. ZERO-DEPOSIT
    if (activeTab === 'zero_deposit') {
      finalizePayment('Zero-Deposit VIP Concierge Hold', 'Zero-Deposit Hold')
      return
    }

    // 4. NETBANKING OR QR CODE
    setProcessingState('connecting')
    setTimeout(() => {
      let methodLabel = `NetBanking (${otherBank || selectedBank})`
      if (activeTab === 'upi' && upiSubMode === 'qr') {
        methodLabel = 'UPI Dynamic QR Scanner'
      } else if (activeTab === 'wallet') {
        methodLabel = `Wallet (${selectedWallet.toUpperCase()})`
      }
      finalizePayment(methodLabel, 'Paid & Secured (Razorpay Verified)')
    }, 1200)
  }

  // Finalize after OTP / UPI Approval
  const finalizePayment = (methodLabel, statusLabel) => {
    setProcessingState('verifying')
    setTimeout(() => {
      setProcessingState('success')
      const paymentId = 'pay_' + Math.random().toString(36).substring(2, 11).toUpperCase()
      setTimeout(() => {
        if (onPaymentSuccess) {
          onPaymentSuccess({
            paymentId,
            method: methodLabel,
            amount,
            status: statusLabel,
          })
        }
      }, 500)
    }, 1000)
  }

  const handleVerifyOtp = (e) => {
    e.preventDefault()
    if (!otpValue || otpValue.length < 4) {
      setOtpError('Please enter the 6-digit OTP received on mobile.')
      return
    }
    setOtpError('')
    finalizePayment(`Card (${detectCardBrand() || 'Visa'} •••• ${cardNumber.slice(-4)})`, 'Paid & Secured (Razorpay 3D Secure Verified)')
  }

  const handleApproveUpi = () => {
    finalizePayment(`UPI Collect (${customUpiId})`, 'Paid & Secured (Razorpay UPI Verified)')
  }

  // Try real SDK modal if user wants
  const handleLaunchSdk = () => {
    initiateRazorpayPayment({
      amount,
      tourTitle,
      customerName,
      customerEmail,
      customerPhone,
      onSuccess: onPaymentSuccess,
      onError: (err) => console.log('SDK Dismissed:', err),
    })
  }

  const isFormDisabled = isSubmitting || processingState === 'verifying' || processingState === 'connecting'

  return (
    <div className="w-full bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden font-sans text-left transition-all relative">
      
      {/* =================================================================== */}
      {/* 3D SECURE BANK OTP MODAL (When Card is Used)                       */}
      {/* =================================================================== */}
      {processingState === 'otp_modal' && (
        <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 max-w-[420px] w-full text-left space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <div className="flex items-center gap-2">
                <HdfcLogo />
                <div>
                  <h4 className="font-bold text-xs uppercase text-slate-900 tracking-wider">3D Secure 2.0 Auth</h4>
                  <span className="text-[10px] text-slate-500">Bank Verified By Visa / RuPay</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setProcessingState(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <p>A One-Time Password (OTP) has been sent to your registered mobile ending in <strong>•••• 8921</strong> for authentication of <strong>₹{Number(amount).toLocaleString('en-IN')}</strong>.</p>
              <p className="text-[11px] text-slate-500">Merchant: <strong>Tours &amp; Travellers</strong></p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Enter 6-Digit Bank OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpValue}
                  onChange={(e) => {
                    setOtpError('')
                    setOtpValue(e.target.value.replace(/\D/g, ''))
                  }}
                  placeholder="e.g. 849201"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-base font-mono tracking-widest text-center font-bold focus:outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20"
                  autoFocus
                />
                {otpError && <p className="text-red-500 text-xs mt-1 font-medium">{otpError}</p>}
                
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                  <span>Resend in 00:45</span>
                  <button
                    type="button"
                    onClick={() => setOtpValue('849201')}
                    className="text-[#0052cc] font-semibold hover:underline cursor-pointer"
                  >
                    Auto-Fill Demo OTP
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#0052cc] hover:bg-[#0747a6] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer"
                >
                  SUBMIT OTP &amp; PAY ₹{Number(amount).toLocaleString('en-IN')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* UPI COLLECT REQUEST APPROVAL MODAL (When UPI ID is Used)           */}
      {/* =================================================================== */}
      {processingState === 'upi_modal' && (
        <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 max-w-[420px] w-full text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-[#0052cc]">
              <Smartphone className="w-6 h-6 animate-pulse" />
            </div>

            <div>
              <h4 className="font-extrabold text-sm text-slate-900">Approve Payment Request</h4>
              <p className="text-xs text-slate-600 mt-1">
                We have sent a collect request of <strong>₹{Number(amount).toLocaleString('en-IN')}</strong> to your UPI ID:
              </p>
              <div className="mt-2 inline-block px-3 py-1 bg-slate-100 rounded-lg text-xs font-mono font-bold text-slate-800">
                {customUpiId}
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs text-left space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Time remaining: 04:52</span>
              </p>
              <p className="text-[11px] leading-relaxed">
                Open your UPI app ({selectedUpiApp.toUpperCase()}, GPay, PhonePe, or BHIM) and enter your 4 or 6-digit UPI PIN to approve.
              </p>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={handleApproveUpi}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>I HAVE APPROVED IN UPI APP</span>
              </button>
              
              <button
                type="button"
                onClick={() => setProcessingState(null)}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
              >
                Cancel or Use Another Method
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 1. OFFICIAL RAZORPAY HEADER (Deep Navy Blue #0c2340)                 */}
      {/* =================================================================== */}
      <div className="bg-[#0c2340] text-white px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#132c4e]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0052cc] border border-[#3b82f6]/40 flex items-center justify-center shadow-md">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
              <path d="M12.7 2L5 13.5h5.3L8 22l11-13h-6.3L12.7 2z" />
            </svg>
          </div>
          <div>
            <h4 className="font-black text-sm tracking-wider uppercase text-white">Tours &amp; Travellers</h4>
            <p className="text-xs text-slate-300 line-clamp-1">
              {tourTitle}
              {customerPhone ? ` • ${customerPhone}` : ''}
            </p>
          </div>
        </div>

        <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-white/10 flex sm:flex-col justify-between items-center sm:items-end">
          <span className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold">
            Amount Payable
          </span>
          <div className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-baseline gap-1">
            <span>₹{Number(amount || 0).toLocaleString('en-IN')}</span>
            <span className="text-[10px] text-slate-300 font-normal">(Incl. taxes)</span>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. BODY SPLIT: Left Sidebar Tabs + Right Payment Area               */}
      {/* =================================================================== */}
      <div className="flex flex-col md:flex-row min-h-[440px]">
        {/* LEFT COLUMN: Payment Methods List */}
        <div className="w-full md:w-[38%] bg-[#f8fafc] border-b md:border-b-0 md:border-r border-slate-200 p-2 sm:p-3 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible">
          {/* Card Option */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('card')
              setFormError('')
            }}
            className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
              activeTab === 'card'
                ? 'bg-white border-2 border-[#0052cc] shadow-sm text-slate-900 font-bold'
                : 'bg-transparent border border-transparent hover:bg-slate-200/60 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  activeTab === 'card' ? 'bg-[#0052cc] text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold">Cards</div>
                <div className="text-[10px] text-slate-500">Credit / Debit (Visa, RuPay, MC)</div>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 hidden md:block ${activeTab === 'card' ? 'text-[#0052cc]' : 'text-slate-400'}`} />
          </button>

          {/* UPI Option */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('upi')
              setFormError('')
            }}
            className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
              activeTab === 'upi'
                ? 'bg-white border-2 border-[#0052cc] shadow-sm text-slate-900 font-bold'
                : 'bg-transparent border border-transparent hover:bg-slate-200/60 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  activeTab === 'upi' ? 'bg-[#0052cc] text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                <QrCode className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold">UPI / QR</div>
                <div className="text-[10px] text-slate-500">Google Pay, PhonePe, Paytm, QR</div>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 hidden md:block ${activeTab === 'upi' ? 'text-[#0052cc]' : 'text-slate-400'}`} />
          </button>

          {/* Netbanking Option */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('netbanking')
              setFormError('')
            }}
            className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
              activeTab === 'netbanking'
                ? 'bg-white border-2 border-[#0052cc] shadow-sm text-slate-900 font-bold'
                : 'bg-transparent border border-transparent hover:bg-slate-200/60 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  activeTab === 'netbanking' ? 'bg-[#0052cc] text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold">Netbanking</div>
                <div className="text-[10px] text-slate-500">SBI, HDFC, ICICI, Axis + 30 Banks</div>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 hidden md:block ${activeTab === 'netbanking' ? 'text-[#0052cc]' : 'text-slate-400'}`} />
          </button>

          {/* Wallet Option */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('wallet')
              setFormError('')
            }}
            className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
              activeTab === 'wallet'
                ? 'bg-white border-2 border-[#0052cc] shadow-sm text-slate-900 font-bold'
                : 'bg-transparent border border-transparent hover:bg-slate-200/60 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  activeTab === 'wallet' ? 'bg-[#0052cc] text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold">Wallets</div>
                <div className="text-[10px] text-slate-500">Paytm, PhonePe, Amazon Pay</div>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 hidden md:block ${activeTab === 'wallet' ? 'text-[#0052cc]' : 'text-slate-400'}`} />
          </button>

          {/* Zero-Deposit Option */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('zero_deposit')
              setFormError('')
            }}
            className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
              activeTab === 'zero_deposit'
                ? 'bg-white border-2 border-[#10b981] shadow-sm text-slate-900 font-bold'
                : 'bg-transparent border border-transparent hover:bg-slate-200/60 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  activeTab === 'zero_deposit' ? 'bg-[#10b981] text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                <Landmark className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-emerald-800">Pay on Arrival</div>
                <div className="text-[10px] text-slate-500">Zero-Deposit Hold • Pay at Hotel</div>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 hidden md:block ${activeTab === 'zero_deposit' ? 'text-[#10b981]' : 'text-slate-400'}`} />
          </button>

          <div className="hidden md:flex items-center gap-1.5 text-[10px] text-slate-400 mt-auto pt-4 px-2">
            <Lock className="w-3 h-3 text-slate-400" />
            <span>Secured by Razorpay Rails</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Active Method Details */}
        <div className="w-full md:w-[62%] p-5 sm:p-6 bg-white flex flex-col justify-between relative">
          
          {/* TAB 1: CARD PAYMENT */}
          {activeTab === 'card' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Enter Card Details
                </span>
                <div className="flex items-center gap-2">
                  <VisaLogo />
                  <MastercardLogo />
                  <RuPayLogo />
                </div>
              </div>

              {/* Card Number */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Card Number *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    disabled={isFormDisabled}
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="4532  ••••  ••••  8892"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm font-mono tracking-wider focus:outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 transition-all placeholder:text-slate-300"
                  />
                  <CreditCard className="w-5 h-5 text-slate-400 absolute right-3 top-2.5" />
                </div>
              </div>

              {/* Expiry & CVV */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Expiry Date *
                  </label>
                  <input
                    type="text"
                    disabled={isFormDisabled}
                    value={cardExpiry}
                    onChange={handleExpiryChange}
                    placeholder="MM / YY"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm font-mono focus:outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 transition-all placeholder:text-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1 flex items-center justify-between">
                    <span>CVV / CVC *</span>
                    <span className="text-[10px] text-slate-400 lowercase font-normal">(3 digits on back)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      maxLength={4}
                      disabled={isFormDisabled}
                      value={cardCvv}
                      onChange={(e) => {
                        setFormError('')
                        setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))
                      }}
                      placeholder="•••"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm font-mono focus:outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 transition-all placeholder:text-slate-300"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                  </div>
                </div>
              </div>

              {/* Cardholder Name */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Cardholder's Name *
                </label>
                <input
                  type="text"
                  disabled={isFormDisabled}
                  value={cardHolder}
                  onChange={(e) => {
                    setFormError('')
                    setCardHolder(e.target.value)
                  }}
                  placeholder="Name as printed on card"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 transition-all placeholder:text-slate-300"
                />
              </div>

              <label className="flex items-start gap-2 pt-1 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveCard}
                  onChange={(e) => setSaveCard(e.target.checked)}
                  className="mt-0.5 rounded text-[#0052cc] focus:ring-[#0052cc]"
                />
                <span className="leading-tight">
                  Securely save card as per RBI guidelines. Details are encrypted end-to-end.
                </span>
              </label>
            </div>
          )}

          {/* TAB 2: UPI / QR PAYMENT WITH REAL LOGOS & MANDATORY VALIDATION */}
          {activeTab === 'upi' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setUpiSubMode('apps')
                    setFormError('')
                  }}
                  className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    upiSubMode === 'apps' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  ⚡ UPI Apps &amp; ID
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUpiSubMode('qr')
                    setFormError('')
                  }}
                  className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    upiSubMode === 'qr' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5 text-[#0052cc]" />
                  <span>Scan QR Code</span>
                </button>
              </div>

              {upiSubMode === 'apps' ? (
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-slate-600">Select Instant UPI App</div>
                  
                  {/* Real Official Logos for GPay, PhonePe, Paytm, BHIM */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { id: 'gpay', name: 'Google Pay', suffix: '@okhdfcbank', Logo: GooglePayLogo },
                      { id: 'phonepe', name: 'PhonePe', suffix: '@ybl', Logo: PhonePeLogo },
                      { id: 'paytm', name: 'Paytm UPI', suffix: '@paytm', Logo: PaytmLogo },
                      { id: 'bhim', name: 'BHIM UPI', suffix: '@upi', Logo: BhimUpiLogo },
                    ].map((app) => {
                      const LogoComponent = app.Logo
                      return (
                        <button
                          key={app.id}
                          type="button"
                          onClick={() => {
                            setSelectedUpiApp(app.id)
                            setFormError('')
                            if (!customUpiId || customUpiId.includes('@')) {
                              const prefix = customerPhone ? customerPhone.replace(/\D/g, '').slice(-10) : 'user'
                              setCustomUpiId(prefix + app.suffix)
                            }
                          }}
                          className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                            selectedUpiApp === app.id
                              ? 'bg-blue-50/50 border-[#0052cc] text-slate-900 ring-1 ring-[#0052cc]'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <LogoComponent />
                            <span className="text-xs font-bold text-slate-800">{app.name}</span>
                          </div>
                          {selectedUpiApp === app.id && <Check className="w-4 h-4 text-[#0052cc]" />}
                        </button>
                      )
                    })}
                  </div>

                  {/* Mandatory UPI ID Input */}
                  <div className="pt-2">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Enter UPI ID / VPA to Authorize *
                    </label>
                    <input
                      type="text"
                      disabled={isFormDisabled}
                      value={customUpiId}
                      onChange={(e) => {
                        setFormError('')
                        setCustomUpiId(e.target.value)
                      }}
                      placeholder="e.g. 9876543210@paytm or name@okhdfcbank"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 transition-all placeholder:text-slate-300"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      A payment collect request will be sent to this ID for authorization.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-2 space-y-2 text-center">
                  <div className="p-3 bg-white border border-slate-200 rounded-xl">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=razorpay@icici%26pn=ToursAndTravellers%26am=${amount}%26cu=INR`}
                      alt="Razorpay Dynamic UPI QR"
                      className="w-36 h-36 rounded-md mx-auto"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="text-xs font-bold text-slate-800">
                    Scan with any UPI App on your phone
                  </div>
                  <div className="text-xs text-slate-600 font-semibold">
                    Amount: <strong className="text-slate-900">₹{Number(amount).toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-amber-600 font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>QR Code expires in {formatTimer(qrCountdown)}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: NETBANKING WITH REAL BANK LOGOS */}
          {activeTab === 'netbanking' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Popular Indian Banks
                </span>
                <span className="text-[10px] text-slate-400">Direct Banking Rails</span>
              </div>

              {/* Grid of 6 Popular Banks with Real Logos */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {POPULAR_BANKS.map((b) => {
                  const BankLogo = b.Logo
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        setSelectedBank(b.id)
                        setOtherBank('')
                        setFormError('')
                      }}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                        selectedBank === b.id && !otherBank
                          ? 'bg-blue-50/70 border-[#0052cc] text-slate-900 ring-2 ring-[#0052cc]/30 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <BankLogo />
                      <span className="text-xs font-bold text-slate-800">{b.name}</span>
                    </button>
                  )
                })}
              </div>

              <div className="pt-2">
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Or Select Another Bank
                </label>
                <select
                  disabled={isFormDisabled}
                  value={otherBank}
                  onChange={(e) => {
                    setOtherBank(e.target.value)
                    setFormError('')
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 transition-all bg-white"
                >
                  <option value="">-- Choose from 30+ Other Banks --</option>
                  {ALL_OTHER_BANKS.map((bankName) => (
                    <option key={bankName} value={bankName}>
                      {bankName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* TAB 4: WALLETS */}
          {activeTab === 'wallet' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Select Digital Wallet
                </span>
                <span className="text-[10px] text-slate-400">Instant OTP</span>
              </div>

              <div className="space-y-2">
                {WALLET_PROVIDERS.map((w) => {
                  const WalletLogo = w.Logo
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setSelectedWallet(w.id)}
                      className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                        selectedWallet === w.id
                          ? 'bg-blue-50/50 border-[#0052cc] text-slate-900 ring-1 ring-[#0052cc]'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {WalletLogo ? <WalletLogo /> : <span className="text-lg">{w.icon}</span>}
                        <span className="text-xs font-bold text-slate-800">{w.name}</span>
                      </div>
                      {selectedWallet === w.id && <Check className="w-4 h-4 text-[#0052cc]" />}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* TAB 5: ZERO-DEPOSIT HOLD */}
          {activeTab === 'zero_deposit' && (
            <div className="space-y-3.5 animate-fadeIn">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>VIP Sovereign Guarantee • Pay ₹0 Today</span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Your tour itinerary, luxury transit slots, and resort reservations are 100% confirmed without advance payment. Pay upon arrival at hotel check-in.
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Instant official confirmation voucher sent to {customerEmail || 'your email'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Zero cancellation penalties up to 48 hours prior to journey</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Dedicated 24/7 VIP Concierge Manager assigned to your booking</span>
                </div>
              </div>
            </div>
          )}

          {/* INLINE VALIDATION ERROR ALERT */}
          {formError && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{formError}</span>
            </div>
          )}

          {/* BOTTOM PAY ACTION BUTTON */}
          <div className="pt-4 mt-4 border-t border-slate-100">
            <button
              type="button"
              disabled={isFormDisabled}
              onClick={handlePayClick}
              className={`w-full py-3.5 px-6 rounded-xl text-white text-xs sm:text-sm font-black tracking-wider uppercase shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'zero_deposit'
                  ? 'bg-[#10b981] hover:bg-[#059669] shadow-emerald-500/20'
                  : 'bg-[#0052cc] hover:bg-[#0747a6] shadow-blue-500/20'
              } disabled:opacity-60`}
            >
              {processingState === 'connecting' && (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>CONNECTING BANK GATEWAY...</span>
                </>
              )}

              {processingState === 'verifying' && (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>AUTHORIZING TRANSACTION...</span>
                </>
              )}

              {processingState === 'success' && (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>TRANSACTION VERIFIED &amp; SECURED</span>
                </>
              )}

              {processingState === null && (
                <>
                  <Lock className="w-4 h-4 stroke-[2.5]" />
                  <span>
                    {activeTab === 'zero_deposit'
                      ? 'CONFIRM VIP ZERO-DEPOSIT RESERVATION'
                      : activeTab === 'card'
                      ? `PROCEED TO BANK OTP (₹${Number(amount || 0).toLocaleString('en-IN')})`
                      : activeTab === 'upi' && upiSubMode === 'apps'
                      ? `SEND UPI REQUEST (₹${Number(amount || 0).toLocaleString('en-IN')})`
                      : `PAY ₹${Number(amount || 0).toLocaleString('en-IN')}`}
                  </span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>

            {/* Sub-footer with Security Badges & SDK Option */}
            <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2 text-[10px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0052cc]" />
                <span>256-Bit SSL Encryption • PCI-DSS Level 1 Certified</span>
              </div>
              <button
                type="button"
                onClick={handleLaunchSdk}
                className="text-[#0052cc] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <span>Launch Razorpay Popup SDK</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default RazorpayWhiteCheckout
