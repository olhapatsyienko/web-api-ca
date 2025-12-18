import React, { useContext  } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CalendarIcon from "@mui/icons-material/CalendarTodayTwoTone";
import StarRateIcon from "@mui/icons-material/StarRate";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import img from '../../images/film-poster-placeholder.png'
import { Link } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import { MoviesContext } from "../../contexts/moviesContext";
import AddToPlaylist from "../cardIcons/addToPlaylist";



export default function MovieCard({ movie, action }) {

  const context = useContext(MoviesContext);
  
  if (!context) {
    return <div>Loading...</div>;
  }
  
  const { favorites, addToFavorites } = context;

  if (favorites.find((id) => id === movie.id)) {
    movie.favorite = true;
  } else {
    movie.favorite = false
  }

  const handleAddToFavorite = (e) => {
    e.preventDefault();
    addToFavorites(movie);
  };


  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      width: '100%'
    }}>
      <CardHeader
        title={
          <Typography 
            variant="h5" 
            component="p"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.2,
              height: '2.4em'
            }}
          >
            {movie.title}
          </Typography>
        }
        sx={{ 
          height: '80px',
          '& .MuiCardHeader-content': {
            overflow: 'hidden'
          }
        }}
      />

      <CardMedia
        sx={{ height: 350, flexShrink: 0 }}
        image={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
            : img
        }
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack spacing={0.5}>
          <Typography
            variant="subtitle1"
            component="p"
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            <CalendarIcon fontSize="small" />
            {movie.release_date || 'Unknown'}
          </Typography>
          <Typography
            variant="subtitle1"
            component="p"
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            <StarRateIcon fontSize="small" />
            {movie.vote_average ?? 'N/A'}
          </Typography>
        </Stack>
      </CardContent>
      <CardActions disableSpacing sx={{ mt: 'auto' }}>
      
      {action && typeof action === 'function' ? (
        <>
          {console.log('MovieCard calling action for:', movie.title, 'action type:', typeof action)}
          {action(movie)}
        </>
      ) : (
        console.log('MovieCard action is not a function:', typeof action, action)
      )}
    
      <Link to={`/movies/${movie.id}`}>
        <Button variant="outlined" size="medium" color="primary">
          More Info ...
        </Button>
      </Link>
      
    </CardActions>

    </Card>
  );
}
