"use strict";

/** Routes for authentication. */

const jsonschema = require("jsonschema");

const User = require("../models/user");
const express = require("express");
const { validate } = require("jsonschema"); // Import validate
const router = new express.Router();
const { createToken } = require("../helpers/tokens");
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userRegister.json");
const { BadRequestError } = require("../expressError");

/** POST /auth/token:  { username, password } => { token }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/token", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userAuthSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const { username, password } = req.body;
    const user = await User.authenticate(username, password);
    const token = createToken(user);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});


/** POST /auth/register:   { user } => { token }
 *
 * user must include { username, password, firstName, lastName, email }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */
/** Register a new user */
router.post("/register", async (req, res, next) => {
  try {
    // Validate request body against userRegisterSchema
    const validation = validate(req.body, userRegisterSchema);
    if (!validation.valid) {
      const errors = validation.errors.map(e => e.stack);
      throw new BadRequestError(errors);
    }

    const { username, password, first_name, email } = req.body; // Match schema field names
    const newUser = await User.register({ username, password, first_name, email });
    return res.status(201).json({ user: newUser });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
