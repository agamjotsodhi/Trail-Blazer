"use strict";

require("dotenv").config();
const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

console.log(" Checking database connection...");
console.log(" DATABASE_URL:", getDatabaseUri());

const db = new Client({
  connectionString: getDatabaseUri(),
  ssl: { rejectUnauthorized: false }, // Required for Supabase
  keepAlive: true,
  connectionTimeoutMillis: 5000, // Prevent connection hangs
});

db.connect()
  .then(() => console.log(" Database connected successfully."))
  .catch(err => {
    console.error(" Database Connection Error:", err);
    process.exit(1); // Exit app if DB isn't reachable
  });

module.exports = db;
