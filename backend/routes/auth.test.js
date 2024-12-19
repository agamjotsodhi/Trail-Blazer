"use strict";

const request = require("supertest");
const app = require("../app");

beforeAll(() => {
  // Add any setup needed before all tests
});

afterAll(() => {
  // Add any cleanup after all tests
});

/************************************** POST /auth/token */

describe("POST /auth/token", function () {
  test("works with valid credentials", async function () {
    const resp = await request(app).post("/auth/token").send({
      username: "validUser",
      password: "validPassword",
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
  });

  test("bad request with missing data", async function () {
    const resp = await request(app).post("/auth/token").send({
      username: "validUser",
    });
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** POST /auth/register */

describe("POST /auth/register", function () {
  test("works for new user", async function () {
    const resp = await request(app).post("/auth/register").send({
      username: "newUser",
      first_name: "John",
      email: "john@example.com",
      password: "newPassword123",
    });
    expect(resp.statusCode).toEqual(201);
    expect(resp.body.user).toHaveProperty("username", "newUser");
  });

  test("bad request with missing fields", async function () {
    const resp = await request(app).post("/auth/register").send({
      username: "newUser",
    });
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid email", async function () {
    const resp = await request(app).post("/auth/register").send({
      username: "newUser",
      first_name: "John",
      email: "notAnEmail",
      password: "newPassword123",
    });
    expect(resp.statusCode).toEqual(400);
  });
});
