"use strict";

const db = require("../db");
const { NotFoundError, BadRequestError } = require("../expressError");

/** Related functions for weather data. */

class Weather {
  /**
   * Add weather data for a trip.
   *
   * - trip_id: ID of the trip
   * - weatherData: { location_type, start_date, end_date, icon }
   *
   * Returns { weather_id, trip_id, location_type, start_date, end_date, icon }
   */
  static async add(trip_id, { location_type, start_date, end_date, icon }) {
    const result = await db.query(
      `INSERT INTO weather
       (trip_id, location_type, start_date, end_date, icon)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING weather_id, trip_id, location_type, start_date, end_date, icon`,
      [trip_id, location_type, start_date, end_date, icon]
    );

    return result.rows[0];
  }

  /**
   * Get all weather records for a specific trip.
   *
   * - trip_id: ID of the trip
   *
   * Returns [{ weather_id, trip_id, location_type, start_date, end_date, icon }, ...]
   */
  static async getAllForTrip(trip_id) {
    const result = await db.query(
      `SELECT weather_id, trip_id, location_type, start_date, end_date, icon
       FROM weather
       WHERE trip_id = $1
       ORDER BY location_type`,
      [trip_id]
    );

    return result.rows;
  }

  /**
   * Get specific weather data by ID.
   *
   * - weather_id: ID of the weather record
   *
   * Returns { weather_id, trip_id, location_type, start_date, end_date, icon }
   *
   * Throws NotFoundError if weather record not found.
   */
  static async get(weather_id) {
    const result = await db.query(
      `SELECT weather_id, trip_id, location_type, start_date, end_date, icon
       FROM weather
       WHERE weather_id = $1`,
      [weather_id]
    );

    const weather = result.rows[0];

    if (!weather) {
      throw new NotFoundError(`No weather record found with ID: ${weather_id}`);
    }

    return weather;
  }

  /**
   * Update weather data for a specific record.
   *
   * - weather_id: ID of the weather record to update
   * - data: { location_type, start_date, end_date, icon }
   *
   * Returns { weather_id, trip_id, location_type, start_date, end_date, icon }
   *
   * Throws NotFoundError if weather record not found.
   */
  static async update(weather_id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {
      location_type: "location_type",
      start_date: "start_date",
      end_date: "end_date",
      icon: "icon",
    });
    const weatherIdVarIdx = `$${values.length + 1}`;

    const querySql = `UPDATE weather
                      SET ${setCols}
                      WHERE weather_id = ${weatherIdVarIdx}
                      RETURNING weather_id, trip_id, location_type, start_date, end_date, icon`;

    const result = await db.query(querySql, [...values, weather_id]);
    const weather = result.rows[0];

    if (!weather) {
      throw new NotFoundError(`No weather record found with ID: ${weather_id}`);
    }

    return weather;
  }

  /**
   * Delete weather data.
   *
   * - weather_id: ID of the weather record to delete
   *
   * Returns undefined.
   *
   * Throws NotFoundError if weather record not found.
   */
  static async remove(weather_id) {
    const result = await db.query(
      `DELETE
       FROM weather
       WHERE weather_id = $1
       RETURNING weather_id`,
      [weather_id]
    );

    if (!result.rows[0]) {
      throw new NotFoundError(`No weather record found with ID: ${weather_id}`);
    }
  }
}

module.exports = Weather;
