import React, {useState, useEffect}  from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { getGenres } from "../../api/tmdb-api";
import { useQuery } from '@tanstack/react-query';
import Spinner from '../spinner';


const formControl = 
  {
    margin: 1,
    minWidth: "90%",
    '& .MuiFilledInput-root': {
      backgroundColor: "rgba(255, 255, 255, 0.08)",
      borderRadius: 14,
      border: "1px solid rgba(255,255,255,0.12)",
      transition: "all .25s ease",
      '&:hover': {
        backgroundColor: "rgba(255, 255, 255, 0.12)",
      },
      '&:before, &:after': {
        display: 'none'
      },
      '&.Mui-focused': {
        backgroundColor: "rgba(255,255,255,0.16)",
        boxShadow: "0 0 0 3px rgba(124, 77, 255, 0.35)",
        borderColor: "transparent"
      }
    },
    '& .MuiFilledInput-input': {
      color: '#f3e5ff',
      textAlign: 'center',
      padding: '14px 16px',
      fontWeight: 500
    },
    '& .MuiSelect-select': {
      textAlign: 'center'
    },
    '& .MuiSelect-icon': {
      color: '#d1c4ff'
    }
  };

export default function FilterMoviesCard(props) {

  const { data, error, isPending, isError } = useQuery({
    queryKey: ['genres'],
    queryFn: getGenres,
    retry: 3,
    retryDelay: 1000,
  });

  if (isPending) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }
  
  if (!data) {
    return <Spinner />;
  }
  
  const genres = [...data];

  const handleChange = (e, type, value) => {
    e.preventDefault();
    props.onUserInput(type, value); 
  };

  const handleTextChange = (e, props) => {
    handleChange(e, "name", e.target.value);
  };

  const handleGenreChange = (e) => {
    handleChange(e, "genre", e.target.value);
  };

  const handleYearChange = (e) => {
    handleChange(e, "year", e.target.value);
  };

  const handleRatingChange = (e) => {
    handleChange(e, "rating", e.target.value);
  };

  const handleSortByChange = (e) => {
    handleChange(e, "sortBy", e.target.value);
  };

  const handleSortOrderChange = (e) => {
    handleChange(e, "sortOrder", e.target.value);
  };

  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= 1900; year--) {
    years.push(year.toString());
  }
  const ratingOptions = [
    { value: "", label: "All ratings" },
    { value: "8", label: "8.0 and above" },
    { value: "7", label: "7.0 and above" },
    { value: "6", label: "6.0 and above" },
    { value: "5", label: "5.0 and above" },
    { value: "0", label: "Below 5.0" },
  ];

  const sortByOptions = [
    { value: 'popularity', label: 'Popularity' },
    { value: 'vote_average', label: 'Rating' },
    { value: 'vote_count', label: 'Vote count' },
    { value: 'release_date', label: 'Release date' },
    { value: 'title', label: 'Title' },
  ];
  const sortOrderOptions = [
    { value: 'desc', label: 'Descending' },
    { value: 'asc', label: 'Ascending' },
  ];


  return (
    <Card 
      sx={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 14px 34px rgba(124,77,255,0.28)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }} 
      variant="outlined">
      <CardContent>
        <Typography variant="h5" component="h1">
          <SearchIcon fontSize="large" />
          Filter the movies.
        </Typography>
        <TextField
          sx={{...formControl}}
          id="filled-search"
          key="titleFilter"
          label="Search field"
          type="search"
          variant="filled"
          value={props.titleFilter}
          onChange={handleTextChange}
          InputProps={{ disableUnderline: true, sx: { textAlign: 'center' } }}
        />

        <FormControl sx={{...formControl}} variant="filled">
          <Select
             id="genre-select"
             defaultValue=""
             value={props.genreFilter || ""}
             onChange={handleGenreChange}
             variant="filled"
             disableUnderline
             displayEmpty
            >
            <MenuItem value="">All genres</MenuItem>
            {genres.map((genre) => {
              return (
                <MenuItem key={genre.id} value={genre.id}>
                  {genre.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <FormControl sx={{...formControl}} variant="filled">
          <Select
             id="year-select"
             defaultValue=""
             value={props.yearFilter || ""}
             onChange={handleYearChange}
             variant="filled"
             disableUnderline
             displayEmpty
            >
            <MenuItem value="">All years</MenuItem>
            {years.map((year) => {
              return (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <FormControl sx={{...formControl}} variant="filled">
          <Select
             id="rating-select"
             defaultValue=""
             value={props.ratingFilter || ""}
             onChange={handleRatingChange}
             variant="filled"
             disableUnderline
             displayEmpty
            >
            {ratingOptions.map((option) => {
              return (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <FormControl sx={{...formControl}} variant="filled">
          <Select
             id="sortby-select"
             defaultValue=""
             value={props.sortBy || ''}
             onChange={handleSortByChange}
             variant="filled"
             disableUnderline
             displayEmpty
            >
            <MenuItem value="">Sort by</MenuItem>
            {sortByOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{...formControl}} variant="filled">
          <Select
             id="sortorder-select"
             defaultValue=""
             value={props.sortOrder || ''}
             onChange={handleSortOrderChange}
             variant="filled"
             disableUnderline
             displayEmpty
            >
            <MenuItem value="">Order</MenuItem>
            {sortOrderOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </CardContent>
    </Card>
  );
}
