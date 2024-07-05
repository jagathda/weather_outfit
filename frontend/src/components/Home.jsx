// src/components/Home.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Box, Button, TextField, Paper } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme?.spacing(4) || '16px',
  maxWidth: '400px',
  width: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  borderRadius: theme?.shape?.borderRadius || '4px',
  boxShadow: theme?.shadows?.[5] || '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
}));

const Home = ({ setIsAuthenticated }) => {
  const [message, setMessage] = useState('');
  const [view, setView] = useState('login'); // 'login' or 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState('');
  const navigate = useNavigate();
  const backendUrl =
    "https://weather-outfit-backend-two.vercel.app/";
  // Verify token on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get(`${backendUrl}/api/auth/verify`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setMessage(`Welcome, ${response.data.user.username}`);
          setIsAuthenticated(true);
          navigate('/weather');
        }
      } catch (error) {
        setMessage('You are not logged in');
      }
    };

    fetchData();
  }, [setIsAuthenticated, navigate]);

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', { username, password });
      setNotification('Login successful');
      localStorage.setItem('token', response.data.token);
      setMessage(`Welcome, ${username}`);
      setIsAuthenticated(true);
      navigate('/weather');
    } catch (error) {
      setNotification('Login failed: ' + error.response.data.message);
    }
  };

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/auth/register', { username, password });
      setNotification('Registration successful. Please log in.');
      setView('login');
    } catch (error) {
      setNotification('Registration failed: ' + error.response.data.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <StyledPaper>
        <Box sx={{ p: 4 }}>
          {message && (
            <Typography variant="h5" align="center" gutterBottom>
              {message}
            </Typography>
          )}
          <Typography variant="h5" align="center" gutterBottom>
            {view === 'login' ? 'Login' : 'Register'}
          </Typography>
          <form onSubmit={view === 'login' ? handleLogin : handleRegister}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              color="primary"
            >
              {view === 'login' ? 'Login' : 'Register'}
            </Button>
            {view === 'login' ? (
              <Typography variant="body2" align="center">
                Don't have an account? <Button color="primary" onClick={() => setView('register')}>Register</Button>
              </Typography>
            ) : (
              <Typography variant="body2" align="center">
                Already have an account? <Button color="primary" onClick={() => setView('login')}>Login</Button>
              </Typography>
            )}
            {notification && <Typography color="error" align="center">{notification}</Typography>}
          </form>
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default Home;
