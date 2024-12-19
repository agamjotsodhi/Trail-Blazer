"use strict";

const express = require("express");
const db = require("../db"); // Database connection
const { authenticateJWT } = require("../middleware/auth"); // Import authenticateJWT
const { NotFoundError } = require("../expressError");
const router = express.Router();

/**
 * Add weather data for a trip
 */
router.post("/:trip_id", authenticateJWT, async (req, res, next) => {
  try {
    const trip_id = req.params.trip_id;
    const { location_type, start_date, end_date, icon } = req.body;

    const result = await db.query(
      `INSERT INTO weather 
       (trip_id, location_type, start_date, end_date, icon)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING weather_id, trip_id, location_type, start_date, end_date, icon`,
      [trip_id, location_type, start_date, end_date, icon]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

/**
 * Get all weather records for a trip
 */
router.get("/:trip_id", authenticateJWT, async (req, res, next) => {
  try {
    const trip_id = req.params.trip_id;

    const result = await db.query(
      `SELECT weather_id, trip_id, location_type, start_date, end_date, icon
       FROM weather
       WHERE trip_id = $1
       ORDER BY start_date`,
      [trip_id]
    );

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

/**
 * Get specific weather record
 */
router.get("/details/:weather_id", authenticateJWT, async (req, res, next) => {
  try {
    const weather_id = req.params.weather_id;

    const result = await db.query(
      `SELECT weather_id, trip_id, location_type, start_date, end_date, icon
       FROM weather
       WHERE weather_id = $1`,
      [weather_id]
    );

    const weather = result.rows[0];
    if (!weather) throw new NotFoundError(`No weather record found with ID: ${weather_id}`);

    res.json(weather);
  } catch (err) {
    next(err);
  }
});

/**
 * Update a weather record
 */
router.patch("/:weather_id", authenticateJWT, async (req, res, next) => {
  try {
    const weather_id = req.params.weather_id;
    const { location_type, start_date, end_date, icon } = req.body;

    const result = await db.query(
      `UPDATE weather
       SET location_type = $1, start_date = $2, end_date = $3, icon = $4
       WHERE weather_id = $5
       RETURNING weather_id, trip_id, location_type, start_date, end_date, icon`,
      [location_type, start_date, end_date, icon, weather_id]
    );

    const weather = result.rows[0];
    if (!weather) throw new NotFoundError(`No weather record found with ID: ${weather_id}`);

    res.json(weather);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
