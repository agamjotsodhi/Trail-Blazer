"use strict";

require("dotenv").config();
const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

console.log(" Checking database connection...");
console.log(" DATABASE_URL:", getDatabaseUri());

// Function to create a new database client
function createDbClient() {
  return new Client({
    connectionString: getDatabaseUri(),
    ssl: { rejectUnauthorized: false }, // Required for Supabase
    host: "db.vjyoatgcpzgqhrqksoln.supabase.co", // Ensure correct host
    port: 5432, // Ensure PostgreSQL port
    keepAlive: true, // Keep connection open
    connectionTimeoutMillis: 5000, // Prevent connection hangs
  });
}

// Function to retry database connection
async function connectWithRetry(retries = 5, delay = 5000) {
  let attempt = 0;
  while (attempt < retries) {
    const db = createDbClient();
    try {
      await db.connect();
      console.log(" Database connected successfully.");
      
      const res = await db.query("SELECT NOW()");
      console.log(" Current database time:", res.rows[0].now);
      return db; // Return connected client
    } catch (err) {
      console.error(` Database Connection Attempt ${attempt + 1} failed:`, err);
      if (attempt < retries - 1) {
        console.log(` Retrying in ${delay / 1000} seconds...`);
        await new Promise(res => setTimeout(res, delay));
      } else {
        console.error(" All retry attempts failed. Exiting process.");
        process.exit(1); // Exit app if DB connection fails completely
      }
    }
    attempt++;
  }
}

// Start the database connection
const db = connectWithRetry();

module.exports = db;
