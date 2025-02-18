-- Users Table: Stores user information
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY, -- Unique ID for each user
    username VARCHAR(50) UNIQUE NOT NULL, -- Unique username
    email VARCHAR(100) UNIQUE NOT NULL CHECK (position('@' IN email) > 0), -- Must contain "@"
    password TEXT NOT NULL, -- Hashed password
    first_name TEXT NOT NULL -- User's first name
);

-- Trips Table: Stores user-created trips
CREATE TABLE trips (
    trip_id SERIAL PRIMARY KEY, -- Unique ID for each trip
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE, -- Links trip to a user
    trip_name VARCHAR(100) NOT NULL, -- Name of the trip
    start_date DATE NOT NULL, -- Start date of the trip
    end_date DATE NOT NULL, -- End date of the trip
    location_city VARCHAR(100) NOT NULL, -- City of the trip
    location_country VARCHAR(100) NOT NULL, -- Country of the trip
    interests TEXT, -- User's interests related to the trip
    UNIQUE (user_id, trip_name) -- Prevents duplicate trip names per user
);

-- Itineraries Table: Stores AI-generated trip itineraries
CREATE TABLE itineraries (
    itinerary_id SERIAL PRIMARY KEY, -- Unique ID for each itinerary
    trip_id INT UNIQUE REFERENCES trips(trip_id) ON DELETE CASCADE, -- Links itinerary to a trip
    itinerary TEXT NOT NULL -- Full trip itinerary details
);

-- Destinations Table: Stores information about countries
CREATE TABLE destinations (
    destination_id SERIAL PRIMARY KEY, -- Unique ID for each destination
    common_name VARCHAR(100) NOT NULL UNIQUE, -- Common name (e.g., "Canada")
    official_name VARCHAR(100), -- Official name of the country
    capital_city VARCHAR(100), -- Capital city
    independent BOOLEAN, -- Whether the country is independent
    un_member BOOLEAN, -- Whether the country is a UN member
    currencies TEXT, -- List of currencies (e.g., "Canadian Dollar (CAD)")
    alt_spellings TEXT[], -- Alternate spellings of the country's name
    region VARCHAR(100), -- Geographic region
    subregion VARCHAR(100), -- Geographic subregion
    languages TEXT[], -- List of spoken languages
    borders TEXT[], -- List of neighboring countries
    population INT, -- Population count
    car_signs TEXT[], -- Country car signs (e.g., "CA")
    car_side VARCHAR(10), -- Driving side ("right" or "left")
    google_maps TEXT, -- Google Maps link for the country
    flag TEXT -- Flag (emoji or SVG URL)
);

-- Weather Table: Stores weather forecast data for trips
CREATE TABLE weather (
    weather_id SERIAL PRIMARY KEY, -- Unique ID for each weather record
    trip_id INT NOT NULL REFERENCES trips(trip_id) ON DELETE CASCADE, -- Links weather data to a trip
    datetime DATE NOT NULL, -- Date of the weather record
    tempmax NUMERIC(5, 2), -- Maximum temperature
    tempmin NUMERIC(5, 2), -- Minimum temperature
    temp NUMERIC(5, 2), -- Average temperature
    humidity NUMERIC(5, 2), -- Humidity percentage
    precip NUMERIC(5, 2), -- Precipitation amount
    precipprob NUMERIC(5, 2), -- Probability of precipitation
    snowdepth NUMERIC(5, 2), -- Snow depth
    windspeed NUMERIC(5, 2), -- Wind speed
    sunrise TIME, -- Sunrise time
    sunset TIME, -- Sunset time
    conditions TEXT, -- General weather conditions (e.g., "Sunny", "Cloudy")
    description TEXT, -- Detailed weather description
    icon VARCHAR(50), -- Weather icon identifier
    UNIQUE (trip_id, datetime) -- Ensures no duplicate weather records for the same trip and date
);
