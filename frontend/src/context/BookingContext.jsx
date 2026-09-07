import React, { createContext, useContext, useState, useEffect } from 'react'
import bookingService from '../services/bookingService'
import { useAuth } from './AuthContext'

const BookingContext = createContext()

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([])
  const [activeBooking, setActiveBooking] = useState(null)
  const [loading, setLoading] = useState(false)

  const loadBookings = async () => {
    setLoading(true)
    try {
      const data = await bookingService.getUserBookings()
      setBookings(Array.isArray(data) ? data : [])
    } catch (err) {
      console.warn('Error loading bookings:', err)
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      loadBookings()
    } else {
      setBookings([])
    }
  }, [isAuthenticated])

  const startBooking = (tour, options = {}) => {
    setActiveBooking({
      tourId: tour.id || tour.slug,
      tourTitle: tour.title,
      destination: tour.destination,
      duration: tour.duration,
      startingPrice: tour.startingPrice || tour.price,
      image: tour.image,
      travelers: options.travelers || 1,
      travelDate: options.travelDate || '',
      addons: options.addons || [],
      totalPrice: (tour.startingPrice || tour.price || 1490) * (options.travelers || 1),
    })
  }

  const completeBooking = async (details) => {
    const bookingPayload = {
      ...activeBooking,
      ...details,
      totalPrice:
        details.totalPrice ||
        ((activeBooking?.startingPrice || 1000) * (details.travelers || activeBooking?.travelers || 1) +
          (details.addons?.reduce((sum, a) => sum + Number(a.price || 0), 0) || 0)),
    }
    const created = await bookingService.createBooking(bookingPayload)
    if (created) {
      setBookings((prev) => (Array.isArray(prev) ? [created, ...prev] : [created]))
    }
    setActiveBooking(null)
    return created
  }

  const cancelBooking = async (id) => {
    await bookingService.cancelBooking(id)
    setBookings((prev) =>
      Array.isArray(prev)
        ? prev.map((b) => (b.id === id || b._id === id ? { ...b, status: 'Cancelled' } : b))
        : []
    )
  }

  return (
    <BookingContext.Provider
      value={{
        bookings,
        activeBooking,
        startBooking,
        completeBooking,
        cancelBooking,
        loadBookings,
        loading,
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export const useBooking = () => {
  const context = useContext(BookingContext)
  if (!context) throw new Error('useBooking must be used within a BookingProvider')
  return context
}
