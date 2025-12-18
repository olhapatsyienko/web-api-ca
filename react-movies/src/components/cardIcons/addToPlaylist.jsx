import React, { useContext, useMemo } from "react";
import IconButton from "@mui/material/IconButton";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import { MoviesContext } from "../../contexts/moviesContext";
import { useMutation } from '@tanstack/react-query';

const AddToPlaylist = ({ movie }) => {
  const { playlist, addToPlaylist, removeFromPlaylist } = useContext(MoviesContext);
  const isInPlaylist = useMemo(() => playlist.includes(movie.id), [playlist, movie.id]);

  const mutation = useMutation({
    mutationFn: async () => ({ id: movie.id }),
    onMutate: () => {
      if (isInPlaylist) {
        removeFromPlaylist(movie);
      } else {
        addToPlaylist(movie);
      }
    },
  });

  const handleToggle = (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <IconButton aria-label={isInPlaylist ? "remove from playlist" : "add to playlist"} onClick={handleToggle}>
      {isInPlaylist ? (
        <PlaylistAddCheckIcon color="success" fontSize="large" />
      ) : (
        <PlaylistAddIcon color="primary" fontSize="large" />
      )}
    </IconButton>
  );
};

export default AddToPlaylist;


