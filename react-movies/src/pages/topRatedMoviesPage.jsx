import React, { useState } from "react";
import PageTemplate from '../components/templateMovieListPage'
import { getTopRatedMoviesPage } from "../api/tmdb-api";
import { useQuery } from '@tanstack/react-query';
import Spinner from '../components/spinner';
import AddToFavoritesIcon from '../components/cardIcons/addToFavorites'
import AddToPlaylist from '../components/cardIcons/addToPlaylist'

const TopRatedMoviesPage = (props) => {
  const [page, setPage] = useState(1);
  const { data, error, isPending, isError, isFetching  } = useQuery({
    queryKey: ['topRated', page],
    queryFn: () => getTopRatedMoviesPage(page),
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

  return (
    <PageTemplate
      title='Top Rated Movies'
      movies={movies}
      page={page}
      totalPages={totalPages}
      onPageChange={(_, value) => setPage(value)}
      isLoadingMore={isFetching && !isPending}
      action={(movie) => {
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
export default TopRatedMoviesPage;

