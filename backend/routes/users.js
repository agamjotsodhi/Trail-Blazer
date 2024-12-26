"use strict";

/** Routes for users. */

const express = require("express");
const jsonschema = require("jsonschema");
const { BadRequestError, NotFoundError } = require("../expressError");
const User = require("../models/user");
const { ensureCorrectUser } = require("../middleware/auth"); // Simplified middleware name for clarity
const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();

/**
 * GET /:username => { user }
 *
 * Retrieves user details.
 *
 * Returns:
 *   { username, first_name, email }
 *
 * Authorization required: Logged-in user matching the username
 */
router.get("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    const user = await User.get(req.params.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/**
 * PATCH /:username { user } => { user }
 *
 * Allows a user to update their profile.
 *
 * Data can include:
 *   { first_name, email, password }
 *
 * Returns:
 *   { username, first_name, email }
 *
 * Authorization required: Logged-in user matching the username
 */
router.patch("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const updatedUser = await User.update(req.params.username, req.body);
    return res.json({ user: updatedUser });
  } catch (err) {
    return next(err);
  }
});

/**
 * DELETE /:username => { deleted: username }
 *
 * Allows a user to delete their account.
 *
 * Authorization required: Logged-in user matching the username
 */
router.delete("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    await User.remove(req.params.username);
    return res.json({ deleted: req.params.username });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
