import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  CalendarDays,
  Heart,
  History,
  FileText,
  User,
  Bell,
  Star,
  HelpCircle,
  Search,
  ChevronDown,
  ChevronRight,
  MapPin,
  Calendar,
  Users,
  Download,
  Phone,
  Compass,
  Gift,
  ExternalLink,
  Shield,
  LogOut,
  X,
  Menu,
  CheckCircle2,
  Clock,
  Briefcase,
  Award,
  Crown,
  Zap,
  Globe,
  ArrowRight,
  MessageCircle,
  Sparkles,
  Mountain,
  Mail,
  Edit3,
  Sliders,
  Send,
  Eye,
  Check,
  AlertCircle,
  Trash2
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useBooking } from '../context/BookingContext'
import { useWishlist } from '../context/WishlistContext'
import { useSettings } from '../context/SettingsContext'
import { TOURS } from '../utils/mockData'
import bookingService from '../services/bookingService'
import api from '../services/api'
import logoImg from '../assets/images/logo.png'

// Pre-imported destination assets
import baliImg from '../assets/images/travel_image/bali.jpg'
import swissImg from '../assets/images/travel_image/Switzerland.jpg'
import kashmirImg from '../assets/images/travel_image/kashmir.jpg'
import dubaiImg from '../assets/images/travel_image/dubai.jpg'
import mountainBg from '../assets/images/mountain.jpg'
import bannerBg from '../assets/images/destination_bg.jpg'
import destinationBg1 from '../assets/images/destination_bg1.jpg'
import mountainShapeImg from '../assets/images/mountain_shape.png'

