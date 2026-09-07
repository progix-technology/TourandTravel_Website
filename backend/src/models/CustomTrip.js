import mongoose from 'mongoose'

const CustomTripSchema = new mongoose.Schema(
  {
    inquiryReference: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    // Journey Preferences
    fromLocation: {
      type: String,
      default: 'Lucknow, Uttar Pradesh, India',
    },
    departure: {
      type: String,
    },
    toDestinations: [
      {
        type: String,
      },
    ],
    destination: {
      type: String,
    },
    tripPace: {
      type: String,
      default: 'Balanced (Cultural Immersion & Rest)',
    },
    startDate: {
      type: String,
    },
    travelDate: {
      type: String,
    },
    duration: {
      type: String,
      default: '6–8 Days',
    },
    approxDurationDays: {
      type: Number,
      default: 7,
    },
    travelers: {
      type: Number,
      default: 2,
    },
    travellers: {
      adults: { type: Number, default: 2 },
      children: { type: Number, default: 0 },
      infants: { type: Number, default: 0 },
    },
    budgetTier: {
      type: String,
      default: 'Signature Luxury',
    },
    quoteAmount: {
      type: Number,
      default: 0,
    },
    accommodationStyle: [
      {
        type: String,
      },
    ],
    travelMode: {
      type: String,
      default: 'Flight',
    },
    transport: {
      type: String,
      default: 'Private Chauffeur & Domestic Flights',
    },
    curatedActivities: [
      {
        type: String,
      },
    ],
    curatedItinerary: {
      type: String,
      default: '',
    },
    // Traveler Details
    name: String,
    email: String,
    phone: String,
    specialRequests: String,
    contactInfo: {
      fullName: String,
      email: String,
      phone: String,
      preferredContact: String,
      bestTimeToCall: String,
      notes: String,
    },
    status: {
      type: String,
      enum: [
        'New',
        'Pending Concierge Review',
        'Curating Itinerary',
        'Quotation Sent',
        'Quote Sent',
        'Confirmed',
        'Closed',
        'Cancelled',
      ],
      default: 'Pending Concierge Review',
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('CustomTrip', CustomTripSchema)
