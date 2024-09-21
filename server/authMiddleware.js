import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Access denied' });
    }
    try {
        const decoded = jwt.verify(token, 'asjdkdl-fjjjfjfj-suusudi-mksdj');
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }

};