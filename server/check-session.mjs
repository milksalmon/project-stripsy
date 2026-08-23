import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Session from './models/session.js';

dotenv.config();

const sessionId = process.argv[2];
if (!sessionId) {
  console.error('Usage: node check-session.mjs <sessionId>');
  process.exit(1);
}

await mongoose.connect(process.env.ATLAS_URI);

const session = await Session.findById(sessionId).lean();
console.log(JSON.stringify(session, null, 2));

await mongoose.disconnect();
