import React, { useState, useContext } from "react";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MonetizationIcon from "@mui/icons-material/MonetizationOn";
import StarRate from "@mui/icons-material/StarRate";
import SavingsIcon from "@mui/icons-material/Savings";
import NavigationIcon from "@mui/icons-material/Navigation";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Fab from "@mui/material/Fab";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import MovieReviews from "../../moviesReviews";
import { MoviesContext } from "../../contexts/moviesContext";
import { useAuth } from "../../contexts/authContext";
import Box from "@mui/material/Box";


const root = {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    listStyle: "none",
    padding: 1.5,
    margin: 0,
};
const chip = { margin: 0.5 };

const MovieDetails = ({ movie }) => {  
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { isAuthenticated } = useAuth();
    const { favorites } = useContext(MoviesContext);
    const isFavorite = favorites?.includes(movie.id);

  return (
    <>
      {isAuthenticated && isFavorite && (
        <Box sx={{ mb: 2 }}>
          <Chip
            icon={<FavoriteIcon />}
            label="In your favorites"
            color="error"
            sx={{ mr: 1, mb: 1 }}
          />
        </Box>
      )}
      <Typography variant="h5" component="h3">
        Overview
      </Typography>

      <Typography variant="h6" component="p">
        {movie.overview}
      </Typography>

      <Paper 
        component="ul" 
        sx={{...root}}
      >
        <li>
          <Chip label="Genres" sx={{...chip}} color="primary" />
        </li>
        {movie.genres.map((g) => (
          <li key={g.name}>
            <Chip label={g.name} sx={{...chip}} />
          </li>
        ))}
      </Paper>
      <Paper component="ul" sx={{...root}}>
        <Chip icon={<AccessTimeIcon />} label={`${movie.runtime} min.`} />
        <Chip
          icon={<SavingsIcon />}
          label={`Budget: ${Math.round(movie.budget / 1000000)}m`}
        />
        <Chip
          icon={<MonetizationIcon />}
          label={`Revenue: ${movie.revenue.toLocaleString()}`}
        />
        <Chip
          icon={<StarRate />}
          label={`${movie.vote_average} (${movie.vote_count})`}
        />
        <Chip label={`Released: ${movie.release_date}`} />
      </Paper>
      <Paper 
        component="ul" 
        sx={{...root}}
      >
        <li>
          <Chip label="Production Countries" sx={{...chip}} color="primary" />
        </li>
        {movie.production_countries?.map((country) => (
          <li key={country.iso_3166_1}>
            <Chip label={country.name} sx={{...chip}} />
          </li>
        ))}
      </Paper>
      <Paper 
        component="ul" 
        sx={{...root}}
      > 
        <li>
          <Chip label="Languages" sx={{...chip}} color="primary" />
        </li>
        {movie.spoken_languages?.map((language) => (
          <li key={language.iso_639_1}>
            <Chip label={language.name} sx={{...chip}} />
          </li>
        ))}
      </Paper>
      <Fab
        color="secondary"
        variant="extended"
        onClick={() =>setDrawerOpen(true)}
        sx={{
          position: 'fixed',
          bottom: '1em',
          right: '1em'
        }}
      >
        <NavigationIcon />
        Reviews
      </Fab>
      <Drawer anchor="top" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <MovieReviews movie={movie} />
      </Drawer>

         </>
  );
};
export default MovieDetails ;
