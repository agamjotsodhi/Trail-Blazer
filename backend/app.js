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

/**
 * CORS Configuration
 * 
 * - Allows requests from the frontend at the specified origin.
 * - Supports common HTTP methods.
 * - Enables credentials for JWT authentication & cookies.
 */
const corsOptions = {
  origin: "https://trailblazer-trip-planning.onrender.com", // Frontend deployment URL
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, 
};

app.use(cors(corsOptions)); // Apply CORS settings
app.use(express.json()); // Parse JSON request bodies
app.use(authenticateJWT); // JWT authentication middleware

/**
 * Route Handlers
 * 
 * - /auth: Authentication routes
 * - /trips: Trip management
 * - /destinations: Destination details & search
 * - /weather: Weather data retrieval
 * - /users: User profile management
 */
app.use("/auth", authRoutes);
app.use("/trips", tripsRoutes);
app.use("/destinations", destinationsRoutes);
app.use("/weather", weatherRoutes);
app.use("/users", userRoutes);

/**
 * Catch-all for undefined routes
 */
app.use((req, res, next) => {
  return next(new NotFoundError());
});

/**
 * Global error handler
 * 
 * - Returns JSON response with error message and status code.
 */
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message;
  res.status(status).json({ error: { message, status } });
});

module.exports = app;
