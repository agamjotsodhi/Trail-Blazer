"use strict";

/**
 * Authentication Routes
 *
 * Handles:
 * - User login: POST /auth/token (returns a JWT token)
 * - User registration: POST /auth/register (creates a new user and returns a JWT token)
 */

const express = require("express");
const jsonschema = require("jsonschema");
const { validate } = require("jsonschema");

const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userRegister.json");
const { BadRequestError } = require("../expressError");

const router = new express.Router();

/**
 * POST /auth/token
 *
 * Logs in a user and returns a JWT token.
 *
 * Request body:
 *   { username: string, password: string }
 *
 * Response:
 *   { token: string }
 *
 * Authorization: None
 */
router.post("/token", async (req, res, next) => {
  try {
    const validator = validate(req.body, userAuthSchema);
    if (!validator.valid) {
      throw new BadRequestError(validator.errors.map((e) => e.stack));
    }

    const { username, password } = req.body;
    const user = await User.authenticate(username, password);
    const token = createToken(user);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

/**
 * POST /auth/register
 *
 * Registers a new user and returns the user object and a JWT token.
 *
 * Request body:
 *   { username: string, password: string, first_name: string, email: string }
 *
 * Response:
 *   { user: { username, first_name, email }, token: string }
 *
 * Authorization: None
 */
router.post("/register", async (req, res, next) => {
  try {
    const validator = validate(req.body, userRegisterSchema);
    if (!validator.valid) {
      throw new BadRequestError(validator.errors.map((e) => e.stack));
    }

    const { username, password, first_name, email } = req.body;
    const newUser = await User.register({ username, password, first_name, email });
    const token = createToken(newUser); // Generate token for the new user
    return res.status(201).json({ user: newUser, token });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;