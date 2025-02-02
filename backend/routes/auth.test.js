"use strict";

const request = require("supertest");
const app = require("../app");
const db = require("../db");
const bcrypt = require("bcrypt");

const { createToken } = require("../helpers/tokens");

// Mock users for tests
const TEST_USER = {
  username: "testuser",
  password: "password123",
  email: "testuser@example.com",
  first_name: "Test",
};

// Generate tokens for testing
let testToken;

beforeAll(async () => {
  // Clear and reset the database before all tests
  await db.query("DELETE FROM users");
  const hashedPassword = await bcrypt.hash(TEST_USER.password, 1);
  await db.query(
    `INSERT INTO users (username, password, email, first_name)
     VALUES ($1, $2, $3, $4)`,
    [TEST_USER.username, hashedPassword, TEST_USER.email, TEST_USER.first_name]
  );

  // Create token for testing
  testToken = createToken({ username: TEST_USER.username });
});

beforeEach(async () => {
  // Reset any additional test-related data if needed (like resetting mock states)
  await db.query("DELETE FROM users WHERE username != $1", [TEST_USER.username]);
});

afterAll(async () => {
  // Clean up database and close connection after all tests
  await db.query("DELETE FROM users");
  await db.end();
});

/************************************** POST /auth/token */

describe("POST /auth/token", function () {
  test("works with valid credentials", async function () {
    const resp = await request(app).post("/auth/token").send({
      username: TEST_USER.username,
      password: TEST_USER.password,
    });
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toHaveProperty("token");
  });

  test("unauthorized with invalid credentials", async function () {
    const resp = await request(app).post("/auth/token").send({
      username: "wronguser",
      password: "wrongpassword",
    });
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing data", async function () {
    const resp = await request(app).post("/auth/token").send({
      username: TEST_USER.username,
    });
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** POST /auth/register */

describe("POST /auth/register", function () {
  test("works for new user", async function () {
    const newUser = {
      username: "newuser",
      password: "newpassword123",
      email: "newuser@example.com",
      first_name: "New",
    };
    const resp = await request(app).post("/auth/register").send(newUser);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body.user).toHaveProperty("username", "newuser");
    expect(resp.body).toHaveProperty("token");
  });

  test("bad request with missing fields", async function () {
    const resp = await request(app).post("/auth/register").send({
      username: "newuser",
    });
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid email", async function () {
    const resp = await request(app).post("/auth/register").send({
      username: "newuser",
      password: "newpassword123",
      email: "notAnEmail",
      first_name: "New",
    });
    expect(resp.statusCode).toEqual(400);
  });
});