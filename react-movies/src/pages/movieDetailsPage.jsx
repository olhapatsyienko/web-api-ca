import React from "react";
import { useParams, Link } from 'react-router';
import MovieDetails from "../components/movieDetails/";
import PageTemplate from "../components/templateMoviePage";
import { getMovie, getMovieRecommendations, getMovieCredits } from '../api/tmdb-api'
import { useQuery } from '@tanstack/react-query';
import Spinner from '../components/spinner'
import MovieList from '../components/movieList';
import AddToFavoritesIcon from '../components/cardIcons/addToFavorites';
import AddToPlaylist from '../components/cardIcons/addToPlaylist';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Avatar from '@mui/material/Avatar';
// import useMovie from "../hooks/useMovie";   Redundant


const MoviePage = (props) => {
  const { id } = useParams();
  const { data: movie, error, isPending, isError  } = useQuery({
    queryKey: ['movie', {id: id}],
    queryFn: () => getMovie(id),
  })

  const { data: recommendations, error: recError, isPending: recPending, isError: recIsError } = useQuery({
    queryKey: ['recommendations', {id: id}],
    queryFn: () => getMovieRecommendations(id),
    enabled: !!id,
  })

  const { data: credits, error: creditsError, isPending: creditsPending, isError: creditsIsError } = useQuery({
    queryKey: ['credits', {id: id}],
    queryFn: () => getMovieCredits(id),
    enabled: !!id,
  })

  if (isPending) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }


  return (
    <>
      {movie ? (
        <>
          <PageTemplate movie={movie}>
            <MovieDetails movie={movie} />
          </PageTemplate>
          
          {credits && (
            <Box sx={{ padding: "20px", marginTop: "40px" }}>
              <Typography variant="h4" component="h2" sx={{ marginBottom: "20px", fontWeight: "bold" }}>
                Cast & Crew
              </Typography>
              
              {credits.cast && credits.cast.length > 0 && (
                <Box sx={{ marginBottom: "40px" }}>
                  <Typography variant="h5" component="h3" sx={{ marginBottom: "15px", fontWeight: "bold" }}>
                    Cast
                  </Typography>
                  <Grid container spacing={2}>
                    {credits.cast.slice(0, 12).map((person) => (
                      <Grid key={person.id} size={{xs: 6, sm: 4, md: 3, lg: 2}}>
                        <Link to={`/person/${person.id}`} style={{ textDecoration: 'none' }}>
                          <Card sx={{ 
                            height: '100%', 
                            display: 'flex', 
                            flexDirection: 'column',
                            cursor: 'pointer',
                            '&:hover': {
                              transform: 'scale(1.05)',
                              transition: 'transform 0.2s ease-in-out',
                              boxShadow: 4
                            }
                          }}>
                            <CardMedia
                              sx={{ height: 200, flexShrink: 0 }}
                              image={
                                person.profile_path
                                  ? `https://image.tmdb.org/t/p/w300/${person.profile_path}`
                                  : '/api/placeholder/300/450'
                              }
                            />
                            <CardContent sx={{ flexGrow: 1, padding: '8px' }}>
                              <Typography variant="subtitle2" component="p" sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}>
                                {person.name}
                              </Typography>
                              <Typography variant="caption" component="p" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                                {person.character}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Link>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {credits.crew && credits.crew.length > 0 && (
                <Box>
                  <Typography variant="h5" component="h3" sx={{ marginBottom: "15px", fontWeight: "bold" }}>
                    Crew
                  </Typography>
                  <Grid container spacing={2}>
                    {credits.crew.filter(person => ['Director', 'Writer', 'Producer'].includes(person.job)).slice(0, 12).map((person) => (
                      <Grid key={person.id} size={{xs: 6, sm: 4, md: 3, lg: 2}}>
                        <Link to={`/person/${person.id}`} style={{ textDecoration: 'none' }}>
                          <Card sx={{ 
                            height: '100%', 
                            display: 'flex', 
                            flexDirection: 'column',
                            cursor: 'pointer',
                            '&:hover': {
                              transform: 'scale(1.05)',
                              transition: 'transform 0.2s ease-in-out',
                              boxShadow: 4
                            }
                          }}>
                            <CardMedia
                              sx={{ height: 200, flexShrink: 0 }}
                              image={
                                person.profile_path
                                  ? `https://image.tmdb.org/t/p/w300/${person.profile_path}`
                                  : '/api/placeholder/300/450'
                              }
                            />
                            <CardContent sx={{ flexGrow: 1, padding: '8px' }}>
                              <Typography variant="subtitle2" component="p" sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}>
                                {person.name}
                              </Typography>
                              <Typography variant="caption" component="p" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                                {person.job}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Link>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Box>
          )}

          {recommendations && recommendations.length > 0 && (
            <Box sx={{ padding: "20px", marginTop: "40px" }}>
              <Typography variant="h4" component="h2" sx={{ marginBottom: "20px", fontWeight: "bold" }}>
                Recommended Movies
              </Typography>
              <MovieList 
                action={(movie) => {
                  console.log('MovieDetailsPage recommendations action called for movie:', movie.title);
                  return (
                    <>
                      <AddToFavoritesIcon movie={movie} />
                      <AddToPlaylist movie={movie} />
                    </>
                  )
                }} 
                movies={recommendations} 
              />
            </Box>
          )}
        </>
      ) : (
        <p>Waiting for movie details</p>
      )}
    </>
  );
};

export default MoviePage;
