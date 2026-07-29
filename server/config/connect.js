import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config(); 


const connectDB = async () => {
  const Db = process.env.ATLAS_URI;

  try {
    await mongoose.connect(Db);
    console.log('MongoDB connected');

    // test to display collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

export default connectDB;