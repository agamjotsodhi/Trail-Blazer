"use strict";

const db = require("../db");
const { BadRequestError } = require("../expressError");

class Destination {
  /**
   * Validate country name input.
   * @param {string} country - The country name.
   * @throws {BadRequestError} - If input is missing or invalid.
   */
  static validateCountry(country) {
    if (!country || !country.trim()) {
      throw new BadRequestError("Country name is required.");
    }
  }

  /**
   * Retrieve destination data by country name.
   * Queries the database for destination details using either `common_name` or `official_name`.
   * 
   * @param {string} country - Country name.
   * @returns {Promise<object>} - Destination details.
   */
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

  /**
   * Fetch destination data safely.
   * If an error occurs (e.g., country not found), return a fallback message instead of throwing an error.
   * 
   * @param {string} country - Country name.
   * @returns {Promise<object>} - Destination data or error message.
   */
  static async fetchDestinationSafely(country) {
    try {
      return await this.getByCountry(country);
    } catch (err) {
      console.error(" [Destination] Failed to fetch destination data:", err.message);
      return { message: "Destination details unavailable." };
    }
  }

  /**
 * Retrieve country suggestions based on partial input.
 * Queries the database for countries matching the input.
 *
 * @param {string} query - Partial country name.
 * @returns {Promise<Array>} - List of country names.
 */
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
