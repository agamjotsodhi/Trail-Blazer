import React, { useContext } from "react";
import { Link } from "react-router-dom";
import CurrentUserContext from "../context/CurrentUserContext";

const Home = () => {
  const { user } = useContext(CurrentUserContext); 

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome, Let's Plan a Trip!</h1>

      <div className="home-buttons">
        <Link to="/plan-trip">
          <button className="btn-one" id="plan-trip-btn">Plan a Trip</button>
        </Link>
        <Link to="/my-trips">
          <button className="btn-two" id="my-trips-btn">My Trips</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
