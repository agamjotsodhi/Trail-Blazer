import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/forms.css"; // Main form styling
import "../styles/PlanTrip.css"; // Additional styling for layout adjustments

/**
 * PlanTripForm
 * 
 * Allows users to create a new trip by entering trip details.
 * 
 * Props:
 * - createTrip: Function to handle trip creation.
 */
const PlanTripForm = ({ createTrip }) => {
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format.

  // Initial state for trip details
  const [tripData, setTripData] = useState({
    trip_name: "",
    start_date: today, // Default to today's date
    end_date: "",
    location_city: "",
    location_country: "",
    interests: "",
  });

  const [message, setMessage] = useState(""); // Stores success or error messages
  const [isSubmitting, setIsSubmitting] = useState(false); // Prevents multiple submissions
  const navigate = useNavigate();

  /**
   * Handles input field changes and updates state.
   * 
   * @param {Event} e - The input change event.
   */
  const handleChange = (e) => {
    setTripData({ ...tripData, [e.target.name]: e.target.value });
  };

  /**
   * Handles form submission to create a new trip.
   * 
   * @param {Event} e - Form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent multiple submissions

    setIsSubmitting(true);
    try {
      const newTrip = await createTrip(tripData);
      setMessage(`Trip "${newTrip.trip_name}" successfully created!`);
      navigate(`/trips/${newTrip.trip_id}`); // Redirect to trip details page
    } catch (err) {
      console.error("Error creating trip:", err);
      setMessage("Failed to create trip.");
      setIsSubmitting(false); // Re-enable button if submission fails
    }
  };

  return (
    <div className="plan-trip-form-container">
      <form className="form-container" onSubmit={handleSubmit}>
        
        {/* Trip Name */}
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

        {/* Start Date */}
        <div className="form-group">
          <label>Start Date</label>
          <input
            type="date"
            name="start_date"
            value={tripData.start_date}
            onChange={handleChange}
            required
            min={today} // Prevents past dates
          />
        </div>

        {/* End Date */}
        <div className="form-group">
          <label>End Date</label>
          <input
            type="date"
            name="end_date"
            value={tripData.end_date}
            onChange={handleChange}
            required
            min={tripData.start_date || today} // Ensures end date is after start date
          />
        </div>

        {/* Country */}
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

        {/* City */}
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

        {/* Interests */}
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

        {/* Submit button with loading state */}
        <button className="form-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Trip"}
        </button>

        {/* Display success/error message */}
        {message && <p className="form-message">{message}</p>}
      </form>
    </div>
  );
};

export default PlanTripForm;
