// seeds/seedDestinations.js
// Populates the destinations table with data from the REST Countries API.

"use strict";

const db = require("../db");
const axios = require("axios");
const { prepareCountryDetails } = require("../helpers/countriesAPI");

/**
 * Seeds the destinations table with data from the REST Countries API.
 */
async function seedDestinations() {
  console.log("Seeding destinations table...");

  try {
    // Fetch all countries from the REST Countries API
    const { data: countries } = await axios.get("https://restcountries.com/v3.1/all");
    console.log(`Fetched ${countries.length} countries. Inserting into database...`);

    let successCount = 0;
    let errorCount = 0;

    for (const country of countries) {
      try {
        const details = prepareCountryDetails(country);

        // Insert country details into the destinations table
        await db.query(
          `INSERT INTO destinations 
           (common_name, official_name, capital_city, independent, un_member, currencies, alt_spellings, 
            region, subregion, languages, borders, population, car_signs, car_side, google_maps, flag)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
           ON CONFLICT (common_name) DO NOTHING`,
          Object.values(details)
        );

        // console error handling updates while adding countries
        console.log(`Inserted: ${details.common_name}`);
        successCount++;
      } catch (err) {
        console.error(`Failed to insert: ${country.name?.common || "Unknown"}. Error: ${err.message}`);
        errorCount++;
      }
    }

    console.log(`Seeding completed: ${successCount} successful, ${errorCount} errors.`);
  } catch (err) {
    console.error("Seeding failed:", err.message);
  } finally {
    db.end(); 
    process.exit(); 
  }
}

// Run the seeding script
seedDestinations();
