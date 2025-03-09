import React, { useState } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import countries from "countries-list"; // Importing country list
import "../styles/forms.css"; // Main form styling
import "../styles/PlanTrip.css"; // Minor adjustments

const PlanTripForm = ({ createTrip }) => {
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  // Convert countries-list to an array for react-select
  const countryOptions = Object.values(countries.countries).map((country) => ({
    label: country.name,
    value: country.name,
  }));

  const [tripData, setTripData] = useState({
    trip_name: "",
    start_date: today, // Default to today
    end_date: "",
    location_city: "",
    location_country: null, // React-Select needs null for initial state
    interests: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setTripData({ ...tripData, [e.target.name]: e.target.value });
  };

  // Handle country selection
  const handleCountryChange = (selectedOption) => {
    setTripData({ ...tripData, location_country: selectedOption ? selectedOption.value : "" });
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
            min={today} // Minimum date is today
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
            min={tripData.start_date || today} // End date must be after or equal to start date
          />
        </div>

        <div className="form-group">
          <label>Country</label>
          <Select
            name="location_country"
            options={countryOptions}
            value={countryOptions.find((option) => option.value === tripData.location_country)}
            onChange={handleCountryChange}
            placeholder="Select a country"
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
