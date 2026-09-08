import mongoose from 'mongoose'

const DestinationSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: 'Scenic Luxury',
    },
    rating: {
      type: Number,
      default: 4.9,
    },
    reviewsCount: {
      type: Number,
      default: 240,
    },
    image: {
      type: String,
      required: true,
    },
    gallery: [
      {
        type: String,
      },
    ],
    startingPrice: {
      type: Number,
      required: true,
    },
    duration: {
      type: String,
      default: '7 Days',
    },
    description: {
      type: String,
      required: true,
    },
    highlights: [
      {
        type: String,
      },
    ],
    bestTimeToVisit: {
      type: String,
      default: 'October to April',
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    countryCode: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      default: 'destination',
    },
    toursCount: {
      type: Number,
      default: 12,
    },
    hotelsCount: {
      type: Number,
      default: 40,
    },
    coordinates: {
      lat: {
        type: Number,
      },
      lng: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Destination', DestinationSchema)
