"use strict";

const { BadRequestError } = require("../expressError");

/**
 * Helper for making selective update queries.
 *
 * This function is used to construct the SET clause of an SQL UPDATE statement.
 *
 * @param dataToUpdate {Object} An object containing the fields to update and their new values.
 *   Example: { firstName: 'Aliya', email: 'new@example.com' }
 * @param jsToSql {Object} A mapping of JavaScript-style field names to SQL column names.
 *   Example: { firstName: "first_name", email: "email" }
 *
 * @returns {Object} An object containing:
 *   - `setCols`: A string for the SET clause of an SQL statement.
 *   - `values`: An array of the values to update.
 *
 * @throws {BadRequestError} If no data is provided for update.
 *
 * @example
 *   sqlForPartialUpdate(
 *     { firstName: 'Aliya', email: 'new@example.com' },
 *     { firstName: "first_name", email: "email" }
 *   )
 *   =>
 *   {
 *     setCols: '"first_name"=$1, "email"=$2',
 *     values: ['Aliya', 'new@example.com']
 *   }
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);

  // Throw an error if no data is provided for update
  if (keys.length === 0) throw new BadRequestError("No data");

  // Build the SET clause of the SQL statement
  const cols = keys.map((colName, idx) =>
    `"${jsToSql[colName] || colName}"=$${idx + 1}`
  );

  return {
    setCols: cols.join(", "), // Example: '"first_name"=$1, "email"=$2'
    values: Object.values(dataToUpdate), // Example: ['Aliya', 'new@example.com']
  };
}

module.exports = { sqlForPartialUpdate };
