import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  Check,
  Gift
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import maldivesImg from '../assets/images/travel_image/maldives.jpg'
import logoImg from '../assets/images/logo.png'
import AnimatedBackgroundCompass from '../components/ui/AnimatedBackgroundCompass'

export const Register = () => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [whatsappUpdates, setWhatsappUpdates] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || (typeof location.state?.from === 'string' ? location.state.from : null) || '/account'

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!whatsappUpdates) {
      setErrorMsg('Please tick the WhatsApp trip updates checkbox to proceed.')
      return
    }

    if (!agreeTerms) {
      setErrorMsg('Please agree to the Terms of Service & Privacy Policy to create your account.')
      return
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.')
      return
    }

    setLoading(true)
    setErrorMsg('')
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password: password.trim(),
      })
      navigate(from, { replace: true })
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Registration failed. Please verify your details.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-28 sm:pt-32 md:pt-36 pb-12 min-h-screen bg-[#071A16] flex flex-col items-center justify-center px-4 sm:px-6 relative overflow-hidden select-none">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#6FCF45]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] bg-[#12382E]/50 rounded-full blur-[120px] pointer-events-none" />

      {/* Top-Right Background Animated Luxury Compass */}
      <div className="absolute top-20 sm:top-24 right-2 sm:right-8 lg:right-14 xl:right-24 pointer-events-none z-0">
        <AnimatedBackgroundCompass size={440} opacity={0.65} />
      </div>

      {/* Bottom-Left Ambient Compass Watermark */}
      <div className="absolute -bottom-16 -left-16 pointer-events-none z-0 hidden xl:block">
        <AnimatedBackgroundCompass size={320} opacity={0.25} />
      </div>

      {/* Fully Transparent Split-Screen Luxury Auth Container */}
      <div className="w-full max-w-[980px] mx-auto bg-transparent border border-white/20 rounded-[24px] overflow-hidden shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85)] grid grid-cols-1 md:grid-cols-12 min-h-[540px] md:h-[560px] relative z-10">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: PURE CINEMATIC TRAVEL IMAGE & MEMBER PERKS                   */}
        {/* ========================================================================= */}
        <div className="md:col-span-5 relative h-[180px] sm:h-[220px] md:h-full overflow-hidden group">
          <img
            src={maldivesImg}
            alt="Maldives Overwater Sanctuary"
            className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071A16] via-black/40 to-black/20" />
          
          {/* Perks Floating Badge at bottom */}
          <div className="absolute bottom-6 left-6 right-6 hidden md:block text-left">
            <div className="p-3.5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/15 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#6FCF45]">
                <Gift className="w-4 h-4" />
                <span>Voyager Member Privileges</span>
              </div>
              <ul className="text-[11px] text-[#A8B5AF] space-y-1">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-[#6FCF45]" />
                  <span>500 Welcome Travel Points credited instantly</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-[#6FCF45]" />
                  <span>VIP custom itinerary generator &amp; quotes</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-[#6FCF45]" />
                  <span>Direct 24/7 Concierge WhatsApp support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: DETAILED CLIENT REGISTRATION FORM                           */}
        {/* ========================================================================= */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-center h-full text-left bg-transparent relative overflow-y-auto">
          
          {/* Header & Logo */}
          <div className="mb-3.5">
            <Link to="/" className="inline-flex items-center gap-2.5 group mb-2">
              <img
                src={logoImg}
                alt="Tours &amp; Travels Logo"
                className="h-7 w-auto object-contain drop-shadow-[0_2px_8px_rgba(111,207,69,0.4)] group-hover:scale-105 transition-transform"
              />
              <div className="flex items-center gap-1 text-[11px] font-bold tracking-[0.18em] text-white uppercase font-heading">
                <span>TOURS &amp;</span>
                <span className="text-[#6FCF45]">TRAVELS</span>
              </div>
            </Link>

            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-heading tracking-tight">
              Create Client Account
            </h1>
            <p className="text-[11px] text-[#A8B5AF] mt-0.5">
              Unlock exclusive luxury itineraries, booking vouchers &amp; 500 reward points.
            </p>
          </div>

          {/* Error Message Alert */}
          {errorMsg && (
            <div className="mb-3 p-2.5 rounded-[8px] bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2 animate-fadeIn">
              <span>⚠️ {errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-2.5">
            
            {/* Grid Row 1: Full Name & Mobile Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Full Name */}
              <div>
                <label className="block text-[10.5px] font-bold uppercase tracking-wider text-[#A8B5AF] mb-1">
                  Full Name *
                </label>
                <div className="relative group/input">
                  <User className="w-3.5 h-3.5 text-[#A8B5AF] group-focus-within/input:text-[#6FCF45] transition-colors absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Vivang Mishra"
                    className="w-full bg-black/35 border border-white/20 focus:border-[#6FCF45] focus:bg-black/50 focus:ring-2 focus:ring-[#6FCF45]/20 rounded-[8px] pl-8.5 pr-3 py-1.5 text-xs text-white focus:outline-none transition-all placeholder:text-white/30"
                  />
                </div>
              </div>

              {/* Mobile Number / WhatsApp */}
              <div>
                <label className="block text-[10.5px] font-bold uppercase tracking-wider text-[#A8B5AF] mb-1">
                  Mobile Number / WhatsApp *
                </label>
                <div className="relative group/input">
                  <Phone className="w-3.5 h-3.5 text-[#A8B5AF] group-focus-within/input:text-[#6FCF45] transition-colors absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="+91 98765 43210"
                    className="w-full bg-black/35 border border-white/20 focus:border-[#6FCF45] focus:bg-black/50 focus:ring-2 focus:ring-[#6FCF45]/20 rounded-[8px] pl-8.5 pr-3 py-1.5 text-xs text-white focus:outline-none transition-all placeholder:text-white/30"
                  />
                </div>
              </div>
            </div>

            {/* Grid Row 2: Email Address */}
            <div>
              <label className="block text-[10.5px] font-bold uppercase tracking-wider text-[#A8B5AF] mb-1">
                Email Address *
              </label>
              <div className="relative group/input">
                <Mail className="w-3.5 h-3.5 text-[#A8B5AF] group-focus-within/input:text-[#6FCF45] transition-colors absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  className="w-full bg-black/35 border border-white/20 focus:border-[#6FCF45] focus:bg-black/50 focus:ring-2 focus:ring-[#6FCF45]/20 rounded-[8px] pl-8.5 pr-3 py-1.5 text-xs text-white focus:outline-none transition-all placeholder:text-white/30"
                />
              </div>
            </div>

            {/* Grid Row 3: Password */}
            <div>
              <label className="block text-[10.5px] font-bold uppercase tracking-wider text-[#A8B5AF] mb-1">
                Password (Min. 6 Characters) *
              </label>
              <div className="relative group/input">
                <Lock className="w-3.5 h-3.5 text-[#A8B5AF] group-focus-within/input:text-[#6FCF45] transition-colors absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Create secure password"
                  className="w-full bg-black/35 border border-white/20 focus:border-[#6FCF45] focus:bg-black/50 focus:ring-2 focus:ring-[#6FCF45]/20 rounded-[8px] pl-8.5 pr-8 py-1.5 text-xs text-white focus:outline-none transition-all placeholder:text-white/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A8B5AF] hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Checkboxes: WhatsApp Updates & Terms (Both Strictly Mandatory) */}
            <div className="pt-1 space-y-1.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={whatsappUpdates}
                  onChange={(e) => setWhatsappUpdates(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-[#6FCF45] bg-black/40 border-white/25 focus:ring-[#6FCF45] cursor-pointer"
                />
                <span className="text-[10.5px] text-[#A8B5AF]">
                  Receive trip quotes &amp; instant booking vouchers on WhatsApp *
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-[#6FCF45] bg-black/40 border-white/25 focus:ring-[#6FCF45] cursor-pointer"
                />
                <span className="text-[10.5px] text-[#A8B5AF]">
                  I agree to the{' '}
                  <span className="text-[#6FCF45] hover:underline">Terms of Service</span> &amp;{' '}
                  <span className="text-[#6FCF45] hover:underline">Privacy Policy</span> *
                </span>
              </label>
            </div>

            {/* Create Account CTA Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 h-[42px] rounded-[8px] bg-gradient-to-r from-[#6FCF45] to-[#58B832] hover:from-[#7EE054] hover:to-[#65C93C] text-[#071A16] font-extrabold text-xs uppercase tracking-[0.15em] shadow-lg shadow-[#6FCF45]/25 hover:shadow-xl hover:shadow-[#6FCF45]/40 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              <span>{loading ? 'Creating Voyager Account...' : 'REGISTER & CLAIM 500 POINTS'}</span>
              {!loading && <ArrowRight className="w-4 h-4 stroke-[2.5]" />}
            </button>
          </form>

          {/* Login Switch */}
          <div className="mt-3.5 pt-2.5 border-t border-white/15 text-center text-xs text-[#A8B5AF]">
            Already have an account?{' '}
            <Link
              to="/login"
              state={location.state}
              className="text-[#6FCF45] font-bold hover:text-[#8BE35A] hover:underline transition-colors ml-1"
            >
              Sign In Here
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Register
