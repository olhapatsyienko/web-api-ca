import React, { useContext } from "react";
import PageTemplate from "../components/templateMovieListPage";
import { MoviesContext } from "../contexts/moviesContext";
import { useQueries } from "@tanstack/react-query";
import { getMovie } from "../api/tmdb-api";
import Spinner from '../components/spinner' ;
import RemoveFromFavorites from "../components/cardIcons/removeFromFavorites";
import WriteReview from "../components/cardIcons/writeReview";


const FavoriteMoviesPage = () => {
  const {favorites: movieIds } = useContext(MoviesContext);

  // Create an array of queries and run in parallel.
  const favoriteMovieQueries = useQueries({
    queries: movieIds.map((movieId) => {
      return {
        queryKey: ['movie', { id: movieId }],
        queryFn: () => getMovie(movieId),
      }
    })
  });
  
  // Check if any of the parallel queries is still loading.
  const isPending = favoriteMovieQueries.find((m) => m.isPending === true);

  if (isPending) {
    return <Spinner />;
  }

  // Check if any queries failed
  const failedQueries = favoriteMovieQueries.filter((m) => m.isError === true);
  if (failedQueries.length > 0) {
    console.error('Some favorite movie queries failed:', failedQueries);
    console.error('Failed query details:', failedQueries.map(q => ({
      error: q.error,
      queryKey: q.queryKey
    })));
    
    // If all queries failed, show error
    if (failedQueries.length === favoriteMovieQueries.length) {
      return <h1>Error loading favorite movies: {failedQueries[0].error?.message || 'Unknown error'}</h1>;
    }
    
    // If only some failed, show warning but continue with successful ones
    console.warn(`${failedQueries.length} out of ${favoriteMovieQueries.length} queries failed, continuing with successful ones`);
  }

  // Debug logging
  console.log('Favorite movie queries status:', favoriteMovieQueries.map(q => ({
    isPending: q.isPending,
    isError: q.isError,
    hasData: !!q.data,
    hasGenres: !!(q.data && q.data.genres)
  })));

  // Filter out any queries that don't have data and process the successful ones
  const movies = favoriteMovieQueries
    .filter((q) => q.data && q.data.genres) // Only process queries with valid data
    .map((q) => {
      q.data.genre_ids = q.data.genres.map(g => g.id);
      return q.data;
    });

  const toDo = () => true;

  return (
    <PageTemplate
      title="Favorite Movies"
      movies={movies}
      action={(movie) => {
        return (
          <>
            <RemoveFromFavorites movie={movie} />
            <WriteReview movie={movie} />
          </>
        );
      }}
    />
  );

};

export default FavoriteMoviesPage;
