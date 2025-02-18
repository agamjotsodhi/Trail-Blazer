"use strict";

const express = require("express");
const { authenticateJWT, ensureLoggedIn } = require("../middleware/auth");
const Trip = require("../models/trip");
const { BadRequestError } = require("../expressError");

const router = express.Router();

// POST /trips - Create a new trip and fetch related data (destination, weather, AI itinerary)
// Request body: { trip_name, start_date, end_date, location_city, location_country, interests }
// Response: { trip, destination, weather, itinerary }
router.post("/", authenticateJWT, ensureLoggedIn, async (req, res, next) => {
  try {
    const user_id = res.locals.user.user_id;
    const { trip_name, start_date, end_date, location_city, location_country, interests } = req.body;

    if (![trip_name, location_city, location_country].every((item) => item?.trim()) || !start_date || !end_date) {
      throw new BadRequestError("Missing required trip data.");
    }

    console.log(`[Trips] Creating trip: ${trip_name} | User: ${user_id}`);

    const { trip, destination, weather, itinerary } = await Trip.add(user_id, {
      trip_name,
      start_date,
      end_date,
      location_city,
      location_country,
      interests,
    });

    res.status(201).json({ trip, destination, weather, itinerary });
  } catch (err) {
    console.error(`[Trips] Error creating trip: ${err.message}`);
    next(err);
  }
});

// GET /trips - Get all trips for the logged-in user
// Response: { trips: [{ trip_id, trip_name, start_date, end_date, location_city, location_country, interests }, ...] }
router.get("/", authenticateJWT, ensureLoggedIn, async (req, res, next) => {
  try {
    const user_id = res.locals.user.user_id;
    console.log(`[Trips] Fetching all trips for user: ${user_id}`);

    const trips = await Trip.getAll(user_id);
    res.json({ trips });
  } catch (err) {
    console.error(`[Trips] Error fetching all trips: ${err.message}`);
    next(err);
  }
});

// GET /trips/:trip_id - Get details of a specific trip (destination, weather, AI itinerary)
// Response: { trip, destination, weather, itinerary }
router.get("/:trip_id", authenticateJWT, ensureLoggedIn, async (req, res, next) => {
  try {
    const user_id = res.locals.user.user_id;
    const trip_id = Number(req.params.trip_id);

    if (!Number.isInteger(trip_id)) throw new BadRequestError("Invalid trip ID.");

    console.log(`[Trips] Fetching trip ID: ${trip_id} | User: ${user_id}`);

    const tripDetails = await Trip.get(trip_id, user_id);
    res.json(tripDetails);
  } catch (err) {
    console.error(`[Trips] Error fetching trip details: ${err.message}`);
    next(err);
  }
});

// PATCH /trips/:trip_id - Update an existing trip
// Request body: { trip_name, start_date, end_date, location_city, location_country, interests }
// Response: { updatedTrip }
router.patch("/:trip_id", authenticateJWT, ensureLoggedIn, async (req, res, next) => {
  try {
    const user_id = res.locals.user.user_id;
    const trip_id = Number(req.params.trip_id);

    if (!Number.isInteger(trip_id)) throw new BadRequestError("Invalid trip ID.");

    console.log(`[Trips] Updating trip ID: ${trip_id} | User: ${user_id}`);

    const updatedTrip = await Trip.update(trip_id, user_id, req.body);
    res.json({ updatedTrip });
  } catch (err) {
    console.error(`[Trips] Error updating trip: ${err.message}`);
    next(err);
  }
});

// DELETE /trips/:trip_id - Delete a trip
// Response: { message: "Trip deleted" }
router.delete("/:trip_id", authenticateJWT, ensureLoggedIn, async (req, res, next) => {
  try {
    const user_id = res.locals.user.user_id;
    const trip_id = Number(req.params.trip_id);

    if (!Number.isInteger(trip_id)) throw new BadRequestError("Invalid trip ID.");

    console.log(`[Trips] Deleting trip ID: ${trip_id} | User: ${user_id}`);

    await Trip.remove(trip_id, user_id);
    res.json({ message: "Trip deleted" });
  } catch (err) {
    console.error(`[Trips] Error deleting trip: ${err.message}`);
    next(err);
  }
});

module.exports = router;
