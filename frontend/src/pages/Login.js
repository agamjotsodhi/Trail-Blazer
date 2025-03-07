import React from "react";
import LoginForm from "../forms/LoginForm";
import "../styles/Login.css";

const Login = ({ setTokenAfterLogin }) => {
  return (
    <div className="login-container">
      <LoginForm setTokenAfterLogin={setTokenAfterLogin} />
    </div>
  );
};

export default Login;