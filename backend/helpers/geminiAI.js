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
  You are a highly experienced travel planner. Create a **well-structured, detailed** travel itinerary for **${city}, ${country}** from **${startDate} to ${endDate}**.

  **Instructions for formatting:**
  - Clearly separate each day with a **bold header**.
  - Each day should contain:
    - **Personalized Suggestions:** If the user is interested in **${interests || "general travel"}**, tailor activities accordingly.
    - **Morning Activity:** A must-visit landmark or attraction.
    - **Lunch Recommendation:** A local favorite or highly-rated restaurant.
    - **Afternoon Activity:** A cultural experience, hidden gem, or shopping area.
    - **Dinner Spot:** A well-regarded restaurant serving regional specialties.
    - **Evening Experience:** A relaxing or fun activity (night market, rooftop bar, etc.).
  

  **Ensure the response follows this format exactly:**
  ---
  **Day 1: Arrival & City Highlights**

  - **Morning:** [Activity at a Famous Site]
  - **Lunch:** [Great Local Eatery] – Known for [Special Dish]
  - **Afternoon:** [Exploring a Unique Area]
  - **Dinner:** [Highly Rated Restaurant] – Offers [Type of Cuisine]
  - **Evening:** [Leisure or Social Experience]

  ---
  **Day 2: Iconic Landmarks & Hidden Gems**

  - **Morning:** [Activity at a Famous Site]
  - **Lunch:** [Great Local Eatery] – Known for [Special Dish]
  - **Afternoon:** [Exploring a Unique Area]
  - **Dinner:** [Highly Rated Restaurant] – Offers [Type of Cuisine]
  - **Evening:** [Leisure or Social Experience]

  **Use a line break before each day title to improve readability.**  
  `;

  try {
    console.log(`Generating itinerary for ${city}, ${country}...`);

    const response = await model.generateContent(prompt);
    let itinerary = response?.response?.text();

    if (!itinerary) throw new Error("Unexpected API response format.");

    // Ensure double line breaks before each "Day X" for readability
    itinerary = itinerary.replace(/\*\*Day/g, "\n\n**Day");

    // Replace single asterisks (if any) with double asterisks to ensure bold formatting
    itinerary = itinerary.replace(/\*([^*]+)\*/g, "**$1**");

    // Ensure each activity has a proper line break
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
