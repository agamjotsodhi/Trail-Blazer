// Trailblazer - app.js
// Written by Agamjot Sodhi

"use strict";

const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Load environment variables
const { NotFoundError } = require("./expressError");
const { authenticateJWT } = require("./middleware/auth");

// Import route handlers
const authRoutes = require("./routes/auth");
const tripsRoutes = require("./routes/trips");
const destinationsRoutes = require("./routes/destinations");
const weatherRoutes = require("./routes/weather");
const userRoutes = require("./routes/users");

const app = express();

// FIXED: CORS CONFIGURATION
const corsOptions = {
  origin: "https://trailblazer-trip-planning.onrender.com", // frontend deployment URL
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allows JWT authentication & cookies
};

app.use(cors(corsOptions)); // Apply CORS with the correct settings
app.use(express.json()); // Parse JSON request bodies
app.use(authenticateJWT); // JWT authentication middleware

// Route handlers
app.use("/auth", authRoutes); // Authentication routes
app.use("/trips", tripsRoutes); // Trip-related routes
app.use("/destinations", destinationsRoutes); // Destination-related routes
app.use("/weather", weatherRoutes); // Weather-related routes
app.use("/users", userRoutes); // User-related routes 

// Catch-all for undefined routes
app.use((req, res, next) => {
  return next(new NotFoundError());
});

// Global error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message;
  res.status(status).json({ error: { message, status } });
});

module.exports = app;
