import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = 'c9decce69760a09d4e7d18fa3b38ecc3';
  const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

  useEffect(() => {
    const fetchWeatherByCity = async () => {
      if (city.trim() === '') {
        setError('Please enter a city name.');
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await axios.get(
          `${API_BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`
        );
        setWeatherData(response.data);
      } catch (error) {
        setError('Weather data not found. Please try again.');
      }

      setLoading(false);
    };

    const getLocationAndFetchWeather = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByCoordinates(latitude, longitude);
          },
          (error) => {
            setError('Error retrieving location. Please try again.');
            setLoading(false);
          }
        );
      } else {
        setError('Geolocation is not supported by your browser.');
        setLoading(false);
      }
    };

    const fetchWeatherByCoordinates = async (latitude, longitude) => {
      setLoading(true);
      setError('');

      try {
        const response = await axios.get(
          `${API_BASE_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );
        setWeatherData(response.data);
      } catch (error) {
        setError('Weather data not found. Please try again.');
      }

      setLoading(false);
    };

    if (city === '') {
      getLocationAndFetchWeather();
    } else {
      fetchWeatherByCity();
    }
  }, [city, API_KEY, API_BASE_URL]);

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Trigger weather fetch based on the entered city
    setWeatherData(null); // Clear previous weather data
  };

  return (
    <div>
      <h1>Weather App</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={city}
          onChange={handleCityChange}
          placeholder="Enter city name"
        />
        <button type="submit">Get Weather</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {weatherData && (
        <div>
          <h2>Weather in {weatherData.name}</h2>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <p>Description: {weatherData.weather[0].description}</p>
          <p>Wind Speed: {weatherData.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
};

export default Weather;
