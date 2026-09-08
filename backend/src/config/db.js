import mongoose from 'mongoose'
import Admin from '../models/Admin.js'
import User from '../models/User.js'

const ensureDefaultAccounts = async () => {
  try {
    const adminEmail = 'info@progixtechnology.com'
    const admin = await Admin.findOne({ email: adminEmail }).select('+password')

    if (!admin) {
      await Admin.create({
        name: 'Vivang Mishra',
        email: adminEmail,
        password: 'Password@2026',
        membership: 'VIP Sovereign',
        phone: '+91 89532 08952',
      })
      console.log(`👑 Default Sovereign Admin created: ${adminEmail}`)
    } else {
      // Ensure password validity
      const isMatch = await admin.matchPassword('Password@2026')
      if (!isMatch) {
        admin.password = 'Password@2026'
        await admin.save()
        console.log(`🔄 Default Sovereign Admin password updated: ${adminEmail}`)
      }
    }
  } catch (err) {
    console.warn(`⚠️ Warning checking default admin accounts: ${err.message}`)
  }
}

export const connectDB = async () => {
  const uri =
    process.env.MONGO_URI ||
    process.env.MONGODB_URI ||
    process.env.DATABASE_URL ||
    'mongodb://127.0.0.1:27017/tours_and_travellers'

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    })
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`)
    await ensureDefaultAccounts()
  } catch (error) {
    console.error(`❌ MongoDB Connection Warning: ${error.message}`)
    console.log(
      'ℹ️ Ensure MongoDB Atlas IP Whitelist (0.0.0.0/0) and MONGO_URI are configured in Render environment.'
    )
  }
}

export default connectDB
