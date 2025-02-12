import React from "react";
import { Link } from "react-router-dom";
import SignupForm from "../forms/SignupForm";

const Signup = ({ setTokenAfterRegister }) => {
  return (
    <div className="signup-container">
      <SignupForm setTokenAfterRegister={setTokenAfterRegister} />
      
      <p className="signup-login-redirect">
        Already have an account? <Link to="/login" className="link-primary">Log in here</Link>
      </p>
    </div>
  );
};

export default Signup;
