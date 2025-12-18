import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const validateUsername = (username) => {
    if (!username.trim()) {
      return 'Username is required';
    }
    if (username.trim().length < 3) {
      return 'Username must be at least 3 characters long';
    }
    if (username.trim().length > 20) {
      return 'Username must be less than 20 characters';
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
      return 'Username can only contain letters, numbers and underscores';
    }
    return null;
  };

  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[A-Za-z])/.test(password)) {
      return 'Password must contain at least one letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one digit';
    }
    if (!/(?=.*[@$!%*#?&])/.test(password)) {
      return 'Password must contain at least one special character (@$!%*#?&)';
    }
    return null;
  };

  const validateForm = () => {
    const usernameError = validateUsername(username);
    if (usernameError) {
      setError(usernameError);
      return false;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    const result = await signup(username.trim(), password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Signup failed. Please try again.');
    }
    setIsSubmitting(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Sign Up
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError('');
            }}
            margin="normal"
            required
            disabled={isSubmitting}
            autoFocus
            helperText="3-20 characters, letters, numbers and underscores only"
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            margin="normal"
            required
            disabled={isSubmitting}
            helperText="At least 8 characters with one letter, one digit and one special character (@$!%*#?&)"
          />

          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError('');
            }}
            margin="normal"
            required
            disabled={isSubmitting}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Sign Up'}
          </Button>

          <Box textAlign="center">
            <Typography variant="body2">
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#7c4dff' }}>
                Login
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignupPage;

