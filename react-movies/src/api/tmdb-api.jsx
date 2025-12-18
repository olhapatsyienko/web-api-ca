const API_BASE_URL = 'http://localhost:8080/api/movies'; // calls the movies api server 

const fetchMoviesAPI = (path, params = {}) => {
  const url = new URL(`${API_BASE_URL}${path}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  });

  return fetch(url.toString()).then((res) => {
    if (!res.ok) {
      return res.json().then((error) => {
        throw new Error(error.msg || error.message || `Movies API request failed: ${res.status}`);
      }).catch(() => {
        throw new Error(`Movies API request failed: ${res.status}`);
      });
    }
    return res.json();
  });
};

export const getDiscoverMoviesPage = (page = 1, extraParams = {}) => {
  const params = {
    page: String(page),
    ...extraParams,
  };
  return fetchMoviesAPI('/discover', params);
};

export const getMovies = () => {
  return fetchMoviesAPI('/discover');
};

export const getMovie = (id) => {
  return fetchMoviesAPI(`/${id}`);
};

export const getGenres = () => {
  return fetchMoviesAPI('/genres');
};

export const getMovieImages = (id) => {
  return fetchMoviesAPI(`/${id}/images`);
};

export const getMovieReviews = (id) => {
  return fetchMoviesAPI(`/${id}/reviews`);
};

export const getTopRatedMovies = () => {
  return getTopRatedMoviesPage().then(json => json.results);
};

export const getTopRatedMoviesPage = (page = 1) => {
  return fetchMoviesAPI('/top-rated', {
    page: String(page),
  });
};

export const getUpcomingMovies = () => {
  return getUpcomingMoviesPage().then(json => json.results);
};

export const getUpcomingMoviesPage = (page = 1) => {
  return fetchMoviesAPI('/upcoming', {
    page: String(page),
  });
};

export const getNowPlayingMovies = () => {
  return getNowPlayingMoviesPage().then(json => json.results);
};

export const getNowPlayingMoviesPage = (page = 1) => {
  return fetchMoviesAPI('/now-playing', {
    page: String(page),
  });
};

export const getPopularMovies = () => {
  return getPopularMoviesPage().then(json => json.results);
};

export const getPopularMoviesPage = (page = 1, region = undefined) => {
  const params = {
    page: String(page),
  };
  if (region) {
    params.region = region;
  }
  return fetchMoviesAPI('/popular', params);
};

export const getTrendingMovies = () => {
  return getTrendingMoviesPage().then(json => json.results);
};

export const getTrendingMoviesPage = (page = 1) => {
  return fetchMoviesAPI('/trending', {
    page: String(page),
  });
};

export const getLatestMovie = () => {
  return fetchMoviesAPI('/latest');
};

export const getMovieRecommendations = (movieId, page = 1) => {
  return fetchMoviesAPI(`/${movieId}/recommendations`, {
    page: String(page),
  });
};

export const getMovieCredits = (movieId) => {
  return fetchMoviesAPI(`/${movieId}/credits`);
};

export const getPerson = (personId) => {
  return fetchMoviesAPI(`/person/${personId}`);
};

export const getPersonMovieCredits = (personId) => {
  return fetchMoviesAPI(`/person/${personId}/movie_credits`);
};
  
  