-- Users Table 
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL CHECK (position('@' IN email) > 0),
    password TEXT NOT NULL,
    first_name TEXT NOT NULL
);

-- Trips Table 
CREATE TABLE trips (
    trip_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    trip_name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    location_city VARCHAR(100) NOT NULL,
    location_country VARCHAR(100) NOT NULL,
    interests TEXT, -- User's interests
    UNIQUE (user_id, trip_name) -- Prevents duplicate trip names per user
);

-- Itineraries Table 
CREATE TABLE itineraries (
    itinerary_id SERIAL PRIMARY KEY,
    trip_id INT UNIQUE REFERENCES trips(trip_id) ON DELETE CASCADE,
    itinerary TEXT NOT NULL -- Stores the generated trip itinerary
);

-- Destinations Table 
CREATE TABLE destinations (
    destination_id SERIAL PRIMARY KEY,
    common_name VARCHAR(100) NOT NULL UNIQUE, -- Common name of the country (e.g., "Canada")
    official_name VARCHAR(100), -- Official name of the country
    capital_city VARCHAR(100), -- Capital city
    independent BOOLEAN, -- Is the country independent?
    un_member BOOLEAN, -- Is the country a UN member?
    currencies TEXT, -- List of currencies (e.g., "Canadian Dollar (CAD)")
    alt_spellings TEXT[], -- Alternate spellings of the country
    region VARCHAR(100), -- Geographical region
    subregion VARCHAR(100), -- Geographical subregion
    languages TEXT[], -- List of spoken languages
    borders TEXT[], -- Neighboring countries
    population INT, -- Population count
    car_signs TEXT[], -- Car signs (e.g., "CA")
    car_side VARCHAR(10), -- Driving side ("right" or "left")
    google_maps TEXT, -- Google Maps link
    flag TEXT -- Emoji or SVG of the country's flag
);

-- Weather Table (References Trips, must be created after it)
CREATE TABLE weather (
    weather_id SERIAL PRIMARY KEY,
    trip_id INT NOT NULL REFERENCES trips(trip_id) ON DELETE CASCADE, -- Links weather data to a trip
    datetime DATE NOT NULL, -- Date of the weather record
    tempmax NUMERIC(5, 2), -- Max temperature
    tempmin NUMERIC(5, 2), -- Min temperature
    temp NUMERIC(5, 2), -- Average temperature
    humidity NUMERIC(5, 2), -- Humidity percentage
    precip NUMERIC(5, 2), -- Precipitation amount
    precipprob NUMERIC(5, 2), -- Precipitation probability percentage
    snowdepth NUMERIC(5, 2), -- Snow depth
    windspeed NUMERIC(5, 2), -- Wind speed
    sunrise TIME, -- Sunrise time
    sunset TIME, -- Sunset time
    conditions TEXT, -- General weather conditions
    description TEXT, -- Detailed weather description
    icon VARCHAR(50), -- Weather icon identifier
    UNIQUE (trip_id, datetime) -- Prevents duplicate weather entries for the same trip and date
);
