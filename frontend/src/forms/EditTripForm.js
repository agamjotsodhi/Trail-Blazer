import React, { useState } from "react";
import TrailBlazerApi from "../api";
import "../styles/forms.css";


const EditTripForm = ({ trip, onClose, onUpdate }) => {
  // Initialize state with the existing trip data
  const [editData, setEditData] = useState({ ...trip });

  // Handles input changes for all fields 
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  // Handles form submission to update the trip 
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedTrip = await TrailBlazerApi.updateTrip(trip.trip_id, editData);
      onUpdate(updatedTrip); // Pass updated trip data to parent component
      onClose(); // Close form after saving
    } catch (err) {
      console.error("Error updating trip:", err);
    }
  };

  return (
    <div className="edit-trip-form-container"> 
      <form className="form-container" onSubmit={handleEditSubmit}> {/* Shared form styling */}
        <h1>Edit Trip</h1>

        <div className="FormInput">
          <label>Trip Name</label>
          <input
            type="text"
            name="trip_name"
            value={editData.trip_name}
            onChange={handleEditChange}
            required
          />
        </div>

        <div className="FormInput">
          <label>Start Date</label>
          <input
            type="date"
            name="start_date"
            value={editData.start_date}
            onChange={handleEditChange}
            required
          />
        </div>

        <div className="FormInput">
          <label>End Date</label>
          <input
            type="date"
            name="end_date"
            value={editData.end_date}
            onChange={handleEditChange}
            required
          />
        </div>

        <div className="FormInput">
          <label>City</label>
          <input
            type="text"
            name="location_city"
            value={editData.location_city}
            onChange={handleEditChange}
            required
          />
        </div>

        <div className="FormInput">
          <label>Country</label>
          <input
            type="text"
            name="location_country"
            value={editData.location_country}
            onChange={handleEditChange}
            required
          />
        </div>

        <div className="FormInput">
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
        <div className="FormButtonGroup">
          <button className="FormButton" type="submit">Save</button>
          <button className="CancelButton" type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditTripForm;