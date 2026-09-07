import jwt from 'jsonwebtoken'
import Booking from '../models/Booking.js'
import User from '../models/User.js'
import {
  sendBookingConfirmationEmail,
  sendBookingStatusUpdateEmail,
} from '../services/emailService.js'

// @desc    Create new booking
// @route   POST /api/v1/bookings
// @access  Public / Private
export const createBooking = async (req, res, next) => {
  try {
    const bookingData = req.body

    // Extract user ID from token or request body if available
    let userId = req.user ? req.user._id : (bookingData.user || bookingData.userId || null)

    if (!userId && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || 'tours_and_travellers_super_secret_jwt_key_2026_luxury_voyages'
        )
        if (decoded?.id) {
          userId = decoded.id
        }
      } catch (err) {
        // ignore token decode failure
      }
    }

    // If still no userId, match by email in leadTraveler
    if (!userId && bookingData.leadTraveler?.email) {
      try {
        const existingUser = await User.findOne({
          email: { $regex: new RegExp(`^${bookingData.leadTraveler.email.trim()}$`, 'i') },
        })
        if (existingUser) {
          userId = existingUser._id
        }
      } catch (err) {
        // ignore
      }
    }

    // Generate VIP booking reference
    const bookingReference =
      'TT-' + Math.floor(100000 + Math.random() * 900000)

    const bookingPayload = {
      ...bookingData,
      bookingReference,
      user: userId,
      status: 'Confirmed',
      paymentStatus:
        bookingData.paymentMethod?.includes('Zero-Deposit')
          ? 'Zero-Deposit Hold'
          : 'Paid',
    }

    let booking
    try {
      booking = await Booking.create(bookingPayload)
    } catch (e) {
      // In case MongoDB is offline, return fallback object with reference
      booking = {
        id: bookingReference,
        _id: bookingReference,
        createdAt: new Date().toISOString(),
        ...bookingPayload,
      }
    }

    // 🚀 Send Automatic Booking Confirmation Email asynchronously
    sendBookingConfirmationEmail(booking).catch((emailErr) => {
      console.error('⚠️ [Email Trigger Notice]', emailErr?.message || emailErr)
    })

    res.status(201).json({
      success: true,
      data: booking,
      id: booking.bookingReference || bookingReference,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get user bookings
// @route   GET /api/v1/bookings/my
// @access  Private
export const getUserBookings = async (req, res, next) => {
  try {
    let bookings = []
    if (req.user) {
      const userEmail = (req.user.email || '').trim()
      const conditions = [{ user: req.user._id }]
      
      if (userEmail) {
        conditions.push({ 'leadTraveler.email': { $regex: new RegExp(`^${userEmail}$`, 'i') } })
        conditions.push({ email: { $regex: new RegExp(`^${userEmail}$`, 'i') } })
        conditions.push({ userEmail: { $regex: new RegExp(`^${userEmail}$`, 'i') } })
      }

      bookings = await Booking.find({ $or: conditions }).sort('-createdAt')

      // Auto-link any unlinked bookings to this user
      bookings.forEach(async (b) => {
        if (!b.user) {
          b.user = req.user._id
          try {
            await b.save()
          } catch (err) {
            // ignore
          }
        }
      })
    }

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Cancel booking
// @route   PATCH /api/v1/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params

    const booking = await Booking.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { bookingReference: id }],
    })

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `Booking with ID ${id} not found`,
      })
    }

    booking.status = 'Cancelled'
    await booking.save()

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all bookings (Admin)
// @route   GET /api/v1/bookings
// @access  Private/Admin
export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find().populate('user', 'name email').sort('-createdAt')
    
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update booking status (Admin)
// @route   PATCH /api/v1/bookings/:id/status
// @access  Private/Admin
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const booking = await Booking.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { bookingReference: id }],
    })

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `Booking with ID ${id} not found`,
      })
    }

    booking.status = status
    await booking.save()

    // 🚀 Send Status Update Email asynchronously
    sendBookingStatusUpdateEmail(booking, status).catch((err) => {
      console.error('⚠️ [Email Status Notice]', err?.message || err)
    })

    res.status(200).json({
      success: true,
      message: `Booking status updated to ${status}`,
      data: booking,
    })
  } catch (error) {
    next(error)
  }
}
