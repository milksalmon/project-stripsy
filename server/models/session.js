import mongoose from 'mongoose';

const strokeSchema = new mongoose.Schema({
    tool: { 
        type: String, 
        required: true 
    },
    color: { 
        type: String, 
        required: true 
    },
    strokeWidth: { 
        type: Number, 
        required: true 
    },
    points: [{ 
        type: Number 
    }],
}, { _id: false });

const panelSchema = new mongoose.Schema({
    strokes: [strokeSchema],
}, { _id: false });

const participantSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true 
    },
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
}, { _id: false });

const sessionSchema = new mongoose.Schema({
    roomCode: {
        type: String,
        unique: true,
        sparse: true,
    },
    participants: [participantSchema],
    timerDuration: Number,
    themePrompt: String,
    comicTitle: String,
    panelTitles: [String],
    characterDescription: String,
    panels: [panelSchema],
});

const Session = mongoose.model('Session', sessionSchema);
export default Session;