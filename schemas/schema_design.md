# Schema Design

## Main Tables

- **Users**: Stores user account data.
- **Trips**: Represents user-created trips.
- **Destinations**: Stores detailed information about trip destinations.
- **Activities**: Stores activity recommendations.
- **Weather**: Stores weather updates for trips.

## Relationships

- A user can have many trips.
- A trip can have multiple destinations.
- A destination can have multiple activities.
- A trip can have weather records for start and end locations.

## Crow’s Foot Notation

### Users:
- **Primary Key**: `user_id`
- **Attributes**: `username`, `email`, `password`, `first_name`

### Trips:
- **Primary Key**: `trip_id`
- **Foreign Key**: `user_id` (relates to Users)
- **Attributes**: `trip_name`, `start_date`, `end_date`, `start_city`, `end_city`, `start_country`, `end_country`

### Destinations:
- **Primary Key**: `destination_id`
- **Foreign Key**: `trip_id` (relates to Trips)
- **Attributes**: `country`, `city`, `capital_city`, `currency`, `language`, `timezones`, `flag`, `start_of_week`

### Activities:
- **Primary Key**: `activity_id`
- **Foreign Key**: `destination_id` (relates to Destinations)
- **Attributes**: `activity_name`, `description`, `rating`

### Weather:
- **Primary Key**: `weather_id`
- **Foreign Key**: `trip_id` (relates to Trips)
- **Attributes**: `location_type`, `start_date`, `end_date`, `icon`

## Updates

1. Added `first_name` to **Users** schema to ensure complete user profiles.
2. Corrected the relationship for the **Weather** table to reference `trip_id` instead of `destination_id`, as weather is associated with the trip's start and end locations.
3. Clarified attributes in **Trips** and **Weather** for better alignment with their purpose (e.g., `location_type` specifies start or end location).
