"use strict";

const { BadRequestError } = require("../expressError");

/**
 * Helper for making selective update queries.
 *
 * Constructs the SET clause of an SQL UPDATE statement.
 *
 * @param {Object} dataToUpdate - Fields to update and their new values.
 *   Example: { firstName: 'Jon', email: 'new@example.com' }
 * @param {Object} jsToSql - Mapping of JavaScript-style field names to SQL column names.
 *   Example: { firstName: "first_name", email: "email" }
 *
 * @returns {Object} An object containing:
 *   - `setCols` {string}: The SET clause for the SQL statement.
 *   - `values` {Array}: The values for the prepared statement.
 *
 * @throws {BadRequestError} If no data is provided for update.
 *
 * @example
 *   sqlForPartialUpdate(
 *     { firstName: 'Jon', email: 'new@example.com' },
 *     { firstName: "first_name", email: "email" }
 *   )
 *   =>
 *   {
 *     setCols: '"first_name"=$1, "email"=$2',
 *     values: ['Jon', 'new@example.com']
 *   }
 */
function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);

  // Check if there is no data to update
  if (keys.length === 0) {
    throw new BadRequestError("No data provided for update");
  }

  // Build the SET clause of the SQL statement
  const setCols = keys.map((colName, idx) =>
    `"${jsToSql[colName] || colName}"=$${idx + 1}`
  );

  return {
    setCols: setCols.join(", "), // E.g., '"first_name"=$1, "email"=$2'
    values: Object.values(dataToUpdate), // E.g., ['Jon', 'new@example.com']
  };
}

module.exports = { sqlForPartialUpdate };
