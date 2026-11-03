import React, { useEffect, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { BookingProvider } from './context/BookingContext'
import { WishlistProvider } from './context/WishlistContext'
import { SettingsProvider } from './context/SettingsContext'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTopButton from './components/ScrollToTopButton'
import ProtectedRoute from './components/ProtectedRoute'
import SplashScreen from './components/SplashScreen'
import RouteFallback from './components/RouteFallback'
import lazyWithRetry from './utils/lazyWithRetry'
import { prefetchDestinationImages } from './utils/imagePrefetcher'

// --- Lazy Loaded Customer Pages with Resilient Chunk Retry ---
const Home = lazyWithRetry(() => import('./pages/Home'))
const ExplorePage = lazyWithRetry(() => import('./pages/ExplorePage'))
const DestinationsPage = lazyWithRetry(() => import('./pages/DestinationsPage'))
const DestinationDetails = lazyWithRetry(() => import('./pages/DestinationDetails'))
const ToursPage = lazyWithRetry(() => import('./pages/ToursPage'))
const TourDetails = lazyWithRetry(() => import('./pages/TourDetails'))
const BookingPage = lazyWithRetry(() => import('./pages/BookingPage'))
const CustomTripPage = lazyWithRetry(() => import('./pages/CustomTripPage'))
const Login = lazyWithRetry(() => import('./pages/Login'))
const Register = lazyWithRetry(() => import('./pages/Register'))
const Profile = lazyWithRetry(() => import('./pages/Profile'))
const MyBookings = lazyWithRetry(() => import('./pages/MyBookings'))
const WishlistPage = lazyWithRetry(() => import('./pages/WishlistPage'))
const AboutPage = lazyWithRetry(() => import('./pages/AboutPage'))
const ContactPage = lazyWithRetry(() => import('./pages/ContactPage'))
const GalleryPage = lazyWithRetry(() => import('./pages/GalleryPage'))
const PolicyPage = lazyWithRetry(() => import('./pages/PolicyPage'))
const PillarsPage = lazyWithRetry(() => import('./pages/PillarsPage'))
const SitemapPage = lazyWithRetry(() => import('./pages/SitemapPage'))

// --- Lazy Loaded Admin Portal Pages & Layout (Zero Public Bundle Bloat) ---
const AdminLayout = lazyWithRetry(() => import('./layouts/AdminLayout'))
const AdminLogin = lazyWithRetry(() => import('./pages/AdminLogin'))
const AdminDashboard = lazyWithRetry(() => import('./pages/AdminDashboard'))
const AdminBookings = lazyWithRetry(() => import('./pages/AdminBookings'))
const AdminCustomers = lazyWithRetry(() => import('./pages/AdminCustomers'))
const AdminExpeditions = lazyWithRetry(() => import('./pages/AdminExpeditions'))
const AdminDestinations = lazyWithRetry(() => import('./pages/AdminDestinations'))
const AdminPackages = lazyWithRetry(() => import('./pages/AdminPackages'))
const AdminEnquiries = lazyWithRetry(() => import('./pages/AdminEnquiries'))
const AdminReviews = lazyWithRetry(() => import('./pages/AdminReviews'))
const AdminBlog = lazyWithRetry(() => import('./pages/AdminBlog'))
const AdminCoupons = lazyWithRetry(() => import('./pages/AdminCoupons'))
const AdminMedia = lazyWithRetry(() => import('./pages/AdminMedia'))
const AdminUsers = lazyWithRetry(() => import('./pages/AdminUsers'))
const AdminSettings = lazyWithRetry(() => import('./pages/AdminSettings'))

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
            {/* Elegant Kinetic Luxury Splash Screen */}
            <SplashScreen minDisplayTime={1800} />
            <Router>
              <ScrollToTop />
              <Suspense fallback={<RouteFallback />}>
                <Routes>
                  {/* --- Dedicated Admin Gatekeeper Login Route --- */}
                  <Route path="/admin/login" element={<AdminLogin />} />

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
                    <Route path="/explore" element={<ExplorePage />} />
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
              </Suspense>
            </Router>
          </BookingProvider>
        </WishlistProvider>
      </SettingsProvider>
    </AuthProvider>
  )
}

export default App
