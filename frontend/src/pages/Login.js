import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "../forms/LoginForm";

const Login = ({ setTokenAfterLogin }) => {
  return (
    <div className="login-container">
      <LoginForm setTokenAfterLogin={setTokenAfterLogin} />
      <p className="login-signup-redirect">
        New to Trail Blazer? <Link to="/signup" className="link-primary">Sign up here</Link>
      </p>
    </div>
  );
};

export default Login;
