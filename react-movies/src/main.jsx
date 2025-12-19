import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import HomePage from "./pages/homePage";
import MoviePage from "./pages/movieDetailsPage";
import FavoriteMoviesPage from "./pages/favouriteMoviesPage";
import MovieReviewPage from "./pages/movieReviewPage";
import TopRatedMoviesPage from "./pages/topRatedMoviesPage";
import NowPlayingMoviesPage from "./pages/nowPlayingMoviesPage";
import PopularMoviesPage from "./pages/popularMoviesPage";
import UpcomingMoviesPage from "./pages/upcomingMoviesPage";
import TrendingMoviesPage from "./pages/trendingMoviesPage";
import LatestMoviePage from "./pages/latestMoviePage";
import PersonDetailsPage from "./pages/personDetailsPage";
import PlaylistPage from "./pages/playlistPage";
import LoginPage from "./pages/loginPage";
import SignupPage from "./pages/signupPage";
import SiteHeader from './components/siteHeader'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import MoviesContextProvider from "./contexts/moviesContext";
import { AuthProvider } from "./contexts/authContext";
import AddMovieReviewPage from './pages/addMovieReviewPage'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 360000,
      refetchInterval: 360000, 
      refetchOnWindowFocus: false
    },
  },
});


const darkNeonTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#7c4dff' },
    secondary: { main: '#8e24aa' },
    background: { default: '#0b0614', paper: '#0f0a18' }
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: 'Inter, system-ui, Roboto, Helvetica, Arial, sans-serif',
    h4: { fontWeight: 700 }
  }
});

const App = () => {
  return (
    <ThemeProvider theme={darkNeonTheme}>
      <CssBaseline />
      <GlobalStyles styles={{ 
        body: {
          background: 'radial-gradient(1000px 600px at 10% -10%, rgba(124,77,255,0.25) 0%, rgba(124,77,255,0) 60%), radial-gradient(900px 500px at 120% 0%, rgba(142,36,170,0.25) 0%, rgba(142,36,170,0) 60%), linear-gradient(180deg, #0b0614 0%, #12091f 60%, #1a0f2b 100%)',
          minHeight: '100vh'
        },
        '.MuiCard-root': {
          background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 10px 30px rgba(124,77,255,0.25)',
          borderRadius: 16,
          backdropFilter: 'blur(8px)'
        },
        '.MuiButton-root': {
          borderRadius: 999,
          boxShadow: '0 8px 20px rgba(124,77,255,0.25)'
        }
      }} />
      <BrowserRouter>
        <SiteHeader />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/reviews/:id" element={ <MovieReviewPage /> } />
          <Route path="/reviews/form" element={<AddMovieReviewPage />} />
          <Route path="/movies/favorites" element={<FavoriteMoviesPage />} />
          <Route path="/movies/playlist" element={<PlaylistPage />} />
          <Route path="/movies/top-rated" element={<TopRatedMoviesPage />} />
          <Route path="/movies/popular" element={<PopularMoviesPage />} />
          <Route path="/movies/now-playing" element={<NowPlayingMoviesPage />} />
          <Route path="/movies/upcoming" element={<UpcomingMoviesPage />} />
          <Route path="/movies/trending" element={<TrendingMoviesPage />} />
          <Route path="/movies/latest" element={<LatestMoviePage />} />
          <Route path="/person/:id" element={<PersonDetailsPage />} />
          <Route path="/movies/:id" element={<MoviePage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={ <Navigate to="/" /> } />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>

  );
};


const rootElement = createRoot( document.getElementById("root") )
rootElement.render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <MoviesContextProvider>
        <div id="app-gradient-bg" style={{
          position: 'relative',
          minHeight: '100vh',
          background: 'radial-gradient(1200px 700px at 15% 0%, rgba(124,77,255,0.3) 0%, rgba(124,77,255,0) 60%), radial-gradient(1000px 600px at 120% 10%, rgba(142,36,170,0.28) 0%, rgba(142,36,170,0) 60%), linear-gradient(180deg, #08030f 0%, #0f061a 50%, #170b25 100%)'
        }}>
          <App />
          <ReactQueryDevtools initialIsOpen={false} />
        </div>
      </MoviesContextProvider>
    </AuthProvider>
  </QueryClientProvider>
);
