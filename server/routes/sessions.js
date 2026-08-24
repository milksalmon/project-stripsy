import express from 'express';
import Session from '../models/session.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
const session = await Session.findById(req.params.id).lean();
if (!session) return res.status(404).json({ error: 'Session not found.' });
res.json(session);
});

export default router;