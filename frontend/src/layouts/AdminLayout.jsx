import React, { useState, useEffect, useRef } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  MapPin,
  MessageSquare,
  Star,
  Settings,
  LogOut,
  Bell,
  Search,
  ChevronDown,
  Menu,
  Briefcase,
  FolderOpen,
  Image as ImageIcon,
  Shield,
  File,
  X,
  Compass,
  User,
  CheckCheck,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  RefreshCw,
  PanelLeft,
} from 'lucide-react'
import logoImg from '../assets/images/logo.png'

// Relative time helper
function formatTimeAgo(dateStr) {
  if (!dateStr) return 'Recently'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return 'Recently'
  const diffMs = Date.now() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  if (diffSec < 60) return 'Just now'
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHours = Math.floor(diffMin / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
}

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('tt_admin_sidebar_collapsed') === 'true'
    } catch {
      return false
    }
  })
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [messagesOpen, setMessagesOpen] = useState(false)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const profileRef = useRef(null)
  const notificationsRef = useRef(null)
  const messagesRef = useRef(null)
  const searchInputRef = useRef(null)

  // Dynamic state from backend
  const [notifications, setNotifications] = useState([])
  const [messages, setMessages] = useState([])
  const [loadingActivities, setLoadingActivities] = useState(true)

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem('tt_admin_sidebar_collapsed', String(next))
      } catch (e) {}
      return next
    })
  }

  // Persisted Read State in localStorage
  const [readNotifIds, setReadNotifIds] = useState(() => {
    try {
      const saved = localStorage.getItem('tt_admin_read_notifs')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [readMsgIds, setReadMsgIds] = useState(() => {
    try {
      const saved = localStorage.getItem('tt_admin_read_msgs')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Fetch real dynamic activities from backend
  const fetchDynamicActivities = async () => {
    try {
      // 1. Fetch Contact Messages / Enquiries
      const contactRes = await api.get('/contact').catch(() => ({ data: { data: [] } }))
      const rawEnquiries = Array.isArray(contactRes.data?.data) ? contactRes.data.data : []
      
      const dynamicMessages = rawEnquiries.slice(0, 15).map((e) => {
        const id = e._id || e.id
        return {
          id,
          sender: e.name || 'Guest Traveler',
          email: e.email || 'No email provided',
          phone: e.phone || '',
          subject: e.subject || e.message || 'General Expedition Inquiry',
          time: formatTimeAgo(e.createdAt),
          createdAt: e.createdAt,
          read: e.status === 'Resolved' || e.status === 'Read' || readMsgIds.includes(id),
        }
      })
      setMessages(dynamicMessages)

      // 2. Fetch Bookings for Notifications
      const bookingRes = await api.get('/bookings').catch(() => ({ data: { data: [] } }))
      const rawBookings = Array.isArray(bookingRes.data?.data) ? bookingRes.data.data : []

      // 3. Fetch Custom Trips for Notifications
      const customTripRes = await api.get('/custom-trips').catch(() => ({ data: { data: [] } }))
      const rawCustomTrips = Array.isArray(customTripRes.data?.data) ? customTripRes.data.data : []

      // 4. Fetch Reviews for Notifications
      const reviewRes = await api.get('/reviews').catch(() => ({ data: { data: [] } }))
      const rawReviews = Array.isArray(reviewRes.data?.data) ? reviewRes.data.data : []

      // Assemble unified real-time notifications list
      const dynamicNotifs = []

      // Add Real Bookings
      rawBookings.forEach((b) => {
        const id = b._id || b.id || b.bookingReference
        const notifId = `booking-${id}`
        dynamicNotifs.push({
          id: notifId,
          title: `Booking #${b.bookingReference || (id && id.length > 8 ? id.slice(-6).toUpperCase() : 'BK')}`,
          desc: `${b.tourTitle || b.destination || 'Signature Tour'} • ₹${Number(b.totalAmount || b.amount || 0).toLocaleString('en-IN')} (${b.status || 'Confirmed'})`,
          time: formatTimeAgo(b.createdAt),
          createdAt: b.createdAt || new Date().toISOString(),
          type: 'booking',
          link: '/admin/bookings',
          read: readNotifIds.includes(notifId),
        })
      })

      // Add Real Custom Trips
      rawCustomTrips.forEach((c) => {
        const id = c._id || c.id || c.inquiryReference
        const notifId = `custom-${id}`
        dynamicNotifs.push({
          id: notifId,
          title: `Custom Trip: ${c.destination || 'Bespoke Expedition'}`,
          desc: `${c.fullName || c.name || 'Traveler'} • Budget: ${c.budget || 'Custom'} (${c.status || 'New'})`,
          time: formatTimeAgo(c.createdAt),
          createdAt: c.createdAt || new Date().toISOString(),
          type: 'custom',
          link: '/admin/custom-trips',
          read: readNotifIds.includes(notifId),
        })
      })

      // Add Real Reviews
      rawReviews.forEach((r) => {
        const id = r._id || r.id
        const notifId = `review-${id}`
        dynamicNotifs.push({
          id: notifId,
          title: `${r.rating || 5}★ Review: ${r.tourTitle || r.destination || 'Expedition'}`,
          desc: `"${r.comment ? (r.comment.length > 50 ? r.comment.slice(0, 50) + '...' : r.comment) : 'New review received'}" by ${r.userName || r.name || 'Traveler'}`,
          time: formatTimeAgo(r.createdAt),
          createdAt: r.createdAt || new Date().toISOString(),
          type: 'review',
          link: '/admin/reviews',
          read: readNotifIds.includes(notifId),
        })
      })

      // Add Real Enquiries into Notifications stream
      rawEnquiries.forEach((e) => {
        const id = e._id || e.id
        const notifId = `enquiry-${id}`
        dynamicNotifs.push({
          id: notifId,
          title: `New Enquiry from ${e.name || 'Guest'}`,
          desc: e.subject || e.message || 'Customer message received',
          time: formatTimeAgo(e.createdAt),
          createdAt: e.createdAt || new Date().toISOString(),
          type: 'enquiry',
          link: '/admin/enquiries',
          read: readNotifIds.includes(notifId),
        })
      })

      // Sort by newest createdAt timestamp
      dynamicNotifs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setNotifications(dynamicNotifs.slice(0, 30))
    } catch (err) {
      console.error('Error loading dynamic admin notifications & messages:', err)
    } finally {
      setLoadingActivities(false)
    }
  }

  useEffect(() => {
    fetchDynamicActivities()
    // Poll every 30 seconds for live dynamic updates
    const interval = setInterval(fetchDynamicActivities, 30000)
    return () => clearInterval(interval)
  }, [])

  const unreadNotifCount = notifications.filter((n) => !n.read).length
  const unreadMsgCount = messages.filter((m) => !m.read).length

  const markAllNotificationsRead = () => {
    const allIds = notifications.map((n) => n.id)
    setReadNotifIds((prev) => {
      const merged = Array.from(new Set([...prev, ...allIds]))
      localStorage.setItem('tt_admin_read_notifs', JSON.stringify(merged))
      return merged
    })
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const markAllMessagesRead = () => {
    const allIds = messages.map((m) => m.id)
    setReadMsgIds((prev) => {
      const merged = Array.from(new Set([...prev, ...allIds]))
      localStorage.setItem('tt_admin_read_msgs', JSON.stringify(merged))
      return merged
    })
    setMessages((prev) => prev.map((m) => ({ ...m, read: true })))
  }

  const handleNotifClick = (item) => {
    setReadNotifIds((prev) => {
      const merged = Array.from(new Set([...prev, item.id]))
      localStorage.setItem('tt_admin_read_notifs', JSON.stringify(merged))
      return merged
    })
    setNotifications((prev) => prev.map((n) => (n.id === item.id ? { ...n, read: true } : n)))
    setNotificationsOpen(false)
    if (item.link) navigate(item.link)
  }

  const handleMessageClick = (item) => {
    setReadMsgIds((prev) => {
      const merged = Array.from(new Set([...prev, item.id]))
      localStorage.setItem('tt_admin_read_msgs', JSON.stringify(merged))
      return merged
    })
    setMessages((prev) => prev.map((m) => (m.id === item.id ? { ...m, read: true } : m)))
    setMessagesOpen(false)
    navigate('/admin/enquiries')
  }

  const mainNav = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, keywords: 'analytics stats revenue overview' },
    { name: 'Bookings', path: '/admin/bookings', icon: CalendarDays, keywords: 'orders reservations payments clients' },
    { name: 'Tour Packages', path: '/admin/expeditions', icon: Briefcase, keywords: 'tours packages expeditions itineraries' },
    { name: 'Custom Trip Requests', path: '/admin/custom-trips', icon: Compass, keywords: 'bespoke tailor inquiries custom' },
    { name: 'Destinations', path: '/admin/destinations', icon: MapPin, keywords: 'places countries cities retreats' },
    { name: 'Customers', path: '/admin/customers', icon: Users, keywords: 'guests travelers explorers users' },
    { name: 'Enquiries', path: '/admin/enquiries', icon: MessageSquare, keywords: 'messages contact forms questions leads' },
    { name: 'Reviews', path: '/admin/reviews', icon: Star, keywords: 'ratings feedback testimonials comments' },
    { name: 'Blog Posts', path: '/admin/blog', icon: File, keywords: 'articles news stories travel guide' },
    { name: 'Coupons', path: '/admin/coupons', icon: Star, keywords: 'discounts promo codes vouchers deals' },
    { name: 'Media Library', path: '/admin/media', icon: ImageIcon, keywords: 'photos gallery assets images uploads' },
  ]

  const manageNav = [
    { name: 'Users & Roles', path: '/admin/users', icon: Shield, keywords: 'admin staff permissions team access' },
    { name: 'Settings', path: '/admin/settings', icon: Settings, keywords: 'configuration site branding phone email' },
  ]

  const allNavItems = [...mainNav, ...manageNav]

  // Global Keyboard Shortcut: ⌘K for Search, ⌘B for Sidebar Toggle
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchModalOpen((prev) => !prev)
        setNotificationsOpen(false)
        setMessagesOpen(false)
        setProfileDropdownOpen(false)
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault()
        toggleSidebar()
      } else if (e.key === 'Escape') {
        setSearchModalOpen(false)
        setNotificationsOpen(false)
        setMessagesOpen(false)
        setProfileDropdownOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Auto focus input when search modal opens
  useEffect(() => {
    if (searchModalOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50)
    } else {
      setSearchQuery('')
    }
  }, [searchModalOpen])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false)
      }
      if (messagesRef.current && !messagesRef.current.contains(event.target)) {
        setMessagesOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close mobile menu and modals on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setSearchModalOpen(false)
    setNotificationsOpen(false)
    setMessagesOpen(false)
    setProfileDropdownOpen(false)
  }, [location.pathname])

  // Filtered search results
  const searchResults = allNavItems.filter((item) => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return true
    return item.name.toLowerCase().includes(q) || item.keywords.toLowerCase().includes(q)
  })

  return (
    <div className="flex h-screen bg-[#13151A] text-white overflow-hidden font-sans relative select-none">
      
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden animate-fadeIn" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar (Collapsible on Desktop) */}
      <aside
        className={`${
          sidebarCollapsed ? 'md:w-[76px]' : 'md:w-[260px]'
        } w-[260px] flex-shrink-0 bg-[#1A1D24] border-r border-white/5 flex flex-col h-full z-30 fixed md:static transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className={`h-[72px] flex items-center border-b border-white/5 shrink-0 transition-all ${
          sidebarCollapsed ? 'px-3 justify-center' : 'px-5 justify-between'
        }`}>
          {sidebarCollapsed ? (
            /* ChatGPT-style Hover Morph: Logo -> Sidebar Toggle Icon */
            <button
              type="button"
              onClick={toggleSidebar}
              className="group relative w-11 h-11 rounded-xl flex items-center justify-center cursor-pointer hover:bg-white/10 transition-all duration-200"
              title="Open sidebar (Ctrl+B)"
            >
              {/* Default: Logo Icon */}
              <img 
                src={logoImg} 
                alt="Logo" 
                className="h-7 w-auto transition-all duration-200 group-hover:opacity-0 group-hover:scale-75 drop-shadow-[0_2px_8px_rgba(111,207,69,0.5)]" 
              />
              {/* Hover: Sidebar Toggle Icon (ChatGPT Style) */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200 text-white group-hover:text-[#6FCF45]">
                <PanelLeft className="w-5 h-5" />
              </div>
            </button>
          ) : (
            <>
              <Link to="/" className="flex items-center gap-3 overflow-hidden group" title="Tours & Travels">
                <img src={logoImg} alt="Logo" className="h-8 w-auto shrink-0 drop-shadow-[0_2px_8px_rgba(111,207,69,0.5)] transition-transform group-hover:scale-105" />
                <div className="flex flex-col leading-none truncate">
                  <span className="font-bold text-[13px] tracking-widest text-white uppercase">Tours &amp;</span>
                  <span className="font-bold text-[13px] tracking-widest text-[#6FCF45] uppercase">Travels</span>
                </div>
              </Link>

              {/* Close Sidebar Button (Desktop) */}
              <button
                type="button"
                onClick={toggleSidebar}
                className="hidden md:flex p-1.5 rounded-lg text-[#A8B5AF] hover:text-white hover:bg-white/10 transition-colors shrink-0"
                title="Close sidebar (Ctrl+B)"
              >
                <PanelLeft className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Mobile Close Button */}
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-[#A8B5AF] hover:text-white transition-colors p-1"
            title="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links (Hidden scrollbar) */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden space-y-6">
          <div>
            {!sidebarCollapsed && (
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#A8B5AF]/60 mb-2 px-3">
                Main Menu
              </h4>
            )}
            <nav className="space-y-1">
              {mainNav.map((item) => {
                const isActive = location.pathname === item.path
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    title={sidebarCollapsed ? item.name : ''}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all group ${
                      sidebarCollapsed ? 'justify-center px-0' : ''
                    } ${
                      isActive
                        ? 'bg-[#6FCF45]/15 text-[#6FCF45] border border-[#6FCF45]/30 shadow-sm'
                        : 'text-[#A8B5AF] hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#6FCF45]' : 'group-hover:text-white'}`} />
                    {!sidebarCollapsed && <span className="truncate">{item.name}</span>}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div>
            {!sidebarCollapsed && (
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#A8B5AF]/60 mb-2 px-3">
                Manage
              </h4>
            )}
            <nav className="space-y-1">
              {manageNav.map((item) => {
                const isActive = location.pathname === item.path
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    title={sidebarCollapsed ? item.name : ''}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all group ${
                      sidebarCollapsed ? 'justify-center px-0' : ''
                    } ${
                      isActive
                        ? 'bg-[#6FCF45]/15 text-[#6FCF45] border border-[#6FCF45]/30 shadow-sm'
                        : 'text-[#A8B5AF] hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#6FCF45]' : 'group-hover:text-white'}`} />
                    {!sidebarCollapsed && <span className="truncate">{item.name}</span>}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Footer: Logout & User Profile Card Below Logout */}
        <div className="p-3 border-t border-white/5 shrink-0 space-y-2">
          {/* Logout Button */}
          <button
            onClick={logout}
            title={sidebarCollapsed ? 'Sign Out' : ''}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-red-400 hover:bg-red-500/10 transition-colors ${
              sidebarCollapsed ? 'justify-center px-0' : ''
            }`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>

          {/* User Profile Card (Below Logout Button) */}
          <div className={`pt-2 border-t border-white/5 flex items-center gap-3 transition-all ${
            sidebarCollapsed ? 'justify-center p-1' : 'px-2 py-1.5'
          }`}>
            <div
              className="w-9 h-9 rounded-full bg-[#13382C] border border-[#6FCF45]/40 flex items-center justify-center text-[#6FCF45] shrink-0 shadow-sm cursor-pointer"
              title={sidebarCollapsed ? `${user?.name || 'Admin'} (Super Admin)` : ''}
              onClick={() => {
                if (sidebarCollapsed) toggleSidebar()
              }}
            >
              <User className="w-4 h-4" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-xs text-white truncate">{user?.name?.split(' ')[0] || 'Admin'}</h3>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-[#6FCF45]/20 text-[#6FCF45]">
                    Super Admin
                  </span>
                </div>
                <p className="text-[10px] text-[#A8B5AF] truncate mt-0.5">{user?.email || 'admin@tours.com'}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10 w-full">
        {/* Top Header */}
        <header className="h-[72px] shrink-0 bg-[#1A1D24] border-b border-white/5 flex items-center justify-between px-4 sm:px-6 lg:px-10 relative z-30">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden text-[#A8B5AF] hover:text-[#6FCF45] transition-colors p-1"
              title="Open Navigation"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="hidden sm:flex flex-col">
              <h1 className="text-xl font-bold tracking-wide leading-tight">
                {mainNav.find((n) => n.path === location.pathname)?.name || manageNav.find((n) => n.path === location.pathname)?.name || 'Dashboard'}
              </h1>
              <p className="text-xs text-[#A8B5AF] font-medium mt-0.5">Welcome back, {user?.name?.split(' ')[0] || 'Admin'} 👋</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            {/* 1. Global Search Trigger Button / Input */}
            <div className="relative hidden md:block w-72">
              <button
                type="button"
                onClick={() => {
                  setSearchModalOpen(true)
                  setNotificationsOpen(false)
                  setMessagesOpen(false)
                  setProfileDropdownOpen(false)
                }}
                className="w-full bg-[#13151A] hover:bg-[#15181E] border border-white/10 hover:border-[#6FCF45]/40 rounded-md pl-10 pr-12 py-2 text-sm text-left text-[#A8B5AF] transition-all flex items-center justify-between group cursor-pointer shadow-inner"
              >
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8B5AF] group-hover:text-[#6FCF45] transition-colors" />
                <span className="truncate">Search anything...</span>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[#A8B5AF] text-[10px] font-sans font-semibold">⌘</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[#A8B5AF] text-[10px] font-sans font-semibold">K</kbd>
                </div>
              </button>
            </div>

            {/* Mobile Search Icon */}
            <button
              onClick={() => {
                setSearchModalOpen(true)
                setNotificationsOpen(false)
                setMessagesOpen(false)
                setProfileDropdownOpen(false)
              }}
              className="md:hidden text-[#A8B5AF] hover:text-[#6FCF45] transition-colors p-2 rounded-lg hover:bg-white/5"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Action Buttons Group */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* 2. Notifications Dropdown (Connected to live backend) */}
              <div className="relative" ref={notificationsRef}>
                <button 
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen)
                    setMessagesOpen(false)
                    setProfileDropdownOpen(false)
                    if (!notificationsOpen) fetchDynamicActivities()
                  }}
                  className={`relative p-2 rounded-lg transition-all focus:outline-none ${
                    notificationsOpen ? 'bg-[#6FCF45]/15 text-[#6FCF45]' : 'text-[#A8B5AF] hover:text-white hover:bg-white/5'
                  }`}
                  title="Live Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-[#6FCF45] border border-[#1A1D24] text-[#13151A] text-[9px] font-extrabold rounded-full flex items-center justify-center shadow-sm">
                      {unreadNotifCount}
                    </span>
                  )}
                </button>

                {/* Notifications Panel */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#1A1D24] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-fadeIn">
                    <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#13151A]/60">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-[#6FCF45]" />
                        <h4 className="text-sm font-bold text-white">Live Activity Alerts</h4>
                        {unreadNotifCount > 0 ? (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#6FCF45]/20 text-[#6FCF45]">
                            {unreadNotifCount} New
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#A8B5AF]">All caught up</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={fetchDynamicActivities}
                          className="text-[#A8B5AF] hover:text-white transition-colors p-1"
                          title="Refresh"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${loadingActivities ? 'animate-spin text-[#6FCF45]' : ''}`} />
                        </button>
                        {unreadNotifCount > 0 && (
                          <button
                            onClick={markAllNotificationsRead}
                            className="text-[11px] text-[#6FCF45] hover:underline font-semibold flex items-center gap-1"
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                            <span>Mark all read</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-white/5 custom-scrollbar">
                      {notifications.length === 0 ? (
                        <div className="py-12 text-center text-[#A8B5AF]">
                          <Bell className="w-8 h-8 mx-auto mb-2 text-[#A8B5AF]/40" />
                          <p className="text-xs">No notifications yet</p>
                          <p className="text-[11px] text-[#A8B5AF]/60 mt-0.5">Recent bookings and activities will appear here.</p>
                        </div>
                      ) : (
                        notifications.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => handleNotifClick(item)}
                            className={`p-3.5 hover:bg-white/5 transition-colors cursor-pointer flex items-start gap-3 ${
                              !item.read ? 'bg-[#6FCF45]/5' : ''
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                              item.type === 'booking'
                                ? 'bg-blue-500/20 text-blue-400'
                                : item.type === 'custom'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : item.type === 'review'
                                ? 'bg-amber-500/20 text-amber-400'
                                : item.type === 'enquiry'
                                ? 'bg-indigo-500/20 text-indigo-400'
                                : 'bg-purple-500/20 text-purple-400'
                            }`}>
                              {item.type === 'booking' ? <CalendarDays className="w-4 h-4" /> :
                               item.type === 'custom' ? <Compass className="w-4 h-4" /> :
                               item.type === 'review' ? <Star className="w-4 h-4" /> :
                               item.type === 'enquiry' ? <MessageSquare className="w-4 h-4" /> :
                               <CheckCircle2 className="w-4 h-4" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <p className={`text-xs font-semibold truncate ${!item.read ? 'text-white' : 'text-[#A8B5AF]'}`}>
                                  {item.title}
                                </p>
                                <span className="text-[10px] text-[#A8B5AF]/60 shrink-0">{item.time}</span>
                              </div>
                              <p className="text-[11px] text-[#A8B5AF] mt-0.5 line-clamp-1 leading-relaxed">
                                {item.desc}
                              </p>
                            </div>
                            {!item.read && (
                              <span className="w-2 h-2 rounded-full bg-[#6FCF45] shrink-0 mt-1.5" />
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    <div className="p-2.5 border-t border-white/10 bg-[#13151A]/40 text-center">
                      <Link
                        to="/admin/bookings"
                        onClick={() => setNotificationsOpen(false)}
                        className="text-xs text-[#6FCF45] hover:underline font-semibold block py-1"
                      >
                        View All Bookings &amp; Logs →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Messages / Enquiries Dropdown (Connected to live /contact API) */}
              <div className="relative" ref={messagesRef}>
                <button 
                  onClick={() => {
                    setMessagesOpen(!messagesOpen)
                    setNotificationsOpen(false)
                    setProfileDropdownOpen(false)
                    if (!messagesOpen) fetchDynamicActivities()
                  }}
                  className={`relative p-2 rounded-lg transition-all focus:outline-none ${
                    messagesOpen ? 'bg-[#6FCF45]/15 text-[#6FCF45]' : 'text-[#A8B5AF] hover:text-white hover:bg-white/5'
                  }`}
                  title="Live Client Enquiries"
                >
                  <MessageSquare className="w-5 h-5" />
                  {unreadMsgCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-[#6FCF45] border border-[#1A1D24] text-[#13151A] text-[9px] font-extrabold rounded-full flex items-center justify-center shadow-sm">
                      {unreadMsgCount}
                    </span>
                  )}
                </button>

                {/* Messages Panel */}
                {messagesOpen && (
                  <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#1A1D24] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-fadeIn">
                    <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#13151A]/60">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-[#6FCF45]" />
                        <h4 className="text-sm font-bold text-white">Client Inquiries</h4>
                        {unreadMsgCount > 0 ? (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#6FCF45]/20 text-[#6FCF45]">
                            {unreadMsgCount} New
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#A8B5AF]">Inbox up to date</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={fetchDynamicActivities}
                          className="text-[#A8B5AF] hover:text-white transition-colors p-1"
                          title="Refresh"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${loadingActivities ? 'animate-spin text-[#6FCF45]' : ''}`} />
                        </button>
                        {unreadMsgCount > 0 && (
                          <button
                            onClick={markAllMessagesRead}
                            className="text-[11px] text-[#6FCF45] hover:underline font-semibold flex items-center gap-1"
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                            <span>Mark all read</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-white/5 custom-scrollbar">
                      {messages.length === 0 ? (
                        <div className="py-12 text-center text-[#A8B5AF]">
                          <MessageSquare className="w-8 h-8 mx-auto mb-2 text-[#A8B5AF]/40" />
                          <p className="text-xs">No client enquiries found</p>
                          <p className="text-[11px] text-[#A8B5AF]/60 mt-0.5">New contact submissions will be displayed here live.</p>
                        </div>
                      ) : (
                        messages.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => handleMessageClick(item)}
                            className={`p-3.5 hover:bg-white/5 transition-colors cursor-pointer flex items-start gap-3 ${
                              !item.read ? 'bg-[#6FCF45]/5' : ''
                            }`}
                          >
                            <div className="w-8 h-8 rounded-full bg-[#13382C] border border-[#6FCF45]/40 flex items-center justify-center text-[#6FCF45] text-xs font-bold shrink-0 mt-0.5">
                              {item.sender.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <p className={`text-xs font-semibold truncate ${!item.read ? 'text-white' : 'text-[#A8B5AF]'}`}>
                                  {item.sender}
                                </p>
                                <span className="text-[10px] text-[#A8B5AF]/60 shrink-0">{item.time}</span>
                              </div>
                              <p className="text-[11px] text-[#A8B5AF] line-clamp-1 leading-relaxed mt-0.5">
                                {item.subject}
                              </p>
                              <p className="text-[10px] text-[#A8B5AF]/60 truncate mt-0.5">
                                {item.email} {item.phone ? `• ${item.phone}` : ''}
                              </p>
                            </div>
                            {!item.read && (
                              <span className="w-2 h-2 rounded-full bg-[#6FCF45] shrink-0 mt-1.5" />
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    <div className="p-2.5 border-t border-white/10 bg-[#13151A]/40 text-center">
                      <Link
                        to="/admin/enquiries"
                        onClick={() => setMessagesOpen(false)}
                        className="text-xs text-[#6FCF45] hover:underline font-semibold block py-1"
                      >
                        Manage All Enquiries in Inbox →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

            </div>

            <div className="h-8 w-px bg-white/10 hidden sm:block"></div>

            {/* 4. Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => {
                  setProfileDropdownOpen(!profileDropdownOpen)
                  setNotificationsOpen(false)
                  setMessagesOpen(false)
                }}
                className={`flex items-center gap-2.5 py-1.5 px-2.5 rounded-full transition-all focus:outline-none border ${
                  profileDropdownOpen 
                    ? 'bg-white/10 border-[#6FCF45]/50' 
                    : 'bg-[#13151A] hover:bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#13382C] border border-[#6FCF45]/40 flex items-center justify-center text-[#6FCF45] shrink-0 font-bold text-xs">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-white truncate max-w-[100px]">
                    {user?.name?.split(' ')[0] || 'Admin'}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#A8B5AF] transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180 text-[#6FCF45]' : ''}`} />
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#1A1D24] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-fadeIn">
                  {/* User details header */}
                  <div className="p-4 border-b border-white/10 bg-[#13151A]/60">
                    <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</p>
                    <p className="text-[11px] text-[#A8B5AF] truncate mt-0.5">{user?.email || 'admin@tours.com'}</p>
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[#6FCF45]/20 text-[#6FCF45]">
                      <Shield className="w-3 h-3" />
                      <span>{user?.role === 'admin' ? 'Super Administrator' : 'Administrator'}</span>
                    </div>
                  </div>

                  {/* Actions list */}
                  <div className="py-1.5">
                    <Link 
                      to="/" 
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#A8B5AF] hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-[#6FCF45]" />
                      <span>View Live Website</span>
                    </Link>
                    <Link 
                      to="/admin/settings" 
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#A8B5AF] hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-[#A8B5AF]" />
                      <span>System Settings</span>
                    </Link>
                    <Link 
                      to="/account" 
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#A8B5AF] hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <User className="w-4 h-4 text-[#A8B5AF]" />
                      <span>Explorer Profile</span>
                    </Link>
                    
                    <div className="h-px bg-white/5 my-1"></div>

                    <button 
                      onClick={() => {
                        setProfileDropdownOpen(false)
                        logout()
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out Admin</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Global Spotlight / Quick Search Modal (⌘K / Ctrl+K) */}
        {searchModalOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
            <div 
              className="bg-[#1A1D24] border border-white/15 rounded-2xl w-full max-w-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden animate-scaleUp"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search input header */}
              <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-[#13151A]">
                <Search className="w-5 h-5 text-[#6FCF45] shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Jump to any admin section, booking, or setting..."
                  className="w-full bg-transparent text-sm sm:text-base text-white placeholder:text-[#A8B5AF] focus:outline-none"
                />
                <button
                  onClick={() => setSearchModalOpen(false)}
                  className="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-[#A8B5AF] hover:text-white text-xs font-mono transition-colors"
                >
                  ESC
                </button>
              </div>

              {/* Search Results / Fast Links */}
              <div className="max-h-96 overflow-y-auto p-3 custom-scrollbar">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#A8B5AF]/60 px-3 py-1.5">
                  Navigation &amp; Sections ({searchResults.length})
                </p>

                {searchResults.length === 0 ? (
                  <div className="py-12 text-center text-[#A8B5AF]">
                    <Search className="w-8 h-8 mx-auto mb-2 text-[#A8B5AF]/40" />
                    <p className="text-sm">No admin sections matched "{searchQuery}"</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {searchResults.map((item) => {
                      const Icon = item.icon
                      const isActive = location.pathname === item.path
                      return (
                        <button
                          key={item.name}
                          onClick={() => {
                            setSearchModalOpen(false)
                            navigate(item.path)
                          }}
                          className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all group ${
                            isActive
                              ? 'bg-[#6FCF45]/15 border border-[#6FCF45]/30 text-white'
                              : 'hover:bg-white/5 text-[#A8B5AF] hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              isActive ? 'bg-[#6FCF45] text-[#071A16]' : 'bg-white/5 text-[#6FCF45] group-hover:bg-[#6FCF45]/20'
                            }`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm font-semibold text-white group-hover:text-[#6FCF45] transition-colors">
                                {item.name}
                              </p>
                              <p className="text-[11px] text-[#A8B5AF] line-clamp-1">
                                {item.keywords}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-[#A8B5AF] group-hover:text-[#6FCF45] group-hover:translate-x-0.5 transition-all" />
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Search footer hints */}
              <div className="p-3 border-t border-white/10 bg-[#13151A]/60 flex items-center justify-between text-[11px] text-[#A8B5AF]">
                <div className="flex items-center gap-3">
                  <span>Press <kbd className="px-1 py-0.5 bg-white/10 rounded font-mono text-[10px]">↵</kbd> to select</span>
                  <span>Press <kbd className="px-1 py-0.5 bg-white/10 rounded font-mono text-[10px]">ESC</kbd> to close</span>
                </div>
                <span className="text-[#6FCF45] font-semibold">Tours &amp; Travels Admin</span>
              </div>
            </div>
          </div>
        )}

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto bg-[#13151A] p-4 sm:p-6 lg:p-8 custom-scrollbar relative w-full max-w-full">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
          
          <footer className="max-w-[1600px] mx-auto mt-12 py-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-[#A8B5AF] gap-2">
            <p className="text-center sm:text-left">&copy; {new Date().getFullYear()} Tours &amp; Travels. All rights reserved.</p>
            <p className="text-center sm:text-right">
              Luxury Travel Portal &amp; Concierge System
            </p>
          </footer>
        </main>
      </div>
    </div>
  )
}
