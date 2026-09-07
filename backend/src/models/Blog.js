import mongoose from 'mongoose'

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
    },
    content: {
      type: String,
      required: [true, 'Please add content'],
    },
    author: {
      type: String,
      default: 'Tours & Travellers Curators',
    },
    image: {
      type: String,
      default: 'no-image.jpg',
    },
    tags: {
      type: [String],
    },
    published: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

// Create slug from title before save
BlogSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
  }
  next()
})

export default mongoose.model('Blog', BlogSchema)
