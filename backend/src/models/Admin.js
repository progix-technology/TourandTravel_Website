import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const AdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      default: 'admin',
      enum: ['admin'],
    },
    membership: {
      type: String,
      default: 'VIP Sovereign',
    },
    phone: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default:
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin&backgroundColor=13151A',
    },
    rewardPoints: {
      type: Number,
      default: 5000,
    },
  },
  {
    timestamps: true,
  }
)

// Encrypt password before save
AdminSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Match entered password to hashed password in database
AdminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// Sign JWT and return
AdminSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id, email: this.email, role: this.role },
    process.env.JWT_SECRET || 'tours_and_travellers_super_secret_jwt_key_2026_luxury_voyages',
    {
      expiresIn: process.env.JWT_EXPIRE || '30d',
    }
  )
}

export default mongoose.model('Admin', AdminSchema)
