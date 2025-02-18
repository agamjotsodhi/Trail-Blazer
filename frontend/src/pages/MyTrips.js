import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TrailBlazerApi from "../api";
import "../styles/MyTrips.css"; // Ensure you have a dedicated CSS file

const MyTrips = () => {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrips = async () => {
      setIsLoading(true);
      setError("");

      try {
        const tripsData = await TrailBlazerApi.getTrips();

        // Check if the API response is valid
        if (!tripsData || !Array.isArray(tripsData)) {
          throw new Error("Invalid response format from API.");
        }

        // Fetch additional details for each trip
        const tripsWithFlags = await Promise.all(
          tripsData.map(async (trip) => {
            try {
              const tripDetails = await TrailBlazerApi.getTripDetails(trip.trip_id);
              return { ...trip, flag: tripDetails?.destination?.flag || "" };
            } catch {
              return { ...trip, flag: "" }; // Ensure app doesn't crash
            }
          })
        );

        setTrips(tripsWithFlags);
      } catch (error) {
        console.error("Error fetching trips:", error);
        setError("Failed to load trips. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrips();
  }, []);

  // Handle trip deletion safely
  const handleDelete = async (tripId) => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      try {
        await TrailBlazerApi.deleteTrip(tripId);
        setTrips((prevTrips) => prevTrips.filter((trip) => trip.trip_id !== tripId));
      } catch (error) {
        console.error("Error deleting trip:", error);
        setError("Failed to delete trip. Please try again.");
      }
    }
  };

  return (
    <div className="my-trips-container">
      <h1 className="my-trips-title">My Trips</h1>

      {/* Display loading state */}
      {isLoading && <p className="loading-message">Loading trips...</p>}

      {/* Display error message if fetching trips fails */}
      {error && <p className="error-message">{error}</p>}

      {/* Show message if no trips exist */}
      {!isLoading && trips.length === 0 ? (
        <p className="no-trips-message">
          Oops, you have not planned any trips yet.{" "}
          <Link to="/plan-trip" className="plan-trip-link">Plan a trip here</Link>
        </p>
      ) : (
        <div className="trips-list">
          {trips.map((trip) => (
            <div key={trip.trip_id} className="trip-card">
            
              <Link to={`/trips/${trip.trip_id}`} className="trip-link">
                {/* Display country flag if available */}
                {trip.flag && (
                  <img
                    src={trip.flag}
                    alt={`${trip.location_country} Flag`}
                    className="trip-flag"
                  />
                )}

                <div className="trip-details">
                  <strong className="trip-name">{trip.trip_name}</strong>
                  <p className="trip-location"> {trip.location_city}, {trip.location_country}</p>
                  <p className="trip-dates"> {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}</p>
                  <p className="trip-interests"> Interests: {trip.interests}</p>
                </div>
              </Link>
            
              {/* Right-aligned delete button */}
              <button className="btn-two" onClick={() => handleDelete(trip.trip_id)}>X</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTrips;