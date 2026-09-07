import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Destination from '../models/Destination.js'
import { DESTINATIONS } from './mockData.js'

dotenv.config()

const seedDestinations = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tours_and_travellers'
    await mongoose.connect(mongoUri)
    console.log('🌱 Connected to MongoDB for seeding destinations...')

    // Clear existing destinations
    await Destination.deleteMany()
    console.log('🧹 Cleared existing destinations')

    const mappedDestinations = DESTINATIONS.map(d => ({
      slug: d.slug,
      title: d.name,
      country: d.country,
      region: d.region,
      category: d.tagline,
      rating: d.rating,
      reviewsCount: d.toursCount, // map toursCount to reviewsCount as a placeholder
      image: d.image,
      startingPrice: d.startingPrice,
      duration: '7 Days',
      description: d.description,
      highlights: d.highlights,
      bestTimeToVisit: d.bestTime,
      isPopular: d.rating >= 4.9
    }))

    const destinations = await Destination.insertMany(mappedDestinations)
    console.log(`🌍 Seeded ${destinations.length} Destinations from mockData`)

    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding Error:', error)
    process.exit(1)
  }
}

seedDestinations()
