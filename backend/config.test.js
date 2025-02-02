"use strict";

let originalEnv;

beforeAll(() => {
  // Store the original process.env to restore it later
  originalEnv = { ...process.env };
});

afterAll(() => {
  // Restore the original process.env
  process.env = originalEnv;
});

describe("config can come from env", function () {
  test("works with custom environment variables", function () {
    // Set environment variables
    process.env.SECRET_KEY = "abc";
    process.env.PORT = "5000";
    process.env.DATABASE_URL = "custom_database";
    process.env.NODE_ENV = "other";

    // Re-import config after setting env vars
    jest.resetModules(); // Clear require cache
    const config = require("./config");

    // Test config values
    expect(config.SECRET_KEY).toEqual("abc");
    expect(config.PORT).toEqual(5000);
    expect(config.getDatabaseUri()).toEqual("custom_database");
    expect(config.BCRYPT_WORK_FACTOR).toEqual(12);
  });

  test("uses defaults when no env vars set", function () {
    // Ensure no env vars are set
    delete process.env.SECRET_KEY;
    delete process.env.PORT;
    delete process.env.DATABASE_URL;

    // Re-import config
    jest.resetModules(); // Clear require cache
    const config = require("./config");

    // Test default values
    expect(config.SECRET_KEY).toEqual("secret-dev");
    expect(config.PORT).toEqual(3000);
    expect(config.getDatabaseUri()).toEqual(
      "postgresql://postgres:password@localhost:5432/trailblazer"
    );
    expect(config.BCRYPT_WORK_FACTOR).toEqual(12);
  });

  test("uses test-specific values in test environment", function () {
    // Set NODE_ENV to "test"
    process.env.NODE_ENV = "test";

    // Re-import config
    jest.resetModules(); // Clear require cache
    const config = require("./config");

    // Test test-specific values
    expect(config.getDatabaseUri()).toEqual(
      "postgresql://postgres:password@localhost:5432/trailblazer_test"
    );
    expect(config.BCRYPT_WORK_FACTOR).toEqual(1);
  });
});
