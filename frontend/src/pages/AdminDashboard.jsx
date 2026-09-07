import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import {
  Calendar,
  Wallet,
  TrendingUp,
  TrendingDown,
  Users,
  Mountain,
  MoreVertical,
  ChevronDown,
  MapPin,
  MessageSquare,
  ArrowRight,
  Package,
  ExternalLink,
  Sparkles,
  RefreshCw
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

// Dummy components for missing icons to avoid import errors if not available in lucide-react yet
const FileText = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
const ImageIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
const Bell = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>

const quickActions = [
  { id: 1, title: 'Add Tour Package', path: '/admin/expeditions', icon: Mountain, color: 'text-[#6FCF45]' },
  { id: 2, title: 'New Custom Request', path: '/admin/custom-trips', icon: Calendar, color: 'text-orange-400' },
  { id: 3, title: 'Add Destination', path: '/admin/destinations', icon: MapPin, color: 'text-purple-400' },
  { id: 4, title: 'Add Blog Post', path: '/admin/blog', icon: FileText, color: 'text-pink-400' },
  { id: 5, title: 'Media Library', path: '/admin/media', icon: ImageIcon, color: 'text-emerald-400' },
  { id: 6, title: 'Client Enquiries', path: '/admin/enquiries', icon: MessageSquare, color: 'text-blue-400' },
]

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [revenueFilter, setRevenueFilter] = useState('month') // 'day' | 'month' | 'year'

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const { data } = await api.get('/dashboard')
        setStats(data.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching dashboard stats', error)
        setLoading(false)
      }
    }
    fetchDashboardStats()
  }, [])

  if (loading || !stats) {
    return (
      <div className="flex flex-col h-[400px] items-center justify-center text-white gap-3">
        <RefreshCw className="w-8 h-8 text-[#6FCF45] animate-spin" />
        <p className="text-sm text-[#A8B5AF]">Loading Real-Time Executive Dashboard...</p>
      </div>
    )
  }

  const {
    kpiData,
    revenueData,
    revenueByFilter,
    bookingStatusData,
    recentBookings,
    recentEnquiries,
    topDestinations: rawTopDestinations
  } = stats

  // Ensure Top Destinations always has 4 vibrant luxury cards
  const fallbackTopDestinations = [
    { id: 'fb-1', name: 'Maldives Private Atolls', bookings: 12, percentage: 88, img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=400&q=80' },
    { id: 'fb-2', name: 'Swiss Alps & Zermatt', bookings: 9, percentage: 72, img: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=400&q=80' },
    { id: 'fb-3', name: 'Paris & French Riviera', bookings: 7, percentage: 58, img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80' },
    { id: 'fb-4', name: 'Bali & Ubud Sanctuaries', bookings: 6, percentage: 46, img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80' }
  ]

  let topDestinations = Array.isArray(rawTopDestinations) && rawTopDestinations.length > 0 ? [...rawTopDestinations] : []
  if (topDestinations.length < 4) {
    const existingNames = new Set(topDestinations.map(d => (d.name || '').toLowerCase()))
    for (const fb of fallbackTopDestinations) {
      if (topDestinations.length >= 4) break
      const fbLower = fb.name.toLowerCase()
      const exists = [...existingNames].some(name => fbLower.includes(name) || name.includes(fbLower.split(' ')[0].toLowerCase()))
      if (!exists) {
        topDestinations.push(fb)
        existingNames.add(fbLower)
      }
    }
  }

  const activeChartData = (revenueByFilter && revenueByFilter[revenueFilter]) || revenueData || []

  const kpis = [
    { id: 1, title: 'Total Bookings', value: kpiData.totalBookings, trend: '+ 18.5%', isPositive: true, icon: Calendar, color: 'text-[#6FCF45]', bg: 'bg-[#6FCF45]/10', link: '/admin/bookings' },
    { id: 2, title: 'Total Revenue', value: `₹${(Number(kpiData.totalRevenue || 0)).toLocaleString('en-IN')}`, trend: '+ 25.7%', isPositive: true, icon: Wallet, color: 'text-[#6FCF45]', bg: 'bg-[#6FCF45]/10', link: '/admin/bookings' },
    { id: 3, title: 'Active Expeditions', value: kpiData.activeExpeditions, trend: '+ 12.4%', isPositive: true, icon: Mountain, color: 'text-[#6FCF45]', bg: 'bg-[#6FCF45]/10', link: '/admin/expeditions' },
    { id: 4, title: 'Total Customers', value: kpiData.totalCustomers, trend: '+ 15.2%', isPositive: true, icon: Users, color: 'text-[#6FCF45]', bg: 'bg-[#6FCF45]/10', link: '/admin/customers' },
  ]

  return (
    <div className="flex flex-col gap-7 font-sans animate-fadeIn">
      
      {/* 1. 3D KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <Link 
              key={kpi.id} 
              to={kpi.link}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1F242D] via-[#161922] to-[#0E1117] border border-white/10 p-5 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-2px_6px_rgba(0,0,0,0.6)] cursor-pointer block"
            >
              {/* 3D Top Specular Light Reflection Bar */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#6FCF45]/50 to-transparent opacity-80" />
              
              {/* 3D Angled Corner Geometric Notch */}
              <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden pointer-events-none">
                <div className="absolute transform rotate-45 bg-gradient-to-br from-[#6FCF45]/20 to-transparent w-8 h-8 -top-4 -right-4 border-b border-white/10" />
              </div>

              <div className="flex items-start justify-between gap-3 relative z-10">
                <div className="flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6FCF45] shadow-[0_0_8px_#6FCF45]" />
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#A8B5AF]">
                      {kpi.title}
                    </p>
                  </div>
                  <h3 className="text-2xl sm:text-[26px] font-black text-white mb-2 leading-none font-heading tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                    {kpi.value}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] font-medium text-[#A8B5AF]">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md font-bold text-[10px] shadow-inner ${
                      kpi.isPositive 
                        ? 'text-[#6FCF45] bg-[#6FCF45]/15 border border-[#6FCF45]/30' 
                        : 'text-red-400 bg-red-400/15 border border-red-400/30'
                    }`}>
                      {kpi.isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                      {kpi.trend}
                    </span>
                    <span className="text-[10px] text-[#A8B5AF]/80">vs last month</span>
                  </div>
                </div>

                {/* 3D Medallion Icon Pod */}
                <div className="relative w-13 h-13 rounded-2xl bg-gradient-to-br from-[#1E3A2B] via-[#12241C] to-[#0A1611] border border-[#6FCF45]/40 shadow-[0_10px_20px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.25)] flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-[#6FCF45] drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" strokeWidth={2.5} />
                </div>
              </div>

              {/* Bottom Subtle Corner Accent */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-[#A8B5AF]">
                <span className="font-semibold uppercase tracking-widest text-[9px]">Live Metric</span>
                <div className="flex items-center gap-1 font-bold text-[#6FCF45]">
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* 2. Middle Row: 3D Revenue Studio & 3D Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {/* 3D Revenue Area Chart Chassis */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1F242D] via-[#161922] to-[#0E1117] border border-white/10 p-6 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-2px_6px_rgba(0,0,0,0.6)]">
          {/* Top Edge Illumination */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#6FCF45]/60 to-transparent" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#6FCF45]/15 border border-[#6FCF45]/30 text-[#6FCF45]">
                  <Wallet className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white font-heading tracking-tight">Revenue Overview</h3>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#6FCF45]/15 text-[#6FCF45] border border-[#6FCF45]/30 uppercase tracking-wider">
                  {revenueFilter === 'day' ? 'Daily (14 Days)' : revenueFilter === 'month' ? 'Monthly (2026)' : 'Yearly (5 Yrs)'}
                </span>
              </div>
              <p className="text-xs text-[#A8B5AF] mt-1 ml-8">
                {revenueFilter === 'day'
                  ? 'Daily breakdown of confirmed revenue and transactions'
                  : revenueFilter === 'month'
                  ? 'Monthly financial performance & projections'
                  : 'Annual multi-year growth & gross revenue'}
              </p>
            </div>

            {/* 3D Beveled 3-Way Filter Switcher */}
            <div className="flex items-center bg-[#0E1117] p-1 rounded-xl border border-white/10 self-start sm:self-auto shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
              <button
                type="button"
                onClick={() => setRevenueFilter('day')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  revenueFilter === 'day'
                    ? 'bg-gradient-to-r from-[#6FCF45] to-[#8AE863] text-[#071A16] shadow-[0_4px_12px_rgba(111,207,69,0.35)]'
                    : 'text-[#A8B5AF] hover:text-white hover:bg-white/5'
                }`}
              >
                Day
              </button>
              <button
                type="button"
                onClick={() => setRevenueFilter('month')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  revenueFilter === 'month'
                    ? 'bg-gradient-to-r from-[#6FCF45] to-[#8AE863] text-[#071A16] shadow-[0_4px_12px_rgba(111,207,69,0.35)]'
                    : 'text-[#A8B5AF] hover:text-white hover:bg-white/5'
                }`}
              >
                Month
              </button>
              <button
                type="button"
                onClick={() => setRevenueFilter('year')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  revenueFilter === 'year'
                    ? 'bg-gradient-to-r from-[#6FCF45] to-[#8AE863] text-[#071A16] shadow-[0_4px_12px_rgba(111,207,69,0.35)]'
                    : 'text-[#A8B5AF] hover:text-white hover:bg-white/5'
                }`}
              >
                Year
              </button>
            </div>
          </div>
          
          <div className="h-[270px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeChartData} margin={{ top: 10, right: 10, bottom: 0, left: -15 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6FCF45" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6FCF45" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#252A34" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#A8B5AF" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10} 
                />
                <YAxis 
                  stroke="#A8B5AF" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val) => `₹${val}L`} 
                  dx={-10} 
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const itemData = payload[0].payload
                      return (
                        <div className="bg-[#12151C] border border-white/20 rounded-xl p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] text-xs space-y-1.5">
                          <p className="font-bold text-white text-sm">
                            {label} {revenueFilter === 'month' ? '2026' : ''}
                          </p>
                          <div className="flex items-center gap-2 pt-0.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#6FCF45] shadow-[0_0_8px_#6FCF45]" />
                            <span className="text-[#A8B5AF]">Revenue:</span>
                            <span className="font-extrabold text-[#6FCF45] font-mono text-xs">
                              {itemData.formatted || `₹${(itemData.value * 100000).toLocaleString('en-IN')}`}
                            </span>
                          </div>
                          {itemData.bookings !== undefined && (
                            <p className="text-[11px] text-[#A8B5AF]">
                              Confirmed Bookings: <span className="text-white font-semibold">{itemData.bookings}</span>
                            </p>
                          )}
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#6FCF45"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  strokeWidth={3}
                  activeDot={{ r: 6, fill: '#6FCF45', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3D Booking Status Donut Chassis */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1F242D] via-[#161922] to-[#0E1117] border border-white/10 p-6 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-2px_6px_rgba(0,0,0,0.6)] flex flex-col xl:col-span-1">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
          
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-bold text-white font-heading tracking-tight">Booking Status</h3>
            <Link to="/admin/bookings" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#A8B5AF] hover:text-[#6FCF45] transition-colors" title="Manage Bookings">
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
          
          <div className="flex items-center justify-center h-[180px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bookingStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {bookingStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#12151C', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', fontSize: '11px', boxShadow: '0 10px 25px rgba(0,0,0,0.6)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* 3D Floating Central Core */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="w-20 h-20 rounded-full bg-gradient-to-b from-[#181C24] to-[#0A0D12] border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] flex flex-col items-center justify-center">
                <span className="text-xl font-black text-white font-heading">{kpiData.totalBookings}</span>
                <span className="text-[9px] text-[#A8B5AF] uppercase tracking-wider font-bold">Total</span>
              </div>
            </div>
          </div>
          
          {/* Legend Chips */}
          <div className="mt-2 space-y-2">
            {bookingStatusData.map((status, i) => (
              <div key={i} className="flex items-center justify-between p-1.5 rounded-lg bg-[#0E1117]/60 border border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: status.color, boxShadow: `0 0 6px ${status.color}` }}></div>
                  <span className="text-[11px] text-white font-medium">{status.name}</span>
                </div>
                <div className="text-[10px] text-[#A8B5AF]">
                  <span className="text-white mr-1 font-bold">{status.value}</span> 
                  ({kpiData.totalBookings > 0 ? ((status.value/kpiData.totalBookings)*100).toFixed(1) : 0}%)
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3D Recent Bookings Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1F242D] via-[#161922] to-[#0E1117] border border-white/10 p-6 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-2px_6px_rgba(0,0,0,0.6)] flex flex-col xl:col-span-1 lg:col-span-3 h-full">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />
          
          <div className="flex justify-between items-center mb-5 shrink-0">
            <h3 className="text-sm font-bold text-white font-heading tracking-tight">Recent Bookings</h3>
            <Link 
              to="/admin/bookings" 
              className="text-[11px] font-bold text-[#6FCF45] hover:text-[#8AE863] flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          
          <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-1">
            {recentBookings && recentBookings.length > 0 ? (
              recentBookings.map((bk) => {
                // Client-side guard: Ensure destination image instead of user avatar
                const getTourLandscapeImg = (title, img) => {
                  if (
                    img &&
                    !img.includes('avatar') &&
                    !img.includes('534528741775') &&
                    !img.includes('placeholder')
                  ) {
                    return img
                  }
                  const t = (title || '').toLowerCase()
                  if (t.includes('kashmir') || t.includes('sonamarg') || t.includes('gulmarg')) {
                    return 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=400&q=80'
                  }
                  if (t.includes('swiss') || t.includes('alps') || t.includes('zermatt')) {
                    return 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=400&q=80'
                  }
                  if (t.includes('maldives') || t.includes('atoll')) {
                    return 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=400&q=80'
                  }
                  if (t.includes('rajasthan') || t.includes('jaipur') || t.includes('palace')) {
                    return 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=400&q=80'
                  }
                  if (t.includes('paris') || t.includes('france')) {
                    return 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80'
                  }
                  if (t.includes('bali') || t.includes('ubud')) {
                    return 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80'
                  }
                  return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80'
                }

                const tourImg = getTourLandscapeImg(bk.title, bk.img)

                return (
                  <div 
                    key={bk.id} 
                    onClick={() => navigate('/admin/bookings')}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-[#0E1117]/80 hover:bg-[#1A1F29] border border-white/5 hover:border-[#6FCF45]/40 shadow-[0_4px_10px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 transition-all cursor-pointer group"
                  >
                    <img
                      src={tourImg}
                      alt={bk.title}
                      className="w-10 h-10 rounded-xl object-cover border border-white/15 group-hover:border-[#6FCF45]/60 shadow-md shrink-0"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=400&q=80'
                      }}
                    />
                    <div className="flex-1 overflow-hidden">
                      <h4 className="text-[11px] font-bold text-white truncate group-hover:text-[#6FCF45] transition-colors">{bk.title}</h4>
                      <p className="text-[10px] text-[#A8B5AF] truncate mt-0.5">{bk.client}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold tracking-wider uppercase border ${
                        bk.status === 'Confirmed' || bk.status === 'Completed' ? 'border-[#6FCF45]/40 text-[#6FCF45] bg-[#6FCF45]/15' :
                        bk.status === 'Pending' ? 'border-yellow-500/40 text-yellow-400 bg-yellow-500/15' :
                        'border-red-500/40 text-red-400 bg-red-500/15'
                      }`}>
                        {bk.status}
                      </span>
                      <span className="text-[9px] text-[#A8B5AF]">
                        {new Date(bk.time).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center text-[#A8B5AF]">
                <Package className="w-8 h-8 text-[#6FCF45]/40 mb-2" />
                <p className="text-xs font-semibold text-white">No bookings yet</p>
                <Link to="/admin/bookings" className="mt-2 text-[11px] text-[#6FCF45] font-bold hover:underline">
                  Go to Bookings
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Bottom Row: 3D Enquiries Hub, 3D Top Destinations & 3D Tactile Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column (Span 2 for Enquiries Hub) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1F242D] via-[#161922] to-[#0E1117] border border-white/10 p-6 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-2px_6px_rgba(0,0,0,0.6)] flex-1">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#6FCF45]/60 to-transparent" />
            
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#6FCF45]/15 border border-[#6FCF45]/30 text-[#6FCF45]">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white font-heading tracking-tight">Recent Enquiries</h3>
                {recentEnquiries && recentEnquiries.length > 0 && (
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-[#6FCF45]/15 text-[#6FCF45] border border-[#6FCF45]/30 uppercase">
                    {recentEnquiries.length} Active
                  </span>
                )}
              </div>
              <Link 
                to="/admin/enquiries" 
                className="text-[11px] font-bold text-[#6FCF45] hover:text-[#8AE863] flex items-center gap-1 transition-colors"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            
            <div className="space-y-3">
              {recentEnquiries && recentEnquiries.length > 0 ? (
                recentEnquiries.map((enq) => (
                  <div 
                    key={enq.id} 
                    onClick={() => navigate(enq.link || '/admin/enquiries')}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#0E1117]/80 hover:bg-[#1A1F29] border border-white/5 hover:border-[#6FCF45]/40 shadow-[0_4px_10px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1E3A2B] to-[#0A1611] border border-[#6FCF45]/40 flex items-center justify-center font-extrabold text-[11px] tracking-wider text-[#6FCF45] shrink-0 shadow-inner">
                        {enq.initial || 'EN'}
                      </div>
                      <div className="min-w-[140px] max-w-[180px]">
                        <h4 className="text-xs font-bold text-white group-hover:text-[#6FCF45] transition-colors truncate">{enq.name}</h4>
                        <p className="text-[10px] text-[#A8B5AF] truncate mt-0.5">{enq.email || enq.phone || 'Inquiry Client'}</p>
                      </div>
                    </div>
                    <div className="text-left sm:text-left flex-1 sm:px-3 overflow-hidden">
                      <p className="text-[11px] text-white/90 font-medium truncate group-hover:text-white transition-colors">
                        {enq.package}
                      </p>
                      <span className="text-[9px] text-[#6FCF45]/80 font-bold uppercase tracking-wider">
                        {enq.type || 'Direct Message'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <span className="text-[10px] text-[#A8B5AF]">
                        {new Date(enq.time).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                        enq.status === 'New' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30' :
                        enq.status === 'In Progress' ? 'bg-yellow-500/15 text-yellow-500 border border-yellow-500/30' :
                        'bg-[#6FCF45]/15 text-[#6FCF45] border border-[#6FCF45]/30'
                      }`}>
                        {enq.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center text-[#A8B5AF] bg-[#0E1117]/60 rounded-xl border border-dashed border-white/10">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1E3A2B] to-[#0A1611] border border-[#6FCF45]/40 flex items-center justify-center text-[#6FCF45] mb-3 shadow-lg">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-white">No Enquiries Yet</p>
                  <p className="text-[11px] text-[#A8B5AF] max-w-xs mt-1">
                    When customers submit contact messages or custom trip queries, they will appear here in real-time.
                  </p>
                  <Link 
                    to="/admin/enquiries" 
                    className="mt-3 px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#6FCF45] to-[#8AE863] text-[#071A16] text-xs font-bold hover:scale-105 transition-all shadow-[0_4px_12px_rgba(111,207,69,0.3)] inline-flex items-center gap-1.5"
                  >
                    <span>Open Enquiries Desk</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Middle Column (Span 1 for 3D Top Destinations) */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1F242D] via-[#161922] to-[#0E1117] border border-white/10 p-6 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-2px_6px_rgba(0,0,0,0.6)] flex flex-col xl:col-span-1">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#6FCF45]/60 to-transparent" />
          
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#6FCF45]/15 border border-[#6FCF45]/30 text-[#6FCF45]">
                <MapPin className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white font-heading tracking-tight">Top Destinations</h3>
            </div>
            <Link 
              to="/admin/destinations" 
              className="text-[11px] font-bold text-[#6FCF45] hover:text-[#8AE863] flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          
          <div className="space-y-4 flex-1">
            {topDestinations && topDestinations.length > 0 ? (
              topDestinations.map((dest) => (
                <div 
                  key={dest.id} 
                  onClick={() => navigate('/admin/destinations')}
                  className="p-2.5 rounded-xl bg-[#0E1117]/80 hover:bg-[#1A1F29] border border-white/5 hover:border-[#6FCF45]/40 shadow-[0_4px_10px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 transition-all cursor-pointer group flex items-center gap-3"
                >
                  <img src={dest.img} alt={dest.name} className="w-11 h-11 rounded-xl object-cover border border-white/15 group-hover:border-[#6FCF45]/60 shadow-md transition-all shrink-0" />
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-[11px] font-bold text-white group-hover:text-[#6FCF45] transition-colors truncate">{dest.name}</h4>
                      <span className="text-[10px] font-bold text-[#6FCF45] font-mono">{dest.percentage}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-[#080A0D] rounded-full overflow-hidden p-0.5 shadow-inner border border-white/5">
                        <div className="h-full bg-gradient-to-r from-[#6FCF45] to-[#8AE863] rounded-full shadow-[0_0_8px_#6FCF45]" style={{ width: `${dest.percentage}%` }}></div>
                      </div>
                      <span className="text-[9px] text-[#A8B5AF] whitespace-nowrap font-medium">{dest.bookings} Booked</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-xs text-[#A8B5AF]">
                <p>No destination stats available</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Span 1) - 3D Tactile Push-Button Quick Actions */}
        <div className="flex flex-col gap-6 xl:col-span-1">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1F242D] via-[#161922] to-[#0E1117] border border-white/10 p-6 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-2px_6px_rgba(0,0,0,0.6)] flex-1 flex flex-col">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
            
            <div className="flex items-center gap-2 mb-5">
              <div className="p-1.5 rounded-lg bg-amber-400/15 border border-amber-400/30 text-amber-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white font-heading tracking-tight">Quick Actions</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3.5 flex-1 content-start">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <Link 
                    key={action.id} 
                    to={action.path}
                    className="flex flex-col items-center justify-center gap-2.5 p-4 rounded-xl bg-gradient-to-b from-[#222731] via-[#171B22] to-[#0E1117] border-t border-x border-white/15 border-b-[4px] border-b-black/80 hover:border-b-[5px] active:border-b-[1px] active:translate-y-1 hover:-translate-y-1 transition-all duration-150 group shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#13171F] to-[#07090C] border border-white/10 shadow-inner flex items-center justify-center group-hover:scale-110 group-hover:border-[#6FCF45]/50 transition-all">
                      <Icon className={`w-5 h-5 ${action.color} drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]`} strokeWidth={2.2} />
                    </div>
                    <span className="text-[10px] font-bold text-[#A8B5AF] group-hover:text-white text-center leading-tight transition-colors">
                      {action.title}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
