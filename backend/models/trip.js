"use strict";

const db = require("../db");
const { NotFoundError, BadRequestError } = require("../expressError");
const Destination = require("./destination");
const Weather = require("./weather");
const { generateItinerary } = require("../helpers/geminiAI");

const SELECT_FIELDS = `
  trip_id, user_id, trip_name, start_date, end_date, location_city, location_country, interests
`;

class Trip {
  /**
   * Add a new trip and store associated details:
   * - Destination info
   * - Weather data
   * - AI-generated itinerary (saved in `itineraries` table)
   *
   * @param {number} user_id - The user's ID.
   * @param {object} tripData - { trip_name, start_date, end_date, location_city, location_country, interests }
   * @returns {object} The created trip with destination, weather, and itinerary.
   */
  static async add(user_id, { trip_name, start_date, end_date, location_city, location_country, interests }) {
    if (!trip_name || !start_date || !end_date || !location_city || !location_country || !interests) {
      throw new BadRequestError("Missing required trip data.");
    }

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

    // Fetch and store destination details
    const destination = await Destination.fetchDestinationSafely(location_country);

    // Fetch and store weather data
    const weather = await Weather.fetchWeatherDataSafely(trip.trip_id, { location_city, start_date, end_date });

    // Generate AI-powered itinerary
    let itinerary;
    try {
      itinerary = await generateItinerary(location_city, location_country, interests, start_date, end_date);
      console.log(`[Trip Model] AI itinerary generated successfully.`);
    } catch (err) {
      console.error(`[Trip Model] Failed to generate AI itinerary: ${err.message}`);
      itinerary = "Itinerary could not be generated.";
    }

    // Store itinerary in the itineraries table
    await db.query(
      `INSERT INTO itineraries (trip_id, itinerary) VALUES ($1, $2)`,
      [trip.trip_id, itinerary]
    );

    return { trip, destination, weather, itinerary };
  }

  /**
   * Get a specific trip and its details.
   * - Includes Destination, Weather, and Itinerary.
   *
   * @param {number} trip_id - The trip ID.
   * @param {number} user_id - The user's ID.
   * @returns {object} Trip details with related data.
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

    // Fetch related destination details
    const destination = await Destination.getByCountry(trip.location_country);

    // Fetch related weather data
    const weather = await Weather.getAllForTrip(trip_id);

    // Fetch itinerary
    const itineraryResult = await db.query(
      `SELECT itinerary FROM itineraries WHERE trip_id = $1`,
      [trip_id]
    );

    const itinerary = itineraryResult.rows.length ? itineraryResult.rows[0].itinerary : "No itinerary available.";

    return { trip, destination, weather, itinerary };
  }
}

module.exports = Trip;
