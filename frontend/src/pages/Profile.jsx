import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  Briefcase,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useBooking } from '../context/BookingContext'
import { useWishlist } from '../context/WishlistContext'
import { useSettings } from '../context/SettingsContext'
import bookingService from '../services/bookingService'
import api from '../services/api'

import baliImg from '../assets/images/travel_image/bali.jpg'
import swissImg from '../assets/images/travel_image/Switzerland.jpg'
import kashmirImg from '../assets/images/travel_image/kashmir.jpg'
import dubaiImg from '../assets/images/travel_image/dubai.jpg'

import ProfileSidebar from '../features/profile/components/ProfileSidebar'
import ProfileHeader from '../features/profile/components/ProfileHeader'
import ProfileDashboardTab from '../features/profile/components/ProfileDashboardTab'
import ProfileBookingsTab from '../features/profile/components/ProfileBookingsTab'
import ProfileWishlistTab from '../features/profile/components/ProfileWishlistTab'
import ProfileCustomQuotesTab from '../features/profile/components/ProfileCustomQuotesTab'
import ProfileDetailsTab from '../features/profile/components/ProfileDetailsTab'
import ProfileNotificationsTab from '../features/profile/components/ProfileNotificationsTab'
import ProfileSupportTab from '../features/profile/components/ProfileSupportTab'
import BookingDetailModal from '../features/profile/components/BookingDetailModal'

