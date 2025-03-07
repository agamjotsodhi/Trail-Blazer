"use strict";

// Load environment variables from .env file
require("dotenv").config();

const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

// Debugging: Log the database connection string
console.log("Using database connection string:", getDatabaseUri());

let db;

// Configure database connection based on environment
if (process.env.NODE_ENV === "production") {
  db = new Client({
    connectionString: getDatabaseUri(),
    ssl: { rejectUnauthorized: false }, // Required for Supabase and other cloud-hosted DBs
  });
} else {
  db = new Client({
    connectionString: getDatabaseUri(),
  });
}

// Connect to the database
db.connect()
  .then(() => {
    console.log(" Database connected successfully.");
    return db.query("SELECT NOW()");
  })
  .then((res) => {
    console.log("Current database time:", res.rows[0].now);
  })
  .catch((err) => {
    console.error(" Database connection error:", err);
    process.exit(1); // Exit the app if DB connection fails
  });

module.exports = db;
