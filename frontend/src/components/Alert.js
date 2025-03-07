// Alert.js
// Sets alert for error display messages 
import React from "react";
import { Alert as BootstrapAlert } from "reactstrap";

const Alert = ({ type, message }) => {
  if (!message) return null;

  return (
    <BootstrapAlert color={type}>
      {message}
    </BootstrapAlert>
  );
};

export default Alert;
