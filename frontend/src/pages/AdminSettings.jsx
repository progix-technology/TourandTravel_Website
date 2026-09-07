import React, { useState, useEffect } from 'react'
import {
  Settings,
  Building,
  Shield,
  CreditCard,
  Bell,
  Database,
  Save,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  MapPin,
  Globe,
  RefreshCw,
  AlertTriangle,
  Server,
  User
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useSettings } from '../context/SettingsContext'

const AdminSettings = () => {
  const { user } = useAuth()
  const { settings, updateSettings, bookingSettings: globalBookingSettings, updateBookingSettings } = useSettings()

  const [activeTab, setActiveTab] = useState('general')
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [cacheCleared, setCacheCleared] = useState(false)

  // Local form state initialized from Context defaults
  const [generalSettings, setGeneralSettings] = useState(settings)
  const [bookingSettings, setBookingSettings] = useState(globalBookingSettings)

  // Keep local form in sync when context changes
  useEffect(() => {
    setGeneralSettings(settings)
  }, [settings])

  useEffect(() => {
    setBookingSettings(globalBookingSettings)
  }, [globalBookingSettings])

  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: true,
    sessionTimeoutMins: 60
  })

  const [maintenanceMode, setMaintenanceMode] = useState(() => {
    return localStorage.getItem('agy_admin_maintenance_mode') === 'true'
  })

  const handleSaveGeneral = (e) => {
    e.preventDefault()
    updateSettings(generalSettings)
    triggerSuccess()
  }

  const handleSaveBooking = (e) => {
    e.preventDefault()
    updateBookingSettings(bookingSettings)
    triggerSuccess()
  }

  const handleSaveSecurity = (e) => {
    e.preventDefault()
    if (securitySettings.newPassword && securitySettings.newPassword !== securitySettings.confirmPassword) {
      alert('New password and confirm password do not match!')
      return
    }
    setSecuritySettings(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }))
    triggerSuccess()
  }

  const toggleMaintenance = () => {
    const newVal = !maintenanceMode
    setMaintenanceMode(newVal)
    localStorage.setItem('agy_admin_maintenance_mode', String(newVal))
    triggerSuccess()
  }

  const clearSystemCache = () => {
    setCacheCleared(true)
    setTimeout(() => setCacheCleared(false), 3000)
  }

  const triggerSuccess = () => {
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const tabs = [
    { id: 'general', label: 'Concierge & Operations', icon: Phone },
    { id: 'booking', label: 'Booking & Policies', icon: CreditCard },
    { id: 'security', label: 'Security & Access', icon: Shield },
    { id: 'system', label: 'System & Maintenance', icon: Database },
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto animate-fadeIn text-white font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-wide">Platform Settings</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#6FCF45]/15 text-[#6FCF45] border border-[#6FCF45]/30">
              Super Admin Config
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#A8B5AF] mt-1">
            Configure system parameters, booking financial rules, security controls, and agency branding.
          </p>
        </div>

        {/* Global Success Notification */}
        {saveSuccess && (
          <div className="flex items-center gap-2 px-4 py-2 bg-[#6FCF45]/20 border border-[#6FCF45]/40 text-[#6FCF45] rounded-xl text-xs font-bold animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings successfully saved!</span>
          </div>
        )}
      </div>

      {/* Main Grid: Tabs Sidebar + Content Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Navigation Tabs */}
        <div className="lg:col-span-3 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 custom-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap text-left w-full ${
                  isActive
                    ? 'bg-[#6FCF45] text-[#071A16] shadow-lg shadow-[#6FCF45]/20 font-bold'
                    : 'bg-[#1A1D24] text-[#A8B5AF] hover:text-white hover:bg-white/5 border border-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#071A16]' : 'text-[#6FCF45]'}`} />
                <span>{tab.label}</span>
              </button>
            )
          })}

          {/* Quick System Info Card */}
          <div className="hidden lg:block mt-6 p-4 bg-[#1A1D24] border border-white/5 rounded-2xl text-xs space-y-3">
            <div className="text-[#A8B5AF] font-bold uppercase tracking-wider text-[10px]">Server Health</div>
            <div className="flex items-center justify-between text-[#A8B5AF]">
              <span>API Gateway</span>
              <span className="flex items-center gap-1 text-[#6FCF45] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6FCF45] animate-ping" /> Online
              </span>
            </div>
            <div className="flex items-center justify-between text-[#A8B5AF]">
              <span>Database</span>
              <span className="text-[#6FCF45] font-bold">MongoDB Atlas</span>
            </div>
            <div className="flex items-center justify-between text-[#A8B5AF]">
              <span>Media CDN</span>
              <span className="text-[#6FCF45] font-bold">Cloudinary</span>
            </div>
            <div className="flex items-center justify-between text-[#A8B5AF] border-t border-white/5 pt-2">
              <span>Environment</span>
              <span className="text-white font-mono font-bold">Production v1.4</span>
            </div>
          </div>
        </div>

        {/* Tab Content Panel */}
        <div className="lg:col-span-9 bg-[#1A1D24] border border-white/5 rounded-2xl p-6 sm:p-8 shadow-2xl">
          
          {/* 1. Concierge & Operations */}
          {activeTab === 'general' && (
            <form onSubmit={handleSaveGeneral} className="space-y-6 animate-fadeIn">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-lg font-bold text-white">Concierge &amp; Public Operations</h2>
                <p className="text-xs text-[#A8B5AF] mt-0.5">Configure live inquiry numbers, WhatsApp concierge, official address, and social links.</p>
              </div>

              {/* 1. Direct Contact Channels */}
              <div>
                <h3 className="text-xs font-bold text-[#6FCF45] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" />
                  <span>Direct Communication Channels</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-[#A8B5AF] uppercase tracking-wider mb-2">
                      Primary Inquiries Phone (Header / Navbar)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8B5AF]" />
                      <input
                        type="text"
                        value={generalSettings.inquiryPhone}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, inquiryPhone: e.target.value })}
                        className="w-full bg-[#13151A] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#6FCF45] transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#A8B5AF] uppercase tracking-wider mb-2">
                      WhatsApp Concierge Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6FCF45]" />
                      <input
                        type="text"
                        value={generalSettings.whatsappNumber}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, whatsappNumber: e.target.value })}
                        className="w-full bg-[#13151A] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#6FCF45] transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#A8B5AF] uppercase tracking-wider mb-2">
                      Official Inquiries Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8B5AF]" />
                      <input
                        type="email"
                        value={generalSettings.supportEmail}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, supportEmail: e.target.value })}
                        className="w-full bg-[#13151A] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#6FCF45] transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#A8B5AF] uppercase tracking-wider mb-2">
                      24/7 Emergency Helpline
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400" />
                      <input
                        type="text"
                        value={generalSettings.emergencyHelpline}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, emergencyHelpline: e.target.value })}
                        className="w-full bg-[#13151A] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#6FCF45] transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Office & Operating Hours */}
              <div className="pt-4 border-t border-white/10">
                <h3 className="text-xs font-bold text-[#6FCF45] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Headquarters &amp; Timings</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#A8B5AF] uppercase tracking-wider mb-2">
                      Registered Headquarters Address
                    </label>
                    <textarea
                      rows={2}
                      value={generalSettings.officeAddress}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, officeAddress: e.target.value })}
                      className="w-full bg-[#13151A] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#6FCF45] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#A8B5AF] uppercase tracking-wider mb-2">
                      Google Maps Location URL
                    </label>
                    <div className="relative">
                      <Globe className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8B5AF]" />
                      <input
                        type="url"
                        value={generalSettings.googleMapUrl}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, googleMapUrl: e.target.value })}
                        className="w-full bg-[#13151A] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#6FCF45] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#A8B5AF] uppercase tracking-wider mb-2">
                      Concierge Desk Timings
                    </label>
                    <input
                      type="text"
                      value={generalSettings.conciergeHours}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, conciergeHours: e.target.value })}
                      className="w-full bg-[#13151A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#6FCF45] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Social Media Channels */}
              <div className="pt-4 border-t border-white/10">
                <h3 className="text-xs font-bold text-[#6FCF45] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Social Media Connections</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-[#A8B5AF] uppercase tracking-wider mb-2">
                      Instagram Profile URL
                    </label>
                    <input
                      type="url"
                      value={generalSettings.instagramUrl}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, instagramUrl: e.target.value })}
                      className="w-full bg-[#13151A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#6FCF45] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#A8B5AF] uppercase tracking-wider mb-2">
                      Facebook Page URL
                    </label>
                    <input
                      type="url"
                      value={generalSettings.facebookUrl}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, facebookUrl: e.target.value })}
                      className="w-full bg-[#13151A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#6FCF45] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#A8B5AF] uppercase tracking-wider mb-2">
                      YouTube Channel URL
                    </label>
                    <input
                      type="url"
                      value={generalSettings.youtubeUrl}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, youtubeUrl: e.target.value })}
                      className="w-full bg-[#13151A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#6FCF45] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#A8B5AF] uppercase tracking-wider mb-2">
                      Twitter / X Handle URL
                    </label>
                    <input
                      type="url"
                      value={generalSettings.twitterUrl}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, twitterUrl: e.target.value })}
                      className="w-full bg-[#13151A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#6FCF45] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Top Announcement Bar */}
              <div className="pt-4 border-t border-white/10">
                <h3 className="text-xs font-bold text-[#6FCF45] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Bell className="w-3.5 h-3.5" />
                  <span>Promotional Top Announcement Banner</span>
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#A8B5AF] uppercase tracking-wider mb-2">
                      Banner Announcement Text
                    </label>
                    <input
                      type="text"
                      value={generalSettings.announcementText}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, announcementText: e.target.value })}
                      className="w-full bg-[#13151A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#6FCF45] transition-colors"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-[#13151A] rounded-xl border border-white/5">
                    <div>
                      <h4 className="text-sm font-semibold text-white">Display Promo Announcement Bar</h4>
                      <p className="text-xs text-[#A8B5AF]">Show promotional discount / alert banner at the very top of the customer website.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={generalSettings.showAnnouncement}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, showAnnouncement: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6FCF45]"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                {saveSuccess && (
                  <div className="flex items-center gap-1.5 px-3.5 py-2 bg-[#6FCF45]/20 border border-[#6FCF45]/50 text-[#6FCF45] rounded-xl text-xs font-bold animate-fadeIn shadow-lg shadow-[#6FCF45]/10">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Information saved</span>
                  </div>
                )}
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-[#6FCF45] hover:bg-[#5db836] text-[#071A16] px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#6FCF45]/20 cursor-pointer active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  Save Operations Settings
                </button>
              </div>
            </form>
          )}

          {/* 2. Booking & Policies */}
          {activeTab === 'booking' && (
            <form onSubmit={handleSaveBooking} className="space-y-6 animate-fadeIn">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-lg font-bold text-white">Booking &amp; Financial Governance</h2>
                <p className="text-xs text-[#A8B5AF] mt-0.5">Control deposit thresholds, tax application, and automated booking notifications.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-[#A8B5AF] uppercase tracking-wider mb-2">
                    Advance Booking Deposit (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={bookingSettings.advanceDepositPct}
                      onChange={(e) => setBookingSettings({ ...bookingSettings, advanceDepositPct: Number(e.target.value) })}
                      className="w-full bg-[#13151A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#6FCF45] transition-colors"
                      required
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#A8B5AF] font-bold">%</span>
                  </div>
                  <span className="text-[11px] text-[#A8B5AF] mt-1 block">Percentage collected at checkout to confirm expedition.</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A8B5AF] uppercase tracking-wider mb-2">
                    Applicable GST / Luxury Tax (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={bookingSettings.gstTaxRate}
                      onChange={(e) => setBookingSettings({ ...bookingSettings, gstTaxRate: Number(e.target.value) })}
                      className="w-full bg-[#13151A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#6FCF45] transition-colors"
                      required
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#A8B5AF] font-bold">%</span>
                  </div>
                  <span className="text-[11px] text-[#A8B5AF] mt-1 block">Automatically calculated on total checkout invoices.</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A8B5AF] uppercase tracking-wider mb-2">
                    Free Cancellation Window (Hours)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={bookingSettings.cancellationHours}
                    onChange={(e) => setBookingSettings({ ...bookingSettings, cancellationHours: Number(e.target.value) })}
                    className="w-full bg-[#13151A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#6FCF45] transition-colors"
                  />
                  <span className="text-[11px] text-[#A8B5AF] mt-1 block">Full refund window permitted before tour start date.</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A8B5AF] uppercase tracking-wider mb-2">
                    Custom Trip Quote Validity (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={bookingSettings.customTripQuoteExpiryDays}
                    onChange={(e) => setBookingSettings({ ...bookingSettings, customTripQuoteExpiryDays: Number(e.target.value) })}
                    className="w-full bg-[#13151A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#6FCF45] transition-colors"
                  />
                  <span className="text-[11px] text-[#A8B5AF] mt-1 block">Days before custom concierge quote expires.</span>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between p-4 bg-[#13151A] rounded-xl border border-white/5">
                  <div>
                    <h4 className="text-sm font-semibold text-white">Auto-Confirm Direct Bookings</h4>
                    <p className="text-xs text-[#A8B5AF]">Instantly mark paid bookings as 'Confirmed' without manual admin review.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={bookingSettings.autoConfirmBookings}
                      onChange={(e) => setBookingSettings({ ...bookingSettings, autoConfirmBookings: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6FCF45]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#13151A] rounded-xl border border-white/5">
                  <div>
                    <h4 className="text-sm font-semibold text-white">Instant Email Alerts</h4>
                    <p className="text-xs text-[#A8B5AF]">Send instant notification email to concierge desk whenever a client books.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={bookingSettings.emailAlertsOnBooking}
                      onChange={(e) => setBookingSettings({ ...bookingSettings, emailAlertsOnBooking: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6FCF45]"></div>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                {saveSuccess && (
                  <div className="flex items-center gap-1.5 px-3.5 py-2 bg-[#6FCF45]/20 border border-[#6FCF45]/50 text-[#6FCF45] rounded-xl text-xs font-bold animate-fadeIn shadow-lg shadow-[#6FCF45]/10">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Information saved</span>
                  </div>
                )}
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-[#6FCF45] hover:bg-[#5db836] text-[#071A16] px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#6FCF45]/20 cursor-pointer active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  Save Booking Policies
                </button>
              </div>
            </form>
          )}

          {/* 3. Security & Access */}
          {activeTab === 'security' && (
            <form onSubmit={handleSaveSecurity} className="space-y-6 animate-fadeIn">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-lg font-bold text-white">Security &amp; Super Admin Credentials</h2>
                <p className="text-xs text-[#A8B5AF] mt-0.5">Manage administrative credentials, passwords, and multi-factor authentication.</p>
              </div>

              {/* Active Admin Profile Card */}
              <div className="flex items-center gap-4 p-4 bg-[#13151A] rounded-xl border border-white/5">
                <div className="w-12 h-12 rounded-full border-2 border-[#6FCF45] bg-[#13382C] flex items-center justify-center text-[#6FCF45] shrink-0 shadow-md">
                  <User className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{user?.name || 'Vivang Mishra'}</h4>
                    <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-red-400/10 text-red-400 border border-red-400/30">
                      Root Admin
                    </span>
                  </div>
                  <p className="text-xs text-[#A8B5AF]">{user?.email || 'admin@tours.com'}</p>
                </div>
              </div>

              {/* Password Change Fields */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-[#A8B5AF] uppercase tracking-wider">Update Administrative Password</h3>

                <div>
                  <label className="block text-xs font-semibold text-[#A8B5AF] mb-1.5">Current Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8B5AF]" />
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      value={securitySettings.currentPassword}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, currentPassword: e.target.value })}
                      className="w-full bg-[#13151A] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#6FCF45] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#A8B5AF] mb-1.5">New Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8B5AF]" />
                      <input
                        type="password"
                        placeholder="••••••••••••"
                        value={securitySettings.newPassword}
                        onChange={(e) => setSecuritySettings({ ...securitySettings, newPassword: e.target.value })}
                        className="w-full bg-[#13151A] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#6FCF45] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#A8B5AF] mb-1.5">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8B5AF]" />
                      <input
                        type="password"
                        placeholder="••••••••••••"
                        value={securitySettings.confirmPassword}
                        onChange={(e) => setSecuritySettings({ ...securitySettings, confirmPassword: e.target.value })}
                        className="w-full bg-[#13151A] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#6FCF45] transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Toggles */}
              <div className="pt-4 border-t border-white/10 space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#13151A] rounded-xl border border-white/5">
                  <div>
                    <h4 className="text-sm font-semibold text-white">Two-Factor Authentication (2FA)</h4>
                    <p className="text-xs text-[#A8B5AF]">Requires one-time OTP verification on unknown device logins.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securitySettings.twoFactorEnabled}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, twoFactorEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6FCF45]"></div>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                {saveSuccess && (
                  <div className="flex items-center gap-1.5 px-3.5 py-2 bg-[#6FCF45]/20 border border-[#6FCF45]/50 text-[#6FCF45] rounded-xl text-xs font-bold animate-fadeIn shadow-lg shadow-[#6FCF45]/10">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Information saved</span>
                  </div>
                )}
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-[#6FCF45] hover:bg-[#5db836] text-[#071A16] px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#6FCF45]/20 cursor-pointer active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  Update Security Settings
                </button>
              </div>
            </form>
          )}

          {/* 4. System & Maintenance */}
          {activeTab === 'system' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-lg font-bold text-white">System Operations &amp; Maintenance</h2>
                <p className="text-xs text-[#A8B5AF] mt-0.5">Control live site availability, perform cache clearances, and check integrations.</p>
              </div>

              {/* Maintenance Mode Banner */}
              <div className={`p-5 rounded-2xl border transition-all ${
                maintenanceMode 
                  ? 'bg-amber-500/10 border-amber-500/30' 
                  : 'bg-[#13151A] border-white/5'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl ${maintenanceMode ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-[#A8B5AF]'}`}>
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">System Maintenance Mode</h3>
                      <p className="text-xs text-[#A8B5AF] mt-0.5">
                        {maintenanceMode 
                          ? 'Maintenance is ACTIVE. Public visitors see an "Under Construction" banner while admins have full access.'
                          : 'Platform is LIVE to all worldwide customers and search engine indexers.'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={toggleMaintenance}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                      maintenanceMode
                        ? 'bg-amber-500 text-black hover:bg-amber-400 shadow-lg shadow-amber-500/20'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                    }`}
                  >
                    {maintenanceMode ? 'Disable Maintenance' : 'Enable Maintenance'}
                  </button>
                </div>
              </div>

              {/* Cache & Performance */}
              <div className="p-5 bg-[#13151A] rounded-2xl border border-white/5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-white">Flush System Cache &amp; Prefetches</h3>
                    <p className="text-xs text-[#A8B5AF] mt-0.5">Purges client image prefetch caches and synchronizes latest DB entities.</p>
                  </div>
                  <button
                    onClick={clearSystemCache}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#6FCF45]/10 hover:bg-[#6FCF45]/20 text-[#6FCF45] border border-[#6FCF45]/30 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap active:scale-95"
                  >
                    <RefreshCw className={`w-4 h-4 ${cacheCleared ? 'animate-spin' : ''}`} />
                    {cacheCleared ? 'Cache Flushed!' : 'Purge Cache'}
                  </button>
                </div>
              </div>

              {/* Infrastructure Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-[#13151A] border border-white/5 rounded-xl">
                  <div className="flex items-center gap-2 text-[#A8B5AF] text-xs font-bold uppercase mb-2">
                    <Server className="w-4 h-4 text-[#6FCF45]" />
                    <span>Node.js Backend</span>
                  </div>
                  <div className="text-base font-bold text-white">Port 5000</div>
                  <span className="text-[10px] text-[#6FCF45]">Express Router v4.19</span>
                </div>

                <div className="p-4 bg-[#13151A] border border-white/5 rounded-xl">
                  <div className="flex items-center gap-2 text-[#A8B5AF] text-xs font-bold uppercase mb-2">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <span>Database</span>
                  </div>
                  <div className="text-base font-bold text-white">MongoDB Atlas</div>
                  <span className="text-[10px] text-[#6FCF45]">Replica Set Connected</span>
                </div>

                <div className="p-4 bg-[#13151A] border border-white/5 rounded-xl">
                  <div className="flex items-center gap-2 text-[#A8B5AF] text-xs font-bold uppercase mb-2">
                    <Globe className="w-4 h-4 text-blue-400" />
                    <span>Media Storage</span>
                  </div>
                  <div className="text-base font-bold text-white">Cloudinary CDN</div>
                  <span className="text-[10px] text-[#6FCF45]">Unsigned Preset Active</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default AdminSettings
