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

// GET /api/user-movies/favorites 
router.get('/favorites', asyncHandler(async (req, res) => {
    const favorites = await UserMovie.find({ 
        userId: req.user._id, 
        type: 'favorite' 
    }).sort({ createdAt: -1 });
    
    res.status(200).json({
        success: true,
        data: favorites
    });
}));

// GET /api/user-movies/playlist
router.get('/playlist', asyncHandler(async (req, res) => {
    const playlist = await UserMovie.find({ 
        userId: req.user._id, 
        type: 'playlist' 
    }).sort({ createdAt: -1 });
    
    res.status(200).json({
        success: true,
        data: playlist
    });
}));

// GET /api/user-movies/reviews 
router.get('/reviews', asyncHandler(async (req, res) => {
    const reviews = await UserMovie.find({ 
        userId: req.user._id, 
        type: 'review' 
    }).sort({ createdAt: -1 });
    
    res.status(200).json({
        success: true,
        data: reviews
    });
}));

// GET /api/user-movies/:movieId 
router.get('/:movieId', asyncHandler(async (req, res) => {
    const movieId = parseInt(req.params.movieId);
    
    if (isNaN(movieId)) {
        return res.status(400).json({ 
            success: false, 
            msg: 'Invalid movie ID. Must be a number' 
        });
    }

    const userMovies = await UserMovie.find({ 
        userId: req.user._id, 
        movieId: movieId 
    }).sort({ createdAt: -1 });
    
    res.status(200).json({
        success: true,
        data: userMovies
    });
}));

export default router;

