import React from "react";
import Movie from "../movieCard";
import Grid from "@mui/material/Grid";

const MovieList = (props) => {
  console.log('MovieList received action:', typeof props.action, props.action);
  
  let movieCards = props.movies.map((m) => (
    <Grid key={m.id} size={{xs: 12, sm: 6, md: 6, lg: 4, xl: 3}} sx={{padding: "20px"}}>
              <Movie key={m.id} movie={m} action={props.action} />
    </Grid>
  ));
  return (
    <Grid container>
      {movieCards}
    </Grid>
  );
};

export default MovieList;
