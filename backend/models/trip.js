"use strict";

const db = require("../db");
const { NotFoundError, BadRequestError } = require("../expressError");
const Destination = require("./destination");
const Weather = require("./weather");
const { generateItinerary } = require("../helpers/geminiAI");
const { sqlForPartialUpdate } = require("../helpers/sql");

const SELECT_FIELDS = `
  trip_id, user_id, trip_name, start_date, end_date, location_city, location_country, interests
`;

class Trip {
  /**
   * Retrieves all trips for a given user.
   * 
   * @param {number} user_id - The user's ID.
   * @returns {Promise<Array<object>>} - List of trips.
   */
  static async getAll(user_id) {
    const result = await db.query(
      `SELECT ${SELECT_FIELDS} FROM trips WHERE user_id = $1`,
      [user_id]
    );
    return result.rows;
  }

  /**
   * Creates a new trip and generates related data (destination, weather, itinerary).
   * 
   * @param {number} user_id - The user's ID.
   * @param {object} tripData - Trip details.
   * @returns {Promise<object>} - The created trip, destination details, weather forecast, and itinerary.
   */
  static async add(user_id, { trip_name, start_date, end_date, location_city, location_country, interests }) {
    if (!trip_name || !start_date || !end_date || !location_city || !location_country || !interests) {
      throw new BadRequestError("Missing required trip data.");
    }

    // Prevent duplicate trip names for the same user
    const duplicateCheck = await db.query(
      `SELECT trip_id FROM trips WHERE user_id = $1 AND trip_name = $2`,
      [user_id, trip_name]
    );

    if (duplicateCheck.rows.length > 0) {
      throw new BadRequestError(`Duplicate trip name: ${trip_name}`);
    }

    // Insert trip into database
    const tripResult = await db.query(
      `INSERT INTO trips (user_id, trip_name, start_date, end_date, location_city, location_country, interests)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING ${SELECT_FIELDS}`,
      [user_id, trip_name, start_date, end_date, location_city, location_country, interests]
    );

    const trip = tripResult.rows[0];
    console.log(`[Trip Model] Trip created: ${trip.trip_id}`);

    // Fetch related trip data
    const destination = await Destination.fetchDestinationSafely(location_country);
    const weather = await Weather.fetchWeatherDataSafely(trip.trip_id, { location_city, start_date, end_date });

    // Generate itinerary with AI
    let itinerary;
    try {
      itinerary = await generateItinerary(location_city, location_country, interests, start_date, end_date);
      console.log(`[Trip Model] AI itinerary generated successfully.`);
    } catch (err) {
      console.error(`[Trip Model] Failed to generate AI itinerary: ${err.message}`);
      itinerary = "Itinerary could not be generated.";
    }

    // Store itinerary in the database
    await db.query(`INSERT INTO itineraries (trip_id, itinerary) VALUES ($1, $2)`, [trip.trip_id, itinerary]);

    return { trip, destination, weather, itinerary };
  }

  /**
   * Retrieves a specific trip with its details.
   * 
   * @param {number} trip_id - The trip's ID.
   * @param {number} user_id - The user's ID.
   * @returns {Promise<object>} - The trip details, destination info, weather data, and itinerary.
   */
  static async get(trip_id, user_id) {
    const tripResult = await db.query(
      `SELECT ${SELECT_FIELDS} FROM trips WHERE trip_id = $1 AND user_id = $2`,
      [trip_id, user_id]
    );

    if (!tripResult.rows.length) {
      throw new NotFoundError(`No trip found with ID: ${trip_id}`);
    }

    const trip = tripResult.rows[0];
    const destination = await Destination.getByCountry(trip.location_country);
    const weather = await Weather.getAllForTrip(trip_id);
    const itineraryResult = await db.query(`SELECT itinerary FROM itineraries WHERE trip_id = $1`, [trip_id]);

    const itinerary = itineraryResult.rows.length ? itineraryResult.rows[0].itinerary : "No itinerary available.";
    return { trip, destination, weather, itinerary };
  }

  /**
   * Updates an existing trip with new details.
   * 
   * @param {number} trip_id - The trip's ID.
   * @param {number} user_id - The user's ID.
   * @param {object} data - Updated trip details.
   * @returns {Promise<object>} - The updated trip.
   */
  static async update(trip_id, user_id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {
      trip_name: "trip_name",
      start_date: "start_date",
      end_date: "end_date",
      location_city: "location_city",
      location_country: "location_country",
      interests: "interests",
    });

    const tripVarIdx = "$" + (values.length + 1);
    const userVarIdx = "$" + (values.length + 2);

    const querySql = `UPDATE trips 
                      SET ${setCols} 
                      WHERE trip_id = ${tripVarIdx} AND user_id = ${userVarIdx} 
                      RETURNING ${SELECT_FIELDS}`;

    const result = await db.query(querySql, [...values, trip_id, user_id]);
    const trip = result.rows[0];

    if (!trip) throw new NotFoundError(`No trip found with ID: ${trip_id}`);

    return trip;
  }

  /**
   * Deletes a trip.
   * 
   * @param {number} trip_id - The trip's ID.
   * @param {number} user_id - The user's ID.
   * @returns {Promise<object>} - Confirmation message.
   */
  static async remove(trip_id, user_id) {
    const result = await db.query(
      `DELETE FROM trips WHERE trip_id = $1 AND user_id = $2 RETURNING trip_id`,
      [trip_id, user_id]
    );

    if (!result.rows.length) {
      throw new NotFoundError(`No trip found with ID: ${trip_id}`);
    }

    return { message: "Trip deleted" };
  }
}

module.exports = Trip;
