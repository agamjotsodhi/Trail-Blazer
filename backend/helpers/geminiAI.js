"use strict";

const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GEMINI_API_KEY;

// Error handling for .env/api_key
if (!API_KEY) {
  console.warn("GEMINI_API_KEY is missing. AI-generated itineraries will not work.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Generate an AI-powered travel itinerary using the Gemini API.
 *
 * @param {string} city - Trip destination city.
 * @param {string} country - Trip destination country.
 * @param {string} interests - User interests (e.g., "history, food, art"). Optional.
 * @param {string} startDate - Start date of the trip.
 * @param {string} endDate - End date of the trip.
 * @returns {Promise<string>} - AI-generated travel itinerary.
 */
async function generateItinerary(city, country, interests, startDate, endDate) {
  if (!API_KEY) return "Itinerary generation is unavailable due to missing API credentials.";

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
  You are a travel planner. Create a **concise travel itinerary** for **${city}, ${country}** from **${startDate} to ${endDate}**.

  Include:
  - Must-visit landmarks (1-2 per day)
  - A recommended dining spot per day
  - A unique local activity per day

  ${interests ? `The user is interested in: **${interests}**.` : ""}

  **Format the response as follows**:
  - **Day X:** [Landmark], [Dining], [Activity]
  - Keep each day's details under 3 lines.
  - Ensure a clear, structured layout.
  `;

  try {
    console.log(` Generating itinerary for ${city}, ${country}...`);

    const response = await model.generateContent(prompt);
    const itinerary = response?.response?.text();

    if (!itinerary) throw new Error("Unexpected API response format.");

    return itinerary;
  } catch (error) {
    console.error("Itinerary generation failed:", { city, country, startDate, endDate, error: error.message });

    if (error.message.includes("quota") || error.message.includes("limit")) {
      return "Sorry, we've hit our AI request limit. Please try again later.";
    }

    return "Sorry, I couldn't generate an itinerary at this time.";
  }
}

module.exports = { generateItinerary };
