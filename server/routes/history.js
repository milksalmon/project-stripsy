import { Router } from 'express';
import User from '../models/user.js';
import requireAuth from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('history').lean();
        if (!user) {
            return res.status(401).json({ error: 'Not authenticated.' });
        }
        res.json(user.history);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch history.' });
    }
});

export default router;