import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tours_and_travellers')
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`)
  } catch (error) {
    console.warn(`⚠️ MongoDB Connection Warning: ${error.message}`)
    console.log('ℹ️ Server will continue running. Ensure MongoDB service or Mongo Atlas URI is configured in .env')
  }
}

export default connectDB
