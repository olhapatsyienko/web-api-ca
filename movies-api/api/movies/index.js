import express from 'express';
import asyncHandler from 'express-async-handler';
import {
    getMovies,
    getDiscoverMoviesPage,
    getTrendingMoviesPage,
    getPopularMoviesPage,
    getTopRatedMoviesPage,
    getUpcomingMoviesPage,
    getNowPlayingMoviesPage,
    getMovie,
    getLatestMovie,
    getGenres,
    getMovieImages,
    getMovieReviews,
    getMovieRecommendations,
    getMovieCredits,
    getPerson,
    getPersonMovieCredits
} from '../tmdb-api';

const router = express.Router();

router.get('/discover', asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const extraParams = {};
    
    if (req.query.genre) extraParams.with_genres = req.query.genre;
    if (req.query.sort_by) extraParams.sort_by = req.query.sort_by;
    
    const result = await getDiscoverMoviesPage(page, extraParams);
    res.status(200).json(result);
}));

router.get('/trending', asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const result = await getTrendingMoviesPage(page);
    res.status(200).json(result);
}));

router.get('/popular', asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const region = req.query.region;
    const result = await getPopularMoviesPage(page, region);
    res.status(200).json(result);
}));

router.get('/top-rated', asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const result = await getTopRatedMoviesPage(page);
    res.status(200).json(result);
}));

router.get('/upcoming', asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const result = await getUpcomingMoviesPage(page);
    res.status(200).json(result);
}));

router.get('/now-playing', asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const result = await getNowPlayingMoviesPage(page);
    res.status(200).json(result);
}));

router.get('/latest', asyncHandler(async (req, res) => {
    const result = await getLatestMovie();
    res.status(200).json(result);
}));

router.get('/genres', asyncHandler(async (req, res) => {
    const genres = await getGenres();
    res.status(200).json(genres);
}));

router.get('/person/:id', asyncHandler(async (req, res) => {
    const person = await getPerson(req.params.id);
    res.status(200).json(person);
}));

router.get('/person/:id/movie_credits', asyncHandler(async (req, res) => {
    const credits = await getPersonMovieCredits(req.params.id);
    res.status(200).json(credits);
}));

router.get('/:id/images', asyncHandler(async (req, res) => {
    const images = await getMovieImages(req.params.id);
    res.status(200).json(images);
}));

router.get('/:id/reviews', asyncHandler(async (req, res) => {
    const reviews = await getMovieReviews(req.params.id);
    res.status(200).json(reviews);
}));

router.get('/:id/recommendations', asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const recommendations = await getMovieRecommendations(req.params.id, page);
    res.status(200).json(recommendations);
}));

router.get('/:id/credits', asyncHandler(async (req, res) => {
    const credits = await getMovieCredits(req.params.id);
    res.status(200).json(credits);
}));

router.get('/:id', asyncHandler(async (req, res) => {
    const movie = await getMovie(req.params.id);
    res.status(200).json(movie);
}));

export default router;

