import mongoose from 'mongoose'

const BookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    tourId: {
      type: String,
      required: true,
    },
    tourTitle: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    travelDate: {
      type: String,
      required: true,
    },
    travelers: {
      type: Number,
      default: 2,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Pending Concierge Review', 'Cancelled', 'Completed'],
      default: 'Confirmed',
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Pending', 'Zero-Deposit Hold'],
      default: 'Paid',
    },
    paymentMethod: {
      type: String,
      default: 'Credit Card (Stripe Encrypted)',
    },
    departureCity: {
      type: String,
      default: 'Lucknow, Uttar Pradesh',
    },
    pickupLocation: {
      type: String,
      default: '',
    },
    travelMode: {
      type: String,
      default: 'Flight (Airplane)',
    },
    transitDetails: {
      type: String,
      default: '',
    },
    isTatkaal: {
      type: Boolean,
      default: false,
    },
    leadTraveler: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      nationality: String,
      idNumber: String,
      ageGroup: String,
    },
    logistics: {
      departureCity: String,
      pickupLocation: String,
      travelMode: String,
      transitDetails: String,
      departureDate: String,
      isTatkaal: Boolean,
      tatkaalUrgency: String,
      roomPreference: String,
      airportTransfer: String,
      flightNumber: String,
    },
    preferences: {
      dietary: String,
      occasion: String,
      specialNotes: String,
      emergencyName: String,
      emergencyPhone: String,
    },
    addons: [
      {
        id: String,
        name: String,
        price: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Booking', BookingSchema)
