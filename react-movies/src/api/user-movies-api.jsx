const API_BASE_URL = 'http://localhost:8080/api/user-movies';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('no authentication token found. please log in');
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `BEARER ${token}`
  };
};

// GET /api/user movies get all user's movie data
export const getUserMovies = async (type = null) => {
  const url = type 
    ? `${API_BASE_URL}?type=${type}`
    : API_BASE_URL;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.msg || 'failed to fetch user movies');
  }

  return data.data || [];
};

//get /api/user-movies/favorites get favorites only
export const getFavorites = async () => {
  const response = await fetch(`${API_BASE_URL}/favorites`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.msg || 'Failed to fetch favorites');
  }

  return data.data || [];
};

//get /api/user-movies/playlist get playlist only
export const getPlaylist = async () => {
  const response = await fetch(`${API_BASE_URL}/playlist`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.msg || 'failed to fetch playlist');
  }

  return data.data || [];
};

//get /api/user-movies/reviews get reviews only
export const getReviews = async () => {
  const response = await fetch(`${API_BASE_URL}/reviews`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.msg || 'Failed to fetch reviews');
  }

  return data.data || [];
};

//get /api/user-movies/:movieId 
export const getMovieData = async (movieId) => {
  const response = await fetch(`${API_BASE_URL}/${movieId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.msg || 'failed to fetch movie data');
  }

  return data.data || [];
};

//post /api/user-movies 
export const addUserMovie = async (movieId, type, review = null) => {
  const body = { movieId, type };
  if (type === 'review' && review) {
    body.review = review;
  }

  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.msg || 'Failed to add movie');
  }

  return data.data;
};

//put /api/user-movies/:id 
export const updateUserMovie = async (id, updates) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.msg || 'failed to update movie entry');
  }

  return data.data;
};

//delete /api/user-movies/:id 
export const deleteUserMovie = async (id) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.msg || 'failed to delete movie entry');
  }

  return;
};

