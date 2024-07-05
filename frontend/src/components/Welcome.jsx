import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';
import welcome from "../images/welcome.jpg";
const Welcome = () => {
  const [city, setCity] = useState('');
  const [message, setMessage] = useState('');
  const backendUrl =
    "https://weather-outfit-server.vercel.app/";
  const handleCityChange = (e) => {
    setCity(e.target.value);
  };
  
  const handleCitySubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${backendUrl}/api/cities`, { name: city }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        console.log("Token is valid");
        // Additional logic here
      } else {
        console.log("Token is invalid");
        // Handle error
      }
      setMessage('City saved successfully!');
      setCity('');
    } catch (error) {
      console.error('Error saving city:', error);
      setMessage('Error saving city');
    }
  };
 

  return (
    <Box
      sx={{
        backgroundImage: `url(${welcome})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        transition: "background-image 0.5s ease-in-out",
      }}
    >
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          color: 'black',
        }}
      >
        <Typography variant="h4" gutterBottom>
        Welcome
      </Typography>
        <Typography variant="body1">
          Successfully logged in. 
          Please enter your favoirite cities!
        </Typography>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="city"
          label="Favorite City"
          name="city"
          autoComplete="city"
          autoFocus
          value={city}
          onChange={handleCityChange}
          InputProps={{
            style: {
              color: 'black',
            },
          }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleCitySubmit}
        >
          Save City
        </Button>
        {message && <Typography color="error">{message}</Typography>}
        <Typography variant="body1">
          Or
        </Typography>
        <Box mt={2}>
        <Link to="/cities">
          <Button variant="contained">View Favorite Cities</Button>
        </Link>
        </Box>
      </Box>
    </Container>
    </Box>
  );
};

export default Welcome;
