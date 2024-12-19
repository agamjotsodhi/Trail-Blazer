const axios = require('axios');

/**
 * Fetch country data from RestCountries API.
 *
 * @param {string} countryName - The name of the country (e.g., "Canada").
 * @returns {Promise<object>} - Country data from the API.
 */

// Single function that interacts with the restcountries API

async function fetchCountryData(countryName) {
  try {
    const response = await axios.get(`https://restcountries.com/v3.1/name/${countryName}`);
    return response.data[0]; // Return the first matching country
  } catch (error) {
    throw new Error(`Failed to fetch country data for "${countryName}": ${error.message}`);
  }
}

module.exports = { fetchCountryData };
