import React, { useContext } from "react";
import { Link } from "react-router-dom";
import CurrentUserContext from "../context/CurrentUserContext";
import "../styles/Home.css";
import "../styles/Buttons.css";

const Home = () => {
  const { user } = useContext(CurrentUserContext);

  return (
    <div className="home-container">
      {/* h1 Welcome Message */}
      <h1 className="home-title">Welcome, Let's Plan a Trip!</h1>

      {/* Centered Image */}
      <div className="home-image">
        <img src="/assets/Home.png" alt="Home page image, airplane flying around globe" />
      </div>

      {/* Button Container with Box Styling */}
      <div className="home-buttons-container">
        <div className="home-buttons">
          <Link to="/plan-trip">
            <button className="btn-primary">Plan a Trip</button>
          </Link>
          <Link to="/my-trips">
            <button className="btn-primary">My Trips</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
