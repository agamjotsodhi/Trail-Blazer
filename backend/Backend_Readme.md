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