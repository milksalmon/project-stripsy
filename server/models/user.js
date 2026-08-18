import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    history: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session',
    }],
});

const User = mongoose.model('User', userSchema);
export default User;