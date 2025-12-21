import React, { useEffect, useState, useContext }  from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import StarRateIcon from "@mui/icons-material/StarRate";
import { Link } from "react-router";
import { getMovieReviews } from "../api/tmdb-api";
import { excerpt } from "../util";
import { MoviesContext } from "../contexts/moviesContext";
import { useAuth } from "../contexts/authContext";

export default function MovieReviews({ movie }) {
  const [reviews, setReviews] = useState([]);
  const { isAuthenticated } = useAuth();
  const { myReviews } = useContext(MoviesContext);
  const userReview = myReviews?.[movie.id];

  useEffect(() => {
    getMovieReviews(movie.id).then((reviews) => {
      setReviews(reviews);
    });
  }, [movie.id]);

  return (
    <Box sx={{ p: 2 }}>
      {isAuthenticated && userReview && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" component="h3" sx={{ mr: 2 }}>
              Your Review
            </Typography>
            {userReview.rating && (
              <Chip
                icon={<StarRateIcon />}
                label={`${userReview.rating}/10`}
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
              />
            )}
          </Box>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {userReview.comment || 'no comment provided'}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            By: {userReview.author || 'You'}
          </Typography>
        </Paper>
      )}
      <TableContainer component={Paper}>
        <Table sx={{minWidth: 550}} aria-label="reviews table">
          <TableHead>
            <TableRow>
              <TableCell>Author</TableCell>
              <TableCell align="center">Excerpt</TableCell>
              <TableCell align="right">More</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviews.map((r) => (
              <TableRow key={r.id}>
                <TableCell component="th" scope="row">
                  {r.author}
                </TableCell>
                <TableCell>{excerpt(r.content)}</TableCell>
                <TableCell>
                  <Link
                    to={`/reviews/${r.id}`}
                    state={{
                      review: r,
                      movie: movie,
                    }}
                  >
                    Full Review
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
