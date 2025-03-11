"use strict";

// helpers/geminiAI.js

const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GEMINI_API_KEY;

// Alert for any issues/missing Gemini API Key. AI Feature wont work otherwise
if (!API_KEY) {
  console.warn("GEMINI_API_KEY is missing. AI-generated itineraries will not work.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Generates a personalized travel itinerary using the Gemini AI API.
 * 
 * @param {string} city - Destination city.
 * @param {string} country - Destination country.
 * @param {string} interests - User interests (e.g., "history, food, art"). Optional.
 * @param {string} startDate - Trip start date.
 * @param {string} endDate - Trip end date.
 * @returns {Promise<string>} - AI-generated itinerary.
 */
async function generateItinerary(city, country, interests, startDate, endDate) {
  if (!API_KEY) return "Itinerary generation is unavailable due to missing API credentials.";

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
  You are a skilled travel planner. Create a **detailed, well-structured** itinerary for **${city}, ${country}** from **${startDate} to ${endDate}**.

  **Formatting Instructions:**
  - Use a **bold header** for each day.
  - Each day should include:
    - **Personalized Suggestions** based on the user's interests: **${interests || "general travel"}**.
    - **Morning Activity**: A must-visit attraction.
    - **Lunch Recommendation**: A popular local restaurant.
    - **Afternoon Activity**: A cultural experience or hidden gem.
    - **Dinner Spot**: A restaurant serving regional specialties.
    - **Evening Experience**: A fun or relaxing activity (e.g., night market, rooftop bar).

  **Example Itinerary Format:**
  ---
  **Day 1: Arrival & City Highlights**
  - **Morning:** Visit [Landmark]
  - **Lunch:** [Restaurant] – Known for [Special Dish]
  - **Afternoon:** Explore [Unique Area]
  - **Dinner:** [Restaurant] – Offers [Cuisine]
  - **Evening:** [Night Activity]

  ---
  **Day 2: Iconic Landmarks & Hidden Gems**
  - **Morning:** Visit [Famous Site]
  - **Lunch:** [Great Local Eatery] – Known for [Special Dish]
  - **Afternoon:** Discover [Cultural Spot]
  - **Dinner:** [Highly Rated Restaurant] – Offers [Cuisine]
  - **Evening:** [Leisure or Social Experience]

  **Ensure clear line breaks before each day's title for readability.**
  `;

  try {
    console.log(`Generating itinerary for ${city}, ${country}...`);

    const response = await model.generateContent(prompt);
    let itinerary = response?.response?.text();

    if (!itinerary) throw new Error("Unexpected API response format.");

    // Improve readability: Add double line breaks before each day title
    itinerary = itinerary.replace(/\*\*Day/g, "\n\n**Day");

    // Ensure bold formatting is consistent
    itinerary = itinerary.replace(/\*([^*]+)\*/g, "**$1**");

    // Add line breaks before each activity type
    itinerary = itinerary.replace(/- \*\*(Morning|Lunch|Afternoon|Dinner|Evening)\*\:/g, "\n- **$1:**");

    return itinerary.trim();
  } catch (error) {
    console.error("Itinerary generation failed:", { city, country, startDate, endDate, error: error.message });

    if (error.message.includes("quota") || error.message.includes("limit")) {
      return "Sorry, we've hit our AI request limit. Please try again later.";
    }

    return "Sorry, I couldn't generate an itinerary at this time.";
  }
}

module.exports = { generateItinerary };
