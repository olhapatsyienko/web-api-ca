const API_KEY = import.meta.env.VITE_TMDB_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const fetchJson = (path, params = {}) => {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set('api_key', API_KEY);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  });

  return fetch(url.toString()).then((res) => {
    if (!res.ok) {
      throw new Error(`TMDB request failed: ${res.status}`);
    }
    return res.json();
  });
};

export const getDiscoverMoviesPage = (page = 1, extraParams = {}) => {
  return fetchJson('/discover/movie', {
    language: 'en-US',
    include_adult: 'false',
    page: String(page),
    ...extraParams,
  });
};

export const getMovies = () => {
  return getDiscoverMoviesPage().then((json) => json.results);
};
  
  export const getMovie = id => {
    return fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${import.meta.env.VITE_TMDB_KEY}`
    ).then(res => res.json());
  };
  
  export const getGenres = () => {
    return fetch(
      "https://api.themoviedb.org/3/genre/movie/list?api_key=" +
        import.meta.env.VITE_TMDB_KEY +
        "&language=en-US"
    )
      .then(res => res.json())
      .then(json => json.genres);
  };
  
  export const getMovieImages = (id) => {
    return fetch(
      `https://api.themoviedb.org/3/movie/${id}/images?api_key=${import.meta.env.VITE_TMDB_KEY}`
    )
      .then((res) => res.json())
      .then((json) => json.posters);
  };
  export const getMovieReviews = (id) => {
    return fetch(
      `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${import.meta.env.VITE_TMDB_KEY}`
    )
      .then((res) => res.json())
      .then((json) => {
        // console.log(json.results);
        return json.results;
      });
  };

export const getTopRatedMovies = () => {
    return getTopRatedMoviesPage().then(json => json.results);
  };

  export const getTopRatedMoviesPage = (page = 1) => {
    return fetchJson('/movie/top_rated', {
      language: 'en-US',
      page: String(page),
    });
  };

export const getUpcomingMovies = () => {
    return getUpcomingMoviesPage().then(json => json.results);
  };

  export const getUpcomingMoviesPage = (page = 1) => {
    return fetchJson('/movie/upcoming', {
      language: 'en-US',
      page: String(page),
    });
  };

export const getNowPlayingMovies = () => {
    return getNowPlayingMoviesPage().then(json => json.results);
  };

  export const getNowPlayingMoviesPage = (page = 1) => {
    return fetchJson('/movie/now_playing', {
      language: 'en-US',
      page: String(page),
    });
  };

export const getPopularMovies = () => {
    return getPopularMoviesPage().then(json => json.results);
  };

  export const getPopularMoviesPage = (page = 1, region = undefined, language = 'en-US') => {
    const params = {
      language: language,
      page: String(page),
    };
    if (region) {
      params.region = region;
    }
    return fetchJson('/movie/popular', params);
  };

export const getTrendingMovies = () => {
    return getTrendingMoviesPage().then(json => json.results);
  };

  export const getTrendingMoviesPage = (page = 1) => {
    return fetchJson('/trending/movie/week', {
      language: 'en-US',
      page: String(page),
    });
  };

  export const getLatestMovie = () => {
    return fetch(
      `https://api.themoviedb.org/3/movie/latest?api_key=${import.meta.env.VITE_TMDB_KEY}&language=en-US`
    )
      .then(res => res.json());
  };

  export const getMovieRecommendations = (movieId, page = 1) => {
    return fetchJson(`/movie/${movieId}/recommendations`, {
      language: 'en-US',
      page: String(page),
    }).then(json => json.results);
  };

  export const getMovieCredits = (movieId) => {
    return fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${import.meta.env.VITE_TMDB_KEY}&language=en-US`
    )
      .then(res => res.json());
  };

  export const getPerson = (personId) => {
    return fetch(
      `https://api.themoviedb.org/3/person/${personId}?api_key=${import.meta.env.VITE_TMDB_KEY}&language=en-US`
    )
      .then(res => res.json());
  };

  export const getPersonMovieCredits = (personId) => {
    return fetch(
      `https://api.themoviedb.org/3/person/${personId}/movie_credits?api_key=${import.meta.env.VITE_TMDB_KEY}&language=en-US`
    )
      .then(res => res.json());
  };
  
  