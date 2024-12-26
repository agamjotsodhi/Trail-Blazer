// Trailblazer, app.js
// Written by Agamjot Sodhi

"use strict";

const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Load environment variables from ".env"
const { NotFoundError } = require("./expressError"); // Load expressError.js for custom errors
const { authenticateJWT } = require("./middleware/auth");

// Route imports
const authRoutes = require("./routes/auth");
const tripsRoutes = require("./routes/trips");
const destinationsRoutes = require("./routes/destinations");
const weatherRoutes = require("./routes/weather");
const userRoutes = require("./routes/users"); // Import users route

// App setup
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies
app.use(authenticateJWT); // Add JWT authentication middleware

// Route handlers
app.use("/auth", authRoutes); // Authentication routes
app.use("/trips", tripsRoutes); // Trip-related routes
app.use("/destinations", destinationsRoutes); // Destination-related routes
app.use("/weather", weatherRoutes); // Weather-related routes
app.use("/users", userRoutes); // User-related routes 

// Catch-all for undefined routes
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

// Generic error handler; anything unhandled goes here.
app.use(function (err, req, res, next) {
  const status = err.status || 500;
  const message = err.message;
  res.status(status).json({ error: { message, status } });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
