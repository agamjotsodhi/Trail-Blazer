# Schema Design

## Main Tables

- **Users**: Stores user account data.
- **Trips**: Represents user-created trips.
- **Destinations**: Stores detailed information about trip destinations.
- **Activities**: Stores activity recommendations.
- **Weather**: Stores weather updates for destinations.

## Relationships

- A user can have many trips.
- A trip can have multiple destinations.
- A destination can have multiple activities.
- A destination can have multiple weather records (forecast data).

## Crow’s Foot Notation

The following is how the database will be organized using the Crow's foot notation:

### Users:
- **Primary Key**: `user_id`
- **Attributes**: `username`, `email`, `password`, `name`

### Trips:
- **Primary Key**: `trip_id`
- **Foreign Key**: `user_id` (relates to Users)
- **Attributes**: `trip_name`, `start_date`, `end_date`

### Destinations:
- **Primary Key**: `destination_id`
- **Foreign Key**: `trip_id` (relates to Trips)
- **Attributes**: `country`, `city`, `languages`, `currency`

### Activities:
- **Primary Key**: `activity_id`
- **Foreign Key**: `destination_id` (relates to Destinations)
- **Attributes**: `activity_name`, `description`, 

### Weather:
- **Primary Key**: `weather_id`
- **Foreign Key**: `destination_id` (relates to Destinations)
- **Attributes**: `temperature`, `condition`, `forecast_date`

