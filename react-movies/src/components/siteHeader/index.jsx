import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router";
import { styled } from '@mui/material/styles';
import { useAuth } from '../../contexts/authContext';

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

const SiteHeader = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const publicMenuOptions = [
    { label: "Home", path: "/" },
    { label: "Trending", path: "/movies/trending" },
    { label: "Latest", path: "/movies/latest" },
    { label: "Top Rated", path: "/movies/top-rated" },
    { label: "Popular", path: "/movies/popular" },
    { label: "Now Playing", path: "/movies/now-playing" },
    { label: "Upcoming", path: "/movies/upcoming" },
  ];

  const authenticatedMenuOptions = [
    ...publicMenuOptions,
    { label: "Favorites", path: "/movies/favorites" },
    { label: "My Playlist", path: "/movies/playlist" },
  ];

  const menuOptions = isAuthenticated ? authenticatedMenuOptions : publicMenuOptions;

  const handleMenuSelect = (pageURL) => {
    setAnchorEl(null);
    navigate(pageURL);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <AppBar 
        position="fixed" 
        color="transparent" 
        sx={{ 
          backgroundColor: (theme) => theme.palette.secondary.dark + 'CC',
          boxShadow: 'none',
          backdropFilter: 'blur(6px)',
          borderBottom: '1px solid rgba(255,255,255,0.12)'
        }}
      >
        <Toolbar>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            TMDB Client
          </Typography>
          
          {isAuthenticated ? (
            <>
              <Typography variant="body1" sx={{ mr: 2 }}>
                Welcome, {user?.username}
              </Typography>
              <Button 
                color="inherit" 
                onClick={handleLogout}
                sx={{ mr: 1 }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button 
                color="inherit" 
                onClick={() => navigate('/login')}
                sx={{ mr: 1 }}
              >
                Login
              </Button>
              <Button 
                color="inherit" 
                onClick={() => navigate('/signup')}
                variant="outlined"
                sx={{ mr: 1 }}
              >
                Sign Up
              </Button>
            </>
          )}

          <IconButton
            aria-label="menu"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={open}
              onClose={() => setAnchorEl(null)}
            >
              {menuOptions.map((opt) => (
                <MenuItem
                  key={opt.label}
                  onClick={() => handleMenuSelect(opt.path)}
                >
                  {opt.label}
                </MenuItem>
              ))}
            </Menu>
        </Toolbar>
      </AppBar>
      <Offset />
    </>
  );
};

export default SiteHeader;
