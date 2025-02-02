"use strict";

const db = require("../db");
const { fetchWeatherData } = require("../helpers/weatherAPI");
const { BadRequestError, NotFoundError } = require("../expressError");

class Weather {
  /**
   * Fetch and store weather data for a trip.
   *
   * @param {number} trip_id - The trip ID.
   * @param {object} params - { location_city, start_date, end_date }
   * @returns {Array<object>} - Stored weather records.
   */
  static async add(trip_id, { location_city, start_date, end_date }) {
    if (!trip_id || !location_city || !start_date || !end_date) {
      throw new BadRequestError("Trip ID, city name, start date, and end date are required.");
    }

    console.log(`[Weather] Fetching data for ${location_city} (${start_date} - ${end_date})`);

    // Fetch weather data from API
    const weatherData = await fetchWeatherData(location_city, start_date, end_date);
    if (!weatherData?.length) throw new BadRequestError("No valid weather data returned.");

    // Insert weather records into database
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
   * Retrieve all weather records for a specific trip.
   *
   * @param {number} trip_id - The trip ID.
   * @returns {Array<object>} - List of weather records.
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
   * Retrieve a specific weather record by its ID.
   *
   * @param {number} weather_id - The weather record ID.
   * @returns {object} - The weather record.
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
   * Safely fetch and store weather data (handles API failures).
   *
   * @param {number} trip_id - The trip ID.
   * @param {object} params - { location_city, start_date, end_date }
   * @returns {Array<object> | object} - Stored weather records or error message.
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
