import jwt from 'jsonwebtoken';
import User from '../users/userModel';

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('BEARER ')) {
            return res.status(401).json({ 
                success: false, 
                msg: 'No token provided. Authorization header must be in format: BEARER <token>' 
            });
        }

        const token = authHeader.substring(7);

        if (!process.env.SECRET) {
            throw new Error('jwt_secret is not configured');
        }

        const decoded = jwt.verify(token, process.env.SECRET);
        
        const user = await User.findByUserName(decoded.username);
        
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                msg: 'User not found' 
            });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false, 
                msg: 'Invalid token' 
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false, 
                msg: 'Token expired' 
            });
        }
        return res.status(500).json({ 
            success: false, 
            msg: error.message || 'Authentication failed' 
        });
    }
};

export default authenticate;

