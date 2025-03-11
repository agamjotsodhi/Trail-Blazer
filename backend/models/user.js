"use strict";

const db = require("../db.js");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql.js");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError.js");
const { BCRYPT_WORK_FACTOR } = require("../config.js");

// Handles user-related database operations
class User {
  /**
   * Authenticates a user by verifying username and password.
   * 
   * @param {string} username - The user's username.
   * @param {string} password - The user's password.
   * @returns {Promise<object>} - User details (excluding password).
   * @throws {UnauthorizedError} - If credentials are invalid.
   */
  static async authenticate(username, password) {
    const result = await db.query(
      `SELECT user_id, username, password, email, first_name
       FROM users
       WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        delete user.password; // Remove password before returning user data
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  /**
   * Registers a new user.
   * 
   * @param {object} userData - User details including username, email, password, and first name.
   * @returns {Promise<object>} - Registered user details.
   * @throws {BadRequestError} - If the username already exists.
   */
  static async register({ username, email, password, first_name }) {
    // Check if username is already taken
    const duplicateCheck = await db.query(
      `SELECT username FROM users WHERE username = $1`,
      [username]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Username already exists: ${username}`);
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users (username, email, password, first_name)
       VALUES ($1, $2, $3, $4)
       RETURNING user_id, username, email, first_name`,
      [username, email, hashedPassword, first_name]
    );

    return result.rows[0];
  }

  /**
   * Retrieves user details by username.
   * 
   * @param {string} username - The user's username.
   * @returns {Promise<object>} - User details.
   * @throws {NotFoundError} - If the user does not exist.
   */
  static async get(username) {
    const result = await db.query(
      `SELECT user_id, username, email, first_name
       FROM users
       WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user found: ${username}`);

    return user;
  }

  /**
   * Updates user details. 
   * Allowed fields: first_name, email, password.
   * 
   * @param {string} username - The user's username.
   * @param {object} data - Fields to update.
   * @returns {Promise<object>} - Updated user details.
   * @throws {NotFoundError} - If the user does not exist.
   */
  static async update(username, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { setCols, values } = sqlForPartialUpdate(data, { first_name: "first_name" });
    const userVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE username = ${userVarIdx} 
                      RETURNING user_id, username, email, first_name`;

    const result = await db.query(querySql, [...values, username]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user found: ${username}`);

    return user;
  }

  /**
   * Deletes a user by username.
   * 
   * @param {string} username - The user's username.
   * @throws {NotFoundError} - If the user does not exist.
   */
  static async remove(username) {
    const result = await db.query(
      `DELETE FROM users WHERE username = $1 RETURNING username`,
      [username]
    );

    if (!result.rows[0]) throw new NotFoundError(`No user found: ${username}`);
  }
}

module.exports = User;
