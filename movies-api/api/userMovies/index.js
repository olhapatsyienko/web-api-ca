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

//POST /api/user-movies 
router.post('/', asyncHandler(async (req, res) => {
    const { movieId, type, review } = req.body;

    //validation
    if (!movieId || typeof movieId !== 'number') {
        return res.status(400).json({ 
            success: false, 
            msg: 'movieId is required and must be a number' 
        });
    }

    if (!type || !['favorite', 'playlist', 'review'].includes(type)) {
        return res.status(400).json({ 
            success: false, 
            msg: 'type is required and must be one of: favorite, playlist or review' 
        });
    }

    //if type is review validate data
    if (type === 'review') {
        if (!review) {
            return res.status(400).json({ 
                success: false, 
                msg: 'review object is required when type is review' 
            });
        }
        if (review.rating !== undefined) {
            if (typeof review.rating !== 'number' || review.rating < 1 || review.rating > 10) {
                return res.status(400).json({ 
                    success: false, 
                    msg: 'rating must be a number between 1 and 10' 
                });
            }
        }
        if (!review.rating && !review.comment) {
            return res.status(400).json({ 
                success: false, 
                msg: 'review must have at least a rating or a comment' 
            });
        }
    }

    //сheck if entry already exists
    const existing = await UserMovie.findOne({ 
        userId: req.user._id, 
        movieId: movieId, 
        type: type 
    });

    if (existing) {
        return res.status(409).json({ 
            success: false, 
            msg: `this movie is already in your ${type} collection` 
        });
    }

    //сreate new entry
    const userMovieData = {
        userId: req.user._id,
        movieId: movieId,
        type: type
    };

    if (type === 'review' && review) {
        userMovieData.review = {
            rating: review.rating,
            comment: review.comment || '',
            date: new Date()
        };
    }

    const userMovie = await UserMovie.create(userMovieData);
    
    res.status(201).json({
        success: true,
        msg: `movie successfully added to ${type} collection`,
        data: userMovie
    });
}));

//PUT /api/user-movies/:id 
router.put('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { review, type } = req.body;

    //find the entry and verify it belongs to the user
    const userMovie = await UserMovie.findOne({ 
        _id: id, 
        userId: req.user._id 
    });

    if (!userMovie) {
        return res.status(404).json({ 
            success: false, 
            msg: 'movie entry not found or you do not have permission to update it' 
        });
    }

    //update type if provided
    if (type) {
        if (!['favorite', 'playlist', 'review'].includes(type)) {
            return res.status(400).json({ 
                success: false, 
                msg: 'invalid type. Must be one of: favorite, playlist, review' 
            }); 
        }
        userMovie.type = type;
    }

    //update review if provided
    if (review !== undefined) {
        if (userMovie.type !== 'review' && review) {
            return res.status(400).json({ 
                success: false, 
                msg: 'cannot add review to non-review entry. change type to review first' 
            });
        }

        if (review) {
            if (review.rating !== undefined) {
                if (typeof review.rating !== 'number' || review.rating < 1 || review.rating > 10) {
                    return res.status(400).json({ 
                        success: false, 
                        msg: 'rating must be a number between 1 and 10' 
                    });
                }
                userMovie.review = userMovie.review || {};
                userMovie.review.rating = review.rating;
            }
            if (review.comment !== undefined) {
                userMovie.review = userMovie.review || {};
                userMovie.review.comment = review.comment;
            }
            if (review.rating || review.comment) {
                userMovie.review.date = new Date();
            }
        } else {
            //remove review
            userMovie.review = undefined;
        }
    }

    await userMovie.save();
    
    res.status(200).json({
        success: true,
        msg: 'movie entry updated successfully',
        data: userMovie
    });
}));


//DELETE /api/user-movies/:id 
router.delete('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;

    const userMovie = await UserMovie.findOneAndDelete({ 
        _id: id, 
        userId: req.user._id 
    });

    if (!userMovie) {
        return res.status(404).json({ 
            success: false, 
            msg: 'movie entry not found or you do not have permission to delete it' 
        });
    }

    res.status(200).json({
        success: true,
        msg: 'movie removed from collection successfully'
    });
}));



export default router;

