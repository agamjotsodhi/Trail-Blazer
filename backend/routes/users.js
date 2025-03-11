"use strict";

const express = require("express");
const jsonschema = require("jsonschema");
const { BadRequestError, NotFoundError } = require("../expressError");
const User = require("../models/user");
const { ensureCorrectUser } = require("../middleware/auth");
const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();

/**
 * GET /:username
 * 
 * Retrieves user details.
 * 
 * Response: { user: { username, first_name, email } }
 * Authorization: User must be logged in and match the requested username.
 */
router.get("/:username", ensureCorrectUser, async (req, res, next) => {
  try {
    const user = await User.get(req.params.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/**
 * PATCH /:username
 * 
 * Updates user profile details.
 * 
 * Request body: { first_name, email, password }
 * Response: { user: { username, first_name, email } }
 * Authorization: User must be logged in and match the requested username.
 */
router.patch("/:username", ensureCorrectUser, async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, userUpdateSchema);
    if (!validator.valid) {
      throw new BadRequestError(validator.errors.map((e) => e.stack));
    }

    const updatedUser = await User.update(req.params.username, req.body);
    return res.json({ user: updatedUser });
  } catch (err) {
    return next(err);
  }
});

/**
 * DELETE /:username
 * 
 * Deletes a user account.
 * 
 * Response: { deleted: username }
 * Authorization: User must be logged in and match the requested username.
 */
router.delete("/:username", ensureCorrectUser, async (req, res, next) => {
  try {
    await User.remove(req.params.username);
    return res.json({ deleted: req.params.username });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
