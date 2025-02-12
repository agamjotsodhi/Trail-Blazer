import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TrailBlazerApi from "../api";

const MyTrips = () => {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all trips and include country flag data
  const fetchTrips = async () => {
    setIsLoading(true);
    setError("");

    try {
      const tripsData = await TrailBlazerApi.getTrips();
      
      // Fetch additional details for each trip
      const tripsWithFlags = await Promise.all(
        tripsData.map(async (trip) => {
          try {
            const tripDetails = await TrailBlazerApi.getTripDetails(trip.trip_id);
            return { ...trip, flag: tripDetails.destination?.flag || "" };
          } catch {
            return { ...trip, flag: "" }; // Fallback if details fail to load
          }
        })
      );

      setTrips(tripsWithFlags);
    } catch {
      setError("Failed to load trips. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Run fetchTrips on component mount
  useEffect(() => {
    fetchTrips();
  }, []);

  // Handle trip deletion and update state
  const handleDelete = async (tripId) => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      try {
        await TrailBlazerApi.deleteTrip(tripId);
        setTrips((prevTrips) => prevTrips.filter((trip) => trip.trip_id !== tripId));
      } catch {
        setError("Failed to delete trip. Please try again.");
      }
    }
  };

  return (
    <div>
      <h1>My Trips</h1>

      {/* Display loading state */}
      {isLoading && <p>Loading trips...</p>}

      {/* Display error message if fetching trips fails */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Show message if no trips exist */}
      {!isLoading && trips.length === 0 ? (
        <p>
          Oops, you have not planned any trips yet.{" "}
          <Link to="/plan-trip" style={{ color: "#007bff", textDecoration: "underline" }}>
            Plan a trip here
          </Link>
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {trips.map((trip) => (
            <div
              key={trip.trip_id}
              style={{ display: "flex", flexDirection: "column", border: "1px solid black", padding: "10px" }}
            >
              <Link
                to={`/trips/${trip.trip_id}`}
                style={{ textDecoration: "none", color: "black", display: "flex", alignItems: "center", gap: "10px" }}
              >
                {/* Display country flag if available */}
                {trip.flag && <img src={trip.flag} alt={`${trip.location_country} Flag`} width="50" height="30" />}

                <div>
                  <strong>{trip.trip_name}</strong>
                  <p>📍 {trip.location_city}, {trip.location_country}</p>
                  <p>📅 {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}</p>
                  <p>🔎 Interests: {trip.interests}</p>
                </div>
              </Link>

              {/* Button to delete a trip */}
              <button onClick={() => handleDelete(trip.trip_id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTrips;
