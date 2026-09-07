import CustomTrip from '../models/CustomTrip.js'

// @desc    Submit custom trip inquiry
// @route   POST /api/v1/custom-trips
// @access  Public
export const submitCustomTrip = async (req, res, next) => {
  try {
    const tripData = req.body
    const inquiryReference = 'CT-' + Math.floor(100000 + Math.random() * 900000)

    const fromLocation = tripData.departure || tripData.fromLocation || 'Lucknow, Uttar Pradesh, India'
    const destination = tripData.destination || (Array.isArray(tripData.toDestinations) ? tripData.toDestinations[0] : 'Luxury Sanctuary')
    const toDestinations = Array.isArray(tripData.toDestinations) && tripData.toDestinations.length > 0 ? tripData.toDestinations : [destination]
    const contactInfo = {
      fullName: tripData.name || tripData.contactInfo?.fullName || 'Valued Explorer',
      email: tripData.email || tripData.contactInfo?.email || '',
      phone: tripData.phone || tripData.contactInfo?.phone || '',
      notes: tripData.specialRequests || tripData.contactInfo?.notes || '',
    }

    const newTrip = await CustomTrip.create({
      inquiryReference,
      user: req.user ? req.user._id : null,
      departure: fromLocation,
      fromLocation,
      destination,
      toDestinations,
      duration: tripData.duration || '6–8 Days',
      approxDurationDays: tripData.approxDurationDays || 7,
      travelers: tripData.travelers || tripData.travellers?.adults || 2,
      travellers: {
        adults: tripData.travelers || tripData.travellers?.adults || 2,
        children: tripData.travellers?.children || 0,
        infants: tripData.travellers?.infants || 0,
      },
      travelMode: tripData.travelMode || 'Flight',
      transport: tripData.transport || tripData.travelMode || 'Flight',
      travelDate: tripData.travelDate || tripData.startDate || 'Flexible / Next 30 Days',
      startDate: tripData.travelDate || tripData.startDate,
      specialRequests: tripData.specialRequests || '',
      name: contactInfo.fullName,
      email: contactInfo.email,
      phone: contactInfo.phone,
      contactInfo,
      status: 'Pending Concierge Review',
    })

    res.status(201).json({
      success: true,
      message: 'Custom trip inquiry received! A Senior Travel Curator will reach out within 2 hours.',
      inquiryReference,
      data: newTrip,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get custom trips (for admin or user)
// @route   GET /api/v1/custom-trips
// @access  Private
export const getCustomTrips = async (req, res, next) => {
  try {
    let trips = []
    if (req.user && req.user.role === 'admin') {
      trips = await CustomTrip.find().sort('-createdAt')
    } else if (req.user) {
      const userEmail = (req.user.email || '').trim()
      const conditions = [{ user: req.user._id }]
      if (userEmail) {
        conditions.push({ email: { $regex: new RegExp(`^${userEmail}$`, 'i') } })
        conditions.push({ 'contactInfo.email': { $regex: new RegExp(`^${userEmail}$`, 'i') } })
      }
      trips = await CustomTrip.find({ $or: conditions }).sort('-createdAt')
    }
    res.status(200).json({
      success: true,
      count: trips.length,
      data: trips,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update custom trip details (Admin)
// @route   PUT /api/v1/custom-trips/:id
// @access  Private/Admin
export const updateCustomTrip = async (req, res, next) => {
  try {
    const { id } = req.params
    const isObjectId = id && typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id)
    const trip = await CustomTrip.findOne({
      $or: [
        { _id: isObjectId ? id : null },
        { inquiryReference: id },
      ],
    })

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: `Custom trip not found`,
      })
    }

    Object.assign(trip, req.body)
    await trip.save()

    res.status(200).json({
      success: true,
      message: 'Custom trip updated successfully',
      data: trip,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update custom trip status (Admin)
// @route   PATCH /api/v1/custom-trips/:id/status
// @access  Private/Admin
export const updateCustomTripStatus = async (req, res, next) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const isObjectId = id && typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id)
    const trip = await CustomTrip.findOne({
      $or: [
        { _id: isObjectId ? id : null },
        { inquiryReference: id },
      ],
    })

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: `Custom trip with ID ${id} not found`,
      })
    }

    trip.status = status
    await trip.save()

    res.status(200).json({
      success: true,
      message: `Status updated to ${status}`,
      data: trip,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete custom trip (Admin)
// @route   DELETE /api/v1/custom-trips/:id
// @access  Private/Admin
export const deleteCustomTrip = async (req, res, next) => {
  try {
    const { id } = req.params
    const isObjectId = id && typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id)
    const trip = await CustomTrip.findOne({
      $or: [
        { _id: isObjectId ? id : null },
        { inquiryReference: id },
      ],
    })

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: `Custom trip not found`,
      })
    }

    await CustomTrip.findByIdAndDelete(trip._id)

    res.status(200).json({
      success: true,
      message: 'Custom trip deleted successfully',
      data: {},
    })
  } catch (error) {
    next(error)
  }
}
