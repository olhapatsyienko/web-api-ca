import React, { useContext, useState } from "react";
import { MoviesContext } from "../../contexts/moviesContext";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CircularProgress from "@mui/material/CircularProgress";

const AddToFavoritesIcon = ({ movie }) => {
  const context = useContext(MoviesContext);
  const [isProcessing, setIsProcessing] = useState(false);

  const isFavorite = context.favorites?.includes?.(movie.id);

  const handleAddToFavorites = async (e) => {
    e.preventDefault();
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      if (isFavorite) {
        await context.removeFromFavorites(movie);
      } else {
        await context.addToFavorites(movie);
      }
    } catch (error) {
      console.error("failed to update favorites:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <IconButton 
      aria-label={isFavorite ? "remove from favorites" : "add to favorites"} 
      onClick={handleAddToFavorites}
      disabled={isProcessing}
    >
      {isProcessing ? (
        <CircularProgress size={24} />
      ) : (
        <FavoriteIcon color={isFavorite ? "error" : "primary"} fontSize="large" />
      )}
    </IconButton>
  );
};

export default AddToFavoritesIcon;
