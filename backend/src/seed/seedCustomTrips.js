import mongoose from 'mongoose'
import dotenv from 'dotenv'
import CustomTrip from '../models/CustomTrip.js'

dotenv.config()

const SEED_CUSTOM_PACKAGES = [
  {
    inquiryReference: 'CT-849201',
    fromLocation: 'New Delhi (DEL)',
    toDestinations: ['Kashmir (Srinagar)', 'Pahalgam', 'Gulmarg'],
    tripPace: 'Relaxed & Scenic (Alpine Retreat)',
    startDate: '2026-10-15',
    endDate: '2026-10-23',
    isFlexibleDates: true,
    approxDurationDays: 8,
    travellers: { adults: 2, children: 1, infants: 0 },
    budgetTier: 'Signature Luxury (₹2.5L - ₹4L)',
    budgetEstimatedINR: 285000,
    accommodationStyle: ['5-Star Luxury Cedar Chalet', 'Heritage Houseboat Suite'],
    transport: 'Private Luxury 4x4 SUV & Gondola Passes',
    curatedActivities: [
      'Gulmarg Gondola Phase 2 Summit Tour',
      'Private Dal Lake Shikara with live saffron tea',
      'Pahalgam Pine Valley Horseback Trail'
    ],
    contactInfo: {
      fullName: 'Vikram Malhotra',
      email: 'vikram.malhotra@gmail.com',
      phone: '+91 98112 34567',
      preferredContact: 'WhatsApp',
      bestTimeToCall: 'Evenings (6 PM - 9 PM)',
      notes: 'Anniversary celebration. Please arrange private candlelight dinner on Dal lake.'
    },
    status: 'Confirmed'
  },
  {
    inquiryReference: 'CT-923841',
    fromLocation: 'Mumbai (BOM)',
    toDestinations: ['Swiss Alps (Zermatt)', 'Zurich', 'Paris'],
    tripPace: 'Balanced (Alpine Wonder & Gastronomy)',
    startDate: '2026-11-04',
    endDate: '2026-11-16',
    isFlexibleDates: false,
    approxDurationDays: 12,
    travellers: { adults: 2, children: 0, infants: 0 },
    budgetTier: 'Ultra Sovereign (₹6L+)',
    budgetEstimatedINR: 640000,
    accommodationStyle: ['Matterhorn View Penthouse Chalet', 'Paris 5-Star Boutique Hotel'],
    transport: 'Glacier Express Excellence Class & Private Chauffeur',
    curatedActivities: [
      'Private Sommelier Wine Tasting in St. Moritz',
      'Seine River Private Sunset Yacht Cruise',
      'After-Hours VIP Louvre Museum Tour'
    ],
    contactInfo: {
      fullName: 'Aanya Singhania',
      email: 'aanya.singhania@luxurycorp.in',
      phone: '+91 98200 89123',
      preferredContact: 'Phone Call',
      bestTimeToCall: 'Afternoons (2 PM - 5 PM)',
      notes: 'Honeymoon couple. Requesting best panoramic room facing Matterhorn.'
    },
    status: 'In Review by Concierge'
  },
  {
    inquiryReference: 'CT-410582',
    fromLocation: 'Bengaluru (BLR)',
    toDestinations: ['Maldives (Baa Atoll)'],
    tripPace: 'Secluded Luxury & Underwater Safari',
    startDate: '2026-12-20',
    endDate: '2026-12-27',
    isFlexibleDates: true,
    approxDurationDays: 7,
    travellers: { adults: 2, children: 2, infants: 0 },
    budgetTier: 'Signature Luxury (₹4L - ₹6L)',
    budgetEstimatedINR: 490000,
    accommodationStyle: ['2-Bedroom Overwater Sunset Pool Villa'],
    transport: 'Roundtrip Scenic Seaplane Transfers',
    curatedActivities: [
      'Manta Ray & Whale Shark Snorkeling with Marine Biologist',
      'Private Sandbank Robinson Crusoe BBQ Lunch',
      'Couples Overwater Holistic Ayurveda Spa'
    ],
    contactInfo: {
      fullName: 'Rajesh & Meera Rao',
      email: 'rajesh.rao@techindia.com',
      phone: '+91 99001 77654',
      preferredContact: 'WhatsApp',
      bestTimeToCall: 'Anytime',
      notes: 'Christmas holidays family trip. Kids enjoy water sports.'
    },
    status: 'Quotation Sent'
  },
  {
    inquiryReference: 'CT-682194',
    fromLocation: 'Hyderabad (HYD)',
    toDestinations: ['Udaipur', 'Jodhpur', 'Jaisalmer (Thar Desert)'],
    tripPace: 'Royal Heritage & Desert Glamping',
    startDate: '2026-10-28',
    endDate: '2026-11-05',
    isFlexibleDates: true,
    approxDurationDays: 9,
    travellers: { adults: 6, children: 0, infants: 0 },
    budgetTier: 'Signature Luxury (₹2L - ₹3.5L)',
    budgetEstimatedINR: 275000,
    accommodationStyle: ['Taj Lake Palace Udaipur', 'Luxury Silk Tented Glamping'],
    transport: 'Mercedes-Benz V-Class Private Chauffeur',
    curatedActivities: [
      'Lake Pichola Private Royal Solar Boat Cruise',
      'Thar Desert Camel Safari & Starlit Folk Music Feast',
      'Mehrangarh Fort Clifftop Dinner'
    ],
    contactInfo: {
      fullName: 'Col. Devendra Rathore',
      email: 'devendra.rathore@heritage.org',
      phone: '+91 94140 12890',
      preferredContact: 'Phone Call',
      bestTimeToCall: 'Mornings (10 AM - 12 PM)',
      notes: 'Family reunion group of 6 adults. Prefer royal Rajput cuisine.'
    },
    status: 'New'
  },
  {
    inquiryReference: 'CT-357912',
    fromLocation: 'Chennai (MAA)',
    toDestinations: ['Bali (Ubud & Uluwatu)', 'Nusa Penida'],
    tripPace: 'Wellness & Island Adventure',
    startDate: '2026-11-12',
    endDate: '2026-11-20',
    isFlexibleDates: false,
    approxDurationDays: 8,
    travellers: { adults: 2, children: 0, infants: 0 },
    budgetTier: 'Comfort Luxury (₹1.5L - ₹2.5L)',
    budgetEstimatedINR: 195000,
    accommodationStyle: ['Jungle Infinity Pool Villa in Ubud', 'Uluwatu Cliff Resort'],
    transport: 'Private Dedicated Chauffeur SUV',
    curatedActivities: [
      'Mount Batur Sunrise Trek with Breakfast',
      'Uluwatu Clifftop Sunset & Kecak Fire Dance',
      'Nusa Penida Diamond Beach Private Day Yacht'
    ],
    contactInfo: {
      fullName: 'Siddharth V.',
      email: 'siddharth.v@gmail.com',
      phone: '+91 97909 65432',
      preferredContact: 'WhatsApp',
      bestTimeToCall: 'Evenings (7 PM - 10 PM)',
      notes: 'Need vegan food options and private yoga session in Ubud.'
    },
    status: 'Confirmed'
  }
]

const seedCustomTrips = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tours_and_travellers'
    await mongoose.connect(mongoUri)
    console.log('🌱 Connected to MongoDB for Custom Packages seeding...')

    await CustomTrip.deleteMany({})
    console.log('🧹 Cleared existing custom trips collection.')

    const inserted = await CustomTrip.insertMany(SEED_CUSTOM_PACKAGES)
    console.log(`✅ Successfully seeded ${inserted.length} custom packages into MongoDB!`)

    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding Error:', error)
    process.exit(1)
  }
}

seedCustomTrips()
