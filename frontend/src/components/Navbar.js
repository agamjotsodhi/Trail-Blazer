import React, { useContext } from "react";
import { Link } from "react-router-dom";
import CurrentUserContext from "../context/CurrentUserContext";
import "../styles/Navbar.css";


const Navbar = ({ logOutUser }) => {
  const { currentUser } = useContext(CurrentUserContext); // Get the logged-in user from context

  return (
    <nav className="navbar"> {/* Main Navbar container */}
      <div className="navbar-logo">
        <Link to="/" className="navbar-brand">Home</Link>
      </div>

      <div className="navbar-links">
        {currentUser ? ( // If user is logged in, show trip-related links:
          <>
            <Link to="/plan-trip" className="nav-link">Plan a Trip</Link>
            <Link to="/my-trips" className="nav-link">My Trips</Link>
            <button onClick={logOutUser} className="logout-btn">Logout</button>
          </>
        ) : ( // If no user, show signup and login options:
          <>
            <Link to="/signup" className="nav-link">Sign Up</Link>
            <Link to="/login" className="nav-link">Log In</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
