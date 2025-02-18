import React, { useContext } from "react";
import { Link } from "react-router-dom";

// Import icons for the navbar
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";

import CurrentUserContext from "../context/CurrentUserContext";
import "../styles/Navbar.css";

const Navbar = ({ logOutUser }) => {
  const { currentUser } = useContext(CurrentUserContext); // Get logged-in user from context

  return (
    <nav className="navbar">
      {/* Logo Section */}
      <div className="navbar-logo">
        <Link to="/">
          <img
            src={require("../assets/Logo.png")}
            alt="Trail Blazer Logo"
            className="navbar-logo-img"
          />
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="navbar-links">
        {currentUser ? (
          <>
            {/* Plan a Trip Link */}
            <Link to="/plan-trip" className="nav-link">
              <FontAwesomeIcon icon={faPenToSquare} className="nav-icon" />
              Plan a Trip
            </Link>

            {/* My Trips Link */}
            <Link to="/my-trips" className="nav-link">
              <FontAwesomeIcon icon={faPlane} className="nav-icon" />
              My Trips
            </Link>

            {/* Logout Button */}
            <button onClick={logOutUser} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            {/* Sign Up & Log In Links */}
            <Link to="/signup" className="nav-link">Sign Up</Link>
            <Link to="/login" className="nav-link">Log In</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