export const Profile = () => {
  const navigate = useNavigate()
  const { user, logout, updateProfile } = useAuth()
  const { bookings: contextBookings, cancelBooking } = useBooking()
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist()
  const { settings } = useSettings()

  // Tabs: 'dashboard' | 'bookings' | 'wishlist' | 'history' | 'customQuotes' | 'profile' | 'notifications' | 'reviews' | 'support'
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [userBookings, setUserBookings] = useState([])
  const [customTrips, setCustomTrips] = useState([])
  const [loading, setLoading] = useState(true)

  // Profile Edit State (Comprehensive Information)
  const [profileName, setProfileName] = useState(user?.name || '')
  const [profilePhone, setProfilePhone] = useState(user?.phone || '')
  const [profileEmail, setProfileEmail] = useState(user?.email || '')
  const [profileDob, setProfileDob] = useState(user?.dob || '')
  const [profileGender, setProfileGender] = useState(user?.gender || 'Male')
  const [profileCity, setProfileCity] = useState(user?.city || '')
  const [profileState, setProfileState] = useState(user?.state || '')
  const [profileCountry, setProfileCountry] = useState(user?.country || 'India')
  const [profileAddress, setProfileAddress] = useState(user?.address || '')
  const [profilePincode, setProfilePincode] = useState(user?.pincode || '')
  const [profilePassport, setProfilePassport] = useState(user?.passportNumber || '')
  const [profilePassportExpiry, setProfilePassportExpiry] = useState(user?.passportExpiry || '')
  const [profileCurrency, setProfileCurrency] = useState(user?.currency || 'INR (₹)')
  const [profileEmergencyName, setProfileEmergencyName] = useState(user?.emergencyName || '')
  const [profileEmergencyPhone, setProfileEmergencyPhone] = useState(user?.emergencyPhone || '')
  const [profileTravelStyle, setProfileTravelStyle] = useState(user?.travelStyle || 'Luxury & Leisure')
  const [profileDietPreference, setProfileDietPreference] = useState(user?.dietPreference || 'Vegetarian')
  const [profileBucketList, setProfileBucketList] = useState(user?.bucketList || 'Switzerland, Bali, Japan, Iceland')
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Selected Booking for Modal Detail/Itinerary
  const [selectedBookingModal, setSelectedBookingModal] = useState(null)

  // Dynamic Notifications State
  const [readNotificationIds, setReadNotificationIds] = useState(() => {
    try {
      const saved = localStorage.getItem(`user_read_notifications_${user?._id || 'guest'}`)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [clearedNotificationIds, setClearedNotificationIds] = useState(() => {
    try {
      const saved = localStorage.getItem(`user_cleared_notifications_${user?._id || 'guest'}`)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [notificationFilter, setNotificationFilter] = useState('all') // 'all' | 'bookings' | 'system'

  useEffect(() => {
    loadUserData()
    try {
      const saved = localStorage.getItem('user_travel_profile')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.dob) setProfileDob(parsed.dob)
        if (parsed.gender) setProfileGender(parsed.gender)
        if (parsed.city) setProfileCity(parsed.city)
        if (parsed.state) setProfileState(parsed.state)
        if (parsed.country) setProfileCountry(parsed.country)
        if (parsed.address) setProfileAddress(parsed.address)
        if (parsed.pincode) setProfilePincode(parsed.pincode)
        if (parsed.passportNumber) setProfilePassport(parsed.passportNumber)
        if (parsed.passportExpiry) setProfilePassportExpiry(parsed.passportExpiry)
        if (parsed.currency) setProfileCurrency(parsed.currency)
        if (parsed.emergencyName) setProfileEmergencyName(parsed.emergencyName)
        if (parsed.emergencyPhone) setProfileEmergencyPhone(parsed.emergencyPhone)
        if (parsed.travelStyle) setProfileTravelStyle(parsed.travelStyle)
        if (parsed.dietPreference) setProfileDietPreference(parsed.dietPreference)
        if (parsed.bucketList) setProfileBucketList(parsed.bucketList)
      }
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    if (user) {
      setProfileName(user.name || '')
      setProfilePhone(user.phone || '')
      setProfileEmail(user.email || '')
      if (user.dob) setProfileDob(user.dob)
      if (user.gender) setProfileGender(user.gender)
      if (user.city) setProfileCity(user.city)
      if (user.state) setProfileState(user.state)
      if (user.country) setProfileCountry(user.country)
      if (user.address) setProfileAddress(user.address)
      if (user.pincode) setProfilePincode(user.pincode)
      if (user.passportNumber) setProfilePassport(user.passportNumber)
      if (user.passportExpiry) setProfilePassportExpiry(user.passportExpiry)
      if (user.currency) setProfileCurrency(user.currency)
      if (user.emergencyName) setProfileEmergencyName(user.emergencyName)
      if (user.emergencyPhone) setProfileEmergencyPhone(user.emergencyPhone)
      if (user.travelStyle) setProfileTravelStyle(user.travelStyle)
      if (user.dietPreference) setProfileDietPreference(user.dietPreference)
      if (user.bucketList) setProfileBucketList(user.bucketList)
    }
  }, [user])

  const loadUserData = async () => {
    setLoading(true)
    try {
      // 1. Fetch user bookings
      const bookingsData = await bookingService.getUserBookings()
      if (Array.isArray(bookingsData)) {
        setUserBookings(bookingsData)
      } else if (bookingsData?.data && Array.isArray(bookingsData.data)) {
        setUserBookings(bookingsData.data)
      } else {
        setUserBookings([])
      }

      // 2. Fetch custom trips
      try {
        const { data } = await api.get('/custom-trips')
        if (data?.success && Array.isArray(data.data)) {
          setCustomTrips(data.data)
        }
      } catch {
        // ignore
      }
    } catch (e) {
      console.warn('Dashboard data fetch error:', e)
      setUserBookings([])
    } finally {
      setLoading(false)
    }
  }

  // Automatically fetch bookings on mount and whenever user or tab changes
  useEffect(() => {
    loadUserData()
  }, [user, activeTab])

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    try {
      const updatedData = {
        name: profileName,
        phone: profilePhone,
        dob: profileDob,
        gender: profileGender,
        city: profileCity,
        state: profileState,
        country: profileCountry,
        address: profileAddress,
        pincode: profilePincode,
        passportNumber: profilePassport,
        passportExpiry: profilePassportExpiry,
        currency: profileCurrency,
        emergencyName: profileEmergencyName,
        emergencyPhone: profileEmergencyPhone,
        travelStyle: profileTravelStyle,
        dietPreference: profileDietPreference,
        bucketList: profileBucketList
      }

      if (updateProfile) {
        await updateProfile(updatedData)
      }
      localStorage.setItem('user_travel_profile', JSON.stringify(updatedData))
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3500)
    } catch (err) {
      console.error('Update profile error:', err)
    }
  }

  const cleanPhone = (settings.whatsappNumber || settings.inquiryPhone || '918953208952').replace(/[^0-9]/g, '')
  const conciergeWhatsApp = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello Concierge! I am Voyager Member ${user?.name || 'Explorer'}. I need assistance with my journey.`)}`

  // User Stats & Points (100% Dynamic from Real User Data)
  const currentPoints = user?.rewardPoints || (userBookings.length * 250)
  const totalTripsCount = userBookings.length
  const totalWishlistCount = wishlist?.length || 0
  const memberRole = user?.role === 'admin' ? 'Super Admin' : (user?.membership || 'Explorer Member')

  // Generate 100% Dynamic Real Notifications from User Data
  const rawNotifications = []

  // 1. Real Bookings Notifications
  userBookings.forEach((b) => {
    const isConfirmed = b.status === 'Confirmed' || b.status === 'Completed'
    const refCode = (b._id || b.id || '').toString().slice(-6).toUpperCase()
    rawNotifications.push({
      id: `booking-${b._id || b.id}`,
      title: `Expedition ${b.status || 'Booked'}: ${b.tourTitle || 'Luxury Expedition'}`,
      message: `Booking #${refCode} for ${b.travelers || (b.leadTraveler ? b.leadTraveler.firstName + ' ' + (b.leadTraveler.lastName || '') : 'VIP Traveler')} is currently ${b.status || 'Active'}. Total: ₹${Number(b.totalPrice || b.amount || 0).toLocaleString('en-IN')}`,
      category: 'bookings',
      linkTab: 'bookings',
      actionText: 'View Booking',
      time: b.createdAt || new Date(),
      icon: Briefcase,
      color: isConfirmed ? 'text-[#6FCF45]' : 'text-amber-400',
      badge: b.status || 'Confirmed'
    })
  })

  // 2. Real Custom Trips Notifications
  customTrips.forEach((ct) => {
    const destName = Array.isArray(ct.toDestinations) ? ct.toDestinations.join(', ') : (ct.destination || 'Bespoke Tour')
    rawNotifications.push({
      id: `custom-${ct._id || ct.id}`,
      title: `Custom Trip Lead: ${destName}`,
      message: `Inquiry Ref #${ct.inquiryReference || 'CT-REF'} is "${ct.status || 'In Review'}". Our Senior Concierge Desk is curating your personalized itinerary.`,
      category: 'bookings',
      linkTab: 'customQuotes',
      actionText: 'View Custom Quote',
      time: ct.createdAt || new Date(),
      icon: Compass,
      color: 'text-purple-400',
      badge: ct.status || 'In Review'
    })
  })

  // 3. Real Wishlist Reminder Notification
  if (wishlist && wishlist.length > 0) {
    rawNotifications.push({
      id: `wishlist-alert-${wishlist.length}`,
      title: `${wishlist.length} Saved Dream Destination${wishlist.length > 1 ? 's' : ''} in Wishlist`,
      message: `You currently have ${wishlist.length} luxury tour${wishlist.length > 1 ? 's' : ''} saved in your Wishlist. Explore availability and reserve your departure date.`,
      category: 'system',
      linkTab: 'wishlist',
      actionText: 'View Wishlist',
      time: new Date(Date.now() - 3600000),
      icon: Heart,
      color: 'text-rose-400',
      badge: `${wishlist.length} Saved`
    })
  }

  // 4. Real Profile Verification/Completion Alert
  if (!user?.phone || !user?.address) {
    rawNotifications.push({
      id: `profile-complete-notice`,
      title: 'Complete Your VIP Travel Profile',
      message: 'Add your direct phone and residence address to receive expedited concierge assistance and priority booking confirmations.',
      category: 'system',
      linkTab: 'profile',
      actionText: 'Update Profile',
      time: new Date(Date.now() - 7200000),
      icon: User,
      color: 'text-blue-400',
      badge: 'Account'
    })
  }

  // 5. System Welcome Notification
  rawNotifications.push({
    id: `welcome-${user?._id || 'user'}`,
    title: `Welcome to Voyager Club, ${user?.name || 'Explorer'}!`,
    message: `Your VIP travel account is active. Explore our signature luxury sanctuaries and bespoke private itineraries.`,
    category: 'system',
    linkTab: 'dashboard',
    actionText: 'Explore Dashboard',
    time: user?.createdAt || new Date(),
    icon: Sparkles,
    color: 'text-[#6FCF45]',
    badge: 'Club Member'
  })

  // 6. Promo Notification if announcement is present
  if (settings?.announcementText && settings?.showAnnouncement) {
    rawNotifications.push({
      id: `promo-announcement`,
      title: `Exclusive VIP Announcement`,
      message: settings.announcementText,
      category: 'system',
      linkTab: 'dashboard',
      actionText: 'Explore Offers',
      time: new Date(),
      icon: Crown,
      color: 'text-amber-300',
      badge: 'Special Offer'
    })
  }

  // Filter out cleared notifications & sort by newest
  const allNotifications = rawNotifications
    .filter((n) => !clearedNotificationIds.includes(n.id))
    .sort((a, b) => new Date(b.time) - new Date(a.time))

  const unreadNotificationsCount = allNotifications.filter((n) => !readNotificationIds.includes(n.id)).length

  const filteredNotifications = allNotifications.filter((n) => {
    if (notificationFilter === 'bookings') return n.category === 'bookings'
    if (notificationFilter === 'system') return n.category === 'system'
    return true
  })

  const markNotificationAsRead = (id) => {
    if (!readNotificationIds.includes(id)) {
      const updated = [...readNotificationIds, id]
      setReadNotificationIds(updated)
      try {
        localStorage.setItem(`user_read_notifications_${user?._id || 'guest'}`, JSON.stringify(updated))
      } catch {}
    }
  }

  const markAllNotificationsAsRead = () => {
    const allIds = allNotifications.map((n) => n.id)
    setReadNotificationIds(allIds)
    try {
      localStorage.setItem(`user_read_notifications_${user?._id || 'guest'}`, JSON.stringify(allIds))
    } catch {}
  }

  const clearNotification = (id) => {
    const updated = [...clearedNotificationIds, id]
    setClearedNotificationIds(updated)
    try {
      localStorage.setItem(`user_cleared_notifications_${user?._id || 'guest'}`, JSON.stringify(updated))
    } catch {}
  }

  const clearAllNotifications = () => {
    const allIds = allNotifications.map((n) => n.id)
    setClearedNotificationIds(allIds)
    try {
      localStorage.setItem(`user_cleared_notifications_${user?._id || 'guest'}`, JSON.stringify(allIds))
    } catch {}
  }

  // Recommended Destination Cards
  const recommendedDestinations = [
    {
      id: 'bali',
      title: 'Bali, Indonesia',
      category: 'International',
      image: baliImg,
      link: '/destinations/bali',
      price: '₹75,000'
    },
    {
      id: 'switzerland',
      title: 'Switzerland',
      category: 'International',
      image: swissImg,
      link: '/destinations/switzerland',
      price: '₹1,85,000'
    },
    {
      id: 'manali',
      title: 'Manali',
      category: 'Himachal Pradesh',
      image: kashmirImg,
      link: '/destinations/kashmir',
      price: '₹35,000'
    },
    {
      id: 'dubai',
      title: 'Dubai',
      category: 'International',
      image: dubaiImg,
      link: '/destinations/dubai',
      price: '₹65,000'
    }
  ]

  // Active Journey Data (either first user booking or the showcased signature journey)
  const activeJourney = userBookings.length > 0 ? {
    id: userBookings[0].id || userBookings[0]._id || 'TT-849201',
    title: userBookings[0].tourTitle || 'Maldives Ocean Sanctuary',
    status: userBookings[0].status || 'Confirmed',
    dates: userBookings[0].dates || `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} - 7 Days`,
    travelers: `${userBookings[0].travelers || userBookings[0].adults || 2} Travelers`,
    location: userBookings[0].destination || 'Maldives',
    image: userBookings[0].image || swissImg,
    price: userBookings[0].totalPrice ? `₹${Number(userBookings[0].totalPrice).toLocaleString('en-IN')}` : '₹1,25,000'
  } : {
    id: 'TT-KEDAR-2025',
    title: 'Kedarnath Trek',
    status: 'Confirmed',
    dates: '12 Jun 2025 - 18 Jun 2025',
    travelers: '2 Travelers',
    location: 'Uttarakhand, India',
    image: kashmirImg,
    price: '₹38,000'
  }

  // Sidebar Menu Items with Dynamic Badges
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bookings', label: 'My Bookings', icon: CalendarDays, badge: userBookings.length || null },
    { id: 'wishlist', label: 'Saved Wishlist', icon: Heart, badge: wishlist?.length || null },
    { id: 'history', label: 'Travel History', icon: History },
    { id: 'customQuotes', label: 'Custom Quotes', icon: FileText, badge: customTrips.length || null },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : null, dot: unreadNotificationsCount > 0 },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'support', label: 'Support', icon: HelpCircle },
  ]

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/tours?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className="h-screen w-full overflow-hidden bg-[#061511] text-white flex flex-row font-sans selection:bg-[#6FCF45] selection:text-[#071A16]">
      
      {/* ========================================================================= */}
      {/* 1. LEFT SIDEBAR (Static & Fixed)                                          */}
      {/* ========================================================================= */}
      
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 h-full bg-[#081C16] border-r border-white/5 flex flex-col justify-between shrink-0 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full no-scrollbar overflow-hidden">
          
          {/* Brand Logo Header (Aligned with Top Navbar height) */}
          <div className="h-20 sm:h-22 flex items-center justify-between px-6 border-b border-white/5 shrink-0">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src={logoImg}
                alt="Logo"
                className="w-9 h-9 object-contain drop-shadow-md group-hover:scale-105 transition-transform"
              />
              <span className="font-extrabold text-sm tracking-[0.18em] text-white uppercase font-heading leading-tight">
                TOURS <span className="text-[#6FCF45]">&amp;</span><br />TRAVELS
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/60 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Links (No Scrollbar, Same Text & Button Size) */}
          <nav className="space-y-1 flex-1 px-4 py-2.5 overflow-y-auto no-scrollbar">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#13382C] text-[#6FCF45] shadow-sm font-bold'
                      : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#6FCF45]' : 'text-[#94A3B8]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#6FCF45]/20 text-[#6FCF45]">
                      {item.badge}
                    </span>
                  )}
                  {item.dot && (
                    <span className="w-2 h-2 rounded-full bg-[#6FCF45] animate-pulse" />
                  )}
                </button>
              )
            })}

            {/* Admin Switcher for Admins */}
            {user?.role === 'admin' && (
              <div className="pt-1.5">
                <Link
                  to="/admin"
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/20 transition-all"
                >
                  <Shield className="w-4 h-4 text-amber-300" />
                  <span>Admin Panel</span>
                </Link>
              </div>
            )}
          </nav>

          {/* Bottom Help Widget (Seamlessly integrated into Sidebar) */}
          <div className="mt-auto px-4 pb-4 pt-1 shrink-0">
            <div className="bg-[#0C201A] border border-white/5 rounded-2xl p-4 sm:p-5 text-left relative overflow-hidden shadow-lg">
              {/* Mountain Shape Vector */}
              <img
                src={mountainShapeImg}
                alt="Mountain"
                className="w-14 h-8 sm:w-16 sm:h-9 object-contain object-left mb-3.5 drop-shadow-sm"
              />

              <h4 className="text-sm font-bold text-white mb-1 tracking-tight font-heading">
                Need Help?
              </h4>
              <p className="text-xs text-[#94A3B8] leading-relaxed mb-4">
                Our travel experts are just a message away.
              </p>

              <a
                href={conciergeWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#6FCF45] hover:bg-[#5eb937] text-[#071A16] py-2.5 px-3 rounded-xl font-bold text-xs sm:text-[13px] flex items-center justify-center gap-2 text-center transition-all active:scale-95 shadow-md tracking-tight cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M12.031 0C5.395 0 .013 5.384.013 12.019c0 2.119.553 4.186 1.606 6.009L0 24l6.167-1.618a11.96 11.96 0 0 0 5.864 1.528h.005c6.634 0 12.016-5.383 12.016-12.018C24.052 5.384 18.666 0 12.031 0zm0 22.003h-.004a9.97 9.97 0 0 1-5.086-1.39l-.365-.216-3.778.991 1.008-3.684-.237-.377a9.93 9.93 0 0 1-1.527-5.308c0-5.503 4.478-9.981 9.993-9.981 2.666 0 5.172 1.039 7.058 2.925a9.92 9.92 0 0 1 2.925 7.058c0 5.504-4.479 9.982-9.989 9.982zm5.474-7.481c-.3-.15-1.774-.876-2.049-.976-.275-.1-.475-.15-.675.15-.2.3-.775.976-.95 1.176-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.413-1.488-.892-.796-1.494-1.78-1.669-2.08-.175-.3-.019-.462.131-.611.135-.134.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525s-.675-1.626-.925-2.226c-.244-.585-.492-.505-.675-.515-.175-.01-.375-.01-.575-.01s-.525.075-.8.375c-.275.3-1.05 1.026-1.05 2.502s1.075 2.902 1.225 3.102c.15.2 2.116 3.23 5.127 4.53 3.011 1.3 3.011.867 3.561.817.55-.05 1.774-.725 2.024-1.426.25-.7.25-1.301.175-1.426-.075-.125-.275-.2-.575-.35z" />
                </svg>
                <span className="text-center whitespace-nowrap">WhatsApp Concierge</span>
              </a>
            </div>
          </div>

        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT AREA (Scrolls independently)                              */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto bg-[#061511]">
        
        {/* TOP BAR (Broader / Taller) */}
        <header className="h-20 sm:h-22 px-6 sm:px-10 border-b border-white/5 bg-[#081C16]/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between gap-6 shrink-0">
          
          {/* Left: Mobile Toggle & Search Bar */}
          <div className="flex items-center gap-4 flex-1 max-w-xl sm:max-w-2xl">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/5 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#94A3B8] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search destinations, packages..."
                className="w-full bg-[#0B241E] border border-white/10 rounded-2xl pl-11 sm:pl-12 pr-4 sm:pr-5 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder:text-[#94A3B8]/70 focus:outline-none focus:border-[#6FCF45]/50 transition-colors shadow-inner"
              />
            </form>
          </div>

          {/* Right: Notifications & Profile Dropdown */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Notification Bell with Dynamic Unread Badge */}
            <button
              onClick={() => setActiveTab('notifications')}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#0B241E] border border-white/10 flex items-center justify-center text-white/80 hover:text-white relative hover:bg-white/5 transition-all cursor-pointer shadow-sm"
              title="Notifications"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#6FCF45] text-[#071A16] font-black text-[10px] flex items-center justify-center absolute -top-1 -right-1 shadow-[0_0_10px_#6FCF45] border-2 border-[#0B241E] animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* User Profile Pill & Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-3 pl-2 pr-3.5 py-1.5 sm:py-2 rounded-2xl bg-[#0B241E] border border-white/10 hover:border-white/20 transition-all cursor-pointer shadow-sm"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#13382C] border border-[#6FCF45]/40 flex items-center justify-center text-[#6FCF45] shrink-0">
                  <User className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs sm:text-sm font-bold text-white max-w-[130px] truncate leading-tight">
                    {user?.name || 'Explorer'}
                  </span>
                  <span className="text-[10px] text-[#94A3B8] leading-none mt-0.5">
                    {memberRole}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-[#0B241E] border border-white/10 rounded-2xl p-2 shadow-2xl z-50 animate-fadeIn text-left">
                  <button
                    onClick={() => {
                      setActiveTab('profile')
                      setUserDropdownOpen(false)
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                  >
                    <User className="w-4 h-4 text-[#6FCF45]" />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('bookings')
                      setUserDropdownOpen(false)
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                  >
                    <CalendarDays className="w-4 h-4 text-[#6FCF45]" />
                    <span>My Bookings</span>
                  </button>
                  <Link
                    to="/"
                    onClick={() => setUserDropdownOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                  >
                    <Globe className="w-4 h-4 text-[#6FCF45]" />
                    <span>Website Home</span>
                  </Link>
                  <div className="my-1 border-t border-white/5" />
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false)
                      logout()
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* ========================================================================= */}
        {/* 3. BODY VIEW CONTENT (Render based on activeTab)                          */}
        {/* ========================================================================= */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto w-full text-left">
          
          {/* ==================== TAB 1: DASHBOARD OVERVIEW (3D SHAPED LUXURY CARDS) ==================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* 1. TOP 3D HERO TRAVEL BANNER */}
              <div className="relative rounded-2xl overflow-hidden min-h-[220px] sm:min-h-[260px] flex items-center p-6 sm:p-10 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-2px_6px_rgba(0,0,0,0.6)] border border-white/10 bg-gradient-to-br from-[#1F242D] via-[#161922] to-[#0E1117]">
                {/* 3D Top Specular Light Reflection Bar */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#6FCF45]/60 to-transparent z-20" />
                
                {/* 3D Angled Corner Geometric Notch */}
                <div className="absolute top-0 right-0 w-14 h-14 overflow-hidden pointer-events-none z-20">
                  <div className="absolute transform rotate-45 bg-gradient-to-br from-[#6FCF45]/25 to-transparent w-10 h-10 -top-5 -right-5 border-b border-white/10" />
                </div>

                {/* Background Panoramic Image with Dark Overlay */}
                <img
                  src={bannerBg}
                  alt="Explore the World"
                  className="absolute inset-0 w-full h-full object-cover object-center scale-105 opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0E1117]/95 via-[#0E1117]/85 to-transparent z-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E1117]/80 via-transparent to-transparent z-0" />

                <div className="relative z-10 max-w-xl">
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#6FCF45] font-heading block mb-2 drop-shadow-[0_0_8px_rgba(111,207,69,0.4)]">
                    EXPLORE THE WORLD
                  </span>
                  <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-heading leading-tight mb-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
                    New Journeys<br />Await You
                  </h1>
                  <p className="text-xs sm:text-sm text-[#CBD5E1] mb-5 leading-relaxed max-w-md">
                    Discover breathtaking destinations and create memories for a lifetime.
                  </p>
                  <Link
                    to="/custom-trip"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#6FCF45] to-[#8AE863] text-[#071A16] px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-[0_4px_14px_rgba(111,207,69,0.35)] active:scale-95 cursor-pointer"
                  >
                    <span>Plan Your Next Trip</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </Link>
                </div>

                {/* Cursive Quote on Right */}
                <div className="hidden lg:block absolute right-12 bottom-8 z-10 text-right">
                  <p
                    className="text-white/85 text-2xl sm:text-3xl font-light italic leading-tight drop-shadow-md"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    “Collect Moments<br />Not Things”
                  </p>
                </div>
              </div>

              {/* 2. MAIN 2-COLUMN 3D GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* ----------------- LEFT 8 COLS ----------------- */}
                <div className="lg:col-span-8 flex flex-col justify-between gap-6">
                  
                  {/* CARD A: 3D My Upcoming Journeys */}
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1F242D] via-[#161922] to-[#0E1117] border border-white/10 p-5 sm:p-6 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-2px_6px_rgba(0,0,0,0.6)]">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#6FCF45]/60 to-transparent" />
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-[#6FCF45]/15 border border-[#6FCF45]/30 text-[#6FCF45]">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <h2 className="text-sm font-bold text-white tracking-tight font-heading">
                          My Upcoming Journeys
                        </h2>
                      </div>
                      <button
                        onClick={() => setActiveTab('bookings')}
                        className="text-xs text-[#6FCF45] hover:underline flex items-center gap-1 font-bold cursor-pointer"
                      >
                        <span>View All</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Journey Item inside 3D Pod */}
                    <div className="bg-[#0E1117]/80 border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-inner">
                      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                        <img
                          src={activeJourney.image}
                          alt={activeJourney.title}
                          className="w-full sm:w-28 h-24 sm:h-20 object-cover rounded-xl border border-white/15 shrink-0 shadow-md"
                        />
                        <div className="text-center sm:text-left">
                          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                            <h3 className="text-sm sm:text-base font-bold text-white">
                              {activeJourney.title}
                            </h3>
                            <span className="px-2 py-0.5 rounded-md bg-[#6FCF45]/15 text-[#6FCF45] text-[10px] font-bold border border-[#6FCF45]/30 uppercase">
                              {activeJourney.status}
                            </span>
                          </div>
                          <div className="space-y-0.5 text-xs text-[#A8B5AF]">
                            <div className="flex items-center justify-center sm:justify-start gap-1.5">
                              <Calendar className="w-3 h-3 text-[#6FCF45]/70" />
                              <span>{activeJourney.dates}</span>
                            </div>
                            <div className="flex items-center justify-center sm:justify-start gap-1.5">
                              <Users className="w-3 h-3 text-[#6FCF45]/70" />
                              <span>{activeJourney.travelers}</span>
                            </div>
                            <div className="flex items-center justify-center sm:justify-start gap-1.5">
                              <MapPin className="w-3 h-3 text-[#6FCF45]/70" />
                              <span>{activeJourney.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto shrink-0">
                        <button
                          onClick={() => setSelectedBookingModal(activeJourney)}
                          className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold tracking-wide transition-all text-center cursor-pointer shadow-sm"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => setSelectedBookingModal(activeJourney)}
                          className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-[#6FCF45] to-[#8AE863] text-[#071A16] text-xs font-bold tracking-wide transition-all text-center cursor-pointer shadow-[0_4px_12px_rgba(111,207,69,0.3)]"
                        >
                          Download Itinerary
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* CARD B: 3D Recommended for You */}
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1F242D] via-[#161922] to-[#0E1117] border border-white/10 p-5 sm:p-6 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-2px_6px_rgba(0,0,0,0.6)]">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-amber-400/15 border border-amber-400/30 text-amber-400">
                          <Star className="w-4 h-4 fill-current" />
                        </div>
                        <h2 className="text-sm font-bold text-white tracking-tight font-heading">
                          Recommended for You
                        </h2>
                      </div>
                      <Link
                        to="/tours"
                        className="text-xs text-[#6FCF45] hover:underline flex items-center gap-1 font-bold"
                      >
                        <span>View All</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>

                    {/* 4 Cards 3D Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                      {recommendedDestinations.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => navigate(item.link)}
                          className="group bg-[#0E1117]/80 border border-white/10 rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.5)] hover:border-[#6FCF45]/50 transition-all cursor-pointer flex flex-col"
                        >
                          <div className="relative h-32 sm:h-36 w-full overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0E1117] via-transparent to-transparent opacity-80" />
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleWishlist({ id: item.id, title: item.title, image: item.image, price: item.price })
                              }}
                              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-rose-400 transition-colors cursor-pointer border border-white/10 shadow-md"
                            >
                              <Heart className={`w-3.5 h-3.5 ${isInWishlist(item.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                            </button>
                          </div>
                          <div className="p-3 text-left flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className="text-xs font-bold text-white group-hover:text-[#6FCF45] transition-colors line-clamp-1">
                                {item.title}
                              </h3>
                              <div className="flex items-center gap-1 text-[10px] text-[#A8B5AF] mt-1">
                                <MapPin className="w-3 h-3 text-[#6FCF45]" />
                                <span>{item.category}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CARD C: 3D Exclusive Travel Deals Banner */}
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1F242D] via-[#161922] to-[#0E1117] border border-white/10 p-5 sm:p-6 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-2px_6px_rgba(0,0,0,0.6)] flex flex-col sm:flex-row items-center justify-between gap-4 flex-1 min-h-[105px]">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#6FCF45]/60 to-transparent" />
                    <img
                      src={destinationBg1}
                      alt="Travel Deals"
                      className="absolute inset-0 w-full h-full object-cover object-center opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0E1117] via-[#0E1117]/90 to-transparent" />
                    
                    <div className="relative z-10">
                      <h2 className="text-base sm:text-lg font-bold text-white mb-1 font-heading">
                        Exclusive Travel Deals Just for You!
                      </h2>
                      <p className="text-xs text-[#A8B5AF]">
                        Get personalized VIP offers, early access and special luxury discounts.
                      </p>
                    </div>

                    <Link
                      to="/tours"
                      className="relative z-10 bg-gradient-to-r from-[#6FCF45] to-[#8AE863] text-[#071A16] px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 active:scale-95 shadow-[0_4px_12px_rgba(111,207,69,0.3)] flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>View Offers</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                </div>

                {/* ----------------- RIGHT 4 COLS ----------------- */}
                <div className="lg:col-span-4 flex flex-col justify-between gap-6">
                  
                  {/* CARD 1: 3D User Profile Summary Card */}
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1F242D] via-[#161922] to-[#0E1117] border border-white/10 p-5 sm:p-6 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-2px_6px_rgba(0,0,0,0.6)] text-left">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
                    
                    {/* Header: Avatar, Member Badge, Name, Email */}
                    <div className="flex items-center gap-3.5 pb-4 border-b border-white/5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1E3A2B] to-[#0A1611] border border-[#6FCF45]/40 flex items-center justify-center text-[#6FCF45] shrink-0 shadow-[0_6px_14px_rgba(0,0,0,0.5)]">
                        <User className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[10px] font-bold uppercase tracking-wider mb-1 shadow-sm">
                          <Crown className="w-2.5 h-2.5" />
                          <span>VOYAGER MEMBER</span>
                        </div>
                        <h3 className="text-sm font-bold text-white truncate">
                          {user?.name || 'Explorer'}
                        </h3>
                        <p className="text-[11px] text-[#A8B5AF] truncate">
                          {user?.email || ''}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#A8B5AF] shrink-0" />
                    </div>

                    {/* 3 Metric 3D Pods */}
                    <div className="grid grid-cols-3 gap-2.5 my-4">
                      <div className="bg-gradient-to-br from-[#13171F] to-[#0A0D12] border border-white/10 rounded-xl p-2.5 text-center shadow-inner">
                        <div className="w-6 h-6 rounded-lg bg-[#6FCF45]/15 border border-[#6FCF45]/30 text-[#6FCF45] flex items-center justify-center mx-auto mb-1">
                          <Award className="w-3.5 h-3.5" />
                        </div>
                        <div className="text-xs font-bold text-white font-mono">{currentPoints}</div>
                        <span className="text-[9px] text-[#A8B5AF] block leading-tight font-medium">Points</span>
                      </div>

                      <div className="bg-gradient-to-br from-[#13171F] to-[#0A0D12] border border-white/10 rounded-xl p-2.5 text-center shadow-inner">
                        <div className="w-6 h-6 rounded-lg bg-[#6FCF45]/15 border border-[#6FCF45]/30 text-[#6FCF45] flex items-center justify-center mx-auto mb-1">
                          <Briefcase className="w-3.5 h-3.5" />
                        </div>
                        <div className="text-xs font-bold text-white font-mono">{totalTripsCount}</div>
                        <span className="text-[9px] text-[#A8B5AF] block leading-tight font-medium">Trips</span>
                      </div>

                      <div className="bg-gradient-to-br from-[#13171F] to-[#0A0D12] border border-white/10 rounded-xl p-2.5 text-center shadow-inner">
                        <div className="w-6 h-6 rounded-lg bg-[#6FCF45]/15 border border-[#6FCF45]/30 text-[#6FCF45] flex items-center justify-center mx-auto mb-1">
                          <Heart className="w-3.5 h-3.5" />
                        </div>
                        <div className="text-xs font-bold text-white font-mono">{totalWishlistCount}</div>
                        <span className="text-[9px] text-[#A8B5AF] block leading-tight font-medium">Wishlist</span>
                      </div>
                    </div>

                    {/* Next Level 3D Progress */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-[11px] mb-1.5">
                        <span className="font-bold text-white">Next Level: Explorer Elite</span>
                        <span className="text-[#6FCF45] font-mono font-bold">{currentPoints} / 1000 PTS</span>
                      </div>
                      <div className="w-full bg-[#080A0D] h-2.5 rounded-full overflow-hidden border border-white/10 p-0.5 shadow-inner">
                        <div
                          className="bg-gradient-to-r from-[#6FCF45] to-[#8AE863] h-full rounded-full transition-all duration-500 shadow-[0_0_8px_#6FCF45]"
                          style={{ width: `${Math.min(100, (currentPoints / 1000) * 100)}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-[#A8B5AF] mt-2">
                        Earn {Math.max(0, 1000 - currentPoints)} more points to unlock VIP rewards!
                      </p>
                    </div>

                  </div>

                  {/* CARD 2: 3D Tactile Quick Actions (2x2 Grid) */}
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1F242D] via-[#161922] to-[#0E1117] border border-white/10 p-5 sm:p-6 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-2px_6px_rgba(0,0,0,0.6)] text-left">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
                    
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className="p-1.5 rounded-lg bg-amber-400/15 border border-amber-400/30 text-amber-400">
                        <Zap className="w-4 h-4" />
                      </div>
                      <h2 className="text-sm font-bold text-white tracking-tight font-heading">
                        Quick Actions
                      </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        to="/custom-trip"
                        className="flex flex-col items-start p-3 rounded-xl bg-gradient-to-b from-[#222731] via-[#171B22] to-[#0E1117] border-t border-x border-white/15 border-b-[4px] border-b-black/80 hover:border-b-[5px] active:border-b-[1px] active:translate-y-1 transition-all duration-150 group shadow-[0_6px_14px_rgba(0,0,0,0.5)] cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#13171F] border border-white/10 flex items-center justify-center mb-2 shadow-inner">
                          <Compass className="w-4 h-4 text-[#6FCF45]" />
                        </div>
                        <span className="text-xs font-bold text-white group-hover:text-[#6FCF45] transition-colors leading-tight">
                          Plan a New Trip
                        </span>
                      </Link>

                      <button
                        onClick={() => setActiveTab('customQuotes')}
                        className="flex flex-col items-start p-3 rounded-xl bg-gradient-to-b from-[#222731] via-[#171B22] to-[#0E1117] border-t border-x border-white/15 border-b-[4px] border-b-black/80 hover:border-b-[5px] active:border-b-[1px] active:translate-y-1 transition-all duration-150 group shadow-[0_6px_14px_rgba(0,0,0,0.5)] cursor-pointer text-left"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#13171F] border border-white/10 flex items-center justify-center mb-2 shadow-inner">
                          <FileText className="w-4 h-4 text-[#6FCF45]" />
                        </div>
                        <span className="text-xs font-bold text-white group-hover:text-[#6FCF45] transition-colors leading-tight">
                          Custom Quote
                        </span>
                      </button>

                      <Link
                        to="/tours"
                        className="flex flex-col items-start p-3 rounded-xl bg-gradient-to-b from-[#222731] via-[#171B22] to-[#0E1117] border-t border-x border-white/15 border-b-[4px] border-b-black/80 hover:border-b-[5px] active:border-b-[1px] active:translate-y-1 transition-all duration-150 group shadow-[0_6px_14px_rgba(0,0,0,0.5)] cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#13171F] border border-white/10 flex items-center justify-center mb-2 shadow-inner">
                          <Gift className="w-4 h-4 text-[#6FCF45]" />
                        </div>
                        <span className="text-xs font-bold text-white group-hover:text-[#6FCF45] transition-colors leading-tight">
                          Browse Packages
                        </span>
                      </Link>

                      <Link
                        to="/destinations"
                        className="flex flex-col items-start p-3 rounded-xl bg-gradient-to-b from-[#222731] via-[#171B22] to-[#0E1117] border-t border-x border-white/15 border-b-[4px] border-b-black/80 hover:border-b-[5px] active:border-b-[1px] active:translate-y-1 transition-all duration-150 group shadow-[0_6px_14px_rgba(0,0,0,0.5)] cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#13171F] border border-white/10 flex items-center justify-center mb-2 shadow-inner">
                          <MapPin className="w-4 h-4 text-[#6FCF45]" />
                        </div>
                        <span className="text-xs font-bold text-white group-hover:text-[#6FCF45] transition-colors leading-tight">
                          Destinations
                        </span>
                      </Link>
                    </div>
                  </div>

                  {/* CARD 3: 3D Inspirational Travel Quote Card */}
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1F242D] via-[#161922] to-[#0E1117] border border-white/10 p-5 sm:p-6 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-2px_6px_rgba(0,0,0,0.6)] text-left flex-1 flex flex-col justify-center min-h-[105px]">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#6FCF45]/60 to-transparent" />
                    
                    <span className="text-3xl text-[#6FCF45] font-serif block leading-none mb-1">
                      “
                    </span>
                    <p className="text-xs text-white/90 italic leading-relaxed mb-3">
                      The world is a book, and those who do not travel read only one page.
                    </p>
                    <span className="text-[11px] text-[#A8B5AF] font-bold block">
                      — Saint Augustine
                    </span>

                    {/* Watermark Logo/Mountain */}
                    <img
                      src={mountainShapeImg}
                      alt=""
                      className="w-36 h-24 sm:w-44 sm:h-28 object-contain opacity-10 absolute -bottom-3 -right-3 pointer-events-none select-none"
                    />
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ==================== TAB 2: MY BOOKINGS ==================== */}
          {activeTab === 'bookings' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white font-heading">My Expeditions &amp; Bookings</h1>
                  <p className="text-xs text-[#94A3B8]">Review confirmed vouchers, itinerary details, and booking status.</p>
                </div>
                <Link
                  to="/tours"
                  className="bg-[#6FCF45] hover:bg-[#5eb937] text-[#071A16] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                >
                  Book New Tour
                </Link>
              </div>

              {userBookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userBookings.map((b, idx) => {
                    const bookingRef =
                      b.bookingReference ||
                      b.id ||
                      (b._id ? `TT-${b._id.toString().slice(-6).toUpperCase()}` : `TT-EXP-${idx + 101}`)
                    const travelDateDisplay =
                      b.travelDate || b.dates || b.logistics?.departureDate || 'Flexible Schedule'

                    return (
                      <div
                        key={b._id || b.id || idx}
                        className="bg-[#081C16] border border-white/5 rounded-2xl p-5 shadow-xl flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-mono text-xs text-[#94A3B8]">{bookingRef}</span>
                            <span className="px-2.5 py-0.5 rounded-full bg-[#6FCF45]/20 text-[#6FCF45] text-[10px] font-bold uppercase border border-[#6FCF45]/30">
                              {b.status || 'Confirmed'}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-white mb-2">{b.tourTitle || 'Luxury Expedition'}</h3>
                          <div className="space-y-1 text-xs text-[#94A3B8] mb-4">
                            <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#6FCF45]" /> <span>{travelDateDisplay}</span></div>
                            <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-[#6FCF45]" /> <span>{b.travelers || 2} Explorers</span></div>
                            <div className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-[#6FCF45]" /> <span>Total: {b.totalPrice ? `₹${Number(b.totalPrice).toLocaleString('en-IN')}` : 'Paid & Secured'}</span></div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                          <button
                            onClick={() => setSelectedBookingModal(b)}
                            className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold text-center transition-all cursor-pointer"
                          >
                            View Itinerary
                          </button>
                          <button
                            onClick={() => setSelectedBookingModal(b)}
                            className="flex-1 py-2 rounded-xl bg-[#6FCF45] hover:bg-[#5eb937] text-[#071A16] text-xs font-bold text-center transition-all cursor-pointer shadow-sm"
                          >
                            Download Voucher
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="bg-[#081C16] border border-white/5 rounded-3xl p-12 text-center">
                  <Briefcase className="w-12 h-12 text-[#94A3B8] mx-auto mb-3 opacity-50" />
                  <h3 className="text-base font-bold text-white mb-1">No Active Bookings Yet</h3>
                  <p className="text-xs text-[#94A3B8] mb-4 max-w-sm mx-auto">
                    Ready for your next grand adventure? Explore our curated signature journeys.
                  </p>
                  <Link
                    to="/tours"
                    className="inline-flex items-center gap-2 bg-[#6FCF45] hover:bg-[#5eb937] text-[#071A16] px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm cursor-pointer"
                  >
                    <span>Browse Packages</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* ==================== TAB 3: SAVED WISHLIST ==================== */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white font-heading">Saved Wishlist</h1>
                  <p className="text-xs text-[#94A3B8]">Your dream destinations &amp; expeditions saved for later.</p>
                </div>
              </div>

              {wishlist && wishlist.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {wishlist.map((item, idx) => {
                    const tourId = typeof item === 'object' ? (item.id || item.slug || item._id) : item
                    const tour = (typeof item === 'object' && item.title)
                      ? item
                      : TOURS.find((t) => t.id === tourId || t.slug === tourId) || {
                          id: tourId,
                          title: tourId ? tourId.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Luxury Expedition',
                          destination: 'Global Sanctuary',
                          duration: '6 Days / 5 Nights',
                          startingPrice: 45000,
                          image: swissImg,
                        }

                    return (
                      <div
                        key={tour.id || tourId || idx}
                        className="bg-[#081C16] border border-white/10 hover:border-white/20 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between group transition-all text-left"
                      >
                        <div className="relative h-48 w-full overflow-hidden">
                          <img
                            src={tour.image || swissImg}
                            alt={tour.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#081C16] via-black/25 to-transparent" />
                          <button
                            onClick={() => toggleWishlist(tourId)}
                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-rose-400 hover:scale-110 transition-transform cursor-pointer shadow-md"
                            title="Remove from wishlist"
                          >
                            <Heart className="w-4 h-4 fill-current" />
                          </button>
                          {tour.duration && (
                            <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-[10.5px] font-bold text-white flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#6FCF45]" />
                              <span>{tour.duration}</span>
                            </div>
                          )}
                        </div>
                        <div className="p-4.5 flex-1 flex flex-col justify-between">
                          <div>
                            {tour.destination && (
                              <span className="text-[10px] uppercase tracking-wider text-[#A8B5AF] font-bold flex items-center gap-1 mb-1">
                                <MapPin className="w-3 h-3 text-[#6FCF45]" />
                                {tour.destination}
                              </span>
                            )}
                            <h3 className="text-sm font-bold text-white mb-2 line-clamp-2 leading-snug font-heading">
                              {tour.title}
                            </h3>
                          </div>
                          <div className="pt-3 border-t border-white/10 mt-2">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <span className="text-[9.5px] uppercase tracking-wider text-[#A8B5AF] block font-semibold">Starting From</span>
                                <span className="text-sm font-extrabold text-[#6FCF45] font-mono">
                                  ₹{Number(tour.startingPrice || tour.price || 45000).toLocaleString('en-IN')}
                                </span>
                              </div>
                              <Link
                                to={`/tours/${tour.id || tour.slug || tourId}`}
                                className="text-xs font-bold text-[#A8B5AF] hover:text-[#6FCF45] transition-colors"
                              >
                                View Details &rarr;
                              </Link>
                            </div>
                            <Link
                              to={`/booking/${tour.id || tour.slug || tourId}`}
                              className="w-full bg-[#6FCF45] hover:bg-[#5eb937] text-[#071A16] py-2.5 rounded-xl text-xs font-bold text-center block uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer"
                            >
                              Book Now
                            </Link>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="bg-[#081C16] border border-white/5 rounded-3xl p-12 text-center">
                  <Heart className="w-12 h-12 text-[#94A3B8] mx-auto mb-3 opacity-50" />
                  <h3 className="text-base font-bold text-white mb-1">Your Wishlist is Empty</h3>
                  <p className="text-xs text-[#94A3B8] mb-4">Click the heart icon on any tour package to save it to your wishlist.</p>
                  <Link
                    to="/tours"
                    className="inline-flex items-center gap-2 bg-[#6FCF45] text-[#071A16] px-5 py-2.5 rounded-xl font-bold text-xs uppercase"
                  >
                    <span>Explore Packages</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* ==================== TAB 4: TRAVEL HISTORY ==================== */}
          {activeTab === 'history' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white font-heading">Travel History</h1>
                  <p className="text-xs text-[#94A3B8]">A timeline of your past journeys and experiences.</p>
                </div>
              </div>

              <div className="bg-[#081C16] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-xl">
                <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-white/10">
                  
                  <div className="relative flex items-start gap-4">
                    <div className="w-7 h-7 rounded-full bg-[#6FCF45] text-[#071A16] flex items-center justify-center font-bold text-xs shrink-0 z-10">
                      ✓
                    </div>
                    <div className="bg-[#0B241E] border border-white/5 rounded-2xl p-4 flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-bold text-white">Swiss Alps Explorer &amp; St. Moritz</h4>
                        <span className="text-[10px] text-[#6FCF45] font-bold uppercase">Completed</span>
                      </div>
                      <p className="text-xs text-[#94A3B8]">October 2024 • 7 Days • 2 Travelers • Zurich &amp; Interlaken</p>
                    </div>
                  </div>

                  <div className="relative flex items-start gap-4">
                    <div className="w-7 h-7 rounded-full bg-[#6FCF45] text-[#071A16] flex items-center justify-center font-bold text-xs shrink-0 z-10">
                      ✓
                    </div>
                    <div className="bg-[#0B241E] border border-white/5 rounded-2xl p-4 flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-bold text-white">Bali Luxury Villa &amp; Nusa Penida Cruise</h4>
                        <span className="text-[10px] text-[#6FCF45] font-bold uppercase">Completed</span>
                      </div>
                      <p className="text-xs text-[#94A3B8]">May 2024 • 6 Days • 2 Travelers • Seminyak &amp; Ubud</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 5: CUSTOM QUOTES ==================== */}
          {activeTab === 'customQuotes' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-white/5">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white font-heading">Custom Trip Quotes &amp; Status</h1>
                  <p className="text-xs text-[#94A3B8]">Track your bespoke luxury inquiries, curated proposals, and live concierge review status.</p>
                </div>
                <Link
                  to="/custom-trip"
                  className="inline-flex items-center justify-center gap-2 bg-[#6FCF45] hover:bg-[#5eb937] text-[#071A16] px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-lg transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Request New Itinerary</span>
                </Link>
              </div>

              {customTrips.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {customTrips.map((quote, idx) => {
                    const rawRef = quote.inquiryReference || (quote._id ? `CT-${quote._id.slice(-6).toUpperCase()}` : `CT-00${idx + 1}`)
                    const rawStatus = (quote.status || 'Pending Concierge Review').trim()
                    
                    // Determine Status Visuals & Step
                    let statusConfig = {
                      label: rawStatus,
                      badgeClass: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
                      dotClass: 'bg-amber-400',
                      icon: Clock,
                      step: 1,
                      statusNote: 'Our Senior Travel Concierge is reviewing your journey preferences and dates.'
                    }

                    const lower = rawStatus.toLowerCase()
                    if (lower.includes('confirm')) {
                      statusConfig = {
                        label: 'Confirmed & Booked',
                        badgeClass: 'bg-emerald-500/15 text-[#6FCF45] border-[#6FCF45]/40',
                        dotClass: 'bg-[#6FCF45]',
                        icon: CheckCircle2,
                        step: 4,
                        statusNote: 'Your bespoke journey has been confirmed and dates are locked with our luxury partners.'
                      }
                    } else if (lower.includes('quot') || lower.includes('sent')) {
                      statusConfig = {
                        label: 'Quotation Ready',
                        badgeClass: 'bg-sky-500/15 text-sky-300 border-sky-500/40',
                        dotClass: 'bg-sky-400',
                        icon: Award,
                        step: 3,
                        statusNote: 'Your tailored quotation and proposal is prepared. Review details and connect to finalize.'
                      }
                    } else if (lower.includes('curat')) {
                      statusConfig = {
                        label: 'Curating Itinerary',
                        badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/40',
                        dotClass: 'bg-purple-400',
                        icon: Sparkles,
                        step: 2,
                        statusNote: 'Destination specialists are designing your bespoke route, private stays, and day-by-day experiences.'
                      }
                    } else if (lower.includes('closed') || lower.includes('cancel')) {
                      statusConfig = {
                        label: rawStatus,
                        badgeClass: 'bg-red-500/15 text-red-300 border-red-500/40',
                        dotClass: 'bg-red-400',
                        icon: AlertCircle,
                        step: 0,
                        statusNote: 'This inquiry is currently marked as closed or archived.'
                      }
                    }

                    const StatusIcon = statusConfig.icon
                    const destName = quote.destination || (Array.isArray(quote.toDestinations) && quote.toDestinations.length > 0 ? quote.toDestinations.join(', ') : 'Bespoke Luxury Destination')
                    const fromCity = quote.departure || quote.fromLocation || 'Lucknow, Uttar Pradesh'
                    const travelersCount = quote.travelers || quote.travellers?.adults || 2
                    const tripDuration = quote.duration || (quote.approxDurationDays ? `${quote.approxDurationDays} Days` : '6–8 Days')
                    const tripDates = quote.travelDate || quote.startDate || 'Flexible / Next 30 Days'
                    const tripMode = quote.travelMode || quote.transport || 'Flight & Private Chauffeur'
                    const specialReqs = quote.specialRequests || quote.contactInfo?.notes || quote.notes || ''

                    // WhatsApp link with inquiry reference
                    const tripWhatsApp = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                      `Hello Concierge! I am inquiring about my Custom Trip Reference [${rawRef}] to ${destName} (Current Status: ${statusConfig.label}). Could you share the latest updates?`
                    )}`

                    return (
                      <div
                        key={quote._id || quote.id || idx}
                        className="bg-[#081C16] border border-white/10 hover:border-[#6FCF45]/30 rounded-2xl p-5 sm:p-6 shadow-xl transition-all flex flex-col justify-between"
                      >
                        <div>
                          {/* Card Header: Ref & Status Badge */}
                          <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-white/5">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-white bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 tracking-wider">
                                {rawRef}
                              </span>
                              {quote.createdAt && (
                                <span className="text-[10px] text-[#94A3B8]">
                                  {new Date(quote.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                              )}
                            </div>
                            
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${statusConfig.badgeClass}`}>
                              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${statusConfig.dotClass}`} />
                              <StatusIcon className="w-3 h-3" />
                              <span>{statusConfig.label}</span>
                            </div>
                          </div>

                          {/* Route & Destination */}
                          <div className="mb-4">
                            <h3 className="text-lg font-bold text-white mb-1 font-heading">{destName}</h3>
                            <div className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
                              <MapPin className="w-3.5 h-3.5 text-[#6FCF45] shrink-0" />
                              <span>From: <strong className="text-slate-200">{fromCity}</strong></span>
                              <ArrowRight className="w-3 h-3 text-[#6FCF45]" />
                              <span>To: <strong className="text-[#6FCF45]">{destName}</strong></span>
                            </div>
                          </div>

                          {/* 4-Step Progress Tracker */}
                          {statusConfig.step > 0 && (
                            <div className="mb-4 bg-[#05130F] border border-white/5 rounded-xl p-3">
                              <div className="grid grid-cols-4 gap-1 relative text-center">
                                {[
                                  { num: 1, label: 'In Review' },
                                  { num: 2, label: 'Curating' },
                                  { num: 3, label: 'Quote Ready' },
                                  { num: 4, label: 'Confirmed' }
                                ].map((stepItem) => {
                                  const isDone = statusConfig.step >= stepItem.num
                                  const isCurrent = statusConfig.step === stepItem.num
                                  return (
                                    <div key={stepItem.num} className="flex flex-col items-center">
                                      <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mb-1 transition-all ${
                                          isDone
                                            ? 'bg-[#6FCF45] text-[#071A16] shadow-sm shadow-[#6FCF45]/30'
                                            : 'bg-white/10 text-[#94A3B8]'
                                        } ${isCurrent ? 'ring-2 ring-[#6FCF45] ring-offset-2 ring-offset-[#081C16]' : ''}`}
                                      >
                                        {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : stepItem.num}
                                      </div>
                                      <span className={`text-[9px] uppercase font-bold tracking-tight ${isDone ? 'text-white' : 'text-[#64748B]'}`}>
                                        {stepItem.label}
                                      </span>
                                    </div>
                                  )
                                })}
                              </div>
                              <p className="text-[11px] text-[#94A3B8] mt-2.5 pt-2 border-t border-white/5 italic text-center">
                                {statusConfig.statusNote}
                              </p>
                            </div>
                          )}

                          {/* Trip Parameters Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                            <div className="bg-white/5 border border-white/5 rounded-xl p-2.5">
                              <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider block">Duration</span>
                              <span className="text-xs font-bold text-white flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3 text-[#6FCF45]" />
                                {tripDuration}
                              </span>
                            </div>

                            <div className="bg-white/5 border border-white/5 rounded-xl p-2.5">
                              <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider block">Travelers</span>
                              <span className="text-xs font-bold text-white flex items-center gap-1 mt-0.5">
                                <Users className="w-3 h-3 text-[#6FCF45]" />
                                {travelersCount} Guests
                              </span>
                            </div>

                            <div className="bg-white/5 border border-white/5 rounded-xl p-2.5">
                              <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider block">Schedule</span>
                              <span className="text-xs font-bold text-white flex items-center gap-1 mt-0.5 truncate" title={tripDates}>
                                <Calendar className="w-3 h-3 text-[#6FCF45] shrink-0" />
                                <span className="truncate">{tripDates}</span>
                              </span>
                            </div>

                            <div className="bg-white/5 border border-white/5 rounded-xl p-2.5">
                              <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider block">Transport</span>
                              <span className="text-xs font-bold text-white flex items-center gap-1 mt-0.5 truncate" title={tripMode}>
                                <Globe className="w-3 h-3 text-[#6FCF45] shrink-0" />
                                <span className="truncate">{tripMode}</span>
                              </span>
                            </div>
                          </div>

                          {/* Quote / Price Banner if available */}
                          {quote.quoteAmount > 0 && (
                            <div className="mb-4 bg-gradient-to-r from-[#6FCF45]/15 to-emerald-900/20 border border-[#6FCF45]/30 rounded-xl p-3 flex items-center justify-between">
                              <div>
                                <span className="text-[10px] font-bold text-[#6FCF45] uppercase tracking-wider block">
                                  Official Concierge Quotation
                                </span>
                                <div className="flex items-baseline gap-1 mt-0.5">
                                  <span className="text-lg font-black text-white font-heading">
                                    ₹{Number(quote.quoteAmount).toLocaleString('en-IN')}
                                  </span>
                                  <span className="text-[10px] text-[#94A3B8]">Total Estimated Package</span>
                                </div>
                              </div>
                              <span className="px-2.5 py-1 rounded-lg bg-[#6FCF45] text-[#071A16] text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                                Approved Price
                              </span>
                            </div>
                          )}

                          {/* Curated Itinerary / Admin notes if provided */}
                          {quote.curatedItinerary && (
                            <div className="mb-4 bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 text-xs text-purple-200">
                              <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider block mb-1 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                Concierge Proposal Notes
                              </span>
                              <p className="line-clamp-3 text-slate-300 leading-relaxed whitespace-pre-line">{quote.curatedItinerary}</p>
                            </div>
                          )}

                          {/* Special Requests */}
                          {specialReqs && (
                            <div className="mb-4 text-xs text-[#94A3B8] bg-white/[0.02] border border-white/5 rounded-xl p-2.5">
                              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Your Preferences:</span>
                              <p className="italic text-slate-300 line-clamp-2">"{specialReqs}"</p>
                            </div>
                          )}
                        </div>

                        {/* CTA Footer */}
                        <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-3">
                          <a
                            href={tripWhatsApp}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-[#071A16] border border-[#25D366]/40 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md"
                          >
                            <MessageCircle className="w-4 h-4 fill-current" />
                            <span>Discuss {rawRef} on WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="bg-[#081C16] border border-white/5 rounded-3xl p-12 text-center max-w-lg mx-auto">
                  <div className="w-16 h-16 rounded-2xl bg-[#6FCF45]/10 border border-[#6FCF45]/20 flex items-center justify-center mx-auto mb-4 text-[#6FCF45]">
                    <Compass className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 font-heading">No Custom Quotes Active</h3>
                  <p className="text-xs text-[#94A3B8] mb-6 leading-relaxed">
                    Looking for a tailor-made luxury expedition, private island getaway, or corporate retreat? Submit your bespoke journey request and our Travel Curators will design it for you.
                  </p>
                  <Link
                    to="/custom-trip"
                    className="inline-flex items-center gap-2 bg-[#6FCF45] hover:bg-[#5eb937] text-[#071A16] px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Create Custom Journey</span>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* ==================== TAB 6: PROFILE & SETTINGS ==================== */}
          {activeTab === 'profile' && (
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

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                
                {/* 1. Profile Header Card */}
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

                {/* 2. Section 1: Personal Information */}
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

                {/* 3. Section 2: Residential Address */}
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

                {/* 4. Section 3: Passport & Emergency Information */}
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

                {/* 5. Section 4: Travel Style & Preferences */}
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
                        Our AI &amp; concierge will prioritize special deals matching your bucket list!
                      </span>
                    </div>
                  </div>
                </div>

                {/* 6. Action Button Bar */}
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
          )}

          {/* ==================== TAB 7: NOTIFICATIONS (CLEAN & DYNAMIC) ==================== */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white font-heading">
                    Notifications &amp; Activity
                  </h1>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    Real-time alerts regarding your bookings, custom quotes, and travel updates.
                  </p>
                </div>

                {allNotifications.length > 0 && (
                  <div className="flex items-center gap-2">
                    {unreadNotificationsCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-white transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5 text-[#6FCF45]" />
                        <span>Mark all read</span>
                      </button>
                    )}
                    <button
                      onClick={clearAllNotifications}
                      className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-xs font-medium text-red-400 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear all</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-2 border-b border-white/5 pb-2 overflow-x-auto">
                <button
                  onClick={() => setNotificationFilter('all')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    notificationFilter === 'all'
                      ? 'bg-[#6FCF45] text-[#071A16]'
                      : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
                  }`}
                >
                  All ({allNotifications.length})
                </button>
                <button
                  onClick={() => setNotificationFilter('bookings')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    notificationFilter === 'bookings'
                      ? 'bg-[#6FCF45] text-[#071A16]'
                      : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Expeditions ({allNotifications.filter(n => n.category === 'bookings').length})</span>
                </button>
                <button
                  onClick={() => setNotificationFilter('system')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    notificationFilter === 'system'
                      ? 'bg-[#6FCF45] text-[#071A16]'
                      : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Club &amp; System ({allNotifications.filter(n => n.category === 'system').length})</span>
                </button>
              </div>

              {/* Notifications List */}
              <div className="space-y-3">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((item) => {
                    const isUnread = !readNotificationIds.includes(item.id)
                    const IconComponent = item.icon || Bell
                    return (
                      <div
                        key={item.id}
                        onClick={() => markNotificationAsRead(item.id)}
                        className={`bg-[#081C16] border rounded-2xl p-4 sm:p-5 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer ${
                          isUnread ? 'border-[#6FCF45]/40 bg-[#0A241C]' : 'border-white/5 hover:border-white/10'
                        }`}
                      >
                        <div className="flex items-start gap-3.5 flex-1 min-w-0">
                          {/* Icon */}
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            isUnread ? 'bg-[#6FCF45]/15 text-[#6FCF45]' : 'bg-white/5 text-[#94A3B8]'
                          }`}>
                            <IconComponent className="w-5 h-5" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              {isUnread && (
                                <span className="w-2 h-2 rounded-full bg-[#6FCF45]" />
                              )}
                              <h4 className="text-sm font-bold text-white tracking-tight">
                                {item.title}
                              </h4>
                              {item.badge && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/5 text-[#94A3B8]">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#94A3B8] leading-relaxed">
                              {item.message}
                            </p>
                            <span className="text-[10px] text-[#94A3B8]/60 mt-1.5 block">
                              {new Date(item.time).toLocaleDateString('en-IN', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0" onClick={(e) => e.stopPropagation()}>
                          {item.linkTab && (
                            <button
                              onClick={() => {
                                markNotificationAsRead(item.id)
                                setActiveTab(item.linkTab)
                              }}
                              className="px-3.5 py-1.5 rounded-xl bg-[#6FCF45] hover:bg-[#5eb937] text-[#071A16] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <span>{item.actionText || 'View Details'}</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                          <button
                            onClick={() => clearNotification(item.id)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
                            title="Dismiss Notification"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  /* Clean Empty State */
                  <div className="bg-[#081C16] border border-white/5 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-[#94A3B8] mb-4">
                      <Bell className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-1 font-heading">
                      No Notifications Yet
                    </h3>
                    <p className="text-xs text-[#94A3B8] max-w-sm leading-relaxed mb-5">
                      You are all caught up! Real-time alerts regarding your bookings, custom quotations, and promotional concierge offers will appear here.
                    </p>
                    <Link
                      to="/tours"
                      className="px-5 py-2.5 rounded-xl bg-[#6FCF45] hover:bg-[#5eb937] text-[#071A16] text-xs font-bold uppercase tracking-wider transition-all"
                    >
                      Browse Tours
                    </Link>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ==================== TAB 8: REVIEWS ==================== */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 animate-fadeIn max-w-2xl">
              <div className="pb-4 border-b border-white/5">
                <h1 className="text-xl sm:text-2xl font-bold text-white font-heading">My Reviews &amp; Ratings</h1>
                <p className="text-xs text-[#94A3B8]">Share your thoughts on completed journeys to earn reward points.</p>
              </div>

              <div className="bg-[#081C16] border border-white/5 rounded-3xl p-6">
                <div className="p-4 rounded-2xl bg-[#0B241E] border border-white/5 mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-bold text-white">Swiss Alps Explorer</h4>
                    <div className="flex text-amber-300"><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /></div>
                  </div>
                  <p className="text-[11px] text-[#94A3B8]">“An extraordinary experience from start to finish! The concierge was always available.”</p>
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 9: SUPPORT ==================== */}
          {activeTab === 'support' && (
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
          )}

        </main>

      </div>

      {/* ========================================================================= */}
      {/* ITINERARY / VOUCHER PREVIEW MODAL                                         */}
      {/* ========================================================================= */}
      {selectedBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#081C16] border border-white/10 rounded-3xl max-w-lg w-full p-6 text-left shadow-2xl relative">
            <button
              onClick={() => setSelectedBookingModal(null)}
              className="absolute top-5 right-5 text-white/60 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#6FCF45]/15 text-[#6FCF45] flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Confirmed Travel Voucher</h3>
                <span className="font-mono text-[10px] text-[#94A3B8]">ID: {selectedBookingModal.id || 'TT-849201'}</span>
              </div>
            </div>

            <div className="bg-[#0B241E] border border-white/5 rounded-2xl p-4 space-y-2 text-xs text-[#94A3B8] mb-5">
              <div className="flex justify-between"><span className="text-white font-bold">Tour:</span> <span>{selectedBookingModal.title || selectedBookingModal.tourTitle}</span></div>
              <div className="flex justify-between"><span className="text-white font-bold">Dates:</span> <span>{selectedBookingModal.dates || 'Flexible 2025'}</span></div>
              <div className="flex justify-between"><span className="text-white font-bold">Travelers:</span> <span>{selectedBookingModal.travelers || '2 Explorers'}</span></div>
              <div className="flex justify-between"><span className="text-white font-bold">Status:</span> <span className="text-[#6FCF45] font-bold">Confirmed &amp; Secured</span></div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  window.print()
                }}
                className="flex-1 bg-[#6FCF45] hover:bg-[#5eb937] text-[#071A16] py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-center cursor-pointer shadow-sm"
              >
                Print / Download PDF
              </button>
              <button
                onClick={() => setSelectedBookingModal(null)}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Profile
