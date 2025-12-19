import express from 'express';
import UserMovie from './userMovieModel';
import authenticate from './authenticate';
import asyncHandler from 'express-async-handler';

const router = express.Router();

router.use(authenticate);

// GET /api/user-movies - Get all user's movie data
// Query params: type (optional) - filter by type (favorite/playlist/review)
router.get('/', asyncHandler(async (req, res) => {
    const query = { userId: req.user._id };
    
    if (req.query.type) {
        if (!['favorite', 'playlist', 'review'].includes(req.query.type)) {
            return res.status(400).json({ 
                success: false, 
                msg: 'Invalid type. Must be one of: favorite, playlist, review' 
            });
        }
        query.type = req.query.type;
    }

    const userMovies = await UserMovie.find(query).sort({ createdAt: -1 });
    
    res.status(200).json({
        success: true,
        data: userMovies
    });
}));

export default router;

