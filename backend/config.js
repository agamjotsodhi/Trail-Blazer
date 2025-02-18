"use strict";

// Shared configuration for the application

require("dotenv").config();
require("colors");

// Secret key for signing JWTs
const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";

// Port for the application (defaults to 3000 if not set)
const PORT = +process.env.PORT || 3000;

// Get the appropriate database URI based on the environment
function getDatabaseUri() {
  return process.env.NODE_ENV === "test"
    ? process.env.DATABASE_URL_TEST || "postgresql://postgres:password@localhost:5432/trailblazer_test"
    : process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/trailblazer";
}

// Set bcrypt work factor (lower for tests, higher for production)
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

// Log configuration details for debugging
console.log("Trailblazer Config:".green);
console.log("SECRET_KEY:".yellow, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR:".yellow, BCRYPT_WORK_FACTOR);
console.log("Database:".yellow, getDatabaseUri());
console.log("---");

// Export configuration values
module.exports = {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
};
