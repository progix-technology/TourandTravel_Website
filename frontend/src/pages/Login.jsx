import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import swissImg from '../assets/images/travel_image/Switzerland.jpg'
import logoImg from '../assets/images/logo.png'
import AnimatedBackgroundCompass from '../components/ui/AnimatedBackgroundCompass'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || (typeof location.state?.from === 'string' ? location.state.from : null) || '/account'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    try {
      const res = await login({ email, password })
      if (res.user?.role === 'admin') {
        navigate('/admin', { replace: true })
      } else {
        navigate(from, { replace: true })
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || 'Invalid email or password. Please verify your credentials.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-32 sm:pt-36 md:pt-40 pb-12 min-h-screen bg-[#071A16] flex flex-col items-center justify-center px-4 sm:px-6 relative overflow-hidden select-none">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#6FCF45]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] bg-[#12382E]/50 rounded-full blur-[120px] pointer-events-none" />

      {/* Top-Right Background Animated Luxury Compass - Fully Visible */}
      <div className="absolute top-20 sm:top-24 right-2 sm:right-8 lg:right-14 xl:right-24 pointer-events-none z-0">
        <AnimatedBackgroundCompass size={440} opacity={0.65} />
      </div>

      {/* Bottom-Left Ambient Compass Watermark */}
      <div className="absolute -bottom-16 -left-16 pointer-events-none z-0 hidden xl:block">
        <AnimatedBackgroundCompass size={320} opacity={0.25} />
      </div>

      {/* Fully Transparent Split-Screen Luxury Auth Container */}
      <div className="w-full max-w-[940px] mx-auto bg-transparent border border-white/20 rounded-[22px] overflow-hidden shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85)] grid grid-cols-1 md:grid-cols-12 md:h-[480px] lg:h-[500px] relative z-10">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: PURE CINEMATIC TRAVEL IMAGE                                  */}
        {/* ========================================================================= */}
        <div className="md:col-span-6 relative h-[160px] sm:h-[200px] md:h-full overflow-hidden group">
          {/* Background Travel Image */}
          <img
            src={swissImg}
            alt="Swiss Alps Luxury Expedition"
            className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
          />
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: FULLY TRANSPARENT CLIENT LOGIN FORM                         */}
        {/* ========================================================================= */}
        <div className="md:col-span-6 p-6 sm:p-8 lg:p-9 flex flex-col justify-center h-full text-left bg-transparent relative">
          
          {/* Header & Logo */}
          <div className="mb-4">
            <Link to="/" className="inline-flex items-center gap-2.5 group mb-2.5">
              <img
                src={logoImg}
                alt="Tours &amp; Travels Logo"
                className="h-8 w-auto object-contain drop-shadow-[0_2px_8px_rgba(111,207,69,0.4)] group-hover:scale-105 transition-transform"
              />
              <div className="flex items-center gap-1 text-[11px] font-bold tracking-[0.18em] text-white uppercase font-heading">
                <span>TOURS &amp;</span>
                <span className="text-[#6FCF45]">TRAVELS</span>
              </div>
            </Link>

            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-heading tracking-tight">
              Client Portal Login
            </h1>
            <p className="text-[11px] text-[#A8B5AF] mt-0.5">
              Access your luxury travel vouchers, bookings &amp; bespoke itineraries.
            </p>
          </div>

          {/* Redirection Notice Banner */}
          {location.state?.message && !errorMsg && (
            <div className="mb-3 p-2.5 rounded-[8px] bg-[#6FCF45]/15 border border-[#6FCF45]/40 text-[#6FCF45] text-xs flex items-center gap-2 animate-fadeIn font-medium">
              <span>🔒 {location.state.message}</span>
            </div>
          )}

          {/* Error Message Alert */}
          {errorMsg && (
            <div className="mb-3 p-2.5 rounded-[8px] bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2 animate-fadeIn">
              <span>⚠️ {errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-[10.5px] font-bold uppercase tracking-wider text-[#A8B5AF] mb-1">
                Email Address
              </label>
              <div className="relative group/input">
                <Mail className="w-4 h-4 text-[#A8B5AF] group-focus-within/input:text-[#6FCF45] transition-colors absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  className="w-full bg-black/35 border border-white/20 focus:border-[#6FCF45] focus:bg-black/50 focus:ring-2 focus:ring-[#6FCF45]/20 rounded-[8px] pl-9 pr-3 py-2 text-xs text-white focus:outline-none transition-all placeholder:text-white/30"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[10.5px] font-bold uppercase tracking-wider text-[#A8B5AF]">
                  Password
                </label>
                <a
                  href="mailto:info@progixtechnology.com?subject=Password%20Reset%20Request"
                  className="text-[10px] text-[#6FCF45] hover:text-[#8BE35A] transition-colors hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="relative group/input">
                <Lock className="w-4 h-4 text-[#A8B5AF] group-focus-within/input:text-[#6FCF45] transition-colors absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-black/35 border border-white/20 focus:border-[#6FCF45] focus:bg-black/50 focus:ring-2 focus:ring-[#6FCF45]/20 rounded-[8px] pl-9 pr-9 py-2 text-xs text-white focus:outline-none transition-all placeholder:text-white/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8B5AF] hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-[#6FCF45] bg-black/40 border-white/25 focus:ring-[#6FCF45] cursor-pointer"
                />
                <span className="text-[11px] text-[#A8B5AF]">Remember my login session</span>
              </label>
            </div>

            {/* Sign In CTA Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-1.5 h-[42px] rounded-[8px] bg-gradient-to-r from-[#6FCF45] to-[#58B832] hover:from-[#7EE054] hover:to-[#65C93C] text-[#071A16] font-extrabold text-xs uppercase tracking-[0.15em] shadow-lg shadow-[#6FCF45]/25 hover:shadow-xl hover:shadow-[#6FCF45]/40 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              <span>{loading ? 'Authenticating...' : 'SIGN IN TO ACCOUNT'}</span>
              {!loading && <ArrowRight className="w-4 h-4 stroke-[2.5]" />}
            </button>
          </form>

          {/* Registration Switch */}
          <div className="mt-4 pt-3 border-t border-white/15 text-center text-xs text-[#A8B5AF]">
            New to Tours &amp; Travels?{' '}
            <Link
              to="/register"
              state={location.state}
              className="text-[#6FCF45] font-bold hover:text-[#8BE35A] hover:underline transition-colors ml-1"
            >
              Create Free Account
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Login
