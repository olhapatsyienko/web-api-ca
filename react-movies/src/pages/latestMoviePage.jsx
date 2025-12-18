import React from "react";
import { getLatestMovie } from "../api/tmdb-api";
import PageTemplate from '../components/templateMovieListPage';
import { useQuery } from '@tanstack/react-query';
import Spinner from '../components/spinner';
import AddToFavoritesIcon from '../components/cardIcons/addToFavorites'
import AddToPlaylist from '../components/cardIcons/addToPlaylist'

const LatestMoviePage = (props) => {

  const { data, error, isPending, isError  } = useQuery({
    queryKey: ['latestMovie'],
    queryFn: getLatestMovie,
  })
  
  if (isPending) {
    return <Spinner />
  }

  if (isError) {
    return <h1>{error.message}</h1>
  }  
  
  if (!data) {
    return <Spinner />
  }
  
  // Convert single movie to array for PageTemplate
  const movies = [data];

  const favorites = movies.filter(m => m.favorite)
  localStorage.setItem('favorites', JSON.stringify(favorites))
  const addToFavorites = (movieId) => true 

  return (
    <PageTemplate
      title="Latest Movie"
      movies={movies}
      action={(movie) => {
        console.log('LatestMoviePage action called for movie:', movie.title);
        return (
          <>
            <AddToFavoritesIcon movie={movie} />
            <AddToPlaylist movie={movie} />
          </>
        )
      }}
    />
  );
};

export default LatestMoviePage;
