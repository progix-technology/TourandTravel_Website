import mongoose from 'mongoose'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import Destination from '../models/Destination.js'
import connectDB from '../config/db.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const seedLocations = async () => {
  try {
    await connectDB()

    const rawData = fs.readFileSync(path.resolve(__dirname, '../data/exploreLocations.json'), 'utf-8')
    const locations = JSON.parse(rawData)

    console.log(`Seeding ${locations.length} explore destinations into MongoDB...`)

    let upsertedCount = 0

    for (const loc of locations) {
      const destinationDoc = {
        slug: loc.slug || loc.id,
        title: loc.name,
        country: loc.country,
        countryCode: loc.countryCode,
        region: loc.country,
        type: loc.type || 'destination',
        category: Array.isArray(loc.category) ? loc.category.join(', ') : loc.category || 'Scenic Luxury',
        rating: loc.rating || 4.9,
        reviewsCount: Math.floor(150 + Math.random() * 400),
        image: loc.image,
        gallery: [loc.image],
        startingPrice: loc.startingPrice || 24999,
        duration: '7 Days',
        description: loc.description,
        highlights: Array.isArray(loc.category) ? loc.category : ['Sightseeing', 'Luxury Stay'],
        bestTimeToVisit: 'All Year Round',
        isPopular: loc.featured || loc.rating >= 4.9,
        featured: !!loc.featured,
        toursCount: loc.toursCount || 12,
        hotelsCount: loc.hotelsCount || 40,
        coordinates: loc.coordinates,
      }

      await Destination.findOneAndUpdate(
        { slug: destinationDoc.slug },
        destinationDoc,
        { upsert: true, new: true }
      )

      upsertedCount++
    }

    console.log(`Successfully seeded/upserted ${upsertedCount} destinations into MongoDB!`)
    process.exit(0)
  } catch (err) {
    console.error('Seeding Error:', err)
    process.exit(1)
  }
}

seedLocations()
