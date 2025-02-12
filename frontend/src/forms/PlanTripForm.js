import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/forms.css";

const PlanTripForm = ({ createTrip }) => {
  const [tripData, setTripData] = useState({
    trip_name: "",
    start_date: "",
    end_date: "",
    location_city: "",
    location_country: "",
    interests: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Handles input changes for all fields
  const handleChange = (e) => {
    setTripData({ ...tripData, [e.target.name]: e.target.value });
  };

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newTrip = await createTrip(tripData);
      setMessage(`Trip "${newTrip.trip_name}" successfully created!`);

      // Redirect to the trip details page
      navigate(`/trips/${newTrip.trip_id}`);
    } catch (err) {
      console.error("Error creating trip:", err);
      setMessage("Failed to create trip.");
    }
  };

  return (
    <div className="plan-trip-form-container"> 
      <form className="FormContainer" onSubmit={handleSubmit}> {/* Shared form styling with forms */}
      <h1>Plan Trip</h1>
        <div className="FormInput">
          <label>Trip Name</label>
          <input 
            type="text" 
            name="trip_name" 
            placeholder="e.g. Disney World 2025" 
            value={tripData.trip_name} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="FormInput">
          <label>Start Date</label>
          <input 
            type="date" 
            name="start_date" 
            value={tripData.start_date} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="FormInput">
          <label>End Date</label>
          <input 
            type="date" 
            name="end_date" 
            value={tripData.end_date} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="FormInput">
          <label>City</label>
          <input 
            type="text" 
            name="location_city" 
            placeholder="e.g. Paris" 
            value={tripData.location_city} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="FormInput">
          <label>Country</label>
          <input 
            type="text" 
            name="location_country" 
            placeholder="e.g. France" 
            value={tripData.location_country} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="FormInput">
          <label>Interests</label>
          <input 
            type="text" 
            name="interests" 
            placeholder="e.g. Museums, Hiking, Beaches" 
            value={tripData.interests} 
            onChange={handleChange} 
          />
        </div>

        {/* Submit button (shared styling with login and signup forms) */}
        <button className="FormButton" type="submit">
          Create Trip
        </button>

        {/* Display message after form submission */}
        {message && <p className="FormMessage">{message}</p>}
      </form>
    </div>
  );
};

export default PlanTripForm;
