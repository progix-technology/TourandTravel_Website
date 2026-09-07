import mongoose from 'mongoose'

const CouponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Please add a coupon code'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    discountType: {
      type: String,
      enum: ['Percentage', 'Fixed'],
      default: 'Percentage',
    },
    discountValue: {
      type: Number,
      required: [true, 'Please add a discount value'],
    },
    expiryDate: {
      type: Date,
      required: [true, 'Please add an expiration date'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    usageLimit: {
      type: Number,
      default: 100,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Coupon', CouponSchema)
