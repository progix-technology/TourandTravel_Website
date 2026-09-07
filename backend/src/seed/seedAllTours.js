import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Tour from '../models/Tour.js'
import { TOURS } from './mockData.js'

dotenv.config()

const seedTours = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tours_and_travellers'
    await mongoose.connect(mongoUri)
    console.log('🌱 Connected to MongoDB...')

    // Clear and re-populate Tours
    await Tour.deleteMany({})
    console.log('🧹 Cleared existing tours collection.')

    const formattedTours = TOURS.map((t) => ({
      slug: t.slug || t.id,
      title: t.title,
      subtitle: t.subtitle || t.tagline || '',
      tagline: t.tagline || t.subtitle || '',
      destination: t.destination,
      destinationSlug: t.destinationSlug || t.slug?.split('-')[0] || 'kashmir',
      country: t.country || (t.destination === 'Kashmir' || t.destination === 'Rajasthan' ? 'India' : 'International'),
      region: t.region || 'Global',
      duration: t.duration || `${t.days || 7} Days`,
      days: t.days || 7,
      nights: t.nights || (t.days ? t.days - 1 : 6),
      price: t.startingPrice || t.price || 24999,
      startingPrice: t.startingPrice || t.price || 24999,
      rating: t.rating || 4.9,
      reviewsCount: t.reviewsCount || 120,
      category: t.category || 'Luxury & Nature',
      image: t.image,
      gallery: t.gallery || [t.image],
      overview: t.overview || t.description || 'Experience extraordinary luxury curated by Tours & Travellers.',
      highlights: t.highlights || [],
      inclusions: t.inclusions || [],
      exclusions: t.exclusions || [],
      itinerary: (t.itinerary || []).map((item) => ({
        day: item.day,
        title: item.title,
        desc: item.desc || item.description || '',
        description: item.description || item.desc || '',
        stay: item.stay || '5-Star Luxury Resort / Boutique Heritage Chalet',
        meals: item.meals || 'Breakfast & Dinner',
      })),
      isFeatured: Boolean(t.isFeatured ?? true),
      isSignature: true,
      groupSize: t.groupSize || 'Max 8 Explorers',
    }))

    const inserted = await Tour.insertMany(formattedTours)
    console.log(`✅ Successfully seeded ${inserted.length} comprehensive Tour Packages into MongoDB!`)

    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding Error:', error)
    process.exit(1)
  }
}

seedTours()
