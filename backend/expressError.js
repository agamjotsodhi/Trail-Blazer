// Error module for handling different errors in Trailblazer.js

// Base error class for custom errors
class ExpressError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

// 400 Bad Request error
class BadRequestError extends ExpressError {
  constructor(message = "Bad Request") {
    super(message, 400);
  }
}

// 401 Unauthorized error
class UnauthorizedError extends ExpressError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

// 404 Not Found error
class NotFoundError extends ExpressError {
  constructor(message = "Not Found") {
    super(message, 404);
  }
}

// Export all error classes
module.exports = { ExpressError, BadRequestError, UnauthorizedError, NotFoundError };
