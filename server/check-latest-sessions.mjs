import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Session from './models/session.js';

dotenv.config();

await mongoose.connect(process.env.ATLAS_URI);

const sessions = await Session.find().sort({ _id: -1 }).limit(5).lean();
console.log(JSON.stringify(sessions, null, 2));

await mongoose.disconnect();
