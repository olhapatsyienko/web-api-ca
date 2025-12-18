import fetch from 'node-fetch';

const BASE_URL = 'https://api.themoviedb.org/3';

const fetchTMDB = async (path, params = {}) => {
    const API_KEY = process.env.TMDB_KEY;
    
    if (!API_KEY) {
        throw new Error('TMDB_KEY environment variable is not set!');
    }

    const url = new URL(`${BASE_URL}${path}`);
    url.searchParams.set('api_key', API_KEY);
    url.searchParams.set('language', 'en-US');
    
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            url.searchParams.set(key, value);
        }
    });

    try {
        const response = await fetch(url.toString());
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || error.status_message || `TMDB API error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error(`Failed to fetch from TMDB API: ${error.message || error}`);
    }
};

export const getDiscoverMoviesPage = async (page = 1, extraParams = {}) => {
    return fetchTMDB('/discover/movie', {
        include_adult: 'false',
        include_video: 'false',
        page: String(page),
        ...extraParams,
    });
};

export const getMovies = async () => {
    return getDiscoverMoviesPage(1);
};

export const getTrendingMoviesPage = async (page = 1) => {
    return fetchTMDB('/trending/movie/week', {
        page: String(page),
    });
};

export const getPopularMoviesPage = async (page = 1, region = undefined) => {
    const params = {
        page: String(page),
    };
    if (region) {
        params.region = region;
    }
    return fetchTMDB('/movie/popular', params);
};

export const getTopRatedMoviesPage = async (page = 1) => {
    return fetchTMDB('/movie/top_rated', {
        page: String(page),
    });
};

export const getUpcomingMoviesPage = async (page = 1) => {
    return fetchTMDB('/movie/upcoming', {
        page: String(page),
    });
};

export const getNowPlayingMoviesPage = async (page = 1) => {
    return fetchTMDB('/movie/now_playing', {
        page: String(page),
    });
};

export const getMovie = async (id) => {
    return fetchTMDB(`/movie/${id}`);
};

export const getLatestMovie = async () => {
    return fetchTMDB('/movie/latest');
};

export const getGenres = async () => {
    const response = await fetchTMDB('/genre/movie/list');
    return response.genres;
};

export const getMovieImages = async (id) => {
    const response = await fetchTMDB(`/movie/${id}/images`);
    return response.posters;
};

export const getMovieReviews = async (id) => {
    const response = await fetchTMDB(`/movie/${id}/reviews`);
    return response.results;
};

export const getMovieRecommendations = async (movieId, page = 1) => {
    const response = await fetchTMDB(`/movie/${movieId}/recommendations`, {
        page: String(page),
    });
    return response.results;
};

export const getMovieCredits = async (movieId) => {
    return fetchTMDB(`/movie/${movieId}/credits`);
};

export const getPerson = async (personId) => {
    return fetchTMDB(`/person/${personId}`);
};

export const getPersonMovieCredits = async (personId) => {
    return fetchTMDB(`/person/${personId}/movie_credits`);
};
