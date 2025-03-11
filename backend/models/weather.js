"use strict";

const db = require("../db");
const { fetchWeather } = require("../helpers/weatherAPI");
const { BadRequestError, NotFoundError } = require("../expressError");

class Weather {
  /**
   * Fetches weather data from the API and stores it in the database.
   * 
   * @param {number} trip_id - The trip's ID.
   * @param {object} params - Weather request parameters.
   * @param {string} params.location_city - The city for the weather forecast.
   * @param {string} params.start_date - Trip start date (YYYY-MM-DD).
   * @param {string} params.end_date - Trip end date (YYYY-MM-DD).
   * @returns {Promise<Array<object>>} - Stored weather records.
   * @throws {BadRequestError} - If required parameters are missing or API returns no data.
   */
  static async add(trip_id, { location_city, start_date, end_date }) {
    if (!trip_id || !location_city || !start_date || !end_date) {
      throw new BadRequestError("Trip ID, city name, start date, and end date are required.");
    }

    console.log(`[Weather] Fetching data for ${location_city} (${start_date} - ${end_date})`);

    // Retrieve weather data from API
    const weatherData = await fetchWeather(location_city, start_date, end_date);
    if (!weatherData?.length) throw new BadRequestError("No valid weather data returned.");

    // Insert weather records into the database
    const insertPromises = weatherData.map(day =>
      db.query(
        `INSERT INTO weather 
         (trip_id, datetime, tempmax, tempmin, temp, humidity, precip, precipprob, snowdepth, windspeed, sunrise, sunset, conditions, description, icon)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
         RETURNING *`,
        [
          trip_id,
          day.datetime,
          day.tempmax ?? null,
          day.tempmin ?? null,
          day.temp ?? null,
          day.humidity ?? null,
          day.precip ?? null,
          day.precipprob ?? null,
          day.snowdepth ?? null,
          day.windspeed ?? null,
          day.sunrise ?? null,
          day.sunset ?? null,
          day.conditions ?? null,
          day.description ?? null,
          day.icon ?? null,
        ]
      )
    );

    const results = await Promise.all(insertPromises);
    console.log(`[Weather] Stored ${results.length} records for Trip ID: ${trip_id}`);

    return results.map(res => res.rows[0]);
  }

  /**
   * Retrieves all weather records for a specific trip.
   * 
   * @param {number} trip_id - The trip's ID.
   * @returns {Promise<Array<object>>} - List of weather records.
   * @throws {NotFoundError} - If no weather data is found.
   */
  static async getAllForTrip(trip_id) {
    const result = await db.query(
      `SELECT * FROM weather WHERE trip_id = $1 ORDER BY datetime ASC`,
      [trip_id]
    );

    if (!result.rows.length) throw new NotFoundError(`No weather records found for Trip ID: ${trip_id}`);

    return result.rows;
  }

  /**
   * Retrieves a specific weather record by its ID.
   * 
   * @param {number} weather_id - The weather record's ID.
   * @returns {Promise<object>} - Weather details.
   * @throws {NotFoundError} - If no weather record is found.
   */
  static async get(weather_id) {
    const result = await db.query(
      `SELECT * FROM weather WHERE weather_id = $1`,
      [weather_id]
    );

    if (!result.rows.length) throw new NotFoundError(`No weather record found with ID: ${weather_id}`);

    return result.rows[0];
  }

  /**
   * Safely fetches and stores weather data, handling errors gracefully.
   * 
   * @param {number} trip_id - The trip's ID.
   * @param {object} params - Weather request parameters.
   * @returns {Promise<Array<object>|object>} - Stored weather records or an error message.
   */
  static async fetchWeatherDataSafely(trip_id, params) {
    try {
      return await this.add(trip_id, params);
    } catch (err) {
      console.error(`[Weather] Error fetching data: ${err.message}`);
      return { message: "Unable to fetch weather data for this trip." };
    }
  }
}

module.exports = Weather;
