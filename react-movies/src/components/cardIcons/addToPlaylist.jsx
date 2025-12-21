import React, { useContext, useMemo, useState } from "react";
import IconButton from "@mui/material/IconButton";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import { MoviesContext } from "../../contexts/moviesContext";
import CircularProgress from "@mui/material/CircularProgress";

const AddToPlaylist = ({ movie }) => {
  const { playlist, addToPlaylist, removeFromPlaylist } = useContext(MoviesContext);
  const [isProcessing, setIsProcessing] = useState(false);
  const isInPlaylist = useMemo(() => playlist.includes(movie.id), [playlist, movie.id]);

  const handleToggle = async (e) => {
    e.preventDefault();
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      if (isInPlaylist) {
        await removeFromPlaylist(movie);
      } else {
        await addToPlaylist(movie);
      }
    } catch (error) {
      console.error("failed to update playlist:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <IconButton 
      aria-label={isInPlaylist ? "remove from playlist" : "add to playlist"} 
      onClick={handleToggle}
      disabled={isProcessing}
    >
      {isProcessing ? (
        <CircularProgress size={24} />
      ) : isInPlaylist ? (
        <PlaylistAddCheckIcon color="success" fontSize="large" />
      ) : (
        <PlaylistAddIcon color="primary" fontSize="large" />
      )}
    </IconButton>
  );
};

export default AddToPlaylist;


