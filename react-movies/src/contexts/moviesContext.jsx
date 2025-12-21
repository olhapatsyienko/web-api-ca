import React, { useEffect, useState, useContext } from "react";
import { useAuth } from "./authContext";
import {
  getUserMovies,
  getFavorites,
  getPlaylist,
  getReviews,
  addUserMovie,
  deleteUserMovie,
  updateUserMovie,
} from "../api/user-movies-api";

export const MoviesContext = React.createContext(null);

const MoviesContextProvider = (props) => {
  const { isAuthenticated, token } = useAuth();
  
  const [favorites, setFavorites] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [myReviews, setMyReviews] = useState({});
  const [mustWatch, setMustWatch] = useState([]); 
  
  const [favoritesEntries, setFavoritesEntries] = useState([]);
  const [playlistEntries, setPlaylistEntries] = useState([]);
  const [reviewsEntries, setReviewsEntries] = useState([]);  
  const [isLoading, setIsLoading] = useState(false);

 //load user data from API when authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      loadUserData();
    }
  }, [isAuthenticated, token]);

  //load all user-specific movie data from the API
  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const [favoritesData, playlistData, reviewsData] = await Promise.all([
        getFavorites().catch(() => []),
        getPlaylist().catch(() => []),
        getReviews().catch(() => []),
      ]);

      //update favorites
      const favoriteIds = favoritesData.map((entry) => entry.movieId);
      setFavorites(favoriteIds);
      setFavoritesEntries(favoritesData);

      //update playlist
      const playlistIds = playlistData.map((entry) => entry.movieId);
      setPlaylist(playlistIds);
      setPlaylistEntries(playlistData);

    //update reviews
      const reviewsObj = {};
      reviewsData.forEach((entry) => {
        if (entry.review) {
          reviewsObj[entry.movieId] = {
            rating: entry.review.rating,
            comment: entry.review.comment,
            author: entry.review.author || "Anonymous",
            entryId: entry._id,
          };
        }
      });
      setMyReviews(reviewsObj);
      setReviewsEntries(reviewsData);
    } catch (error) {
      console.error("Failed to load user data:", error);
    } finally {
      setIsLoading(false);
    }
  };


  const addToFavorites = async (movie) => {
    if (!isAuthenticated) {
      console.error("user must be authenticated to add favorites");
      return;
    }

    try {
      
      if (favorites.includes(movie.id)) {
        return;
      }

      const entry = await addUserMovie(movie.id, "favorite");
      
      //update both simplified array and full entries array
      setFavorites((prev) => [...prev, movie.id]);
      setFavoritesEntries((prev) => [...prev, entry]);
    } catch (error) {
      console.error("Failed to add to favorites:", error);
      throw error;
    }
  };

  const removeFromFavorites = async (movie) => {
    if (!isAuthenticated) {
      console.error("User must be authenticated to remove favorites");
      return;
    }

    try {
      //find the full entry to get the _id needed for API delete
      const entry = favoritesEntries.find((e) => e.movieId === movie.id);
      if (entry) {
        //call API to delete from database
        await deleteUserMovie(entry._id);        
        setFavorites((prev) => prev.filter((id) => id !== movie.id));
        setFavoritesEntries((prev) => prev.filter((e) => e._id !== entry._id));
      }
    } catch (error) {
      console.error("failed to remove from favorites:", error);
      throw error;
    }
  };

  const addReview = async (movie, review) => {
    if (!isAuthenticated) {
      console.error("User must be authenticated to add reviews");
      return;
    }

    try {
      const reviewData = {
        rating: review.rating,
        comment: review.review || review.comment || "",
      };

      const existingEntry = reviewsEntries.find((e) => e.movieId === movie.id);
      
      if (existingEntry) {
        const updated = await updateUserMovie(existingEntry._id, { review: reviewData });
        setMyReviews((prev) => ({
          ...prev,
          [movie.id]: {
            rating: reviewData.rating,
            comment: reviewData.comment,
            author: review.author || "Anonymous",
            entryId: existingEntry._id,
          },
        }));
        setReviewsEntries((prev) =>
          prev.map((e) => (e._id === existingEntry._id ? updated : e))
        );
      } else {
        // Create new review using POST
        const entry = await addUserMovie(movie.id, "review", reviewData);
        setMyReviews((prev) => ({
          ...prev,
          [movie.id]: {
            rating: reviewData.rating,
            comment: reviewData.comment,
            author: review.author || "Anonymous",
            entryId: entry._id,
          },
        }));
        setReviewsEntries((prev) => [...prev, entry]);
      }
    } catch (error) {
      console.error("Failed to add review:", error);
      throw error;
    }
  };

  const addToMustWatch = (movie) => {
    let newMustWatch = [];
    if (!mustWatch.includes(movie.id)) {
      newMustWatch = [...mustWatch, movie.id];
    } else {
      newMustWatch = [...mustWatch];
    }
    setMustWatch(newMustWatch);
    console.log("Must Watch list updated:", newMustWatch);
  };

  const addToPlaylist = async (movie) => {
    if (!isAuthenticated) {
      console.error("User must be authenticated to add to playlist");
      return;
    }

    try {
      if (playlist.includes(movie.id)) {
        return;
      }
      const entry = await addUserMovie(movie.id, "playlist");      
      setPlaylist((prev) => [...prev, movie.id]);
      setPlaylistEntries((prev) => [...prev, entry]);
    } catch (error) {
      console.error("Failed to add to playlist:", error);
      throw error;
    }
  };
  const removeFromPlaylist = async (movie) => {
    if (!isAuthenticated) {
      console.error("User must be authenticated to remove from playlist");
      return;
    }

    try {
      const entry = playlistEntries.find((e) => e.movieId === movie.id);
      if (entry) {
        await deleteUserMovie(entry._id);        
        setPlaylist((prev) => prev.filter((id) => id !== movie.id));
        setPlaylistEntries((prev) => prev.filter((e) => e._id !== entry._id));
      }
    } catch (error) {
      console.error("failed to remove from playlist:", error);
      throw error;
    }
  };

  return (
    <MoviesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        addReview,
        myReviews,
        mustWatch,
        addToMustWatch,
        playlist,
        addToPlaylist,
        removeFromPlaylist,
        isLoading,
      }}
    >
      {props.children}
    </MoviesContext.Provider>
  );
};

export default MoviesContextProvider;
