import React, { useState } from "react";
import Select from "react-select";
import { Country, City } from "country-state-city"; // Import country & city functions from library
import { useNavigate } from "react-router-dom";
import "../styles/forms.css";
import "../styles/PlanTrip.css";

const PlanTripForm = ({ createTrip }) => {
  const today = new Date().toISOString().split("T")[0];

  // Convert country data into react-select format
  const countryOptions = Country.getAllCountries().map((country) => ({
    value: country.isoCode,
    label: country.name,
  }));

  const [tripData, setTripData] = useState({
    trip_name: "",
    start_date: today,
    end_date: "",
    location_city: "",
    location_country: null,
    interests: "",
  });

  const [cityOptions, setCityOptions] = useState([]);

  const navigate = useNavigate();

  const handleCountryChange = (selectedOption) => {
    setTripData({ ...tripData, location_country: selectedOption.value });

    // Fetch cities based on selected country
    const cities = City.getCitiesOfCountry(selectedOption.value).map((city) => ({
      value: city.name,
      label: city.name,
    }));

    setCityOptions(cities);
  };

  const handleCityChange = (selectedOption) => {
    setTripData({ ...tripData, location_city: selectedOption.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newTrip = await createTrip(tripData);
      navigate(`/trips/${newTrip.trip_id}`);
    } catch (err) {
      console.error("Error creating trip:", err);
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
            onChange={(e) => setTripData({ ...tripData, trip_name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Start Date</label>
          <input
            type="date"
            name="start_date"
            value={tripData.start_date}
            onChange={(e) => setTripData({ ...tripData, start_date: e.target.value })}
            required
            min={today}
          />
        </div>

        <div className="form-group">
          <label>End Date</label>
          <input
            type="date"
            name="end_date"
            value={tripData.end_date}
            onChange={(e) => setTripData({ ...tripData, end_date: e.target.value })}
            required
            min={tripData.start_date || today}
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
          <Select
            name="location_city"
            options={cityOptions}
            value={cityOptions.find((option) => option.value === tripData.location_city)}
            onChange={handleCityChange}
            placeholder="Select a city"
            isDisabled={!tripData.location_country}
          />
        </div>

        <div className="form-group">
          <label>Interests</label>
          <input
            type="text"
            name="interests"
            placeholder="e.g. Museums, Hiking, Beaches"
            value={tripData.interests}
            onChange={(e) => setTripData({ ...tripData, interests: e.target.value })}
          />
        </div>

        <button className="form-button" type="submit">
          Create Trip
        </button>
      </form>
    </div>
  );
};

export default PlanTripForm;