export const Profile = () => {
  const navigate = useNavigate()
  const { user, logout, updateProfile } = useAuth()
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist()
  const { settings } = useSettings()

  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [userBookings, setUserBookings] = useState([])
  const [customTrips, setCustomTrips] = useState([])
  const [loading, setLoading] = useState(true)

  // Profile Edit State
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

  // Selected Booking for Modal
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
  const [notificationFilter, setNotificationFilter] = useState('all')

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
      const bookingsData = await bookingService.getUserBookings()
      if (Array.isArray(bookingsData)) {
        setUserBookings(bookingsData)
      } else if (bookingsData?.data && Array.isArray(bookingsData.data)) {
        setUserBookings(bookingsData.data)
      } else {
        setUserBookings([])
      }

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
        bucketList: profileBucketList,
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

  const currentPoints = user?.rewardPoints || (userBookings.length * 250)
  const totalTripsCount = userBookings.length
  const totalWishlistCount = wishlist?.length || 0
  const memberRole = user?.role === 'admin' ? 'Super Admin' : (user?.membership || 'Explorer Member')

  // Generate Notifications
  const rawNotifications = []

  userBookings.forEach((b) => {
    const isConfirmed = b.status === 'Confirmed' || b.status === 'Completed'
    const refCode = (b._id || b.id || '').toString().slice(-6).toUpperCase()
    rawNotifications.push({
      id: `booking-${b._id || b.id}`,
      title: `Expedition ${b.status || 'Booked'}: ${b.tourTitle || 'Luxury Expedition'}`,
      message: `Booking #${refCode} for ${b.travelers || 'VIP Traveler'} is currently ${b.status || 'Active'}. Total: ₹${Number(b.totalPrice || b.amount || 0).toLocaleString('en-IN')}`,
      category: 'bookings',
      linkTab: 'bookings',
      actionText: 'View Booking',
      time: b.createdAt || new Date(),
      icon: Briefcase,
      color: isConfirmed ? 'text-[#6FCF45]' : 'text-amber-400',
      badge: b.status || 'Confirmed',
    })
  })

  customTrips.forEach((ct) => {
    const destName = Array.isArray(ct.toDestinations) ? ct.toDestinations.join(', ') : (ct.destination || 'Bespoke Tour')
    rawNotifications.push({
      id: `custom-${ct._id || ct.id}`,
      title: `Bespoke Inquiry: ${destName}`,
      message: `Status: ${ct.status || 'Pending Review'}. Concierge reference #${ct.inquiryReference || (ct._id ? ct._id.slice(-6).toUpperCase() : 'CT-REQ')}`,
      category: 'bookings',
      linkTab: 'customQuotes',
      actionText: 'Track Status',
      time: ct.createdAt || new Date(),
      icon: FileText,
      color: 'text-purple-400',
      badge: ct.status || 'In Review',
    })
  })

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

  const recommendedDestinations = [
    { id: 'bali', title: 'Bali, Indonesia', category: 'International', image: baliImg, link: '/destinations/bali', price: '₹75,000' },
    { id: 'switzerland', title: 'Switzerland', category: 'International', image: swissImg, link: '/destinations/switzerland', price: '₹1,85,000' },
    { id: 'manali', title: 'Manali', category: 'Himachal Pradesh', image: kashmirImg, link: '/destinations/kashmir', price: '₹35,000' },
    { id: 'dubai', title: 'Dubai', category: 'International', image: dubaiImg, link: '/destinations/dubai', price: '₹65,000' },
  ]

  const activeJourney = userBookings.length > 0 ? {
    id: userBookings[0].id || userBookings[0]._id || 'TT-849201',
    title: userBookings[0].tourTitle || 'Maldives Ocean Sanctuary',
    status: userBookings[0].status || 'Confirmed',
    dates: userBookings[0].dates || `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} - 7 Days`,
    travelers: `${userBookings[0].travelers || 2} Travelers`,
    location: userBookings[0].destination || 'Maldives',
    image: userBookings[0].image || swissImg,
    price: userBookings[0].totalPrice ? `₹${Number(userBookings[0].totalPrice).toLocaleString('en-IN')}` : '₹1,25,000',
  } : {
    id: 'TT-KEDAR-2025',
    title: 'Kedarnath Trek',
    status: 'Upcoming',
    dates: '15 Nov 2025 - 6 Days',
    travelers: '2 Travelers',
    location: 'Uttarakhand, India',
    image: kashmirImg,
    price: '₹32,000',
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/tours?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'bookings', label: 'My Bookings', icon: CalendarDays, badge: userBookings.length },
    { id: 'wishlist', label: 'Saved Wishlist', icon: Heart, badge: wishlist?.length || 0 },
    { id: 'history', label: 'Travel History', icon: History, badge: null },
    { id: 'customQuotes', label: 'Custom Quotes', icon: FileText, badge: customTrips.length, dot: customTrips.some((c) => c.status === 'Quotation Sent') },
    { id: 'profile', label: 'Profile Settings', icon: User, badge: null },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotificationsCount },
    { id: 'reviews', label: 'My Reviews', icon: Star, badge: null },
    { id: 'support', label: 'Concierge Help', icon: HelpCircle, badge: null },
  ]

  return (
    <div className="h-screen w-full overflow-hidden bg-[#061511] text-white flex flex-row font-sans selection:bg-[#6FCF45] selection:text-[#071A16]">
      {/* 1. Left Sidebar */}
      <ProfileSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        menuItems={menuItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        conciergeWhatsApp={conciergeWhatsApp}
      />

      {/* 2. Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto bg-[#061511]">
        <ProfileHeader
          setSidebarOpen={setSidebarOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearchSubmit={handleSearchSubmit}
          setActiveTab={setActiveTab}
          unreadNotificationsCount={unreadNotificationsCount}
          userDropdownOpen={userDropdownOpen}
          setUserDropdownOpen={setUserDropdownOpen}
          user={user}
          memberRole={memberRole}
          currentPoints={currentPoints}
          logout={logout}
        />

        <main className="flex-1 p-6 sm:p-10 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <ProfileDashboardTab
              user={user}
              currentPoints={currentPoints}
              totalTripsCount={totalTripsCount}
              totalWishlistCount={totalWishlistCount}
              activeJourney={activeJourney}
              recommendedDestinations={recommendedDestinations}
              setActiveTab={setActiveTab}
              setSelectedBookingModal={setSelectedBookingModal}
              toggleWishlist={toggleWishlist}
              isInWishlist={isInWishlist}
            />
          )}

          {(activeTab === 'bookings' || activeTab === 'history') && (
            <ProfileBookingsTab
              userBookings={userBookings}
              setSelectedBookingModal={setSelectedBookingModal}
            />
          )}

          {activeTab === 'wishlist' && (
            <ProfileWishlistTab
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
            />
          )}

          {activeTab === 'customQuotes' && (
            <ProfileCustomQuotesTab
              customTrips={customTrips}
              cleanPhone={cleanPhone}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileDetailsTab
              user={user}
              memberRole={memberRole}
              profileName={profileName}
              setProfileName={setProfileName}
              profileEmail={profileEmail}
              profilePhone={profilePhone}
              setProfilePhone={setProfilePhone}
              profileDob={profileDob}
              setProfileDob={setProfileDob}
              profileGender={profileGender}
              setProfileGender={setProfileGender}
              profileCountry={profileCountry}
              setProfileCountry={setProfileCountry}
              profileAddress={profileAddress}
              setProfileAddress={setProfileAddress}
              profileCity={profileCity}
              setProfileCity={setProfileCity}
              profileState={profileState}
              setProfileState={setProfileState}
              profilePincode={profilePincode}
              setProfilePincode={setProfilePincode}
              profilePassport={profilePassport}
              setProfilePassport={setProfilePassport}
              profilePassportExpiry={profilePassportExpiry}
              setProfilePassportExpiry={setProfilePassportExpiry}
              profileEmergencyName={profileEmergencyName}
              setProfileEmergencyName={setProfileEmergencyName}
              profileEmergencyPhone={profileEmergencyPhone}
              setProfileEmergencyPhone={setProfileEmergencyPhone}
              profileCurrency={profileCurrency}
              setProfileCurrency={setProfileCurrency}
              profileTravelStyle={profileTravelStyle}
              setProfileTravelStyle={setProfileTravelStyle}
              profileDietPreference={profileDietPreference}
              setProfileDietPreference={setProfileDietPreference}
              profileBucketList={profileBucketList}
              setProfileBucketList={setProfileBucketList}
              saveSuccess={saveSuccess}
              onSubmit={handleUpdateProfile}
            />
          )}

          {activeTab === 'notifications' && (
            <ProfileNotificationsTab
              allNotifications={allNotifications}
              unreadNotificationsCount={unreadNotificationsCount}
              markAllNotificationsAsRead={markAllNotificationsAsRead}
              clearAllNotifications={clearAllNotifications}
              notificationFilter={notificationFilter}
              setNotificationFilter={setNotificationFilter}
              filteredNotifications={filteredNotifications}
              readNotificationIds={readNotificationIds}
              markNotificationAsRead={markNotificationAsRead}
              clearNotification={clearNotification}
              setActiveTab={setActiveTab}
            />
          )}

          {(activeTab === 'reviews' || activeTab === 'support') && (
            <ProfileSupportTab
              activeTab={activeTab}
              conciergeWhatsApp={conciergeWhatsApp}
            />
          )}
        </main>
      </div>

      {/* Voucher / Itinerary Preview Modal */}
      <BookingDetailModal
        selectedBookingModal={selectedBookingModal}
        onClose={() => setSelectedBookingModal(null)}
      />
    </div>
  )
}

export default Profile
