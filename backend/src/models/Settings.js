import mongoose from 'mongoose'

const SettingsSchema = new mongoose.Schema(
  {
    // General Settings
    inquiryPhone: { type: String, default: '+91 89532 08952' },
    whatsappNumber: { type: String, default: '+91 89532 08952' },
    supportEmail: { type: String, default: 'info@progixtechnology.com' },
    emergencyHelpline: { type: String, default: '+91 89532 08952' },
    officeAddress: { type: String, default: 'D72, Vibhuti Khand, Gomtinagar, Lucknow, UP - 226010' },
    googleMapUrl: { type: String, default: 'https://maps.google.com/?q=Vibhuti+Khand+Gomti+Nagar+Lucknow' },
    announcementText: { type: String, default: '✨ Seasonal Privilege: Flat 15% OFF on European & Himalayan Journeys — Code: LUXE15' },
    showAnnouncement: { type: Boolean, default: true },
    conciergeHours: { type: String, default: 'Mon – Sun: 24/7 Dedicated Private Concierge Desk' },

    // Booking Settings
    advanceDepositPct: { type: Number, default: 20 },
    gstTaxRate: { type: Number, default: 5 },
    cancellationHours: { type: Number, default: 48 },
    autoConfirmBookings: { type: Boolean, default: true },
    emailAlertsOnBooking: { type: Boolean, default: true },

    // 💳 RAZORPAY PAYMENT GATEWAY SETTINGS (Configurable by Admin)
    razorpayEnabled: { type: Boolean, default: true },
    razorpayKeyId: { type: String, default: process.env.RAZORPAY_KEY_ID || 'rzp_test_YourKeyHere' },
    razorpayKeySecret: { type: String, default: process.env.RAZORPAY_KEY_SECRET || '' },
    razorpayWebhookSecret: { type: String, default: process.env.RAZORPAY_WEBHOOK_SECRET || '' },
    currency: { type: String, default: 'INR' },
  },
  { timestamps: true }
)

export default mongoose.model('Settings', SettingsSchema)

