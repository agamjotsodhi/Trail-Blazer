import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import TrailBlazerApi from "../api";
import EditTripForm from "../forms/EditTripForm";

const TripDetails = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("itinerary");
  const [isEditing, setIsEditing] = useState(false);

  // Fetch trip details when component mounts
  useEffect(() => {
    async function fetchTripDetails() {
      try {
        const tripData = await TrailBlazerApi.getTripDetails(tripId);
        setTrip(tripData);
      } catch (err) {
        console.error("Error fetching trip details:", err);
        setError("Failed to fetch trip details.");
      }
    }
    fetchTripDetails();
  }, [tripId]);

  // Update trip details after an edit
  const handleUpdateTrip = (updatedTrip) => {
    setTrip((prevTrip) => ({ ...prevTrip, trip: updatedTrip }));
  };

  // Delete trip and navigate back to My Trips
  const handleDeleteTrip = async () => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      try {
        await TrailBlazerApi.deleteTrip(tripId);
        navigate("/my-trips");
      } catch (err) {
        console.error("Error deleting trip:", err);
        alert("Failed to delete trip.");
      }
    }
  };

  if (error) return <p className="error-message">{error}</p>;
  if (!trip) return <p className="error-message">Trip not found.</p>;

  return (
    <div className="trip-details-container">
      <h1 className="trip-title">{trip.trip.trip_name}</h1>
      <p className="trip-info"><strong>Location:</strong> {trip.trip.location_city}, {trip.trip.location_country}</p>
      <p className="trip-info"><strong>Start Date:</strong> {new Date(trip.trip.start_date).toDateString()}</p>
      <p className="trip-info"><strong>End Date:</strong> {new Date(trip.trip.end_date).toDateString()}</p>
      <p className="trip-info"><strong>Interests:</strong> {trip.trip.interests}</p>

      {/* Edit and delete buttons */}
      <div className="trip-actions">
        <button className="btn-primary" onClick={() => setIsEditing(true)}>Edit Trip</button>
        <button className="btn-danger" onClick={handleDeleteTrip}>Delete Trip</button>
      </div>

      {/* Render edit form when editing is active */}
      {isEditing && (
        <EditTripForm 
          trip={trip.trip} 
          onClose={() => setIsEditing(false)} 
          onUpdate={handleUpdateTrip} 
        />
      )}

      {/* Tabs for different sections */}
      <div className="trip-tabs">
        <button 
          className={activeTab === "itinerary" ? "tab-active" : "tab"} 
          onClick={() => setActiveTab("itinerary")}
        >
          Itinerary
        </button>
        <button 
          className={activeTab === "destination" ? "tab-active" : "tab"} 
          onClick={() => setActiveTab("destination")}
        >
          Destination Details
        </button>
        <button 
          className={activeTab === "weather" ? "tab-active" : "tab"} 
          onClick={() => setActiveTab("weather")}
        >
          Weather
        </button>
      </div>

      {/* Content for the selected tab */}
      <div className="trip-content">
        {activeTab === "itinerary" && (
          <div className="trip-section">
            <h2>AI-Generated Itinerary</h2>
            <p>{trip.itinerary}</p>
          </div>
        )}

        {activeTab === "destination" && (
          <div className="trip-section">
            <h2>Destination Information</h2>
            <p><strong>Capital City:</strong> {trip.destination.capital_city}</p>
            <p><strong>Region:</strong> {trip.destination.region} - {trip.destination.subregion}</p>
            <p><strong>Languages:</strong> {trip.destination.languages.join(", ")}</p>
            <p><strong>Currency:</strong> {trip.destination.currencies}</p>
            <p><strong>Population:</strong> {trip.destination.population.toLocaleString()}</p>
            <img src={trip.destination.flag} alt="Country Flag" className="trip-flag" />
          </div>
        )}

        {activeTab === "weather" && (
          <div className="trip-section">
            <h2>Weather Forecast</h2>
            <ul className="weather-list">
              {trip.weather.map((day) => (
                <li key={day.weather_id} className="weather-item">
                  <strong>{new Date(day.datetime).toDateString()}</strong>: {day.description} (Max: {day.tempmax}°C, Min: {day.tempmin}°C)
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Back to My Trips button */}
      <Link to="/my-trips">
        <button className="btn-secondary">Back to My Trips</button>
      </Link>
    </div>
  );
};

export default TripDetails;
