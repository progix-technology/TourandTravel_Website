import mongoose from 'mongoose'

const MediaSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: [true, 'Please add a filename'],
    },
    title: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'Landscape',
    },
    location: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      required: [true, 'Please add a file URL'],
    },
    fileType: {
      type: String,
      enum: ['Image', 'Video', 'Document'],
      default: 'Image',
    },
    size: {
      type: String,
      default: '0 KB',
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin', // Reference to the Admin schema
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Media', MediaSchema)
