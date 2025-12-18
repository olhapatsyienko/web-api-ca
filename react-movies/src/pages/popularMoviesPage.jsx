import React, { useState } from "react";
import { getPopularMoviesPage } from "../api/tmdb-api";
import PageTemplate from '../components/templateMovieListPage';
import { useQuery } from '@tanstack/react-query';
import Spinner from '../components/spinner';
import AddToFavoritesIcon from '../components/cardIcons/addToFavorites'
import AddToPlaylist from '../components/cardIcons/addToPlaylist'

const PopularMoviesPage = (props) => {

  const [page, setPage] = useState(1);

  const { data, error, isPending, isError, isFetching  } = useQuery({
    queryKey: ['popular', page, 'CN', 'zh-CN'], 
    queryFn: () => getPopularMoviesPage(page, 'CN', 'zh-CN'),
    keepPreviousData: true,
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
  
  const movies = data.results || [];
  const totalPages = Math.min(data.total_pages || 1, 500);

  const favorites = movies.filter(m => m.favorite)
  localStorage.setItem('favorites', JSON.stringify(favorites))
  const addToFavorites = (movieId) => true 

  return (
    <PageTemplate
      title="Popular Movies in China"
      movies={movies}
      page={page}
      totalPages={totalPages}
      onPageChange={(_, value) => setPage(value)}
      isLoadingMore={isFetching && !isPending}
      action={(movie) => {
        console.log('PopularMoviesPage action called for movie:', movie.title);
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

export default PopularMoviesPage;
