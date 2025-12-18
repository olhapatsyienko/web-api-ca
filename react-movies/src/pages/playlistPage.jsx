import React, { useContext } from "react";
import PageTemplate from "../components/templateMovieListPage";
import { MoviesContext } from "../contexts/moviesContext";
import { useQueries } from "@tanstack/react-query";
import { getMovie } from "../api/tmdb-api";
import Spinner from '../components/spinner' ;
import AddToPlaylist from "../components/cardIcons/addToPlaylist";
import AddToFavoritesIcon from "../components/cardIcons/addToFavorites";

const PlaylistPage = () => {
  const { playlist: movieIds } = useContext(MoviesContext);

  const playlistQueries = useQueries({
    queries: movieIds.map((movieId) => ({
      queryKey: ['movie', { id: movieId }],
      queryFn: () => getMovie(movieId),
    }))
  });

  const isPending = playlistQueries.find((m) => m.isPending === true);
  if (isPending) {
    return <Spinner />;
  }

  const movies = playlistQueries
    .filter((q) => q.data && q.data.genres)
    .map((q) => {
      q.data.genre_ids = q.data.genres.map(g => g.id);
      return q.data;
    });

  return (
    <PageTemplate
      title="My Playlist"
      movies={movies}
      action={(movie) => (
        <>
          <AddToFavoritesIcon movie={movie} />
          <AddToPlaylist movie={movie} />
        </>
      )}
    />
  );
};

export default PlaylistPage;


