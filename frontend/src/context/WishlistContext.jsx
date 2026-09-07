import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import api from '../services/api'

const WishlistContext = createContext()

export const WishlistProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth()

  // Helper to extract a unique user identifier key
  const getUserKey = () => {
    if (!user) return null
    return user._id || user.id || user.email || 'user'
  }

  // Load wishlist from user-scoped storage or user object
  const loadUserWishlist = () => {
    const key = getUserKey()
    if (!key) return []
    try {
      const saved = localStorage.getItem(`tt_wishlist_${key}`)
      if (saved) {
        return JSON.parse(saved)
      }
      if (Array.isArray(user?.wishlist) && user.wishlist.length > 0) {
        return user.wishlist
      }
      return []
    } catch {
      return []
    }
  }

  const [wishlist, setWishlist] = useState(loadUserWishlist)

  // Fetch from database & sync with backend on authentication
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setWishlist([])
      return
    }

    const syncWithBackend = async () => {
      const key = getUserKey()
      const localItems = loadUserWishlist()

      try {
        // If we have local items, sync & merge them with MongoDB
        if (localItems.length > 0) {
          const syncRes = await api.post('/users/wishlist/sync', { tourIds: localItems })
          if (syncRes.data?.success && Array.isArray(syncRes.data.data)) {
            setWishlist(syncRes.data.data)
            if (key) localStorage.setItem(`tt_wishlist_${key}`, JSON.stringify(syncRes.data.data))
            return
          }
        }

        // Fetch fresh wishlist from database
        const res = await api.get('/users/wishlist')
        if (res.data?.success && Array.isArray(res.data.data)) {
          setWishlist(res.data.data)
          if (key) localStorage.setItem(`tt_wishlist_${key}`, JSON.stringify(res.data.data))
        }
      } catch (err) {
        console.warn('Could not sync wishlist with backend, using local state:', err?.message || err)
        setWishlist(localItems)
      }
    }

    syncWithBackend()
  }, [user?._id, isAuthenticated])

  // toggleWishlist: Saves/removes item and synchronizes to MongoDB
  const toggleWishlist = async (tourId, customNavigate) => {
    if (!isAuthenticated || !user) {
      if (customNavigate) {
        customNavigate('/login')
      } else {
        window.location.href = '/login'
      }
      return false
    }

    const key = getUserKey()
    const nextList = wishlist.includes(tourId)
      ? wishlist.filter((id) => id !== tourId)
      : [...wishlist, tourId]

    // Optimistic UI update
    setWishlist(nextList)
    if (key) {
      try {
        localStorage.setItem(`tt_wishlist_${key}`, JSON.stringify(nextList))
      } catch (err) {
        console.warn('Local storage error:', err)
      }
    }

    // Persist to MongoDB database
    try {
      const res = await api.post('/users/wishlist/toggle', { tourId })
      if (res.data?.success && Array.isArray(res.data.data)) {
        setWishlist(res.data.data)
        if (key) localStorage.setItem(`tt_wishlist_${key}`, JSON.stringify(res.data.data))
      }
    } catch (err) {
      console.error('Failed to sync wishlist toggle to database:', err?.message || err)
    }

    return true
  }

  const clearWishlist = async () => {
    const key = getUserKey()
    if (key) {
      localStorage.removeItem(`tt_wishlist_${key}`)
    }
    setWishlist([])
  }

  const isInWishlist = (tourId) => wishlist.includes(tourId)

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider')
  return context
}

export default WishlistContext
