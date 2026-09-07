import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: './backend/.env' });

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/tour_and_travel';

async function updateQutub() {
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    const Media = mongoose.model('Media', new mongoose.Schema({}, { strict: false }));
    const result = await Media.updateMany(
      {
        $or: [
          { filename: { $regex: 'qutub', $options: 'i' } },
          { title: { $regex: 'qutub', $options: 'i' } },
        ],
      },
      {
        $set: {
          url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Qutb_Minar_2022.jpg/1280px-Qutb_Minar_2022.jpg',
        },
      }
    );
    console.log('MongoDB Media update result:', result);
    await mongoose.disconnect();
  } catch (err) {
    console.log('MongoDB connection or update:', err.message);
  }
}

updateQutub();
