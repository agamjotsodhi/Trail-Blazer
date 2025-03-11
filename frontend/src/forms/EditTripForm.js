import React, { useState } from "react";
import TrailBlazerApi from "../api";
import "../styles/forms.css";

/**
 * EditTripForm
 * 
 * Allows users to update details of an existing trip.
 * 
 * Props:
 * - trip: Object containing the trip's current details.
 * - onClose: Function to close the form without saving changes.
 * - onUpdate: Function to handle updating the trip in the parent component.
 */
const EditTripForm = ({ trip, onClose, onUpdate }) => {
  // Initialize state with existing trip data.
  const [editData, setEditData] = useState({ ...trip });

  /**
   * Handles input field changes and updates state.
   * 
   * @param {Event} e - The input change event.
   */
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Submits the updated trip details.
   * 
   * @param {Event} e - Form submission event.
   */
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedTrip = await TrailBlazerApi.updateTrip(trip.trip_id, editData);
      onUpdate(updatedTrip); // Pass updated trip data to parent component.
      onClose(); // Close form after saving.
    } catch (err) {
      console.error("Error updating trip:", err);
    }
  };

  return (
    <div className="edit-trip-form-container"> 
      <form className="form-container" onSubmit={handleEditSubmit}> 
        <h1>Edit Trip</h1>

        {/* Trip Name */}
        <div className="form-group">
          <label>Trip Name</label>
          <input
            type="text"
            name="trip_name"
            value={editData.trip_name}
            onChange={handleEditChange}
            required
          />
        </div>

        {/* Start Date */}
        <div className="form-group">
          <label>Start Date</label>
          <input
            type="date"
            name="start_date"
            value={editData.start_date}
            onChange={handleEditChange}
            required
          />
        </div>

        {/* End Date */}
        <div className="form-group">
          <label>End Date</label>
          <input
            type="date"
            name="end_date"
            value={editData.end_date}
            onChange={handleEditChange}
            required
          />
        </div>

        {/* City */}
        <div className="form-group">
          <label>City</label>
          <input
            type="text"
            name="location_city"
            value={editData.location_city}
            onChange={handleEditChange}
            required
          />
        </div>

        {/* Country */}
        <div className="form-group">
          <label>Country</label>
          <input
            type="text"
            name="location_country"
            value={editData.location_country}
            onChange={handleEditChange}
            required
          />
        </div>

        {/* Interests */}
        <div className="form-group">
          <label>Interests</label>
          <input
            type="text"
            name="interests"
            value={editData.interests}
            onChange={handleEditChange}
            required
          />
        </div>

        {/* Save and Cancel Buttons */}
        <div className="form-button-group">
          <button className="form-button" type="submit">Save</button>
          <button className="form-button" type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditTripForm;
