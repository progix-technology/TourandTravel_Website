import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { BookingProvider } from './context/BookingContext'
import { WishlistProvider } from './context/WishlistContext'
import { SettingsProvider } from './context/SettingsContext'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTopButton from './components/ScrollToTopButton'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './layouts/AdminLayout'

// Direct Page Imports for Instant 0ms Load & Zero-Chunk-Failure Guarantee
import Home from './pages/Home'
import DestinationsPage from './pages/DestinationsPage'
import DestinationDetails from './pages/DestinationDetails'
import ToursPage from './pages/ToursPage'
import TourDetails from './pages/TourDetails'
import BookingPage from './pages/BookingPage'
import CustomTripPage from './pages/CustomTripPage'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import MyBookings from './pages/MyBookings'
import WishlistPage from './pages/WishlistPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import GalleryPage from './pages/GalleryPage'
import PolicyPage from './pages/PolicyPage'
import PillarsPage from './pages/PillarsPage'
import SitemapPage from './pages/SitemapPage'
import AdminDashboard from './pages/AdminDashboard'
import AdminBookings from './pages/AdminBookings'
import AdminCustomers from './pages/AdminCustomers'
import AdminExpeditions from './pages/AdminExpeditions'
import AdminDestinations from './pages/AdminDestinations'
import AdminPackages from './pages/AdminPackages'
import AdminEnquiries from './pages/AdminEnquiries'
import AdminReviews from './pages/AdminReviews'
import AdminBlog from './pages/AdminBlog'
import AdminCoupons from './pages/AdminCoupons'
import AdminMedia from './pages/AdminMedia'
import AdminUsers from './pages/AdminUsers'
import AdminSettings from './pages/AdminSettings'
import { prefetchDestinationImages } from './utils/imagePrefetcher'

// Automatically scroll window to top on route navigation
const ScrollToTop = () => {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''))
      if (element) {
        element.scrollIntoView({ behavior: 'auto' })
        return
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, hash])

  return null
}

function MainLayout() {
  const location = useLocation()
  const isAccountDashboard =
    location.pathname.startsWith('/account') && location.pathname !== '/account/wishlist'
  const hideNavbar = isAccountDashboard
  const hideFooter =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/custom-trip' ||
    isAccountDashboard

  return (
    <div className="flex flex-col min-h-screen bg-[#071A16] text-[#FFFFFF] font-sans antialiased selection:bg-[#6FCF45] selection:text-[#071A16]">
      {!hideNavbar && <Navbar />}
      <div className="flex-grow">
        <Outlet />
      </div>
      {!hideFooter && <Footer />}
      <ScrollToTopButton />
    </div>
  )
}

function App() {
  useEffect(() => {
    // Silently pre-cache all images in the background on startup
    prefetchDestinationImages()
  }, [])

  return (
    <AuthProvider>
      <SettingsProvider>
        <WishlistProvider>
          <BookingProvider>
            <Router>
              <ScrollToTop />
              <Routes>
                {/* --- Admin Routes (Uses AdminLayout) --- */}
                <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminLayout /></ProtectedRoute>}>
                  {/* Default admin page */}
                  <Route index element={<AdminDashboard />} />
                  <Route path="bookings" element={<AdminBookings />} />
                  <Route path="customers" element={<AdminCustomers />} />
                  <Route path="expeditions" element={<AdminExpeditions />} />
                  <Route path="tour-packages" element={<AdminExpeditions />} />
                  <Route path="destinations" element={<AdminDestinations />} />
                  <Route path="packages" element={<AdminPackages />} />
                  <Route path="custom-trips" element={<AdminPackages />} />
                  <Route path="enquiries" element={<AdminEnquiries />} />
                  <Route path="reviews" element={<AdminReviews />} />
                  <Route path="blog" element={<AdminBlog />} />
                  <Route path="coupons" element={<AdminCoupons />} />
                  <Route path="media" element={<AdminMedia />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="settings" element={<AdminSettings />} />
                  {/* Other admin pages can be added here later */}
                  <Route path="*" element={<AdminDashboard />} />
                </Route>

                {/* --- Public / Customer Routes (Uses MainLayout) --- */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/destinations" element={<DestinationsPage />} />
                  <Route path="/destinations/:slug" element={<DestinationDetails />} />
                  <Route path="/tours" element={<ToursPage />} />
                  <Route path="/tours/:slug" element={<TourDetails />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/pillars" element={<PillarsPage />} />
                  <Route path="/pillars/:slug" element={<PillarsPage />} />
                  <Route path="/gallery" element={<GalleryPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/booking/:tourId" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
                  <Route path="/checkout" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
                  <Route path="/custom-trip" element={<CustomTripPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/account" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/account/bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
                  <Route path="/account/wishlist" element={<WishlistPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/policy" element={<PolicyPage />} />
                  <Route path="/terms" element={<PolicyPage />} />
                  <Route path="/privacy" element={<PolicyPage />} />
                  <Route path="/sustainability" element={<PolicyPage />} />
                  <Route path="/sitemap" element={<SitemapPage />} />
                  {/* Fallback */}
                  <Route path="*" element={<Home />} />
                </Route>
              </Routes>
            </Router>
          </BookingProvider>
        </WishlistProvider>
      </SettingsProvider>
    </AuthProvider>
  )
}

export default App
