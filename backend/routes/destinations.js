"use strict";

const express = require("express");
const { authenticateJWT } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Destination = require("../models/destination");

const router = express.Router();

/**
 * POST /destinations
 * 
 * Adds or updates a destination.
 * 
 * Request body: { country: "Country Name" }
 * Response: { destination: { ...destinationDetails } }
 */
router.post("/", authenticateJWT, async (req, res, next) => {
  try {
    const { country } = req.body;

    if (!country?.trim()) {
      throw new BadRequestError("Valid country name is required.");
    }

    console.log(`[Destinations] Adding or updating: ${country.trim()}`);

    const destination = await Destination.addOrUpdate(country.trim());
    res.status(201).json({ destination });
  } catch (err) {
    console.error("[Destinations] Error processing request:", err.message);
    next(err);
  }
});

/**
 * GET /destinations/country/:country
 * 
 * Retrieves destination details by country name.
 * 
 * Response: { destination: { ...destinationDetails } }
 */
router.get("/country/:country", authenticateJWT, async (req, res, next) => {
  try {
    const { country } = req.params;

    if (!country?.trim()) {
      throw new BadRequestError("Valid country name is required.");
    }

    console.log(`[Destinations] Fetching details for: ${country.trim()}`);

    const destination = await Destination.getByCountry(country.trim());
    res.json({ destination });
  } catch (err) {
    console.error("[Destinations] Error fetching country details:", err.message);
    next(err);
  }
});

/**
 * GET /destinations/suggestions/:query
 * 
 * Retrieves country name suggestions based on user input.
 * 
 * Response: { suggestions: ["Canada", "Cambodia", "Cameroon", ...] }
 */
router.get("/suggestions/:query", authenticateJWT, async (req, res, next) => {
  try {
    const { query } = req.params;

    if (!query?.trim()) {
      throw new BadRequestError("Valid search query is required.");
    }

    console.log(`[Destinations] Fetching country suggestions for: ${query.trim()}`);

    const suggestions = await Destination.getCountrySuggestions(query.trim());
    res.json({ suggestions });
  } catch (err) {
    console.error("[Destinations] Error fetching country suggestions:", err.message);
    next(err);
  }
});

/**
 * GET /destinations
 * 
 * Retrieves all destinations.
 * 
 * Response: { destinations: [{ ...destinationDetails }, ...] }
 */
router.get("/", authenticateJWT, async (req, res, next) => {
  try {
    console.log("[Destinations] Fetching all destinations...");

    const destinations = await Destination.getAll();
    res.json({ destinations });
  } catch (err) {
    console.error("[Destinations] Error fetching all destinations:", err.message);
    next(err);
  }
});

module.exports = router;
