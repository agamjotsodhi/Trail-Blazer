import { useContext } from "react";
import CurrentUserContext from "../context/CurrentUserContext";
import { Navigate } from "react-router-dom";

const RequireAuth = ({ children }) => {
  const { currentUser, token } = useContext(CurrentUserContext);

  console.log("RequireAuth Check:", { currentUser, token });

  // If token exists but user is not loaded yet, wait instead of redirecting
  if (token && !currentUser) {
    return <p>Loading...</p>; // Will be replaced by Loading.js
  }

  // If no user and no token, redirect to login
  if (!token || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If user exists, allow access
  return children;
};

export default RequireAuth;