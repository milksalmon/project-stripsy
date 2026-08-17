import jwt from 'jsonwebtoken';

function requireAuth(req, res, next) {
    const token = req.cookies.token;

    // check payload on user browser on whether JWT exists.
    if (!token) {
        return res.status(401).json({ error: 'Not authenticated.' });
    }

    // check jwt and user id on whether they match.
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = payload.userId;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Not authenticated.' });
    }
}

export default requireAuth;