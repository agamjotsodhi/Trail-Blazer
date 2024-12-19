"use strict";

const express = require("express");
const db = require("../db"); // Database connection
const { authenticateJWT, ensureLoggedIn } = require("../middleware/auth"); // Import specific middleware
const { NotFoundError } = require("../expressError");
const router = express.Router();

/**
 * Add a new trip
 */
router.post("/", authenticateJWT, ensureLoggedIn, async (req, res, next) => {
  try {
    const user_id = res.locals.user.user_id; // Use res.locals.user to get user data
    const { trip_name, start_date, end_date, start_city, end_city, start_country, end_country } = req.body;

    const result = await db.query(
      `INSERT INTO trips 
       (user_id, trip_name, start_date, end_date, start_city, end_city, start_country, end_country)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING trip_id, user_id, trip_name, start_date, end_date, start_city, end_city, start_country, end_country`,
      [user_id, trip_name, start_date, end_date, start_city, end_city, start_country, end_country]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

/**
 * Get all trips for a user
 */
router.get("/", authenticateJWT, async (req, res, next) => {
  try {
    const user_id = res.locals.user.user_id;

    const result = await db.query(
      `SELECT trip_id, user_id, trip_name, start_date, end_date, start_city, end_city, start_country, end_country
       FROM trips
       WHERE user_id = $1
       ORDER BY start_date`,
      [user_id]
    );

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

/**
 * Get a specific trip
 */
router.get("/:trip_id", authenticateJWT, async (req, res, next) => {
  try {
    const user_id = res.locals.user.user_id;
    const trip_id = req.params.trip_id;

    const result = await db.query(
      `SELECT trip_id, user_id, trip_name, start_date, end_date, start_city, end_city, start_country, end_country
       FROM trips
       WHERE trip_id = $1 AND user_id = $2`,
      [trip_id, user_id]
    );

    const trip = result.rows[0];
    if (!trip) throw new NotFoundError(`No trip found with ID: ${trip_id}`);

    res.json(trip);
  } catch (err) {
    next(err);
  }
});

/**
 * Delete a trip
 */
router.delete("/:trip_id", authenticateJWT, async (req, res, next) => {
  try {
    const user_id = res.locals.user.user_id;
    const trip_id = req.params.trip_id;

    const result = await db.query(
      `DELETE
       FROM trips
       WHERE trip_id = $1 AND user_id = $2
       RETURNING trip_id`,
      [trip_id, user_id]
    );

    if (!result.rows[0]) throw new NotFoundError(`No trip found with ID: ${trip_id}`);

    res.json({ message: "Trip deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
