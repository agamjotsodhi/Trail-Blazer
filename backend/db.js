"use strict";

// Load environment variables from .env file
require("dotenv").config();

const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

// Debugging: Log the database connection string
console.log(" Checking database connection...");
console.log(" DATABASE_URL:", getDatabaseUri());

let db;

// Configure database connection based on environment
const dbConfig = {
  connectionString: getDatabaseUri(),
  ssl: { rejectUnauthorized: false }, // Required for Supabase
  host: "db.vjyoatgcpzgqhrqksoln.supabase.co", // Force correct host
  port: 5432, // Explicitly set PostgreSQL port
  keepAlive: true, // Keep connection open
  connectionTimeoutMillis: 5000, // Prevent connection hangs
};

if (process.env.NODE_ENV === "production") {
  db = new Client(dbConfig);
} else {
  db = new Client({ connectionString: getDatabaseUri() });
}

// Function to retry connection in case of failure
async function connectWithRetry() {
  try {
    await db.connect();
    console.log(" Database connected successfully.");
    
    const res = await db.query("SELECT NOW()");
    console.log(" Current database time:", res.rows[0].now);
  } catch (err) {
    console.error(" Database Connection Error:", err);
    console.error(" Retrying in 5 seconds...");
    
    setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
  }
}

// Try connecting to the database
connectWithRetry();

module.exports = db;
