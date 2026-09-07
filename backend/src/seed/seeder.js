import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User.js'
import Tour from '../models/Tour.js'
import Destination from '../models/Destination.js'

dotenv.config()

const SEED_DESTINATIONS = [
  {
    slug: 'kashmir',
    title: 'Kashmir',
    country: 'India',
    region: 'Asia',
    category: 'Alpine Valleys',
    rating: 4.9,
    startingPrice: 24999,
    duration: '7 Days',
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=85',
    description: 'Immerse yourself in alpine valleys, pristine Dal Lake shikara rides, snow-capped Himalayan peaks, and serene pine forests.',
    highlights: ['Gulmarg Gondola Ride', 'Dal Lake Houseboat Stay', 'Pahalgam Valley Trek', 'Sonamarg Glaciers'],
    bestTimeToVisit: 'April to October',
    isPopular: true,
  },
  {
    slug: 'maldives',
    title: 'Maldives',
    country: 'Maldives',
    region: 'Islands',
    category: 'Tropical Luxury',
    rating: 5.0,
    startingPrice: 84999,
    duration: '6 Days',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1400&q=85',
    description: 'Private overwater bungalows, crystal clear lagoons, bioluminescent beaches, and unmatched underwater marine life.',
    highlights: ['Private Overwater Villa', 'Manta Ray & Whale Shark Diving', 'Sunset Yacht Cruise', 'Sandbank Picnics'],
    bestTimeToVisit: 'November to April',
    isPopular: true,
  },
  {
    slug: 'bali',
    title: 'Bali',
    country: 'Indonesia',
    region: 'Islands',
    category: 'Island Sanctuary',
    rating: 4.9,
    startingPrice: 38999,
    duration: '7 Days',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=85',
    description: 'Ancient cliffside temples, sacred emerald rice terraces in Ubud, volcanic sunrises, and spiritual wellness sanctuaries.',
    highlights: ['Ubud Jungle Retreat', 'Mount Batur Sunrise Trek', 'Uluwatu Sunset Temple', 'Nusa Penida Expedition'],
    bestTimeToVisit: 'May to September',
    isPopular: true,
  },
  {
    slug: 'switzerland',
    title: 'Swiss Alps',
    country: 'Switzerland',
    region: 'Europe',
    category: 'Alpine Grandeur',
    rating: 5.0,
    startingPrice: 149999,
    duration: '8 Days',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=85',
    description: 'Panoramic Glacier Express luxury trains, soaring Matterhorn vistas, crystal clear alpine lakes, and world-class fondue chalets.',
    highlights: ['Glacier Express First-Class', 'Jungfraujoch Top of Europe', 'Zermatt Matterhorn Chalet', 'Lake Geneva Wine Tasting'],
    bestTimeToVisit: 'June to Sept (Summer) / Dec to March (Skiing)',
    isPopular: true,
  },
  {
    slug: 'dubai',
    title: 'Dubai',
    country: 'United Arab Emirates',
    region: 'Middle East',
    category: 'Futuristic Luxury',
    rating: 4.9,
    startingPrice: 42999,
    duration: '5 Days',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85',
    description: 'Ultra-luxurious desert safari camps, private superyacht charters around Palm Jumeirah, Michelin dining, and Burj Khalifa vistas.',
    highlights: ['Private Desert Dunes Glamping', 'Superyacht Sunset Cruise', 'Burj Khalifa VIP Lounge', 'Helicopter Sky Tour'],
    bestTimeToVisit: 'November to March',
    isPopular: true,
  },
]

