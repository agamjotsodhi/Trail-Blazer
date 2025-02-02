"use strict";

const request = require("supertest");
const app = require("../app");
const db = require("../db"); // Import the database connection

const { createToken } = require("../helpers/tokens");

// Mock data
const VALID_USER = {
  username: "validUser",
  password: "validPassword",
};

const NEW_USER = {
  username: "newUser",
  first_name: "John",
  email: "john@example.com",
  password: "newPassword123",
};

beforeAll(async () => {
  // Add a valid user to the database for token tests
  await db.query(`
    INSERT INTO users (username, password, email, first_name)
    VALUES ($1, $2, $3, $4)
  `, [VALID_USER.username, "validPasswordHash", "valid@example.com", "Valid"]);
});

afterAll(async () => {
  // Clean up test data
  await db.query(`DELETE FROM users WHERE username IN ($1, $2)`, [VALID_USER.username, NEW_USER.username]);
  await db.end();
});

/************************************** POST /auth/token */

describe("POST /auth/token", function () {
  test("works with valid credentials", async function () {
    const resp = await request(app).post("/auth/token").send({
      username: VALID_USER.username,
      password: VALID_USER.password,
    });
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toHaveProperty("token");
  });

  test("unauthorized with invalid credentials", async function () {
    const resp = await request(app).post("/auth/token").send({
      username: "invalidUser",
      password: "wrongPassword",
    });
    expect(resp.statusCode).toEqual(401);
    expect(resp.body).toHaveProperty("error");
  });

  test("bad request with missing data", async function () {
    const resp = await request(app).post("/auth/token").send({
      username: VALID_USER.username,
    });
    expect(resp.statusCode).toEqual(400);
    expect(resp.body).toHaveProperty("error");
  });
});

/************************************** POST /auth/register */

describe("POST /auth/register", function () {
  test("works for new user", async function () {
    const resp = await request(app).post("/auth/register").send(NEW_USER);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body.user).toHaveProperty("username", NEW_USER.username);
    expect(resp.body).toHaveProperty("token");
  });

  test("bad request with missing fields", async function () {
    const resp = await request(app).post("/auth/register").send({
      username: NEW_USER.username,
    });
    expect(resp.statusCode).toEqual(400);
    expect(resp.body).toHaveProperty("error");
  });

  test("bad request with invalid email", async function () {
    const resp = await request(app).post("/auth/register").send({
      ...NEW_USER,
      email: "notAnEmail",
    });
    expect(resp.statusCode).toEqual(400);
    expect(resp.body).toHaveProperty("error");
  });
});
