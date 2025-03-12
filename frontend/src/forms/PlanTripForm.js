import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select"; // Import react-select for dropdowns
import { Country, City } from "country-state-city"; // Import country & city functions
import "../styles/forms.css";
import "../styles/PlanTrip.css";

const PlanTripForm = ({ createTrip }) => {
  const today = new Date().toISOString().split("T")[0];

  const [tripData, setTripData] = useState({
    trip_name: "",
    start_date: today,
    end_date: "",
    location_country: "",
    location_city: "",
    interests: "",
  });

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const countryList = Country.getAllCountries().map((country) => ({
      value: country.isoCode,
      label: country.name,
    }));
    setCountries(countryList);
  }, []);

  // Handle Country Selection
  const handleCountryChange = (selectedOption) => {
    const countryName = selectedOption ? selectedOption.label : "";
    setTripData((prevData) => ({
      ...prevData,
      location_country: countryName,
      location_city: "",
    }));

    // Fetch cities based on selected country or reset cities if cleared
    if (selectedOption) {
      const cityList = City.getCitiesOfCountry(selectedOption.value).map((city) => ({
        value: city.name,
        label: city.name,
      }));
      setCities(cityList);
    } else {
      setCities([]); // Clear city list if country is cleared
    }
  };

  // Handle City Selection
  const handleCityChange = (selectedOption) => {
    const cityName = selectedOption ? selectedOption.label : "";
    setTripData((prevData) => ({
      ...prevData,
      location_city: cityName,
    }));
  };

  const handleChange = (e) => {
    setTripData({ ...tripData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const newTrip = await createTrip(tripData);
      setMessage(`Trip "${newTrip.trip_name}" successfully created!`);
      navigate(`/trips/${newTrip.trip_id}`);
    } catch (err) {
      console.error("Error creating trip:", err);
      setMessage("Failed to create trip.");
      setIsSubmitting(false);
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
            min={today}
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
            min={tripData.start_date || today}
          />
        </div>

        {/* Country - Autocomplete Dropdown */}
        <div className="form-group">
          <label>Country</label>
          <Select
            options={countries}
            onChange={handleCountryChange}
            placeholder="Select a country"
            isClearable
          />
        </div>

        {/* City - Autocomplete Dropdown */}
        <div className="form-group">
          <label>City</label>
          <Select
            options={cities}
            onChange={handleCityChange}
            placeholder="Select a city"
            isClearable
            isDisabled={!tripData.location_country} // Disable until a country is selected
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

        {message && <p className="form-message">{message}</p>}
      </form>
    </div>
  );
};

export default PlanTripForm;
