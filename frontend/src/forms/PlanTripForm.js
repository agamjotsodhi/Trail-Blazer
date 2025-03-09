import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/forms.css"; // main form styling from forms.css for styling
import "../styles/PlanTrip.css"; // for Minor adjustments

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

  const handleChange = (e) => {
    setTripData({ ...tripData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newTrip = await createTrip(tripData);
      setMessage(`Trip "${newTrip.trip_name}" successfully created!`);
      navigate(`/trips/${newTrip.trip_id}`);
    } catch (err) {
      console.error("Error creating trip:", err);
      setMessage("Failed to create trip.");
    }
  };

  return (
    <div className="plan-trip-form-container">
      <form className="form-container" onSubmit={handleSubmit}>
        <div className="form-group">
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

        <div className="form-group">
          <label>Start Date</label>
          <input
            type="date"
            name="start_date"
            value={tripData.start_date}
            onChange={handleChange}
            required
            min="2025-02-26" //use npm date time library
            // add blocked dates
          />
        </div>

        <div className="form-group">
          <label>End Date</label>
          <input
            type="date"
            name="end_date"
            value={tripData.end_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
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

        <div className="form-group">
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

      
        <div className="form-group">
          <label>Interests</label>
          <input
            type="text"
            name="interests"
            placeholder="e.g. Museums, Hiking, Beaches"
            value={tripData.interests}
            onChange={handleChange}
          />
        </div>

        <button className="form-button" type="submit">
          Create Trip
        </button>

        {message && <p className="form-message">{message}</p>}
      </form>
    </div>
  );
};

export default PlanTripForm;
