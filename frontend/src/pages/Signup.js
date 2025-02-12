import React from "react";
import SignupForm from "../forms/SignupForm";
import "../styles/Signup.css";
import "../styles/forms.css";

const Signup = ({ setTokenAfterRegister }) => {
  return (
    <div className="signup-container">
      <SignupForm setTokenAfterRegister={setTokenAfterRegister} />
    </div>
  );
};

export default Signup;
