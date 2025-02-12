"use strict";

//authentication
// auth.js
// authenticates correct user by username and password
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");

/**
 * Middleware: Authenticate user.
 *
 * If a token is provided, verify it. If valid, store the token payload
 * (including user data) in `res.locals.user`. If invalid, log the error
 * but do not terminate the request.
 */
function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers?.authorization; // Safely access headers
    if (authHeader) {
      const token = authHeader.replace(/^Bearer\s+/i, "").trim(); // Remove 'Bearer ' prefix
      res.locals.user = jwt.verify(token, SECRET_KEY); // Store payload in res.locals.user
    }
    return next();
  } catch (err) {
    console.error("JWT authentication failed:", err.message);
    res.locals.user = null; // ✅ Prevents token crash, allows soft logout
    return next(); // ✅ Allows request to continue without hard failure
  }
}

/**
 * Middleware: Ensure the user is logged in.
 *
 * If `res.locals.user` is not set, raise UnauthorizedError.
 */
function ensureLoggedIn(req, res, next) {
  if (!res.locals.user) {
    console.warn("User not logged in.");
    return next(new UnauthorizedError("User must be logged in"));
  }
  return next();
}

/**
 * Middleware: Ensure the correct user is accessing the resource.
 *
 * Checks that the logged-in user's username matches the username
 * provided in the route params.
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
