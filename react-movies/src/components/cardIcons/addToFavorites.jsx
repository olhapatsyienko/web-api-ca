import React, { useContext } from "react";
import { MoviesContext } from "../../contexts/moviesContext";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";

const AddToFavoritesIcon = ({ movie }) => {
  const context = useContext(MoviesContext);

  console.log('AddToFavoritesIcon rendering for movie:', movie.title);

  const isFavorite = context.favorites?.includes?.(movie.id);

  const handleAddToFavorites = (e) => {
    e.preventDefault();
    if (isFavorite) {
      context.removeFromFavorites(movie);
    } else {
      context.addToFavorites(movie);
    }
  };

  return (
    <IconButton aria-label="add to favorites" onClick={handleAddToFavorites}>
      <FavoriteIcon color={isFavorite ? "error" : "primary"} fontSize="large" />
    </IconButton>
  );
};

export default AddToFavoritesIcon;
