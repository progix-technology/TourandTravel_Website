import ContactMessage from '../models/ContactMessage.js'
import CustomTrip from '../models/CustomTrip.js'

// @desc    Submit contact message
// @route   POST /api/v1/contact
// @access  Public
export const submitContactMessage = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body

    let contact
    try {
      contact = await ContactMessage.create({
        name,
        email,
        phone,
        subject,
        message,
      })
    } catch (e) {
      contact = {
        name,
        email,
        phone,
        subject,
        message,
        createdAt: new Date().toISOString(),
      }
    }

    res.status(201).json({
      success: true,
      message: 'Message delivered to VIP Concierge desk! We will reply promptly.',
      data: contact,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all enquiries (Contact Messages + Custom Trip Inquiries)
// @route   GET /api/v1/contact
// @access  Private/Admin
export const getAllEnquiries = async (req, res, next) => {
  try {
    const [contacts, customTrips] = await Promise.all([
      ContactMessage.find().sort('-createdAt').lean(),
      CustomTrip.find().sort('-createdAt').lean()
    ])

    const normalizedContacts = contacts.map(c => ({
      _id: c._id,
      name: c.name || 'Guest Traveler',
      email: c.email || '',
      phone: c.phone || '',
      subject: c.subject || 'General Expedition Query',
      message: c.message || '',
      type: 'Contact Inquiry',
      inquiryType: 'contact',
      status: c.status === 'Resolved' ? 'Resolved' : c.status === 'In Progress' ? 'In Progress' : 'Pending',
      createdAt: c.createdAt,
      source: 'Contact Form'
    }))

    const normalizedCustomTrips = customTrips.map(ct => {
      const destStr = Array.isArray(ct.toDestinations) ? ct.toDestinations.join(', ') : (ct.destination || 'Bespoke Tour')
      const name = ct.contactInfo?.fullName || ct.fullName || ct.name || 'VIP Traveler'
      const email = ct.contactInfo?.email || ct.email || ''
      const phone = ct.contactInfo?.phone || ct.phone || ''
      const notes = ct.contactInfo?.notes || ct.notes || `From: ${ct.fromLocation || 'N/A'} | Days: ${ct.approxDurationDays || 7} | Adults: ${ct.travellers?.adults || 2}`
      
      return {
        _id: ct._id,
        name,
        email,
        phone,
        subject: `Custom Trip: ${destStr} (${ct.budgetTier || 'Signature Luxury'})`,
        message: notes,
        destination: destStr,
        fromLocation: ct.fromLocation,
        duration: ct.approxDurationDays,
        travellers: ct.travellers,
        budget: ct.budgetTier,
        type: 'Bespoke Trip Inquiry',
        inquiryType: 'custom_trip',
        status: ct.status === 'Confirmed' || ct.status === 'Closed' ? 'Resolved' : 
                ct.status === 'In Review by Concierge' || ct.status === 'Quotation Sent' ? 'In Progress' : 'Pending',
        rawStatus: ct.status,
        createdAt: ct.createdAt,
        source: 'Custom Trip Planner'
      }
    })

    const allEnquiries = [...normalizedContacts, ...normalizedCustomTrips].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    
    res.status(200).json({
      success: true,
      count: allEnquiries.length,
      data: allEnquiries
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update enquiry status (Admin)
// @route   PATCH /api/v1/contact/:id/status
// @access  Private/Admin
export const updateEnquiryStatus = async (req, res, next) => {
  try {
    const { id } = req.params
    const { status } = req.body

    // Check in ContactMessage first
    let enquiry = await ContactMessage.findById(id)
    if (enquiry) {
      enquiry.status = status
      await enquiry.save()
      return res.status(200).json({
        success: true,
        data: enquiry
      })
    }

    // Check in CustomTrip
    let customTrip = await CustomTrip.findById(id)
    if (customTrip) {
      const customStatusMap = {
        'Pending': 'New',
        'In Progress': 'In Review by Concierge',
        'Resolved': 'Confirmed'
      }
      customTrip.status = customStatusMap[status] || status
      await customTrip.save()
      return res.status(200).json({
        success: true,
        data: customTrip
      })
    }

    return res.status(404).json({
      success: false,
      message: 'Enquiry not found'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete enquiry (Admin)
// @route   DELETE /api/v1/contact/:id
// @access  Private/Admin
export const deleteEnquiry = async (req, res, next) => {
  try {
    const { id } = req.params

    const contact = await ContactMessage.findById(id)
    if (contact) {
      await ContactMessage.findByIdAndDelete(id)
      return res.status(200).json({ success: true, data: {} })
    }

    const trip = await CustomTrip.findById(id)
    if (trip) {
      await CustomTrip.findByIdAndDelete(id)
      return res.status(200).json({ success: true, data: {} })
    }

    return res.status(404).json({
      success: false,
      message: 'Enquiry not found'
    })
  } catch (error) {
    next(error)
  }
}
