import React, { useContext } from "react";
import { Link } from "react-router-dom";
import CurrentUserContext from "../context/CurrentUserContext";
import "../styles/Home.css";
import "../styles/Buttons.css"

const Home = () => {
  const { user } = useContext(CurrentUserContext); 

  return (
    <div className="home-container">
      {/* Title */}
      <h1 className="home-title">Welcome, Let's Plan a Trip!</h1>

      {/* Home page image */}
      <img src="/assets/Bus.png" alt="Hot Air Balloon" className="landing-image" />


      {/* Buttons at the bottom */}
      <div className="home-buttons">
        <Link to="/plan-trip">
          <button className="btn-one" id="plan-trip-btn">Plan a Trip</button>
        </Link>
        <Link to="/my-trips">
          <button className="btn-one" id="my-trips-btn">My Trips</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;