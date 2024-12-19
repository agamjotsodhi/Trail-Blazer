-- TrailBlazer (TB) Database Schema
-- Structure design for the Postgres sql database TB will use

-- Users Table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL CHECK (position('@' IN email) > 0),
    password TEXT NOT NULL,
    first_name TEXT NOT NULL
);

-- Trips Table
-- will record user's desired trip details
-- data from start_country and end_country will be used as a param to the restcountry API request
-- data from start/end_city and start/end_date will be sent as a param to the weather API request

CREATE TABLE trips (
    trip_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    trip_name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_city VARCHAR(100) NOT NULL, -- City user would like to start trip in
    end_city VARCHAR(100) NOT NULL, -- City user would like to end trip in
    start_country VARCHAR(100) NOT NULL, -- Start country 
    end_country VARCHAR(100) NOT NULL, -- End country 
    UNIQUE (user_id, trip_name) -- Prevents duplicate trip names for the same user
);


-- Destinations Table
-- will be populated by restcountries - api

CREATE TABLE destinations (
    destination_id SERIAL PRIMARY KEY,
    trip_id INT REFERENCES trips(trip_id) ON DELETE CASCADE, -- Linked to a trip_id - user requested location
    country VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    capital_city VARCHAR(100),
    currency VARCHAR(50),
    language VARCHAR(100),
    timezones VARCHAR(100),
    flag TEXT, -- Will store the flag as an emoji, ex. "🇨🇦"
    start_of_week VARCHAR(10), -- ex. 'Monday', 'Sunday'
    UNIQUE (trip_id, country, city) -- Prevents duplicate entries for the same trip
);

-- Weather Table
-- looks at Trips table, to get user trip info for the Weather api call
-- Keeps the "icon" key from api call, as it will be used 
CREATE TABLE weather (
    weather_id SERIAL PRIMARY KEY,
    trip_id INT NOT NULL REFERENCES trips(trip_id) ON DELETE CASCADE, -- Links weather to a trip
    location_type VARCHAR(10) NOT NULL CHECK (location_type IN ('start', 'end')), -- Specifies whether it's for start or end location
    start_date DATE NOT NULL, -- Start date of the weather range
    end_date DATE NOT NULL, -- End date of the weather range
    icon VARCHAR(50) -- Weather icon identifier from API call (e.g., "rain")
);

-- Activities Table
CREATE TABLE activities (
    activity_id SERIAL PRIMARY KEY,
    destination_id INT NOT NULL REFERENCES destinations(destination_id) ON DELETE CASCADE,
    activity_name VARCHAR(100) NOT NULL,
    description TEXT,
    rating NUMERIC(2, 1) CHECK (rating >= 0 AND rating <= 5)
);

    
