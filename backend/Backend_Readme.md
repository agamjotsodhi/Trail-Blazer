TrailBlazer Backend Readme file


The structure of the backend code is as follows 

backend/

├── helpers/
│   ├── restCountriesAPI.js   # API functions for RestCountries
│   ├── weatherAPI.js         # API functions for Weather API

├── middleware/         # Authentication middleware
├── models/             # Sequelize models for the database tables
├── routes/             # API routes for users, trips, etc.
├── controllers/        # Controllers for handling route logic
├── config/             # DB configuration
├── app.js              # Main entry point for the app
├── .env                # Environment variables
├── package.json        # Dependencies
└── README.md           # Documentation



Final Backend Workflow After These Steps
1️⃣ User Creates a Trip (POST /trips)

Retrieves destination details from the database.
Fetches weather data from API and stores it.
Generates AI itinerary based on user’s interests.
Stores trip, weather, and itinerary in the database.
Returns complete trip details with weather, destination, and AI itinerary.
2️⃣ User Views a Trip (GET /trips/:trip_id)

Fetches trip details from the database.
Fetches weather data from the database.
Fetches destination details from the database.
Fetches AI-generated itinerary from the database.
