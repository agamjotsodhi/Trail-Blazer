"use strict";

// helpers/weatherAPI.js

const axios = require("axios");
require("dotenv").config(); // Load environment variables.

const API_KEY = process.env.WEATHER_API_KEY;

// Warn if the API key is missing/faulty, weather data retrieval will not work.
if (!API_KEY) {
  console.warn("WEATHER_API_KEY is missing. Weather data retrieval will not work.");
}

/**
 * Retrieves weather forecast data for a given city and date range.
 *
 * @param {string} city - Destination city (e.g., "Toronto").
 * @param {string} startDate - Trip start date (YYYY-MM-DD).
 * @param {string} endDate - Trip end date (YYYY-MM-DD).
 * @returns {Promise<Array<object>>} - Weather forecast for the specified period.
 */
async function fetchWeather(city, startDate, endDate) {
  if (!API_KEY) return "Weather data is currently unavailable due to missing API credentials.";
  if (!city || !startDate || !endDate) throw new Error("City, start date, and end date are required.");

  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(city)}/${startDate}/${endDate}?unitGroup=metric&key=${API_KEY}&contentType=json`;

  try {
    console.log(`[WeatherAPI] Fetching weather for ${city} (${startDate} - ${endDate})`);

    const response = await axios.get(url);
    const { days } = response.data;

    if (!Array.isArray(days) || days.length === 0) {
      throw new Error(`No weather data found for "${city}".`);
    }

    return days; // Returns weather forecast for the requested date range.
  } catch (error) {
    console.error("[WeatherAPI] Failed to retrieve weather data:", {
      city,
      startDate,
      endDate,
      error: error.message,
    });

    if (error.message.includes("quota") || error.message.includes("limit")) {
      return "Sorry, we've hit our weather request limit. Please try again later.";
    }

    return "Sorry, weather data is currently unavailable.";
  }
}

module.exports = { fetchWeather };
