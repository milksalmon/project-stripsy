import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Session from './models/session.js';

dotenv.config();

await mongoose.connect(process.env.ATLAS_URI);

const sessions = await Session.find().sort({ _id: -1 }).limit(3).lean();
const summary = sessions.map((s) => ({
  _id: s._id,
  roomCode: s.roomCode,
  comicTitle: s.comicTitle,
  panels: s.panels.map((p) => ({
    ownerIndex: p.ownerIndex,
    submitted: p.submitted,
    strokeCount: p.strokes.length,
  })),
}));
console.log(JSON.stringify(summary, null, 2));

await mongoose.disconnect();
