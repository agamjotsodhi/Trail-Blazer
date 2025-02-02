-- Trailblazer Seed File
-- Populates the database with sample users, trips, destinations, and weather data for development and testing purposes

-- Insert sample data into the users table
INSERT INTO users (username, email, password, first_name)
VALUES
    ('johndoe', 'johndoe@example.com', 'hashedpassword1', 'John'),
    ('janedoe', 'janedoe@example.com', 'hashedpassword2', 'Jane');

-- Insert sample data into the trips table
INSERT INTO trips (user_id, trip_name, start_date, end_date, location_city, location_country, interests, itinerary)
VALUES
    (1, 'Summer Vacation', '2025-06-01', '2025-06-15', 'Paris', 'France', 'history, art, food', 'Sample AI-generated itinerary for Paris.'),
    (2, 'Winter Getaway', '2025-12-20', '2026-01-05', 'Tokyo', 'Japan', 'technology, culture, sushi', 'Sample AI-generated itinerary for Tokyo.');

-- Insert sample data into the destinations table
INSERT INTO destinations (common_name, official_name, capital_city, independent, un_member, currencies, alt_spellings, region, subregion, languages, borders, population, car_signs, car_side, google_maps, flag)
VALUES
    ('France', 'French Republic', 'Paris', true, true, 'Euro (EUR)', ARRAY['République française'], 'Europe', 'Western Europe', ARRAY['French'], ARRAY['BEL', 'DEU', 'ITA', 'ESP'], 67391582, ARRAY['F'], 'right', 'https://goo.gl/maps/4F4F4F4', '🇫🇷'),
    ('Japan', 'Japan', 'Tokyo', true, true, 'Japanese Yen (JPY)', ARRAY['Nippon'], 'Asia', 'Eastern Asia', ARRAY['Japanese'], ARRAY[], 125960000, ARRAY['J'], 'left', 'https://goo.gl/maps/3E3E3E3', '🇯🇵');

-- Insert sample data into the weather table
INSERT INTO weather (trip_id, datetime, tempmax, tempmin, temp, humidity, precip, precipprob, snowdepth, windspeed, sunrise, sunset, conditions, description, icon)
VALUES
    (1, '2025-06-01', 25.5, 15.0, 20.2, 65.0, 0.0, 10.0, 0.0, 5.0, '05:45:00', '21:30:00', 'Clear', 'Sunny day in Paris.', 'clear-day'),
    (2, '2025-12-21', 10.0, 2.0, 6.0, 70.0, 1.5, 50.0, 0.0, 12.0, '06:45:00', '16:45:00', 'Snow', 'Light snowfall in Tokyo.', 'snow');
