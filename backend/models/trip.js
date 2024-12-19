"use strict";

const db = require("../db");
const { NotFoundError, BadRequestError } = require("../expressError");

/** Related functions for trips. */

class Trip {
  /**
   * Add a new trip.
   *
   * - user_id: ID of the user creating the trip
   * - tripData: { trip_name, start_date, end_date, start_city, end_city, start_country, end_country }
   *
   * Returns { trip_id, trip_name, start_date, end_date, start_city, end_city, start_country, end_country }
   *
   * Throws BadRequestError on duplicates.
   */
  
  static async add(user_id, { trip_name, start_date, end_date, start_city, end_city, start_country, end_country }) {
    // Check for duplicate trip names for the same user
    const duplicateCheck = await db.query(
      `SELECT trip_id
       FROM trips
       WHERE user_id = $1 AND trip_name = $2`,
      [user_id, trip_name]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate trip name: ${trip_name}`);
    }

    // Insert new trip into the database
    const result = await db.query(
      `INSERT INTO trips
       (user_id, trip_name, start_date, end_date, start_city, end_city, start_country, end_country)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING trip_id, trip_name, start_date, end_date, start_city, end_city, start_country, end_country`,
      [user_id, trip_name, start_date, end_date, start_city, end_city, start_country, end_country]
    );

    return result.rows[0];
  }

  /**
   * Get all trips for a specific user.
   *
   * - user_id: ID of the user
   *
   * Returns [{ trip_id, trip_name, start_date, end_date, start_city, end_city, start_country, end_country }, ...]
   */
  static async getAll(user_id) {
    const result = await db.query(
      `SELECT trip_id, trip_name, start_date, end_date, start_city, end_city, start_country, end_country
       FROM trips
       WHERE user_id = $1
       ORDER BY start_date`,
      [user_id]
    );

    return result.rows;
  }

  /**
   * Get a specific trip by its ID.
   *
   * - trip_id: ID of the trip
   * - user_id: ID of the user (to ensure access control)
   *
   * Returns { trip_id, trip_name, start_date, end_date, start_city, end_city, start_country, end_country }
   *
   * Throws NotFoundError if trip not found or user does not own the trip.
   */
  
  static async get(trip_id, user_id) {
    const result = await db.query(
      `SELECT trip_id, trip_name, start_date, end_date, start_city, end_city, start_country, end_country
       FROM trips
       WHERE trip_id = $1 AND user_id = $2`,
      [trip_id, user_id]
    );

    const trip = result.rows[0];

    if (!trip) {
      throw new NotFoundError(`No trip found with ID: ${trip_id}`);
    }

    return trip;
  }

  /**
   * Update a trip with `data`.
   *
   * Data can include: { trip_name, start_date, end_date, start_city, end_city, start_country, end_country }
   *
   * - trip_id: ID of the trip to update
   * - user_id: ID of the user (to ensure access control)
   *
   * Returns { trip_id, trip_name, start_date, end_date, start_city, end_city, start_country, end_country }
   *
   * Throws NotFoundError if trip not found.
   */

  static async update(trip_id, user_id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {
      trip_name: "trip_name",
      start_date: "start_date",
      end_date: "end_date",
      start_city: "start_city",
      end_city: "end_city",
      start_country: "start_country",
      end_country: "end_country",
    });
    const tripIdVarIdx = `$${values.length + 1}`;
    const userIdVarIdx = `$${values.length + 2}`;

    const querySql = `UPDATE trips
                      SET ${setCols}
                      WHERE trip_id = ${tripIdVarIdx} AND user_id = ${userIdVarIdx}
                      RETURNING trip_id, trip_name, start_date, end_date, start_city, end_city, start_country, end_country`;

    const result = await db.query(querySql, [...values, trip_id, user_id]);
    const trip = result.rows[0];

    if (!trip) {
      throw new NotFoundError(`No trip found with ID: ${trip_id}`);
    }

    return trip;
  }

  /**
   * Delete a trip.
   *
   * - trip_id: ID of the trip to delete
   * - user_id: ID of the user (to ensure access control)
   *
   * Returns undefined.
   *
   * Throws NotFoundError if trip not found.
   */

  static async remove(trip_id, user_id) {
    const result = await db.query(
      `DELETE
       FROM trips
       WHERE trip_id = $1 AND user_id = $2
       RETURNING trip_id`,
      [trip_id, user_id]
    );

    if (!result.rows[0]) {
      throw new NotFoundError(`No trip found with ID: ${trip_id}`);
    }
  }
}

module.exports = Trip;
