# Trail Blazer - AI-Powered Travel Itinerary Planner

Trail Blazer is a full-stack web application designed to help users create personalized travel itineraries based on their interests and hobbies. By integrating AI-driven recommendations, weather insights, and real-time country data, this application simplifies trip planning, making it an intuitive and interactive experience.

## Visit the Site
Check out the [website here!](https://trailblazer-trip-planning.onrender.com/)

[<img width="1000" alt="project picture" src="https://github.com/agamjotsodhi/TrailBlazer/blob/main/frontend/src/assets/preview.png?raw=true">](https://curated-render.onrender.com)


## Features

- **AI-Powered Itinerary Generation**: Get personalized travel plans based on your interests.
- **Interactive Map Integration**: Visualize travel routes and points of interest.
- **Weather Forecasting**: Provides real-time weather updates for planned destinations.
- **Country Insights**: Fetch relevant travel information using Rest Countries API.
- **User Authentication**: Secure sign-up and login functionality.
- **Save & Edit Itineraries**: Users can create, modify, and save travel plans.

## Tech Stack

### Frontend

- React.js (with Hooks and State Management)
- CSS
- React Router

### Backend

- Node.js with Express.js
- PostgreSQL for database management
- Gemini API for AI-generated recommendations
- Rest Countries API for country insights
- OpenWeatherMap API for weather updates

## Installation & Setup

### Prerequisites

Ensure you have the following installed:

- Node.js & npm
- PostgreSQL

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the PostgreSQL database and update the `.env` file.
4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm start
   ```

## API Endpoints

### Base API URL:

```
http://localhost:5000/api
```

| Endpoint           | Method | Description                 |
| ------------------ | ------ | --------------------------- |
| `/register`        | POST   | Register a new user         |
| `/login`           | POST   | User login                  |
| `/itineraries`     | GET    | Fetch all saved itineraries |
| `/itineraries`     | POST   | Create a new itinerary      |
| `/itineraries/:id` | DELETE | Delete an itinerary         |

## Project Structure

```
Trail Blazer/
├── backend/               # Node.js/Express.js Backend
│   ├── routes/            # API Routes
│   ├── models/            # Database Models
│   ├── controllers/       # Business Logic
│   ├── config/            # Database Configuration
│   └── server.js          # Main Entry Point
│
├── frontend/              # React.js Frontend
│   ├── src/components/    # UI Components
│   ├── src/pages/         # Page Layouts
│   ├── src/context/       # State Management
│   └── src/App.js         # Main App Component
│
└── database_design/       # Database Schema and Migrations
```

## Future Enhancements

- **Multi-Language Support**
- **Integration with Flight & Hotel Booking APIs**
- **Social Sharing of Itineraries**

## Contributing

Contributions are welcome! Fork the repository, make your changes, and submit a pull request.


