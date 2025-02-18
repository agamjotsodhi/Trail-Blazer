"use strict";

const db = require("../db");
const { BadRequestError } = require("../expressError");

class Destination {
  // Check if a country name is provided and valid
  static validateCountry(country) {
    if (!country || !country.trim()) {
      throw new BadRequestError("Country name is required.");
    }
  }

  // Get destination details by country name
  // Searches the database for a match using either `common_name` or `official_name`
  static async getByCountry(country) {
    this.validateCountry(country);

    const result = await db.query(
      `SELECT * FROM destinations WHERE common_name ILIKE $1 OR official_name ILIKE $1`,
      [country.trim()]
    );

    if (!result.rows.length) {
      throw new BadRequestError(`No destination found for: ${country}`);
    }

    return result.rows[0];
  }

  // Tries to get destination details but handles errors gracefully
  // If no destination is found, returns a fallback message instead of throwing an error
  static async fetchDestinationSafely(country) {
    try {
      return await this.getByCountry(country);
    } catch (err) {
      console.error("[Destination] Failed to fetch destination data:", err.message);
      return { message: "Destination details unavailable." };
    }
  }

  // Get country name suggestions based on a partial input
  // Returns up to 10 matching country names
  static async getCountrySuggestions(query) {
    if (!query || !query.trim()) {
      throw new BadRequestError("Search query is required.");
    }

    const result = await db.query(
      `SELECT DISTINCT common_name FROM destinations WHERE common_name ILIKE $1 LIMIT 10`,
      [`${query.trim()}%`]
    );

    return result.rows.map((row) => row.common_name);
  }
}

module.exports = Destination;
