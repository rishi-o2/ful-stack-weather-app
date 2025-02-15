import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import {
  Cloud,
  WbSunny,
  AcUnit,
  Opacity,
  Grain,
  Thunderstorm,
  Favorite,
  FavoriteBorder,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { styled } from "@mui/system";
import axios from "axios";

const API_KEY = "7415e4a6be605a052ab9bd2edd8ddec2"; // Replace with your OpenWeatherMap API key
const BACKEND_URL = "https://ful-stack-weather-app-1.onrender.com"; // Adjust this to your backend URL

const StyledBackground = styled("div")`
  background-image: url("https://images.pexels.com/photos/209831/pexels-photo-209831.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1");
  background-size: cover;
  min-height: 100vh;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledCard = styled(Card)`
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 20px;
  margin: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
`;

const StyledPaper = styled(Paper)`
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 20px;
  margin: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
`;

function Weather() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [error, setError] = useState("");
  const [showGraph, setShowGraph] = useState(true); // State to toggle between graph and forecast
  const [favorites, setFavorites] = useState([]);
  const [userEmail, setUserEmail] = useState(""); // State to hold user email
  const [userFavorites, setUserFavorites] = useState([]); // State to hold user's favorite cities

  useEffect(() => {
    // Retrieve userEmail from localStorage if available
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
    fetchUserFavorites();
  }, []);

  const fetchUserFavorites = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/favorites/${userEmail}`);
      setFavorites(response.data.map((fav) => fav.cityName));
      setUserFavorites(response.data.map((fav) => fav.cityName)); // Set user's favorite cities
    } catch (error) {
      console.error("Error fetching user favorites", error);
    }
  };

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) {
        throw new Error("City not found");
      }
      const data = await response.json();
      setWeatherData(data);
      setError("");
    } catch (error) {
      setError("City not found");
      setWeatherData(null);
    }
  };

  const fetchForecastData = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) {
        throw new Error("Forecast data not available");
      }
      const data = await response.json();
      setForecastData(data.list);
      setError("");
    } catch (error) {
      setError("Forecast data not available");
      setForecastData([]);
    }
  };

  useEffect(() => {
    // Clear weatherData when city changes
    setWeatherData(null);
    setForecastData([]);
  }, [city]);

  const handleSearch = () => {
    if (city.trim()) {
      fetchWeatherData();
      fetchForecastData();
    } else {
      setError("Please enter a city");
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getWeatherIcon = (weather) => {
    switch (weather) {
      case "Clouds":
        return <Cloud />;
      case "Clear":
        return <WbSunny />;
      case "Snow":
        return <AcUnit />;
      case "Rain":
        return <Opacity />;
      case "Drizzle":
        return <Grain />;
      case "Thunderstorm":
        return <Thunderstorm />;
      default:
        return <Cloud />;
    }
  };

  const data = forecastData.map((forecast, index) => ({
    name: formatDate(forecast.dt),
    temperature: forecast.main.temp,
  }));

  const toggleDisplay = () => {
    setShowGraph(!showGraph);
  };

  const handleFavoriteToggle = async (cityName) => {
    try {
      if (favorites.includes(cityName)) {
        await axios.delete(`${BACKEND_URL}/favorites`, {
          data: { userEmail, cityName },
        });
        setFavorites(favorites.filter((fav) => fav !== cityName));
        setUserFavorites(userFavorites.filter((fav) => fav !== cityName)); // Update user's favorite cities
      } else {
        await axios.post(`${BACKEND_URL}/favorites`, {
          userEmail,
          cityName,
        });
        setFavorites([...favorites, cityName]);
        setUserFavorites([...userFavorites, cityName]); // Update user's favorite cities
      }
    } catch (error) {
      console.error("Error toggling favorite city", error);
    }
  };

  const displayUserInfo = async () => {
    try {
      await fetchUserFavorites(); // Fetch user favorites before displaying info
      if (userEmail) {
        alert(
          `Logged in as: ${userEmail}\nFavorite Cities: ${userFavorites.join(
            ", "
          )}`
        );
      } else {
        alert("User email not available.");
      }
    } catch (error) {
      console.error("Error fetching user favorites", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail"); // Remove user email from localStorage
    setUserEmail(""); // Clear userEmail state
    setFavorites([]); // Clear favorites
    setUserFavorites([]); // Clear userFavorites
    setWeatherData(null); // Clear weatherData
    setForecastData([]); // Clear forecastData
    setError(""); // Clear error message
    window.location.href = "/"; // Redirect to '/'
  };

  return (
    <StyledBackground>
      <Grid container justify="center" spacing={2}>
        <Grid item xs={12}>
          <StyledPaper elevation={3}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <TextField
                  label="Enter City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  fullWidth
                  variant="outlined"
                  size="small"
                  style={{ borderRadius: 10 }}
                />
              </Grid>
              <Grid item xs={4}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSearch}
                  fullWidth
                  size="small"
                  style={{ borderRadius: 10 }}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
            {error && (
              <Typography color="error" variant="subtitle1">
                {error}
              </Typography>
            )}
          </StyledPaper>
        </Grid>

        {weatherData && (
          <Grid item xs={12}>
            <StyledCard elevation={3}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {weatherData.name}, {weatherData.sys.country}
                </Typography>
                <Typography variant="body1">
                  Temperature: {weatherData.main.temp}°C
                </Typography>
                <Typography variant="body1">
                  Humidity: {weatherData.main.humidity}%
                </Typography>
                <Typography variant="body1">
                  Wind Speed: {weatherData.wind.speed} m/s
                </Typography>
                <Typography variant="body1" display="flex" alignItems="center">
                  Weather: {getWeatherIcon(weatherData.weather[0].main)}
                  <span style={{ marginLeft: 8 }}>
                    {weatherData.weather[0].main}
                  </span>
                </Typography>
                <IconButton
                  color="primary"
                  onClick={() => handleFavoriteToggle(weatherData.name)}
                  style={{ marginLeft: 8 }}
                >
                  {favorites.includes(weatherData.name) ? (
                    <Favorite color="secondary" />
                  ) : (
                    <FavoriteBorder />
                  )}
                </IconButton>
              </CardContent>
            </StyledCard>
          </Grid>
        )}

        {forecastData.length > 0 && (
          <Grid item xs={12}>
            <StyledPaper elevation={3}>
              <Typography variant="h5" gutterBottom>
                {showGraph ? "Temperature Graph" : "7-Day Forecast"}
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={toggleDisplay}
                fullWidth
                size="small"
                style={{ borderRadius: 10, marginBottom: 10 }}
              >
                {showGraph ? "Show 7-Day Forecast" : "Show Temperature Graph"}
              </Button>
              {showGraph ? (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      stroke="#8884d8"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Grid container spacing={2}>
                  {forecastData.map((forecast, index) => (
                    <Grid item xs={3} key={index}>
                      <StyledCard elevation={3}>
                        <CardContent>
                          <Typography variant="subtitle2">
                            {formatDate(forecast.dt)}
                          </Typography>
                          <Typography variant="body2">
                            {forecast.main.temp}°C
                          </Typography>
                          <Typography variant="body2">
                            {forecast.weather[0].description}
                          </Typography>
                        </CardContent>
                      </StyledCard>
                    </Grid>
                  ))}
                </Grid>
              )}
            </StyledPaper>
          </Grid>
        )}

        <Grid item xs={12}>
          <Button
            variant="outlined"
            color="primary"
            onClick={displayUserInfo}
            fullWidth
            size="small"
            style={{ borderRadius: 10 }}
          >
            Show User Info
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleLogout}
            fullWidth
            size="small"
            style={{ borderRadius: 10, marginTop: 10 }}
          >
            Logout
          </Button>
        </Grid>
      </Grid>
    </StyledBackground>
  );
}

export default Weather;
