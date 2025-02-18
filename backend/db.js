"use strict";

// Sets up the database connection for the Trailblazer backend

const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

let db;

// Configure database connection based on environment
if (process.env.NODE_ENV === "production") {
  db = new Client({
    connectionString: getDatabaseUri(),
    ssl: {
      rejectUnauthorized: false, // Required for some cloud-hosted databases
    },
  });
} else {
  db = new Client({
    connectionString: getDatabaseUri(),
  });
}

// Connect to the database
db.connect();

// Test query to confirm database connection
db.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Database connected successfully. Current time:", res.rows[0].now);
  }
});

module.exports = db;
