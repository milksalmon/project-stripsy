import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import requireAuth from '../middleware/auth.js';

const router = Router();
const SALT_ROUNDS = 10;

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

function issueToken(user) {
    return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

router.post('/signup', async (req, res) => {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
        return res.status(400).json({ error: 'Email, password, and username are required.' });
    }

    try {
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ error: 'Email already in use.' });
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        const user = await User.create({ email, passwordHash, username });

        const token = issueToken(user);
        res.cookie('token', token, cookieOptions);
        res.status(201).json({ email: user.email, username: user.username });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Signup failed.' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const token = issueToken(user);
        res.cookie('token', token, cookieOptions);
        res.json({ email: user.email, username: user.username });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login failed.' });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('token', cookieOptions);
    res.status(204).send();
});

router.get('/me', requireAuth, async (req, res) => {
    try {
        // MongoDB syntax for email, username field
        const user = await User.findById(req.userId).select('email username');
        if (!user) {
            return res.status(401).json({ error: 'Not authenticated.' });
        }
        res.json({ email: user.email, username:user.username});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch user.' });
    }
});

export default router;