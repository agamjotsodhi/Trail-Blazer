"use strict";

const express = require("express");
const db = require("../db"); // Database connection
const { authenticateJWT } = require("../middleware/auth"); // Import authenticateJWT
const { NotFoundError } = require("../expressError");
const router = express.Router();

/**
 * Add a destination to a trip
 * 

 */
router.post("/:trip_id", authenticateJWT, async (req, res, next) => {
  try {
    const trip_id = req.params.trip_id;
    const { country, city, capital_city, currency, language, timezones, flag, start_of_week } = req.body;

    const result = await db.query(
      `INSERT INTO destinations 
       (trip_id, country, city, capital_city, currency, language, timezones, flag, start_of_week)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING destination_id, trip_id, country, city, capital_city, currency, language, timezones, flag, start_of_week`,
      [trip_id, country, city, capital_city, currency, language, timezones, flag, start_of_week]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

/**
 * Get all destinations for a trip
 */
router.get("/:trip_id", authenticateJWT, async (req, res, next) => {
  try {
    const trip_id = req.params.trip_id;

    const result = await db.query(
      `SELECT destination_id, trip_id, country, city, capital_city, currency, language, timezones, flag, start_of_week
       FROM destinations
       WHERE trip_id = $1
       ORDER BY country, city`,
      [trip_id]
    );

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

/**
 * Get a specific destination
 */
router.get("/details/:destination_id", authenticateJWT, async (req, res, next) => {
  try {
    const destination_id = req.params.destination_id;

    const result = await db.query(
      `SELECT destination_id, trip_id, country, city, capital_city, currency, language, timezones, flag, start_of_week
       FROM destinations
       WHERE destination_id = $1`,
      [destination_id]
    );

    const destination = result.rows[0];
    if (!destination) throw new NotFoundError(`No destination found with ID: ${destination_id}`);

    res.json(destination);
  } catch (err) {
    next(err);
  }
});

module.exports = router;