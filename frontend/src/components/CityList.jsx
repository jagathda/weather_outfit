// src/components/CityList.jsx
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, CardContent, CircularProgress, Card, Box } from '@mui/material';
import axios from 'axios';
import Recommendations from './Recommendations';
import sky1 from "../images/sky1.jpg";
const CityList = () => {
  const [cities, setCities] = useState([]);
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(true);
  const backendUrl =
    "https://weather-outfit-backend-two.vercel.app/";
  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
  const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

  useEffect(() => {
    const fetchCities = async () => {
      try {
        
        const token = localStorage.getItem('token');
        const response = await axios.get(`${backendUrl}/api/cities`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCities(response.data);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    const fetchWeatherData = async () => {
      const weatherDataPromises = cities.map(async (city) => {
        try {
          const response = await axios.get(`${apiUrl}?q=${city.name}&appid=${apiKey}&units=metric`);
          return { city: city.name, data: response.data };
        } catch (error) {
          console.error(`Error fetching weather data for ${city.name}:`, error);
          return { city: city.name, data: null };
        }
      });
      const weatherDataArray = await Promise.all(weatherDataPromises);
      const weatherDataObject = weatherDataArray.reduce((acc, curr) => {
        acc[curr.city] = curr.data;
        return acc;
      }, {});

      setWeatherData(weatherDataObject);
      setLoading(false);
    };

    if (cities.length > 0) {
      fetchWeatherData();
    }
  }, [cities, apiKey]);

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <div style={{
      backgroundImage: `url(${sky1})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      transition: "background-image 0.5s ease-in-out",
  }}>
    <Container>
        <Box> 
      <Typography variant="h3" gutterBottom>
        Favorite Cities and Weather Forecast
      </Typography >
      <Grid container spacing={3}>
        {cities.map((city) => (
           <Grid item xs={12} sm={6} md={4} key={city._id}>
           <Card variant="outlined"
                    sx={{
                      p: 2,
                      mb: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                      color: 'black', // dark font color
                      borderColor: 'rgba(255, 255, 255, 0.5)', 
                    }}>
             <CardContent>
               <Typography variant="h6">{city.name}</Typography>
            {weatherData[city.name] ? (
              <Box>
                <Card
                    variant="outlined"
                    sx={{
                      p: 2,
                      mb: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                      color: 'black', // dark font color
                      borderColor: 'rgba(255, 255, 255, 0.5)', 
                    }} >
                <Typography variant="h6">Weather Data:</Typography>
                <Typography variant="body2">{`Temperature: ${weatherData[city.name].main.temp}°C`}</Typography>
                <Typography variant="body2">{`Humidity: ${weatherData[city.name].main.humidity}%`}</Typography>
                <Typography variant="body2">{`Wind Speed: ${weatherData[city.name].wind.speed} km/h`}</Typography>
                <Typography variant="body2">{weatherData[city.name].weather[0].description}</Typography>
                </Card>
                <Card variant="outlined"
                    sx={{
                      p: 2,
                      mb: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                      color: 'black', // dark font color
                      borderColor: 'rgba(255, 255, 255, 0.5)', 
                    }}>
                <Recommendations weatherData={weatherData[city.name]} variant="outlined"/>
                </Card>
              </Box>
            ) : (
              <Typography variant="body2">Weather data not available</Typography>
            )}
             </CardContent>
             </Card>
             </Grid>
        ))}
       </Grid>
      </Box>
    </Container>
    </div>
  );
};

export default CityList;
