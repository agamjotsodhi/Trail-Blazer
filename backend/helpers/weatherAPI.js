const axios = require('axios');

/**
 * Fetch weather data from Weather API.
 *
 * @param {string} cityName - The name of the city (e.g., "Toronto").
 * @returns {Promise<object>} - Weather data from the API.
 */
async function fetchWeatherData(cityName) {
  try {
    const apiKey = process.env.WEATHER_API_KEY; // Store your API key in the .env file
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityName}?unitGroup=metric&key=${apiKey}&contentType=json`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch weather data for "${cityName}": ${error.message}`);
  }
}

module.exports = { fetchWeatherData };



