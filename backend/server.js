"use strict";

// Load environment variables
require("dotenv").config();

const app = require("./app");
const PORT = process.env.PORT || 3000;

// Ensure the server listens on 0.0.0.0 for external access
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
