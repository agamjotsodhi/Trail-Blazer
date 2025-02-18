"use strict";

// auth.test.js - Tests for authentication middleware

const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../expressError");
const {
  authenticateJWT,
  ensureLoggedIn,
  ensureAdmin,
  ensureCorrectUserOrAdmin,
} = require("./auth");

const { SECRET_KEY } = require("../config");

// Create valid and invalid test JWTs
const testJwt = jwt.sign({ username: "test", isAdmin: false }, SECRET_KEY);
const badJwt = jwt.sign({ username: "test", isAdmin: false }, "wrong");


describe("authenticateJWT", function () {
  test("works: valid token in header", function () {
    expect.assertions(2);

    const req = { headers: { authorization: `Bearer ${testJwt}` } };
    const res = { locals: {} };
    const next = function (err) {
      expect(err).toBeFalsy();
    };

    authenticateJWT(req, res, next);

    expect(res.locals).toEqual({
      user: {
        iat: expect.any(Number),
        username: "test",
        isAdmin: false,
      },
    });
  });

  test("works: no token provided", function () {
    expect.assertions(2);

    const req = {};
    const res = { locals: {} };
    const next = function (err) {
      expect(err).toBeFalsy();
    };

    authenticateJWT(req, res, next);

    expect(res.locals).toEqual({});
  });

  test("fails: invalid token", function () {
    expect.assertions(2);

    const req = { headers: { authorization: `Bearer ${badJwt}` } };
    const res = { locals: {} };
    const next = function (err) {
      expect(err).toBeFalsy();
    };

    authenticateJWT(req, res, next);

    expect(res.locals).toEqual({});
  });
});


describe("ensureLoggedIn", function () {
  test("works: user is logged in", function () {
    expect.assertions(1);

    const req = {};
    const res = { locals: { user: { username: "test", is_admin: false } } };
    const next = function (err) {
      expect(err).toBeFalsy();
    };

    ensureLoggedIn(req, res, next);
  });

  test("fails: user not logged in", function () {
    expect.assertions(1);

    const req = {};
    const res = { locals: {} };
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };

    ensureLoggedIn(req, res, next);
  });
});


describe("ensureAdmin", function () {
  test("works: user is an admin", function () {
    expect.assertions(1);

    const req = {};
    const res = { locals: { user: { username: "test", isAdmin: true } } };
    const next = function (err) {
      expect(err).toBeFalsy();
    };

    ensureAdmin(req, res, next);
  });

  test("fails: user is not an admin", function () {
    expect.assertions(1);

    const req = {};
    const res = { locals: { user: { username: "test", isAdmin: false } } };
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };

    ensureAdmin(req, res, next);
  });

  test("fails: no user (anonymous)", function () {
    expect.assertions(1);

    const req = {};
    const res = { locals: {} };
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };

    ensureAdmin(req, res, next);
  });
});


describe("ensureCorrectUserOrAdmin", function () {
  test("works: user is an admin", function () {
    expect.assertions(1);

    const req = { params: { username: "test" } };
    const res = { locals: { user: { username: "admin", isAdmin: true } } };
    const next = function (err) {
      expect(err).toBeFalsy();
    };

    ensureCorrectUserOrAdmin(req, res, next);
  });

  test("works: user is accessing own account", function () {
    expect.assertions(1);

    const req = { params: { username: "test" } };
    const res = { locals: { user: { username: "test", isAdmin: false } } };
    const next = function (err) {
      expect(err).toBeFalsy();
    };

    ensureCorrectUserOrAdmin(req, res, next);
  });

  test("fails: user does not match and is not admin", function () {
    expect.assertions(1);

    const req = { params: { username: "wrong" } };
    const res = { locals: { user: { username: "test", isAdmin: false } } };
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };

    ensureCorrectUserOrAdmin(req, res, next);
  });

  test("fails: no user (anonymous)", function () {
    expect.assertions(1);

    const req = { params: { username: "test" } };
    const res = { locals: {} };
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };

    ensureCorrectUserOrAdmin(req, res, next);
  });
});
