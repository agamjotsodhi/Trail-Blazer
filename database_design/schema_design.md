# Schema Design

## Overview

Trailblazer's database is designed to store user information, trip details, destinations, AI-generated itineraries, and weather forecasts. 

## Main Tables

- **Users**: Stores user account information.
- **Trips**: Represents user-created trips.
- **Itineraries**: Stores AI-generated trip itineraries.
- **Destinations**: Stores detailed information about travel destinations.
- **Weather**: Stores weather data linked to trips.

## Relationships

- A **user** can have multiple **trips**.
- A **trip** has one **itinerary**.
- A **trip** has one or more associated **destinations**.
- A **trip** has multiple **weather records** for different dates.

## Schema Breakdown (Crow’s Foot Notation)

### **Users**
- **Primary Key**: `user_id`
- **Attributes**:
  - `username` (`VARCHAR(50)`) - Unique identifier for the user.
  - `email` (`VARCHAR(100)`) - Must contain `@`, unique.
  - `password` (`TEXT`) - Hashed password.
  - `first_name` (`TEXT`) - User’s first name.

### **Trips**
- **Primary Key**: `trip_id`
- **Foreign Key**: `user_id` → Users
- **Attributes**:
  - `trip_name` (`VARCHAR(100)`) - Name of the trip.
  - `start_date` (`DATE`) - Trip start date.
  - `end_date` (`DATE`) - Trip end date.
  - `location_city` (`VARCHAR(100)`) - City of the trip.
  - `location_country` (`VARCHAR(100)`) - Country of the trip.
  - `interests` (`TEXT`) - User's interests related to the trip.
- **Constraints**:
  - Each user can have multiple trips.
  - Each trip name must be unique per user.

### **Itineraries**
- **Primary Key**: `itinerary_id`
- **Foreign Key**: `trip_id` → Trips
- **Attributes**:
  - `itinerary` (`TEXT`) - AI-generated travel itinerary.
- **Constraints**:
  - Each trip has only one itinerary.

### **Destinations**
- **Primary Key**: `destination_id`
- **Attributes**:
  - `common_name` (`VARCHAR(100)`) - Common name of the country.
  - `official_name` (`VARCHAR(100)`) - Official country name.
  - `capital_city` (`VARCHAR(100)`) - Capital city.
  - `independent` (`BOOLEAN`) - Whether the country is independent.
  - `un_member` (`BOOLEAN`) - Whether the country is a UN member.
  - `currencies` (`TEXT`) - List of currencies.
  - `alt_spellings` (`TEXT[]`) - Alternate country names.
  - `region` (`VARCHAR(100)`) - Geographic region.
  - `subregion` (`VARCHAR(100)`) - Geographic subregion.
  - `languages` (`TEXT[]`) - Spoken languages.
  - `borders` (`TEXT[]`) - Neighboring countries.
  - `population` (`INT`) - Population count.
  - `car_signs` (`TEXT[]`) - Car signs (e.g., "CA").
  - `car_side` (`VARCHAR(10)`) - Driving side (`right` or `left`).
  - `google_maps` (`TEXT`) - Google Maps link.
  - `flag` (`TEXT`) - Country flag (emoji or URL).
- **Constraints**:
  - Each country is unique and only appears once in the table.

### **Weather**
- **Primary Key**: `weather_id`
- **Foreign Key**: `trip_id` → Trips
- **Attributes**:
  - `datetime` (`DATE`) - Date of weather record.
  - `tempmax` (`NUMERIC(5,2)`) - Max temperature.
  - `tempmin` (`NUMERIC(5,2)`) - Min temperature.
  - `temp` (`NUMERIC(5,2)`) - Average temperature.
  - `humidity` (`NUMERIC(5,2)`) - Humidity percentage.
  - `precip` (`NUMERIC(5,2)`) - Precipitation amount.
  - `precipprob` (`NUMERIC(5,2)`) - Precipitation probability.
  - `snowdepth` (`NUMERIC(5,2)`) - Snow depth.
  - `windspeed` (`NUMERIC(5,2)`) - Wind speed.
  - `sunrise` (`TIME`) - Sunrise time.
  - `sunset` (`TIME`) - Sunset time.
  - `conditions` (`TEXT`) - General weather conditions (e.g., "Sunny", "Cloudy").
  - `description` (`TEXT`) - Detailed weather description.
  - `icon` (`VARCHAR(50)`) - Weather icon identifier.
- **Constraints**:
  - A trip can have multiple weather records, but only one per date.

## Updates & Improvements
1. **Refined relationships**:
   - Weather is now correctly linked to `trip_id`, rather than a separate location type.
   - Itineraries are linked as a one-to-one relationship with trips.
2. **Clarified column attributes**:
   - Expanded `destinations` to include detailed country metadata.
   - Defined `weather` attributes clearly.
3. **Removed unnecessary tables**:
   - **Activities** table was removed since it was not referenced in the current schema.
4. **Enforced uniqueness where needed**:
   - Unique constraint on country names in `destinations` ensures no duplicates.

## Future Considerations
- If users want **custom activities**, an **Activities** table can be added later, linked to trips or destinations.
- A **Reviews** table could be introduced if users can rate trips or destinations.

---