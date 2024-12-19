"use strict";

const db = require("../db.js");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql.js");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError.js");
const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class User {
  /**
   * Authenticate user with username and password.
   *
   * Returns { user_id, username, email, first_name }
   *
   * Throws UnauthorizedError if user not found or wrong password.
   */
  static async authenticate(username, password) {
    const result = await db.query(
      `SELECT user_id,
              username,
              password,
              email,
              first_name
       FROM users
       WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    if (user) {
      // Compare hashed password to a new hash from input password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        delete user.password; // Remove password from the returned object
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  /**
   * Register a new user with provided data.
   *
   * Returns { user_id, username, email, first_name }
   *
   * Throws BadRequestError on duplicates.
   */
  static async register({ username, email, password, first_name }) {
    const duplicateCheck = await db.query(
      `SELECT username
       FROM users
       WHERE username = $1`,
      [username]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users
       (username, email, password, first_name)
       VALUES ($1, $2, $3, $4)
       RETURNING user_id, username, email, first_name`,
      [username, email, hashedPassword, first_name]
    );

    const user = result.rows[0];

    return user;
  }

  /**
   * Find all users.
   *
   * Returns [{ user_id, username, email, first_name }, ...]
   */
  static async findAll() {
    const result = await db.query(
      `SELECT user_id,
              username,
              email,
              first_name
       FROM users
       ORDER BY username`
    );

    return result.rows;
  }

  /**
   * Get a specific user by username.
   *
   * Returns { user_id, username, email, first_name }
   *
   * Throws NotFoundError if user not found.
   */
  static async get(username) {
    const result = await db.query(
      `SELECT user_id,
              username,
              email,
              first_name
       FROM users
       WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    return user;
  }

  /**
   * Update user data with provided `data`.
   *
   * Data can include: { username, email, password, first_name }
   *
   * Returns { user_id, username, email, first_name }
   *
   * Throws NotFoundError if user not found.
   */
  static async update(user_id, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { setCols, values } = sqlForPartialUpdate(data, {
      first_name: "first_name",
    });
    const userVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE user_id = ${userVarIdx} 
                      RETURNING user_id, username, email, first_name`;

    const result = await db.query(querySql, [...values, user_id]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${user_id}`);

    return user;
  }

  /**
   * Delete user by username.
   *
   * Returns undefined.
   *
   * Throws NotFoundError if user not found.
   */
  static async remove(username) {
    const result = await db.query(
      `DELETE
       FROM users
       WHERE username = $1
       RETURNING username`,
      [username]
    );

    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);
  }

    /**
   * Add a trip for a user.
   *
   * - userId: ID of the user adding the trip
   * - tripData: { trip_name, start_date, end_date, start_city, end_city, start_country, end_country }
   *
   * Returns the newly added trip: { trip_id, trip_name, start_date, end_date, start_city, end_city, start_country, end_country }
   *
   * Throws BadRequestError if the trip already exists for the user.
   */
    static async addUserTrip(user_id, { trip_name, start_date, end_date, start_city, end_city, start_country, end_country }) {
      // Check for duplicate trip names for the same user
      const duplicateCheck = await db.query(
        `SELECT trip_id
         FROM trips
         WHERE user_id = $1 AND trip_name = $2`,
        [user_id, trip_name]
      );
  
      if (duplicateCheck.rows[0]) {
        throw new BadRequestError(`Duplicate trip name: ${trip_name}`);
      }
  
      // Insert new trip into the trips table
      const result = await db.query(
        `INSERT INTO trips
         (user_id, trip_name, start_date, end_date, start_city, end_city, start_country, end_country)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING trip_id, trip_name, start_date, end_date, start_city, end_city, start_country, end_country`,
        [user_id, trip_name, start_date, end_date, start_city, end_city, start_country, end_country]
      );
  
      return result.rows[0];
    }
}

module.exports = User;