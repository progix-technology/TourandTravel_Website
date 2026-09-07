import mongoose from 'mongoose'

const ContactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    phone: {
      type: String,
      default: '',
    },
    subject: {
      type: String,
      default: 'General Inquiry',
    },
    message: {
      type: String,
      required: [true, 'Please add a message'],
    },
    status: {
      type: String,
      enum: ['Unread', 'Read', 'Responded', 'Archived'],
      default: 'Unread',
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('ContactMessage', ContactMessageSchema)
