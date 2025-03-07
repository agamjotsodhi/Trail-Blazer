"use strict";

// Load environment variables
require("dotenv").config();

const app = require("./app");
const PORT = process.env.PORT || 4000;

// Ensure the server listens on 0.0.0.0 for external access
app.listen(PORT, "0.0.0.0", () => {
  console.log(` Server is running on port ${PORT} and accessible via 0.0.0.0`);;
});
