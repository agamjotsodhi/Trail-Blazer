import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";
import "../styles/Buttons.css";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Left Content */}
      <div className="landing-content">
        <h1 className="landing-title">Welcome to Trail Blazer</h1>
        <p className="landing-description">
        Plan your Trips with ease with AI integrated Itineraries, trip weather forecasts, and destination facts 
        </p>
        <div className="landing-buttons">
          <button onClick={() => navigate("/signup")} className="btn-one">
            Sign Up
          </button>
          <button onClick={() => navigate("/login")} className="btn-two">
            Login
          </button>
        </div>
      </div>

      {/* Right Side Image */}
      <img src="/assets/Balloon.png" alt="Hot Air Balloon" className="landing-image" />
    </div>
  );
}

export default LandingPage;