const SEED_TOURS = [
  {
    slug: 'kashmir-escape',
    title: 'Kashmir Alpine Sanctuary & Dal Lake Serenity',
    tagline: 'Paradise Found Amidst Snow-Capped Pines & Floating Palaces',
    destination: 'Kashmir, India',
    country: 'India',
    duration: '7 Days / 6 Nights',
    days: 7,
    nights: 6,
    price: 28999,
    startingPrice: 28999,
    rating: 4.9,
    reviewsCount: 142,
    category: 'india',
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=85',
    overview: 'Experience the magic of Kashmir with hand-carved heritage cedar houseboats, private Shikara sunset serenades on Dal Lake, high-altitude Gulmarg gondola rides, and horse treks across Pahalgam valley.',
    highlights: ['5-Star Luxury Dal Lake Houseboat with Private Butler', 'VIP Gulmarg Phase-2 Gondola Pass', 'Aru & Betab Valley Private 4x4 Excursion', 'Traditional Wazwan Royal Feast Dinner'],
    isFeatured: true,
  },
  {
    slug: 'maldives-retreat',
    title: 'Maldives Overwater Lagoon & Private Reef Sanctuary',
    tagline: 'Untouched Turquoise Horizons & 5-Star Oceanfront Serenity',
    destination: 'Maldives',
    country: 'Maldives',
    duration: '6 Days / 5 Nights',
    days: 6,
    nights: 5,
    price: 89499,
    startingPrice: 89499,
    rating: 5.0,
    reviewsCount: 198,
    category: 'beach',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1400&q=85',
    overview: 'Step into a world of pure azure bliss. Your private overwater bungalow features a glass floor viewing marine life, infinity plunge pool, seaplane transfers from Malé, and nightly stargazing.',
    highlights: ['Private Seaplane Transfers', 'Floating Champagne Breakfast in Villa Pool', 'Manta Ray & Turtle Snorkeling Excursion', 'Sunset Dolphin Yacht Cruise'],
    isFeatured: true,
  },
  {
    slug: 'swiss-alps-grandeur',
    title: 'Swiss Alps Glacier Express & Alpine Chalet Odyssey',
    tagline: 'Pinnacles of Pure Luxury & First-Class Mountain Rail',
    destination: 'Switzerland',
    country: 'Switzerland',
    duration: '8 Days / 7 Nights',
    days: 8,
    nights: 7,
    price: 154999,
    startingPrice: 154999,
    rating: 5.0,
    reviewsCount: 112,
    category: 'luxury',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=85',
    overview: 'Glide through snowfields on the world-famous Glacier Express excellence class. Sleep in panoramic 5-star mountain chalets with direct Matterhorn views and enjoy private sommelier wine tastings.',
    highlights: ['Glacier Express Excellence Class Carriage', 'Jungfraujoch Private Summit Guide', 'Matterhorn View Penthouse Chalet', 'Lake Lucerne Private Yacht Cruise'],
    isFeatured: true,
  },
]

import Admin from '../models/Admin.js'

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tours_and_travellers'
    await mongoose.connect(mongoUri)
    console.log('🌱 Connected to MongoDB for seeding...')

    // Clear existing data
    await Destination.deleteMany()
    await Tour.deleteMany()
    await User.deleteMany()
    await Admin.deleteMany()

    console.log('🧹 Cleared existing database records')

    // Create Admin User
    const adminUser = await Admin.create({
      name: 'Vivang Mishra',
      email: 'info@progixtechnology.com',
      password: 'Password@2026',
      membership: 'VIP Sovereign',
      phone: '+91 89532 08952',
    })
    console.log(`👤 Seeded Admin User: ${adminUser.email}`)

    // Create Standard User
    const standardUser = await User.create({
      name: 'Test Explorer',
      email: 'user@example.com',
      password: 'Password@2026',
      role: 'user',
      membership: 'Voyager Member',
      phone: '+91 98765 43210',
    })
    console.log(`👤 Seeded Standard User: ${standardUser.email}`)

    // Seed Destinations
    const destinations = await Destination.insertMany(SEED_DESTINATIONS)
    console.log(`🌍 Seeded ${destinations.length} Destinations`)

    // Seed Tours
    const tours = await Tour.insertMany(SEED_TOURS)
    console.log(`✈️ Seeded ${tours.length} Signature Tours`)

    console.log('\n🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!\n')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding Error:', error)
    process.exit(1)
  }
}

seedDatabase()
