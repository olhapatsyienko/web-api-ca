import React, { useEffect, useState } from "react";

export const MoviesContext = React.createContext(null);

const MoviesContextProvider = (props) => {
  const [favorites, setFavorites] = useState( [] )
  const [myReviews, setMyReviews] = useState( {} )
  const [mustWatch, setMustWatch] = useState( [] ) 
  const [playlist, setPlaylist] = useState(() => {
    try {
      const stored = localStorage.getItem('playlist');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const addToFavorites = (movie) => {
    let newFavorites = [];
    if (!favorites.includes(movie.id)){
      newFavorites = [...favorites, movie.id];
    }
    else{
      newFavorites = [...favorites];
    }
    setFavorites(newFavorites)
  };
  const addReview = (movie, review) => {
    setMyReviews( {...myReviews, [movie.id]: review } )
  };
  //console.log(myReviews);

  // We will use this function in the next step
  const removeFromFavorites = (movie) => {
    setFavorites( favorites.filter(
      (mId) => mId !== movie.id
    ) )
  };

  const addToMustWatch = (movie) => {
    let newMustWatch = [];
    if (!mustWatch.includes(movie.id)){
      newMustWatch = [...mustWatch, movie.id];
    }
    else{
      newMustWatch = [...mustWatch];
    }
    setMustWatch(newMustWatch);
    console.log('Must Watch list updated:', newMustWatch);
  };

  const addToPlaylist = (movie) => {
    setPlaylist((prev) => {
      if (prev.includes(movie.id)) return prev;
      const next = [...prev, movie.id];
      localStorage.setItem('playlist', JSON.stringify(next));
      return next;
    });
  };

  const removeFromPlaylist = (movie) => {
    setPlaylist((prev) => {
      const next = prev.filter((id) => id !== movie.id);
      localStorage.setItem('playlist', JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    //keep localStorage in sync if playlist changes elsewhere
    localStorage.setItem('playlist', JSON.stringify(playlist));
  }, [playlist]);

  return (
    <MoviesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        addReview,
        mustWatch,
        addToMustWatch,
        playlist,
        addToPlaylist,
        removeFromPlaylist,
      }}
    >
      {props.children}
    </MoviesContext.Provider>
  );
};

export default MoviesContextProvider;
