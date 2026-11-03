import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  AlertTriangle,
  KeyRound,
  Compass,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import logoImg from '../assets/images/logo.png'
import AnimatedBackgroundCompass from '../components/ui/AnimatedBackgroundCompass'

export const AdminLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [isCustomerAccount, setIsCustomerAccount] = useState(false)

  const { adminLogin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/admin'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    setIsCustomerAccount(false)

    try {
      const cleanEmail = email.trim().toLowerCase()
      const cleanPassword = password.trim()

      const res = await adminLogin({ email: cleanEmail, password: cleanPassword })
      if (res.user?.role === 'admin') {
        navigate(from, { replace: true })
      } else {
        navigate('/admin', { replace: true })
      }
    } catch (err) {
      if (!err.response) {
        setErrorMsg('Unable to reach backend security service. Please verify backend server is active on Port 5000.')
      } else {
        const msg = err.response?.data?.message || 'Invalid administrative credentials.'
        setErrorMsg(msg)
        if (msg.toLowerCase().includes('customer') || err.response.status === 403) {
          setIsCustomerAccount(true)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#071A16] flex flex-col items-center justify-center px-4 sm:px-6 relative overflow-hidden select-none">
      {/* Sovereign High-Security Ambient Lighting */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#6FCF45]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] bg-[#12382E]/50 rounded-full blur-[130px] pointer-events-none" />

      {/* Ambient Rotating Compass Watermark */}
      <div className="absolute top-10 right-10 pointer-events-none z-0 opacity-40">
        <AnimatedBackgroundCompass size={400} opacity={0.35} />
      </div>

      <div className="relative z-10 w-full max-w-[480px]">
        
        {/* Top Restricted Security Badge */}
        <div className="flex items-center justify-center mb-6 animate-fadeIn">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#13151A] border border-[#6FCF45]/30 text-[#6FCF45] text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[#6FCF45]/10">
            <span className="w-2 h-2 rounded-full bg-[#6FCF45] animate-pulse" />
            <span>Restricted Gateway • Super Admin Access</span>
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-[#0B241E]/95 border-2 border-white/10 rounded-3xl p-7 sm:p-9 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          
          {/* Subtle Top Accent Border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#6FCF45] to-transparent" />

          {/* Header & Logo */}
          <div className="text-center mb-7">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#071A16] border border-[#6FCF45]/40 shadow-inner mb-4 group">
              <img
                src={logoImg}
                alt="Brand Logo"
                className="w-9 h-9 object-contain drop-shadow-[0_0_10px_rgba(111,207,69,0.5)] transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
                decoding="async"
              />
            </div>
            
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wider uppercase font-heading">
              Admin <span className="text-[#6FCF45]">Gatekeeper</span>
            </h1>
            <p className="text-xs text-[#A8B5AF] mt-1 font-medium">
              Platform Governance, Financial Operations &amp; Concierge Console
            </p>
          </div>

          {/* Error Notice */}
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-200 flex items-start gap-2.5 animate-fadeIn">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <div className="flex-1 space-y-1">
                <p className="font-semibold">{errorMsg}</p>
                {isCustomerAccount && (
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#6FCF45] hover:underline pt-0.5"
                  >
                    <span>Go to Traveler / Customer Login</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {/* Email Field */}
            <div>
              <label className="block text-[10px] font-black text-[#A8B5AF] uppercase tracking-[0.2em] mb-1.5">
                Administrator Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@domain.com"
                  className="w-full pl-10 pr-4 py-3 bg-[#071A16] border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#6FCF45] focus:ring-1 focus:ring-[#6FCF45] transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[10px] font-black text-[#A8B5AF] uppercase tracking-[0.2em] mb-1.5">
                Master Security Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-3 bg-[#071A16] border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#6FCF45] focus:ring-1 focus:ring-[#6FCF45] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl bg-[#6FCF45] hover:bg-[#85e65b] text-[#071A16] text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg shadow-[#6FCF45]/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-[#071A16] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <KeyRound className="w-4 h-4 stroke-[2.5]" />
                  <span>AUTHORIZE &amp; ENTER TERMINAL</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {/* Audit Trail Disclaimer */}
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] text-white/40">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#6FCF45]" />
              <span>IP Logged &amp; TLS 1.3 Verified</span>
            </div>
            <Link to="/" className="text-[#A8B5AF] hover:text-white transition-colors">
              Return to Site
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin

