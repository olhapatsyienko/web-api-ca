import React from "react";
import { useParams } from 'react-router';
import { getPerson, getPersonMovieCredits } from '../api/tmdb-api';
import { useQuery } from '@tanstack/react-query';
import Spinner from '../components/spinner';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import MovieList from '../components/movieList';
import AddToFavoritesIcon from '../components/cardIcons/addToFavorites';
import img from '../images/film-poster-placeholder.png';

const PersonDetailsPage = (props) => {
  const { id } = useParams();

  const { data: person, error, isPending, isError } = useQuery({
    queryKey: ['person', { id: id }],
    queryFn: () => getPerson(id),
  });

  const { data: movieCredits, error: creditsError, isPending: creditsPending } = useQuery({
    queryKey: ['personMovieCredits', { id: id }],
    queryFn: () => getPersonMovieCredits(id),
    enabled: !!id,
  });

  if (isPending) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  if (!person) {
    return <Spinner />;
  }

  //combine cast and crew films, no duplicates
  const allMovies = movieCredits ? [
    ...(movieCredits.cast || []),
    ...(movieCredits.crew || []).filter(crewMovie => 
      !(movieCredits.cast || []).some(castMovie => castMovie.id === crewMovie.id)
    )
  ] : [];

  return (
    <Box sx={{ padding: "20px" }}>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, sm: 4, md: 3 }}>
          <Card>
            <CardMedia
              sx={{ height: 600 }}
              image={
                person.profile_path
                  ? `https://image.tmdb.org/t/p/w500/${person.profile_path}`
                  : img
              }
            />
            <CardContent>
              <Typography variant="h5" component="h2" sx={{ fontWeight: "bold", marginBottom: "10px" }}>
                {person.name}
              </Typography>
              {person.known_for_department && (
                <Typography variant="body2" color="text.secondary" sx={{ marginBottom: "10px" }}>
                  {person.known_for_department}
                </Typography>
              )}
              {person.birthday && (
                <Typography variant="body2" sx={{ marginBottom: "5px" }}>
                  <strong>Born:</strong> {person.birthday}
                </Typography>
              )}
              {person.place_of_birth && (
                <Typography variant="body2" sx={{ marginBottom: "5px" }}>
                  <strong>Place of birth:</strong> {person.place_of_birth}
                </Typography>
              )}
              {person.biography && (
                <Box sx={{ marginTop: "20px" }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "10px" }}>
                    Biography
                  </Typography>
                  <Typography variant="body2" sx={{ textAlign: "justify" }}>
                    {person.biography || "No biography available."}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 8, md: 9 }}>
          <Typography variant="h4" component="h2" sx={{ marginBottom: "20px", fontWeight: "bold" }}>
            Movie сredits
          </Typography>

          {creditsPending ? (
            <Spinner />
          ) : allMovies.length > 0 ? (
            <MovieList
              action={(movie) => {
                return <AddToFavoritesIcon movie={movie} />;
              }}
              movies={allMovies}
            />
          ) : (
            <Typography variant="body1">No movie credits available</Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default PersonDetailsPage;

