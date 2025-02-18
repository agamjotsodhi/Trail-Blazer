"use strict";

// auth.js - Authentication middleware

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");

/**
 * Middleware: Authenticate user via JWT.
 *
 * If a valid token is provided, stores the decoded user data in `res.locals.user`.
 * If invalid or missing, logs the error and continues without authentication.
 */
function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers?.authorization; // Check for authorization header
    if (authHeader) {
      const token = authHeader.replace(/^Bearer\s+/i, "").trim(); // Remove 'Bearer' prefix
      res.locals.user = jwt.verify(token, SECRET_KEY); // Store user data
    }
  } catch (err) {
    console.error("JWT authentication failed:", err.message);
    res.locals.user = null; // Allows request to proceed without authentication
  }
  return next();
}

/**
 * Middleware: Ensure the user is logged in.
 *
 * If no authenticated user is found in `res.locals.user`, throw an UnauthorizedError.
 */
function ensureLoggedIn(req, res, next) {
  if (!res.locals.user) {
    console.warn("Unauthorized access attempt.");
    return next(new UnauthorizedError("User must be logged in"));
  }
  return next();
}

/**
 * Middleware: Ensure the correct user is accessing the resource.
 *
 * Verifies that the logged-in user's username matches the username in route params.
 */
function ensureCorrectUser(req, res, next) {
  const user = res.locals.user;
  if (!user || user.username !== req.params.username) {
    return next(new UnauthorizedError("You are not authorized to access this resource"));
  }
  return next();
}

module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureCorrectUser,
};
