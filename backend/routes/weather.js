"use strict";

const express = require("express");
const Weather = require("../models/weather");
const { authenticateJWT } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");

const router = express.Router();

// POST /weather/:trip_id - Fetch and store weather data for a trip
// Request body: { location_city, start_date, end_date }
// Response: [{ weather_id, trip_id, datetime, tempmax, tempmin, temp, humidity, precip, precipprob, snowdepth, windspeed, sunrise, sunset, conditions, description, icon }]
router.post("/:trip_id", authenticateJWT, async (req, res, next) => {
  try {
    const trip_id = Number(req.params.trip_id);
    const { location_city, start_date, end_date } = req.body;

    if (!trip_id || isNaN(trip_id)) throw new BadRequestError("Invalid trip ID.");
    if (!location_city || !start_date || !end_date) {
      throw new BadRequestError("Location, start date, and end date are required.");
    }

    console.log(`[Weather] Fetching weather for Trip ID: ${trip_id} - ${location_city}`);

    const weather = await Weather.add(trip_id, { location_city, start_date, end_date });

    res.status(201).json({ weather });
  } catch (err) {
    next(err);
  }
});

// GET /weather/:trip_id - Retrieve all weather records for a specific trip
// Response: [{ weather_id, trip_id, datetime, tempmax, tempmin, temp, humidity, precip, precipprob, snowdepth, windspeed, sunrise, sunset, conditions, description, icon }]
router.get("/:trip_id", authenticateJWT, async (req, res, next) => {
  try {
    const trip_id = Number(req.params.trip_id);
    if (!trip_id || isNaN(trip_id)) throw new BadRequestError("Invalid trip ID.");

    console.log(`[Weather] Retrieving weather for Trip ID: ${trip_id}`);

    const weather = await Weather.getAllForTrip(trip_id);
    res.json({ weather });
  } catch (err) {
    next(err);
  }
});

// GET /weather/details/:weather_id - Retrieve a specific weather record by its ID
// Response: { weather_id, trip_id, datetime, tempmax, tempmin, temp, humidity, precip, precipprob, snowdepth, windspeed, sunrise, sunset, conditions, description, icon }
router.get("/details/:weather_id", authenticateJWT, async (req, res, next) => {
  try {
    const weather_id = Number(req.params.weather_id);
    if (!weather_id || isNaN(weather_id)) throw new BadRequestError("Invalid weather ID.");

    console.log(`[Weather] Retrieving details for Weather ID: ${weather_id}`);

    const weather = await Weather.get(weather_id);
    res.json({ weather });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
