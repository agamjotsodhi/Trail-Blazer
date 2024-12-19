"use strict";

const db = require("../db");
const { fetchCountryData } = require("../helpers/countriesAPI"); // Import the helper
const { NotFoundError, BadRequestError } = require("../expressError");

/** Related functions for destinations. */

class Destination {
  /**
   * Add a destination to a trip.
   *
   * - trip_id: ID of the trip
   * - destinationData: { country, city }
   *
   * Fetches additional data from the RestCountries API and adds to the database.
   *
   * Returns { destination_id, trip_id, country, city, capital_city, currency, language, timezones, flag, start_of_week }
   */
  static async add(trip_id, { country, city }) {
    try {
      // Fetch country data from the API
      const countryData = await fetchCountryData(country);

      // Extract relevant details from the API response
      const capital_city = countryData.capital?.[0];
      const currency = Object.values(countryData.currencies || {})[0]?.name;
      const language = Object.values(countryData.languages || {})[0];
      const timezones = countryData.timezones?.[0];
      const flag = countryData.flags?.svg;
      const start_of_week = countryData.startOfWeek;

      // Insert into the destinations table
      const result = await db.query(
        `INSERT INTO destinations
         (trip_id, country, city, capital_city, currency, language, timezones, flag, start_of_week)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING destination_id, trip_id, country, city, capital_city, currency, language, timezones, flag, start_of_week`,
        [trip_id, country, city, capital_city, currency, language, timezones, flag, start_of_week]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to add destination: ${error.message}`);
    }
  }

  /**
   * Get all destinations for a specific trip.
   *
   * - trip_id: ID of the trip
   *
   * Returns [{ destination_id, trip_id, country, city, capital_city, currency, language, timezones, flag, start_of_week }, ...]
   */
  static async getAllForTrip(trip_id) {
    const result = await db.query(
      `SELECT destination_id, trip_id, country, city, capital_city, currency, language, timezones, flag, start_of_week
       FROM destinations
       WHERE trip_id = $1
       ORDER BY country, city`,
      [trip_id]
    );

    return result.rows;
  }

  /**
   * Get a specific destination by its ID.
   *
   * - destination_id: ID of the destination
   *
   * Returns { destination_id, trip_id, country, city, capital_city, currency, language, timezones, flag, start_of_week }
   *
   * Throws NotFoundError if destination not found.
   */
  static async get(destination_id) {
    const result = await db.query(
      `SELECT destination_id, trip_id, country, city, capital_city, currency, language, timezones, flag, start_of_week
       FROM destinations
       WHERE destination_id = $1`,
      [destination_id]
    );

    const destination = result.rows[0];

    if (!destination) {
      throw new NotFoundError(`No destination found with ID: ${destination_id}`);
    }

    return destination;
  }

  /**
   * Update a destination with new data.
   *
   * - destination_id: ID of the destination to update
   * - data: { country, city, capital_city, currency, language, timezones, flag, start_of_week }
   *
   * Returns { destination_id, trip_id, country, city, capital_city, currency, language, timezones, flag, start_of_week }
   *
   * Throws NotFoundError if destination not found.
   */
  static async update(destination_id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {
      country: "country",
      city: "city",
      capital_city: "capital_city",
      currency: "currency",
      language: "language",
      timezones: "timezones",
      flag: "flag",
      start_of_week: "start_of_week",
    });
    const destinationIdVarIdx = `$${values.length + 1}`;

    const querySql = `UPDATE destinations
                      SET ${setCols}
                      WHERE destination_id = ${destinationIdVarIdx}
                      RETURNING destination_id, trip_id, country, city, capital_city, currency, language, timezones, flag, start_of_week`;

    const result = await db.query(querySql, [...values, destination_id]);
    const destination = result.rows[0];

    if (!destination) {
      throw new NotFoundError(`No destination found with ID: ${destination_id}`);
    }

    return destination;
  }

  /**
   * Delete a destination.
   *
   * - destination_id: ID of the destination to delete
   *
   * Returns undefined.
   *
   * Throws NotFoundError if destination not found.
   */
  static async remove(destination_id) {
    const result = await db.query(
      `DELETE
       FROM destinations
       WHERE destination_id = $1
       RETURNING destination_id`,
      [destination_id]
    );

    if (!result.rows[0]) {
      throw new NotFoundError(`No destination found with ID: ${destination_id}`);
    }
  }
}

module.exports = Destination;
