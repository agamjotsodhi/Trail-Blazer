import React from "react";
import { useNavigate } from "react-router-dom";
import PlanTripForm from "../forms/PlanTripForm";
import TrailBlazerApi from "../api";

const PlanTrip = () => {
  const navigate = useNavigate();

  const createTrip = async (tripData) => {
    try {
      const newTrip = await TrailBlazerApi.createTrip(tripData);
      if (newTrip && newTrip.trip_id) {
        navigate(`/trips/${newTrip.trip_id}`);
      } else {
        console.error("Error: Trip creation failed.");
      }
    } catch (error) {
      console.error("[PlanTrip] Failed to create trip:", error);
    }
  };

  return (
    <div className="plan-trip-container">
      <PlanTripForm createTrip={createTrip} />
    </div>
  );
};

export default PlanTrip;
