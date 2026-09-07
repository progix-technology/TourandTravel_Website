import mongoose from 'mongoose'

const TourSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a tour title'],
      trim: true,
    },
    subtitle: {
      type: String,
      default: '',
    },
    tagline: {
      type: String,
      default: '',
    },
    destination: {
      type: String,
      required: true,
    },
    destinationSlug: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: '',
    },
    region: {
      type: String,
      default: '',
    },
    duration: {
      type: String,
      required: true,
    },
    days: {
      type: Number,
      default: 7,
    },
    nights: {
      type: Number,
      default: 6,
    },
    price: {
      type: Number,
      required: true,
    },
    startingPrice: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      default: 4.9,
    },
    reviewsCount: {
      type: Number,
      default: 128,
    },
    category: {
      type: String,
      default: 'Luxury',
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
    overview: {
      type: String,
      required: true,
    },
    highlights: [
      {
        type: String,
      },
    ],
    inclusions: [
      {
        type: String,
      },
    ],
    exclusions: [
      {
        type: String,
      },
    ],
    itinerary: [
      {
        day: Number,
        title: String,
        desc: String,
        description: String,
        stay: String,
        meals: String,
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isSignature: {
      type: Boolean,
      default: false,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    groupSize: {
      type: String,
      default: 'Max 8 Explorers',
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Tour', TourSchema)
